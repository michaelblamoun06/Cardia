(() => {
 'use strict';
 const ref=(title,url)=>({title,url});
 const refs={
  bp:ref('Mitsuhashi et al. · BodyParts3D, the source anatomy dictionary','https://doi.org/10.1093/nar/gkn613'),
  lung:ref('Kandathil & Chamarthy · Pulmonary vascular anatomy and variants','https://cdt.amegroups.org/article/view/19060/html'),
  vein:ref('Polaczek et al. · CT atlas of pulmonary venous anatomy','https://jtd.amegroups.org/article/view/36486/html'),
  bronch:ref('NCBI Bookshelf · Tracheobronchial tree','https://www.ncbi.nlm.nih.gov/books/NBK556044/'),
  papillary:ref('NCBI Bookshelf · Papillary muscles','https://www.ncbi.nlm.nih.gov/books/NBK557802/'),
  liver:ref('Clinical Liver Disease · Normal liver anatomy and segments','https://pmc.ncbi.nlm.nih.gov/articles/PMC6448666/'),
  arm:ref('NCBI Bookshelf · Hand volar arch arteries','https://www.ncbi.nlm.nih.gov/books/NBK545377/'),
  leg:ref('NCBI Bookshelf · Arterial supply of the lower extremities','https://www.ncbi.nlm.nih.gov/books/NBK27342/'),
  limbVein:ref('NCBI Bookshelf · Upper and lower extremity venous anatomy','https://www.ncbi.nlm.nih.gov/books/NBK27355/'),
  brain:ref('Cipolla · The cerebral circulation','https://www.ncbi.nlm.nih.gov/books/NBK53086/'),
  regional:ref('OpenStax · Circulatory pathways','https://openstax.org/books/anatomy-and-physiology-2e/pages/20-5-circulatory-pathways')
 };
 const base=(s)=>s==='heart'?window.heartStructures:s==='lungs'?window.lungStructures:window.vesselStructures;
 const dossier=(s)=>s==='heart'?window.cardiacDossiers:s==='lungs'?window.lungDossiers:window.vascularDossiers;
 const words=v=>Array.isArray(v)?v.filter(Boolean).join(' '):v||'';
 const norm=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const stripSides=s=>s.replace(/\b(?:left|right)\b/g,'').replace(/\s+/g,' ').trim();
 const sideOf=n=>n.match(/\b(left|right)\b/)?.[1]||'';
 const sideStr=n=>sideOf(n)?' on the '+sideOf(n):'';
 const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
 const srcs=(...sets)=>{const seen=new Set();return sets.flat().filter(r=>r?.url&&!seen.has(r.url)&&seen.add(r.url));};
 const named=(p)=>{const object=window.atlasSources?.[p.origin];return object?ref(object.publisher+' · '+object.title+' ('+object.version+')',object.url):refs.bp;};
 const standardVariant='This display preserves one source model. Caliber, terminal branching, and anastomoses can differ among people.';
 const fields=(type,summary,location,role,course,physiology,relationship,variation,sources)=>({type,summary,location,role,course,physiology,relationship,variation,sources});
 function fromAtlas(p,scene,id,extra={}){
  const e=base(scene)?.find(s=>s.id===id);if(!e)return null;
  const d=dossier(scene)?.[id]||{};
  return {...fields(e.type,e.summary,e.location,e.role,words(d.course)||e.location,words(d.physiology)||e.role,words(d.relationship)||e.summary,words(d.variation)||standardVariant,srcs(named(p),d.sources||[])),counterpart:{scene,id},...extra};
 }
 function familyOf(p,scene,key){
  const area={'bp-head':'Head & neck','bp-arm':'Upper limbs','bp-leg':'Lower limbs','bp-thorax':'Thorax','bp-abdomen':'Abdomen & pelvis'}[scene]||'';
  const k=key||window.resolveVascularFamily?.(p.name,p.layer,area,p.classes||[])||(p.layer==='veins'?'vein':'artery');
  const f=window.vascularFamilies?.[k]||[];
  const source=(f[3]||'').split(' ').map(t=>window.circulationSources?.[t]).filter(Boolean);
  return {phys:words(f[1]),rel:words(f[2]),sources:source};
 }
 const cardiacAliases={
  'left anterior descending artery':'left-anterior-descending','circumflex branch of left coronary artery':'circumflex-artery','trunk of anterior interventricular branch of left coronary artery':'left-anterior-descending','marginal branch of right coronary artery':'right-marginal-artery','posterior interventricular branch of right coronary artery':'posterior-interventricular-artery','trunk of right coronary artery':'right-coronary-artery','trunk of left coronary artery':'left-coronary-artery','anterior cardiac vein':'anterior-cardiac-veins','left common carotid artery':'left-common-carotid','left subclavian artery':'left-subclavian','brachiocephalic artery':'brachiocephalic-trunk'
 };
 const vasAliases={'celiac artery':'celiac-trunk','trunk of superior mesenteric artery':'superior-mesenteric-artery','trunk of renal artery':'renal-artery','deep femoral artery':'deep-femoral-artery','dorsalis pedis artery':'dorsalis-pedis-artery','descending thoracic aorta':'thoracic-aorta'};
 const mask={
  'vh-right-apical-bronchus':'The publisher’s right apical bronchus node shares the identifier listed for the right superior lower-lobe bronchus. The title here follows the named mesh; the conflicting identifier cannot validate its identity.',
  'vh-right-anterior-basal-bronchus':'The source gives this anterior basal bronchus node the same ontology identifier as the right upper posterior bronchus. Its source node name is retained and this cross-reference remains unresolved.',
  'vh-left-posetrior-basal-bronchopulmonary-segment':'The node describes a tissue segment but its publisher cross-reference identifies a bronchus. The note follows the tissue-region label. The raw node also misspells “posterior.”'
 };
 function heartPart(p){
  const n=norm(p.name),su=n.includes('left')||n.startsWith('anterolateral')||n.startsWith('posteromedial');
  if(n.includes('papillary muscle')){
   const l=su?'left':'right',val=su?'mitral':'tricuspid',where=n.startsWith('medial')?'septal wall':n.startsWith('anterior ')?'anterior free wall':n.startsWith('posterior ')?'inferior (diaphragmatic) wall':n.startsWith('anterolateral')?'anterolateral wall':'posteromedial wall';
   const d=fromAtlas(p,'heart','papillary-muscles');delete d.counterpart;
   return {...d,type:'Papillary muscle',summary:'The '+n+' projects from the '+where+' of the '+l+' ventricle and anchors chordae to the '+val+' valve.',location:cap(where)+' inside the '+l+' ventricle.',course:'A muscular base on the '+where+' tapers toward one or more heads. Chordae run from the heads to the '+val+' leaflets.',role:'Tensions chordae during ventricular systole to resist leaflet prolapse.',relationship:su?'Each left papillary group supports portions of both mitral leaflets. The valve closes when ventricular pressure exceeds atrial pressure.':'Right ventricular papillary groups tether neighboring tricuspid leaflets. Small septal attachments and direct septal chordae may coexist.',variation:'Papillary muscle heads can split or join. This is one named source component of the broader papillary-muscle group.',sources:srcs(d.sources,refs.papillary)};
  }
  if(n==='ascending aorta'||n==='aortic arch'||n==='arch of aorta'){
   const arch=n!=='ascending aorta';
   const d=fromAtlas(p,'heart','aorta');delete d.counterpart;
   return {...d,summary:arch?'This curved aortic segment passes from the ascending to the descending aorta and distributes blood to major arch branches.':'The ascending aorta conducts blood upward from the aortic root to the arch. The coronary ostia arise in the aortic root.',location:arch?'Superior mediastinum, above the left main bronchus.':'Intrapericardial aorta between its root and arch.',course:arch?'The arch curves superiorly, posteriorly and leftward, then becomes descending thoracic aorta.':'After the root, the ascending vessel runs superiorly, slightly rightward and anteriorly toward the beginning of the arch.',role:arch?'Distributes left ventricular output to the arch branches and descending aorta.':'Conducts left ventricular output to the arch and buffers the systolic pressure pulse.',variation:arch?'The number and arrangement of arch branches vary; neighboring vessels shown here belong to the same source atlas.':'A source segment may exclude the aortic sinuses even when the root and ascending portion are described together in physiology.'};
  }
  const specials={
   'left marginal branch':['Artery','left margin of the left ventricle','An obtuse marginal branch usually leaves the circumflex artery and runs over the lateral left ventricular wall.','Supplies the lateral left ventricular myocardium.','Multiple obtuse marginal branches can arise from the circumflex artery.'],
   'oblique vein of left atrium':['Vein','posterior left atrial wall','The small oblique vein descends along the posterior left atrium toward the coronary sinus.','Drains a small area of atrial myocardium.','Its extent varies; it is also known as the vein of Marshall.'],
   'posterior vein of left ventricle':['Vein','posterior left ventricular surface','A posterior ventricular tributary ascends over the diaphragmatic or posterolateral left ventricular surface toward the coronary sinus.','Returns blood from posterior left ventricular myocardium.','There may be several posterior left ventricular veins with separate entries.']
  };
  if(specials[n]){const [t,l,c,r,v]=specials[n],f=familyOf(p,'',t==='Vein'?'cardiacvein':'coronary');return fields(t,c,cap(l)+'.',r,c,f.phys,f.rel,v,srcs(named(p),f.sources));}
  if(/(?:inferior|superior) pulmonary vein/.test(n))return fromAtlas(p,'lungs',n.replaceAll(' ','-'));
  const e=window.heartStructures?.find(x=>norm(x.name)===n||norm(x.id)===n);
  return fromAtlas(p,'heart',cardiacAliases[n]||e?.id||'');
 }
 const segmentKeys={
   'apical':['upper','apical','apex',1],'posterior':['upper','posterior','posterior upper lobe',2],'anterior':['upper','anterior','anterior upper lobe',3],
   'lateral':['middle','lateral','lateral middle lobe',4],'medial':['middle','medial','medial middle lobe',5],
   'lingula superior':['upper','superior-lingular','superior lingula',4],'lingula inferior':['upper','inferior-lingular','inferior lingula',5],
   'superior':['lower','superior','superior part of the lower lobe',6],'medial basal':['lower','medial-basal','medial basal lower lobe',7],
   'anterior basal':['lower','anterior-basal','anterior basal lower lobe',8],'lateral basal':['lower','lateral-basal','lateral basal lower lobe',9],
   'posterior basal':['lower','posterior-basal','posterior basal lower lobe',10]
 };
 function lungPart(p){
  const n=norm(p.name),side=sideOf(n),bare=stripSides(n);
  if(/pulmonary (?:artery|vein)$/.test(n))return fromAtlas(p,'lungs',n.replaceAll(' ','-'));
  if(n.includes('hilum')){
   const portion=/(upper|lower|middle)$/.exec(n)?.[1],v=portion?'The publisher divides the '+side+' hilar region into separately selectable lobar portions. These are pieces of a common entry region, not additional lung roots.':'The outline and branching level of hilar structures vary with lung size and individual branching patterns.';
   return fields('Hilar region','This source surface marks '+(portion?'the '+portion+' portion of ':'')+'the '+side+' lung hilum where structures of the root enter and leave.',cap(side)+' mediastinal lung surface, facing the heart and mediastinum.','Provides the entry and exit region for bronchi, pulmonary vessels, bronchial vessels, lymphatics and nerves.','Follow the main bronchus from the mediastinum into this region and then into lobar bronchi. The pulmonary veins course back toward the left atrium.','The hilum is a gateway. Gas exchange occurs distally in perfused alveolar septa.',side==='right'?'At the right hilum the pulmonary artery is anterior to the main bronchus; the superior lobar bronchus arises above the artery.':'The left pulmonary artery arches above the left main bronchus. The superior pulmonary vein lies anteriorly and the inferior vein is the lowest major hilar vessel.',v,srcs(named(p),refs.lung,refs.bronch));
  }
  if(n.includes('cartilage of')){
   const level=n.includes('tertiary')?'segmental':n.includes('lobar')?'lobar':'main';
   return fields('Bronchial cartilage','This mesh isolates supporting cartilage of the '+side+' '+level+' bronchus.',cap(side)+' '+level+' bronchial wall.','Keeps the airway patent during pressure changes.','The cartilage belongs to the wall around the lumen. Distally, irregular plates replace the more ring-like proximal framework and disappear at bronchiolar caliber.','Mechanical support limits excessive narrowing while allowing airway deformation during breathing.','The cartilage is distinct from the epithelial lining, bronchial smooth muscle and nearby pulmonary artery.','Plate number, shape and extent change along a bronchus. Separate plates may be combined within one mesh.',srcs(named(p),refs.bronch));
  }
  if(n.includes('bronchopulmonary segment')||/^(?:right|left) .+ bronchus$/.test(n)&&!n.includes('lobar')&&!n.includes('main')&&bare!=='lingular bronchus'){
    const tissue=n.includes('bronchopulmonary'),key=bare.replace(tissue?' bronchopulmonary segment':' bronchus',''),desc=segmentKeys[key];
    if(desc){
      const [lobe,token,territory,index]=desc,combined=side==='left'&&(index===1||index===2||index===7||index===8);
      const member=side+'-'+lobe+'-'+(combined?(index<=2?'apicoposterior':'anteromedial-basal'):token)+'-bronchus';
      const variation=mask[p.id]|| (combined?'The source labels this '+(tissue?'tissue territory':'airway')+' individually. The teaching scene groups the left '+(index<=2?'apical and posterior territories as S1+2.':'medial and anterior basal territories as S7+8.'):'Segmental origins and their smaller subdivisions vary. The surface and branches shown here represent this source model.');
      if(tissue)return fields('Bronchopulmonary segment','The '+side+' '+territory+' territory (S'+index+') is a volume of ventilated, perfused lung tissue.',cap(side)+' '+(lobe==='middle'?'middle':lobe==='upper'?'superior':'inferior')+' lobe, '+territory+'.','Houses alveoli supplied by this segment’s bronchovascular branches.','The segmental bronchus and pulmonary arterial branches enter toward the center of the territory. Distal acini and capillary beds occupy its parenchyma.','Effective exchange requires both air delivery through the segmental bronchus and blood delivery through its pulmonary arteries.','A colored segment is lung parenchyma, including its distal air spaces and vessels. Intersegmental veins may run along its boundaries.',variation,srcs(named(p),refs.lung,refs.vein));
      const d=fromAtlas(p,'lungs',member);if(d&&!combined&&!mask[p.id])return d;
      return fields('Segmental bronchus','This '+side+' airway conducts gas toward '+territory+' (B'+index+').',cap(side)+' '+lobe+' lobe.','Provides a conducting route for ventilation of its named territory.','The segmental airway passes from a lobar branch toward the '+territory+' territory and subdivides further.','Ventilation depends on lumen caliber, pressure gradients and distal compliance. Diffusion between air and capillary blood occurs beyond the conducting airway.','Its pulmonary arterial counterpart supplies blood toward the same central bronchovascular axis.',variation,srcs(named(p),refs.bronch,refs.lung));
    }
  }
  if(bare==='lingular bronchus')return fields('Airway division','The lingular division of the left upper lobar bronchus leads to the superior and inferior lingular bronchi.','Anteroinferior part of the left superior lobe.','Distributes air to both lingular segments.','From the superior lobar bronchus it travels forward and downward before dividing into B4 and B5.','A change in its patency affects ventilation of the lingula while the apicoposterior and anterior upper-division routes remain separate.','The lingula corresponds in position to the right middle lobe but remains within the left superior lobe.','The number and separation of distal branches vary.',srcs(named(p),refs.bronch,refs.lung));
  if(n.includes('source composite'))return fields('Airway composite','A composite mesh preserves the publisher’s bronchial-tree surface in addition to the individually selectable bronchi.','Within both lungs, downstream of the main bronchi.','Shows the spatial continuity of branching conducting airways.','Trace the central divisions toward lobar, segmental and smaller bronchial branches.','Air is distributed among thousands of distal acini through many parallel branches.','A composite is one grouped source object; it can overlap individually represented airway segments.','Its grouping follows the publisher’s mesh organization rather than a separate anatomical airway.',srcs(named(p),refs.bronch));
  const key=n.replace('superior lobar','upper lobar').replace('inferior lobar','lower lobar').replace(/^right bronchus intermedius$/,'bronchus intermedius').replaceAll(' ','-');
  return fromAtlas(p,'lungs',key);
 }

 // Ordered territories take precedence over broad FMA families. Each rule describes the tissue serviced,
 // rather than interpreting every ontological ancestor as an immediate anatomic origin.
 const brain=[
 [/anterior spinal/,'anterior spinal cord and adjoining medulla','The paired proximal contributions approach the anterior midline before the longitudinal spinal arterial pathway descends.'],
 [/anterior inferior cerebellar/,'anteroinferior cerebellum and portions of the lateral pons','The artery curves toward the cerebellopontine angle. Its cerebellar territory overlaps variably with adjacent cerebellar arteries.'],
 [/posterior inferior cerebellar/,'posteroinferior cerebellum, inferior vermis and parts of the lateral medulla','This vertebral-system branch winds around the medulla toward the inferior cerebellar surface.'],
 [/superior vermian/,'superior cerebellar vermis','The named vermian twig distributes blood medially from the superior cerebellar circulation.'],
 [/branch of superior cerebellar|superior cerebellar artery/,'superior cerebellar hemisphere and vermis','The superior cerebellar system curves around the upper brainstem toward the superior surface of the cerebellum.'],
 [/posterior limb of internal capsule/,'posterior limb of the internal capsule','This deep twig enters a compact white-matter region containing projection fibers. It is identified as an anterior choroidal branch in the source.'],
 [/posterior medial choroidal/,'choroid plexus and adjacent deep midline structures','The medial posterior choroidal pathway approaches the roof of the third ventricle from the posterior cerebral circulation.'],
 [/anterior choroidal/,'deep hemispheric structures including part of the posterior internal capsule and choroid plexus','The artery tracks toward the temporal horn, giving deep perforating branches along its course.'],
 [/thalamogeniculate/,'ventrolateral thalamus and geniculate region','These deep perforators arise in the posterior cerebral circulation and enter the thalamic region.'],
 [/thalamoperforating|posteromedial central/,'paramedian thalamus and variably the rostral midbrain','Small perforating arteries leave the proximal posterior cerebral circulation and pass into deep midline territory.'],
 [/hypothalamic branch/,'hypothalamus','A small perforating branch leaves the posterior communicating arterial pathway to supply nearby diencephalic tissue.'],
 [/anterolateral central/,'basal ganglia and intervening internal-capsule pathways','Lenticulostriate branches penetrate from the middle cerebral artery toward deep hemispheric structures.'],
 [/branch of (?:right |left )?pontine/,'the pons','A pontine branch from the basilar system courses toward the brainstem; medial and lateral routes reach different depths.'],
 [/precuneal/,'precuneus on the medial parietal surface','This posterior cortical branch belongs to the pericallosal arterial distribution.'],
 [/splenial/,'splenium of the corpus callosum','A posterior pericallosal or splenial channel approaches the posterior end of the corpus callosum.'],
 [/angular gyrus/,'angular gyrus of the inferior parietal lobule','A terminal middle cerebral cortical branch reaches the posterior region of the lateral cerebral hemisphere.'],
 [/paracentral/,'paracentral lobule','This callosomarginal branch reaches the medial sensorimotor cortex near the central sulcus.'],
 [/intermediomedial|posteromedial branch of .*callosomarginal/,'medial frontal cortex','The named callosomarginal subdivision travels from the cingulate sulcus toward adjacent medial cortex.'],
 [/callosomarginal/,'cingulate and adjacent medial frontal cortex','This distal anterior cerebral pathway follows the cingulate sulcus and gives medial cortical branches.'],
 [/pericallosal/,'corpus callosum and neighboring medial hemisphere','The pericallosal pathway follows the contour of the corpus callosum on the medial surface.'],
 [/medial frontobasal/,'medial surface of the orbital frontal lobe','The medial orbitofrontal pathway approaches the basal frontal surface from the anterior cerebral system.'],
 [/lateral frontobasal/,'lateral orbital frontal cortex','The lateral orbitofrontal branch courses onto the ventral frontal surface from the middle cerebral distribution.'],
 [/prefrontal/,'lateral prefrontal cortex','A cortical middle cerebral branch courses from the sylvian region onto the frontal convexity.'],
 [/insular part/,'insula and overlying cortical branches','The M2 portion courses over the insula before its divisions reach the opercula and convexity.'],
 [/sphenoid part/,'proximal middle cerebral distribution','The M1 portion runs laterally within the sylvian region, giving deep perforators and continuing toward insular branches.'],
 [/inferior terminal branch/,'inferior division of the middle cerebral territory','This trunk distributes flow toward temporal and posterior cortical branches from the sylvian fissure.'],
 [/postcommunicating part/,'distal posterior cerebral distribution','The P2 segment begins beyond the posterior communicating junction and courses around the midbrain.'],
 [/precommunicating part/,'proximal posterior cerebral distribution','The P1 segment links the basilar bifurcation to the posterior communicating junction and gives deep perforators.'],
 [/ophthalmic/,'orbit and eye','The ophthalmic artery enters the orbit via the optic canal and supplies ocular and orbital branches.'],
 [/temporal branch.*lateral occipital|temporal branches.*lateral occipital/,'inferior temporal and occipitotemporal surface','The source places this temporal branch in the lateral occipital pathway of the posterior cerebral circulation.'],
 [/medial occipital/,'medial occipital cortex','The medial posterior cerebral distribution includes branches approaching the calcarine and parieto-occipital regions.'],
 [/lateral occipital/,'inferior temporal and occipitotemporal cortex','Here “lateral occipital” is a posterior cerebral artery branch, distinct from the external carotid occipital artery of the scalp.'],
 [/temporo occipital|temporo-occipital/,'posterior lateral temporal and adjoining occipital cortex','This cortical middle cerebral branch runs toward the temporo-occipital border on the lateral hemisphere.'],
 [/polar temporal/,'temporal pole','The temporopolar artery reaches the anterior end of the temporal lobe from the proximal middle cerebral distribution.'],
 [/anterior temporal/,'anterior temporal cortex','A temporal cortical branch passes from the sylvian circulation to the anterior part of the temporal lobe.'],
 [/middle temporal/,'middle lateral temporal cortex','This middle cerebral cortical branch reaches the lateral temporal surface.'],
 [/posterior temporal/,'posterior lateral temporal cortex','The posterior temporal branch supplies lateral temporal cortex from the middle cerebral system.'],
 [/anterior parietal/,'anterior lateral parietal cortex','This middle cerebral cortical artery reaches the parietal convexity anterior to the posterior parietal territory.'],
 [/posterior parietal/,'posterior lateral parietal cortex','This cortical vessel travels toward the posterior parietal area of the middle cerebral territory.']
 ];
 const upper=[
 [/circumflex humeral/,'proximal humerus, adjacent shoulder joint and deltoid region','The anterior and posterior circumflex routes pass around the surgical neck of the humerus.'],
 [/interosseous|interosseus/,'deep forearm near the interosseous membrane','The interosseous vascular system distributes blood to deep forearm compartments; its recurrent branch runs back toward the elbow.'],
 [/ulnar collateral|radial collateral|middle collateral|ulnar recurrent|radial recurrent/,'periarticular tissues at the elbow','Descending collateral and ascending recurrent channels communicate around the elbow joint.'],
 [/circumflex scapular/,'scapular region','The circumflex scapular route turns around the lateral border of the scapula into the posterior scapular region.'],
 [/subscapular/,'posterior axillary wall and scapular region','The subscapular system links the axillary region with the circumflex scapular and thoracodorsal territories.'],
 [/thoracodorsal/,'latissimus dorsi and posterior axillary wall','This vascular route traverses the posterior axillary wall toward the deep surface of latissimus dorsi.'],
 [/dorsal carpal/,'dorsal wrist','Radial and ulnar dorsal carpal branches contribute to the posterior carpal network.'],
 [/dorsal metacarpal/,'dorsum of the hand along the metacarpals','Metacarpal vessels traverse the hand between wrist-level networks and the digital region.'],
 [/palmar metacarpal/,'deep palm near the metacarpals','The palmar metacarpal routes link the deep palmar region with the common digital pathways distally.'],
 [/dorsal venous network/,'superficial dorsum of the hand','Venous channels spread across the back of the hand and converge toward superficial forearm pathways.'],
 [/deep palmar.*arch/,'deep palm near the metacarpal bases','The deep arch lies nearer the metacarpal bones and deeper than the flexor tendons.'],
 [/superficial palmar.*arch/,'superficial palm','The superficial palmar vascular pathways lie nearer the palmar aponeurosis and communicate with digital channels.'],
 [/median antebrachial/,'anterior superficial forearm','The median antebrachial vein ascends in the subcutaneous tissue toward the antecubital venous network.'],
 [/medial brachial/,'medial deep arm','This named brachial vein follows a deep course along the arm and contributes to the axillary venous return.'],
 [/radial vein/,'deep lateral forearm','Deep radial veins ascend with the radial arterial pathway from the wrist toward the brachial venous system.'],
 [/ulnar vein/,'deep medial forearm','Deep ulnar veins follow the ulnar neurovascular region from hand and wrist toward the brachial venous system.']
 ];
 const lower=[
 [/dorsal venous arch/,'dorsum of the foot','The dorsal arch gathers blood from the forefoot and communicates with the marginal venous channels.'],
 [/plantar venous arch/,'sole of the foot','The plantar arch collects blood from the forefoot and joins deep plantar and posterior tibial venous pathways.'],
 [/calcaneal/,'heel and calcaneal region','Posterior tibial calcaneal branches approach the heel from the medial ankle region.'],
 [/tarsal/,'lateral tarsus and adjacent dorsal foot','The lateral tarsal artery crosses the dorsal foot toward its lateral border.'],
 [/arcuate/,'dorsal forefoot near the metatarsal bases','The arcuate artery runs transversely over the dorsal metatarsal bases and can supply dorsal metatarsal branches.'],
 [/deep plantar/,'deep plantar arch of the foot','The deep plantar route passes between the dorsal foot and plantar arterial network through the proximal first intermetatarsal region.'],
 [/plantar metatarsal/,'plantar forefoot along the metatarsals','These channels connect the plantar arch territory with more distal digital territories.'],
 [/plantar digital|dorsal digital/,'toes','Digital vessels travel along the toes between their local exchange beds and the forefoot vascular networks.'],
 [/medial plantar/,'medial sole and great-toe region','The medial plantar route courses forward from the medial ankle into the medial sole.'],
 [/lateral plantar/,'lateral and central sole','The lateral plantar artery traverses the sole and turns medially as a major contributor to the deep plantar arch.'],
 [/anterior tibial recurrent/,'anterior knee and upper tibia','The recurrent artery turns back toward the knee from the proximal anterior tibial region.'],
 [/middle genicular/,'intra-articular knee structures','The middle genicular branch approaches the posterior joint capsule and supplies structures within the knee.'],
 [/genicular/,'periarticular knee tissues','Genicular vessels follow the margins of the knee; arterial channels contribute to a communicating periarticular network.'],
 [/circumflex femoral/,'proximal thigh and hip region','Circumflex femoral vessels skirt the proximal femur; a descending lateral circumflex branch extends toward the lateral knee.'],
 [/perforating/,'deep and posterior thigh','Perforating vessels traverse the adductor region to communicate with the posterior muscular compartment.'],
 [/fibular vein/,'deep lateral and posterior leg','Fibular veins ascend with the fibular arterial route and drain into the deep calf venous system.'],
 [/tibial vein/,'deep leg and foot','These deep veins accompany the corresponding tibial arterial route and contribute to popliteal venous return.'],
 [/deep femoral vein/,'deep thigh musculature','Tributaries from the thigh converge on the profunda femoris vein and then the femoral venous system.']
 ];
 const thorax=[
 [/internal thoracic vein/,'deep anterior thoracic wall and anterior intercostal spaces','The internal thoracic veins ascend near the sternal borders, alongside the arteries, and drain toward the brachiocephalic veins.'],
 [/^descending aorta$/,'thoracic and abdominal systemic distribution','The descending aorta continues the arch in the posterior mediastinum and passes through the aortic hiatus to become the abdominal aorta.'],
 [/inferior thyroid/,'thyroid gland and adjacent lower neck','The inferior thyroid arterial route approaches the posterior thyroid region from the thyrocervical circulation.'],
 [/acromial/,'acromion and nearby shoulder','The acromial division of the thoracoacromial circulation runs toward the tip of the shoulder.'],
 [/deltoid branch/,'deltopectoral region','This named division of the thoracoacromial artery follows the interval between deltoid and pectoralis major.'],
 [/pectoral branch/,'pectoral muscles','Pectoral branches of the thoracoacromial system descend into the muscular anterior chest wall.'],
 [/thoraco acromial|thoraco-acromial/,'anterior shoulder and superior chest wall','The short thoracoacromial trunk gives named branches toward pectoral, deltoid, acromial and clavicular regions.'],
 [/dorsal scapular/,'medial scapular border and muscles attached there','The dorsal scapular pathway descends toward the rhomboid region along the medial scapular border.'],
 [/suprascapular/,'supraspinous and infraspinous regions','This vascular route passes toward the superior scapula and the posterior rotator cuff region.'],
 [/transverse cervical|superficial cervical/,'posterior triangle and trapezius region of the neck','The transverse cervical system courses across the posterior triangle toward the shoulder girdle.'],
 [/deep cervical/,'deep posterior neck musculature','The deep cervical pathway ascends in the deep posterior cervical region.'],
 [/lateral thoracic/,'lateral chest wall and portions of the breast','Lateral thoracic vessels descend from the axillary region along the lateral chest wall.'],
 [/musculophrenic/,'inferior anterior thoracic wall and diaphragm','Musculophrenic vessels course along the costal margin toward the diaphragm and lower intercostal spaces.'],
 [/phrenic/,'diaphragm','Phrenic vessels supply or drain portions of the diaphragm; superior and inferior channels approach opposite surfaces.'],
 [/intercostal/,'intercostal spaces of the chest wall','Intercostal vessels follow the spaces between adjacent ribs. Posterior and anterior pathways have different proximal connections.'],
 [/oesoph|esoph/,'thoracic esophagus','Small esophageal branches traverse the posterior mediastinum and reach the esophageal wall.'],
 [/bronchial/,'bronchial walls and supporting lung tissues','Bronchial arteries approach the lung roots through the mediastinum and follow the airway walls.'],
 [/accessory hemiazygos/,'left posterior thoracic wall','The accessory hemiazygos route collects a portion of the left posterior intercostal return and communicates across the midline with the azygos system.']
 ];
 const abdominal=[
 [/deep dorsal vein of penis/,'deep erectile tissues of the penis','The deep dorsal vessel runs beneath the deep penile fascia toward the pelvic venous plexuses.'],
 [/superficial dorsal vein of penis/,'skin and superficial tissue of the penis','The superficial dorsal vein lies superficial to the deep fascia and communicates with superficial pudendal or saphenous drainage.'],
 [/dorsal artery of penis/,'dorsal penile tissues and glans','The dorsal artery runs along the dorsum of the penis and branches distally in the glans.'],
 [/internal pudendal/,'perineum and external genital tissues','Pudendal venous channels accompany the perineal vascular route toward the internal iliac system.'],
 [/obturator/,'medial thigh and obturator region','Obturator veins pass through the obturator canal to connect the medial thigh with pelvic venous outflow.'],
 [/gluteal/,'gluteal muscles and buttock','Gluteal veins pass through the greater sciatic foramen into pelvic venous pathways.'],
 [/iliolumbar/,'iliac fossa and posterior lower abdominal wall','The iliolumbar venous route connects lumbar and iliac territories with pelvic outflow.'],
 [/lateral sacral|median sacral/,'sacral region','Sacral veins course over or alongside the sacrum and participate in the pelvic venous drainage network.'],
 [/suprarenal/,'adrenal gland','Suprarenal vessels approach or leave the adrenal gland above the kidney. Multiple arterial sources can serve one gland.'],
 [/superficial epigastric/,'superficial lower anterior abdominal wall','This superficial vessel traverses the groin and subcutaneous lower abdominal wall.'],
 [/superior epigastric/,'upper anterior wall of the abdomen','The superior epigastric route lies in the rectus sheath and communicates with inferior epigastric pathways.'],
 [/inferior epigastric/,'lower anterior abdominal wall','The inferior epigastric route ascends from the external iliac region into the rectus sheath.'],
 [/subcostal/,'body wall below the twelfth rib','Subcostal vessels follow the lower border of the final rib toward the posterolateral abdominal wall.'],
 [/ascending lumbar/,'posterior abdominal wall','The longitudinal ascending lumbar venous channel links segmental lumbar veins with upper thoracic and lower iliac pathways.'],
 [/lumbar/,'posterior and lateral abdominal wall','Segmental lumbar vessels course around the vertebral bodies into the posterior abdominal wall.'],
 [/caudal pancreatic/,'pancreatic tail','This named pancreatic arterial branch reaches the tail near the splenic hilum.'],
 [/dorsal pancreatic/,'posterior pancreas','The dorsal pancreatic arterial route enters the gland from its posterior aspect and communicates with intrapancreatic arterial branches.'],
 [/great pancreatic/,'body of the pancreas','The great pancreatic branch reaches the pancreatic body, commonly from the splenic arterial system.'],
 [/pancreaticoduodenal/,'pancreatic head and adjacent duodenum','The pancreaticoduodenal arcades link superior and inferior routes around the head of the pancreas. Anterior and posterior channels occupy different faces.'],
 [/inferior pancreatic/,'inferior pancreatic body and tail','A longitudinal pancreatic arterial route tracks the inferior portion of the gland and communicates with other pancreatic branches.'],
 [/gastroduodenal/,'proximal duodenum and pancreaticoduodenal region','The gastroduodenal artery passes behind the first portion of the duodenum before dividing into its gastro-omental and pancreaticoduodenal pathways.'],
 [/gastro epiploic|gastroepiploic/,'greater curvature of the stomach and adjacent greater omentum','Gastro-omental channels follow the greater curvature and communicate between gastric and omental territories.'],
 [/gastric/,'stomach near the lesser curvature','Right and left gastric vessels course in the lesser-curvature region. Their arterial branches and portal venous tributaries serve opposite ends of the gastric capillary bed.'],
 [/marginal colic|marginal artery of colon/,'colonic margin','The marginal arterial arcade follows the mesenteric border of the colon and connects colic branches in a variably continuous route.'],
 [/appendicular/,'vermiform appendix','The appendicular arterial route passes in the mesoappendix toward the appendix.'],
 [/cecal/,'cecal wall','Cecal branches approach the initial pouch of the large bowel. Anterior and posterior branches distribute to their respective surfaces.'],
 [/ileocolic/,'terminal ileum, cecum and adjacent colon','The ileocolic pathway links the superior mesenteric circulation with the ileocecal region. Named branches spread to the ileal and colonic sides.'],
 [/ileal/,'ileum','Ileal vessels pass in the small-bowel mesentery between the bowel wall and superior mesenteric pathways.'],
 [/sigmoid/,'sigmoid colon','Sigmoid vessels pass within the sigmoid mesocolon between the distal colon and inferior mesenteric pathways.'],
 [/superior rectal/,'upper rectum','The superior rectal vascular route descends from the inferior mesenteric circulation into the upper rectal wall.'],
 [/middle colic/,'transverse colon','The middle colic pathway passes within the transverse mesocolon to reach or drain the transverse colon.'],
 [/right colic/,'ascending colon','Right colic vessels run between the right colon and superior mesenteric distribution; common trunks and accessory pathways vary.'],
 [/left colic/,'descending colon and adjacent distal transverse colon','Left colic vessels connect the descending colon with inferior mesenteric pathways. Ascending and descending divisions meet neighboring colic channels.'],
 [/testicular/,'testis and epididymis','The gonadal vessels traverse the retroperitoneum and spermatic cord. Arterial inflow and venous outflow have different proximal connections.'],
 [/ureteric segment of .*renal artery/,'renal arterial pathway in relation to the ureter','The source labels a portion of a renal artery by its topographic relationship to the upper urinary tract. It remains a segment of the renal arterial conduit.'],
 [/renal/,'kidney','Renal arterial divisions distribute blood within the kidney. Venous return follows its own collecting routes toward the renal vein.']
 ];
 const hepaticSegments=[
  ['caudate','caudate region (segment I)'],['lateral superior','left lateral superior territory (segment II)'],['lateral inferior','left lateral inferior territory (segment III)'],
  ['medial superior','left medial superior territory (segment IVa)'],['medial inferior','left medial inferior territory (segment IVb)'],
  ['anterior inferior','right anterior inferior territory (segment V)'],['posterior inferior','right posterior inferior territory (segment VI)'],
  ['posterior superior','right posterior superior territory (segment VII)'],['anterior superior','right anterior superior territory (segment VIII)']
 ];
 function hepatic(p,scene){
  const n=norm(p.name),portal=n.includes('portal vein'),out=n.includes('hepatic vein'),main=n==='hepatic portal vein'||n==='pre hepatic portal vein';
  const t=main?'extrahepatic portal trunk':hepaticSegments.find(([k])=>n.includes(k))?.[1]||(n.includes('left')?'left hepatic territory':n.includes('right')?'right hepatic territory':'liver');
  const f=familyOf(p,scene,portal?'portal':out?'hepaticV':'hepaticA');
  const summary=main?'This portal vein carries venous effluent from abdominal digestive organs and the spleen to the liver.':out?'This hepatic venous route gathers blood after sinusoidal exchange in the '+t+'.':portal?'This portal branch distributes splanchnic venous inflow to the '+t+'.':'This hepatic arterial branch supplies oxygenated systemic blood to the '+t+'.';
  const c=main?'The portal trunk approaches the porta hepatis and divides into right and left intrahepatic pathways.':out?'Trace the tributary from collecting veins within the liver toward its named hepatic venous channel and eventual caval drainage.':'Trace the vessel from a hilar branch into the portal tracts of the '+t+', where hepatic arteries, portal venules and bile ducts travel together.';
  return fields(portal?'Portal vein':out?'Hepatic vein':'Hepatic artery',summary,main?'Porta hepatis and extrahepatic portal course.':cap(t)+'.',out?'Returns mixed sinusoidal blood toward the inferior vena cava.':portal?'Brings nutrient-bearing venous blood to hepatic sinusoids.':'Provides a systemic arterial contribution to the liver and biliary microcirculation.',c,f.phys,out?'Hepatic veins occupy planes between portal territories and can drain across segment boundaries. Portal tracts carry the inflow.':'Portal and arterial branches enter together, while larger hepatic veins leave along separate planes.','Segmental labels indicate a principal territory. Branch origins and the areas drained by a single venous tributary can vary.',srcs(named(p),refs.liver,f.sources));
 }
 function pulmonaryVessel(p,scene){
  const n=norm(p.name),side=sideOf(n),v=p.layer==='veins',stem=v?'vein':'artery',key=n.replace(/apical segmental/,'apical').replace(/ segmental /g,' ');
  if(/^(?:left|right) (?:superior |inferior )?pulmonary (?:vein|artery)$/.test(n)){
    const d=fromAtlas(p,'lungs',n.replaceAll(' ','-'));if(d)return d;
  }
  if(n==='pulmonary trunk')return fromAtlas(p,'heart','pulmonary-trunk');
  const node=n.includes('lingular')?(n.includes('inferior lingular')?'lingula inferior':'lingula superior'):
    ['posterior basal','anterior basal','lateral basal','medial basal','apical','posterior','anterior','lateral','medial','superior'].find(k=>new RegExp('\\b'+k+' (?:segmental )?'+stem+'\\b').test(n));
  const seg=segmentKeys[node],s=side||((node==='lateral'||node==='medial')?'right':'');
  if(seg){
    const [lobe,token,territory,index]=seg,combined=s==='left'&&(index===1||index===2||index===7||index===8),id=s+'-'+lobe+'-'+(combined?(index<=2?'apicoposterior':'anteromedial-basal'):token)+'-artery';
    const sub=/\b(part|branch|trunk) of\b/.test(n);
    if(s&&!v&&!sub&&!combined){const d=fromAtlas(p,'lungs',id);if(d)return d;}
    const vid=s==='left'&&[4,5].includes(index)?'left-lingular-v'+index:s==='right'&&[4,5].includes(index)?'right-middle-v'+index:index>=6?s+'-lower-v'+index:s==='left'&&index===3?'left-upper-v3':'';
    if(s&&v&&!sub&&!combined&&vid){const d=fromAtlas(p,'lungs',vid);if(d)return d;}
    const member=(s?s+' ':'')+territory, kind=sub?'Subsegmental pulmonary '+stem:'Segmental pulmonary '+stem;
    const nm=sub&&n.includes(' of ')?cap(n.split(' of ')[0]):'Segmental channel';
    return fields(kind,'The '+n+' is a '+(sub?'smaller division of a ':'')+'pulmonary '+stem+' for the '+member+' region.',cap(member)+' within the '+lobe+' lobe.',v?'Collects blood after it traverses the alveolar capillary bed.':'Carries oxygen-poor blood toward the gas-exchange surfaces of this territory.',nm+' in the '+member+' distribution. '+(v?'Peripheral venules coalesce into progressively larger collectors returning to a pulmonary vein.':'The arterial tree follows the corresponding bronchial division and branches into the lobular circulation.'),familyOf(p,scene,v?'pulmV':'pulmA').phys,v?'Peripheral venous branches can lie within a segment, along its boundary or within a fissure. A V-number does not by itself establish a boundary.':'The artery generally courses with the bronchus within a segment; venous return has a distinct branching map.',combined?'This source labels the territory separately. The teaching atlas combines parts of the left upper or anteromedial basal tree; their individual arterial and venous roots may vary.':!side?'The source name omits side. The territory follows the published pulmonary grouping; fine branch origins and distal patterns vary.':'Branching pattern, caliber and venous confluences differ among individuals.',srcs(named(p),refs.lung,refs.vein));
  }
  const up=n.includes('upper lobar'),f=familyOf(p,scene,v?'pulmV':'pulmA');
  return fields('Pulmonary '+stem,'This '+(up?'upper-lobar ':'')+'pulmonary '+stem+' belongs to the '+(side?side+' ':'')+'lung circulation.',up?'Hilum and upper-lobe arterial distribution.':'Intrapulmonary vascular tree.',v?'Returns pulmonary capillary blood toward the left atrium.':'Distributes mixed venous blood toward alveolar capillaries.',up?'The lobar arterial route divides into branches for upper-lobe segmental territories.':p.name+' is part of the branching pulmonary circulation.',f.phys,f.rel,'The source groups a selected portion of the pulmonary tree; individual branching patterns vary.',srcs(named(p),refs.lung,refs.vein));
 }
 function coronaryBranch(p,scene){
  const n=norm(p.name),v=p.layer==='veins',f=familyOf(p,scene,v?'cardiacvein':'coronary');
  let t,course;
  if(n.includes('septal')){const back=n.includes('posterior');t=(back?'posterior':'anterior')+' interventricular septum';course='A perforating branch leaves the '+(back?'posterior':'anterior')+' interventricular vessel and enters the muscular septum.';}
  else if(n.includes('conus')){t='right ventricular outflow tract';course='A conal branch runs toward the infundibulum of the right ventricle.';}
  else if(n.includes('diagonal')){t='anterolateral left ventricular wall';course='A diagonal branch leaves the anterior interventricular arterial route and runs obliquely across the left ventricular surface.';}
  else if(n.includes('marginal')){t=(n.includes('left')?'left':'right')+' ventricular margin';course='This marginal venous channel collects blood along the '+(n.includes('left')?'obtuse left':'acute right')+' border of the heart.';}
  else if(n.includes('anterior interventricular vein')){t='anterior interventricular groove';course='This venous segment ascends on the anterior heart beside the anterior interventricular artery as part of the great cardiac venous route.';}
  else if(n.includes('posterior vein')){t='posterior left ventricular wall';course='A posterior ventricular vein collects medial or lateral tributaries over the diaphragmatic surface toward the coronary sinus.';}
  else if(n.includes('posterior ventricular')){t='posterior ventricular myocardium';course='The source identifies a posterior ventricular branch arising from the right coronary distribution.';}
  else if(n.includes('anterior branch')||n.includes('anterior ventricular')){t='anterior right ventricular free wall';course='The selected small ventricular branch descends from its epicardial parent toward the anterior right ventricular surface.';}
  else return null;
  return fields(v?'Cardiac vein':'Coronary branch',p.name+' '+(v?'collects myocardial venous return from ':'distributes coronary blood to ')+t+'.',cap(t)+'.',v?'Returns blood after myocardial capillary exchange.':'Supports oxygen delivery to working myocardium in this territory.',course,f.phys,f.rel,'Numbered and named small coronary branches reflect the source specimen. Coronary dominance and variable adjacent branches influence their territories.',srcs(named(p),f.sources));
 }
 const sceneArea={'bp-head':'head and neck','bp-thorax':'thorax and shoulder girdle','bp-arm':'upper limb','bp-leg':'lower limb','bp-abdomen':'abdomen and pelvis'};
 function generic(p,scene,table,additional,forcedFamily){
  const n=norm(p.name),v=p.layer==='veins',f=familyOf(p,scene,forcedFamily),m=table.find(([re])=>re.test(n)),sd=sideStr(n);
  const t=m?.[1]||sceneArea[scene],course=m?.[2]||cap(n)+' runs in the '+t+' as part of the source vascular tree.';
  const loc=cap(t)+sd+'.';
  const r=v?'Returns regional venous blood from the '+t+'.':'Distributes arterial blood toward the '+t+'.';
  const directNamed=(p.classes||[]).filter(c=>/^(?:branch|tributary) of /.test(c)&&!/anastomosis|subdivision|systemic|caval tree|terminal branch/.test(c));
  const namedRelations=directNamed.filter(c=>!/(?:common carotid|subclavian|basilar artery|internal carotid|common hepatic|celiac artery|external iliac|internal iliac)$/.test(c));
  const grouping=namedRelations[0]||directNamed[0];
  const relationship=(grouping?'The source hierarchy includes “'+grouping+'.” This classification can include upstream vessels as well as direct connections. ':'')+f.rel;
  return fields(v?'Vein':'Artery',p.name+' '+(v?'collects blood from venous pathways in the ':'carries blood into arterial pathways serving the ')+t+sd+'.',loc,r,course,f.phys,relationship,standardVariant,srcs(named(p),additional,f.sources));
 }
 function digitalHand(p,scene){
   const n=norm(p.name),side=sideOf(n),v=p.layer==='veins',proper=n.includes('proper'),finger=n.match(/(little|ring|middle|index|thumb) finger/)?.[1];
   const edge=n.startsWith('lateral ')?'radial':n.startsWith('medial ')?'ulnar':'';
   const area=finger?(edge?edge+' side of the ':'palmar side of the ')+(side?side+' ':'')+finger+' finger':(side?side+' ':'')+'distal palm and adjacent finger margins';
   const f=familyOf(p,scene,v?'armV':'armA');
   const rank=n.match(/^(first|second|third|fourth)/)?.[1];
   return fields((proper?'Proper':'Common')+' digital '+(v?'vein':'artery'),cap(n)+' '+(v?'returns blood from the ':'supplies the ')+area+'.',cap(area)+'.',v?'Collects blood from digital skin and soft tissue.':'Provides oxygen and nutrients to the digital soft tissues.',proper?'A proper digital vessel follows a finger longitudinally near its neurovascular bundle.':(rank?'The source numbers this common vessel “'+rank+'.” ':'')+'Common digital channels connect the distal palm with vessels running along individual fingers.',f.phys,v?'Digital venous channels communicate with superficial and deep networks of the hand.':'Common palmar digital arteries divide into proper digital branches for adjoining finger margins.',proper?'The source names a digit'+(edge?' and its border':'')+'. Adjacent vessels and cross-connections can vary.':'Numbering can differ among atlases. The named source object is preserved without assigning unverified terminal digits.',srcs(named(p),v?refs.limbVein:refs.arm,f.sources));
 }
 function matchVessel(p,scene){
   const n=norm(p.name),bare=stripSides(n),s=sideOf(n);
   // A paired source branch can correspond to a bilateral teaching entry; separate opposing
   // names (e.g. left gastric vs right gastric) must retain their distinct identities.
   let id=vasAliases[n]||vasAliases[bare];
   const candidates=window.vesselStructures||[];
   if(!id)id=candidates.find(e=>norm(e.name)===n||norm(e.id)===n)?.id;
   if(!id)id=candidates.find(e=>norm(e.name)===bare||norm(e.id)===bare)?.id;
   if(id){
     const d=fromAtlas(p,'vessels',id);if(!d)return null;
     if(s&&!norm(id).startsWith(s+' ')){d.location='On the '+s+'. '+d.location;d.variation='The reference mesh identifies the '+s+' vessel. The teaching model may group the corresponding vessels on both sides. '+d.variation;}
     return d;
   }
   return null;
 }
 function referenceNote(scene,p){
   if(!p||!p.name)return null;
   const n=norm(p.name),cls=(p.classes||[]).join(' ').toLowerCase();
   if(p.id==='bp-fma8620')return fields('Unresolved vascular label','The abdominal placement of these source components conflicts with their pulmonary arterial classification.','Conflicting source position and label.','The tissue territory remains unresolved.','The source class and geometric position do not support assigning a continuous course.','A specific perfusion mechanism cannot be attributed to this entry.','The imported class is pulmonary; this atlas does not use it to label a renal or other abdominal vessel.','The entry is withheld from anatomical interpretation.',srcs(named(p),refs.bp));
   if(scene==='ref-lungs')return lungPart(p);
   if(scene==='ref-heart')return heartPart(p);
   if(scene==='bp-thorax'){
     const heart=heartPart(p);
     if(heart)return heart;
   }
   if(/pulmonary artery|pulmonary vein|intrapulmonary vein/.test(cls)||n==='pulmonary trunk')return pulmonaryVessel(p,scene);
   if(scene==='bp-thorax'&&/cardiac vein|coronary|interventricular|conus artery|marginal vein|posterior vein of/.test(n)){
     const cardiac=coronaryBranch(p,scene);if(cardiac)return cardiac;
   }
   if(scene==='bp-abdomen'&&(/segmental hepatic artery|portal vein|hepatic vein|lobe branch of .*hepatic artery|trunk of .*hepatic artery|hepatic artery proper/.test(n))&&n!=='hepatic portal vein')return hepatic(p,scene);
   const fit=matchVessel(p,scene);
   if(fit)return fit;
   if(scene==='bp-head')return generic(p,scene,brain,refs.brain,'cerebral');
   if(scene==='bp-arm'){
     if(n.includes('digital'))return digitalHand(p,scene);
     return generic(p,scene,upper,p.layer==='veins'?refs.limbVein:refs.arm,p.layer==='veins'?'armV':'armA');
   }
   if(scene==='bp-leg')return generic(p,scene,lower,p.layer==='veins'?refs.limbVein:refs.leg,p.layer==='veins'?'legV':'legA');
   if(scene==='bp-thorax')return generic(p,scene,thorax,refs.regional);
   if(scene==='bp-abdomen'){
     const result=generic(p,scene,[...abdominal,...thorax],refs.regional);
     if(n.includes('renal')&&!n.includes('suprarenal')){
       const direction=n.match(/^(superior|inferior|posterior) segmental/)?.[1];
       if(direction){
         result.type='Renal segmental artery';result.location=cap(sideOf(n)||'intrarenal')+' kidney, '+direction+' vascular segment.';
         result.summary=p.name+' supplies the '+direction+' renal territory through branches that become interlobar arteries.';
         result.course='From the renal arterial division, the '+direction+' segmental branch distributes toward its corresponding renal parenchyma.';
         result.relationship='Renal segmental arteries behave largely as end arteries. Distal branches lead toward afferent arterioles and the glomerular capillary bed.';
       }
     }
     if(n.includes('ureteric segment of')){result.summary='This source structure is a topographically named segment of the '+sideOf(n)+' renal artery. Its designation alone does not establish a separate ureteral supply.';result.role='Conducts blood through the renal arterial pathway.';result.location=cap(sideOf(n))+' renal hilar region.';}
     if(n.includes('inferior suprarenal artery'))result.course='The inferior suprarenal supply commonly arises from a renal artery and courses upward to the inferior surface of the adrenal gland.';
     if(n.includes('middle suprarenal artery'))result.course='A middle suprarenal artery commonly leaves the abdominal aorta and travels laterally toward the adrenal gland.';
     if(n.includes('descending branch of left colic'))result.course='This left colic division descends toward the sigmoid territory and contributes to connections along the colonic margin.';
     if(n.includes('ascending branch of left colic'))result.course='This left colic division ascends toward the splenic flexure and can connect with the middle colic distribution along the colonic margin.';
     if(n.includes('descending branch of right colic'))result.course='This right colic division descends toward the ileocolic territory along the ascending colon.';
     if(n.includes('ascending branch of right colic'))result.course='This right colic division ascends toward the hepatic flexure and the middle colic distribution.';
     if(n.includes('testicular vein'))result.course=sideOf(n)==='left'?'The left testicular vein ascends from the pampiniform venous plexus and normally joins the left renal vein.':'The right testicular vein ascends from the pampiniform venous plexus and normally drains to the inferior vena cava.';
     if(n.includes('suprarenal vein'))result.course=sideOf(n)==='left'?'The left suprarenal vein drains toward the left renal vein and may join the inferior phrenic vein.':'The short right suprarenal vein typically drains directly into the inferior vena cava.';
     return result;
   }
   return null;
 }
 window.referenceNote=referenceNote;
})();
