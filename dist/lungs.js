(() => {
  'use strict';

  const tau = 2 * Math.PI;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const mix = (a, b, t) => a + (b - a) * t;
  const plus = (a, b) => a.map((n, i) => n + b[i]);
  const lerp = (a, b, t) => a.map((n, i) => mix(n, b[i], t));
  function tint(rgb, scale, bias = 0) {
    return '#' + rgb.map(v => Math.round(clamp(v * scale + bias, 0, 255)).toString(16).padStart(2, '0')).join('');
  }
  const airway = '#d7ad91';
  const cartilage = '#ecd2b3';
  const blue = '#4c86b8';
  const red = '#cf5658';
  function entry(id, name, type, layer, latin, summary, location, role, related = []) {
    return { id, name, type, layer, latin, summary, location, role, related };
  }

  const lungData = [
    entry('lungs', 'Lungs', 'Organ', 'tissue', 'Pulmones', 'Each breath distributes air through a branching airway tree. Inside each lung, air and blood come close enough to exchange oxygen and carbon dioxide. The left lung is opened to reveal its branching structures.', 'In the thorax, on either side of the heart and above the diaphragm.', 'Match fresh air with blood arriving from the right ventricle.', ['trachea', 'right-main-bronchus', 'diaphragm']),
    entry('larynx', 'Larynx', 'Airway', 'airways', 'Larynx', 'Air from the nose or mouth passes through the pharynx and larynx before reaching the trachea. Cartilage supports the larynx and houses the vocal folds.', 'In the neck, between the pharynx and trachea.', 'Conducts air, produces voice, and helps protect the lower airway during swallowing.', ['trachea', 'tracheal-cartilage']),
    entry('trachea', 'Trachea', 'Airway', 'airways', 'Trachea', 'The windpipe carries air from the larynx to the carina. Mucus traps inhaled particles and cilia move them upward toward the throat.', 'In front of the esophagus, from the lower neck into the upper chest.', 'Provides a supported passage for air entering or leaving both lungs.', ['larynx', 'tracheal-cartilage', 'carina']),
    entry('tracheal-cartilage', 'Tracheal cartilage', 'Cartilage', 'airways', 'Cartilagines tracheales', 'C-shaped rings brace the trachea. Their open ends face the esophagus and are joined by the trachealis muscle.', 'In the anterior and lateral walls of the trachea.', 'Keeps the airway open while permitting changes in diameter and room for swallowing.', ['trachea', 'larynx']),
    entry('carina', 'Carina', 'Landmark', 'airways', 'Carina tracheae', 'This ridge lies inside the fork where the trachea divides. Its sensitive lining can trigger a cough when foreign material touches it.', 'At the lower end of the trachea, between the main bronchi.', 'Marks the boundary between the right and left bronchial entrances.', ['trachea', 'right-main-bronchus', 'left-main-bronchus']),
    entry('right-main-bronchus', 'Right main bronchus', 'Airway', 'airways', 'Bronchus principalis dexter', 'The right main bronchus follows a shorter, wider, more vertical course than the left. Its branches deliver air to three lobes.', 'From the carina through the right lung hilum.', 'Carries air between the trachea and the right bronchial tree.', ['carina', 'right-upper-lobar-bronchus', 'bronchus-intermedius']),
    entry('left-main-bronchus', 'Left main bronchus', 'Airway', 'airways', 'Bronchus principalis sinister', 'This longer bronchus takes a more oblique route to the left lung. It passes below the aortic arch and divides into two lobar bronchi.', 'From the carina to the hilum of the left lung.', 'Carries air to the left superior and inferior lobes.', ['carina', 'left-upper-lobar-bronchus', 'left-lower-lobar-bronchus']),
    entry('bronchus-intermedius', 'Bronchus intermedius', 'Airway', 'airways', 'Bronchus intermedius', 'After the right upper lobar bronchus branches away, the continuing passage is the bronchus intermedius.', 'Within the right lung, between the upper lobar origin and the middle and lower lobar origins.', 'Supplies the middle and inferior lobes through their lobar branches.', ['right-main-bronchus', 'right-middle-lobar-bronchus', 'right-lower-lobar-bronchus']),
    entry('lobar-bronchi', 'Lobar bronchi', 'Airway group', 'airways', 'Bronchi lobares', 'A lobar bronchus leads into each lobe. There are three on the right and two on the left.', 'Between the main and segmental bronchi.', 'Distribute air among the five lung lobes.', ['right-main-bronchus', 'left-main-bronchus', 'segmental-bronchi']),
    entry('segmental-bronchi', 'Segmental bronchi', 'Airway group', 'airways', 'Bronchi segmentales', 'Each segmental bronchus supplies a bronchopulmonary segment alongside a pulmonary artery branch. A common pattern with fused segments on the left is shown here.', 'Within each lobe, downstream of a lobar bronchus.', 'Ventilate individual bronchopulmonary segments.', ['lobar-bronchi', 'bronchioles']),
    entry('bronchioles', 'Bronchioles', 'Airway', 'airways', 'Bronchioli', 'Repeated branching produces small airways with smooth muscle and no cartilage. Distal terminal bronchioles lead to respiratory bronchioles, where alveoli first appear.', 'In the lung tissue beyond the smaller bronchi.', 'Regulate resistance and conduct air toward the gas-exchange surfaces.', ['segmental-bronchi', 'lungs']),
    entry('right-pulmonary-artery', 'Right pulmonary artery', 'Artery', 'arteries', 'Arteria pulmonalis dextra', 'Blood from the right ventricle reaches the pulmonary trunk and divides toward the two lungs. The right branch crosses behind the ascending aorta to reach the right lung.', 'Between the pulmonary trunk and right pulmonary hilum.', 'Delivers oxygen-poor blood to the right lung for gas exchange.', ['right-main-bronchus', 'right-superior-pulmonary-vein', 'right-inferior-pulmonary-vein']),
    entry('left-pulmonary-artery', 'Left pulmonary artery', 'Artery', 'arteries', 'Arteria pulmonalis sinistra', 'The left branch of the pulmonary trunk approaches the left hilum and courses above the left main bronchus before branching within the lung.', 'Between the pulmonary trunk and left pulmonary hilum.', 'Delivers oxygen-poor blood to the left lung for gas exchange.', ['left-main-bronchus', 'left-superior-pulmonary-vein', 'left-inferior-pulmonary-vein']),
    entry('diaphragm', 'Diaphragm', 'Muscle', 'tissue', 'Diaphragma', 'This domed muscle forms the floor of the thorax. When its fibers contract, the domes descend, increasing thoracic volume and drawing air inward.', 'Beneath the lung bases, between the chest and abdominal cavities.', 'Provides the main muscular force for quiet inspiration.', ['lungs', 'visceral-pleura']),
    entry('visceral-pleura', 'Visceral pleura', 'Membrane', 'tissue', 'Pleura visceralis', 'A thin serous layer follows the lung surface into the fissures. A film of fluid separates it from the parietal pleura on the chest wall.', 'On the lung surface and along the interlobar fissures.', 'Lets the lung slide against the chest wall as it expands and recoils.', ['lungs', 'right-oblique-fissure', 'left-oblique-fissure']),
    entry('cardiac-notch', 'Cardiac notch', 'Landmark', 'tissue', 'Incisura cardiaca pulmonis sinistri', 'The heart indents the anterior border of the left lung. The tongue-shaped lingula extends beneath this indentation.', 'Along the anteromedial edge of the left superior lobe.', 'Provides room for the heart within the left side of the chest.', ['left-upper-lobe', 'lingula']),
    entry('lingula', 'Lingula', 'Lobar region', 'tissue', 'Lingula pulmonis sinistri', 'The lingula projects below the cardiac notch and contains superior and inferior lingular segments. It belongs to the left superior lobe.', 'Along the lower anterior margin of the left superior lobe.', 'Contains ventilated lung tissue alongside the heart.', ['cardiac-notch', 'left-upper-lobe', 'left-upper-lobar-bronchus']),
    entry('right-oblique-fissure', 'Right oblique fissure', 'Fissure', 'tissue', 'Fissura obliqua pulmonis dextri', 'This cleft slopes downward and forward from the posterior surface toward the lung base.', 'Between the right inferior lobe and the superior and middle lobes.', 'Defines the upper boundary of the inferior lobe.', ['right-lower-lobe', 'right-middle-lobe']),
    entry('left-oblique-fissure', 'Left oblique fissure', 'Fissure', 'tissue', 'Fissura obliqua pulmonis sinistri', 'The left lung typically has one major fissure. It descends anteriorly, leaving much of the inferior lobe visible from behind.', 'Between the superior and inferior lobes of the left lung.', 'Separates the two left lung lobes.', ['left-upper-lobe', 'left-lower-lobe']),
    entry('right-horizontal-fissure', 'Right horizontal fissure', 'Fissure', 'tissue', 'Fissura horizontalis pulmonis dextri', 'This near-horizontal cleft crosses the anterior right lung before meeting the oblique fissure laterally.', 'Between the right superior and middle lobes.', 'Separates the middle lobe from the superior lobe.', ['right-upper-lobe', 'right-middle-lobe']),
  ];

  for (const side of ['right','left']) {
    const label = side[0].toUpperCase() + side.slice(1);
    const anatomy = side === 'right'
      ? 'The right bronchial artery often branches from an intercostobronchial trunk; its origin varies.'
      : 'Two left bronchial arteries commonly arise from the descending thoracic aorta.';
    lungData.push(entry(side + '-bronchial-arteries',label + ' bronchial arterial supply','Artery','arteries','Rami bronchiales',
      anatomy + ' These systemic vessels carry oxygenated blood to the airway walls and supporting tissues.',
      'Along the bronchi of the ' + side + ' lung.','Nourishes the conducting airways and surrounding tissues.',
      [side + '-bronchial-veins',side + '-main-bronchus']));
    lungData.push(entry(side + '-bronchial-veins',label + ' bronchial veins','Vein','veins','Venae bronchiales',
      'Superficial bronchial veins drain the large airway walls toward the azygos system. Much of the blood from deeper bronchial vessels joins the pulmonary venous return.',
      'Near the ' + side + ' lung hilum.','Returns part of the blood that supplied the airways to systemic veins.',
      [side + '-bronchial-arteries',side + '-superior-pulmonary-vein']));
  }

  const lobeInfo = [
    ['right-upper', 'Right superior', 'superior', 'dextri', 'Above the horizontal fissure anteriorly and the oblique fissure posteriorly.'],
    ['right-middle', 'Right middle', 'medius', 'dextri', 'Anteriorly on the right, between the horizontal and oblique fissures.'],
    ['right-lower', 'Right inferior', 'inferior', 'dextri', 'At the right base and over much of the posterior right lung.'],
    ['left-upper', 'Left superior', 'superior', 'sinistri', 'Above the left oblique fissure, including the anterior lingula.'],
    ['left-lower', 'Left inferior', 'inferior', 'sinistri', 'At the left base and over much of the back of the left lung.']
  ];
  for (const [id, label, latin, side, location] of lobeInfo) {
    const branch = id + '-lobar-bronchus';
    lungData.push(entry(id + '-lobe', label + ' lobe', 'Lobe', 'tissue', 'Lobus ' + latin + ' pulmonis ' + side,
      'A pleural fissure outlines this lobe. Within it, segmental airways and pulmonary artery branches divide the tissue into smaller functional territories.',
      location, 'Houses ventilated alveoli supplied by pulmonary capillaries.', [branch, 'lungs']));
    lungData.push(entry(branch, label + ' lobar bronchus', 'Airway', 'airways', 'Bronchus lobaris ' + latin + ' ' + (side === 'dextri' ? 'dexter' : 'sinister'),
      'This lobar airway divides into segmental bronchi within the ' + label.toLowerCase() + ' lobe.',
      'At the entrance to the ' + label.toLowerCase() + ' lobe.', 'Conducts air to and from the segments of its lobe.', [id + '-lobe', 'segmental-bronchi']));
  }
  for (const side of ['right', 'left']) {
    for (const level of ['superior', 'inferior']) {
      const name = side[0].toUpperCase() + side.slice(1) + ' ' + level + ' pulmonary vein';
      const territory = level === 'inferior' ? 'inferior lobe' : (side === 'right' ? 'superior and middle lobes' : 'superior lobe, including the lingula');
      lungData.push(entry(side + '-' + level + '-pulmonary-vein', name, 'Vein', 'veins', 'Vena pulmonalis ' + level + ' ' + (side === 'right' ? 'dextra' : 'sinistra'),
        'This is one of the four usual pulmonary veins. Smaller tributaries gather oxygen-rich blood from the ' + territory + ' on this side.',
        'From the ' + side + ' lung hilum to the posterior left atrium.', 'Returns oxygenated blood from the ' + side + ' lung to the heart.', [side + '-pulmonary-artery', side + (level === 'inferior' ? '-lower-lobe' : '-upper-lobe')]));
    }
  }

  // These endpoints describe a common segment pattern. Left apicoposterior and anteromedial basal branches are combined.
  const segments = [
    ['right-upper', 'apical', 'Apical', 'B1', -.62, .86, -.03],
    ['right-upper', 'posterior', 'Posterior', 'B2', -.75, .49, -.26],
    ['right-upper', 'anterior', 'Anterior', 'B3', -.76, .36, .23],
    ['right-middle', 'lateral', 'Lateral', 'B4', -.93, -.16, .25],
    ['right-middle', 'medial', 'Medial', 'B5', -.49, -.28, .25],
    ['right-lower', 'superior', 'Superior', 'B6', -.68, -.02, -.33],
    ['right-lower', 'medial-basal', 'Medial basal', 'B7', -.37, -.84, -.09],
    ['right-lower', 'anterior-basal', 'Anterior basal', 'B8', -.65, -.90, .21],
    ['right-lower', 'lateral-basal', 'Lateral basal', 'B9', -1.06, -.84, .01],
    ['right-lower', 'posterior-basal', 'Posterior basal', 'B10', -.83, -.86, -.31],
    ['left-upper', 'apicoposterior', 'Apicoposterior', 'B1+2', .64, .70, -.10],
    ['left-upper', 'anterior', 'Anterior', 'B3', .72, .38, .23],
    ['left-upper', 'superior-lingular', 'Superior lingular', 'B4', .74, -.22, .24],
    ['left-upper', 'inferior-lingular', 'Inferior lingular', 'B5', .54, -.48, .23],
    ['left-lower', 'superior', 'Superior', 'B6', .72, -.05, -.29],
    ['left-lower', 'anteromedial-basal', 'Anteromedial basal', 'B7+8', .57, -.86, .12],
    ['left-lower', 'lateral-basal', 'Lateral basal', 'B9', 1.04, -.86, .015],
    ['left-lower', 'posterior-basal', 'Posterior basal', 'B10', .84, -.88, -.29]
  ];
  for (const [lobe, segment, name, number] of segments) {
    const side = lobe.startsWith('right') ? 'Right' : 'Left';
    const id = lobe + '-' + segment;
    const parent = lobeInfo.find(x => x[0] === lobe)[1].toLowerCase() + ' lobe';
    lungData.push(entry(id + '-bronchus', side + ' ' + name.toLowerCase() + ' bronchus (' + number + ')', 'Segmental bronchus', 'airways', number + ' · ' + parent,
      'This bronchus supplies the ' + name.toLowerCase() + ' segment of the ' + parent + '. Its smaller branches ultimately connect with bronchioles.',
      'Within the ' + parent + '.', 'Distributes ventilation to this bronchopulmonary segment.', [lobe + '-lobar-bronchus', id + '-artery']));
    lungData.push(entry(id + '-artery', side + ' ' + name.toLowerCase() + ' segmental artery (' + number.replace('B','A') + ')', 'Segmental artery', 'arteries', number.replace('B','A') + ' · ' + parent,
      'A pulmonary arterial branch accompanies the segmental airway and distributes oxygen-poor blood throughout this segment. Branching patterns vary between people.',
      'Alongside the ' + name.toLowerCase() + ' segmental bronchus of the ' + parent + '.', 'Feeds progressively smaller pulmonary vessels leading to the alveolar capillaries.', [side.toLowerCase() + '-pulmonary-artery', id + '-bronchus']));
  }

  // Tributary coordinates trace blood from the peripheral septa toward named hilar confluences.
  // The upper-lobe subsegmental names follow the Nakazawa/Yamashita convention.
  const vm = {
    ru:[-.425,.145,.15], ra:[-.49,.25,.17], rc:[-.55,.255,-.025], rm:[-.48,-.035,.205],
    rl:[-.405,-.27,-.20], rb:[-.55,-.43,-.18], lu:[.42,.155,.17], ua:[.515,.29,.16],
    li:[.50,-.055,.22], ll:[.41,-.275,-.205], lb:[.55,-.43,-.18]
  };
  const veinBranches = [
    ['right-upper-anterior-vein','Right upper anterior venous trunk','V. anterior','right-superior-pulmonary-vein',[vm.ra,[-.46,.185,.18],vm.ru]],
    ['right-upper-central-vein','Right upper central venous trunk','V. centralis','right-superior-pulmonary-vein',[vm.rc,[-.505,.18,.055],vm.ru]],
    ['right-upper-v1b','Right apical–anterior boundary vein','V1b','right-upper-anterior-vein',[[-.68,.654,.12],[-.594,.47,.132],vm.ra]],
    ['right-upper-v2a','Right apical–posterior boundary vein','V2a','right-upper-central-vein',[[-.70,.655,-.16],[-.642,.469,-.112],vm.rc]],
    ['right-upper-v2c','Right posterior–anterior boundary vein','V2c','right-upper-central-vein',[[-.85,.416,-.014],[-.72,.33,-.022],vm.rc]],
    ['right-upper-v3a','Right anterior intrasegmental vein','V3a','right-upper-anterior-vein',[[-.79,.292,.205],[-.68,.292,.193],vm.ra]],
    ['right-middle-vein','Right middle lobar vein','V4+5','right-superior-pulmonary-vein',[vm.rm,[-.443,.048,.188],vm.ru]],
    ['right-middle-v4','Right lateral segmental vein','V4','right-middle-vein',[[-.94,-.224,.18],[-.73,-.15,.199],vm.rm]],
    ['right-middle-v5','Right medial segmental vein','V5','right-middle-vein',[[-.46,-.32,.192],[-.43,-.163,.204],vm.rm]],
    ['left-upper-division-vein','Left upper division venous trunk','V1+2 + V3','left-superior-pulmonary-vein',[vm.ua,[.47,.224,.174],vm.lu]],
    ['left-upper-v12','Left apicoposterior vein','V1+2','left-upper-division-vein',[[.69,.72,-.031],[.727,.53,-.108],[.648,.415,.034],vm.ua]],
    ['left-upper-v3','Left anterior segmental vein','V3','left-upper-division-vein',[[.84,.36,.179],[.69,.334,.184],vm.ua]],
    ['left-lingular-vein','Left lingular venous trunk','V4+5','left-superior-pulmonary-vein',[vm.li,[.454,.068,.202],vm.lu]],
    ['left-lingular-v4','Left superior lingular vein','V4','left-lingular-vein',[[.75,-.16,.165],[.60,-.103,.201],vm.li]],
    ['left-lingular-v5','Left inferior lingular vein','V5','left-lingular-vein',[[.56,-.49,.179],[.53,-.265,.209],vm.li]]
  ];
  for(const side of [-1,1]) {
    const part=side<0?'right':'left', title=side<0?'Right':'Left', base=side<0?vm.rb:vm.lb, hilum=side<0?vm.rl:vm.ll;
    veinBranches.push(
      [part+'-lower-v6',title+' superior segmental vein of lower lobe','V6',part+'-inferior-pulmonary-vein',[[side*.70,-.038,-.265],[side*.589,-.137,-.251],hilum]],
      [part+'-common-basal-vein',title+' common basal venous trunk','Basal root',part+'-inferior-pulmonary-vein',[base,[side*.495,-.33,-.210],hilum]],
      [part+'-lower-v9',title+' lateral basal vein','V9',part+'-common-basal-vein',[[side*.98,-.875,-.062],[side*.802,-.676,-.110],base]],
      [part+'-lower-v10',title+' posterior basal vein','V10',part+'-common-basal-vein',[[side*.81,-.936,-.31],[side*.71,-.70,-.257],base]]
    );
    if(side<0)veinBranches.push(
      ['right-lower-v7','Right medial basal vein','V7','right-common-basal-vein',[[-.407,-.817,-.142],[-.457,-.63,-.185],base]],
      ['right-lower-v8','Right anterior basal vein','V8','right-common-basal-vein',[[-.75,-.84,.134],[-.686,-.62,.016],base]]
    );
    else veinBranches.push(['left-lower-v78','Left anteromedial basal venous drainage','Anteromedial basal tributary','left-common-basal-vein',[[.645,-.875,.116],[.603,-.638,-.015],base]]);
  }
  function addVeinData() {
    for(const [id,name,label,parent] of veinBranches) {
      const downstream=lungData.find(v=>v.id===parent)?.name || veinBranches.find(v=>v[0]===parent)[1];
      const boundary=id.endsWith('v1b')||id.endsWith('v2a')||id.endsWith('v2c');
      const zone=boundary?'In an intersegmental plane of the right superior lobe.':id.endsWith('v3a')?'Within the anterior segment of the right superior lobe.':name.includes('basal')?'In the basal region of the inferior lobe.':name.includes('lingular')?'Within the lingula of the left superior lobe.':name.includes('middle')||id.includes('-middle-')?'Within or immediately medial to the right middle lobe.':id.includes('lower-v6')?'Within the superior segment of the inferior lobe.':'In the superior lobe, extending toward its venous root.';
      lungData.push(entry(id,name,'Venous tributary','veins',label,
        boundary?'Venules on either side of this boundary contribute blood. Follow its course to the '+downstream.toLowerCase()+'.':
        'This channel collects blood from the pulmonary capillary bed and joins the '+downstream.toLowerCase()+'.',
        zone,'Returns blood after alveolar gas exchange.',[parent,...veinBranches.filter(v=>v[3]===id).map(v=>v[0]).slice(0,2)]));
    }
    for(const v of lungData.filter(e=>e.id.endsWith('-pulmonary-vein')))v.related=[...veinBranches.filter(b=>b[3]===v.id).map(b=>b[0]),...v.related].slice(0,4);
  }
  addVeinData();
  // Cross-sections are asymmetric. The mediastinal surface is compressed, and the basal surface is concave.
  const radiiTable = [[0,.88],[.045,.99],[.15,1],[.32,.945],[.52,.85],[.68,.735],[.81,.58],[.91,.43],[.96,.29],[.986,.16],[1,.025]];
  function profile(t) {
    let i = 1;
    while (i < radiiTable.length - 1 && t > radiiTable[i][0]) i++;
    const a = radiiTable[i - 1], b = radiiTable[i];
    return mix(a[1], b[1], clamp((t - a[0]) / (b[0] - a[0])));
  }
  function surface(side, t, a, inset = 0) {
    const d = Math.cos(a), front = Math.sin(a);
    const shape = profile(t);
    const sx = (side < 0 ? .56 : .51) * shape;
    const cx = .629 + .016 * Math.sin(Math.PI * t) - .021 * t;
    const medial = Math.max(0, -d), anterior = Math.max(0, front);
    const notch = side > 0 ? .23 * Math.exp(-Math.pow((t - .38) / .175, 2)) * medial * (.2 + .8 * anterior) : 0;
    const yBase = side < 0 ? -1.12 : -1.19;
    const x = side * (cx + (sx - inset) * d + notch);
    const y = mix(yBase, 1.015, t) + (side < 0 ? .014 : 0) + .052 * Math.sin(a + .3) * (1-t) - .035 * d * (1-t);
    const z = -.045 + (.44 * shape - inset) * front * (1 - .34 * medial) - .045 * medial + .045 * t;
    return [x, y, z];
  }
  const oblique = a => .438 - .342 * Math.sin(a) + .030 * Math.cos(a);
  const horizontal = a => .479 + .019 * Math.sin(a) - .008 * Math.cos(a);
  function cut(t, a) {
    if (t <= .07 || t >= .92) return false;
    const width = .97 * Math.sqrt(Math.max(0, 1 - ((t-.495)/.425)**2));
    return Math.abs(a - 1.82) < width;
  }
  function lobe(g, side, band, id, rgb) {
    const vertices = [], faces = [], colors = [];
    const nTheta = 72, nHeight = band === 'middle' ? 11 : 23;
    const grid = [];
    function limits(a) {
      const f = oblique(a), h = horizontal(a), gap=.0025;
      if (band === 'lower') return [0,f-gap];
      if (band === 'middle') return [f+gap, Math.max(f+gap,h-gap)];
      return [(side < 0 ? Math.max(f,h) : f)+gap,1];
    }
    for (let i = 0; i <= nTheta; i++) {
      const a = tau * i / nTheta, [low, high] = limits(a);
      const rows = [];
      for (let j = 0; j <= nHeight; j++) {
        const t = mix(low, high, j / nHeight);
        const ridge = Math.min(j, nHeight - j);
        const inset = ridge === 0 && t > .004 && t < .995 ? .014 : 0;
        rows.push({ t, a, visible: !(side > 0 && cut(t, a)) });
        const p = surface(side, t, a, inset);
        vertices.push(p);
        const grain = .035 * Math.sin(24*p[0]+39*p[1]+7*Math.sin(a*3)) * Math.sin(32*p[2]-13*p[0]) + .021 * Math.sin(48*t+6*a) + .013 * Math.sin(124*p[1]+32*p[2]);
        colors.push(tint(rgb, 1 + grain - (ridge === 0 && inset ? .14 : 0)));
      }
      grid.push(rows);
    }
    const index = (i,j) => i*(nHeight+1)+j;
    for (let i=0;i<nTheta;i++) for (let j=0;j<nHeight;j++) {
      if (band === 'middle' && horizontal((i+.5)*tau/nTheta)<=oblique((i+.5)*tau/nTheta)) continue;
      if (side > 0 && cut((grid[i][j].t+grid[i+1][j+1].t)*.5, (i+.5)*tau/nTheta)) continue;
      const a=index(i,j),b=index(i+1,j),c=index(i+1,j+1),d=index(i,j+1);
      if (side>0) faces.push([a,c,b],[a,d,c]); else faces.push([a,b,c],[a,c,d]);
    }
    g.mesh(id, 'tissue', tint(rgb,1), vertices, faces, {vertexColors:colors});
  }
  function bottom(g, side, id) {
    const vertices=[], faces=[];
    const n=50, rings=5;
    for(let j=0;j<=rings;j++) for(let i=0;i<n;i++) {
      const p=surface(side,0,tau*i/n), r=(j+.025)/(rings+.025);
      vertices.push([mix(side*.63,p[0],r),p[1]+.115*(1-r*r),mix(-.04,p[2],r)]);
    }
    for(let j=0;j<rings;j++) for(let i=0;i<n;i++){
      const a=j*n+i,b=j*n+(i+1)%n,c=b+n,d=a+n;
      if(side>0) faces.push([a,d,c],[a,c,b]); else faces.push([a,c,d],[a,b,c]);
    }
    g.mesh(id,'tissue','#a85e6c',vertices,faces);
  }
  function lungFissure(g, side, id, horiz=false) {
    let line=[];
    function flush(){if(line.length>1)g.tube(id,'tissue','#744556',line,.008,{sides:5});line=[];}
    for(let i=0;i<=72;i++){
      const a=tau*i/72, t=horiz?horizontal(a):oblique(a);
      if((horiz&&t<=oblique(a))||(side>0&&cut(t,a))) {flush(); continue;}
      line.push(surface(side,t,a,.008));
    }
    flush();
  }
  function fissuralFaces(g,side,horiz=false) {
    const id=(side<0?'right':'left')+'-'+(horiz?'horizontal':'oblique')+'-fissure';
    const v=[],f=[],n=72;
    for(let i=0;i<=n;i++){
      const a=tau*i/n,t=horiz?horizontal(a):oblique(a);
      const skin=surface(side,t,a,.015);
      const deep=lerp(skin,[side*.49,horiz?-.05:-.16,-.075],.34);
      v.push(plus(skin,[0,.004,0]),plus(deep,[0,.002,0]),plus(deep,[0,-.002,0]),plus(skin,[0,-.004,0]));
      const mid=(i-.5)*tau/n;
      if(!i||(horiz&&horizontal(mid)<=oblique(mid))||(side>0&&cut(t,mid)))continue;
      for(const d of [0,2]){const k=i*4+d;f.push([k-4,k-3,k+1],[k-4,k+1,k]);}
    }
    g.mesh(id,'tissue','#a96a79',v,f);
  }
  function cutRim(g) {
    for (const sign of [-1,1]) {
      const p=[];
      for (let i=0;i<=42;i++) {
        const t=.07+.85*i/42;
        const w=.97*Math.sqrt(Math.max(0,1-((t-.495)/.425)**2));
        p.push(surface(1,t,1.82+sign*w,.008));
      }
      g.tube('lungs','tissue','#d39391',p,.012,{sides:7});
    }
  }
  function diaphragm(g) {
    const v=[],f=[],colors=[], rows=15,cols=55;
    for(let r=0;r<=rows;r++)for(let j=0;j<=cols;j++){
      const t=r/rows,a=tau*j/cols;
      const x=1.25*t*Math.cos(a),z=.54*t*Math.sin(a)-.055;
      const dome=.205*Math.exp(-((Math.abs(x)-.57)**2)/.19);
      const y=-1.31+dome*(1-t**3)-.03*t*t+.04*(x<0?1:0)*(1-t);
      v.push([x,y,z]); colors.push(tint([157,87,91],.90+.13*Math.abs(Math.cos(33*a))+.15*(1-t)**3));
    }
    for(let r=0;r<rows;r++)for(let j=0;j<cols;j++){const a=r*(cols+1)+j,b=a+1,c=b+cols+1,d=a+cols+1;f.push([a,b,c],[a,c,d]);}
    g.mesh('diaphragm','tissue','#a36365',v,f,{vertexColors:colors});
    g.pin('diaphragm',[-.50,-1.195,.27]);
  }
  function trachea(g) {
    g.tube('trachea','airways','#b98f7c',[[0,1.38,-.025],[.008,1.12,-.012],[.005,.79,-.02],[0,.51,-.025]],[.116,.121,.118,.124],{sides:23,hollow:true});
    for(let k=0;k<14;k++){
      const y=.556+k*.062, p=[];
      for(let i=0;i<=14;i++) {
        const a=-1.06+i/14*(Math.PI+2.12);
        p.push([.003+.118*Math.cos(a),y+.006*Math.sin(2*a+.4*k),-.023+.113*Math.sin(a)]);
      }
      g.tube('tracheal-cartilage','airways',cartilage,p,.014,{sides:7});
    }
    g.tube('larynx','airways','#bf9e8c',[[0,1.34,-.024],[0,1.43,-.032],[0,1.52,-.024]],[.114,.126,.138],{sides:22,hollow:true});
    // Thyroid cartilage flares superiorly and meets at a pronounced anterior angle.
    const v=[],f=[];
    for(let i=0;i<=18;i++) {
      const a=.05+(Math.PI-.1)*i/18;
      for(let j=0;j<2;j++){
        const h=j?.14:0;
        v.push([(.129+j*.016)*Math.cos(a),1.37+h+.027*Math.abs(Math.cos(a))-.034*j*Math.exp(-Math.pow((a-Math.PI/2)/.20,2)),-.034+(.133+j*.025)*Math.sin(a)]);
      }
      if(i){const k=i*2;f.push([k-2,k-1,k+1],[k-2,k+1,k]);}
    }
    g.mesh('larynx','airways','#dfc8af',v,f);
    g.pin('larynx',[0,1.45,.10]);g.pin('trachea',[.01,.92,.098]);g.pin('tracheal-cartilage',[-.08,1.17,.065]);
    g.tube('carina','airways','#b78e79',[[-.065,.48,.033],[0,.52,.052],[.064,.49,.029]],[.025,.031,.025],{sides:10});
    g.pin('carina',[0,.506,.065]);
  }
  function airwayTube(g,id,p,r){
    g.tube(id,'airways',airway,p,r,{sides:12});
  }
  const roots={
    'right-upper':[[-.29,.27,-.04],[-.42,.37,-.03],[-.54,.46,-.03]],
    'right-middle':[[-.425,.001,-.05],[-.51,-.084,.026],[-.605,-.125,.116]],
    'right-lower':[[-.425,.001,-.05],[-.49,-.17,-.10],[-.558,-.33,-.12]],
    'left-upper':[[.40,.20,-.05],[.495,.245,-.036],[.542,.263,-.021]],
    'left-lower':[[.40,.20,-.05],[.47,.015,-.1],[.555,-.30,-.12]]
  };
  function bronchialTree(g) {
    for(const side of [-1,1]){
      const s=side<0?'right':'left';
      const end=side<0?[-.29,.27,-.04]:[.40,.20,-.05];
      const p=[[0,.52,-.024],[side*.075,.435,-.035],lerp([side*.075,.435,-.035],end,.55),end];
      airwayTube(g,s+'-main-bronchus',p,[.109,side<0?.102:.091,.088,.079]);
      g.pin(s+'-main-bronchus',p[2]);
    }
    airwayTube(g,'bronchus-intermedius',[roots['right-upper'][0],[-.345,.151,-.055],roots['right-lower'][0]],[.077,.073,.065]);
    g.pin('bronchus-intermedius',[-.345,.151,-.055]);
    for(const [id,p] of Object.entries(roots)){
      airwayTube(g,id+'-lobar-bronchus',p,[.062,.057,.052]);g.pin(id+'-lobar-bronchus',p[1]);
      g.tube('lobar-bronchi','airways','#ddbb99',[p[1],lerp(p[1],p[2],.19)],[.059,.056],{sides:12});
    }
    g.pin('lobar-bronchi',roots['left-upper'][1]);
    g.pin('segmental-bronchi',[.655,.335,.077]);
    const arterialJunction = {
      'right-anterior':[-.46,.37,.053],'right-interlobar':[-.474,.113,.02],'right-middle':[-.57,-.105,.129],'right-basal':[-.605,-.29,-.06],
      'left-upper':[.543,.31,.014],'left-interlobar':[.53,.118,-.144],'left-lingular':[.55,.005,.033],'left-basal':[.60,-.267,-.08]
    };
    const j=arterialJunction;
    for(const [side,hilum,connections] of [
      ['right',[-.37,.295,.088],[[null,'right-anterior'],[null,'right-interlobar'],['right-interlobar','right-middle'],['right-interlobar','right-basal']]],
      ['left',[.40,.30,.065],[[null,'left-upper'],[null,'left-interlobar'],['left-interlobar','left-lingular'],['left-interlobar','left-basal']]]
    ])for(const [start,end] of connections){
      const a=start?j[start]:hilum,b=j[end];
      g.tube(side+'-pulmonary-artery','arteries',blue,[a,lerp(a,b,.5),b],[.054,.049,.039],{sides:11});
    }
    for(const row of segments){
      const [lobe,segment,, ,x,y,z]=row, id=lobe+'-'+segment, side=Math.sign(x), root=roots[lobe][2];
      // Lingular bronchi descend from the upper division near the left upper lobar origin.
      const branch=segment.includes('lingular')?[.485,.16,.018]:segment==='superior'?roots[lobe][1]:root;
      if(segment.includes('lingular'))airwayTube(g,'left-upper-lobar-bronchus',[root,[.507,.213,-.004],branch],[.042,.04,.036]);
      const tip=[x,y,z], mid=lerp(branch,tip,.46);
      mid[0]+=side*.018; mid[2]-=.019;
      airwayTube(g,id+'-bronchus',[branch,mid,tip],[.039,.03,.019]);
      g.pin(id+'-bronchus',lerp(mid,tip,.58));
      g.tube('segmental-bronchi','airways',cartilage,[mid,lerp(mid,tip,.07)],[.031,.03],{sides:8});
      for(const sign of [-1,1]) {
        const origin=lerp(mid,tip,.82);
        const vert=tip[1]-mid[1]>=0?1:-1;
        const twig=plus(tip,[side*sign*.062,vert*.067,sign*.047]);
        airwayTube(g,'bronchioles',[origin,lerp(origin,twig,.59),twig],[.016,.010,.006]);
        const w=plus(twig,[side*sign*.027,vert*.029,-sign*.028]);
        g.tube('bronchioles','airways','#e2ba99',[lerp(origin,twig,.65),w],[.009,.0045],{sides:6});
      }
      const offset=[side*.042,.042,.062];
      let source;
      if(lobe==='right-upper')source=segment==='posterior'?'right-interlobar':'right-anterior';
      else if(lobe==='left-upper')source=segment.includes('lingular')?'left-lingular':'left-upper';
      else if(lobe==='right-middle')source='right-middle';
      else source=(side<0?'right':'left')+(segment==='superior'?'-interlobar':'-basal');
      const arterialRoot=j[source], artMid=plus(mid,offset), artTip=plus(tip,[side*.022,.025,.047]);
      g.tube(id+'-artery','arteries',blue,[arterialRoot,artMid,artTip],[.033,.024,.011],{sides:10});g.pin(id+'-artery',artMid);
      for(const sign of [-1,1]){
        const e=plus(artTip,[side*sign*.065,Math.sign(y-mid[1])*.066,sign*.032]);
        g.tube(id+'-artery','arteries','#6396be',[lerp(artMid,artTip,.70),artTip,e],[.014,.009,.004],{sides:6});
      }
    }
    g.pin('bronchioles',[.76,.438,.258]);
    for(const side of [-1,1]){
      const s=side<0?'right':'left', hilum=side<0?[-.37,.295,.088]:[.40,.30,.065];
      const p=side<0?[[.12,.038,.181],[.055,.187,.16],[-.14,.242,.134],hilum]:[[.12,.039,.181],[.15,.204,.152],[.266,.293,.112],hilum];
      g.tube(s+'-pulmonary-artery','arteries',blue,p,[.091,.085,.079,.064],{sides:16});
      g.pin(s+'-pulmonary-artery',p[2]);
      const joins=side<0?[vm.ru,vm.rl]:[vm.lu,vm.ll];
      for(const [i,join] of joins.entries()){
        const id=s+'-'+(i?'inferior':'superior')+'-pulmonary-vein';
        const end=[side*.085,i?-.315:.018,-.235];
        const p=[join,[side*.298,i?-.29:.10,i?-.22:.067],[side*.195,i?-.307:.047,-.09],end];
        g.tube(id,'veins',red,p,[.057,.065,.069,.071],{sides:16,hollow:true});
        g.pin(id,p[1]);
      }
    }
    for(const [id,,, ,path] of veinBranches) {
      const trunk=veinBranches.some(b=>b[3]===id), radii=path.map((_,i)=>mix(trunk?.035:.010,trunk?.052:.029,i/(path.length-1)));
      g.tube(id,'veins',red,path,radii,{sides:10});g.pin(id,lerp(path[0],path[1],.62));
      if(!trunk){
        const e=path[0], side=Math.sign(e[0]);
        for(const k of [-1,1])g.tube(id,'veins','#cf7677',[plus(e,[side*k*.044,Math.sign(e[1]-path[1][1])*.051,k*.029]),e,lerp(e,path[1],.18)],[.004,.008,.012],{sides:6});
      }
    }
  }
  function surfaceLandmark(g, side, id, t0, t1, a0, a1, color) {
    const v=[], f=[], cols=10, rows=10;
    for(let i=0;i<=cols;i++) for(let j=0;j<=rows;j++){
      const a=mix(a0,a1,i/cols), t=mix(t0,t1,j/rows);
      v.push(surface(side,t,a,-.004));
      if(i&&j){const c=v.length-1,b=c-1,d=c-rows-1,aa=d-1;
        if(side>0)f.push([aa,c,b],[aa,d,c]);else f.push([aa,b,c],[aa,c,d]);}
    }
    g.mesh(id,'tissue',color,v,f,{internal:true});
  }
  function bronchialVessels(g) {
    for(const side of [-1,1]) {
      const s=side < 0 ? 'right' : 'left';
      const artery=s+'-bronchial-arteries', vein=s+'-bronchial-veins';
      const root=[side*.39,.234,-.114];
      const branches=side<0?['right-upper','right-middle','right-lower']:['left-upper','left-lower'];
      g.tube(artery,'arteries','#bf4f55',[[.10,.34,-.27],[side*.16,.292,-.185],root],[.016,.014,.013],{sides:7});
      g.tube(vein,'veins','#49759c',[[side*.16,.40,-.27],[side*.26,.31,-.194],plus(root,[0,-.026,-.027])],[.020,.018,.015],{sides:7});
      for(const branch of branches) {
        const e=plus(roots[branch][2],[side*.008,-.021,-.067]);
        const m=lerp(root,e,.55);m[0]+=side*.019;
        g.tube(artery,'arteries','#bf4f55',[root,m,e],[.013,.010,.0065],{sides:6});
        g.tube(vein,'veins','#49759c',[plus(root,[0,-.026,-.027]),plus(m,[0,-.025,-.021]),plus(e,[0,-.021,-.017])],[.015,.012,.008],{sides:6});
      }
      g.pin(artery,root);g.pin(vein,plus(root,[0,-.026,-.027]));
    }
  }
  window.buildLungs=g=>{
    for (const side of [-1,1]) {
      const s=side<0?'right':'left';
      lobe(g,side,'upper',s+'-upper-lobe',side<0?[202,130,139]:[196,126,136]);
      lobe(g,side,'lower',s+'-lower-lobe',side<0?[182,111,126]:[187,112,129]);
      if(side<0)lobe(g,side,'middle','right-middle-lobe',[208,130,136]);
      bottom(g,side,s+'-lower-lobe');
      lungFissure(g,side,s+'-oblique-fissure');fissuralFaces(g,side);
      if(side<0){lungFissure(g,side,'right-horizontal-fissure',true);fissuralFaces(g,side,true);}
      g.pin(s+'-upper-lobe',surface(side,.76,side<0?1.55:.40));
      g.pin(s+'-lower-lobe',surface(side,.10,side<0?1.55:.45));
      g.pin(s+'-oblique-fissure',surface(side,oblique(.25),.25));
    }
    g.pin('right-middle-lobe',surface(-1,.34,1.52));
    g.pin('right-horizontal-fissure',surface(-1,horizontal(1.53),1.53));
    g.pin('lungs',surface(-1,.53,1.5));
    cutRim(g);
    bronchialTree(g);bronchialVessels(g);trachea(g);diaphragm(g);
    surfaceLandmark(g,-1,'visceral-pleura',.57,.78,1.04,1.42,'#dca7a8');
    surfaceLandmark(g,1,'cardiac-notch',.30,.45,2.82,3.09,'#ce9296');
    surfaceLandmark(g,1,'lingula',.16,.29,2.66,3.06,'#cf9090');
    g.pin('visceral-pleura',surface(-1,.68,1.24));
    g.pin('cardiac-notch',surface(1,.37,2.85));
    g.pin('lingula',surface(1,.225,2.69));
  };
  window.lungStructures = lungData;

  window.alveoliStructures = [
    entry('alveoli','Alveoli','Air spaces','tissue','Alveoli pulmonis','At the ends of the bronchial tree, microscopic air pockets share delicate walls. The opened pockets in this enlarged teaching model expose the inner air-facing surface.','In the respiratory zone at the ends of the bronchial tree.','Provide a large, thin interface for gas diffusion between air and blood.',['alveolar-sac','alveolar-capillaries','respiratory-membrane']),
    entry('terminal-bronchiole','Terminal bronchiole','Airway','airways','Bronchiolus terminalis','The last purely conducting airway has a continuous wall. Beyond it, small alveolar openings begin to interrupt the walls of respiratory bronchioles.','Immediately upstream of the respiratory bronchioles.','Conducts air to the beginning of a pulmonary acinus.',['respiratory-bronchiole','alveolar-duct']),
    entry('respiratory-bronchiole','Respiratory bronchiole','Airway','airways','Bronchiolus respiratorius','Scattered alveoli open from the walls of this small airway. This is the first part of the airway tree where gas exchange can occur.','Between terminal bronchioles and alveolar ducts.','Conducts air and permits gas exchange at the alveoli along its walls.',['terminal-bronchiole','alveolar-duct','alveoli']),
    entry('alveolar-duct','Alveolar duct','Air passage','airways','Ductus alveolaris','Alveolar openings line this distal passage almost continuously. Its branches lead to common spaces called alveolar sacs.','After a respiratory bronchiole, within a pulmonary acinus.','Distributes air among the openings of many alveoli.',['respiratory-bronchiole','alveolar-sac']),
    entry('alveolar-sac','Alveolar sac','Air space','tissue','Sacculus alveolaris','An alveolar sac is a common chamber into which several alveoli open. The individual alcoves surrounding that chamber are alveoli.','At the distal end of an alveolar duct.','Connects a cluster of adjoining gas-exchange surfaces to the airway.',['alveolar-duct','alveoli','alveolar-septum']),
    entry('alveolar-septum','Interalveolar septum','Tissue partition','tissue','Septum interalveolare','Adjacent alveoli share thin partitions that contain capillaries, elastic fibers, and a small amount of supporting tissue. The exposed rim marks a cut through one such wall.','Between neighboring alveolar air spaces.','Supports the capillary mesh and separates neighboring air spaces.',['alveolar-capillaries','respiratory-membrane','type-i-cell']),
    entry('pulmonary-arteriole','Pulmonary arteriole','Arteriole','arteries','Arteriola pulmonalis','Small pulmonary arterial branches deliver oxygen-poor blood to the capillary sheets in the walls of the alveoli.','At the inflow side of an alveolar capillary bed.','Supplies blood for exchange with the gas in the alveoli.',['alveolar-capillaries','pulmonary-venule']),
    entry('alveolar-capillaries','Alveolar capillary network','Capillary bed','arteries','Rete capillare alveolare','An interconnected sheet of tiny vessels lies inside the alveolar septa. As blood moves through it, oxygen diffuses into the blood and carbon dioxide diffuses into the air.','Within the partitions between neighboring alveoli.','Brings red blood cells close to ventilated alveolar surfaces.',['pulmonary-arteriole','pulmonary-venule','respiratory-membrane']),
    entry('pulmonary-venule','Pulmonary venule','Venule','veins','Venula pulmonalis','These vessels collect blood after it passes the alveolar air spaces. Larger tributaries eventually join pulmonary veins leading to the left atrium.','On the outflow side of the alveolar capillary bed.','Carries newly oxygenated blood toward the pulmonary veins.',['alveolar-capillaries','pulmonary-arteriole']),
    entry('respiratory-membrane','Respiratory membrane','Diffusion barrier','tissue','Membrana respiratoria','Alveolar epithelium, closely apposed basement membranes, and capillary endothelium form a thin diffusion path. Each gas follows its own partial-pressure gradient.','Where a capillary borders an air-filled alveolus.','Allows oxygen and carbon dioxide to diffuse between air and blood.',['type-i-cell','alveolar-capillaries','alveolar-septum']),
    entry('type-i-cell','Type I alveolar cell','Epithelial cell','tissue','Pneumocytus typus I','These extremely flat epithelial cells spread thinly across most of the air-facing surface. Their shape minimizes the distance a gas must cross.','Lining the interior of each alveolus.','Forms the air-facing component of the respiratory membrane.',['respiratory-membrane','type-ii-cell']),
    entry('type-ii-cell','Type II alveolar cell','Epithelial cell','tissue','Pneumocytus typus II','These cuboidal cells release surfactant, which lowers surface tension at the air–liquid interface. They can also repopulate damaged alveolar epithelium.','Scattered among type I cells, often at corners of alveoli.','Produces surfactant and helps repair the alveolar lining.',['type-i-cell','alveoli']),
    entry('erythrocyte','Red blood cell','Blood cell','arteries','Erythrocytus','A flexible biconcave cell contains hemoglobin. Oxygen that crosses the respiratory membrane can bind to hemoglobin inside the cell.','Inside the capillaries and vessels. The enlarged cell is exposed inside a septal capillary.','Transports oxygen and contributes to carbon dioxide transport.',['alveolar-capillaries','pulmonary-venule','respiratory-membrane'])
  ];

  window.alveoliStructures.push(
    entry('capillary-endothelium','Capillary endothelium','Cell layer','tissue','Endothelium capillare','A continuous sheet of flattened endothelial cells encloses the blood. The cut edge of a capillary exposes its lining.','On the blood-facing side of the alveolar septum.','Provides a thin, selective barrier between plasma and the interstitium.',['fused-basal-laminae','erythrocyte','respiratory-membrane']),
    entry('fused-basal-laminae','Fused basal laminae','Basement membrane','tissue','Laminae basales','At the thin side of a septal capillary, the basal laminae of the epithelial and endothelial cells are closely united.','Between the alveolar epithelium and capillary endothelium.','Supports the two cell layers while preserving a short diffusion distance.',['type-i-cell','capillary-endothelium','respiratory-membrane']),
    entry('surfactant-film','Surfactant film','Surface lining','tissue','Surfactans pulmonalis','A surface-active mixture released by type II cells spreads on the liquid lining the alveolus.','At the interface between alveolar air and its thin liquid lining.','Reduces the inward pull caused by surface tension.',['type-ii-cell','type-i-cell','alveoli'])
  );

  // The exposed passage is surrounded by radial pockets. Adjacent mouths reuse each septal rim,
  // and the capillary mesh connects at common junctions along the shared septa.
  const nSectors=7;
  const ends=[.47,.17,-.17,-.53,-.85,-1.07];
  const inner=[.145,.255,.275,.30,.28,.115];
  const outer=[.44,.69,.82,.88,.81,.49];
  function corner(row,col,depth) {
    const t=row/(ends.length-1);
    const a=2.49+(6.89-2.49)*col/nSectors+.083*Math.sin(1.17*row+1.7*col)*Math.sin(Math.PI*col/nSectors);
    const y=ends[row]+.036*Math.sin(1.47*col+row)*Math.sin(Math.PI*t);
    const r=mix(inner[row],outer[row]*(1+.065*Math.sin(2*col+row)),depth);
    return [-.055+.048*Math.cos(Math.PI*t)+r*Math.cos(a),y-.091*depth*t+.044*depth*(1-t),-.07+r*.85*Math.sin(a)];
  }
  function sampleQuad(c,u,v) {return lerp(lerp(c[0],c[1],u),lerp(c[3],c[2],u),v);}
  function radialCorners(i,k,d){return [corner(i,k,d),corner(i,k+1,d),corner(i+1,k+1,d),corner(i+1,k,d)];}
  function pocket(g,row,col) {
    const mouth=radialCorners(row,col,0), deep=radialCorners(row,col,1);
    const v=[],f=[],colors=[],sides=24,depths=12;
    let id='alveoli';
    const mid=sampleQuad(deep,.5,.5);
    // The bowl opens toward the common duct. The first part of each wall is shared with its neighbor.
    for(let j=0;j<=depths;j++){
      const t=j/depths, d=Math.sin(t*Math.PI/2), shrink=.06*d+.94*Math.pow(t,4);
      const cross=mouth.map((p,k)=>lerp(p,deep[k],d));
      const centre=sampleQuad(cross,.5,.5);
      for(let i=0;i<sides;i++){
        const a=tau*i/sides-Math.PI*.75;
        const u=.5+.5*Math.sign(Math.cos(a))*Math.pow(Math.abs(Math.cos(a)),.62);
        const w=.5+.5*Math.sign(Math.sin(a))*Math.pow(Math.abs(Math.sin(a)),.62);
        const p=lerp(sampleQuad(cross,u,w),centre,shrink);
        v.push(p);
        colors.push(tint([211+5*Math.sin(col),145+6*Math.cos(row),144],.93+.10*Math.cos(2.7*t)-.10*t+.016*Math.sin(2*a+row)));
        if(j){const a0=(j-1)*sides+i,b0=(j-1)*sides+(i+1)%sides,c0=b0+sides,d0=a0+sides;f.push([a0,c0,b0],[a0,d0,c0]);}
      }
    }
    g.mesh(id,'tissue','#ca9292',v,f,{vertexColors:colors});
    return mid;
  }
  function face(g,id,layer,color,p){g.mesh(id,layer,color,p,[[0,1,2],[0,2,3]]);}
  function capColor(p){const q=clamp((p[0]+.83)/1.66);return tint([mix(96,198,q),mix(116,76,q),mix(160,95,q)],1);}
  function acinus(g) {
    for(let i=0;i<ends.length-1;i++)for(let k=0;k<nSectors;k++)pocket(g,i,k);
    for(let i=0;i<ends.length;i++){
      for(let k=0;k<nSectors;k++){
        const a=corner(i,k,0),b=corner(i,k+1,0),m=lerp(a,b,.5);m[1]-=.012;
        const id=i===ends.length-1?'alveolar-sac':i===0?'alveolar-duct':'alveolar-septum';
        g.tube(id,i===0?'airways':'tissue',i===0?'#deb29e':'#e4aca3',[a,m,b],[.026,.018,.025],{sides:7});
        for(const d of [.45,.86]){
          const u=corner(i,k,d),w=corner(i,k+1,d),mid=lerp(u,w,.5);mid[1]+=.028*Math.sin(i+3*k);
          g.tube('alveolar-capillaries','arteries',capColor(mid),[u,mid,w],[.012,.013,.012],{sides:6});
        }
      }
    }
    for(let k=0;k<=nSectors;k++)for(let i=0;i<ends.length-1;i++){
      const a=corner(i,k,0),b=corner(i+1,k,0);
      g.tube('alveolar-septum','tissue','#e0aaa1',[a,lerp(a,b,.5),b],[.023,.017,.024],{sides:7});
      if(k===0||k===nSectors) {
        const v=[a,corner(i,k,1),corner(i+1,k,1),b];
        face(g,'alveolar-septum','tissue','#c89494',v);
      }
      const depths=[.45,.86];
      for(const d of depths){
        const u=corner(i,k,d),w=corner(i+1,k,d),mid=lerp(u,w,.5);mid[0]+=.018*Math.sin(i+k);
        g.tube('alveolar-capillaries','arteries',capColor(mid),[u,mid,w],[.012,.014,.012],{sides:6});
      }
      const s=corner(i,k,depths[i%2]),e=corner(i+1,k,depths[(i+1)%2]);
      g.tube('alveolar-capillaries','arteries',capColor(s),[s,lerp(s,e,.48),e],[.012,.010,.012],{sides:6});
    }
    // Distal blind floor completes the common atrium; individual surrounding pockets share its air.
    const p=[];for(let k=0;k<=nSectors;k++)p.push(corner(ends.length-1,k,0));
    const center=[-.10,-1.225,-.10],v=[center,...p],faces=[];
    for(let k=0;k<nSectors;k++)faces.push([0,k+1,k+2]);
    g.mesh('alveolar-sac','tissue','#d29a98',v,faces);
  }
  function airwaySection(g,id,centers,radii,holes=[]) {
    const v=[],f=[],shade=[],rows=centers.length,cols=26;
    for(let j=0;j<rows;j++)for(let i=0;i<=cols;i++){
      const a=2.47+(6.89-2.47)*i/cols,r=radii[j];
      v.push(plus(centers[j],[r*Math.cos(a),0,r*.91*Math.sin(a)]));
      shade.push(tint([217,177,151],.92+.06*Math.cos(2*a+j*.5)));
      if(i&&j&&!holes.some(h=>j===h[0]&&i>=h[1]&&i<=h[2])){const c=v.length-1,b=c-cols-1,aa=b-1,d=c-1;f.push([aa,b,c],[aa,c,d]);}
    }
    g.mesh(id,'airways','#dcb79e',v,f,{vertexColors:shade});
    for(const i of [0,cols]){const points=centers.map((_,j)=>v[j*(cols+1)+i]);g.tube(id,'airways','#e5c5ad',points,.015,{sides:7});}
    return v;
  }
  function bronchiolarPocket(g,p,n,r) {
    const v=[],f=[],rows=9,cols=20;
    // The pocket replaces a portion of bronchiolar wall, leaving an opening into its lumen.
    for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++) {
      const a=tau*i/cols,depth=j/rows,angle=Math.PI*.67*depth;
      const width=r*(1.0+.20*Math.sin(1.8*angle))*(1-Math.pow(depth,3));
      v.push([p[0]+n[0]*r*1.8*depth-n[2]*width*Math.cos(a),p[1]+width*.83*Math.sin(a),p[2]+n[2]*r*1.8*depth+n[0]*width*Math.cos(a)]);
      if(i&&j){const c=v.length-1,b=c-cols-1,aa=b-1,d=c-1;f.push([aa,b,c],[aa,c,d]);}
    }
    g.mesh('respiratory-bronchiole','airways','#c49787',v,f);
  }
  function redCell(g,center,r=.054){
    const v=[],f=[],stacks=8,slices=24;
    for(const sign of [-1,1])for(let i=0;i<=stacks;i++)for(let j=0;j<=slices;j++){
      const t=.999*i/stacks,a=tau*j/slices;
      const x=.72*r*t*Math.cos(a), y=r*t*Math.sin(a);
      const depth=sign*r*.32*Math.sqrt(1-t*t)*(.42+2.0*t*t);
      v.push(plus(center,[x,y,depth]));
      if(i&&j){const c=v.length-1,d=c-1,b=c-slices-1,aa=b-1;if(sign>0)f.push([aa,c,b],[aa,d,c]);else f.push([aa,b,c],[aa,c,d]);}
    }
    g.mesh('erythrocyte','arteries','#ad3442',v,f);
  }
  function membraneWindow(g) {
    // A cut face in the peripheral septum opens a length of one capillary. Its neighboring
    // epithelial, basal and endothelial bands have exaggerated widths so each remains selectable.
    const a=6.89, T=[Math.cos(a),0,.85*Math.sin(a)],N=[-Math.sin(a),0,Math.cos(a)];
    const start=lerp(corner(2,nSectors,.65),corner(3,nSectors,.65),.04);
    function point(h,along,normal){return [start[0]+T[0]*along+N[0]*normal,start[1]-h,start[2]+T[2]*along+N[2]*normal];}
    const len=.33, radius=.048;
    function axialStrip(id,color,lo,hi){
      face(g,id,'tissue',color,[point(0,lo,.056),point(0,hi,.056),point(len,hi,.056),point(len,lo,.056)]);
      g.pin(id,point(len*.45,(lo+hi)*.5,.058));
    }
    const v=[],f=[],n=20;
    for(let i=0;i<=n;i++){
      const angle=Math.PI*i/n;
      for(let j=0;j<2;j++)v.push(point(len*j,radius*Math.cos(angle),.046-radius*.72*Math.sin(angle)));
      if(i){let k=i*2;f.push([k-2,k,k+1],[k-2,k+1,k-1]);}
    }
    g.mesh('alveolar-capillaries','arteries','#965f73',v,f);
    axialStrip('capillary-endothelium','#b887a8',radius,radius+.019);
    axialStrip('fused-basal-laminae','#e7caa4',radius+.019,radius+.035);
    axialStrip('type-i-cell','#d89491',radius+.035,radius+.065);
    axialStrip('surfactant-film','#f5d8ae',radius+.065,radius+.075);
    for(const h of [0,len])g.tube('respiratory-membrane','tissue','#e2abab',[point(h,radius+.005,.056),point(h,radius+.076,.056)],.012,{sides:8});
    const cell=point(len*.48,0,.041);redCell(g,cell);
    g.pin('erythrocyte',cell);g.pin('respiratory-membrane',point(0,radius+.04,.056));
    const t2=corner(3,nSectors-1,0);
    g.ellipsoid('type-ii-cell','tissue','#e5ae80',t2,[.042,.039,.029]); g.pin('type-ii-cell',t2);
  }
  window.buildAlveoli=g=>{
    const term=[[.04,1.48,-.07],[.039,1.30,-.068],[.032,1.14,-.066],[.027,.99,-.069]];
    airwaySection(g,'terminal-bronchiole',term,[.145,.137,.13,.125]);
    const resp=[term[3],[.022,.90,-.07],[.015,.78,-.07],[.005,.67,-.07],[0,.55,-.07],[-.007,.47,-.07]];
    airwaySection(g,'respiratory-bronchiole',resp,[.125,.128,.132,.135,.14,.145],[[2,1,6],[4,22,26]]);
    for(const [pos,a,r] of [[[.02,.844,-.07],2.98,.068],[[.003,.606,-.07],6.52,.07]]){
      const n=[Math.cos(a),0,Math.sin(a)];
      bronchiolarPocket(g,plus(pos,[.13*n[0],0,.12*n[2]]),n,r);
    }
    acinus(g);
    for(const [side,id,c,k] of [[-1,'pulmonary-arteriole',blue,0],[1,'pulmonary-venule',red,nSectors]]){
      const anchor=corner(1,k,.86);
      const path=[[side*.44,1.24,-.20],[side*.46,.91,-.15],[side*.49,.62,-.01],corner(0,k,.86),anchor,corner(2,k,.86)];
      g.tube(id,side<0?'arteries':'veins',c,path,[.068,.064,.053,.039,.030,.018],{sides:16,hollow:true});
      for(let row=1;row<ends.length-1;row++){
        const s=corner(row,k,.86), e=corner(row+1,k,.86);
        g.tube(id,side<0?'arteries':'veins',c,[s,lerp(s,e,.49),e],[.024,.02,.012],{sides:8});
      }
      g.pin(id,path[2]);
    }
    membraneWindow(g);
    const pins={'alveoli':sampleQuad(radialCorners(2,3,.85),.5,.5),'alveolar-sac':[-.1,-1.19,-.10],
      'alveolar-septum':corner(3,2,.03),'terminal-bronchiole':[-.08,1.23,-.092],
      'respiratory-bronchiole':[-.11,.83,-.069],'alveolar-duct':corner(0,3,0),'alveolar-capillaries':corner(2,0,.58)};
    Object.entries(pins).forEach(([id,p])=>g.pin(id,p));
  };
})();
