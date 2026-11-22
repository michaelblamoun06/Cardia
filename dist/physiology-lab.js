(() => {
  'use strict';
  const tabs = [
    ['loop','ECG & pressure–volume'], ['pvr','Pulmonary resistance'], ['vent','Alveolar ventilation'], ['oxygen','Oxygen delivery']
  ];
  const defaults = {
    loop:{edv:120,esv:50,phase:0,rate:75,t:0,beat:0,lead:'II'},
    pvr:{pap:15,wedge:8,flow:5},
    vent:{vt:500,dead:150,rate:12},
    oxygen:{hb:15,sat:98,po2:100,flow:5}
  };
  const definitions = {
    loop:{
      title:'Left ventricular pressure–volume loop',
      prompt:'Play or scrub one heartbeat to follow the ECG, valve events and pressure–volume loop together.',
      scale:'Pressure and volume during one beat',
      controls:[['edv','End-diastolic volume',80,180,1,'mL'],['esv','End-systolic volume',20,70,1,'mL'],['rate','Heart rate',45,150,1,'bpm']],
      assumptions:'One idealized left ventricular beat with competent valves and forward flow. The ECG is simulated. Heart rate scales the beat duration uniformly, while the pressure landmarks stay fixed. Changes in rate and volume do not model compensatory physiology.',
      links:[['heart|left-ventricle','Left ventricle'],['heart|mitral-valve','Mitral valve'],['heart|aortic-valve','Aortic valve']],
      refs:[['OpenStax · ECG and the cardiac cycle','https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity'],['NCBI Bookshelf · Cardiac cycle','https://www.ncbi.nlm.nih.gov/books/NBK459327/'],['NCBI Bookshelf · Cardiac physiology','https://www.ncbi.nlm.nih.gov/books/NBK526089/']]
    },
    pvr:{
      title:'Pulmonary vascular resistance',
      prompt:'Adjust the upstream pressure, downstream pressure and flow. Watch how the same pressure difference can imply different resistances.',
      scale:'Pressures across the pulmonary circulation',
      controls:[['pap','Mean pulmonary arterial pressure',10,60,1,'mmHg'],['wedge','Pulmonary arterial wedge pressure',2,s=>Math.min(35,s.pap-1),1,'mmHg'],['flow','Pulmonary blood flow',1.5,10,.25,'L/min']],
      assumptions:'A steady forward-flow example without a significant shunt. Cardiac output equals pulmonary blood flow, and wedge pressure approximates mean left atrial pressure. Wedge pressure stays below the mean pulmonary arterial pressure in this exercise.',
      links:[['heart|pulmonary-trunk','Pulmonary trunk'],['lungs|right-pulmonary-artery','Right pulmonary artery'],['heart|left-atrium','Left atrium']],
      refs:[['ESC/ERS · Pulmonary haemodynamic measurements, Table 11','https://doi.org/10.1183/13993003.00879-2022']]
    },
    vent:{
      title:'Alveolar ventilation and dead space',
      prompt:'Try three patterns that move six liters per minute. How much fresh gas reaches perfused gas-exchange regions?',
      scale:'Ventilation per minute',
      controls:[['vt','Tidal volume',200,900,10,'mL/breath'],['dead','Physiologic dead space',50,s=>Math.min(700,s.vt),10,'mL/breath'],['rate','Respiratory rate',6,36,1,'breaths/min']],
      assumptions:'Volume and physiologic dead space are held constant from breath to breath. Physiologic dead space includes conducting-airway gas and ventilation of non-exchanging alveoli. In this model it cannot exceed tidal volume.',
      links:[['lungs|trachea','Trachea'],['alveoli|terminal-bronchiole','Terminal bronchiole'],['alveoli|alveoli','Alveoli']],
      refs:[['NCBI Bookshelf · Tidal volume and alveolar ventilation','https://www.ncbi.nlm.nih.gov/books/NBK482502/'],['NCBI Bookshelf · Lung dead space','https://www.ncbi.nlm.nih.gov/books/NBK482501/']]
    },
    oxygen:{
      title:'Systemic oxygen delivery',
      prompt:'Keep oxygen saturation constant, then lower hemoglobin or cardiac output. Which change reduces oxygen content, and which reduces blood flow?',
      scale:'Oxygen carried in arterial blood',
      controls:[['hb','Hemoglobin concentration',4,20,.5,'g/dL'],['sat','Arterial oxygen saturation',60,100,1,'%'],['po2','Arterial oxygen pressure',30,300,1,'mmHg'],['flow','Cardiac output',2,10,.25,'L/min']],
      assumptions:'Assumes functional hemoglobin and steady systemic flow. Saturation and oxygen pressure are independent inputs for this calculation; in the body they normally vary together along the oxygen–hemoglobin dissociation curve. Delivery measures systemic transport, not tissue extraction.',
      links:[['alveoli|erythrocyte','Red blood cell'],['alveoli|respiratory-membrane','Respiratory membrane'],['heart|left-ventricle','Left ventricle']],
      refs:[['NCBI Bookshelf · Oxygen saturation and arterial oxygen content','https://www.ncbi.nlm.nih.gov/books/NBK525974/'],['Roberson &amp; Bennett-Guerrero · Oxygen delivery and extraction','https://pmc.ncbi.nlm.nih.gov/articles/PMC3261580/']]
    }
  };
  const phases=[
    {title:'Ventricular filling',from:'A · Mitral opens',to:'B · Mitral closes',mitral:'Open',aortic:'Closed',text:'Left atrial pressure exceeds left ventricular pressure and blood enters the ventricle. Late atrial contraction adds to end-diastolic volume. The phase ends when ventricular pressure rises above atrial pressure.',color:'#69ccb8'},
    {title:'Isovolumetric contraction',from:'B · Mitral closes',to:'C · Aortic opens',mitral:'Closed',aortic:'Closed',text:'The ventricle contracts after mitral closure. With both valves closed, pressure rises at end-diastolic volume until ventricular pressure exceeds aortic pressure.',color:'#f5b16f'},
    {title:'Ventricular ejection',from:'C · Aortic opens',to:'D · Aortic closes',mitral:'Closed',aortic:'Open',text:'Blood leaves the left ventricle through the aortic valve. Ventricular volume falls to end-systolic volume. Aortic pressure eventually exceeds ventricular pressure and the valve closes.',color:'#ff897b'},
    {title:'Isovolumetric relaxation',from:'D · Aortic closes',to:'A · Mitral opens',mitral:'Closed',aortic:'Closed',text:'The ventricle relaxes at end-systolic volume. Once its pressure falls below left atrial pressure, the mitral valve opens and filling resumes.',color:'#92afdf'}
  ];
  const patterns=[
    ['Resting pattern',{vt:500,dead:150,rate:12}],
    ['Rapid, shallow',{vt:250,dead:150,rate:24}],
    ['Slow, deep',{vt:750,dead:150,rate:8}]
  ];
  const fmt=(n,d=0)=>n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
  const tidy=n=>Number(n.toFixed(2)).toLocaleString('en-US',{maximumFractionDigits:2});
  const bound=(n,a,b)=>Math.max(a,Math.min(b,n));
  const maxOf=(spec,s)=>typeof spec[3]==='function'?spec[3](s):spec[3];
  function calculate(mode,s) {
    if(mode==='loop') {const sv=s.edv-s.esv;return {sv,ef:100*sv/s.edv};}
    if(mode==='pvr') {const gradient=s.pap-s.wedge;return {gradient,resistance:gradient/s.flow};}
    if(mode==='vent') {const fresh=s.vt-s.dead;return {fresh,alveolar:fresh*s.rate/1000,dead:s.dead*s.rate/1000,total:s.vt*s.rate/1000};}
    const boundContent=1.34*s.hb*s.sat/100,dissolved=.003*s.po2,content=boundContent+dissolved;
    return {bound:boundContent,dissolved,content,delivery:s.flow*10*content};
  }
  const metric=(label,value,unit)=>'<div><span>'+label+'</span><strong>'+value+'</strong><small>'+unit+'</small></div>';
  const landmarks=[0,.53,.60,.92,1];
  const phaseAt=t=>t<landmarks[1]?0:t<landmarks[2]?1:t<landmarks[3]?2:3;
  const ecgPeaks={I:[.12,-.10,.78,-.19,.22],II:[.17,-.13,1.04,-.24,.31],aVR:[-.11,.08,-.75,.16,-.21]};
  const waves=[[.407,.023],[.489,.006],[.506,.008],[.521,.008],[.808,.052]];
  const stripBeats=6;
  const stripX=(beat,phase)=>30+(beat+phase)*150;
  function ecgChart(s,uid){
    const points=Array.from({length:stripBeats*240+1},(_,i)=>{
      const sample=i/240,t=sample%1;
      const mv=waves.reduce((sum,[center,width],j)=>sum+ecgPeaks[s.lead][j]*Math.exp(-.5*((t-center)/width)**2),0);
      return stripX(0,sample).toFixed(2)+','+(90-mv*45).toFixed(2);
    });
    const markers=Array.from({length:stripBeats},(_,beat)=>[['S1',.53],['S2',.92]].map(([label,phase])=>{
      const x=stripX(beat,phase);
      return '<path class="ph-event" d="M'+x+' 31V124"/><text x="'+x+'" y="23" text-anchor="middle">'+label+'</text>';
    }).join('')).join('');
    return '<svg class="ph-ecg ph-ecg-strip" viewBox="0 0 960 151" role="img" aria-labelledby="'+uid+'-ecg-title"><title id="'+uid+'-ecg-title">Six simulated heartbeats in ECG lead '+s.lead+', with S1 and S2 marked for each beat</title><defs><pattern id="'+uid+'-small" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" fill="none" stroke="#f0d3d4" stroke-width=".65"/></pattern><pattern id="'+uid+'-grid" width="25" height="25" patternUnits="userSpaceOnUse"><rect width="25" height="25" fill="url(#'+uid+'-small)"/><path d="M25 0H0V25" fill="none" stroke="#dca8ae" stroke-width="1"/></pattern></defs><rect x="30" y="31" width="900" height="93" rx="4" fill="url(#'+uid+'-grid)"/>'+markers+'<polyline points="'+points.join(' ')+'" fill="none" stroke="#204e49" stroke-width="2" stroke-linejoin="round"/><text x="30" y="143">0 s</text><text x="930" y="143" text-anchor="end">'+(stripBeats*60/s.rate).toFixed(2)+' s</text><line data-ecg-cursor x1="30" x2="30" y1="31" y2="124" stroke="#842d40" stroke-width="1.5"/></svg>';
  }
  function pvChart(s,uid) {
    const X=v=>50+v*(317/200),Y=p=>182-p*(149/140);
    const E=X(s.edv),S=X(s.esv),d=E-S;
    const A=[S,Y(5)],B=[E,Y(12)],C=[E,Y(80)],D=[S,Y(95)];
    const path=[
      'M'+A+' C'+[S+.42*d,Y(4)]+' '+[E-.17*d,Y(5)]+' '+B,
      'M'+B+' L'+C,
      'M'+C+' C'+[E-.13*d,Y(126)]+' '+[S+.45*d,Y(132)]+' '+D,
      'M'+D+' L'+A
    ];
    let graph='<svg viewBox="0 0 395 229" class="ph-pv" role="img" aria-labelledby="'+uid+'-graph-title"><title id="'+uid+'-graph-title">Left ventricular pressure versus volume. '+phases[s.phase].title+' selected. The loop runs from A to B to C to D and back to A.</title>';
    [0,40,80,120].forEach(p=>{graph+='<path class="ph-grid-line" d="M50 '+Y(p)+' H367"/><text x="42" y="'+(Y(p)+4)+'" text-anchor="end">'+p+'</text>';});
    [0,50,100,150,200].forEach(v=>{graph+='<path class="ph-grid-line" d="M'+X(v)+' 31 V183"/><text x="'+X(v)+'" y="200" text-anchor="middle">'+v+'</text>';});
    graph+='<text x="49" y="16" class="ph-axis">LV pressure (mmHg)</text><text x="209" y="222" text-anchor="middle" class="ph-axis">LV volume (mL)</text>';
    graph+='<path d="'+path.join(' ').replace(/M(-?[\d.]+),(-?[\d.]+)/g,(m,x,y,index)=>index===0?m:'L'+x+','+y)+' Z" fill="#587471" fill-opacity=".15"/>';
    path.forEach((p,i)=>{graph+='<path data-pv-phase="'+i+'" d="'+p+'" fill="none" stroke="'+phases[i].color+'" stroke-width="'+(s.phase===i?4.5:2)+'" opacity="'+(s.phase===i?1:.64)+'" stroke-linecap="round"/>';});
    [A,B,C,D].forEach(([x,y],i)=>{
      const right=i===1||i===2;
      graph+='<circle cx="'+x+'" cy="'+y+'" r="3.6" fill="#f4f5ef"/><text x="'+(x+(right?9:-9))+'" y="'+(y+(i===0?3:i===1?2:4))+'" text-anchor="'+(right?'start':'end')+'" class="ph-landmark">'+['A','B','C','D'][i]+'</text>';
    });
    return graph+'<circle data-pv-cursor r="5.5" fill="#fff" stroke="#233b3b" stroke-width="2"/></svg>';
  }
  function phaseText(s) {
    const phase=phases[s.phase];
    return '<div class="ph-phase-state"><div><strong>'+phase.from+'</strong><span>to</span><strong>'+phase.to+'</strong></div><p>'+phase.text+'</p><dl><div><dt>Mitral valve</dt><dd>'+phase.mitral+'</dd></div><div><dt>Aortic valve</dt><dd>'+phase.aortic+'</dd></div></dl></div>';
  }
  function pressureChart(s,c){
    const track=(name,value,cls)=>'<div class="ph-bar-row"><div><span>'+name+'</span><b>'+value+' mmHg</b></div><div class="ph-track"><i class="'+cls+'" style="width:'+100*value/60+'%"></i></div></div>';
    return '<div class="ph-bars">'+track('Mean pulmonary arterial pressure',s.pap,'ph-coral')+track('Pulmonary arterial wedge pressure',s.wedge,'ph-teal')+'<div class="ph-scale"><span>0</span><span>30</span><span>60 mmHg</span></div></div><p class="ph-chart-foot">Driving pressure <strong>'+fmt(c.gradient)+' mmHg</strong></p>';
  }
  function ventChart(s,c){
    const pct=100*c.fresh/s.vt;
    return '<div class="ph-composition"><div class="ph-stack"><i class="ph-teal" style="width:'+pct+'%"></i><i class="ph-sand" style="width:'+(100-pct)+'%"></i></div><div class="ph-chart-key"><span><i class="ph-teal"></i>Alveolar</span><b>'+fmt(c.alveolar,2)+' L/min</b><span><i class="ph-sand"></i>Dead space</span><b>'+fmt(c.dead,2)+' L/min</b></div></div><p class="ph-chart-foot">Fraction of each breath reaching gas exchange <strong>'+fmt(pct)+'%</strong></p>';
  }
  function oxygenChart(s,c){
    const pct=100*c.bound/c.content;
    return '<div class="ph-composition"><div class="ph-stack"><i class="ph-coral" style="width:'+pct+'%"></i><i class="ph-blue" style="width:'+(100-pct)+'%"></i></div><div class="ph-chart-key"><span><i class="ph-coral"></i>Hemoglobin-bound</span><b>'+fmt(c.bound,2)+' mL O₂/dL</b><span><i class="ph-blue"></i>Dissolved</span><b>'+fmt(c.dissolved,2)+' mL O₂/dL</b></div></div><p class="ph-chart-foot">Carried by hemoglobin <strong>'+fmt(pct,1)+'%</strong></p>';
  }
  function figures(mode,s,c,uid) {
    if(mode==='loop')return {
      figure:pvChart(s,uid),stats:metric('Cardiac output',fmt(c.sv*s.rate/1000,2),'L/min')+metric('Stroke volume',fmt(c.sv),'mL/beat')+metric('Ejection fraction',fmt(c.ef,1),'%'),
      work:'<p><b>Stroke volume</b> = EDV − ESV = '+s.edv+' − '+s.esv+' = <strong>'+c.sv+' mL/beat</strong></p><p><b>Ejection fraction</b> = (stroke volume ÷ EDV) × 100 = ('+c.sv+' ÷ '+s.edv+') × 100 = <strong>'+fmt(c.ef,1)+'%</strong></p>',
      status:'Stroke volume '+c.sv+' milliliters per beat. Ejection fraction '+fmt(c.ef,1)+' percent.'
    };
    if(mode==='pvr')return {
      figure:pressureChart(s,c),stats:metric('Vascular resistance',fmt(c.resistance,2),'Wood units')+metric('Pressure gradient',fmt(c.gradient),'mmHg'),
      work:'<p><b>Transpulmonary gradient</b> = mPAP − PAWP = '+s.pap+' − '+s.wedge+' = <strong>'+c.gradient+' mmHg</strong></p><p><b>PVR</b> = (mPAP − PAWP) ÷ pulmonary flow = '+c.gradient+' mmHg ÷ '+tidy(s.flow)+' L/min = <strong>'+fmt(c.resistance,2)+' WU</strong></p><small>1 Wood unit (WU) = 1 mmHg·min/L.</small>',
      status:'Pulmonary vascular resistance '+fmt(c.resistance,2)+' Wood units. Pressure gradient '+c.gradient+' millimeters of mercury.'
    };
    if(mode==='vent')return {
      figure:ventChart(s,c),stats:metric('Alveolar ventilation',fmt(c.alveolar,2),'L/min')+metric('Minute ventilation',fmt(c.total,2),'L/min'),
      work:'<p><b>Minute ventilation</b> = V<sub>T</sub> × f ÷ 1,000 = '+s.vt+' × '+s.rate+' ÷ 1,000 = <strong>'+fmt(c.total,2)+' L/min</strong></p><p><b>Alveolar ventilation</b> = (V<sub>T</sub> − V<sub>D</sub>) × f ÷ 1,000 = ('+s.vt+' − '+s.dead+') × '+s.rate+' ÷ 1,000 = <strong>'+fmt(c.alveolar,2)+' L/min</strong></p><p><b>Dead-space ventilation</b> = V<sub>D</sub> × f ÷ 1,000 = <strong>'+fmt(c.dead,2)+' L/min</strong></p><small>V<sub>T</sub> and V<sub>D</sub> are mL/breath. Frequency f is breaths/min. There are 1,000 mL in a liter.</small>',
      status:'Alveolar ventilation '+fmt(c.alveolar,2)+' liters per minute. Total minute ventilation '+fmt(c.total,2)+' liters per minute.'
    };
    return {
      figure:oxygenChart(s,c),stats:metric('Oxygen delivery',fmt(c.delivery),'mL O₂/min')+metric('Arterial oxygen content',fmt(c.content,2),'mL O₂/dL'),
      work:'<p><b>CaO₂</b> = (1.34 × Hb × SaO₂/100) + (0.003 × PaO₂) = (1.34 × '+tidy(s.hb)+' × '+s.sat+'/100) + (0.003 × '+s.po2+') = <strong>'+fmt(c.content,2)+' mL O₂/dL</strong></p><p><b>DO₂</b> = cardiac output × 10 × CaO₂ = '+tidy(s.flow)+' L/min × 10 dL/L × '+fmt(c.content,3)+' mL O₂/dL ≈ <strong>'+fmt(c.delivery)+' mL O₂/min</strong></p><small>Oxygen capacity is 1.34 mL O₂/g Hb. The dissolved coefficient is 0.003 mL O₂/(dL·mmHg). Saturation is entered as a percent.</small>',
      status:'Systemic oxygen delivery '+fmt(c.delivery)+' milliliters of oxygen per minute. Arterial oxygen content '+fmt(c.content,2)+' milliliters per deciliter.'
    };
  }
  let instanceId=0;
  const sessions=new WeakMap();
  window.renderPhysiologyLab=host=>{
    if(!host)return;
    let session=sessions.get(host);
    if(!session){session={mode:'loop',values:Object.fromEntries(Object.entries(defaults).map(([k,v])=>[k,{...v}]))};sessions.set(host,session);}
    const uid='phlab-'+(++instanceId),root=document.createElement('section');
    root.className='ph-lab';root.setAttribute('aria-label','Physiology lab');
    root.innerHTML='<div class="ph-top"><div><h2>Physiology lab</h2><p>Explore the measurements that connect circulation, ventilation and oxygen transport.</p></div></div><div class="ph-tabs" role="group" aria-label="Choose a physiology model">'+tabs.map(([id,name])=>'<button type="button" data-ph-tab="'+id+'">'+name+'</button>').join('')+'</div><div class="ph-body"></div><div class="sr-only" data-ph-status role="status" aria-live="polite"></div>';
    host.replaceChildren(root);
    const $=q=>root.querySelector(q);
    let frame=0, last=0, trackedPhase=-1;
    function drawBeat(){
      const s=session.values.loop,phase=phaseAt(s.t);
      s.phase=phase;
      const bar=$('[data-ph-time]');if(!bar)return;
      bar.value=s.t;bar.setAttribute('aria-valuetext',Math.round(s.t*60000/s.rate)+' milliseconds');
      $('[data-ph-ms]').textContent=Math.round(s.t*60000/s.rate)+' ms';
      const cursor=$('[data-ecg-cursor]');if(cursor){const x=stripX(s.beat,s.t);cursor.setAttribute('x1',x);cursor.setAttribute('x2',x)}
      const segment=$('[data-pv-phase="'+phase+'"]'),dot=$('[data-pv-cursor]');
      if(segment&&dot){const f=(s.t-landmarks[phase])/(landmarks[phase+1]-landmarks[phase]);const pt=segment.getPointAtLength(f*segment.getTotalLength());dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y)}
      if(trackedPhase!==phase){
        trackedPhase=phase;root.querySelectorAll('[data-ph-phase]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.phPhase)===phase)));
        root.querySelectorAll('[data-pv-phase]').forEach((p,i)=>{p.setAttribute('stroke-width',i===phase?4.5:2);p.setAttribute('opacity',i===phase?1:.64)});
        $('.ph-phase-details').innerHTML=phaseText(s);
      }
    }
    function pause(){
      cancelAnimationFrame(frame);frame=0;last=0;
      const b=$('[data-ph-play]');if(b)b.textContent='Play heartbeat';
    }
    function tick(now){
      if(!root.isConnected||host.hidden||session.mode!=='loop'){pause();return}
      const s=session.values.loop;
      if(last){const next=s.t+Math.min(50,now-last)*s.rate/60000;s.beat=(s.beat+Math.floor(next))%stripBeats;s.t=next%1}
      last=now;drawBeat();frame=requestAnimationFrame(tick);
    }
    function controls(mode,s){
      return definitions[mode].controls.map(spec=>{
        const [key,label,min,,step,units]=spec, id=uid+'-'+key;
        return '<div class="ph-control"><label for="'+id+'">'+label+'</label><output for="'+id+'" data-ph-value="'+key+'"></output><input type="range" data-ph-control="'+key+'" id="'+id+'" min="'+min+'" max="'+maxOf(spec,s)+'" step="'+step+'" value="'+s[key]+'"><div class="ph-limits" aria-hidden="true"><span>'+tidy(min)+' '+units+'</span><span data-ph-limit="'+key+'">'+tidy(maxOf(spec,s))+' '+units+'</span></div></div>';
      }).join('');
    }
    function render() {
      pause();
      const m=session.mode,s=session.values[m],def=definitions[m];
      root.querySelectorAll('[data-ph-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.phTab===m)));
      const phasesBar=m==='loop'?'<div class="ph-phases" role="group" aria-label="Select phase">'+phases.map((p,i)=>'<button type="button" data-ph-phase="'+i+'">'+p.title+'</button>').join('')+'</div><div class="ph-phase-details"></div>':'';
      const ecg=m==='loop'?'<section class="ph-ecg-panel"><div class="ph-ecg-heading"><h4>Simulated ECG · Six beats</h4><label>Lead <select data-ph-lead aria-label="ECG lead">'+Object.keys(ecgPeaks).map(k=>'<option'+(k===s.lead?' selected':'')+'>'+k+'</option>').join('')+'</select></label></div><div class="ph-strip-scroll" tabindex="0" aria-label="ECG rhythm strip" data-ph-ecg></div><div class="ph-beat-controls"><button type="button" class="ph-reset" data-ph-play>Play heartbeat</button><label>Beat position <output data-ph-ms></output><input type="range" data-ph-time min="0" max=".999" step=".001" value="0"></label></div><p><strong>P</strong> atrial depolarization · <strong>QRS</strong> ventricular depolarization · <strong>T</strong> ventricular repolarization.</p><p><strong>S1 (lub)</strong> marks atrioventricular valve closure. <strong>S2 (dub)</strong> marks semilunar valve closure. Grid spacing is illustrative. The loop tracks the left-sided valves.</p></section>':'';
      const presets=m==='vent'?'<div class="ph-presets" role="group" aria-label="Breathing pattern">'+patterns.map(([p],i)=>'<button type="button" data-ph-preset="'+i+'">'+p+'</button>').join('')+'</div>':'';
      $('.ph-body').innerHTML='<div class="ph-heading"><div><h3>'+def.title+'</h3><p>'+def.prompt+'</p></div><button type="button" class="ph-reset" data-ph-reset>Reset model</button></div>'+ecg+'<div class="ph-layout"><div class="ph-plot-wrap"><div class="ph-plot"><h4>'+def.scale+'</h4><div data-ph-figure></div></div>'+phasesBar+'</div><div class="ph-inputs"><h4>Model inputs</h4>'+presets+controls(m,s)+'<div class="ph-metrics" data-ph-stats></div></div></div><div class="ph-foot-layout"><div class="ph-equations"><h4>Calculation</h4><div data-ph-work></div></div><div class="ph-method"><h4>Model assumptions</h4><p>'+def.assumptions+'</p><div class="ph-sources">'+def.refs.map(([name,url])=>'<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+name+'</a>').join('')+'</div></div></div><div class="ph-anatomy"><h4>Explore the anatomy</h4>'+def.links.map(([id,label])=>'<button type="button" data-open="'+id+'">'+label+'</button>').join('')+'</div>';
      update(false);
    }
    function update(announce){
      const m=session.mode,s=session.values[m],c=calculate(m,s),v=figures(m,s,c,uid);
      for(const spec of definitions[m].controls){
        const [key,,,,,unit]=spec, slider=$('[data-ph-control="'+key+'"]');
        slider.max=maxOf(spec,s);slider.value=s[key];
        slider.setAttribute('aria-valuetext',tidy(s[key])+' '+unit);
        $('[data-ph-value="'+key+'"]').textContent=tidy(s[key])+' '+unit;
        $('[data-ph-limit="'+key+'"]').textContent=tidy(maxOf(spec,s))+' '+unit;
      }
      $('[data-ph-figure]').innerHTML=v.figure;$('[data-ph-stats]').innerHTML=v.stats;$('[data-ph-work]').innerHTML=v.work;
      if(m==='loop'){
        $('[data-ph-ecg]').innerHTML=ecgChart(s,uid);trackedPhase=-1;drawBeat();
      }
      if(m==='vent')root.querySelectorAll('[data-ph-preset]').forEach(b=>{const pattern=patterns[Number(b.dataset.phPreset)][1];b.setAttribute('aria-pressed',String(Object.keys(pattern).every(k=>s[k]===pattern[k])));});
      if(announce)$('[data-ph-status]').textContent=v.status;
    }
    root.addEventListener('input',e=>{
      if(e.target.matches('[data-ph-time]')){pause();session.values.loop.t=e.target.valueAsNumber;drawBeat();return}
      const key=e.target.dataset.phControl;if(!key)return;
      const mode=session.mode,state=session.values[mode],spec=definitions[mode].controls.find(item=>item[0]===key),value=e.target.valueAsNumber;
      if(!spec||!Number.isFinite(value))return;
      state[key]=bound(value,spec[2],maxOf(spec,state));
      for(const rule of definitions[mode].controls)state[rule[0]]=bound(state[rule[0]],rule[2],maxOf(rule,state));
      update(false);
    });
    root.addEventListener('change',e=>{if(e.target.dataset.phControl)update(true);if(e.target.matches('[data-ph-lead]')){session.values.loop.lead=e.target.value;update(false)}});
    root.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b)return;
      if(b.dataset.phTab){session.mode=b.dataset.phTab;render();}
      else if('phPlay' in b.dataset){if(frame)pause();else{b.textContent='Pause heartbeat';frame=requestAnimationFrame(tick)}}
      else if('phPhase' in b.dataset){pause();const i=Number(b.dataset.phPhase);session.values.loop.t=(landmarks[i]+landmarks[i+1])*.5;drawBeat();$('[data-ph-status]').textContent=phases[session.values.loop.phase].title+'. '+phases[session.values.loop.phase].text;}
      else if('phPreset' in b.dataset){Object.assign(session.values.vent,patterns[Number(b.dataset.phPreset)][1]);update(true);}
      else if('phReset' in b.dataset){pause();session.values[session.mode]={...defaults[session.mode]};update(true);}
    });
    render();
  };
})();
