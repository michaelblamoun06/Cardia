(() => {
'use strict';
const $=q=>document.querySelector(q), $$=q=>Array.from(document.querySelectorAll(q));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rootURL='https://openstax.org/books/anatomy-and-physiology-2e/pages/';
const sceneMap={
 heart:{title:'Human heart',short:'Heart',system:'Cardiovascular',region:'Thorax',root:'heart',build:buildHeart,items:heartStructures,labels:[['superior-vena-cava','Superior vena cava',-1,-.18],['aorta','Aorta',1,-.26],['left-ventricle','Left ventricle',1,.15]]},
 vessels:{title:'Systemic vessels',short:'Blood vessels',system:'Cardiovascular',region:'Whole body',root:'systemic-vessels',build:buildVessels,items:vesselStructures,labels:[['common-carotid-artery','Common carotid',-1,-.12],['renal-artery','Renal artery',1,-.06],['femoral-vein','Femoral vein',1,.15]]},
 lungs:{title:'Lungs & airways',short:'Lungs & airways',system:'Pulmonary',region:'Thorax',root:'lungs',build:buildLungs,items:lungStructures,labels:[['trachea','Trachea',1,-.16],['right-main-bronchus','Right main bronchus',-1,-.04],['diaphragm','Diaphragm',1,.05]]},
 alveoli:{title:'Alveolar cluster',short:'Alveoli',system:'Pulmonary',region:'Lung microanatomy',root:'alveoli',build:buildAlveoli,items:alveoliStructures,labels:[['terminal-bronchiole','Terminal bronchiole',-1,-.08],['alveolar-capillaries','Capillary bed',1,.02],['alveolar-sac','Alveolar sac',-1,.06]]}
};
Object.assign(sceneMap,referenceSceneDefinitions());
for(const s of Object.values(sceneMap))s.byId=new Map(s.items.map(e=>[e.id,e]));
const all=Object.entries(sceneMap).flatMap(([scene,s])=>s.items.map(e=>({...e,scene})));
const swatches={tissue:'#cc8b7d',arteries:'#dd6a58',veins:'#6988b5',airways:'#79a29a',bones:'#d8ceb2',skin:'#cfad95'};
function structureColor(e){
 if(e.layer==='arteries' && /pulmonary|segmental-artery|arteriole/.test(e.id))return '#6988b5';
 if(e.layer==='veins' && /pulmonary|venule/.test(e.id))return '#dd6a58';
 return swatches[e.layer];
}
const layerNames={tissue:'Organ tissue',arteries:'Arteries',veins:'Veins',airways:'Airways',bones:'Skeletal landmarks',skin:'Skin outline'};
const qFilters=['All models','Heart','Blood vessels','Lungs & airways','Alveoli'];
const records={heart:cardiacDossiers,vessels:vascularDossiers,lungs:lungDossiers,alveoli:alveoliDossiers};
const record=(sc,e)=>e.record||records[sc]?.[e.id]||{};
let loadTicket=0,pendingScene=null,readingTab='overview';
const preferred={heart:'ref-heart',vessels:'bp-thorax',lungs:'ref-lungs',alveoli:'alveoli'};
let lastRegion='bp-thorax',collection='All representations',regionFilter='';
const state={page:'explorer',scene:'heart',id:'heart',labels:true,pan:false,filter:'All models',query:'',tour:null,mask:{tissue:true,arteries:true,veins:true,airways:true,bones:false,skin:false},quiz:null,quizFilter:'Mixed systems'};
function cached(k,fallback){try{return JSON.parse(localStorage.getItem(k))??fallback}catch{return fallback}}
let saved=cached('cardia-saved-v1',[]);if(!Array.isArray(saved))saved=[];
saved=saved.filter(item=>item&&sceneMap[item.scene]?.byId.has(item.id));
function persistSaves(){try{localStorage.setItem('cardia-saved-v1',JSON.stringify(saved))}catch{}}
const scene=()=>sceneMap[state.scene], selected=()=>scene().byId.get(state.id);
const isSaved=(sc,id)=>saved.some(x=>x.scene===sc&&x.id===id);
function say(t){$('#announce').textContent=t}
const viewer=new AtlasViewer($('#model'),{onPick:id=>{if(scene().byId.has(id)){state.tour=null;renderTour();select(id)}},onChange:updatePins});
function layers(){
 const available=new Set(scene().items.map(x=>x.layer));
 if(state.scene.startsWith('bp-')){available.delete('tissue');for(const k of ['bones','skin'])if([...viewer.scene.layers.values()].includes(k))available.add(k)}
 $('#layers').innerHTML=['arteries','veins','airways','tissue','bones','skin'].filter(k=>available.has(k)).map(k=>'<button class="layer-row" role="switch" aria-checked="'+state.mask[k]+'" data-layer="'+k+'"><span class="color-dot" style="--swatch:'+(scene().system==='Pulmonary'&&k==='arteries'?swatches.veins:scene().system==='Pulmonary'&&k==='veins'?swatches.arteries:swatches[k])+'"></span>'+layerNames[k]+'<span class="switch" aria-hidden="true"></span></button>').join('');
}
function loadScene(sc,id=sceneMap[sc].root,view,focus=false){
 const ticket=++loadTicket, target=sceneMap[sc];pendingScene=null;
 $('#model-status').hidden=true;
 if(target.isRef&&!target.build){
  pendingScene=sc;
  $('#model-status').textContent='Loading reference geometry…';$('#model-status').hidden=false;
  getReferenceBuilder(sc).then(builder=>sc.startsWith('bp-')?getCardiaContextBuilder(sc,builder).catch(()=>builder):builder).then(builder=>{
   target.build=builder;
   if(ticket===loadTicket)loadScene(sc,id,view,focus);
  }).catch(()=>{
   if(ticket!==loadTicket)return;
   $('#model-status').innerHTML='Reference model could not load. <button data-retry="'+esc(sc)+'" data-part="'+esc(id)+'">Retry</button> <button data-action="dismiss-status">Dismiss</button>';
  });
  return;
 }
 const changed=sc!==state.scene||!viewer.scene;
 state.scene=sc;state.id=id;
 if(changed)readingTab='overview';
 if(sc.startsWith('bp-'))lastRegion=sc;
 if(changed){state.mask={tissue:true,arteries:true,veins:true,airways:true,bones:false,skin:false};viewer.setScene(scene().build);viewer.setLayers(state.mask);state.pan=false;viewer.setPanMode(false)}
 if(view)viewer.setView(view);
 $('.drag-hint').innerHTML=icon('mouse')+'Drag to '+(state.pan?'pan':'rotate');
 $('#stage-title').textContent=scene().title;$('.model-btn.active')?.classList.remove('active');$('.model-btn[data-scene="'+(scene().base||sc)+'"]').classList.add('active');$$('.model-btn').forEach(el=>el.setAttribute('aria-pressed',el.dataset.scene===(scene().base||sc)));$('.tool[data-action="orbit"]').classList.toggle('active',!state.pan);$('.tool[data-action="pan"]').classList.toggle('active',state.pan);
 sourceBar();layers();select(id);window.refreshCardiaViews?.();
 $('.open-sections span').textContent=(target.base||sc)==='lungs'||sc==='alveoli'?'Lung slices':'Heart slices';
 if(focus&&target.isRef&&id!==target.root){viewer.isolate(true);details()}
 say(scene().title+' model loaded.');
}
function select(id){
 const s=scene().byId.get(id);if(!s)return;
 state.id=id;if(!state.mask[s.layer]){state.mask[s.layer]=true;viewer.setLayers(state.mask);layers()}
 viewer.select(id);details();refreshPins();say(s.name+' selected.');
}
const dButton=(id,extra='')=>{const x=scene().byId.get(id);return x?'<button class="related" data-select="'+esc(id)+'"><span class="color-dot" style="--swatch:'+structureColor(x)+'"></span>'+esc(x.name)+icon('chevron')+extra+'</button>':''};
const paragraphs=value=>(Array.isArray(value)?value:[value]).filter(Boolean).map(v=>'<p class="record-text">'+esc(v)+'</p>').join('');
function links(refs=[]){return refs.filter(x=>x?.title&&/^https?:/.test(x.url)).map(x=>'<a class="source-link" href="'+esc(x.url)+'" target="_blank" rel="noopener">'+esc(x.title)+' '+icon('external')+'</a>').join('')}
function sourceBar(){
 const m=scene(),base=m.base||state.scene,usable=base!=='alveoli';
 const chosen=m.isRef?'reference':'teaching';
 const target=base==='vessels'?lastRegion:'ref-'+base;
 $('#model-sourcebar').innerHTML=usable?'<div class="edition-tabs" aria-label="Model representation"><button data-edition="'+target+'" aria-pressed="'+(chosen==='reference')+'">'+icon('cube')+'Reference</button><button data-edition="'+base+'" aria-pressed="'+(chosen==='teaching')+'">'+icon('layers')+'Teaching</button></div>'+(base==='vessels'&&m.isRef?'<label class="region-picker"><span class="sr-only">Vascular region</span><select id="region-picker">'+Object.entries(referenceRegions).filter(([k])=>k.startsWith('bp-')).map(([k,v])=>'<option value="'+k+'" '+(state.scene===k?'selected':'')+'>'+esc(v[2])+'</option>').join('')+'</select></label>':'<button class="model-source-link" data-action="source-info">'+icon('info')+esc(m.sourceGroup||'Model notes')+'</button>'):'<span class="micro-caption">'+icon('layers')+'Enlarged microanatomy</span><button class="model-source-link" data-action="source-info">'+icon('info')+'Model notes</button>';
 $('#reveal').hidden=!['ref-heart','ref-lungs'].includes(state.scene);
 $('#reveal').setAttribute('aria-pressed',!!viewer.reveal);
 $('#reveal').title=state.scene==='ref-heart'?'Remove chamber walls to examine valves and papillary muscles':'Remove lung segments to examine the bronchial tree';
 $('.stage-info .live').innerHTML='<span></span>'+(m.isRef?'REFERENCE GEOMETRY':'TEACHING MODEL');
}
function sourcesFor(m,e){
 const keys=e.geometry?[e.geometry.origin]:m.origins||[];
 return keys.map(k=>{const a=atlasSources[k];return '<div class="dataset-note"><strong>'+esc(a.title)+' · '+esc(a.version)+'</strong>'+paragraphs(a.creators.join(', ')+' · '+a.publisher)+links([{title:'Dataset record',url:a.url},{title:'Publication or DOI',url:a.doi}])+'</div>'}).join('');
}
function sourceInfo(){
 const m=scene(),e=selected();
 const methods=m.isRef?(state.scene.startsWith('bp-')?'BodyParts3D places vessels in a common adult male anatomical framework derived from MRI and anatomical modeling. This view uses the publisher’s reduced-polygon release. Each region contains complete source elements assigned to that region.':'The Human Reference Atlas meshes use the published Visible Human Male coordinate system. Parts retain their relative positions within that common frame. Heart and lung views include the relevant proximal vessels from the registered vasculature dataset.'):'This is an original teaching reconstruction of representative anatomy. Branch geometry and microscopic dimensions are illustrative.';
 showDialog('Geometry & provenance',paragraphs(methods)+(m.isRef?'<h3>Display adaptations</h3>'+paragraphs('Cardia applies a uniform display scale, recenters each regional view, and assigns teaching colors. Vertex coordinates are quantized for transport. Triangle connectivity is retained. Labels point to surface vertices, and isolated structures keep their original shape.'):'')+
 sourcesFor(m,e)+(e.geometry?'<h3>Source elements</h3>'+paragraphs(e.geometry.nodes.join(', '))+paragraphs(e.geometry.ontology||'Ontology mapping withheld owing to a source inconsistency.'):'')+
 (m.isRef?'<p class="record-text">Geometry is distributed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>. '+(state.scene.startsWith('bp-')?'BodyParts3D, © The Database Center for Life Science, licensed under CC Attribution 4.0 International. Cardia simplified and cropped the regional skeletal and skin landmarks.':'Source review and attribution apply to the publisher’s datasets. Cardia’s annotations and displays are separate educational adaptations.')+'</p>':'')+'<button class="outline" data-action="references">'+icon('book')+'Atlas coverage & references</button>');
}
function recordBody(e,sc=state.scene){
 const r=record(sc,e),m=sceneMap[sc];
 const related=(e.related||[]).filter(k=>m.byId.has(k));
 const geometry=e.geometry;
 return '<p class="record-sub">'+esc(e.latin||m.region)+'</p>'+paragraphs(e.summary)+'<h3>Anatomical course</h3>'+paragraphs(r.course||e.location)+'<h3>Physiology</h3>'+paragraphs(r.physiology||e.role)+'<h3>Relationships</h3>'+paragraphs(r.relationship||e.role)+(r.variation?'<h3>Variation & interpretation</h3>'+paragraphs(r.variation):'')+(geometry?'<h3>Geometry record</h3>'+paragraphs((atlasSources[geometry.origin]?.title||'')+' · '+(atlasSources[geometry.origin]?.version||''))+paragraphs(geometry.nodes.join(', '))+(geometry.ontology?paragraphs(geometry.ontology):''):'')+'<h3>Sources</h3>'+links(r.sources)+(geometry?links([{title:'Source geometry and attribution',url:atlasSources[geometry.origin].url}]):'')+(related.length?'<h3>Related structures</h3>'+related.map(id=>entryRow(m.byId.get(id),sc)).join(''):'');
}
function details(){
 const e=selected();if(!e)return;
 const m=scene(),r=record(state.scene,e),root=e.id===m.root,marked=isSaved(state.scene,e.id);
 const sideTab=(id,label)=>'<button data-record-tab="'+id+'" aria-pressed="'+(readingTab===id)+'">'+label+'</button>';
 const other=r.counterpart||e.counterpart;
 const readAll='<button class="detail-more" data-action="read-structure">'+icon('book')+'Full structure record'+icon('chevron')+'</button>';
 const actions=(root?'':'<button class="isolate-btn" data-action="isolate" aria-pressed="'+!!viewer.isolated+'">'+icon('target')+'<span>'+(viewer.isolated?'Show whole model':'Isolate structure')+'</span></button>');
 let content;
 if(readingTab==='physiology')content='<h4>Function & mechanism</h4>'+paragraphs(r.physiology||e.role)+readAll;
 else if(readingTab==='anatomy')content='<h4>Course & relationships</h4>'+paragraphs(r.course||e.location)+paragraphs(r.relationship||e.role)+(r.variation?'<h4>Variation</h4>'+paragraphs(r.variation):'')+readAll;
 else content=paragraphs(e.summary)+'<div class="record-actions">'+actions+readAll+'</div><div class="detail-section"><h4>'+icon('flow')+(root?'Explore structures':'Related anatomy')+'</h4>'+e.related.slice(0,3).map(id=>dButton(id)).join('')+(other&&sceneMap[other.scene]?.byId.has(other.id)?'<button class="related" data-open="'+esc(other.scene)+'|'+esc(other.id)+'">'+icon('layers')+'See teaching anatomy'+icon('chevron')+'</button>':'')+'<button class="detail-more" data-action="browse-model">Browse this model'+icon('chevron')+'</button></div>';
 $('#detail').innerHTML='<div class="detail-lead"><div class="entity-top"><span class="category '+(m.system==='Pulmonary'?'lung':'')+'">'+m.system+'</span><button class="save-entity ghost '+(marked?'saved-item':'')+'" data-action="save" aria-pressed="'+marked+'" title="Bookmark structure" aria-label="'+(marked?'Unsave ':'Save ')+esc(e.name)+'">'+icon('bookmark')+'</button></div><h3 class="entity-title">'+esc(e.name)+'</h3><p class="latin">'+esc(e.latin||e.type)+'</p></div><div class="record-tabs">'+sideTab('overview','Overview')+sideTab('anatomy','Anatomy')+sideTab('physiology','Physiology')+'</div><div class="record-pane">'+content+'</div>';
 $('#detail').scrollTop=0;$('.saved-count').textContent=saved.length;
}
let pinRecords=[];
function refreshPins(){
 const s=scene(),items=state.id===s.root?s.labels:[[state.id,s.byId.get(state.id)?.name||'',1,.04]];
 pinRecords=items.filter(([id])=>state.mask[s.byId.get(id)?.layer]&&state.labels);
 $('.callout-labels').innerHTML=pinRecords.map(([id,name])=>'<button class="callout" data-select="'+esc(id)+'">'+esc(name)+'</button>').join('');
 $('.callout-lines').innerHTML=pinRecords.map(()=>'<g><path/><circle r="3"/></g>').join('');updatePins();
}
function updatePins(){
 if(!viewer||state.page!=='explorer')return;
 const solo=$('[data-action="isolate"]');if(solo){solo.setAttribute('aria-pressed',!!viewer.isolated);solo.lastChild.textContent=viewer.isolated?'Show whole model':'Isolate structure'}
 const view=viewer.getView();$('#orientation').value=['Anterior','Posterior','Right lateral','Left lateral','Superior','Inferior'].includes(view)?view:'Oblique';
 const wrap=$('#canvas-wrap'),w=wrap.clientWidth,h=wrap.clientHeight;
 if(!w||!h)return;
 const btns=$$('.callout'),groups=$$('.callout-lines g');
 let occupied=[];
 pinRecords.forEach(([id,name,side,delta],i)=>{
  const p=viewer.project(id),btn=btns[i],g=groups[i];if(!btn||!g)return;
  const visible=!!p&&p.x>6&&p.x<w-6&&p.y>7&&p.y<h-7&&state.labels&&state.mask[scene().byId.get(id)?.layer];
  btn.hidden=!visible;g.style.display=visible?'':'none';if(!visible)return;
  if(pinRecords.length===1)side=p.x>w*.54?-1:1;
  const bw=btn.offsetWidth,bh=btn.offsetHeight,margin=Math.max(9,w*.04);
  const distance=w<440?w*.10:w*.13;
  let tx=side<0?Math.min(w*.22-bw*.5,p.x-distance-bw):Math.max(w*.76-bw*.35,p.x+distance);
  tx=Math.max(margin,Math.min(w-bw-margin,tx));
  let ty=Math.max(58,Math.min(h-55-bh,p.y+h*delta-bh/2));
  for(const old of occupied){if(Math.abs(ty-old.y)<bh+8 && tx<old.x+old.w+8&&tx+bw>old.x-8)ty=Math.min(h-50-bh,old.y+bh+9)}
  occupied.push({x:tx,y:ty,w:bw});
  btn.style.transform='translate('+Math.round(tx)+'px,'+Math.round(ty)+'px)';
  const end=side<0?tx+bw:tx,ey=ty+bh/2,bend=end-side*Math.min(20,w*.04);
  g.firstElementChild.setAttribute('d','M'+p.x.toFixed(1)+' '+p.y.toFixed(1)+' L'+bend.toFixed(1)+' '+ey.toFixed(1)+' H'+end.toFixed(1));
  g.lastElementChild.setAttribute('cx',p.x);g.lastElementChild.setAttribute('cy',p.y);
 });
}
function circuitArt(kind){
 const frame='<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><g stroke="currentColor" opacity=".10" stroke-width=".55"><path d="M0 12h80M0 28h80M0 44h80M0 60h80M12 0v80M28 0v80M44 0v80M60 0v80"/></g>';
 if(kind==='tree')return frame+'<g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M38 7v17c0 8-8 11-12 17l-7 12M43 7v17c0 8 8 11 12 17l7 12" stroke-width="3"/><path d="M38 13h5m-5 5h5m-5 5h5m-13 14-10 3-5 7m12-5 2 11-4 11m-6-12-7 6m15-5 6 5m18-20 10 2 7 7m-12-4-1 11 5 12m5-12 7 6m-16-3-6 5" stroke-width="2"/><path d="m21 40-5-2m9 26-4 5m2-11-5 3m-5-4-3 4m16-7 5 7m20-23 4-4m9 11 5-1m-7 16 5 4m-14-10-5 5m24 0 3 4M39 30l-5 12m9-10 3 12" stroke-width="1.2"/></g></svg>';
 if(kind==='vessel')return frame+'<g stroke-linecap="round"><path d="M21 83c26-21 16-40 34-64L65-1" stroke="currentColor" stroke-width="9"/><path d="M34 81c22-26 11-44 26-61l15-21" stroke="var(--a-2)" stroke-width="5"/><path d="M40 55 28 43 13 40m30 4L26 22m26 5-3-18m-15 57-19-3-8 8m41-23 17-9 8-12m-22 29 17 4 8 10" stroke="currentColor" stroke-width="4"/><path d="m28 43-2-10m-1-9-11-5m38 12 10 2m-15 23 10 8m8-25 8 1M38 53c4-13 4-23 14-34" stroke="var(--a-2)" stroke-width="2"/></g></svg>';
 return frame+'<g stroke-linejoin="round" stroke-linecap="round"><path d="M37 66C24 62 16 51 17 37c1-11 9-16 16-15 2-6 0-12-3-16m7 58c12-4 23-13 25-25 2-9-2-18-9-21" stroke="currentColor" stroke-width="3.3"/><path d="M26 28c5-5 11-3 15 1l8-12 11-6m-18 17c-2-8-1-16 2-23m2 12 7-10M22 39c4-2 10-1 15 2l8-14m-8 14c-7 6-6 15 1 24m-4-19 9 7m0-18 11 4 2 10m-25-9-7 6m16-18-13 1" stroke="var(--a-2)" stroke-width="2.1"/><path d="M19 34c-5 16 8 27 14 30m8-27-5 8m3-3 8 5m-6 7 5 3" stroke="currentColor" stroke-width="1.3"/></g></svg>';
}
function pathCard(p,i){return '<button class="path-card '+p.theme+'" data-tour="'+i+'"><span class="path-art">'+circuitArt(p.art)+'</span><span><h3>'+p.title+'</h3><p>'+p.desc+'</p><span class="path-meta">'+icon('flow')+p.steps.length+' steps</span></span>'+icon('chevron')+'</button>'}
$('#pathway-cards').innerHTML=atlasPaths.slice(0,3).map(pathCard).join('');
const pages=['explorer','sections','clinical','practical','physiology','study','index'];
let studyMode='learn', clinicalMode='cases';
function renderClinicalHub(mode, route=[]){
 clinicalMode=mode==='perfusion'?'perfusion':'cases';
 const el=$('#clinical-page');
 if(!el.children.length){
  el.innerHTML='<header class="pageintro"><div><h1>Clinical imaging</h1><p>Read cardiopulmonary scans and compare regional myocardial perfusion.</p></div></header><div class="workspace-switch" aria-label="Clinical imaging tool"><button data-clinical-mode="cases">Image cases & localization</button><button data-clinical-mode="perfusion">Myocardial perfusion</button></div><div id="cardia-casework"></div><div id="cardia-perfusion" hidden></div>';
 }
 $$('[data-clinical-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.clinicalMode===clinicalMode));
 const cases=$('#cardia-casework'), perfusion=$('#cardia-perfusion');
 cases.hidden=clinicalMode!=='cases';perfusion.hidden=!cases.hidden;
 if(!cases.hidden&&!cases.children.length)renderCardiaClinical(cases);
 if(!perfusion.hidden&&!perfusion.children.length)renderCardiaPerfusion(perfusion);
}
function navigate(page,update=true,route=[]){
 if(!pages.includes(page))page='explorer';
 state.page=page;
 for(const p of pages)$('#'+p+'-page').hidden=p!==page;
 $$('.workspace-nav [data-page]').forEach(a=>{a.classList.toggle('active',a.dataset.page===page);if(a.dataset.page===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 if(update&&location.hash!=='#'+page)history.pushState(null,'','#'+page);
 if(page==='physiology'&&!$('#physiology-page').children.length)renderPhysiologyLab($('#physiology-page'));
 if(page==='practical'&&!$('#practical-page').children.length)renderCardiaPractical($('#practical-page'));
 if(page==='sections'){
  const opt={};if(route[0])opt.organ=route[0];if(route[1])opt.plane=route[1];if(route[2]!==undefined&&route[2]!=='')opt.depth=Number(route[2]);
  if(!$('#sections-page').children.length)renderCardiaSections($('#sections-page'),opt);
  else if(route.length)window.openCardiaSection?.(opt);
 }
 if(page==='clinical')renderClinicalHub(route[0]||clinicalMode,route);
 if(page==='index')renderIndex();
 if(page==='study'){
  if(route[0])studyMode=route[0]==='quiz'?'quiz':'learn';
  renderStudy();
  if(route[0]&&route[0]!=='quiz')window.openCardiaLearningTool?.(route[0]==='lesson'?'lessons':route[0],route[1]);
 }
 if(page==='explorer')viewer.requestDraw();
 window.dispatchEvent(new CustomEvent('cardia:navigate',{detail:{page,route}}));
 window.scrollTo(0,0);
}
function renderIndex(){
 $('#index-page').innerHTML='<header class="pageintro"><div><h1>Structure index</h1><p>Search anatomical names, Latin terms, regions, or functions. Select an entry to find it in 3D.</p></div></header><div class="index-tools"><label class="searchbox">'+icon('search')+'<input type="search" id="structure-search" placeholder="Search structures…" aria-label="Search structures" value="'+esc(state.query)+'"></label><div class="filterbar">'+qFilters.map(f=>'<button data-filter="'+esc(f)+'" class="tag-btn '+(f===state.filter?'active':'')+'" aria-pressed="'+(f===state.filter)+'">'+f+'</button>').join('')+'</div></div><p class="resultcount" id="result-count" aria-live="polite"></p><div class="index-results" id="results"></div>';const toolbar=document.createElement('div');toolbar.className='index-collection';
 toolbar.innerHTML='<label>Representation <select class="select-control" id="collection">'+['All representations','Teaching','Human Reference Atlas','BodyParts3D'].map(k=>'<option '+(k===collection?'selected':'')+'>'+k+'</option>').join('')+'</select></label>'+(regionFilter?'<button class="tag-btn" data-action="clear-region">'+esc(sceneMap[regionFilter].title)+' '+icon('x')+'</button>':'');
 $('.index-tools').after(toolbar);
 indexResults();
}
function entryRow(e,sc){return '<button class="index-row" data-open="'+sc+'|'+esc(e.id)+'"><span class="color-dot" style="--swatch:'+structureColor(e)+'"></span><span><strong>'+esc(e.name)+'</strong><small>'+(sceneMap[sc].sourceGroup||'Teaching')+' · '+esc(sceneMap[sc].region)+' · '+esc(e.type)+'</small></span>'+icon('chevron')+'</button>'}
function indexResults(){
 const n=v=>String(v??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''),q=n(state.query.trim());
 const coll=x=>sceneMap[x.scene].sourceGroup||'Teaching';
 const results=all.filter(x=>(!regionFilter||x.scene===regionFilter)&&(collection==='All representations'||coll(x)===collection)&&(state.filter==='All models'||sceneMap[x.scene].short===state.filter)&&[x.name,x.latin,x.type,x.location,x.role,x.summary,x.geometry?.ontology,(x.geometry?.nodes||[]).join(' ')].some(t=>n(t).includes(q))).sort((a,b)=>a.name.localeCompare(b.name));
 $('#result-count').textContent=results.length+' model '+(results.length===1?'entry':'entries');
 $('#results').innerHTML=results.length?results.map(x=>entryRow(x,x.scene)).join(''):'<p class="empty">No matching structures. Try another name, region, or representation.</p>';
}
function openEntry(sc,id){if(!sceneMap[sc]?.byId.has(id))return;closeDialog();navigate('explorer');state.tour=null;renderTour();viewer.reset();loadScene(sc,id,undefined,true);if(window.innerWidth<671)document.querySelector('.stage-shell').scrollIntoView({block:'start'})}
function showDialog(title,html){$('#dialog').classList.toggle('wide-record',title===selected()?.name);$('#dialog-title').textContent=title;$('#dialog-body').innerHTML=html;if(!$('#dialog').open)$('#dialog').showModal();$('#dialog').scrollTop=0}
function closeDialog(){if($('#dialog').open)$('#dialog').close()}
function startTour(i){
 const p=atlasPaths[i];if(!p)return;closeDialog();navigate('explorer');state.tour={i,n:0};tourStep();
}
function tourStep(){
 const {i,n}=state.tour,st=atlasPaths[i].steps[n];viewer.reset();loadScene(st.scene,st.id,st.view);renderTour();
 // Keep both the model and its guided annotation in reach on small screens.
 $('#tour').scrollIntoView({behavior:'instant',block:'nearest'});
}
function renderTour(){
 const el=$('#tour');el.hidden=!state.tour;if(!state.tour){el.innerHTML='';return}
 const {i,n}=state.tour,p=atlasPaths[i],st=p.steps[n],e=sceneMap[st.scene].byId.get(st.id);
 el.innerHTML='<div class="tour"><div class="tour-text"><small>'+esc(p.title.toUpperCase())+' · STEP '+(n+1)+' OF '+p.steps.length+'</small><h3>'+esc(e.name)+'</h3><p>'+esc(st.text)+'</p></div><div class="action-row"><button class="outline" data-action="prev-step" '+(n===0?'disabled':'')+'>Back</button><button class="solid" data-action="next-step">'+(n===p.steps.length-1?'Finish pathway':'Next step')+'</button></div><button data-action="end-tour" aria-label="Close pathway" title="Close pathway" class="ghost square">'+icon('x')+'</button></div>';
}
function startQuiz(){
 const pool=atlasQuiz.map((q,i)=>i).filter(i=>state.quizFilter==='Mixed systems'||atlasQuiz[i][0]===state.quizFilter);
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
 state.quiz={items:pool.slice(0,6),n:0,answers:[],done:false};
}
function renderStudy(){
 const host=$('#study-page');
 const header='<header class="pageintro"><div><h1>Study room</h1><p>Study cardiopulmonary anatomy, test your recall, and revisit what you missed.</p></div></header><div class="workspace-switch" aria-label="Study room tools"><button data-study-mode="learn" aria-pressed="'+(studyMode==='learn')+'">Learning library</button><button data-study-mode="quiz" aria-pressed="'+(studyMode==='quiz')+'">Knowledge check</button></div>';
 if(studyMode==='learn'){
  if(!host.querySelector('#cardia-learning')){host.innerHTML=header+'<div id="cardia-learning"></div>';renderCardiaLearning($('#cardia-learning'))}
  return;
 }
 if(!state.quiz)startQuiz();
 const quiz=state.quiz,idx=quiz.items[quiz.n],q=atlasQuiz[idx],answered=quiz.answers.length>quiz.n;
 const score=quiz.answers.filter((ans,i)=>atlasQuiz[quiz.items[i]][3]===ans).length;
 let content;
 if(quiz.done)content='<span class="study-count">KNOWLEDGE CHECK COMPLETE</span><h2>'+score+' of '+quiz.items.length+' correct</h2><p class="entity-text">Revisit the questions below, or start a fresh set.</p>'+quiz.items.map((item,i)=>{const x=atlasQuiz[item],hit=x[3]===quiz.answers[i];return '<div class="detail-section"><h4>'+icon(hit?'check':'x')+esc(x[1])+'</h4><p class="entity-text">'+esc(x[4])+'</p><button class="detail-more" data-open="'+x[5]+'|'+x[6]+'">View structure '+icon('chevron')+'</button></div>'}).join('')+'<div class="action-row"><button class="solid" data-action="new-quiz">New knowledge check</button></div>';
 else content='<div class="progress"><span style="width:'+((quiz.n+(answered?1:0))/quiz.items.length*100)+'%"></span></div><span class="study-count">QUESTION '+(quiz.n+1)+' OF '+quiz.items.length+' · '+esc(q[0].toUpperCase())+'</span><h2>'+esc(q[1])+'</h2>'+q[2].map((a,i)=>'<button class="answer '+(answered?(i===q[3]?'good':i===quiz.answers[quiz.n]?'wrong':''):'')+'" data-answer="'+i+'" '+(answered?'disabled':'')+'><b>'+String.fromCharCode(65+i)+'</b>'+esc(a)+'</button>').join('')+(answered?'<div class="feedback" role="status"><strong>'+(quiz.answers[quiz.n]===q[3]?'Correct.':'Correct answer: '+esc(q[2][q[3]])+'.')+'</strong> '+esc(q[4])+'</div><div class="action-row"><button class="solid" data-action="next-question">'+(quiz.n===quiz.items.length-1?'See results':'Next question')+'</button><button class="outline" data-open="'+q[5]+'|'+q[6]+'">'+icon('cube')+'View structure</button></div>':'');
 host.innerHTML=header+'<div class="study-layout"><div class="study-control"><strong>Knowledge check</strong><select id="quiz-filter" aria-label="Knowledge check topic" class="select-control">'+['Mixed systems','Cardiovascular','Pulmonary'].map(x=>'<option '+(state.quizFilter===x?'selected':'')+'>'+x+'</option>').join('')+'</select></div><div class="quiz-card">'+content+'</div></div>';
}
function modelExpanded(force){
 const shell=$('.stage-shell'),on=force??!shell.classList.contains('expanded');shell.classList.toggle('expanded',on);document.body.classList.toggle('is-expanded',on);const b=$('[data-action="expand"]');b.title=on?'Exit expanded view':'Expand model';b.setAttribute('aria-label',b.title);b.innerHTML=icon(on?'x':'expand');if(on)$('#model').focus({preventScroll:true});viewer.requestDraw();
}
function guide(){
 showDialog('Quick guide','<p>Choose a model from the library, then select a label or a part of the model to learn its name, location, and function.</p><ul class="guide-list"><li><b>Rotate</b><span>Drag with a mouse or one finger, or focus the model and press the arrow keys.</span></li><li><b>Zoom</b><span>Scroll, pinch, or use the magnifying glasses. The <kbd>+</kbd> and <kbd>−</kbd> keys also work.</span></li><li><b>Pan</b><span>Select the hand tool and drag. Use Reset view to return to the starting position.</span></li><li><b>Reveal</b><span>Switch layers off to reveal deeper structures. Select an internal heart structure in the index to view it through the outer wall. Use Isolate structure for an enlarged view of one part.</span></li><li><b>Learn</b><span>Open Sections to cut through a reference model. Clinical imaging has published scans and an interactive perfusion model. Use Practice lab for animated pathway traces and specimen identification, or Study room for lessons, flashcards and quizzes. Bookmarks and learning progress stay in this browser.</span></li></ul><p>Left and right refer to the person in the model. In the anterior view, their left is on your right.</p><button class="outline" data-action="references">'+icon('book')+'Model notes &amp; references</button>');
}
function references(){
 const refs=[['19-1-heart-anatomy','Heart anatomy'],['19-2-cardiac-muscle-and-electrical-activity','Cardiac muscle and electrical activity'],['20-5-circulatory-pathways','Circulatory pathways'],['22-1-organs-and-structures-of-the-respiratory-system','Respiratory structures'],['22-2-the-lungs','Lung anatomy'],['22-4-gas-exchange','Gas exchange']];
 const native=Object.values(atlasMeshes).reduce((a,s)=>a+s.parts.length,0),teaching=Object.values(records).reduce((a,s)=>a+Object.keys(s).length,0);
 showDialog('Atlas coverage & references','<p>Explore '+teaching+' annotated teaching entries and '+native+' selectable reference entries across the heart, lungs, and five vascular regions. Counts refer to entries in views. Paired structures, variants, and repeated representations are identified separately.</p><h3>Geometry collections</h3>'+Object.values(atlasSources).map(s=>'<div class="dataset-note"><strong>'+esc(s.title)+' · '+s.version+'</strong>'+paragraphs(s.creators.join(', '))+links([{title:'Publisher record and license',url:s.url}])+'</div>').join('')+'<h3>Coverage and review</h3>'+paragraphs('Human Reference Atlas organs share one Visible Human Male frame. BodyParts3D uses a separate adult male anatomical framework. The two collections are displayed separately. The procedural models explain branches, tissue layers, and microscopic relationships at teaching scales. Geometry and text in this edition have not undergone independent clinical review.')+paragraphs('Individual branching, drainage, and segment boundaries vary. Some source entries represent sets of branches. Three HRA crosswalk identifiers were withheld where they conflict with the publisher’s node names. Two abdominal BodyParts3D elements classified as a pulmonary branch were excluded pending resolution.')+'<h3>Teaching colors</h3>'+paragraphs('Blue and red indicate relative oxygenation for vessels. They do not indicate vessel wall color. Pulmonary arteries and veins therefore reverse the usual systemic color pattern. Some tissues and airways are given contrasting colors to expose boundaries.')+'<h3>Physiology and anatomy</h3>'+paragraphs('Each structure record links its supporting literature. The physiology lab lists the assumptions for each calculation and diagram.')+refs.map(([u,t])=>links([{title:t,url:rootURL+u}])).join(''));

}
function action(a){
 if(a==='open-sections'){const organ=(scene().base||state.scene)==='lungs'||state.scene==='alveoli'?'lungs':'heart';navigate('sections',true,[organ]);return}
 if(a==='global-search')return atlasUtilities.search();
 if(a==='classroom')return atlasUtilities.classroom();
 if(a==='guide')return guide();if(a==='references')return references();if(a==='close')return closeDialog();
 if(a==='saved')return showDialog('Saved structures',saved.length?saved.map(o=>entryRow(sceneMap[o.scene].byId.get(o.id),o.scene)).join(''):'<p>Your saved list is empty. Select the bookmark in Structure details to keep a structure here.</p>');
 if(a==='save'){const old=isSaved(state.scene,state.id);saved=old?saved.filter(x=>x.scene!==state.scene||x.id!==state.id):[...saved,{scene:state.scene,id:state.id}];persistSaves();details();return say(selected().name+(old?' removed from saved structures.':' saved.'))}
 if(a==='read-structure'){const e=selected();return showDialog(e.name,recordBody(e)+'<div class="record-footer"><button class="outline" data-action="permalink">'+icon('bookmark')+'Link to this structure</button></div>')}
 if(a==='permalink'){
  const url=new URL(location.href);url.hash='explorer/'+state.scene+'/'+state.id;
  showDialog('Link to this structure',paragraphs('This link opens '+selected().name+' in its model. Access follows the site’s sharing settings.')+'<input class="permalink" aria-label="Structure link" readonly value="'+esc(url.href)+'">');
  const field=$('.permalink');field.select();return;
 }
 if(a==='source-info')return sourceInfo();
 if(a==='clear-region'){regionFilter='';return renderIndex()}
 if(a==='browse-model'){state.filter=scene().short;collection=scene().sourceGroup||'Teaching';regionFilter=state.scene;state.query='';return navigate('index')}
 if(a==='dismiss-status'){$('#model-status').hidden=true;return}
 if(a==='reveal'){viewer.reveal=!viewer.reveal;$('#reveal').setAttribute('aria-pressed',viewer.reveal);viewer.requestDraw();window.refreshCardiaViews?.();return}
 if(a==='all-paths')return showDialog('Guided pathways',atlasPaths.map(pathCard).join(''));
 if(a==='expand')return modelExpanded();
 if(a==='isolate'){viewer.isolate(!viewer.isolated);return say(viewer.isolated?'Showing only '+selected().name:'Showing the whole model')}
 if(a==='labels'){state.labels=!state.labels;const el=$('[data-action="labels"]');el.classList.toggle('enabled',state.labels);el.setAttribute('aria-pressed',state.labels);return refreshPins()}
 if(a==='pan'||a==='orbit'){state.pan=a==='pan';viewer.setPanMode(state.pan);$('.tool[data-action="pan"]').classList.toggle('active',state.pan);$('.tool[data-action="orbit"]').classList.toggle('active',!state.pan);$('.drag-hint').innerHTML=icon('mouse')+'Drag to '+(state.pan?'pan':'rotate');return}
 if(a==='zoomin'||a==='zoomout')return viewer.zoomBy(a==='zoomin'?1.2:1/1.2);
 if(a==='reset'){viewer.reset();action('orbit');window.refreshCardiaViews?.();return say('View reset.')}
 if(a==='end-tour'){state.tour=null;renderTour();return}
 if(a==='prev-step'&&state.tour?.n>0){state.tour.n--;return tourStep()}
 if(a==='next-step'&&state.tour){const t=state.tour,p=atlasPaths[t.i];if(t.n<p.steps.length-1){t.n++;return tourStep()}state.tour=null;renderTour();return showDialog('Pathway complete','<p>You completed <strong>'+esc(p.title)+'</strong>. You can revisit the route or test your understanding in the Study room.</p><div class="action-row"><button class="solid" data-page="study">Open study room</button><button class="outline" data-action="all-paths">More pathways</button></div>')}
 if(a==='new-quiz'){startQuiz();return renderStudy()}
 if(a==='next-question'){const q=state.quiz;if(q.answers.length<=q.n)return;if(q.n<q.items.length-1)q.n++;else q.done=true;renderStudy()}
}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('button');if(!b||b.disabled)return;const d=b.dataset;
 if(d.page){closeDialog();navigate(d.page)}
 else if(d.clinicalMode){renderClinicalHub(d.clinicalMode);history.pushState(null,'','#clinical/'+d.clinicalMode)}
 else if(d.studyMode){studyMode=d.studyMode;renderStudy();history.pushState(null,'','#study/'+(studyMode==='quiz'?'quiz':'lessons'))}
 else if(d.scene||d.edition||d.retry){state.tour=null;renderTour();const k=d.edition||d.retry||preferred[d.scene];if(d.edition)preferred[sceneMap[k].base||k]=k;viewer.reset();loadScene(k,d.part||sceneMap[k].root,'Anterior')}
 else if(d.recordTab){readingTab=d.recordTab;details()}
 else if(d.select){state.tour=null;renderTour();select(d.select)}
 else if(d.layer){if(viewer.isolated&&d.layer===selected().layer)viewer.isolate(false);state.mask[d.layer]=!state.mask[d.layer];viewer.setLayers(state.mask);layers();refreshPins()}
 else if(d.open){const [s,id]=d.open.split('|');openEntry(s,id)}
 else if(d.tour!==undefined)startTour(Number(d.tour));
 else if(d.filter){state.filter=d.filter;regionFilter='';renderIndex()}
 else if(d.answer!==undefined){const q=state.quiz;if(q.answers.length===q.n){q.answers.push(Number(d.answer));renderStudy()}}
 else if(d.action)action(d.action);
});
document.addEventListener('input',e=>{if(e.target.id==='structure-search'){state.query=e.target.value;indexResults()}});
document.addEventListener('change',e=>{if(e.target.id==='collection'){collection=e.target.value;regionFilter='';renderIndex()}
 if(e.target.id==='region-picker'){const k=e.target.value;preferred.vessels=k;viewer.reset();loadScene(k);state.tour=null;renderTour()}
 if(e.target.id==='orientation')viewer.setView(e.target.value);if(e.target.id==='quiz-filter'){state.quizFilter=e.target.value;startQuiz();renderStudy()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('.stage-shell').classList.contains('expanded'))modelExpanded(false)});
$('#dialog').addEventListener('click',e=>{if(e.target===$('#dialog')){const r=$('#dialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog()}});
function readRoute(){
 const [page,...route]=location.hash.slice(1).split('/');const [key,id]=route;
 if(page==='pathway'&&/^\d+$/.test(key)&&atlasPaths[Number(key)]){const i=Number(key),steps=atlasPaths[i].steps,n=/^\d+$/.test(id)?Math.min(Number(id),steps.length-1):0;navigate('explorer',false);state.tour={i,n};tourStep();return}
 navigate(page||'explorer',false,route);
 if(state.page==='explorer'&&sceneMap[key]?.byId.has(id)){viewer.reset();state.tour=null;renderTour();loadScene(key,id,undefined,true)}
}
const atlasUtilities=bindAtlasTools({all,sceneMap,viewState:()=>state,showDialog,closeDialog,navigate,openEntry,startTour,renderClinicalHub,learn:()=>{studyMode='learn';navigate('study')},quiz:()=>{studyMode='quiz';navigate('study')},esc});
bindCardiaViews(viewer,$('#atlas-view-options'),scene);
window.addEventListener('hashchange',readRoute);
loadScene('heart');if(!location.hash.includes('/'))loadScene('ref-heart');readRoute();
})();
