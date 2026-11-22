/* Original AHA 17-segment teaching display. Intensities are invented relative values. */
(() => {
 'use strict';
 const levels=[
  ['Basal',1,6,99,70,'Near the tips of the mitral leaflets.'],
  ['Mid-cavity',7,12,70,43,'Through the papillary muscle level.'],
  ['Apical',13,16,43,17,'Beyond the papillary muscles, while a small ventricular cavity remains.'],
  ['Apical cap',17,17,17,0,'At the tip of the LV, beyond the end of the cavity. The cap is solid myocardium.']
 ];
 const walls=['anterior','anteroseptal','inferoseptal','inferior','inferolateral','anterolateral'];
 const names=[...walls.map(x=>'Basal '+x),...walls.map(x=>'Mid '+x),'Apical anterior','Apical septal','Apical inferior','Apical lateral','Apical cap'];
 const arteries={
  LAD:['Left anterior descending artery','left-anterior-descending',[1,2,7,8,13,14,17]],
  RCA:['Right coronary artery','right-coronary-artery',[3,4,9,10,15]],
  LCx:['Left circumflex artery','circumflex-artery',[5,6,11,12,16]]
 };
 const baseline=[96,95,94,95,96,97,100,98,96,95,97,98,96,95,94,96,91];
 const cases={
  homogeneous:['Homogeneous uptake',7,{},'The relative distribution is similar during stress and rest. This teaching example includes small differences in intensity across the wall. A relative map alone cannot measure absolute myocardial blood flow.'],
  reversible:['Reversible anterior defect',7,{1:[96,76],2:[95,72],7:[99,39],8:[97,45],13:[95,48],14:[94,65],17:[91,77]},'Anterior and anteroseptal uptake falls during stress and recovers at rest. In this example, limited coronary flow reserve produces a reversible defect in an LAD distribution.'],
  fixed:['Fixed inferior defect',10,{3:[72,72],4:[53,53],9:[59,59],10:[36,36],15:[54,54]},'Inferior and neighboring inferoseptal uptake is reduced to a similar degree during stress and rest. Prior myocardial injury can produce this pattern. Attenuation can mimic a fixed defect, so readers also consider gated wall motion, thickening, and attenuation correction.'],
  mixed:['Partly reversible lateral defect',11,{5:[76,56],6:[97,75],11:[61,31],12:[84,56],16:[68,42]},'A lateral reduction at rest deepens and extends with stress. This can reflect injured myocardium with superimposed inducible ischemia in a circumflex distribution. Relative uptake alone cannot establish viability.']
 };
 const palettes={hot:[[20,13,26],[91,26,54],[190,61,53],[245,163,66],[255,244,180]],gray:[[14,20,26],[69,74,83],[127,132,139],[190,195,198],[251,251,249]],spectral:[[34,28,87],[34,65,142],[29,147,154],[151,203,111],[254,235,130]]};
 const levelOf=n=>levels.findIndex(l=>n>=l[1]&&n<=l[2]);
 const pair=(s,n)=>cases[s.scenario][2][n]||[baseline[n-1],baseline[n-1]];
 const rgb=a=>'rgb('+a.join(',')+')';
 function color(s,v){
  const stops=palettes[s.palette],t=Math.max(0,Math.min(100,v))*4/100,i=Math.min(3,Math.floor(t));
  return stops[i].map((a,j)=>Math.round(a+(stops[i+1][j]-a)*(t-i)));
 }
 function xy(cx,cy,r,a){
  const rad=a*Math.PI/180;
  return [cx+r*Math.sin(rad),cy-r*Math.cos(rad)].map(x=>Math.round(x*100)/100);
 }
 function sector(cx,cy,l,n,inner,outer,attrs){
  const count=l[2]-l[1]+1;
  if(count===1)return '<circle cx="'+cx+'" cy="'+cy+'" r="'+outer+'" '+attrs+'/>';
  const step=360/count,mid=-(n-l[1])*step,a=mid-step/2,b=mid+step/2;
  const d='M'+xy(cx,cy,outer,a)+' A'+outer+','+outer+' 0 0 1 '+xy(cx,cy,outer,b)+' L'+xy(cx,cy,inner,b)+' A'+inner+','+inner+' 0 0 0 '+xy(cx,cy,inner,a)+' Z';
  return '<path d="'+d+'" '+attrs+'/>';
 }
 function glyph(s,n,phase,cx,cy,inner,outer,overlay=false){
  const l=levels[levelOf(n)],count=l[2]-l[1]+1,val=pair(s,n)[phase],c=color(s,val);
  const pos=count===1?[cx,cy]:xy(cx,cy,(inner+outer)/2,-(n-l[1])*360/count);
  const textColor=.2126*c[0]+.7152*c[1]+.0722*c[2]>148?'#171b20':'#fff';
  const shp=attr=>sector(cx,cy,l,n,inner,outer,attr);
  return '<g data-pf-segment="'+n+'"><title>'+n+' · '+names[n-1]+' · '+val+'% '+(phase?'stress':'rest')+'</title>'+
   shp('class="pf-sector" fill="'+rgb(c)+'" opacity="'+(overlay?0.72:1)+'"')+
   (s.outline && cases[s.scenario][2][n] && val<baseline[n-1]-8?shp('class="pf-outline"'):'')+
   (s.segment===n?shp('class="pf-selection"'):'')+
   '<text x="'+pos[0]+'" y="'+pos[1]+'" text-anchor="middle" dominant-baseline="central" fill="'+textColor+'">'+n+'</text></g>';
 }
 function compass(cx,cy,top,bottom,left,right){
  return '<g class="pf-compass" text-anchor="middle"><text x="'+cx+'" y="'+top+'">Anterior</text><text x="'+cx+'" y="'+bottom+'">Inferior</text><text x="'+left+'" y="'+cy+'">Sept.</text><text x="'+right+'" y="'+cy+'">Lat.</text></g>';
 }
 function map(s,phase){
  let parts='';
  for(const l of levels)for(let n=l[1];n<=l[2];n++)parts+=glyph(s,n,phase,125,118,l[4],l[3]);
  const name=(phase?'Stress':'Rest')+' polar map';
  return '<figure class="pf-map"><figcaption>'+name+'</figcaption><svg viewBox="0 0 250 236" role="img" aria-label="'+name+'. Select any labeled region or use the segment menu.">'+compass(125,119,12,233,12,238)+parts+'</svg></figure>';
 }
 function slice(s){
  const i=levelOf(s.segment),l=levels[i],outer=[68,65,49,24][i],inner=[48,37,19,0][i],cx=132,cy=106;
  let shapes='';
  if(s.overlay){
   if(i<3){
    const rv=['M111 44 C66 34 35 41 23 67 C13 91 28 122 54 134 Q64 139 73 138 A68 68 0 0 1 111 44Z','M109 46 C68 40 41 48 32 69 C24 90 38 115 65 132 L72 133 A65 65 0 0 1 109 46Z','M111 62 Q76 61 65 78 Q57 92 75 108 L83 111 A49 49 0 0 1 111 62Z'][i];
    shapes+='<path d="'+rv+'" fill="#34414c" stroke="#9aa4aa" stroke-width="4"/>';
   }
   shapes+='<circle cx="'+cx+'" cy="'+cy+'" r="'+outer+'" fill="#939ba0" stroke="#c2cacc" stroke-width="3"/>';
   if(inner)shapes+='<circle cx="'+cx+'" cy="'+cy+'" r="'+inner+'" fill="#293640"/>';
  }
  for(let n=l[1];n<=l[2];n++)shapes+=glyph(s,n,s.phase==='stress'?1:0,cx,cy,inner,outer,s.overlay);
  if(s.overlay&&i<3){
   shapes+='<text class="pf-cavity" x="132" y="109" text-anchor="middle">LV</text>';
   if(i<2)shapes+='<text class="pf-cavity" x="54" y="88" text-anchor="middle">RV</text>';
   if(i===1)shapes+='<ellipse cx="150" cy="89" rx="4" ry="8" transform="rotate(35 150 89)" fill="#a2a9ad"/><ellipse cx="142" cy="131" rx="5" ry="7" transform="rotate(-32 142 131)" fill="#a2a9ad"/>';
  }
  return '<svg viewBox="0 0 265 214" role="img" aria-label="'+l[0]+' '+s.phase+' schematic. '+l[5]+'">'+compass(cx,110,16,202,20,245)+shapes+'</svg>';
 }
 function select(label,key,options,value){
  return '<label>'+label+'<select data-pf-field="'+key+'">'+Object.entries(options).map(([v,t])=>'<option value="'+v+'"'+(String(value)===v?' selected':'')+'>'+t+'</option>').join('')+'</select></label>';
 }
 function check(label,key,state){return '<label class="pf-check"><input type="checkbox" data-pf-field="'+key+'"'+(state?' checked':'')+'>'+label+'</label>'}
 const states=new WeakMap();
 function draw(host,s){
  const active=host.ownerDocument.activeElement;
  const restore=host.contains(active)?['pfField','pfPhase'].find(k=>active.dataset[k]):null;
  const selector=restore?'[data-'+(restore==='pfField'?'pf-field':'pf-phase')+'="'+active.dataset[restore]+'"]':'';
  const [artery,a]=Object.entries(arteries).find(([,r])=>r[2].includes(s.segment));
  const l=levels[levelOf(s.segment)],v=pair(s,s.segment);
  host.innerHTML='<section class="pf-module" aria-label="Myocardial perfusion"><header><h2>Myocardial perfusion</h2><p>Compare the same left ventricular segment at rest and during stress. These maps use simulated relative tracer uptake.</p></header>'+
   '<div class="pf-controls">'+select('Teaching case','scenario',Object.fromEntries(Object.entries(cases).map(([k,r])=>[k,r[0]])),s.scenario)+select('Color scale','palette',{hot:'Hot',gray:'Grayscale',spectral:'Spectral'},s.palette)+check('Outline reduced segments','outline',s.outline)+'</div>'+
   '<div class="pf-grid"><section class="pf-maps"><div class="pf-pair">'+map(s,0)+map(s,1)+'</div><div class="pf-scale"><span>0%</span><i style="background:linear-gradient(to right,'+palettes[s.palette].map(rgb).join(',')+')"></i><span>100%</span></div><p class="pf-caption">Relative tracer uptake on a common teaching scale. The basal ring is outermost and the cap is central. A solid cyan border marks your selection.</p></section>'+
   '<section class="pf-short"><div class="pf-shorthead"><h3>Short-axis level</h3><div class="pf-phases">'+['rest','stress'].map(p=>'<button data-pf-phase="'+p+'" aria-pressed="'+(p===s.phase)+'">'+(p==='rest'?'Rest':'Stress')+'</button>').join('')+'</div></div>'+slice(s)+
   '<div class="pf-slice-controls">'+select('Slice level','level',Object.fromEntries(levels.map((r,i)=>[i,r[0]])),levelOf(s.segment))+check('Anatomy overlay','overlay',s.overlay)+'</div><p class="pf-caption">'+l[5]+' The anatomical overlay is schematic.</p></section></div>'+
   '<div class="pf-readout">'+select('Selected segment','segment',Object.fromEntries(names.map((v,i)=>[i+1,(i+1)+' · '+v])),s.segment)+'<div class="pf-metrics" aria-live="polite"><span>Rest <strong>'+v[0]+'%</strong></span><span>Stress <strong>'+v[1]+'%</strong></span></div></div>'+
   '<div class="pf-explain"><section><h3>How to read this pattern</h3><p>'+cases[s.scenario][3]+'</p></section><section><h3>Coronary supply</h3><p>'+(s.segment===17?'The AHA diagram assigns the apical cap to the LAD. This is its most variable segment and any of the three major coronary arteries may supply it.':'The AHA teaching assignment for segment '+s.segment+' is the '+a[0].toLowerCase()+' ('+artery+'). The actual supply varies with coronary dominance and individual branch anatomy.')+'</p><div class="pf-links"><button data-open="heart|'+a[1]+'">Explore '+artery+' in 3D</button><button data-open="ref-heart|vh-heart-left-ventricle">Explore left ventricle</button></div></section></div>'+
   '<details class="pf-references"><summary>Model and sources</summary><p>The plots unfold the AHA 17-segment model of the left ventricle. Values are illustrative percentages of a common reference maximum. The optional dashed borders identify the reduced segments predefined for the selected condition. This simulation contains no patient scans or measured flow values.</p><a href="https://doi.org/10.1161/hc0402.102975" target="_blank" rel="noopener">AHA · Standardized myocardial segmentation</a><a href="https://doi.org/10.1007/s12350-018-1283-y" target="_blank" rel="noopener">ASNC · SPECT perfusion imaging guidelines</a><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5701596/" target="_blank" rel="noopener">Interpreting stress and rest perfusion maps · Open-access review</a></details></section>';
  if(selector)host.querySelector(selector)?.focus({preventScroll:true});
 }
 window.renderCardiaPerfusion=function(host){
  if(!host)return;
  let s=states.get(host);
  if(!s){
   s={scenario:'reversible',segment:7,palette:'hot',phase:'stress',outline:false,overlay:true};
   states.set(host,s);
   host.addEventListener('click',e=>{
    const el=e.target.closest('[data-pf-segment],[data-pf-phase]');
    if(!el||!host.contains(el))return;
    if(el.dataset.pfSegment)s.segment=Number(el.dataset.pfSegment);
    if(el.dataset.pfPhase)s.phase=el.dataset.pfPhase;
    draw(host,s);
   });
   host.addEventListener('change',e=>{
    const el=e.target,k=el.dataset.pfField;
    if(!k)return;
    if(k==='scenario'){s.scenario=el.value;s.segment=cases[el.value][1]}
    if(k==='segment')s.segment=Number(el.value);
    if(k==='palette')s.palette=el.value;
    if(k==='level'){
     const old=levels[levelOf(s.segment)],next=levels[Number(el.value)],n=next[2]-next[1]+1;
     s.segment=next[1]+Math.round((s.segment-old[1])*n/(old[2]-old[1]+1))%n;
    }
    if(k==='outline'||k==='overlay')s[k]=el.checked;
    draw(host,s);
   });
  }
  draw(host,s);
 };
})();
