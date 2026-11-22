(() => {
 const s=(scene,id,text,view='Anterior')=>({scene,id,text,view});
 atlasPaths.push(
 {title:'Cardiac conduction',desc:'Connect electrical activation with ventricular ejection.',theme:'ochre',art:'circuit',steps:[
 s('heart','sinoatrial-node','Pacemaker cells depolarize spontaneously near the superior caval junction. The resulting wave spreads through both atria.'),
 s('heart','right-atrium','Atrial depolarization is followed by atrial contraction. In late diastole this adds blood to the ventricles through open atrioventricular valves.'),
 s('heart','atrioventricular-node','Slow conduction through the atrioventricular junction separates atrial from ventricular activation in time.'),
 s('heart','atrioventricular-bundle','The His bundle traverses the fibrous insulating plane, carrying activation into the right and left bundle branches.'),
 s('heart','purkinje-fibers','The subendocardial network rapidly distributes activation to ventricular myocardium, coordinating contraction across the chamber walls.'),
 s('heart','left-ventricle','Tension raises ventricular pressure. The mitral valve closes before pressure rises sufficiently to open the aortic valve.')]},
 {title:'Portal venous return',desc:'Follow absorbed nutrients through two capillary beds.',theme:'blue',art:'vessel',steps:[
 s('vessels','superior-mesenteric-artery','Arterial branches supply intestinal capillaries. Water-soluble nutrients absorbed across the epithelium enter portal venous blood.'),
 s('vessels','superior-mesenteric-vein','Small intestinal veins collect the effluent and feed the superior mesenteric vein.'),
 s('vessels','hepatic-portal-vein','The superior mesenteric and splenic veins usually unite behind the neck of the pancreas. Blood enters intrahepatic portal branches and then liver sinusoids.','Posterior'),
 s('vessels','hepatic-veins','Blood from portal and hepatic arterial inflow mixes in the sinusoids. Central and collecting veins carry it into the hepatic veins.','Posterior'),
 s('heart','inferior-vena-cava','The hepatic veins enter the inferior vena cava below the diaphragm. The cava delivers the blood to the right atrium.','Posterior')]},
 {title:'Right upper-lobe venous drainage',desc:'Distinguish pulmonary venous boundaries from airway territories.',theme:'green',art:'tree',steps:[
 s('lungs','right-upper-apical-artery','The apical arterial branch supplies the apical segment. Its distribution broadly accompanies the segmental bronchus.'),
 s('alveoli','alveolar-capillaries','Blood passes through the septal capillary network. Gas exchange depends on the local gradients and the match between ventilation and perfusion.'),
 s('lungs','right-upper-v1b','This intersegmental route marks the apical–anterior boundary in the pattern illustrated. A venous tributary can collect from tissue on both sides of a segmental plane.'),
 s('lungs','right-upper-anterior-vein','The illustrated anterior venous trunk collects tributaries on its way toward the superior pulmonary vein. Central and anterior drainage patterns vary.'),
 s('lungs','right-superior-pulmonary-vein','Follow the oxygenated blood through the right superior pulmonary vein to its left atrial opening.','Posterior'),
 s('heart','left-atrium','The left atrium stores pulmonary venous return during ventricular systole and helps fill the ventricle in diastole.','Posterior')]}
 );
})();
