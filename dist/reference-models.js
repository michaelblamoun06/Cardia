/* Source mesh packages retain native common coordinates and source triangle connectivity.
   Each regional viewport receives one uniform display transform during preparation. */
(() => {
'use strict';
const regions={
 'ref-heart':['Heart and great vessels','heart','Thorax'],
 'ref-lungs':['Lungs and bronchial tree','lungs','Thorax'],
 'bp-head':['Head & neck vessels','vessels','Head & neck'],
 'bp-arm':['Upper limb vessels','vessels','Upper limbs'],
 'bp-thorax':['Thoracic vessels','vessels','Thorax'],
 'bp-abdomen':['Abdominal & pelvic vessels','vessels','Abdomen & pelvis'],
 'bp-leg':['Lower limb vessels','vessels','Lower limbs']
};
window.referenceRegions=regions;
const ids=Object.keys(atlasMeshes);
function swatch(p,scene){
 const n=p.name.toLowerCase(),drain=p.layer==='veins';
 if(p.layer==='veins'||p.layer==='arteries'){
  const family=resolveVascularFamily(p.name,p.layer,regions[scene][2],p.classes);
  const oxygenated=drain?family==='pulmV':family!=='pulmA';
  return oxygenated?(drain?'#c95049':'#c84f46'):(drain?'#446b9d':'#4d83ac');
 }
 if(p.layer==='airways')return /cartilage/.test(n)?'#aec4ae':'#92ada2';
 if(scene==='ref-heart'){
  if(/valve/.test(n))return '#dcbca3';
  if(/papillary|septum/.test(n))return '#be7f6b';
  if(/atrium/.test(n))return '#b97072';
  return /left ventricle/.test(n)?'#af524b':'#c2655b';
 }
 if(/hilum/.test(n))return '#976e73';
 if(/basal|superior bronchopulmonary/.test(n))return '#b98a8c';
 if(/lingula|lateral bronchopulmonary|medial bronchopulmonary/.test(n))return '#d59c86';
 return '#cc8b8e';
}
function shell(p,key){return key==='ref-heart'?/^(Right|Left) (atrium|ventricle)$/.test(p.name):/bronchopulmonary segment/i.test(p.name)}
async function fetchBuilder(key){
 const spec=atlasMeshes[key]; const response=await fetch(spec.file);
 if(!response.ok)throw Error('Reference data could not be loaded.');
 let buffer=await response.arrayBuffer();
 const header=new Uint8Array(buffer,0,2);
 if(header[0]===31&&header[1]===139){
  if(typeof DecompressionStream==='undefined')throw Error('This browser cannot decompress the reference geometry.');
  buffer=await new Response(new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
 }
 const byId=new Map(spec.parts.map(p=>[p.id,p]));
 return g=>{
  for(const [id,offset,count,faces,length,bytes] of spec.chunks){
   const p=byId.get(id),q=new Int16Array(buffer,offset,count*3),vertices=new Float32Array(q.length);
   for(let i=0;i<q.length;i++)vertices[i]=q[i]/16000;
   const indices=bytes===2?new Uint16Array(buffer,faces,length):new Uint32Array(buffer,faces,length);
   g.mesh(id,p.layer,swatch(p,key),vertices,indices,{shell:shell(p,key)});
  }
  for(const p of spec.parts)g.pin(p.id,p.pin);
  g.pin(key,[0,0,0]);
 };
}
const pending=new Map();
window.getReferenceBuilder=key=>{
 if(!pending.has(key)){pending.set(key,fetchBuilder(key).catch(err=>{pending.delete(key);throw err}))}
 return pending.get(key);
};
window.referenceSceneDefinitions=()=>{
 const scenes={};
 for(const id of ids){
  const [title,base,region]=regions[id],official=atlasMeshes[id],origins=[...new Set(official.parts.map(p=>p.origin))];
  const card=base==='heart',pulm=base==='lungs',bp=id.startsWith('bp-');
  const rootD=card?cardiacDossiers.heart:pulm?lungDossiers.lungs:vascularDossiers['systemic-vessels'];
  const sourceSummary=bp?'BodyParts3D v4.0 reconstructs named vessels within an adult male anatomical model. Select a vessel to inspect its course and its source mesh identifiers.':card?'Chambers, valves, papillary muscles, coronary veins, and great vessels share the coordinates of the Visible Human Male reference. Select a structure or reveal the valve apparatus.':'Bronchopulmonary segments, airways, cartilage, and proximal pulmonary vessels share the Visible Human Male coordinates. Hide the segment surfaces to follow the bronchial tree.';
  const root={id,name:title,type:bp?'Vascular region':'Reference organ',layer:'tissue',latin:bp?'BodyParts3D · v4.0':'Human Reference Atlas · Visible Human Male',summary:sourceSummary,location:region,role:card?'Coordinates pulmonary and systemic blood flow.':pulm?'Distributes inspired air and matches it to perfused exchange units.':'Distributes blood through regional arteries and collects venous return.',related:[],record:rootD,origins};
  const items=official.parts.map(p=>{
   const e=referenceNote(id,p);
   return {...e,id:p.id,name:p.name,layer:p.layer,latin:e.latin||p.ontology||'',related:[],geometry:p,record:e};
  });
  const search=(pattern)=>items.find(e=>pattern.test(e.name));
  const headline=card?[search(/^Aortic arch$/i),search(/^Superior vena cava$/i),search(/^Left ventricle$/i)]:pulm?[search(/^Trachea$/i),search(/^Right main bronchus$/i),search(/^Left lingula superior bronchopulmonary segment$/i)]:{
   'bp-head':[/^Left internal carotid artery$/i,/^Basilar artery$/i,/^Right middle cerebral artery$/i],
   'bp-thorax':[/^Superior vena cava$/i,/^Azygos vein$/i,/^Right superior pulmonary vein$/i],
   'bp-abdomen':[/^Hepatic portal vein$/i,/^Left renal vein$/i,/^Right common iliac artery$/i],
   'bp-arm':[/^Right brachial artery$/i,/^Left cephalic vein$/i,/^Left radial vein$/i],
   'bp-leg':[/^Right femoral artery$/i,/^Left great saphenous vein$/i,/^Left posterior tibial vein$/i]}[id].map(search);
  const top=headline.filter(Boolean);
  root.related=top.map(x=>x.id);const labels=top.map((e,i)=>[e.id,e.name,i===1?-1:1,i===0?-.2:i===1?-.09:.1]);
  scenes[id]={title,base,root:id,region,short:card?'Heart':pulm?'Lungs & airways':'Blood vessels',system:pulm?'Pulmonary':'Cardiovascular',items:[root,...items],labels,sourceGroup:bp?'BodyParts3D':'Human Reference Atlas',origins,isRef:true};
 }
 return scenes;
};
})();
