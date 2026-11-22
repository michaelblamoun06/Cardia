/* Regional vessel groups follow OpenStax Anatomy and Physiology 2e, section 20.5.
   Coordinates show a typical adult branching pattern in anatomical position. */
(() => {
  "use strict";
  const catalog = [];
  function add(layer, rows) {
    for (const [id,name,latin,location,summary,role,related] of rows) {
      catalog.push({id,name,latin,location,summary,role,layer,related:related.split(" ").filter(Boolean),
        type:layer === "arteries" ? "Artery" : layer === "veins" ? "Vein" : "Vascular system"});
    }
  }
  add("tissue", [
    ["systemic-vessels","Systemic circulation","Circulatio systemica","Whole body","Follow blood from the aorta through regional arteries, then trace its return through the veins. Both sides of the body are shown where vessels are paired.","The systemic circuit delivers oxygen and nutrients to tissues and transports carbon dioxide and other products away.","aorta superior-vena-cava inferior-vena-cava hepatic-portal-vein"]
  ]);
  add("arteries",[
    ["aorta","Aortic arch and ascending aorta","Aorta ascendens et arcus aortae","Superior mediastinum","Blood enters the ascending aorta from the left ventricle. The arch curves toward the left and back above the root of the left lung.","The arch gives rise to three major branches supplying the head, neck and upper limbs.","brachiocephalic-trunk common-carotid-artery subclavian-artery thoracic-aorta"],
    ["brachiocephalic-trunk","Brachiocephalic trunk","Truncus brachiocephalicus","Superior mediastinum, right side","The first branch of the aortic arch divides into the right common carotid and right subclavian arteries.","This short trunk connects the aortic arch to the right side of the head and right upper limb.","aorta common-carotid-artery subclavian-artery"],
    ["common-carotid-artery","Common carotid artery","Arteria carotis communis","Anterolateral neck","Each common carotid ascends in a carotid sheath and divides into internal and external carotid branches. The right side arises from the brachiocephalic trunk and the left usually arises directly from the aortic arch.","It supplies the two principal arterial pathways to the head.","internal-carotid-artery external-carotid-artery internal-jugular-vein"],
    ["internal-carotid-artery","Internal carotid artery","Arteria carotis interna","Deep neck and skull base","The internal carotid ascends through the neck without major cervical branches and enters the skull through the carotid canal.","It supplies the eye and much of the anterior cerebral circulation.","common-carotid-artery anterior-cerebral-artery middle-cerebral-artery posterior-communicating-artery"],
    ["external-carotid-artery","External carotid artery","Arteria carotis externa","Upper neck and face","This anterior carotid branch gives off multiple vessels in the neck and continues into the parotid region.","Its branches supply most superficial structures of the face, scalp and neck.","facial-artery superficial-temporal-artery maxillary-artery occipital-artery"],
    ["facial-artery","Facial artery","Arteria facialis","Lower jaw and anterior face","The facial artery curves over the inferior edge of the mandible and ascends across the face toward the medial eye.","It supplies the lips, cheek and nose.","external-carotid-artery facial-vein"],
    ["maxillary-artery","Maxillary artery","Arteria maxillaris","Deep face","One of the two terminal branches of the external carotid passes deep to the neck of the mandible.","It supplies deep facial structures, teeth, nasal tissues and parts of the dura through its branches.","external-carotid-artery superficial-temporal-artery"],
    ["superficial-temporal-artery","Superficial temporal artery","Arteria temporalis superficialis","Lateral scalp","A terminal branch of the external carotid ascends in front of the ear, then branches over the temple.","It delivers blood to the lateral and anterior scalp.","external-carotid-artery occipital-artery"],
    ["occipital-artery","Occipital artery","Arteria occipitalis","Posterior scalp","A posterior branch of the external carotid ascends toward the occiput.","It supplies the back of the scalp and muscles in the posterior neck.","external-carotid-artery superficial-temporal-artery"],
    ["vertebral-artery","Vertebral artery","Arteria vertebralis","Posterior neck and cranial base","The vertebral arteries ascend from the subclavian arteries through cervical transverse foramina. They enter the skull and unite at the lower pons.","Together they form the basilar artery of the posterior cerebral circulation.","subclavian-artery basilar-artery"],
    ["basilar-artery","Basilar artery","Arteria basilaris","Ventral surface of the pons","The paired vertebral arteries unite to form a midline trunk that runs on the brainstem.","It supplies the brainstem and terminates as the posterior cerebral arteries.","vertebral-artery posterior-cerebral-artery"],
    ["anterior-cerebral-artery","Anterior cerebral artery","Arteria cerebri anterior","Medial frontal and parietal lobes","Each anterior cerebral artery travels toward the midline and curves over the corpus callosum.","It supplies much of the medial frontal and parietal cortex.","internal-carotid-artery anterior-communicating-artery"],
    ["anterior-communicating-artery","Anterior communicating artery","Arteria communicans anterior","Anterior base of the brain","This short midline vessel joins the two anterior cerebral arteries.","It provides a potential route for collateral flow between them.","anterior-cerebral-artery internal-carotid-artery"],
    ["middle-cerebral-artery","Middle cerebral artery","Arteria cerebri media","Lateral cerebral hemisphere","The middle cerebral artery passes laterally from the internal carotid into the lateral sulcus.","Its branches supply much of the lateral surface of each cerebral hemisphere.","internal-carotid-artery anterior-cerebral-artery"],
    ["posterior-cerebral-artery","Posterior cerebral artery","Arteria cerebri posterior","Posterior cerebral hemisphere","The paired terminal branches of the basilar artery curve around the midbrain.","They supply the occipital cortex and portions of the temporal lobes and deeper structures.","basilar-artery posterior-communicating-artery"],
    ["posterior-communicating-artery","Posterior communicating artery","Arteria communicans posterior","Cerebral arterial circle","A posterior communicating artery links the internal carotid and posterior cerebral systems on each side.","It contributes to a potential collateral pathway between the anterior and posterior circulations.","internal-carotid-artery posterior-cerebral-artery"],
    ["subclavian-artery","Subclavian artery","Arteria subclavia","Root of neck, deep to clavicle","Each subclavian arches over the first rib and becomes the axillary artery at that rib's lateral border.","Its branches supply the neck, thoracic wall and posterior brain. Its continuation supplies the arm.","axillary-artery vertebral-artery internal-thoracic-artery"],
    ["internal-thoracic-artery","Internal thoracic artery","Arteria thoracica interna","Anterior chest wall","This subclavian branch descends on the inner chest wall, close to the side of the sternum.","It supplies anterior intercostal spaces and contributes blood to the upper abdominal wall.","subclavian-artery intercostal-arteries"],
    ["axillary-artery","Axillary artery","Arteria axillaris","Axilla","The subclavian artery changes name at the lateral first rib, then crosses the axilla before continuing as the brachial artery.","Its branches supply the shoulder girdle, axillary region and thoracic wall.","subclavian-artery brachial-artery axillary-vein"],
    ["brachial-artery","Brachial artery","Arteria brachialis","Anterior arm","The brachial artery passes along the medial arm and typically divides in the cubital fossa.","It supplies the arm and delivers blood to the radial and ulnar arteries.","axillary-artery radial-artery ulnar-artery deep-brachial-artery"],
    ["deep-brachial-artery","Deep brachial artery","Arteria profunda brachii","Posterior arm","This proximal branch of the brachial artery travels around the posterior humerus with the radial nerve.","It supplies the posterior compartment of the arm and contributes to circulation around the elbow.","brachial-artery"],
    ["radial-artery","Radial artery","Arteria radialis","Lateral forearm and hand","The radial artery travels on the thumb side of the forearm and passes dorsally around the wrist before entering the palm.","It is a major contributor to the deep palmar arch. Its pulse is easy to feel at the wrist.","brachial-artery palmar-arches ulnar-artery"],
    ["ulnar-artery","Ulnar artery","Arteria ulnaris","Medial forearm and palm","The ulnar artery follows the little-finger side of the forearm and enters the palm anteriorly.","It provides the main contribution to the superficial palmar arch.","brachial-artery palmar-arches radial-artery"],
    ["palmar-arches","Palmar arterial arches","Arcus palmares","Palm","The superficial and deep palmar arches link branches of the ulnar and radial arteries. Their completeness varies.","These arterial connections distribute blood to the palm and fingers through digital branches.","radial-artery ulnar-artery digital-arteries"],
    ["digital-arteries","Digital arteries of the hand","Arteriae digitales palmares","Fingers","Branches of the palmar arches divide into proper digital arteries that run along the sides of the fingers.","They supply the skin, soft tissues and tips of the digits.","palmar-arches"],
    ["thoracic-aorta","Descending thoracic aorta","Aorta thoracica","Posterior mediastinum","The descending thoracic aorta passes down the left side of the spine and crosses the diaphragm at the aortic hiatus.","It supplies the thoracic wall and visceral branches before becoming the abdominal aorta.","aorta intercostal-arteries abdominal-aorta"],
    ["intercostal-arteries","Posterior intercostal arteries","Arteriae intercostales posteriores","Posterior and lateral thoracic wall","Most posterior intercostal arteries arise from the thoracic aorta and follow intercostal spaces around the ribs. Selected levels are shown.","They supply the intercostal muscles and adjacent chest wall.","thoracic-aorta internal-thoracic-artery intercostal-veins"],
    ["abdominal-aorta","Abdominal aorta","Aorta abdominalis","Retroperitoneum","The aorta enters the abdomen through the diaphragm, descends in front of the vertebral column and usually divides near L4.","It supplies abdominal organs and divides into the common iliac arteries.","thoracic-aorta celiac-trunk renal-artery common-iliac-artery"],
    ["celiac-trunk","Celiac trunk","Truncus coeliacus","Upper abdomen","The celiac trunk arises from the abdominal aorta below the diaphragm. Its classic branches are the left gastric, splenic and common hepatic arteries.","It supplies foregut organs and the spleen.","left-gastric-artery splenic-artery common-hepatic-artery"],
    ["left-gastric-artery","Left gastric artery","Arteria gastrica sinistra","Upper stomach","The left gastric artery arises from the celiac trunk and descends along the lesser curvature of the stomach.","It supplies the stomach and lower esophagus.","celiac-trunk"],
    ["splenic-artery","Splenic artery","Arteria splenica","Left upper abdomen","The splenic artery follows a tortuous course along the upper margin of the pancreas toward the spleen.","It supplies the spleen and gives branches to the pancreas and stomach.","celiac-trunk splenic-vein"],
    ["common-hepatic-artery","Common hepatic artery","Arteria hepatica communis","Upper abdomen, toward the liver","The common hepatic artery runs to the right from the celiac trunk. After giving off the gastroduodenal artery it continues as the proper hepatic artery.","It contributes to the arterial supply of the liver and upper digestive tract.","celiac-trunk hepatic-portal-vein hepatic-veins"],
    ["superior-mesenteric-artery","Superior mesenteric artery","Arteria mesenterica superior","Central abdomen","This unpaired vessel arises anteriorly from the aorta below the celiac trunk and sends branches into the mesentery.","It supplies midgut derivatives from distal duodenum to the proximal two-thirds of the transverse colon.","abdominal-aorta superior-mesenteric-vein inferior-mesenteric-artery"],
    ["inferior-mesenteric-artery","Inferior mesenteric artery","Arteria mesenterica inferior","Lower abdomen","This aortic branch courses toward the left colon and continues into the pelvis as the superior rectal artery.","It supplies hindgut derivatives from the distal transverse colon to the upper rectum.","abdominal-aorta superior-mesenteric-artery inferior-mesenteric-vein"],
    ["renal-artery","Renal artery","Arteria renalis","Retroperitoneum, renal hilum","A renal artery passes laterally from the aorta to each kidney. The right artery crosses behind the inferior vena cava.","Its branches deliver the blood filtered by the kidneys.","abdominal-aorta renal-vein"],
    ["gonadal-artery","Gonadal artery","Arteria testicularis vel ovarica","Retroperitoneum and pelvis","The paired testicular or ovarian arteries usually arise inferior to the renal arteries and descend on the posterior abdominal wall. Their distal courses differ.","These vessels supply the gonads.","abdominal-aorta gonadal-vein"],
    ["common-iliac-artery","Common iliac artery","Arteria iliaca communis","Lower abdomen and pelvic brim","The terminal branches of the abdominal aorta separate and divide into internal and external iliac arteries.","They distribute systemic blood to the pelvis and lower limbs.","abdominal-aorta internal-iliac-artery external-iliac-artery"],
    ["internal-iliac-artery","Internal iliac artery","Arteria iliaca interna","Pelvis","Each internal iliac artery turns into the pelvis and gives rise to numerous visceral and parietal branches.","It supplies pelvic organs, gluteal muscles and portions of the perineum.","common-iliac-artery internal-iliac-vein"],
    ["external-iliac-artery","External iliac artery","Arteria iliaca externa","Pelvic brim","The external iliac artery travels along the iliopsoas and passes beneath the inguinal ligament, where its name changes to femoral artery.","It carries the principal arterial inflow to the lower limb.","common-iliac-artery femoral-artery external-iliac-vein"],
    ["femoral-artery","Femoral artery","Arteria femoralis","Anterior and medial thigh","The femoral artery enters the thigh beneath the inguinal ligament. Passing through the adductor hiatus, it becomes the popliteal artery.","It sends blood to the thigh and onward to the leg and foot.","external-iliac-artery deep-femoral-artery popliteal-artery femoral-vein"],
    ["deep-femoral-artery","Deep femoral artery","Arteria profunda femoris","Deep thigh","This major femoral branch gives rise to perforating arteries that reach the posterior compartment of the thigh.","It supplies much of the thigh musculature.","femoral-artery"],
    ["popliteal-artery","Popliteal artery","Arteria poplitea","Posterior knee","The popliteal artery runs through the popliteal fossa and supplies branches around the knee.","Its terminal branches feed the anterior and posterior pathways of the leg.","femoral-artery anterior-tibial-artery posterior-tibial-artery popliteal-vein"],
    ["anterior-tibial-artery","Anterior tibial artery","Arteria tibialis anterior","Anterior leg","The anterior tibial artery passes through the interosseous membrane and descends down the front of the leg.","It supplies the anterior compartment and continues as the dorsalis pedis artery at the ankle.","popliteal-artery dorsalis-pedis-artery"],
    ["posterior-tibial-artery","Posterior tibial artery","Arteria tibialis posterior","Posterior leg and medial ankle","The posterior tibial artery descends in the deep posterior compartment, then passes behind the medial malleolus.","It supplies the posterior leg and gives rise to the plantar arteries of the foot.","popliteal-artery fibular-artery plantar-arteries"],
    ["fibular-artery","Fibular artery","Arteria fibularis","Deep posterolateral leg","The fibular artery branches from the posterior tibial system and descends along the fibula.","It supplies the posterolateral leg and contributes branches around the ankle.","posterior-tibial-artery"],
    ["dorsalis-pedis-artery","Dorsalis pedis artery","Arteria dorsalis pedis","Dorsum of foot","The anterior tibial artery changes name as it crosses the ankle onto the top of the foot.","Its branches supply the dorsal foot and communicate with the plantar circulation.","anterior-tibial-artery plantar-arteries"],
    ["plantar-arteries","Plantar arteries","Arteriae plantares","Sole of foot","The posterior tibial artery divides into medial and lateral plantar branches. A plantar arch connects with the dorsal circulation.","These vessels supply the sole and distribute blood toward the toes.","posterior-tibial-artery dorsalis-pedis-artery"]
  ]);
  add("veins",[
    ["superior-vena-cava","Superior vena cava","Vena cava superior","Right superior mediastinum","The right and left brachiocephalic veins unite to form this short trunk. It also receives the azygos vein before entering the right atrium.","It returns systemic venous blood from the head, neck, upper limbs and much of the thorax.","brachiocephalic-vein azygos-vein inferior-vena-cava"],
    ["brachiocephalic-vein","Brachiocephalic vein","Vena brachiocephalica","Upper chest, behind clavicle","The internal jugular and subclavian veins unite on each side. The left brachiocephalic vein is longer and crosses the midline behind the upper sternum.","The paired veins channel blood from the head and upper limbs into the superior vena cava.","subclavian-vein internal-jugular-vein superior-vena-cava"],
    ["internal-jugular-vein","Internal jugular vein","Vena jugularis interna","Deep lateral neck","The internal jugular vein continues from the sigmoid sinus at the jugular foramen and descends beside the carotid artery.","It drains venous blood from the brain and receives tributaries from the face and neck.","dural-venous-sinuses brachiocephalic-vein facial-vein"],
    ["dural-venous-sinuses","Dural venous sinuses","Sinus durae matris","Inside the cranium","Channels between layers of dura receive venous blood from the brain. The superior sagittal, transverse and sigmoid pathways are depicted.","They collect cerebral venous blood and deliver it to the internal jugular veins.","internal-jugular-vein"],
    ["external-jugular-vein","External jugular vein","Vena jugularis externa","Superficial lateral neck","The external jugular crosses superficial to the sternocleidomastoid muscle and usually empties into the subclavian vein.","It drains superficial regions of the scalp and face.","subclavian-vein internal-jugular-vein"],
    ["facial-vein","Facial vein","Vena facialis","Face","Blood from the medial eye and superficial face drains down the face. The facial vein commonly joins a retromandibular tributary before reaching the internal jugular vein.","It provides a major superficial venous route from the face.","internal-jugular-vein facial-artery"],
    ["subclavian-vein","Subclavian vein","Vena subclavia","Deep to clavicle","The axillary vein becomes the subclavian vein at the lateral border of the first rib. It passes anterior to the anterior scalene muscle.","It returns blood from the upper limb to the brachiocephalic vein.","axillary-vein brachiocephalic-vein external-jugular-vein"],
    ["axillary-vein","Axillary vein","Vena axillaris","Axilla","The axillary vein receives deep and superficial blood from the arm and becomes the subclavian vein at the first rib.","It is the central outflow route from the upper limb.","subclavian-vein brachial-veins cephalic-vein basilic-vein"],
    ["brachial-veins","Brachial veins","Venae brachiales","Deep arm","The deep veins accompanying the brachial artery receive blood from the radial and ulnar veins. Paired veins are represented by one course on each side.","They return blood from the arm muscles and forearm to the axillary system.","deep-forearm-veins axillary-vein brachial-artery"],
    ["deep-forearm-veins","Radial and ulnar veins","Venae radiales et ulnares","Deep forearm","These deep veins accompany the radial and ulnar arteries, often as paired channels. Representative courses are shown.","They carry blood from the hand and forearm into the brachial veins.","brachial-veins radial-artery ulnar-artery"],
    ["cephalic-vein","Cephalic vein","Vena cephalica","Superficial lateral upper limb","The cephalic vein begins on the thumb side of the dorsal hand and ascends along the lateral forearm and arm to the deltopectoral groove.","It drains superficial tissues into the axillary vein.","hand-venous-network median-cubital-vein axillary-vein"],
    ["basilic-vein","Basilic vein","Vena basilica","Superficial medial upper limb","The basilic vein ascends on the little-finger side of the forearm and medial arm, then joins the deep venous system.","It provides a major superficial route from the hand into the axillary system.","hand-venous-network median-cubital-vein axillary-vein"],
    ["median-cubital-vein","Median cubital vein","Vena mediana cubiti","Anterior elbow","This superficial communicating vein commonly runs obliquely between the cephalic and basilic veins. Its pattern varies among individuals.","It links the lateral and medial superficial venous routes.","cephalic-vein basilic-vein"],
    ["hand-venous-network","Dorsal venous network of hand","Rete venosum dorsale manus","Back of hand","Digital veins drain into a superficial network on the dorsum of the hand.","The network gives rise to the cephalic and basilic veins.","cephalic-vein basilic-vein"],
    ["azygos-vein","Azygos vein","Vena azygos","Right posterior mediastinum","The azygos ascends to the right of the vertebral bodies and arches forward over the root of the right lung to the superior vena cava.","It collects blood from the thoracic wall and serves as a collateral pathway between the caval systems.","intercostal-veins hemiazygos-vein superior-vena-cava"],
    ["hemiazygos-vein","Hemiazygos vein","Vena hemiazygos","Left lower posterior mediastinum","This vein ascends on the left and crosses the vertebral column to drain into the azygos vein.","It collects venous blood from lower left posterior intercostal spaces.","azygos-vein intercostal-veins"],
    ["intercostal-veins","Posterior intercostal veins","Venae intercostales posteriores","Posterolateral thoracic wall","Veins in the intercostal spaces return blood from the thoracic wall. Many drain into the azygos or hemiazygos pathways.","These channels collect venous blood from intercostal muscles and the chest wall.","azygos-vein hemiazygos-vein intercostal-arteries"],
    ["inferior-vena-cava","Inferior vena cava","Vena cava inferior","Right posterior abdomen","The common iliac veins join to form the inferior vena cava. It ascends to the right of the aorta and crosses the diaphragm before reaching the right atrium.","It returns blood from below the diaphragm, including blood leaving the liver and kidneys.","common-iliac-vein hepatic-veins renal-vein"],
    ["hepatic-veins","Hepatic veins","Venae hepaticae","Liver, near diaphragm","After portal and arterial blood mix in liver sinusoids, blood enters central veins and then the hepatic veins.","They drain processed blood from the liver into the inferior vena cava.","hepatic-portal-vein inferior-vena-cava"],
    ["hepatic-portal-vein","Hepatic portal vein","Vena portae hepatis","Upper abdomen, toward liver hilum","The superior mesenteric and splenic veins usually join behind the neck of the pancreas to form the hepatic portal vein.","It carries nutrient-rich venous blood from digestive organs to a second capillary bed in the liver before systemic return.","superior-mesenteric-vein splenic-vein hepatic-veins"],
    ["splenic-vein","Splenic vein","Vena splenica","Left upper abdomen","The splenic vein runs from the spleen behind the pancreas and meets the superior mesenteric vein. It often receives the inferior mesenteric vein.","It delivers blood from the spleen and tributaries to the portal system.","hepatic-portal-vein inferior-mesenteric-vein splenic-artery"],
    ["superior-mesenteric-vein","Superior mesenteric vein","Vena mesenterica superior","Mesentery and upper abdomen","This vessel collects intestinal tributaries and unites with the splenic vein to form the hepatic portal vein.","It drains the small intestine and much of the proximal large intestine.","hepatic-portal-vein superior-mesenteric-artery"],
    ["inferior-mesenteric-vein","Inferior mesenteric vein","Vena mesenterica inferior","Left posterior abdomen","This vein collects blood from the distal large bowel and commonly joins the splenic vein. Other drainage arrangements occur.","It returns blood from hindgut regions into the hepatic portal system.","splenic-vein hepatic-portal-vein inferior-mesenteric-artery"],
    ["renal-vein","Renal vein","Vena renalis","Renal hilum and retroperitoneum","The renal veins drain directly into the inferior vena cava. The longer left renal vein crosses anterior to the aorta.","They return blood from the kidneys after filtration and reabsorption.","renal-artery inferior-vena-cava gonadal-vein"],
    ["gonadal-vein","Gonadal vein","Vena testicularis vel ovarica","Retroperitoneum","The right gonadal vein usually enters the inferior vena cava. The left typically enters the left renal vein.","These veins return blood from the testes or ovaries.","renal-vein inferior-vena-cava gonadal-artery"],
    ["common-iliac-vein","Common iliac vein","Vena iliaca communis","Pelvic brim","The internal and external iliac veins unite on each side. The right and left common iliac veins then join to form the inferior vena cava.","They collect venous blood returning from the pelvis and lower limbs.","internal-iliac-vein external-iliac-vein inferior-vena-cava"],
    ["internal-iliac-vein","Internal iliac vein","Vena iliaca interna","Pelvis","Tributaries from pelvic venous plexuses and the gluteal region converge into an internal iliac vein on each side.","It drains pelvic organs, the perineum and much of the gluteal region.","common-iliac-vein internal-iliac-artery"],
    ["external-iliac-vein","External iliac vein","Vena iliaca externa","Pelvic brim","The femoral vein becomes the external iliac vein deep to the inguinal ligament and joins the internal iliac vein.","It returns blood from the lower limb to the common iliac vein.","femoral-vein common-iliac-vein"],
    ["femoral-vein","Femoral vein","Vena femoralis","Deep anterior and medial thigh","The femoral vein continues the popliteal vein above the adductor hiatus. It receives the great saphenous vein in the proximal thigh.","It is the major deep venous outflow from the thigh and lower leg.","popliteal-vein great-saphenous-vein external-iliac-vein"],
    ["popliteal-vein","Popliteal vein","Vena poplitea","Posterior knee","Deep leg veins converge in the popliteal region. The small saphenous vein commonly terminates here.","It carries blood from the lower leg to the femoral vein.","deep-leg-veins small-saphenous-vein femoral-vein"],
    ["deep-leg-veins","Deep veins of the leg","Venae tibiales et fibulares","Deep leg","Anterior tibial, posterior tibial and fibular veins accompany the corresponding arteries. Representative courses are shown.","They drain the deep tissues of the foot and leg into the popliteal system.","popliteal-vein anterior-tibial-artery posterior-tibial-artery fibular-artery"],
    ["great-saphenous-vein","Great saphenous vein","Vena saphena magna","Superficial medial lower limb","This vein begins on the medial side of the dorsal foot, passes anterior to the medial malleolus and ascends to the femoral vein in the groin.","It is the long superficial drainage route along the medial leg and thigh.","foot-venous-arch femoral-vein small-saphenous-vein"],
    ["small-saphenous-vein","Small saphenous vein","Vena saphena parva","Superficial posterior calf","This vessel runs behind the lateral malleolus, ascends the posterior calf and usually enters the popliteal vein.","It drains superficial tissues of the lateral foot and posterior lower leg.","foot-venous-arch popliteal-vein great-saphenous-vein"],
    ["foot-venous-arch","Dorsal venous arch of foot","Arcus venosus dorsalis pedis","Dorsum of foot","Digital veins feed this superficial arch over the metatarsals. Its medial and lateral ends continue into superficial veins of the leg.","It links the venous return of the toes to the saphenous pathways.","great-saphenous-vein small-saphenous-vein"]
  ]);
  window.vesselStructures = catalog;
  const byId = new Map(catalog.map(s => [s.id,s]));
  window.buildVessels = function(g) {
    const ink = {arteries:"#f25666",veins:"#527fd1",tissue:"#708598"};
    const pinned = new Set();
    const mirror = (points,side) => points.map(([x,y,z]) => [x*side,y,z]);
    function vessel(id, points, radius, side=1, color) {
      const layer=byId.get(id).layer, coords=side === 1 ? points : mirror(points,side);
      g.tube(id,layer,color || ink[layer],coords,radius,{sides:typeof radius === "number" && radius<.008 ? 6 : 9});
      if (!pinned.has(id)) {
        g.pin(id,coords[Math.floor(coords.length/2)]);
        pinned.add(id);
      }
    }
    // Closed horizontal sections trace the silhouette while leaving vessels visible.
    function outline(rows,side=1) {
      const vertices=[], faces=[], edges=18;
      for (const [y,x,w,z,d] of rows) {
        for(let i=0;i<edges;i++){
          const a=i*2*Math.PI/edges;
          vertices.push([side*(x+w*Math.cos(a)),y,z+d*Math.sin(a)]);
        }
      }
      for(let k=0;k<rows.length-1;k++) for(let i=0;i<edges;i++){
        const a=k*edges+i,b=k*edges+(i+1)%edges,c=a+edges,d=b+edges;
        const face1=[a,c,b],face2=[b,c,d];
        faces.push(side===1?face1:face1.reverse(),side===1?face2:face2.reverse());
      }
      g.mesh("systemic-vessels","tissue",ink.tissue,vertices,faces,{opacity:.155});
    }
    // A single continuous axial contour follows the cranium, neck, rib cage and pelvis.
    outline([
      [-.26,0,.065,-.015,.055],[-.23,0,.19,-.022,.095],[-.15,0,.253,-.015,.125],
      [-.03,0,.252,-.018,.153],[.10,0,.214,-.02,.14],[.24,0,.212,-.01,.145],
      [.39,0,.248,-.005,.163],[.58,0,.291,-.005,.172],[.72,0,.317,-.007,.163],
      [.83,0,.337,-.018,.15],[.91,0,.318,-.015,.129],[.96,0,.205,-.01,.104],
      [1.008,0,.109,-.019,.088],[1.095,0,.091,-.01,.095],
      [1.135,0,.067,.011,.088],[1.168,0,.106,.006,.115],[1.24,0,.14,-.002,.138],
      [1.326,0,.148,-.015,.149],[1.43,0,.149,-.03,.143],
      [1.502,0,.129,-.034,.126],[1.556,0,.081,-.032,.087],[1.574,0,.004,-.03,.005]
    ]);
    const handTips=[[-.047,.14],[-.021,.162],[.005,.174],[.031,.162],[.079,.096]];
    for (const side of [1,-1]) {
      outline([[-.065,.70,.045,.01,.035],[-.005,.677,.044,.014,.037],[.13,.637,.062,.017,.058],
        [.26,.582,.082,.007,.067],[.38,.539,.069,-.004,.063],[.48,.505,.075,-.018,.075],
        [.64,.452,.091,-.009,.085],[.78,.405,.102,-.005,.095],[.86,.377,.106,-.022,.106],
        [.922,.341,.081,-.018,.086],[.95,.318,.026,-.018,.036]],side);
      outline([[-.145,.723,.041,.007,.022],[-.126,.72,.063,.008,.032],[-.078,.703,.066,.014,.035],
        [-.034,.689,.05,.015,.034],[.002,.673,.04,.012,.032]],side);
      for(let i=0;i<5;i++){
        const [dx,dy]=handTips[i], x=.718+dx;
        outline([[-.11-dy*.68,x+dx*.28,.007,.019,.009],[-.106-dy*.51,x+dx*.21,.012,.012,.013],
          [-.092-dy*.15,x,.014,.011,.015]],side);
      }
      outline([[-1.48,.235,.048,.005,.054],[-1.40,.229,.052,-.026,.056],[-1.27,.227,.062,-.049,.064],
        [-1.10,.211,.089,-.05,.092],[-.987,.202,.098,-.049,.1],[-.90,.192,.083,-.037,.09],
        [-.825,.183,.081,-.019,.082],[-.755,.18,.083,-.012,.081],[-.63,.169,.089,-.023,.103],
        [-.46,.153,.11,-.024,.12],[-.27,.135,.128,-.027,.126],[-.155,.125,.117,-.023,.123],
        [-.091,.128,.094,-.022,.098]],side);
      outline([[-1.563,.241,.08,.072,.14],[-1.546,.241,.088,.062,.148],[-1.508,.238,.086,.06,.133],
        [-1.468,.235,.06,.009,.084],[-1.433,.232,.047,-.012,.056]],side);
    }
    g.pin("systemic-vessels",[0,.56,.12]);
    // Typical anterior-view arch branches; the descending aorta lies left and posterior.
    vessel("aorta",[[.016,.585,.078],[-.021,.684,.099],[-.034,.808,.073],[-.004,.866,.038],[.051,.883,-.008],[.088,.848,-.07],[.087,.77,-.103]],[.038,.038,.037,.037,.035,.033,.032]);
    vessel("thoracic-aorta",[[.087,.77,-.103],[.081,.67,-.115],[.071,.554,-.115],[.054,.438,-.106],[.035,.344,-.097]],[.032,.032,.029,.028,.028]);
    vessel("abdominal-aorta",[[.035,.344,-.097],[.029,.261,-.094],[.022,.181,-.092],[.017,.098,-.085],[.012,.008,-.077]],[.028,.028,.026,.023,.022]);
    vessel("brachiocephalic-trunk",[[-.022,.854,.048],[-.061,.9,.039],[-.083,.946,.03]],[.023,.021,.019]);
    vessel("inferior-vena-cava",[[-.029,-.025,-.039],[-.036,.084,-.041],[-.043,.171,-.045],[-.049,.29,-.062],[-.065,.409,-.056],[-.087,.489,-.048],[-.079,.585,.013]],[.028,.03,.03,.031,.033,.033,.033]);
    vessel("superior-vena-cava",[[-.10,.877,.09],[-.103,.82,.099],[-.09,.73,.091],[-.08,.641,.066]],[.03,.032,.032,.034]);
    // The dark myocardial landmark locates the origins of the systemic inflow/outflow.
    outline([[.478,.066,.012,.075,.015],[.51,.055,.046,.061,.044],[.562,.029,.085,.045,.068],
      [.622,.008,.114,.043,.075],[.679,-.007,.102,.029,.063],[.713,-.017,.068,.026,.049],
      [.725,-.024,.025,.018,.025]]);
    vessel("azygos-vein",[[-.055,.29,-.149],[-.062,.426,-.157],[-.061,.595,-.151],[-.067,.741,-.138],[-.104,.79,-.073],[-.115,.789,.025],[-.099,.799,.094]],[.009,.011,.012,.014,.014,.015,.014]);
    vessel("hemiazygos-vein",[[.087,.297,-.15],[.089,.39,-.153],[.085,.483,-.157],[.07,.52,-.162],[.001,.534,-.169],[-.060,.548,-.158]],[.009,.01,.012,.011,.01,.011]);
    vessel("basilar-artery",[[0,1.295,-.091],[0,1.325,-.09],[0,1.352,-.087],[0,1.376,-.079]],[.009,.009,.008,.008]);
    vessel("anterior-communicating-artery",[[-.015,1.379,.036],[0,1.382,.036],[.015,1.379,.036]],.005);
    vessel("dural-venous-sinuses",[[0,1.349,.11],[0,1.438,.101],[0,1.519,.031],[0,1.535,-.053],[0,1.49,-.142],[0,1.408,-.166],[0,1.351,-.153]],[.008,.009,.01,.011,.012,.013,.014]);
    for (const side of [1,-1]) {
      const v=(id,points,radius,color)=>vessel(id,points,radius,side,color);
      const root= side===1 ? [.036,.880,.004] : [.083,.946,.030];
      const sub= side===1 ? [.077,.871,-.043] : [.083,.946,.030];
      v("common-carotid-artery",[root,[.066,.963,.032],[.068,1.014,.044],[.062,1.093,.044],[.068,1.164,.057]],[.018,.017,.016,.016,.015]);
      v("internal-carotid-artery",[[.068,1.164,.057],[.064,1.212,.027],[.061,1.259,-.019],[.052,1.3,-.039],[.048,1.324,-.005],[.047,1.348,.023]],[.012,.012,.012,.011,.01,.01]);
      v("external-carotid-artery",[[.068,1.164,.057],[.076,1.192,.066],[.093,1.221,.063],[.109,1.258,.038],[.120,1.279,.013]],[.012,.012,.011,.01,.01]);
      v("facial-artery",[[.086,1.209,.064],[.098,1.209,.094],[.095,1.226,.115],[.076,1.248,.126],[.064,1.275,.136],[.045,1.29,.135],[.031,1.32,.133]],[.007,.007,.006,.006,.005,.004,.003]);
      v("maxillary-artery",[[.12,1.279,.013],[.1,1.283,.036],[.093,1.29,.057],[.082,1.295,.075],[.069,1.307,.081]],[.006,.006,.006,.005,.004]);
      v("occipital-artery",[[.087,1.216,.06],[.108,1.227,.012],[.114,1.253,-.049],[.104,1.27,-.095],[.096,1.309,-.128],[.087,1.381,-.148]],[.007,.007,.006,.006,.005,.003]);
      v("superficial-temporal-artery",[[.119,1.279,.013],[.136,1.306,.024],[.144,1.357,.02],[.134,1.410,.039],[.11,1.457,.067],[.091,1.48,.063]],[.008,.007,.006,.005,.004,.003]);
      v("superficial-temporal-artery",[[.144,1.357,.02],[.143,1.396,-.017],[.135,1.438,-.047],[.113,1.477,-.07]],[.005,.005,.004,.0025]);
      v("external-jugular-vein",[[.133,1.308,-.01],[.12,1.241,.012],[.1,1.190,.053],[.10,1.132,.078],[.119,1.078,.074],[.135,1.006,.067],[.143,.955,.068]],[.006,.009,.009,.009,.011,.011,.013]);
      v("internal-jugular-vein",[[.079,1.268,-.049],[.08,1.206,-.022],[.086,1.134,.012],[.085,1.056,.018],[.088,.992,.027],[.103,.95,.068]],[.015,.016,.017,.017,.018,.018]);
      v("facial-vein",[[.029,1.323,.129],[.059,1.292,.139],[.077,1.263,.12],[.09,1.238,.099],[.083,1.192,.064],[.085,1.135,.013]],[.004,.005,.006,.006,.007,.009]);
      v("dural-venous-sinuses",[[0,1.351,-.153],[.051,1.347,-.147],[.09,1.335,-.127],[.11,1.328,-.096],[.093,1.309,-.086],[.096,1.289,-.070],[.079,1.268,-.049]],[.013,.014,.014,.012,.012,.012,.014]);
      v("vertebral-artery",[[.13,.938,.008],[.08,.983,-.035],[.054,1.057,-.053],[.055,1.137,-.07],[.067,1.224,-.079],[.074,1.247,-.105],[.047,1.262,-.119],[0,1.295,-.091]],[.01,.01,.009,.009,.008,.008,.008,.009]);
      v("middle-cerebral-artery",[[.047,1.348,.023],[.065,1.359,.02],[.094,1.367,.023],[.122,1.381,.024],[.134,1.407,.008],[.127,1.443,-.007]],[.008,.008,.007,.006,.004,.003]);
      for(let k=0;k<3;k++) v("middle-cerebral-artery",[[.11,1.375,.023],[.126,1.384,.033-k*.032],[.129-k*.003,1.406+k*.004,.061-k*.049],[.116-k*.004,1.433+k*.016,.066-k*.05]],[.005,.004,.003,.0025]);
      v("anterior-cerebral-artery",[[.047,1.348,.023],[.035,1.36,.032],[.015,1.379,.036],[.012,1.392,.055],[.014,1.425,.064],[.016,1.451,.022],[.017,1.466,-.044]],[.007,.006,.006,.006,.005,.004,.003]);
      v("posterior-cerebral-artery",[[0,1.376,-.079],[.035,1.377,-.081],[.056,1.365,-.091],[.066,1.355,-.119],[.061,1.377,-.143],[.078,1.403,-.144]],[.007,.007,.006,.006,.004,.003]);
      v("posterior-communicating-artery",[[.047,1.348,.023],[.046,1.346,-.01],[.047,1.351,-.054],[.052,1.368,-.087]],.004);
      v("subclavian-artery",[sub,[.110,.932,.009],[.147,.945,.001],[.200,.938,.002],[.252,.904,.013]],[.018,.018,.018,.016,.016]);
      v("subclavian-vein",[[.267,.887,.071],[.219,.913,.078],[.167,.936,.077],[.103,.95,.068]],[.019,.019,.018,.019]);
      if(side===1) v("brachiocephalic-vein",[[.103,.95,.068],[.062,.929,.084],[-.001,.909,.089],[-.061,.892,.094],[-.10,.877,.09]],[.021,.022,.022,.022,.023]);
      else v("brachiocephalic-vein",[[.103,.95,.068],[.106,.92,.082],[.1,.877,.09]],[.022,.022,.023]);
      v("internal-thoracic-artery",[[.153,.943,.002],[.102,.886,.068],[.066,.807,.119],[.059,.69,.142],[.06,.573,.144],[.062,.465,.132],[.076,.365,.113]],[.008,.008,.008,.007,.007,.006,.005]);
      for(let k=0;k<5;k++) {
        const y=.721-k*.067, w=.265-k*.008,startX=side===1?.084:-.08;
        v("intercostal-arteries",[[startX,y,-.111],[.127,y+.014,-.142],[w*.8,y+.028,-.125],[w,y+.028,-.045],[w*1.015,y-.002,.033],[w*.83,y-.037,.093],[w*.53,y-.044,.116]],[.006,.007,.006,.0055,.005,.0045,.003]);
        // Lower left spaces drain to the hemiazygos. Higher left spaces follow
        // other drainage routes outside this selection.
        if(side===-1 || y<=.525) {
          const joinX=side===1 ? .085 : .061;
          v("intercostal-veins",[[w*.88,y+.001,.09],[w*.999,y+.014,.02],[w,y+.037,-.055],[w*.8,y+.038,-.124],[.12,y+.021,-.141],[joinX,y,-.155]],[.004,.005,.006,.006,.006,.007]);
        }
        v("internal-thoracic-artery",[[.061,y,.139],[.094,y+.001,.133],[.12,y-.011,.125],[.151,y-.016,.113]],[.004,.004,.0035,.0025]);
      }
      v("axillary-artery",[[.252,.904,.013],[.290,.859,.024],[.314,.795,.03],[.348,.743,.033],[.383,.694,.043]],[.017,.016,.015,.015,.014]);
      v("axillary-artery",[[.316,.792,.03],[.347,.799,-.018],[.387,.811,-.039],[.433,.835,-.018],[.456,.838,.01]],[.008,.008,.007,.006,.004]);
      v("brachial-artery",[[.383,.694,.043],[.411,.625,.041],[.443,.552,.049],[.473,.475,.049],[.507,.394,.052],[.534,.349,.06]],[.014,.014,.013,.013,.012,.012]);
      v("deep-brachial-artery",[[.398,.653,.042],[.413,.624,-.010],[.451,.587,-.070],[.492,.548,-.080],[.509,.508,-.061],[.542,.423,-.026]],[.008,.008,.008,.007,.006,.004]);
      v("radial-artery",[[.534,.349,.06],[.570,.292,.061],[.604,.223,.062],[.638,.148,.063],[.670,.078,.049],[.695,.001,.037],[.714,-.037,.007],[.736,-.062,-.017]],[.01,.01,.009,.009,.008,.007,.006,.006]);
      v("ulnar-artery",[[.534,.349,.06],[.544,.307,.034],[.554,.24,.021],[.585,.165,.028],[.616,.096,.026],[.651,.013,.032],[.659,-.041,.034],[.675,-.084,.035]],[.01,.009,.009,.008,.007,.007,.006,.006]);
      v("palmar-arches",[[.675,-.084,.035],[.683,-.111,.033],[.711,-.127,.035],[.743,-.117,.035],[.76,-.092,.027]],[.006,.006,.005,.005,.004]);
      v("palmar-arches",[[.736,-.062,-.017],[.739,-.08,.012],[.728,-.087,.021],[.706,-.095,.024],[.676,-.084,.034]],[.006,.006,.006,.005,.004]);
      for(let i=0;i<5;i++){
        const [dx,dy]=handTips[i], x=.718+dx,tipX=x+dx*.28,tipY=-.11-dy*.68;
        v("digital-arteries",[[.717+dx*.65,-.106,.034],[x-.007,-.127,.028],[x+dx*.12-.007,(tipY-.125)/2,.026],[tipX-.004,tipY+.003,.023]],[.004,.0038,.0031,.0025]);
        v("hand-venous-network",[[tipX+.004,tipY+.003,.005],[x+dx*.13+.004,(tipY-.125)/2,-.002],[x+.004,-.125,-.01],[.716+dx*.69,-.098,-.018]],[.0025,.003,.0032,.004]);
      }
      v("hand-venous-network",[[.67,-.063,-.009],[.678,-.096,-.01],[.704,-.104,-.02],[.736,-.095,-.021],[.754,-.077,-.011]],[.005,.005,.005,.006,.005]);
      v("cephalic-vein",[[.754,-.077,-.011],[.723,-.028,.004],[.71,.033,.048],[.68,.108,.058],[.652,.183,.061],[.622,.259,.061],[.586,.336,.056],[.571,.409,.069],[.545,.494,.071],[.513,.573,.074],[.485,.647,.08],[.451,.715,.084],[.422,.792,.086],[.390,.847,.083],[.357,.886,.085],[.319,.878,.073],[.292,.84,.058]],[.005,.007,.007,.007,.008,.008,.008,.008,.008,.008,.009,.009,.009,.009,.009,.01,.01]);
      v("basilic-vein",[[.67,-.063,-.009],[.643,-.018,.017],[.628,.056,.034],[.603,.126,.053],[.576,.201,.057],[.548,.275,.064],[.52,.346,.07],[.498,.417,.073],[.464,.479,.059],[.431,.544,.043],[.416,.611,.019],[.37,.691,.014],[.348,.736,.018]],[.005,.006,.006,.007,.007,.007,.008,.008,.008,.009,.009,.009,.01]);
      v("median-cubital-vein",[[.59,.329,.057],[.569,.337,.078],[.549,.353,.083],[.531,.372,.078],[.513,.387,.07]],[.006,.007,.008,.008,.007]);
      v("axillary-vein",[[.36,.696,.013],[.335,.738,.017],[.312,.784,.026],[.292,.84,.058],[.267,.887,.071]],[.014,.015,.016,.017,.018]);
      v("brachial-veins",[[.516,.349,.047],[.486,.416,.039],[.456,.498,.034],[.424,.573,.03],[.393,.642,.022],[.36,.696,.013]],[.009,.01,.011,.011,.012,.014]);
      v("deep-forearm-veins",[[.687,-.006,.021],[.661,.079,.031],[.622,.161,.042],[.59,.246,.041],[.552,.308,.041],[.516,.349,.047]],[.005,.006,.006,.007,.008,.009]);
      v("deep-forearm-veins",[[.646,-.002,.017],[.605,.079,.01],[.575,.162,.014],[.552,.224,.014],[.531,.288,.021],[.516,.349,.047]],[.005,.005,.006,.007,.007,.008]);
      // Renal vessels and their short segmental branches at each kidney.
      const renalOrigin=side===1?[.027,.256,-.094]:[-.027,.249,-.094];
      v("renal-artery",[renalOrigin,[.071,.255,-.101],[.111,.257,-.10],[.148,.245,-.087]],[.013,.013,.012,.010]);
      const renalEnd=side===1?[-.045,.244,-.052]:[.045,.244,-.052];
      v("renal-vein",[[.151,.245,-.061],[.113,.239,-.053],[.073,.235,-.048],renalEnd],[.012,.013,.014,.015]);
      for(let j=0;j<3;j++){
        v("renal-artery",[[.146,.245,-.087],[.160,.246+(j-1)*.019,-.089],[.181,.25+(j-1)*.039,-.100],[.186,.25+(j-1)*.058,-.099]],[.008,.007,.005,.003]);
        v("renal-vein",[[.19,.25+(j-1)*.053,-.088],[.179,.248+(j-1)*.034,-.077],[.163,.245+(j-1)*.011,-.065],[.15,.245,-.061]],[.003,.005,.007,.009]);
      }
      const gOrigin=side===1?[.026,.203,-.091]:[-.026,.200,-.091];
      v("gonadal-artery",[gOrigin,[.061,.165,-.067],[.085,.115,-.066],[.101,.071,-.059],[.104,.019,-.046],[.114,-.022,-.028]],[.005,.005,.005,.004,.004,.003]);
      const gonRet=side===1?[.111,.239,-.053]:[.042,.167,-.045];
      v("gonadal-vein",[[.128,-.024,-.017],[.119,.033,-.037],[.11,.092,-.042],[.098,.143,-.045],[.088,.177,-.046],gonRet],[.004,.004,.004,.005,.005,.006]);
      const bif=side===1?[.012,.008,-.077]:[-.012,.008,-.077];
      v("common-iliac-artery",[bif,[.045,-.026,-.067],[.075,-.056,-.066],[.103,-.092,-.062]],[.018,.018,.017,.016]);
      v("internal-iliac-artery",[[.103,-.092,-.062],[.093,-.113,-.078],[.073,-.147,-.084],[.068,-.188,-.082],[.062,-.213,-.066]],[.013,.012,.011,.009,.007]);
      v("internal-iliac-artery",[[.09,-.119,-.078],[.119,-.139,-.099],[.142,-.148,-.121],[.175,-.16,-.13],[.194,-.19,-.129]],[.008,.008,.007,.005,.003]);
      v("external-iliac-artery",[[.103,-.092,-.062],[.108,-.119,-.028],[.119,-.146,.013],[.123,-.169,.045]],[.015,.015,.015,.015]);
      v("femoral-artery",[[.123,-.169,.045],[.121,-.225,.074],[.117,-.304,.084],[.120,-.395,.071],[.126,-.49,.053],[.14,-.581,.025],[.155,-.666,-.012],[.161,-.714,-.038]],[.015,.015,.014,.014,.013,.013,.012,.012]);
      v("deep-femoral-artery",[[.121,-.222,.073],[.135,-.261,.034],[.147,-.329,.002],[.158,-.411,-.029],[.175,-.529,-.06],[.18,-.61,-.06]],[.011,.011,.01,.009,.007,.004]);
      for(let k=0;k<3;k++) v("deep-femoral-artery",[[.15+k*.01,-.345-k*.07,-.008-k*.017],[.181+k*.006,-.375-k*.075,-.06],[.200+k*.005,-.405-k*.07,-.094],[.208,-.441-k*.071,-.098]],[.006,.006,.004,.003]);
      v("popliteal-artery",[[.161,-.714,-.038],[.173,-.751,-.055],[.181,-.802,-.07],[.184,-.851,-.06],[.187,-.893,-.057]],[.012,.012,.012,.011,.011]);
      v("anterior-tibial-artery",[[.187,-.893,-.057],[.208,-.916,-.016],[.224,-.950,.023],[.231,-1.053,.032],[.241,-1.167,.02],[.245,-1.282,.018],[.247,-1.395,.029],[.248,-1.452,.055]],[.009,.009,.008,.008,.007,.007,.006,.006]);
      v("posterior-tibial-artery",[[.187,-.893,-.057],[.181,-.94,-.067],[.181,-1.025,-.080],[.183,-1.14,-.081],[.186,-1.27,-.063],[.193,-1.382,-.051],[.197,-1.447,-.042],[.207,-1.49,.012]],[.01,.01,.009,.008,.007,.007,.006,.006]);
      v("fibular-artery",[[.18,-.959,-.072],[.21,-.988,-.071],[.237,-1.038,-.079],[.254,-1.168,-.074],[.251,-1.291,-.068],[.257,-1.40,-.053]],[.008,.008,.007,.006,.005,.004]);
      v("dorsalis-pedis-artery",[[.248,-1.452,.055],[.247,-1.473,.076],[.246,-1.488,.102],[.237,-1.5,.129],[.224,-1.511,.157]],[.006,.006,.006,.005,.004]);
      v("plantar-arteries",[[.207,-1.49,.012],[.224,-1.525,.038],[.257,-1.546,.061],[.283,-1.551,.114],[.276,-1.549,.145],[.247,-1.548,.16],[.222,-1.545,.167]],[.005,.006,.006,.005,.005,.004,.0035]);
      v("plantar-arteries",[[.207,-1.49,.012],[.20,-1.527,.06],[.196,-1.537,.124],[.195,-1.538,.177]],[.005,.005,.004,.003]);
      for(let j=0;j<5;j++){
        const toe=.193+j*.022, far=.202-Math.pow(j,1.6)*.004;
        v("dorsalis-pedis-artery",[[.242,-1.49,.096],[.238+(j-2)*.010,-1.499,.129],[toe,-1.508,.15],[toe+.004,-1.525,far]],[.004,.004,.003,.0025]);
        v("foot-venous-arch",[[toe+.006,-1.523,far],[toe+.008,-1.508,.163],[toe+.004,-1.499,.14]],[.0025,.003,.004]);
      }
      v("foot-venous-arch",[[.186,-1.502,.128],[.20,-1.50,.139],[.231,-1.493,.145],[.257,-1.495,.144],[.277,-1.5,.135],[.299,-1.507,.122]],[.005,.006,.006,.006,.005,.005]);
      v("great-saphenous-vein",[[.186,-1.502,.128],[.181,-1.479,.074],[.18,-1.443,.025],[.179,-1.365,.006],[.168,-1.256,-.007],[.152,-1.151,-.023],[.13,-1.052,-.026],[.128,-.953,-.041],[.132,-.853,-.053],[.117,-.754,-.05],[.098,-.643,-.008],[.081,-.514,.011],[.068,-.397,.042],[.063,-.302,.065],[.07,-.236,.077],[.091,-.198,.058],[.107,-.189,.042]],[.006,.007,.007,.007,.007,.008,.008,.008,.008,.008,.009,.009,.009,.01,.011,.011,.011]);
      v("small-saphenous-vein",[[.299,-1.507,.122],[.301,-1.493,.047],[.28,-1.46,-.036],[.273,-1.402,-.079],[.259,-1.319,-.112],[.244,-1.235,-.132],[.222,-1.146,-.146],[.208,-1.054,-.148],[.198,-.970,-.13],[.191,-.889,-.105],[.183,-.846,-.087]],[.005,.006,.006,.006,.006,.006,.007,.007,.007,.008,.008]);
      v("deep-leg-veins",[[.206,-1.483,-.001],[.201,-1.399,-.07],[.2,-1.266,-.076],[.20,-1.145,-.097],[.194,-1.027,-.097],[.19,-.907,-.083]],[.005,.006,.007,.008,.008,.009]);
      v("deep-leg-veins",[[.258,-1.446,.045],[.26,-1.35,.012],[.258,-1.206,-.002],[.242,-1.07,.014],[.232,-.96,.009],[.218,-.928,-.031],[.19,-.907,-.083]],[.005,.005,.006,.006,.007,.007,.008]);
      v("deep-leg-veins",[[.265,-1.398,-.067],[.264,-1.297,-.08],[.262,-1.184,-.091],[.248,-1.058,-.10],[.212,-.969,-.091],[.19,-.907,-.083]],[.004,.005,.006,.006,.006,.008]);
      v("popliteal-vein",[[.19,-.907,-.083],[.184,-.846,-.087],[.177,-.789,-.091],[.169,-.743,-.074],[.152,-.704,-.046]],[.012,.013,.013,.014,.013]);
      v("femoral-vein",[[.152,-.704,-.046],[.145,-.654,-.023],[.129,-.575,.007],[.112,-.480,.038],[.10,-.388,.063],[.095,-.296,.07],[.102,-.23,.065],[.107,-.189,.042],[.106,-.17,.033]],[.013,.013,.014,.014,.014,.015,.015,.016,.016]);
      v("external-iliac-vein",[[.106,-.17,.033],[.099,-.146,.002],[.092,-.121,-.03],[.084,-.092,-.059]],[.017,.017,.017,.016]);
      v("internal-iliac-vein",[[.160,-.195,-.128],[.128,-.173,-.106],[.102,-.159,-.102],[.083,-.14,-.092],[.075,-.115,-.084],[.084,-.092,-.059]],[.007,.009,.01,.01,.012,.013]);
      v("internal-iliac-vein",[[.05,-.214,-.039],[.065,-.193,-.066],[.062,-.163,-.078],[.08,-.124,-.087]],[.006,.008,.009,.01]);
      const cavalJoin=side===1?[-.029,-.025,-.039]:[.029,-.025,-.039];
      v("common-iliac-vein",[[.084,-.092,-.059],[.066,-.076,-.064],[.04,-.059,-.067],cavalJoin],[.017,.018,.019,.021]);
    }
    vessel("celiac-trunk",[[.035,.338,-.096],[.024,.337,-.058],[.011,.337,-.021],[.005,.334,.008]],[.015,.015,.014,.012]);
    vessel("left-gastric-artery",[[.005,.334,.008],[.014,.354,.027],[.029,.376,.041],[.045,.389,.047],[.067,.375,.056],[.079,.353,.073]],[.008,.008,.007,.006,.005,.004]);
    vessel("splenic-artery",[[.005,.334,.008],[.048,.343,.012],[.071,.331,.008],[.102,.346,.001],[.125,.335,-.01],[.153,.353,-.02],[.180,.349,-.03],[.2,.365,-.046]],[.01,.01,.009,.009,.008,.008,.007,.006]);
    vessel("common-hepatic-artery",[[.005,.334,.008],[-.025,.332,.019],[-.063,.341,.022],[-.077,.35,.022]],[.011,.011,.01,.01]);
    vessel("common-hepatic-artery",[[-.077,.35,.022],[-.087,.368,.026],[-.091,.384,.028],[-.108,.405,.032],[-.139,.421,.035],[-.156,.43,.026]],[.009,.009,.008,.007,.005,.003]);
    vessel("common-hepatic-artery",[[-.092,.383,.028],[-.063,.399,.049],[-.033,.419,.067],[-.007,.43,.075]],[.007,.006,.005,.003]);
    vessel("superior-mesenteric-artery",[[.03,.309,-.091],[.021,.292,-.04],[.017,.266,.002],[.011,.218,.023],[-.008,.168,.028],[-.035,.106,.021],[-.076,.056,.016]],[.013,.013,.012,.011,.01,.008,.005]);
    vessel("inferior-mesenteric-artery",[[.018,.111,-.083],[.036,.103,-.057],[.057,.096,-.027],[.077,.081,-.012],[.091,.041,.002],[.076,.002,.005],[.057,-.03,-.004]],[.009,.008,.008,.007,.006,.005,.004]);
    for(let j=0;j<5;j++){
      const y=.227-j*.025, x=.014-j*.009;
      vessel("superior-mesenteric-artery",[[x,y,.025],[x+.031,y-.003,.052],[x+.068,y+.016,.06],[x+.095,y+.012,.057],[x+.122,y+.009,.057]],[.006,.006,.005,.004,.003]);
      vessel("superior-mesenteric-artery",[[x+.033,y-.005,.05],[x+.048,y-.017,.063],[x+.077,y-.013,.062],[x+.088,y-.009,.059]],[.004,.004,.003,.0025]);
    }
    for(let j=0;j<3;j++){
      const y=.082-j*.029;
      vessel("inferior-mesenteric-artery",[[.079,y,-.006],[.102,y+.01,.018],[.136,y+.018,.027],[.153,y+.037,.027]],[.005,.005,.004,.003]);
    }
    vessel("splenic-vein",[[.200,.353,-.058],[.166,.333,-.047],[.127,.326,-.029],[.079,.319,-.021],[.043,.315,-.018],[-.006,.313,-.014]],[.009,.01,.011,.012,.013,.014]);
    vessel("superior-mesenteric-vein",[[-.087,.055,.009],[-.053,.102,.013],[-.027,.158,.017],[-.007,.215,.013],[.004,.263,-.009],[-.006,.313,-.014]],[.007,.009,.01,.011,.013,.014]);
    for(let j=0;j<4;j++){
      const y=.216-j*.031,x=-.005-j*.012;
      vessel("superior-mesenteric-vein",[[x+.132,y-.001,.049],[x+.101,y+.004,.052],[x+.074,y-.001,.05],[x+.045,y-.009,.048],[x,y,.017]],[.003,.004,.005,.005,.007]);
    }
    vessel("inferior-mesenteric-vein",[[.077,-.03,-.012],[.111,.021,.002],[.124,.094,.007],[.135,.153,.004],[.128,.216,-.012],[.117,.28,-.025],[.092,.322,-.021]],[.005,.006,.007,.007,.008,.008,.009]);
    vessel("hepatic-portal-vein",[[-.006,.313,-.014],[-.037,.339,-.010],[-.061,.354,-.004],[-.077,.377,.005],[-.085,.391,.012]],[.017,.017,.016,.015,.013]);
    vessel("hepatic-portal-vein",[[-.085,.391,.012],[-.116,.404,.008],[-.153,.399,.01],[-.183,.398,.008]],[.012,.011,.008,.005]);
    vessel("hepatic-portal-vein",[[-.085,.391,.012],[-.057,.405,.022],[-.030,.406,.042],[-.01,.416,.049]],[.01,.008,.006,.004]);
    for(const [x,y,z] of [[-.181,.425,-.039],[-.116,.429,.056],[-.016,.445,.059]]) {
      vessel("hepatic-veins",[[x,y,z],[x+(x<-.08?.027:-.014),y+.012,z*.82],[(x-.067)/2,.458,-.019],[-.067,.472,-.052]],[.004,.007,.012,.013]);
    }
    // One pin per catalog entry. Override a few midpoint positions to make crowded
    // structures easier to distinguish and to favor anterior-view landmarks.
    g.pin("aorta",[.044,.879,-.006]);
    g.pin("abdominal-aorta",[.019,.128,-.084]);
    g.pin("hepatic-portal-vein",[-.064,.359,-.003]);
    g.pin("superior-vena-cava",[-.101,.797,.099]);
    g.pin("inferior-vena-cava",[-.034,.102,-.042]);
    g.pin("renal-vein",[.087,.237,-.050]);
    g.pin("facial-vein",[.060,1.291,.135]);
  };
})();
