/* Registered HRA surfaces. Display +X, +Y, +Z = patient left, superior, anterior. */
(() => {
'use strict';
const scenes={heart:['ref-heart','Heart','vh-heart-left-ventricle',76.36421875],lungs:['ref-lungs','Lungs','vh-left-apical-bronchopulmonary-segment',99.157749]};
const titles={short:'Cardiac short axis',long:'Cardiac long axis',axial:'Axial',coronal:'Coronal',sagittal:'Sagittal'};
const guides={
 axial:'Viewed from the feet. The patient’s right appears on the left, with anterior at the top.',
 coronal:'Viewed from the front. The patient’s right appears on the left, with superior at the top.',
 sagittal:'Viewed from the patient’s left. Anterior appears on the left, with superior at the top.',
 short:'The plane is perpendicular to the estimated left ventricular long axis. The top points toward anterior projected into this oblique plane.',
 long:'The central plane passes through the estimated left ventricular apex and the centers of the mitral and tricuspid valve meshes. Other levels are parallel to that plane.'
};
const abbr={'Left ventricle':'LV','Right ventricle':'RV','Interventricular septum':'IVS','Left atrium':'LA','Right atrium':'RA','Superior vena cava':'SVC','Inferior vena cava':'IVC','Ascending aorta':'Ao','Aortic arch':'Arch','Trachea':'Tr','Left main bronchus':'LMB','Right main bronchus':'RMB','Carina':'Car'};
const cache=new Map(), add=(a,b)=>a.map((v,i)=>v+b[i]), sub=(a,b)=>a.map((v,i)=>v-b[i]), scale=(a,k)=>a.map(v=>v*k);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],unit=a=>scale(a,1/Math.hypot(...a));
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]], reject=(a,b)=>unit(sub(a,scale(b,dot(a,b))));
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const empty=()=>[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];
function extend(box,x,y,z){
 if(x<box[0])box[0]=x;if(y<box[1])box[1]=y;if(z<box[2])box[2]=z;
 if(x>box[3])box[3]=x;if(y>box[4])box[4]=y;if(z>box[5])box[5]=z;
}
function direction(v){
 const sign=[['R','L'],['I','S'],['P','A']];
 return v.map((n,i)=>[Math.abs(n),sign[i][+(n>0)]]).sort((a,b)=>b[0]-a[0]).filter(x=>x[0]>.33).map(x=>x[1]).join('');
}
function tint(p,color){
 const fixed={'Right ventricle':'#ac7080','Left ventricle':'#d58376','Left atrium':'#c99088','Right atrium':'#a47b91','Interventricular septum':'#e0a582'};
 if(fixed[p.name])return fixed[p.name];
 if(p.name.includes('valve'))return '#efd2a0';if(p.name.includes('papillary'))return '#e6b49a';
 if(p.name.includes('bronchopulmonary segment'))return ['#d29887','#c48a82','#b4808f','#c89f90','#b58280'][[...p.name].reduce((s,c)=>s+c.charCodeAt(0),0)%5];
 if(p.layer==='airways')return p.name.includes('cartilage')?'#b9cfa9':'#78c2ae';
 return color;
}
async function load(organ){
 const [key,,scaleId,originalWidthMM]=scenes[organ],builder=await getReferenceBuilder(key),parts=[];
 const meta=new Map(atlasMeshes[key].parts.map(p=>[p.id,p]));
 builder({pin(){},mesh(id,layer,color,pos,idx){
  const p=meta.get(id),sum=[0,0,0],extent=empty();
  for(let i=0;i<pos.length;i+=3){extend(extent,pos[i],pos[i+1],pos[i+2]);for(let k=0;k<3;k++)sum[k]+=pos[i+k]}
  const priority=/bronchopulmonary segment|^(Right|Left) (ventricle|atrium)$/.test(p.name)?0:/hilum|Bronchial tree/.test(p.name)?1:layer==='tissue'?2:3;
  parts.push({id,meta:p,pos,idx,name:p.name,color:tint(p,color),priority,extent,center:scale(sum,3/pos.length)});
 }});
 parts.sort((a,b)=>a.priority-b.priority);
 const get=id=>parts.find(p=>p.id===id),ref=get(scaleId).extent;
 // Reference widths are from position accessors in the immutable source glTF (metres × 1000).
 const mm=originalWidthMM/(ref[3]-ref[0]);
 const planes={
  axial:{u:[1,0,0],v:[0,0,1],n:[0,1,0],ends:['Inferior','Superior']},
  coronal:{u:[1,0,0],v:[0,1,0],n:[0,0,1],ends:['Posterior','Anterior']},
  sagittal:{u:[0,0,-1],v:[0,1,0],n:[1,0,0],ends:['Right','Left']}
 };
 const m={parts,get,builder,planes,mm};
 if(organ==='heart'){
  const mv=get('vh-mitral-valve').center,tv=get('vh-tricuspid-valve').center,lv=get('vh-heart-left-ventricle').pos,distances=[];
  for(let i=0;i<lv.length;i+=3){const p=Array.from(lv.subarray(i,i+3)),d=sub(p,mv);distances.push([dot(d,d),p])}
  const tips=distances.sort((a,b)=>b[0]-a[0]).slice(0,Math.max(1,Math.round(distances.length*.005)));
  const apex=scale(tips.reduce((sum,a)=>add(sum,a[1]),[0,0,0]),1/tips.length),axis=unit(sub(mv,apex));
  const anterior=reject([0,0,1],axis),lat=reject(sub(mv,tv),axis),normal=unit(cross(lat,axis));
  let right=unit(cross(axis,anterior));if(right[0]<0)right=scale(right,-1);
  planes.short={u:right,v:anterior,n:axis,ends:['Apical side','Basal side']};
  planes.long={u:lat,v:axis,n:normal,ends:[direction(scale(normal,-1)),direction(normal)]};
  m.landmark=t=>add(apex,scale(sub(mv,apex),t));
 }
 return m;
}
function loadOnce(organ){if(!cache.has(organ))cache.set(organ,load(organ).catch(e=>{cache.delete(organ);throw e}));return cache.get(organ)}
function bookmarks(m,organ,key){
 if(key==='short')return [['Apical ventricle',m.landmark(.24)],['Mid-ventricle',m.landmark(.5)],['Ventricular base',m.landmark(.78)]];
 const ids=key==='long'?[['AV valves & apex','vh-mitral-valve'],['Aortic valve','vh-aortic-valve'],['Pulmonary valve','vh-pulmonary-valve']]:organ==='heart'?[['Ventricles','vh-interventricular-septum'],['Mitral valve','vh-mitral-valve'],['Aortic arch','vh-aortic-arch']]:[['Carina','vh-carina'],['Right main bronchus','vh-right-main-bronchus'],['Left lower lobe','vh-left-inferior-lobar-bronchus']];
 return ids.map(([name,id])=>[name,m.get(id).center]);
}
function project(m,plane){
 const range=empty(),axes=[plane.u,plane.v,plane.n];
 const parts=m.parts.map(part=>{
  const c=new Float64Array(part.pos.length),b=empty(),p=part.pos;
  for(let i=0;i<c.length;i+=3){
   for(let k=0;k<3;k++){const a=axes[k];c[i+k]=a[0]*p[i]+a[1]*p[i+1]+a[2]*p[i+2]}
   extend(b,c[i],c[i+1],c[i+2]);
  }
  extend(range,b[0],b[1],b[2]);extend(range,b[3],b[4],b[5]);
  return {...part,c,b};
 });
 return {parts,range};
}
function contours(part,d){
 const {idx,c,b}=part;if(d<=b[2]||d>=b[5])return [];
 const nodes=new Map(),edges=[];
 function point(a,b){
  const t=(d-c[a+2])/(c[b+2]-c[a+2]),x=c[a]+t*(c[b]-c[a]),y=c[a+1]+t*(c[b+1]-c[a+1]);
  const key=Math.round(x*1e6)+','+Math.round(y*1e6);
  if(!nodes.has(key))nodes.set(key,{x,y,edges:[]});return nodes.get(key);
 }
 for(let i=0;i<idx.length;i+=3){
  const a=idx[i]*3,b=idx[i+1]*3,e=idx[i+2]*3,sa=c[a+2]>d,sb=c[b+2]>d,se=c[e+2]>d;
  if(sa===sb&&sb===se)continue;
  const first=sa!==sb?point(a,b):point(b,e),second=sa!==se?point(a,e):point(b,e);if(first===second)continue;
  const k=edges.length;edges.push([first,second,false]);first.edges.push(k);second.edges.push(k);
 }
 const loops=[];
 function trace(start){
  let node=start,i;const pts=[start];
  while((i=node.edges.find(i=>!edges[i][2]))!==undefined){const e=edges[i];e[2]=true;node=e[0]===node?e[1]:e[0];pts.push(node);if(node===start)break}
  if(pts.length>1)loops.push({pts,closed:node===start});
 }
 for(const n of nodes.values())if(n.edges.length===1)trace(n);
 for(const e of edges)if(!e[2])trace(e[0]);
 return loops;
}
function renderCardiaSections(host,options){
 if(host.__cs){if(options)host.__cs.open(options);else host.__cs.refresh();return}
 host.innerHTML='<div class="cs-module"><header class="pageintro"><div><h1>Section atlas</h1><p>Cut through the heart or lungs and match each cross-section to its position in 3D.</p></div></header><div class="cs-org" role="group" aria-label="Section model"><button data-cs-organ="heart">Heart</button><button data-cs-organ="lungs">Lungs &amp; airways</button></div>'+
 '<section class="cs-card"><div class="cs-head"><h2>Cross-sectional anatomy</h2><label>Plane <select data-cs-plane aria-label="Section plane"></select></label></div><div class="cs-grid"><div><div class="cs-field"><div class="cs-top"><strong data-cs-title></strong><button data-cs="labels" aria-pressed="true">Labels</button></div><svg data-cs-image viewBox="0 0 720 460" role="img" aria-label="Anatomical section"></svg><div class="cs-loading" role="status"></div></div>'+
 '<div class="cs-depth"><div><label for="cs-depth">Slice position</label><output for="cs-depth"></output></div><div class="cs-range"><button data-cs="prev" aria-label="Previous slice">−</button><input type="range" id="cs-depth" min="0" max="100" step="0.1"><button data-cs="next" aria-label="Next slice">+</button></div><div class="cs-ends"><span></span><span></span></div><div class="cs-jumps" aria-label="Jump to a landmark"></div></div></div>'+
 '<aside><div class="cs-locator"><div class="cs-top"><h3>3D locator</h3><button data-cs="show" aria-pressed="true">Show plane</button></div><div class="cs-volume"><canvas tabindex="0" aria-label="3D locator. Drag or use arrow keys to rotate."></canvas><svg aria-hidden="true"></svg></div><p>Drag the model to rotate the cutting plane.</p></div><div class="cs-info"><h3></h3><p></p><div></div></div></aside></div>'+
 '<div class="cs-list"><h3>Structures on this slice <small></small></h3><div></div></div><details class="cs-method"><summary>How these sections are made</summary><div></div></details></section></div>';
 const q=s=>host.querySelector(s),svg=q('[data-cs-image]'),input=q('#cs-depth'),overlay=q('.cs-volume svg'),status=q('.cs-loading'),picker=q('[data-cs-plane]');
 let organ,key,model,plane,pr,level=0,marks,viewer,selected,paths=[],transform,frame=0,ticket=0,labels=true,show=true;
 function persist(){
  if(!pr||!model||!location.hash.startsWith('#sections'))return;
  const pct=Number((Number(input.max)?level*100/Number(input.max):0).toFixed(2));
  history.replaceState(null,'','#sections/'+organ+'/'+key+'/'+pct);
 }
 function updateInfo(){
  const p=paths.find(s=>s.part.id===selected)?.part;
  q('.cs-info h3').textContent=p?p.name:'Section orientation';
  q('.cs-info p').textContent=p?referenceNote(scenes[organ][0],p.meta).summary:guides[key];
  q('.cs-info div').innerHTML=p?'<button data-open="'+scenes[organ][0]+'|'+esc(p.id)+'">Open structure in explorer</button>':'';
 }
 function drawOverlay(){
  if(!viewer||!transform||!show||!pr){overlay.replaceChildren();return}
  const {w,h}=viewer.size();if(w<1||h<1)return;const f=viewer.frame(w,h),r=pr.range,d=transform.level;
  function pt(x,y){
   const p=[0,1,2].map(k=>plane.u[k]*x+plane.v[k]*y+plane.n[k]*d),z=-f.sy*p[0]+f.cy*p[2];
   return (w/2+f.panX+f.scale*(f.cy*p[0]+f.sy*p[2])).toFixed(1)+','+(h/2+f.panY-f.scale*(f.cp*p[1]-f.sp*z)).toFixed(1);
  }
  const rect=[[r[0],r[1]],[r[3],r[1]],[r[3],r[4]],[r[0],r[4]]].map(p=>pt(...p)).join(' ');
  const cuts=paths.map(s=>s.loops.map(loop=>loop.pts.map((p,i)=>(i?'L':'M')+pt(p.x,p.y)).join('')).join('')).join('');
  overlay.setAttribute('viewBox','0 0 '+w+' '+h);
  overlay.innerHTML='<polygon points="'+rect+'" fill="#79e4cc" fill-opacity=".19" stroke="#89e1cf" stroke-width="1.3"/><path d="'+cuts+'" stroke="#a6f4df" stroke-opacity=".86" stroke-width=".75" fill="none"/>';
 }
 function paint(){
  if(!pr||!transform)return;const {px,py,zoom}=transform;
  const shapes=paths.map(s=>{const on=selected===s.part.id;return '<g data-cs-part="'+esc(s.part.id)+'" opacity="'+(!selected||on?'1':'.54')+'"><title>'+esc(s.part.name)+'</title><path d="'+s.closed+'" fill="'+s.part.color+'" fill-rule="evenodd" stroke="'+(on?'#fff1bb':'#e3c8b5')+'" stroke-width="'+(on?2.4:.65)+'"/><path d="'+s.open+'" fill="none" stroke="'+(on?'#fff1bb':s.part.color)+'" stroke-width="'+(on?2.4:1.2)+'"/></g>'}).join('');
  const text=(s,x,y)=>'<text class="cs-dir" x="'+x+'" y="'+y+'">'+s+'</text>';
  const orient=text(direction(plane.v),360,24)+text(direction(scale(plane.v,-1)),360,448)+text(direction(scale(plane.u,-1)),29,232)+text(direction(plane.u),691,232);
  const scaleBar='<g class="cs-scale"><path d="M37 410v7h'+(20*zoom/model.mm)+'v-7"/><text x="37" y="437">20 mm</text></g>';
  let tags='';const occupied=[];
  if(labels)for(const s of [...paths].sort((a,b)=>Number(b.part.id===selected)-Number(a.part.id===selected))){
   const name=abbr[s.part.name]||(s.part.id===selected?'Selected':null);if(!name)continue;
   const x=px(s.anchor.x),y=py(s.anchor.y),tx=clamp(x+16,55,665);let ty=clamp(y-17,45,407);
   while(occupied.some(p=>Math.abs(tx-p[0])<49&&Math.abs(ty-p[1])<22)&&ty<407)ty+=23;
   if(ty>413)continue;occupied.push([tx,ty]);const w=Math.max(29,name.length*8+10);
   tags+='<g class="cs-pin" data-cs-part="'+esc(s.part.id)+'"><title>'+esc(s.part.name)+'</title><path d="M'+x+' '+y+' L'+tx+' '+ty+'"/><circle cx="'+x+'" cy="'+y+'" r="2.5"/><rect x="'+(tx-w/2)+'" y="'+(ty-10)+'" width="'+w+'" height="20" rx="4"/><text x="'+tx+'" y="'+(ty+4)+'">'+esc(name)+'</text></g>';
  }
  svg.innerHTML=shapes+orient+scaleBar+tags;
 }
 function redraw(){
  if(!pr)return;
  const r=pr.range,zoom=Math.min(580/(r[3]-r[0]),342/(r[4]-r[1])),px=x=>360+(x-(r[0]+r[3])*.5)*zoom,py=y=>230-(y-(r[1]+r[4])*.5)*zoom;
  const d=r[2]+level/model.mm+1.19e-8;paths=[];transform={px,py,zoom,level:d};
  for(const part of pr.parts){
   const loops=contours(part,d);if(!loops.length)continue;
   let open='',closed='',longest=[];
   for(const l of loops){
    const path=l.pts.map((p,i)=>(i?'L':'M')+px(p.x).toFixed(2)+' '+py(p.y).toFixed(2)).join('');
    if(l.closed)closed+=path+'Z';else open+=path;
    if(l.pts.length>longest.length)longest=l.pts;
   }
   paths.push({part,loops,closed,open,anchor:longest[Math.floor(longest.length*.32)]});
  }
  if(selected&&!paths.some(s=>s.part.id===selected)){selected=null;viewer?.select(null)}
  paint();drawOverlay();updateInfo();
  q('.cs-list small').textContent=paths.length;
  q('.cs-list>div').innerHTML=[...paths].sort((a,b)=>a.part.name.localeCompare(b.part.name)).map(({part})=>'<button data-cs-part="'+esc(part.id)+'" aria-pressed="'+(selected===part.id)+'"><i style="--tint:'+part.color+'"></i>'+esc(part.name)+'</button>').join('')||'<p>No segmented structure crosses this level.</p>';
  q('output').textContent=level.toFixed(1)+' / '+input.max+' mm';input.setAttribute('aria-valuetext',level.toFixed(1)+' millimeters from the '+plane.ends[0].toLowerCase()+' side');
  q('[data-cs="prev"]').disabled=level<.1;q('[data-cs="next"]').disabled=level>Number(input.max)-.1;
  svg.setAttribute('aria-label',titles[key]+' section of the '+scenes[organ][1].toLowerCase()+', '+level.toFixed(1)+' millimeters into the stack. '+paths.length+' structures. Use the structure list to select by name.');
 }
 function setLevel(value){level=Math.round(clamp(value,0,Number(input.max))*10)/10;input.value=level;if(!frame)frame=requestAnimationFrame(()=>{frame=0;redraw()})}
 function setPlane(value,pct){
  key=value;plane=model.planes[key];pr=project(model,plane);marks=bookmarks(model,organ,key);selected=null;viewer?.select(null);picker.value=key;
  input.max=(Math.floor((pr.range[5]-pr.range[2])*model.mm*10)/10).toFixed(1);input.disabled=false;
  q('.cs-ends span:first-child').textContent=plane.ends[0];q('.cs-ends span:last-child').textContent=plane.ends[1];
  q('[data-cs-title]').textContent=scenes[organ][1]+' · '+titles[key];
  q('.cs-jumps').innerHTML=marks.map((m,i)=>'<button data-cs-jump="'+i+'">'+esc(m[0])+'</button>').join('');
  setLevel(Number.isFinite(pct)?Number(input.max)*clamp(pct,0,100)/100:(dot(marks[key==='short'?1:0][1],plane.n)-pr.range[2])*model.mm);
 }
 function method(){
  const ids=organ==='heart'?['heart','blood-vasculature']:['lung','trachea','main-bronchus','blood-vasculature'];
  q('.cs-method>div').innerHTML='<p>Each contour follows the intersection of a plane with the published Human Reference Atlas surface triangles. Closed contours have a color fill. Open contours are drawn as lines. Colors identify structures. Distance measures depth from the first modeled level in this stack.</p>'+(organ==='heart'?'<p>The cardiac planes use valve centers and the most distal tip of the left ventricular mesh to estimate the long axis. These model-derived sections approximate clinical view geometry. MRI signal and cardiac motion require acquired imaging.</p>':'<p>Lung colors distinguish segmented territories. The visible airway and vessel branches follow those included in the source model.</p>')+'<div>'+ids.map(id=>'<a target="_blank" rel="noopener" href="'+esc(atlasSources[id].doi)+'">'+esc(atlasSources[id].title+' '+atlasSources[id].version)+'</a>').join('')+(organ==='heart'?'<a target="_blank" rel="noopener" href="https://doi.org/10.1186/s12968-020-00607-1">SCMR cardiac plane guidance</a>':'')+'</div>';
 }
 async function open(options={}){
  const next=scenes[options.organ]?options.organ:'heart',pct=options.depth==null||options.depth===''?undefined:Number(options.depth),newKey=options.plane||(next==='heart'?'short':'axial');
  if(organ===next&&model){setPlane(model.planes[newKey]?newKey:(next==='heart'?'short':'axial'),pct);persist();return}
  const now=++ticket;organ=next;model=null;pr=null;transform=null;paths=[];selected=null;
  host.querySelectorAll('[data-cs-organ]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.csOrgan===next)));
  picker.innerHTML=(organ==='heart'?['short','long','axial','coronal','sagittal']:['axial','coronal','sagittal']).map(k=>'<option value="'+k+'">'+titles[k]+'</option>').join('');
  picker.disabled=true;input.disabled=true;status.hidden=false;status.textContent='Loading reference geometry…';method();
  svg.replaceChildren();overlay.replaceChildren();q('.cs-list>div').replaceChildren();q('.cs-info>div').replaceChildren();q('.cs-jumps').replaceChildren();
  q('.cs-info h3').textContent='Section orientation';q('.cs-info p').textContent='';q('[data-cs-title]').textContent=scenes[organ][1];
  try{
   const data=await loadOnce(organ);if(ticket!==now)return;model=data;
   if(!viewer)viewer=new AtlasViewer(q('.cs-volume canvas'),{onChange:drawOverlay});
   viewer.setScene(model.builder);viewer.rotateBy(-17,15);picker.disabled=false;status.hidden=true;
   setPlane(model.planes[newKey]?newKey:(next==='heart'?'short':'axial'),pct);persist();
  }catch(e){if(ticket===now)status.innerHTML='The reference geometry could not load. <button data-cs="retry">Retry</button>'}
 }
 host.addEventListener('click',e=>{
  const b=e.target.closest('[data-cs-organ],[data-cs-part],[data-cs-jump],[data-cs]');if(!b)return;
  if(b.dataset.csOrgan){if(organ!==b.dataset.csOrgan)open({organ:b.dataset.csOrgan});return}
  if(b.dataset.cs==='retry'){open({organ});return}if(!model||!pr||!transform)return;
  if(b.dataset.csPart){selected=selected===b.dataset.csPart?null:b.dataset.csPart;viewer?.select(selected);paint();updateInfo();q('.cs-list').querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.csPart===selected)));return}
  if(b.dataset.csJump!==undefined){setLevel((dot(marks[Number(b.dataset.csJump)][1],plane.n)-pr.range[2])*model.mm);persist();return}
  if(b.dataset.cs==='prev'||b.dataset.cs==='next'){setLevel(level+(b.dataset.cs==='next'?1:-1));persist()}
  if(b.dataset.cs==='labels'){labels=!labels;b.setAttribute('aria-pressed',String(labels));paint()}
  if(b.dataset.cs==='show'){show=!show;b.setAttribute('aria-pressed',String(show));drawOverlay()}
 });
 picker.addEventListener('change',()=>{if(model){setPlane(picker.value);persist()}});
 input.addEventListener('input',()=>setLevel(Number(input.value)));input.addEventListener('change',persist);
 function refresh(){viewer?.requestDraw();if(pr)setLevel(level)}
 window.addEventListener('cardia:navigate',e=>{if(e.detail?.page==='sections'&&!e.detail.route?.length&&model){refresh();persist()}});
 window.openCardiaSection=open;host.__cs={open,refresh};open(options);
}
window.renderCardiaSections=renderCardiaSections;
})();
