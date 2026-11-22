(() => {
const step=(scene,id,text,view='Anterior')=>({scene,id,text,view});
window.atlasPaths=[
 {title:'Pulmonary circulation',desc:'Trace blood from heart to lungs.',theme:'warm',art:'circuit',steps:[
 step('heart','right-ventricle','Start in the right ventricle. When it contracts, blood moves toward the pulmonary valve.'),
 step('heart','pulmonary-valve','Ventricular pressure opens the three cusps. Blood moves into the pulmonary trunk.'),
 step('heart','pulmonary-trunk','The trunk divides into right and left pulmonary arteries. Follow the right branch.'),
 step('lungs','right-pulmonary-artery','This artery carries oxygen-poor blood into the right lung, where its branches narrow into arterioles.'),
 step('alveoli','alveolar-capillaries','At the alveolar capillaries, oxygen diffuses into blood and carbon dioxide diffuses into air.'),
 step('lungs','right-superior-pulmonary-vein','Venules merge into pulmonary veins. Follow one route from the upper right lung back to the heart.','Posterior'),
 step('heart','left-atrium','Oxygen-rich blood enters the left atrium. It can now pass through the mitral valve toward the systemic circuit.','Posterior')]},
 {title:'The airway tree',desc:'Follow a breath into the lungs.',theme:'green',art:'tree',steps:[
 step('lungs','trachea','After passing through the nose or mouth, pharynx, and larynx, inspired air enters the trachea. Cartilage supports its walls.'),
 step('lungs','carina','At this ridge, the trachea divides. Follow air down the left side of the tree.'),
 step('lungs','left-main-bronchus','The left main bronchus conducts air into the left lung, then divides into lobar bronchi.'),
 step('lungs','segmental-bronchi','Each segmental bronchus ventilates a bronchopulmonary segment. Smaller branches lead toward the bronchioles.'),
 step('alveoli','terminal-bronchiole','This is the final purely conducting airway. Respiratory bronchioles continue beyond it.'),
 step('alveoli','respiratory-bronchiole','The first alveoli interrupt the airway wall here. Gas exchange can begin.'),
 step('alveoli','alveolar-duct','Air continues through passages lined with openings into alveoli.'),
 step('alveoli','alveoli','Oxygen molecules diffuse across the thin air–blood barrier toward nearby capillary blood.')]},
 {title:'Systemic circulation',desc:'Follow blood through the body.',theme:'blue',art:'vessel',steps:[
 step('heart','left-ventricle','The left ventricle ejects oxygen-rich blood through the aortic valve. Follow one route to a leg and back.'),
 step('vessels','aorta','Blood curves through the aortic arch, descends through the thorax, and crosses the diaphragm.'),
 step('vessels','abdominal-aorta','The abdominal aorta divides into common iliac arteries. Each external iliac artery continues toward the thigh.'),
 step('vessels','femoral-artery','Across the inguinal ligament, the external iliac becomes the femoral artery. Branches supply thigh muscles.'),
 step('vessels','femoral-vein','After exchange in tissue capillaries, blood enters venules. Deep veins of the thigh feed the femoral vein.'),
 step('vessels','common-iliac-vein','The external iliac joins the internal iliac vein. The common iliac veins unite to form the inferior vena cava.'),
 step('heart','inferior-vena-cava','Blood from below the diaphragm reaches the heart through the inferior vena cava.','Posterior'),
 step('heart','right-atrium','The right atrium receives this venous return, completing the route.')]},
 {title:'Coronary circulation',desc:'Explore the heart’s own blood supply.',theme:'ochre',art:'circuit',steps:[
 step('heart','aorta','Near the aortic valve, blood enters the coronary ostia, the openings that supply the heart muscle.'),
 step('heart','left-coronary-artery','The left coronary artery passes between the pulmonary trunk and the left auricle before branching.'),
 step('heart','left-anterior-descending','Follow the anterior interventricular artery toward the apex. Smaller branches deliver blood to the myocardium.'),
 step('heart','great-cardiac-vein','After capillary exchange, venous blood from this territory enters the great cardiac vein.'),
 step('heart','coronary-sinus','The coronary sinus collects blood from several cardiac veins on the posterior surface.','Posterior'),
 step('heart','right-atrium','The coronary sinus opens into the right atrium, returning blood from the myocardium.')]},
 {title:'Across the air–blood barrier',desc:'See how oxygen reaches the blood.',theme:'green',art:'tree',steps:[
 step('alveoli','pulmonary-arteriole','A pulmonary arteriole brings oxygen-poor blood close to the air spaces.'),
 step('alveoli','alveolar-sac','Air in the sac communicates with the alveoli that open around it.'),
 step('alveoli','respiratory-membrane','Oxygen crosses thin alveolar epithelium, basement membrane, and capillary endothelium along its partial-pressure gradient.'),
 step('alveoli','alveolar-capillaries','Oxygen enters red blood cells and binds hemoglobin. Carbon dioxide moves from blood to alveolar air.'),
 step('alveoli','pulmonary-venule','Blood leaving the capillary bed enters venules and then pulmonary veins on its way to the left atrium.')]}
];
window.atlasQuiz=[
 ['Cardiovascular','A red blood cell has just passed through the tricuspid valve. Which chamber does it enter?',['Right atrium','Left ventricle','Right ventricle','Left atrium'],2,'The tricuspid valve separates the right atrium from the right ventricle. The next valve along this route is the pulmonary valve.','heart','tricuspid-valve'],
 ['Pulmonary','Which vessel delivers oxygen-poor blood to the capillaries surrounding the alveoli?',['Pulmonary arteriole','Pulmonary venule','Aortic arch','Pulmonary vein'],0,'A pulmonary arteriole supplies the exchange network. After oxygen uptake, venules collect blood leaving the capillaries.','alveoli','pulmonary-arteriole'],
 ['Cardiovascular','Which pair of structures lies directly on either side of the mitral valve?',['Right atrium and right ventricle','Left atrium and left ventricle','Right ventricle and pulmonary trunk','Left ventricle and aorta'],1,'Blood passes from the left atrium through the mitral valve into the left ventricle during ventricular filling.','heart','mitral-valve'],
 ['Pulmonary','Where along an inhaled breath’s route do alveoli first appear in the airway wall?',['Trachea','Lobar bronchus','Terminal bronchiole','Respiratory bronchiole'],3,'Respiratory bronchioles have scattered alveoli in their walls. Terminal bronchioles belong to the conducting zone.','alveoli','respiratory-bronchiole'],
 ['Cardiovascular','Blood has left the femoral vein on its way back to the heart. Which sequence follows?',['Internal iliac vein, portal vein, right atrium','External iliac vein, common iliac vein, inferior vena cava','Popliteal vein, aorta, left atrium','Great saphenous vein, coronary sinus, right atrium'],1,'At the inguinal ligament the femoral vein continues as the external iliac vein. Blood then passes through a common iliac vein to the inferior vena cava.','vessels','femoral-vein'],
 ['Pulmonary','Which route does oxygen take to enter blood in a ventilated alveolus?',['Alveolar air → epithelium → capillary blood','Capillary blood → epithelium → alveolar air','Bronchus → pleural cavity → vena cava','Alveolar air → pulmonary vein wall → trachea'],0,'Oxygen diffuses from alveolar air across the thin respiratory membrane into blood when its partial pressure is higher in the alveolus.','alveoli','respiratory-membrane'],
 ['Cardiovascular','Which structure receives most venous blood draining from the myocardium before it reaches the right atrium?',['Pulmonary trunk','Left coronary artery','Coronary sinus','Aortic sinus'],2,'The coronary sinus receives cardiac veins and opens into the right atrium. It lies in the posterior atrioventricular groove.','heart','coronary-sinus'],
 ['Pulmonary','During inspiration, what does contraction of the diaphragm do?',['Raises its dome and reduces thoracic volume','Flattens its dome and increases thoracic volume','Closes the main bronchi','Raises pressure inside the alveoli above atmospheric pressure'],1,'The diaphragm descends as it contracts. Increasing thoracic volume helps lower alveolar pressure so air enters.','lungs','diaphragm'],
 ['Cardiovascular','A cell leaves the left ventricle through the aortic valve. Which branch can supply the anterior ventricular wall?',['Superior vena cava','Pulmonary trunk','Great cardiac vein','Anterior interventricular artery'],3,'The anterior interventricular artery branches from the left coronary artery and runs toward the apex. It is also called the LAD.','heart','left-anterior-descending'],
 ['Pulmonary','Which lung has a middle lobe, and how many lobes does that lung have in total?',['Left, two','Left, three','Right, three','Right, two'],2,'The right lung has superior, middle, and inferior lobes. The left lung has superior and inferior lobes and a cardiac notch.','lungs','lungs'],
 ['Cardiovascular','Blood from intestinal capillaries enters the hepatic portal vein. What is its next major destination?',['Lung capillaries','Liver sinusoids','Left atrium','Coronary arteries'],1,'Portal blood travels to a second capillary bed in the liver. Hepatic veins then drain blood into the inferior vena cava.','vessels','hepatic-portal-vein'],
 ['Pulmonary','Which chamber receives blood after it returns from the lungs through the pulmonary veins?',['Left atrium','Left ventricle','Right atrium','Right ventricle'],0,'Pulmonary venous blood enters the left atrium before passing through the mitral valve to the left ventricle.','heart','left-atrium']
];
})();
