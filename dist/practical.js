/* Original Cardia laboratory with source-mesh identification and physiological pathways. */
(() => {
'use strict';
const text = v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function shuffle(a){const v=[...a];for(let i=v.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[v[i],v[j]]=[v[j],v[i]]}return v}
const station=(id,title,scene,names,hint,view='Anterior')=>({id,title,scene,names:names.split('|'),hint,view});
const stations=[
 station('external','Heart & great vessels','ref-heart','Aortic arch|Pulmonary trunk|Superior vena cava|Left ventricle','Use the apex, superior border of the heart, and origins of the great vessels as landmarks.'),
 station('valves','Valve dissection','ref-heart','Aortic valve|Pulmonary valve|Tricuspid valve|Mitral valve','Distinguish the atrioventricular orifices from the two ventricular outlets.','Superior'),
 station('coronary','Coronary circulation','ref-heart','Left anterior descending artery|Great cardiac vein|Right coronary artery|Coronary sinus','Compare the anterior interventricular groove with the posterior atrioventricular groove.'),
 station('airways','Bronchial tree','ref-lungs','Right main bronchus|Left main bronchus|Right bronchus intermedius|Left superior lobar bronchus','Locate the carina and count which lobar branches have left the target.'),
 station('segments','Bronchopulmonary segments','ref-lungs','Right apical bronchopulmonary segment|Right lateral bronchopulmonary segment|Left lingula superior bronchopulmonary segment|Left lateral basal bronchopulmonary segment','Identify the patient’s side and compare the target with the apex, base, lingula and middle lobe.'),
 station('arm','Upper-limb vessels','bp-arm','Left cephalic vein|Right brachial artery|Left radial artery|Right basilic vein','Track the vessel from its proximal to distal end. In anterior view, the patient’s left is on your right.'),
 station('leg','Lower-limb vessels','bp-leg','Left great saphenous vein|Right popliteal artery|Right femoral artery|Left small saphenous vein','Compare the thigh, popliteal fossa and superficial pathways of the leg.'),
 station('abdomen','Abdominal vessels','bp-abdomen','Hepatic portal vein|Celiac artery|Left renal vein|Superior mesenteric vein','Look for convergence from the intestine, drainage from a kidney, or an anterior branch of the aorta.'),
 station('gas','Alveolar microanatomy','alveoli','terminal-bronchiole|alveolar-duct|alveolar-capillaries|pulmonary-venule','Trace connections to the conducting airway, exchange spaces, and capillary bed.')
];
const stationsById=new Map(stations.map(s=>[s.id,s]));
const records=g=>g.names.map(name=>g.scene==='alveoli'?alveoliStructures.find(e=>e.id===name):atlasMeshes[g.scene].parts.find(e=>e.name===name));
const ox='https://openstax.org/books/anatomy-and-physiology-2e/pages/';
const sources={
 lung:['OpenStax · Lungs',ox+'22-2-the-lungs'],airway:['OpenStax · Respiratory structures',ox+'22-1-organs-and-structures-of-the-respiratory-system'],
 lv:['OpenStax · Cardiac cycle',ox+'19-3-cardiac-cycle'],impulse:['OpenStax · Cardiac conduction',ox+'19-2-cardiac-muscle-and-electrical-activity'],
 lad:['NCBI Bookshelf · LAD anatomy','https://www.ncbi.nlm.nih.gov/books/NBK482375/'],hpc:['NCBI Bookshelf · Hypoxic pulmonary vasoconstriction','https://www.ncbi.nlm.nih.gov/books/NBK499962/'],
 dead:['NCBI Bookshelf · Pulmonary dead space','https://www.ncbi.nlm.nih.gov/books/NBK482501/'],
 av:['Merck Manual · Atrioventricular block','https://www.merckmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/atrioventricular-block'],
 mr:['Merck Manual · Mitral regurgitation','https://www.merckmanuals.com/professional/cardiovascular-disorders/valvular-disorders/mitral-regurgitation'],
 as:['MSD Manual · Aortic stenosis','https://www.msdmanuals.com/professional/cardiovascular-disorders/valvular-disorders/aortic-stenosis']};
const n=(label,link,detail)=>({label,link,detail});
const c=(title,index,action,where,effect,elsewhere,ref)=>({title,index,action,where,effect,elsewhere,ref});
const routes=[
 {id:'cardiac-outflow',title:'Left-heart flow',carrier:'Blood',color:'#ffab92',intro:'Follow filling and ejection from a pulmonary vein to the aorta.',base:'The mitral valve opens during ventricular filling. It closes as ventricular pressure rises. When ventricular pressure exceeds aortic pressure, the aortic valve opens.',sources:['lv'],steps:[
 n('Pulmonary vein','lungs|left-superior-pulmonary-vein','Oxygenated blood returns from lung capillaries through pulmonary veins.'),
 n('Left atrium','heart|left-atrium','The left atrium collects pulmonary venous return.'),
 n('Mitral valve','heart|mitral-valve','The leaflets open when atrial pressure exceeds ventricular pressure in diastole.'),
 n('Left ventricle','heart|left-ventricle','The ventricle fills, builds pressure and then ejects.'),
 n('Aortic valve','heart|aortic-valve','A positive ventricular-to-aortic pressure gradient opens the cusps during ejection.'),
 n('Ascending aorta','ref-heart|vh-ascending-aorta','Elastic walls accommodate ejected blood and recoil during diastole.')],changes:[
 c('Mitral regurgitation',3,'reverse','Left ventricle to left atrium','During systole, part of the ejected blood returns across the incompetent mitral valve. The second pulse shows the retrograde route.','Forward aortic ejection can coexist with regurgitation. Acute severe regurgitation can abruptly elevate left atrial and pulmonary venous pressure.','mr'),
 c('Aortic stenosis',4,'narrow','Left ventricular outflow','Narrowing creates a systolic pressure gradient. The ventricle must generate higher pressure to maintain forward flow.','Jet velocity increases across the narrowed valve. Chronic pressure overload can induce concentric ventricular hypertrophy.','as')]},
 {id:'lung-perfusion',title:'Pulmonary perfusion',carrier:'Blood',color:'#9bd0ff',intro:'Trace the arterial supply and venous return of the right middle lobe’s lateral segment.',base:'An arterial branch carries mixed venous blood to the regional capillary bed. Following gas exchange, blood enters pulmonary venous tributaries.',sources:['lung','dead'],steps:[
 n('Right ventricle','heart|right-ventricle','Ejection sends blood across the pulmonary valve.'),
 n('Pulmonary trunk','heart|pulmonary-trunk','The trunk divides into right and left pulmonary arteries.'),
 n('Right pulmonary artery','lungs|right-pulmonary-artery','Lobar and segmental branches supply the right lung.'),
 n('Lateral A4 branch','lungs|right-middle-lateral-artery','A4 supplies the lateral segment of the right middle lobe.'),
 n('Capillary bed','alveoli|alveolar-capillaries','Exchange requires matching blood flow with ventilation.'),
 n('Right superior PV','lungs|right-superior-pulmonary-vein','Middle-lobe tributaries usually drain to the right superior pulmonary vein. Patterns vary.')],changes:[
 c('Complete A4 obstruction',3,'stop','Right middle lobe, lateral segment','Modeled antegrade arterial flow stops at A4. With continued ventilation, the ventilation-to-perfusion ratio increases and alveolar dead space rises.','Unaffected segmental arterial branches can still carry blood. The model omits collateral flow.','dead'),
 c('Right pulmonary artery obstruction',2,'stop','Right pulmonary arterial tree','An upstream obstruction interrupts this pathway before it divides into lobar arterial branches. A larger territory loses antegrade perfusion.','The left pulmonary artery remains connected. A substantial acute obstruction can increase right ventricular afterload.','dead')]},
 {id:'airway',title:'Regional ventilation',carrier:'Inspired air',color:'#83dcc4',intro:'Follow air to the apical segment of the right upper lobe.',base:'Conducting airways deliver gas toward respiratory bronchioles and alveolar ducts. Exchange depends on both ventilation and perfusion.',sources:['airway','lung'],steps:[
 n('Trachea','lungs|trachea','Inspired air flows toward the bifurcation at the carina.'),
 n('Right main bronchus','lungs|right-main-bronchus','The right main bronchus conducts air into the right lung.'),
 n('Right upper lobar','lungs|right-upper-lobar-bronchus','The upper lobar branch leaves the right main bronchus proximal to the bronchus intermedius.'),
 n('Apical B1 branch','lungs|right-upper-apical-bronchus','B1 supplies the apical segment of the right upper lobe.'),
 n('Terminal bronchiole','alveoli|terminal-bronchiole','After multiple smaller branches, the terminal bronchiole marks the end of the conducting zone.'),
 n('Alveolar duct','alveoli|alveolar-duct','Respiratory bronchioles lead to ducts lined by alveolar openings.')],changes:[
 c('Occlude the apical B1 bronchus',3,'stop','Apical segment of the right upper lobe','Direct ventilation through B1 stops. If perfusion continues, regional V/Q falls and the unit can approach a shunt.','Sibling bronchial branches remain patent. Local hypoxic vasoconstriction can redirect some blood flow.','hpc'),
 c('Occlude the right upper lobar bronchus',2,'stop','Whole right upper lobe','Air cannot reach the usual upper-lobe segmental bronchi through this lobar route.','The right middle and lower lobes can still receive air through the bronchus intermedius. Collateral ventilation is omitted.','lung')]},
 {id:'coronary',title:'Coronary perfusion',carrier:'Blood',color:'#ffab92',intro:'Follow an epicardial coronary pathway into apical myocardium.',base:'The left anterior descending artery supplies anterior ventricular and septal myocardium and commonly reaches the apex. Branch origins and coronary collateral channels vary.',sources:['lad'],steps:[
 n('Aortic root','heart|aorta','Blood reaches the left coronary ostium in the left aortic sinus.'),
 n('Left main coronary','heart|left-coronary-artery','The left main usually divides into the LAD and circumflex arteries.'),
 n('Proximal LAD','heart|left-anterior-descending','The LAD runs in the anterior interventricular sulcus and gives septal and diagonal branches.'),
 n('Distal LAD','heart|left-anterior-descending','The distal vessel approaches the apex. Its terminal reach varies.'),
 n('Apical myocardium','heart|left-ventricle','Mid-wall and subendocardial tissue receive blood through intramyocardial branches and capillaries.')],changes:[
 c('Occlude the proximal LAD',2,'stop','Distal LAD and downstream branches','Flow along the modeled route stops upstream of distal LAD branches. Septal and diagonal branches arising beyond the obstruction may lose inflow.','Circumflex inflow can continue. Collaterals, duration and demand modify tissue injury.','lad'),
 c('Occlude the distal LAD',3,'stop','Distal LAD and apical territory','An obstruction limits flow toward the apex while branches originating proximal to it retain direct inflow.','The myocardium at risk depends on individual vascular territories and collateral flow.','lad')]},
 {id:'electric',title:'Cardiac conduction',carrier:'Electrical activation',color:'#f5d388',intro:'Trace the sinus impulse from the right atrium to ventricular myocardium.',base:'Activation spreads through atrial myocardium, slows in the AV node and then travels rapidly through the His–Purkinje system.',sources:['impulse','av'],steps:[
 n('Sinus node','heart|sinoatrial-node','Pacemaker cells in the right atrium initiate the sinus impulse.'),
 n('Atrial muscle','heart|right-atrium','Depolarization spreads across the atria toward the AV junction.'),
 n('AV node','heart|atrioventricular-node','Nodal delay helps coordinate atrial and ventricular activation.'),
 n('His bundle','heart|atrioventricular-bundle','The AV bundle traverses the fibrous skeleton. Its bundle branches distribute activation into the ventricles.'),
 n('Purkinje network','heart|purkinje-fibers','Subendocardial fibers distribute the impulse rapidly.'),
 n('Ventricular muscle','heart|left-ventricle','Ventricular depolarization triggers calcium-dependent contraction.')],changes:[
 c('Lengthen AV nodal delay',2,'delay','AV junction','The teaching pulse slows through the AV node while continuing to the ventricles. AV conduction delay can lengthen the PR interval.','Each atrial impulse still conducts in this example. PR prolongation can also originate outside the AV node.','av'),
 c('Complete AV block',2,'stop','Atrioventricular conduction','Atrial impulses cannot activate the ventricles across the modeled block. The sinus pulse stops.','An independent junctional or ventricular escape pacemaker may activate the ventricles. The trace follows the sinus impulse only.','av')]}
];
const sourceLink=k=>'<a href="'+text(sources[k][1])+'" target="_blank" rel="noopener">'+text(sources[k][0])+'</a>';
const button=(key,label,extra='')=>'<button type="button" data-pr="'+key+'" '+extra+'>'+label+'</button>';
const field=(key,label,list,value)=>'<label class="pr-field">'+label+'<select data-pr-field="'+key+'">'+list.map(([v,n])=>'<option value="'+text(v)+'" '+(String(v)===String(value)?'selected':'')+'>'+text(n)+'</option>').join('')+'</select></label>';
function specimenBuilder(original,group,item){
 return g=>{
  function wrap(method){
   return (id,layer,color,a,b,input={})=>{
    const hit=id===item.id;
    if(!hit){
      if(group.id==='airways'&&(layer!=='airways'||/cartilage|^vh-bronchus$/.test(id)))return;
      if(group.id==='segments'&&!/bronchopulmonary-segment/.test(id))return;
      if(group.id==='valves'&&!/valve|papillary|septum|ascending-aorta|pulmonary-trunk/.test(id))return;
    }
    const opacity=hit?1:layer==='tissue'&&group.id!=='segments'?.17:.38;
    const pigment=hit?'#ffc064':layer==='arteries'?'#b89493':layer==='veins'?'#95a7bb':'#bdb6ac';
    g[method](id,layer,pigment,a,b,{...input,vertexColors:undefined,internal:false,opacity});
   };
  }
  original({mesh:wrap('mesh'),tube:wrap('tube'),ellipsoid:wrap('ellipsoid'),pin:g.pin});
 };
}
const routeById=new Map(routes.map(r=>[r.id,r]));
const sessions=new WeakMap();let openPanel=null;
window.cardPracticalSearch=()=>[
 ...stations.map(s=>({title:s.title+' · 3D identification',description:'Identify the highlighted specimen. '+records(s).map(i=>i.name).join(', '),open:()=>openPanel?.({station:s.id})})),
 ...routes.map(r=>({title:r.title+' · pathway simulator',description:r.intro+' '+r.changes.map(c=>c.title).join(', '),open:()=>openPanel?.({route:r.id})}))];
window.renderCardiaPractical=(host,options={})=>{
 let session=sessions.get(host);
 if(session&&host.contains(session.root)){openPanel=session.open;if(options.mode||options.station||options.route)session.open(options);return}
 session?.dispose();
 host.innerHTML='<section class="pr-lab" aria-label="Anatomy practical"><header class="pr-intro"><h1>Anatomy practical</h1><p>Identify a structure in 3D, or trace the effects of a pathway interruption.</p></header><div class="pr-tabs" role="group" aria-label="Laboratory activity">'+button('practical','3D identification')+button('flow','Pathway simulator')+'</div><div class="pr-work"></div></section>';
 const root=host.firstElementChild,work=root.querySelector('.pr-work'),find=s=>root.querySelector(s);
 const controller=new AbortController(),events={signal:controller.signal};
 let mode='',group=stations[0],spec=null,gen=0,viewer=null,flow={},running=0,tLast=0,observation=null;
 function stop(){if(running)cancelAnimationFrame(running);running=0;tLast=0}
 function releaseViewer(){gen++;viewer?.destroy();viewer=null}
 function createSession(g){spec={order:shuffle(records(g)),choices:shuffle(records(g)),step:0,answers:[],hint:false,ready:false,isolate:false,done:false}}
 function current(){return spec.order[spec.step]}
 function switchMode(next){stop();releaseViewer();mode=next;root.querySelectorAll('.pr-tabs button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.pr===mode));if(mode==='flow')buildFlow();else makePractical()}
 function pickStation(id){group=stationsById.get(id)||stations[0];createSession(group);switchMode('practical')}
 function makePractical(){
  if(!spec)createSession(group);
  if(spec.done){summary();return}
  work.innerHTML='<div class="pr-head"><div><h2>3D identification</h2><p>Find the amber surface marked by the numbered pin.</p></div>'+field('station','Specimen station',stations.map(s=>[s.id,s.title]),group.id)+'</div><div class="pr-grid"><div><div class="pr-specimen"><div class="pr-model-meta"><span class="pr-key"><i></i>Specimen target</span><span class="pr-angle">Anterior</span></div><canvas tabindex="0" aria-label="Unknown three-dimensional specimen with an amber target. Use arrow keys to rotate and plus or minus to zoom."></canvas><span class="pr-pin" aria-hidden="true" hidden></span><div class="pr-load" role="status">Preparing specimen…</div></div><div class="pr-tools">'+button('isolate','Isolate target','aria-pressed="false"')+button('reset-view','Reset view')+button('zoom-in','+','aria-label="Zoom specimen in"')+button('zoom-out','−','aria-label="Zoom specimen out"')+'</div><small class="pr-credit"></small></div><div class="pr-question"></div></div>';
  loadQuestion();
 }
 function initViewer(){
  const canvas=find('.pr-specimen canvas');
  if(!canvas||viewer)return;
  viewer=new AtlasViewer(canvas,{onChange:v=>{
   if(mode!=='practical'||spec.done||!v.scene)return;
   const p=v.project(current().id),pin=find('.pr-pin'),angle=find('.pr-angle');
   if(!pin||!angle)return;angle.textContent=v.getView();
   const {w,h}=v.size();pin.hidden=!p||p.x<0||p.y<0||p.x>w||p.y>h;
   if(!pin.hidden){pin.style.left=p.x+'px';pin.style.top=p.y+'px';pin.textContent=String(spec.step+1)}
  }});
 }
 async function loadQuestion(){
  const ticket=++gen,item=current(),loading=find('.pr-load'),iso=find('[data-pr="isolate"]');
  spec.ready=false;spec.isolate=false;iso.textContent='Isolate target';iso.setAttribute('aria-pressed','false');
  loading.hidden=false;loading.textContent='Preparing specimen…';find('.pr-pin').hidden=true;updateQuestion();
  try{
   initViewer();
   const original=group.scene==='alveoli'?buildAlveoli:await getReferenceBuilder(group.scene);
   if(ticket!==gen||!host.isConnected)return;
   viewer.setScene(specimenBuilder(original,group,item));viewer.select(item.id);
   const posterior=/Coronary sinus|popliteal artery|small saphenous vein/i.test(item.name);
   viewer.setView(posterior?'Posterior':group.view);if(group.id==='valves')viewer.zoomBy(1.7);
   spec.ready=true;loading.hidden=true;
   const ds=atlasSources[item.origin];
   find('.pr-credit').innerHTML=ds?'Geometry · <a target="_blank" rel="noopener" href="'+text(ds.doi||ds.url)+'">'+text(ds.publisher)+' · '+text(ds.title)+' '+text(ds.version)+'</a>':'Teaching reconstruction · '+sourceLink('airway');
  }catch(e){if(ticket!==gen)return;loading.innerHTML='The specimen could not load. '+button('retry','Retry specimen')}
  if(ticket===gen)updateQuestion();
 }
 function explanation(item){const d=group.scene==='alveoli'?item:referenceNote(group.scene,item);return d.course||d.location||d.summary}
 function updateQuestion(){
  const panel=find('.pr-question');if(!panel||spec.done)return;
  const item=current(),answer=spec.answers[spec.step],answered=!!answer,correct=answer===item.id;
  const labels=spec.choices.map((s,i)=>'<button type="button" class="pr-answer '+(answered?(s.id===item.id?'pr-correct':s.id===answer?'pr-wrong':''):'')+'" data-pr-choice="'+text(s.id)+'" '+(answered||!spec.ready?'disabled':'')+'><span>'+String.fromCharCode(65+i)+'</span>'+text(s.name)+(answered&&s.id===item.id?' <small>Correct</small>':'')+'</button>').join('');
  const pos=spec.step+1,len=spec.order.length;let feed='';
  if(answered){
   const missed=!correct&&spec.choices.find(s=>s.id===answer);
   feed='<div class="pr-feedback" role="status"><h4>'+(correct?'Correct · ':'Target · ')+text(item.name)+'</h4><p>'+text(explanation(item))+'</p>'+(missed?'<p><strong>'+text(missed.name)+'</strong> · '+text(explanation(missed))+'</p>':'')+'</div><div class="pr-tools">'+button('next',pos===len?'See station results':'Next specimen','class="pr-primary"')+'<button type="button" data-open="'+text(group.scene)+'|'+text(item.id)+'">Structure record</button></div>';
  }
  panel.innerHTML='<div class="pr-counter">SPECIMEN '+pos+' / '+len+'</div><h3>Name the highlighted structure.</h3><div class="pr-answers">'+labels+'</div>'+feed+(answered?'':'<div class="pr-hint">'+button('hint',spec.hint?'Hide orientation hint':'Orientation hint','aria-expanded="'+spec.hint+'"')+(spec.hint?'<p>'+text(group.hint)+'</p>':'')+'</div>');
 }
 function summary(){
  releaseViewer();const count=spec.order.filter((s,i)=>s.id===spec.answers[i]).length;
  work.innerHTML='<div class="pr-head"><div><h2>Station results</h2><p>'+text(group.title)+'</p></div>'+field('station','Station',stations.map(s=>[s.id,s.title]),group.id)+'</div><div class="pr-results"><h3>'+count+' of '+spec.order.length+' correctly identified</h3>'+spec.order.map((s,i)=>'<div><strong>'+(s.id===spec.answers[i]?'Correct':'Review')+'</strong><button type="button" data-open="'+text(group.scene)+'|'+text(s.id)+'">'+text(s.name)+'</button></div>').join('')+'<div class="pr-tools">'+button('repeat','Repeat station','class="pr-primary"')+'</div></div>';
 }
 function freshFlow(id){return {route:routeById.get(id)||routes[0],change:-1,pos:0,speed:1,follow:false,last:-1}}
 function lesion(){return flow.route.changes[flow.change]||null}
 function end(){return lesion()?.action==='stop'?lesion().index:flow.route.steps.length-1}
 function resetFlow(id){stop();flow=freshFlow(id);switchMode('flow')}
 function nodePoint(i){return [[88,50],[282,50],[476,50],[476,160],[282,160],[88,160]][i]}
 function pointAt(pos){
  const i=Math.min(Math.floor(pos),flow.route.steps.length-1),f=pos-i,a=nodePoint(i),b=nodePoint(Math.min(i+1,flow.route.steps.length-1));
  return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];
 }
 function buildFlow(){
  if(!flow.route)flow=freshFlow(routes[0].id);
  const r=flow.route;
  work.innerHTML='<div class="pr-head"><div><h2>Pathway simulator</h2><p>'+text(r.intro)+'</p></div>'+field('route','Pathway',routes.map(v=>[v.id,v.title]),r.id)+'</div><div class="pr-grid"><div class="pr-trace"><div class="pr-maphead"><span class="pr-carrier"></span><span>Sequence map</span></div><svg class="pr-map" viewBox="0 0 564 228" role="img" aria-label="Animated pathway sequence"></svg><div class="pr-tools">'+button('play','Play trace','class="pr-primary"')+button('back','Previous step')+button('forward','Next step')+'</div><div class="pr-controlrow">'+field('speed','Playback speed',[[0.5,'½×'],[1,'1×'],[2,'2×']],flow.speed)+button('follow','Follow signal','aria-pressed="'+flow.follow+'"')+button('rewind','Restart trace')+'</div></div><div class="pr-interrupt">'+field('lesion','Flow condition',[[-1,'Typical pathway'],...r.changes.map((c,i)=>[i,c.title])],flow.change)+'<div class="pr-active"></div><div class="pr-mechanism"></div></div></div><div class="pr-route-foot"><h3>Route landmarks</h3><div class="pr-landmarks"></div><p class="pr-note">This sequence represents anatomical order. Pulse speed, spacing and branch flow are illustrative.</p><div class="pr-source"></div></div>';
  const points=r.steps.map((_,i)=>nodePoint(i)),l=lesion();
  let art='<title>'+text(r.title)+' sequence</title>';
  for(let i=1;i<points.length;i++){
    const [a,b]=[points[i-1],points[i]],cx=(a[0]+b[0])/2,cy=(a[1]+b[1])/2;
    const angle=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;
    const blocked=l?.action==='stop'&&i>l.index,narrow=l?.action==='narrow'&&i===l.index;
    const c=blocked?'#617579':narrow?'#f2b57c':'#91abb3';
    art+='<path d="M'+a.join(' ')+' L'+b.join(' ')+'" fill="none" stroke="'+c+'" stroke-width="'+(narrow?1.6:2.5)+'" '+(blocked?'stroke-dasharray="4 5"':'')+'/>';
    art+='<path d="M-5 -4 L1 0 L-5 4" fill="none" stroke="'+c+'" stroke-width="2" transform="translate('+cx+' '+cy+') rotate('+angle+')"/>';
  }
  if(l?.action==='reverse')art+='<path d="M476 160 Q352 178 282 50" stroke="#f8b87c" stroke-dasharray="4 5" fill="none"/><circle class="pr-return" r="5" fill="#f8b87c" visibility="hidden"/>';
  for(let i=0;i<points.length;i++){
   const [x,y]=points[i],flag=l&&i===l.index;
   art+='<g data-pr-node="'+i+'"><circle cx="'+x+'" cy="'+y+'" r="12" fill="#273a40" stroke="'+(flag?'#f8b87c':'#93a8ac')+'" stroke-width="2"/><text x="'+x+'" y="'+(y+4)+'" class="pr-num">'+(i+1)+'</text><text x="'+x+'" y="'+(y+32)+'" class="pr-lbl">'+text(r.steps[i].label)+'</text></g>';
  }
  art+='<circle class="pr-dot" r="7" fill="'+r.color+'" stroke="#15282e" stroke-width="2"/>';
  find('.pr-map').innerHTML=art;
  const key=find('.pr-carrier');key.textContent=r.carrier;key.style.setProperty('--pulse',r.color);
  find('.pr-landmarks').innerHTML=r.steps.map((s,i)=>'<button type="button" data-pr-step="'+i+'">'+(i+1)+' · '+text(s.label)+'</button>').join('');
  find('.pr-mechanism').innerHTML='<h3>'+(l?text(l.title):'Typical flow')+'</h3>'+(l?'<span class="pr-territory">'+text(l.where)+'</span><p>'+text(l.effect)+'</p><p>'+text(l.elsewhere)+'</p><details><summary>Compare with typical flow</summary><p>'+text(r.base)+'</p></details>':'<p>'+text(r.base)+'</p>');
  find('.pr-source').innerHTML=[...new Set([...r.sources,...(l?[l.ref]:[])])].map(sourceLink).join(' ');
  flow.last=-1;paintFlow();
 }
 function paintFlow(){
  const r=flow.route,l=lesion(),p=pointAt(flow.pos),i=Math.min(Math.floor(flow.pos+1e-6),r.steps.length-1),atStop=l?.action==='stop'&&flow.pos>=l.index;
  const svg=find('.pr-map');if(!svg)return;
  const dot=svg.querySelector('.pr-dot');dot.setAttribute('cx',p[0]);dot.setAttribute('cy',p[1]);dot.setAttribute('visibility',flow.pos>end()?'hidden':'visible');
  svg.setAttribute('viewBox',flow.follow?[Math.max(0,Math.min(564-310,p[0]-155)),Math.max(0,Math.min(228-142,p[1]-65)),310,142].join(' '):'0 0 564 228');
  const back=svg.querySelector('.pr-return');
  if(back){
   const active=flow.pos>=3&&flow.pos<=4, f=flow.pos-3,u=1-f;
   back.setAttribute('visibility',active?'visible':'hidden');
   if(active){back.setAttribute('cx',u*u*476+2*u*f*352+f*f*282);back.setAttribute('cy',u*u*160+2*u*f*178+f*f*50)}
  }
  if(flow.last!==i){
   flow.last=i;const s=r.steps[i];
   find('.pr-active').innerHTML='<div class="pr-counter">LANDMARK '+(i+1)+' / '+r.steps.length+'</div><h3>'+text(s.label)+'</h3><p>'+text(s.detail)+'</p>'+(atStop?'<p class="pr-state">'+(i===l.index?'The traced signal stops here.':'This landmark is downstream of the interruption.')+'</p>':'')+'<button type="button" class="pr-record" data-open="'+text(s.link)+'">Explore in 3D</button>';
   root.querySelectorAll('[data-pr-step]').forEach((b,j)=>b.setAttribute('aria-pressed',i===j));
   svg.setAttribute('aria-label',r.title+'. Current landmark: '+s.label+'. '+(l?l.title:'Typical pathway')+'.');
  }
  const toggle=find('[data-pr="play"]');toggle.textContent=running?'Pause trace':flow.pos>=end()?'Replay trace':'Play trace';
  find('[data-pr="back"]').disabled=flow.pos<=0;
  find('[data-pr="forward"]').disabled=flow.pos>=end();
 }
 function tick(now){
  if(!host.isConnected||host.closest('[hidden]')||document.hidden){stop();if(host.isConnected)paintFlow();return}
  const dt=tLast?Math.min(.12,(now-tLast)/1000):0;tLast=now;
  const l=lesion(),delayed=l?.action==='delay'&&flow.pos>=l.index&&flow.pos<l.index+.4;
  flow.pos=Math.min(end(),flow.pos+dt*flow.speed*(delayed?.14:.72));
  if(flow.pos>=end())stop();else running=requestAnimationFrame(tick);
  paintFlow();
 }
 function manual(step){
  stop();flow.pos=Math.max(0,Math.min(flow.route.steps.length-1,step));flow.last=-1;paintFlow();
 }
 root.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.prChoice&&mode==='practical'&&spec.ready&&spec.answers.length===spec.step){
   spec.answers.push(b.dataset.prChoice);updateQuestion();return;
  }
  if(b.dataset.prStep!==undefined){manual(Number(b.dataset.prStep));return}
  const key=b.dataset.pr;
  if(key==='practical'||key==='flow'){if(key!==mode)switchMode(key);return}
  if(key==='repeat'){pickStation(group.id);return}
  if(key==='retry'){loadQuestion();return}
  if(key==='hint'){spec.hint=!spec.hint;updateQuestion();return}
  if(key==='isolate'&&viewer&&spec.ready){spec.isolate=!spec.isolate;viewer.isolate(spec.isolate);b.setAttribute('aria-pressed',spec.isolate);b.textContent=spec.isolate?'Show context':'Isolate target';return}
  if(key==='reset-view'&&viewer&&spec.ready){viewer.reset();viewer.setView(group.view);spec.isolate=false;const iso=find('[data-pr="isolate"]');iso.textContent='Isolate target';iso.setAttribute('aria-pressed','false');return}
  if((key==='zoom-in'||key==='zoom-out')&&viewer){viewer.zoomBy(key==='zoom-in'?1.3:1/1.3);return}
  if(key==='next'&&spec.answers.length===spec.step+1){
   if(spec.step===spec.order.length-1){spec.done=true;summary();return}
   spec.step++;spec.choices=shuffle(records(group));spec.hint=false;loadQuestion();return;
  }
  if(key==='play'){
   if(running)stop();else{if(flow.pos>=end())flow.pos=0;tLast=0;running=requestAnimationFrame(tick)}
   paintFlow();return;
  }
  if(key==='rewind'){manual(0);return}
  if(key==='forward'||key==='back'){manual(key==='forward'?Math.min(end(),Math.floor(flow.pos)+1):Math.max(0,Math.ceil(flow.pos)-1));return}
  if(key==='follow'){flow.follow=!flow.follow;b.setAttribute('aria-pressed',flow.follow);b.textContent=flow.follow?'Show whole route':'Follow signal';paintFlow()}
 },events);
 root.addEventListener('change',event=>{
  const k=event.target.dataset.prField,val=event.target.value;
  if(k==='station')pickStation(val);
  if(k==='route')resetFlow(val);
  if(k==='lesion'){stop();flow.change=Number(val);flow.pos=0;buildFlow()}
  if(k==='speed')flow.speed=Number(val);
 },events);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&running){stop();paintFlow()}},events);
 function open(opt={}){
  if(opt.route){resetFlow(opt.route);return}
  if(opt.station){pickStation(opt.station);return}
  switchMode(opt.mode==='flow'?'flow':'practical');
 }
 function dispose(){stop();releaseViewer();controller.abort();observation?.disconnect()}
 if(typeof MutationObserver==='function'){
  observation=new MutationObserver(()=>{
   if(!host.isConnected||!host.contains(root)){dispose();return}
   if(host.closest('[hidden]')&&running){stop();paintFlow();}
  });
  observation.observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden']});
  observation.observe(host,{childList:true});
 }
 sessions.set(host,{root,open,dispose});openPanel=open;open(options);
};
})();
