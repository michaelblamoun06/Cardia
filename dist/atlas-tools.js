'use strict';
window.bindAtlasTools=function(api){
 const {all,sceneMap,viewState,showDialog,closeDialog,navigate,openEntry,startTour,learn,quiz,esc}=api;
 const dialog=document.querySelector('#dialog'),body=document.querySelector('#dialog-body');
 let hits=[],link='',present=false,busy=false;
 const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const item=(title,description,open,group='Tool')=>({title,description,open,group});
 function search(){
  const rows=[
   item('Heart slices','Explore five planes and locate a slice in 3D.',()=>navigate('sections',true,['heart'])),
   item('Lung slices','Axial, coronal and sagittal sections.',()=>navigate('sections',true,['lungs'])),
   item('Clinical imaging','CT, radiographs, echocardiography, MRI and PET/CT.',()=>navigate('clinical',true,['cases'])),
   item('Myocardial perfusion','Compare stress and rest uptake across 17 segments.',()=>navigate('clinical',true,['perfusion'])),
   item('Practice lab','Identify a structure or interrupt a pathway.',()=>navigate('practical')),
   item('Physiology lab','Pressure, volume, ventilation and oxygen transport.',()=>navigate('physiology')),
   item('Knowledge check','Test yourself on cardiovascular and pulmonary anatomy.',quiz)];
  for(const [fn,group,go] of [['cardLearningSearch','Study room',learn],['cardClinicalSearch','Clinical case',()=>navigate('clinical',true,['cases'])],['cardPracticalSearch','Practice lab',()=>navigate('practical')]]){
   for(const r of window[fn]?.()||[])rows.push(item(r.title,r.description,()=>{go();r.open()},group));
  }
  atlasPaths.forEach((p,i)=>rows.push(item(p.title,p.desc,()=>startTour(i),'Guided pathway')));
  for(const e of all)rows.push(item(e.name,[sceneMap[e.scene].sourceGroup||'Teaching model',sceneMap[e.scene].region,e.type].join(' · '),()=>openEntry(e.scene,e.id),'Structure'));
  showDialog('Search the atlas','<label class="searchbox">'+icon('search')+'<input type="search" placeholder="Structure, case, pathway or lesson" aria-label="Search the whole atlas"></label><p class="tool-count" role="status"></p><div class="tool-results"></div>');
  const input=body.querySelector('input');
  function filter(){
   const q=norm(input.value).trim().split(/\s+/).filter(Boolean);
   const score=r=>{const title=norm(r.title),info=norm(r.description+' '+r.group);if(!q.length)return 1;if(!q.every(k=>title.includes(k)||info.includes(k)))return 0;return q.reduce((n,k)=>n+(title===k?90:title.startsWith(k)?35:title.includes(k)?15:1),0)};
   const found=rows.map(r=>({r,n:score(r)})).filter(x=>x.n).sort((a,b)=>b.n-a.n);
   hits=found.slice(0,q.length?32:7).map(x=>x.r);
   body.querySelector('.tool-count').textContent=q.length?found.length+' matches'+(found.length>32?' · First 32 shown':''):'Jump to a tool';
   body.querySelector('.tool-results').innerHTML=hits.map((r,i)=>'<button data-tool-hit="'+i+'"><strong>'+esc(r.title)+'</strong><small>'+esc(r.group)+' · '+esc(r.description)+'</small></button>').join('')||'<p>Try another structure or topic.</p>';
  }
  input.oninput=filter;filter();input.focus();
 }
 function currentLink(){
  const s=viewState(),u=new URL(location.href);
  if(s.page==='explorer')u.hash=s.tour?'pathway/'+s.tour.i+'/'+s.tour.n:'explorer/'+s.scene+'/'+s.id;return u.href;
 }
 function classroom(){
  const options=[['share','Share this view','Copy a link or scan a QR code.'],['present','Presentation view','Expand the atlas for a classroom display.'],['guide','Instructor guide','Open teaching stations and lesson plans.'],['report','Record an issue','Export a correction for the atlas owner.'],['offline','Offline access','Save or remove a copy on this device.']];
  showDialog('Classroom tools','<div class="class-grid">'+options.map(([k,t,d])=>'<button data-class-tool="'+k+'"><strong>'+t+'</strong><small>'+d+'</small></button>').join('')+'</div>');
 }
 function share(){link=currentLink();const qr=qrcode(0,'M');qr.addData(link);qr.make();showDialog('Share this view','<div class="share-qr" role="img" aria-label="QR code for this atlas view">'+qr.createSvgTag({scalable:true,margin:14})+'</div><p>Scan the code to open this view. Access follows the site’s sharing settings.</p><input class="permalink" aria-label="Atlas view link" readonly value="'+esc(link)+'"><button class="solid" data-class-tool="copy">Copy link</button><p role="status" class="class-status"></p>')}
 function report(){
  link=currentLink();showDialog('Record an issue','<form class="report-form"><p>Include the structure, the correction, and a source if available. Download the report to share with your reviewer.</p><label>Area<select name="area"><option>Structure label</option><option>Geometry</option><option>Physiology</option><option>Imaging or study content</option><option>App behavior</option></select></label><label>Correction<textarea required name="detail" rows="4"></textarea></label><label>Source<input name="reference"></label><button class="solid">Download report</button><p class="class-status" role="status"></p></form>');
  body.querySelector('form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),a=document.createElement('a');const contents=['Cardia atlas correction',new Date().toISOString(),link,f.get('area'),f.get('detail'),f.get('reference')].filter(Boolean).join('\n\n');const u=URL.createObjectURL(new Blob([contents],{type:'text/plain'}));a.href=u;a.download='Cardia-review.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),3000);body.querySelector('.class-status').textContent='Report downloaded.'};
 }
 const exit=document.createElement('button');exit.className='present-exit';exit.textContent='Exit presentation';exit.hidden=true;document.body.append(exit);
 function presentation(on){present=on;closeDialog();document.body.classList.toggle('atlas-presents',on);exit.hidden=!on;if(on)document.documentElement.requestFullscreen?.().catch(()=>{});if(!on&&document.fullscreenElement)document.exitFullscreen?.().catch(()=>{})}
 exit.onclick=()=>presentation(false);document.addEventListener('fullscreenchange',()=>{if(present&&!document.fullscreenElement)presentation(false)});
 async function offline(){
  const can='serviceWorker' in navigator&&'caches' in window&&isSecureContext;let saved=false;try{saved=can&&await caches.has('cardia-atlas-offline-v3')}catch{}
  showDialog('Offline access','<p>Save the models, images and lessons on your personal device. External reading links require an internet connection.</p><p class="class-status" role="status">'+(!can?'Offline storage is unavailable in this browser.':saved?'An offline copy is saved.':'No offline copy saved on this device.')+'</p><div class="action-row"><button class="solid" data-class-tool="save-offline" '+(!can?'disabled':'')+'>'+(saved?'Refresh copy':'Save offline copy')+'</button>'+(saved?'<button class="outline" data-class-tool="remove-offline">Remove copy</button>':'')+'</div>');
 }
 async function saveOffline(remove){
  if(busy)return;busy=true;const name='cardia-atlas-offline-v3',temp='cardia-preparing-'+Date.now(),status=body.querySelector('.class-status');
  try{if(remove){await caches.delete(name);const r=await navigator.serviceWorker.getRegistration('./');await r?.unregister()}
   else{await navigator.serviceWorker.register('./offline.js');await navigator.serviceWorker.ready;const files=await fetch('offline-files.json',{cache:'reload'}).then(r=>r.json());const stage=await caches.open(temp);
    for(let i=0;i<files.length;i+=5){await Promise.all(files.slice(i,i+5).map(async f=>{const u=new URL(f,document.baseURI),r=await fetch(u,{cache:'reload'});if(!r.ok||r.redirected||(f!=='index.html'&&r.headers.get('Content-Type')?.includes('text/html')))throw Error();await stage.put(u,r)}));status.textContent='Saving '+Math.min(i+5,files.length)+' of '+files.length+' files…'}
    const cache=await caches.open(name);for(const key of await stage.keys())await cache.put(key,await stage.match(key));
   }if(body.contains(status)&&dialog.open)await offline()
  }catch{status.textContent='Could not save the copy. Check available storage and your connection.'}finally{await caches.delete(temp);busy=false}
 }
 body.addEventListener('click',async e=>{
  const hit=e.target.closest('[data-tool-hit]');if(hit){const r=hits[Number(hit.dataset.toolHit)];if(r){closeDialog();r.open()}return}
  const tool=e.target.closest('[data-class-tool]')?.dataset.classTool;
  if(tool==='share')share();if(tool==='report')report();if(tool==='guide'){closeDialog();learn();openCardiaLearningTool('instructor')}
  if(tool==='present')presentation(true);if(tool==='offline')offline();if(tool==='save-offline'||tool==='remove-offline')saveOffline(tool==='remove-offline');
  if(tool==='copy'){let ok=false;try{await navigator.clipboard.writeText(link);ok=true}catch{body.querySelector('.permalink').select();ok=document.execCommand('copy')}body.querySelector('.class-status').textContent=ok?'Link copied.':'Select and copy the link.'}
 });
 document.addEventListener('keydown',e=>{if(present&&e.key==='Escape')presentation(false);if(e.key==='/'&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&!dialog.open&&!e.target.closest('input,textarea,select,canvas,[contenteditable]')){e.preventDefault();search()}});
 return {search,classroom};
};
