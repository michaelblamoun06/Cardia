(() => {
'use strict';
const commons = name => 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(name.replaceAll(' ', '_'));
const cc = (kind, version) => 'https://creativecommons.org/licenses/' + kind + '/' + version + '/';
const cases = [
 {id:'embolus',title:'Pulmonary embolism',type:'CT angiography',region:'Pulmonary arteries',image:'pe-07',alt:'Axial pulmonary angiogram showing a dark, elongated filling defect spanning the pulmonary arterial bifurcation.',
  finding:'At the bifurcation, a ribbon of relatively low attenuation crosses the bright contrast column and extends into both pulmonary arteries. Follow the branches on adjacent axial images.',
  mechanism:'An embolus obstructs blood reaching ventilated alveoli. Those units develop a higher ventilation–perfusion ratio. A sufficiently large obstruction increases the pressure load on the right ventricle.',
  limit:'Saddle describes the shape and location of the clot. Hemodynamic severity also depends on the patient’s circulation and right ventricular response.',
  caption:'Axial CT pulmonary angiography, viewed from the feet. Patient right is on screen left. The viewer includes all 23 published frames.',marker:[54,53,16,6], markerText:'Central filling defect at the arterial bifurcation',source:'https://commons.wikimedia.org/wiki/Category:Pulmonary_embolism_-_CT_-_case_001',author:'Hellerhoff',license:'CC BY-SA 3.0',licenseURL:cc('by-sa','3.0'),read:['Imaging of acute pulmonary embolism', 'https://pubmed.ncbi.nlm.nih.gov/30057872/'],links:[['heart|pulmonary-trunk','Pulmonary trunk'],['heart|right-ventricle','Right ventricle']]},
 {id:'pleural-air',title:'Left pneumothorax',type:'Chest radiograph',region:'Pleural space',image:'pleural-air',alt:'Frontal expiratory radiograph with an arrow pointing to the edge of a partially collapsed left lung.',
  finding:'On screen right, the source arrow ends at the left visceral pleural line. Lung markings stop at that line. The space between it and the chest wall contains air.',
  mechanism:'Air in the pleural space reduces the pressure difference that keeps the lung expanded. Elastic recoil draws the lung inward and reduces ventilation on that side.',
  limit:'The comparison is an inspiratory PA radiograph from a different person. Inspiration and projection change lung volume and the appearance of the heart.',
  caption:'Frontal expiratory radiograph. The published arrow marks the edge of the left lung.',marker:[78,30,6,6],markerText:'Visceral pleural line on the patient’s left',source:commons('Expiration-left-side-pneumo.jpg'),author:'Mynameisderek',license:'Public domain dedication',licenseURL:'https://creativecommons.org/publicdomain/mark/1.0/',read:['Pneumothorax · NCBI Bookshelf','https://www.ncbi.nlm.nih.gov/books/NBK441885/'],links:[['lungs|visceral-pleura','Visceral pleura'],['lungs|left-upper-lobe','Left upper lobe']]},
 {id:'edema',title:'Cardiogenic pulmonary edema',type:'Chest radiograph',region:'Alveoli & interstitium',image:'edema',alt:'Frontal chest radiograph showing bilateral hazy airspace opacities in a case of cardiogenic pulmonary edema.',
  finding:'Hazy opacities are visible in both lungs, particularly near the hila. Normal air-filled lung appears darker. The publisher identifies this study as pulmonary edema during cardiogenic shock.',
  mechanism:'Elevated left-sided filling pressure can raise pulmonary venous and capillary hydrostatic pressure. Fluid enters the interstitium and then alveoli, reducing compliance and impairing oxygen transfer.',
  limit:'Many conditions can produce airspace opacity. The AP projection also magnifies the cardiac silhouette relative to a PA exposure.',
  caption:'AP chest radiograph. Tubes and leads project over the thorax.',marker:[33,43,12,11],markerText:'Example of perihilar opacity in the patient’s right lung',source:commons('Lungenoedem bei kardiogenem Schock 73M - CR ap - 001.jpg'),author:'Hellerhoff',license:'CC BY-SA 4.0',licenseURL:cc('by-sa','4.0'),read:['Pulmonary edema · NCBI Bookshelf','https://www.ncbi.nlm.nih.gov/books/NBK557611/'],links:[['heart|left-atrium','Left atrium'],['alveoli|alveolar-capillaries','Alveolar capillaries']]},
 {id:'dissection',title:'Aortic dissection',type:'Contrast CT',region:'Thoracic aorta',image:'dissection',alt:'Axial contrast CT with a source arrow at a flap in the ascending aorta.',
  finding:'A thin curved flap divides the contrast-filled ascending aorta into two channels. Involvement of the ascending aorta defines Stanford type A. The separate comparison example is a type B dissection of the descending thoracic aorta.',
  mechanism:'Blood entering the aortic media separates layers of the wall and creates a false lumen. Compression of the true lumen or involvement of a branch origin can reduce downstream perfusion.',
  limit:'A complete study establishes the extent of dissection and branch involvement. The source image alone does not establish which branches receive blood from either lumen.',
  caption:'Axial contrast-enhanced CT. The published arrow points to the ascending aortic flap.',marker:[46,31,9,6],markerText:'Ascending aortic flap',source:commons('DissectionCT.png'),author:'James Heilman, MD',license:'CC BY-SA 3.0',licenseURL:cc('by-sa','3.0'),read:['Aortic dissection · NCBI Bookshelf','https://www.ncbi.nlm.nih.gov/books/NBK441963/'],links:[['heart|aorta','Aorta'],['vessels|thoracic-aorta','Thoracic aorta']]},
 {id:'effusion',title:'Pericardial effusion',type:'Echocardiography',region:'Pericardial space',image:'effusion',alt:'Echocardiographic still with an arrow pointing to an echo-free band around the heart.',
  finding:'Find the dark band between the surface of the heart and the bright outer pericardial boundary. The source arrow indicates fluid in the pericardial space.',
  mechanism:'As pericardial pressure rises, it can limit diastolic filling. The effect depends on how rapidly fluid accumulates and how well the pericardium can stretch.',
  limit:'An effusion alone does not establish tamponade. Dynamic chamber motion, respiratory flow variation and the clinical circulation provide additional evidence.',
  caption:'Cardiac ultrasound still. The arrow is part of the source image.',marker:[29,81,9,6],markerText:'Echo-free pericardial fluid',source:commons('PericardialeffusionUS.PNG'),author:'James Heilman, MD',license:'CC BY-SA 3.0',licenseURL:cc('by-sa','3.0'),read:['Pericardial disease · NCBI Bookshelf','https://www.ncbi.nlm.nih.gov/books/NBK2211/'],links:[['heart|right-atrium','Right atrium'],['heart|right-ventricle','Right ventricle']]},
 {id:'perfusion',title:'Stress myocardial perfusion',type:'Cardiac MRI',region:'Basal inferoseptum',image:'mri-short-stress',alt:'Stress perfusion MR image of the basal left ventricle, with the published arrow indicating a subendocardial perfusion abnormality.',
  finding:'On stress perfusion imaging a darker subendocardial band is most conspicuous along the basal inferoseptum. Compare stress with rest, then view late enhancement in the same plane.',
  mechanism:'First-pass contrast delivery can become relatively reduced in a region when demand rises. The authors described impaired myocardial perfusion in Friedreich ataxia without obstructive epicardial coronary disease.',
  limit:'The source reported no corresponding late enhancement. A stress perfusion defect alone does not locate an obstructed epicardial artery.',
  caption:'Published cardiac MRI figure. The horizontal long-axis and basal short-axis views each include stress, rest and late enhancement images.',source:commons('Friedreich.jpg'),author:'S. V. Raman, J. A. Dickerson & R. Al-Dahhak',license:'CC BY 2.0',licenseURL:cc('by','2.0'),read:['Original cardiac MRI case · Raman et al.','https://doi.org/10.1186/1532-429X-10-15'],links:[['heart|left-ventricle','Left ventricle'],['heart|interventricular-septum','Interventricular septum']]},
 {id:'nodule',title:'FDG-avid pulmonary nodule',type:'PET/CT',region:'Right middle lobe',image:'pet-fused',alt:'Fused axial FDG PET/CT shows a bright focus in a peripheral right middle lobe nodule.',
  finding:'Switch between lung-window CT and the published fused PET/CT. The same peripheral nodule in the right middle lobe has a spiculated outline on CT and intense FDG uptake on PET.',
  mechanism:'FDG uptake reflects glucose use. Active inflammation can be FDG-avid as well as malignancy. In this published case, histology of the larger peripheral lesion showed a tuberculoma.',
  limit:'This source figure illustrates localization and tissue diagnosis. The color scale in its fused panel does not provide a numerical standardized uptake value.',
  caption:'Figure 13 b–c. The CT and fused PET/CT panels show the same lesion in the same individual.',marker:[25,30,6,7],markerText:'Peripheral right middle lobe lesion',source:'https://doi.org/10.1007/s13244-017-0581-2',author:'A. Snoeckx, P. Reyntiens, D. Desbuquoit, M. J. Spinhoven, P. E. Van Schil, J. P. van Meerbeeck & P. M. Parizel',license:'CC BY 4.0',licenseURL:cc('by','4.0'),read:['Pulmonary nodule morphology · Snoeckx et al.','https://doi.org/10.1007/s13244-017-0581-2'],links:[['lungs|right-middle-lobe','Right middle lobe'],['lungs|visceral-pleura','Visceral pleura']]},
 {id:'spect',title:'Normal myocardial perfusion',type:'Nuclear perfusion',region:'Left ventricular myocardium',image:'normal-perfusion',alt:'Published nuclear myocardial perfusion panels showing a normal distribution of tracer in the left ventricular myocardium.',
  finding:'Follow corresponding myocardial segments across the displayed slices. The source identifies this as a normal myocardial perfusion study, without a regional defect.',
  mechanism:'The myocardium takes up perfusion tracer in relation to delivery and tracer extraction. A regional difference between stress and rest may indicate an inducible flow limitation.',
  limit:'These display colors map relative counts. They do not measure oxygen saturation. Attenuation, motion and relative normalization can influence interpretation.',
  caption:'Nuclear myocardial perfusion study. The original tracer colors are preserved.',source:commons('Nuclear medicine myocardial perfusion scan of normal heart muscle.jpg'),author:'Sincefalastrum',license:'CC BY-SA 4.0',licenseURL:cc('by-sa','4.0'),read:['Myocardial perfusion imaging · EACVI consensus','https://pmc.ncbi.nlm.nih.gov/articles/PMC12096082/'],links:[['heart|left-ventricle','Left ventricle'],['heart|left-coronary-artery','Left coronary artery']]}
];
const normal={image:'normal-pa',alt:'Reference PA chest radiograph of a different person, with clear lung fields.',label:'Normal PA chest · separate individual',source:commons('Normal posteroanterior (PA) chest radiograph (X-ray).jpg'),author:'Mikael Häggström',license:'CC0 1.0',licenseURL:'https://creativecommons.org/publicdomain/zero/1.0/'};
const descending={image:'descending',alt:'Separate contrast CT case with red outlines over the descending thoracic aorta in axial and coronal planes.',label:'Stanford type B · separate individual',source:commons('Descending (Type B Stanford) Aortic Dissection.PNG'),author:'JasonRobertYoungMD',license:'CC BY-SA 4.0',licenseURL:cc('by-sa','4.0')};
const trials=[
 ['embolus','Both lungs receive ventilation. Pulmonary angiography shows an intraluminal defect straddling the point where the two major arteries diverge. Where is the obstruction?',['Aortic arch','Pulmonary arterial bifurcation','Left atrial appendage','Coronary sinus'],1,'The pulmonary trunk bifurcates into right and left pulmonary arteries. Obstruction here can reduce perfusion to both lungs.'],
 ['pleural-air','A frontal chest radiograph shows a sharp line on screen right with no peripheral lung markings beyond it. The patient is facing you. Where has air collected?',['Right pleural space','Left upper-lobe bronchus','Left pleural space','Pericardial space'],2,'Screen right corresponds to the patient’s left. Air external to the visceral pleural line occupies the pleural space.'],
 ['edema','Left atrial pressure rises and fluid first crosses the pulmonary capillary barrier. Which compartment subsequently fills to produce airspace opacity?',['Pleural cavity','Bronchial arteries','Pericardial cavity','Alveolar airspaces'],3,'Pulmonary edema begins in the interstitial compartment and can progress into alveoli, displacing gas.'],
 ['dissection','Contrast CT shows a mobile-looking flap dividing the ascending aorta. Which finding defines the Stanford class in this description?',['Involvement of the ascending aorta','Width of the aortic arch','Caliber of the descending aorta','Direction of coronary blood flow'],0,'Any dissection involving the ascending aorta is Stanford type A, regardless of extension beyond it.'],
 ['effusion','A dark fluid collection follows the outer contour of the heart on echocardiography. If its pressure rises, right heart filling can become impaired. Locate the fluid.',['Left ventricular blood pool','Pericardial cavity','Right pleural cavity','Pulmonary capillary bed'],1,'The pericardial cavity lies between the visceral and parietal layers of serous pericardium. Pressure in this space can restrict diastolic filling.'],
 ['perfusion','On a basal short-axis cardiac MR image, stress contrast delivery falls along the inner part of the wall separating the ventricles inferiorly. Which tissue is affected?',['Aortic adventitia','Left atrial appendage','Basal inferoseptal subendocardium','Mitral chordae'],2,'The septum separates the ventricles. Subendocardial myocardium lies next to the chamber lumen.'],
 ['nodule','A lesion lies beneath the pleura in the pulmonary lobe bounded by the right horizontal and oblique fissures. Which lobe contains it?',['Right lower lobe','Left upper lobe','Right upper lobe','Right middle lobe'],3,'The right middle lobe lies between the horizontal and oblique fissures. The lingula is part of the left upper lobe.'],
 ['spect','A nuclear perfusion study shows ring-shaped myocardial uptake on short-axis views. Which tissue accounts for most of this ring?',['Left ventricular myocardium','Pericardial fat','Aortic root','Left atrial wall'],0,'Short-axis sections through the left ventricular body cut across its muscular wall. Relative tracer uptake reflects regional perfusion.']
];
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const source=(u,t)=>'<a href="'+esc(u)+'" target="_blank" rel="noopener">'+esc(t)+'</a>';
const credit=c=>'<p>'+esc(c.author)+' · '+source(c.source,'Original image or series')+' · '+source(c.licenseURL,c.license)+'</p>';
const initial=()=>({id:'embolus',mode:'images',frame:7,plane:'short',sequence:'stress',fusion:'fused',compare:false,mark:false,contrast:100,large:false,order:[],at:0,answers:[],done:false});
const byId=new Map(cases.map(c=>[c.id,c]));
const axialFrames=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
let host=null,state=initial();
const base='assets/clinical/';
const push=(action,label,active=false)=>'<button type="button" data-cli="'+action+'" aria-pressed="'+active+'">'+esc(label)+'</button>';
const steps={stress:'Stress perfusion',rest:'Rest perfusion',late:'Late enhancement'};
const bt=(a,l)=>'<button type="button" data-cli="'+a+'">'+esc(l)+'</button>';
function prepare(id){
 const mode=state.mode;state={...state,id,mode,frame:7,plane:'short',sequence:'stress',fusion:'fused',mark:false,compare:false,contrast:100,large:false};
}
function startGame(){
 const order=trials.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}
 Object.assign(state,{mode:'localize',order,at:0,answers:[],done:false});
}
function currentImage(c){
 if(c.id==='embolus')return 'pe-'+String(state.frame).padStart(2,'0');
 if(c.id==='perfusion')return 'mri-'+state.plane+'-'+state.sequence;
 if(c.id==='nodule')return 'pet-'+state.fusion;
 return c.image;
}
function figure(img,alt,label,marker){
 return '<figure class="cli-figure"><div class="cli-frame"><div class="cli-picture"><img src="'+base+img+'.webp" alt="'+esc(alt)+'" style="filter:contrast('+state.contrast+'%)">'+(marker?'<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="'+marker[0]+'" cy="'+marker[1]+'" rx="'+marker[2]+'" ry="'+marker[3]+'"/></svg>':'')+'</div></div><figcaption>'+esc(label)+'</figcaption></figure>';
}
function comparison(c){
 if(['pleural-air','edema'].includes(c.id))return normal;
 if(c.id==='dissection')return descending;
 if(c.id==='perfusion'){const s=state.sequence==='stress'?'rest':'stress';return {image:'mri-'+state.plane+'-'+s,alt:steps[s]+' in the same subject and plane.',label:steps[s]+' · same individual'}}
 if(c.id==='nodule'){const isCT=state.fusion==='ct';return {image:isCT?'pet-fused':'pet-ct',alt:isCT?'Fused FDG PET/CT of the corresponding lesion.':'Lung-window CT of the corresponding lesion.',label:isCT?'Fused PET/CT · same individual':'Lung-window CT · same individual'}}
 return null;
}
function scan(c){
 const compare=comparison(c);const pe=c.id==='embolus',mri=c.id==='perfusion',pet=c.id==='nodule';const compareVisible=compare&&state.compare;
 const srcName=pe?'Axial series · image '+state.frame+' / 23':mri?(state.plane==='short'?'Basal short axis':'Horizontal long axis')+' · '+steps[state.sequence]:pet?(state.fusion==='ct'?'Lung-window CT':'Fused FDG PET/CT'):c.type;
 const alt=pe?'Axial contrast CT image '+state.frame+' from a series demonstrating pulmonary embolism.':mri?srcName+' showing the published cardiac MRI study.':pet?srcName+' through the right middle lobe nodule.':c.alt;
 const marker=state.mark&&(!pe||state.frame===7)&&(!pet||state.fusion==='fused')?c.marker:null;
 const images=figure(currentImage(c),alt,srcName,marker)+(compareVisible?figure(compare.image,compare.alt,compare.label):'');
 const options=push('large',state.large?'Reduce image':'Enlarge image',state.large)+(compare?push('compare','Compare images',state.compare):'')+(c.marker?push('mark',pe?'Mark finding on image 7':'Mark finding',state.mark):'');
 return '<div class="cli-grid'+(state.large?' cli-large':'')+'"><div class="cli-view"><div class="cli-title"><span>'+esc(c.type)+'</span><h3>'+esc(c.title)+'</h3></div>'+
 '<div class="cli-film '+(compareVisible?'cli-pair':'')+'">'+images+'</div>'+
 (pe?'<div class="cli-series">'+bt('previous','Previous slice')+'<label>Axial image <output>'+state.frame+' / 23</output><input type="range" data-cli-range="frame" aria-label="Axial image position" aria-valuetext="Source image '+state.frame+' of 23" min="1" max="'+axialFrames.length+'" value="'+(axialFrames.indexOf(state.frame)+1)+'"></label>'+bt('next','Next slice')+'</div>':'')+
 (mri?'<div class="cli-bank" aria-label="Cardiac MR plane">'+push('plane:short','Basal short axis',state.plane==='short')+push('plane:long','Horizontal long axis',state.plane==='long')+'</div><div class="cli-bank" aria-label="Cardiac MR sequence">'+Object.keys(steps).map(k=>push('sequence:'+k,steps[k],state.sequence===k)).join('')+'</div>':'')+
 (pet?'<div class="cli-bank" aria-label="Acquisition">'+push('fusion:ct','Lung-window CT',state.fusion==='ct')+push('fusion:fused','Fused FDG PET/CT',state.fusion==='fused')+'</div>':'')+
 '<div class="cli-controls"><div class="cli-bank">'+options+'</div><label>Display contrast <input type="range" data-cli-range="contrast" aria-label="Display contrast" min="70" max="145" value="'+state.contrast+'"><output>'+state.contrast+'%</output></label>'+bt('reset','Reset view')+'</div>'+
 '<p class="cli-caption">'+esc(c.caption)+(marker?' <b>'+esc(c.markerText)+'.</b>':'')+'</p></div>'+
 '<aside class="cli-info"><h4>What to look for</h4><p>'+esc(c.finding)+'</p><h4>Physiology</h4><p>'+esc(c.mechanism)+'</p><h4>Interpretation</h4><p>'+esc(c.limit)+'</p><h4>Explore in 3D</h4><div class="cli-bank">'+c.links.map(l=>'<button data-open="'+l[0]+'">'+esc(l[1])+'</button>').join('')+'</div>'+
 '<details><summary>Image credits &amp; reading</summary>'+credit(c)+(compareVisible&&compare.source?credit(compare):'')+'<p>Images are resized or converted to WebP. The MRI and PET/CT figures are separated into published panels. Display margins are cropped on the ultrasound and nuclear study. The added green outlines mark regions of interest. Source arrows are retained.</p><p>'+source(c.read[1],c.read[0])+'</p></details></aside></div>';
}
function game(){
 const score=state.answers.reduce((s,v,i)=>s+Number(v===trials[state.order[i]][3]),0);
 if(state.done)return '<div class="cli-game"><h3>Localization results</h3><p class="cli-score">'+score+' / '+trials.length+' correct</p><ul class="cli-review">'+state.order.map((k,i)=>'<li><span>'+esc(byId.get(trials[k][0]).title)+'</span><strong>'+(state.answers[i]===trials[k][3]?'Correct':'Review')+'</strong> '+bt('case:'+trials[k][0],'View study')+'</li>').join('')+'</ul>'+bt('restart','New round')+'</div>';
 const t=trials[state.order[state.at]],val=state.answers[state.at],locked=val!==undefined;
 return '<div class="cli-game"><p class="cli-meta">Case '+(state.at+1)+' of '+state.order.length+'</p><h3>Localize the finding</h3><p class="cli-question">'+esc(t[1])+'</p><div class="cli-answers">'+t[2].map((ans,i)=>'<button type="button" data-cli="answer:'+i+'" '+(locked?'disabled ':'')+'class="'+(locked&&i===t[3]?'cli-right':locked&&i===val?'cli-miss':'')+'">'+esc(ans)+'</button>').join('')+'</div>'+
 (locked?'<div class="cli-feedback" role="status"><strong>'+(val===t[3]?'Correct.':'The best location is '+esc(t[2][t[3]])+'.')+'</strong> '+esc(t[4])+'</div><div class="cli-bank">'+bt('advance',state.at===trials.length-1?'View results':'Next case')+bt('case:'+t[0],'See the corresponding study')+'</div>':'')+'</div>';
}
function paint(){
 if(!host)return;const c=byId.get(state.id);
 const menu='<label class="cli-menu">Imaging study<select data-cli-select="case">'+cases.map((a,i)=>'<option value="'+a.id+'" '+(a.id===state.id?'selected':'')+'>'+esc(a.title+' · '+a.type)+'</option>').join('')+'</select></label>';
 host.innerHTML='<section class="clinical-room"><div class="cli-strip"><div class="cli-bank">'+push('images','Image library',state.mode==='images')+push('localize','Localization challenge',state.mode==='localize')+'</div>'+(state.mode==='images'?menu:'')+'</div>'+(state.mode==='images'?scan(c):game())+'</section>';
}
function handle(action){
 const [key,arg]=action.split(':');
 if(key==='images')state.mode='images';
 else if(key==='localize'){if(!state.order.length)startGame();else state.mode='localize'}
 else if(key==='case'){if(!byId.has(arg))return;prepare(arg);state.mode='images'}
 else if(key==='mark'){state.mark=!state.mark;if(state.mark&&state.id==='embolus')state.frame=7;if(state.mark&&state.id==='nodule')state.fusion='fused'}
 else if(key==='compare')state.compare=!state.compare;
 else if(key==='large')state.large=!state.large;
 else if(key==='previous'||key==='next'){state.frame=axialFrames[Math.min(axialFrames.length-1,Math.max(0,axialFrames.indexOf(state.frame)+(key==='next'?1:-1)))];state.mark=false}
 else if(key==='plane'||key==='sequence'||key==='fusion'){state[key]=arg;state.mark=false}
 else if(key==='reset')prepare(state.id);
 else if(key==='restart')startGame();
 else if(key==='answer'){if(state.answers[state.at]!==undefined)return;state.answers[state.at]=Number(arg)}
 else if(key==='advance'){if(state.answers[state.at]===undefined)return;if(state.at===trials.length-1)state.done=true;else state.at++}
 paint();
}
window.renderCardiaClinical=(container,options={})=>{
 host=container;if(!host)return;
 const desired=typeof options==='string'?options:options?.id;
 if(desired==='localize'){if(!state.order.length)startGame();else state.mode='localize'}else if(byId.has(desired)){prepare(desired);state.mode='images'}
 if(!host.dataset.clinicalBound){
  host.dataset.clinicalBound='true';
  host.addEventListener('click',e=>{const b=e.target.closest('[data-cli]');if(b&&host.contains(b))handle(b.dataset.cli)});
  host.addEventListener('change',e=>{if(e.target.dataset.cliSelect==='case')handle('case:'+e.target.value)});
  host.addEventListener('input',e=>{const control=e.target,key=control.dataset.cliRange;if(!key)return;state[key]=key==='frame'?axialFrames[Number(control.value)-1]:Number(control.value);
   if(key==='frame'){state.mark=false;control.setAttribute('aria-valuetext','Source image '+state.frame+' of 23');const img=host.querySelector('.cli-picture img');img.src=base+currentImage(byId.get(state.id))+'.webp';img.alt='Axial contrast CT image '+state.frame+' of the pulmonary embolism series.';host.querySelector('.cli-figure figcaption').textContent='Axial series · image '+state.frame+' / 23';host.querySelector('.cli-series output').textContent=state.frame+' / 23';host.querySelector('.cli-picture svg')?.remove();host.querySelector('[data-cli="mark"]')?.setAttribute('aria-pressed','false');host.querySelector('.cli-caption b')?.remove()}
   if(key==='contrast'){for(const img of host.querySelectorAll('.cli-picture img'))img.style.filter='contrast('+state.contrast+'%)';control.parentElement.querySelector('output').textContent=state.contrast+'%'}
  });
 }
 paint();
};
window.cardClinicalSearch=()=>[...cases.map(c=>({title:c.title,description:c.type+' · '+c.region,open:()=>handle('case:'+c.id)})),{title:'Localization challenge',description:'Clinical cases · finding localization',open:()=>handle('localize')}];
})();
