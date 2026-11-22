/* Educational heart model; axes are patient-left, superior, and anterior. */
(() => {
  'use strict';

  const structures = [];
  function entry(id, name, type, layer, latin, summary, location, role, related) {
    structures.push({id, name, type, layer, latin, summary, location, role, related});
  }

  entry('heart','Heart','Organ','tissue','Cor','A muscular organ with four chambers. Its right side sends blood to the lungs, and its left side supplies the rest of the body.','Middle mediastinum, between the lungs and above the diaphragm.','Maintains blood flow through the pulmonary and systemic circuits.',['aorta','pulmonary-trunk','left-ventricle','right-atrium']);
  entry('aorta','Aorta','Artery','arteries','Aorta','The largest artery receives blood from the left ventricle. Its ascending portion supplies the coronary arteries, and its arch gives rise to three major branches.','Rises from the left ventricular outflow tract and arches over the left main bronchus.','Distributes oxygenated blood to the systemic circulation.',['left-ventricle','aortic-valve','brachiocephalic-trunk','left-common-carotid','left-subclavian']);
  entry('pulmonary-trunk','Pulmonary trunk','Artery','arteries','Truncus pulmonalis','The right ventricle ejects oxygen-poor blood into this short artery. It divides into the right and left pulmonary arteries.','Anterior to the ascending aorta at its origin, then curves to the left.','Connects the right ventricular outflow tract to the lungs.',['right-ventricle','pulmonary-valve','right-pulmonary-artery','left-pulmonary-artery']);
  entry('superior-vena-cava','Superior vena cava','Vein','veins','Vena cava superior','The right and left brachiocephalic veins unite to form this vessel. It returns blood from the head, neck, upper limbs and much of the thorax.','Enters the upper portion of the right atrium.','Returns oxygen-poor blood from the upper body.',['right-atrium','inferior-vena-cava']);
  entry('inferior-vena-cava','Inferior vena cava','Vein','veins','Vena cava inferior','This large vein ascends through the abdomen and passes through the diaphragm to reach the heart.','Enters the right atrium from below.','Returns systemic venous blood from below the diaphragm.',['right-atrium','superior-vena-cava']);
  entry('right-atrium','Right atrium','Chamber','tissue','Atrium dextrum','Receives venous blood from both venae cavae and the coronary sinus. Blood moves through the tricuspid valve into the right ventricle.','Forms the right border of the heart.','Receives systemic venous return and helps fill the right ventricle.',['superior-vena-cava','inferior-vena-cava','coronary-sinus','tricuspid-valve']);
  entry('right-ventricle','Right ventricle','Chamber','tissue','Ventriculus dexter','This chamber forms most of the anterior surface. Its muscular walls propel blood through the pulmonary valve.','Anterior to the left ventricle, just behind the sternum.','Pumps oxygen-poor blood to the lungs.',['right-atrium','tricuspid-valve','pulmonary-valve','pulmonary-trunk']);
  entry('left-atrium','Left atrium','Chamber','tissue','Atrium sinistrum','Usually four pulmonary veins deliver oxygenated blood to this chamber. It empties through the mitral valve.','Forms much of the posterior base of the heart.','Receives blood from the lungs and helps fill the left ventricle.',['pulmonary-veins','mitral-valve','left-ventricle']);
  entry('left-ventricle','Left ventricle','Chamber','tissue','Ventriculus sinister','The thickest ventricular wall generates the pressure needed to move blood through the body. This chamber forms the apex of the heart.','Occupies the left border, apex, and much of the inferior surface.','Ejects oxygenated blood through the aortic valve.',['left-atrium','mitral-valve','aortic-valve','aorta']);
  entry('right-pulmonary-artery','Right pulmonary artery','Artery','arteries','Arteria pulmonalis dextra','The right branch of the pulmonary trunk crosses behind the ascending aorta and superior vena cava on its way to the right lung.','Between the pulmonary trunk and the right lung root.','Carries oxygen-poor blood to the right lung.',['pulmonary-trunk','pulmonary-veins']);
  entry('left-pulmonary-artery','Left pulmonary artery','Artery','arteries','Arteria pulmonalis sinistra','The left branch of the pulmonary trunk passes beneath the aortic arch toward the root of the left lung.','Runs from the pulmonary trunk to the left lung root.','Carries oxygen-poor blood to the left lung.',['pulmonary-trunk','pulmonary-veins']);
  entry('pulmonary-veins','Pulmonary veins','Veins','veins','Venae pulmonales','Two pulmonary veins usually leave each lung. All four carry oxygenated blood into the left atrium.','Enter the posterior left atrium from either side.','Return blood to the heart after gas exchange.',['left-atrium','left-pulmonary-artery','right-pulmonary-artery']);
  entry('brachiocephalic-trunk','Brachiocephalic trunk','Artery','arteries','Truncus brachiocephalicus','The first usual branch of the aortic arch divides into the right common carotid and right subclavian arteries.','Arises on the right side of the arch.','Supplies the right head, neck and upper limb through its branches.',['aorta','left-common-carotid','left-subclavian']);
  entry('left-common-carotid','Left common carotid artery','Artery','arteries','Arteria carotis communis sinistra','This is usually the second branch of the aortic arch. It ascends in the neck before dividing into internal and external carotid arteries.','Between the brachiocephalic trunk and left subclavian artery at the arch.','Supplies the left head and neck through its branches.',['aorta','brachiocephalic-trunk','left-subclavian']);
  entry('left-subclavian','Left subclavian artery','Artery','arteries','Arteria subclavia sinistra','The third usual branch of the aortic arch courses beneath the left clavicle. It continues as the axillary artery beyond the first rib.','Arises from the distal aortic arch.','Supplies the left upper limb and branches to the neck, brain and thoracic wall.',['aorta','left-common-carotid']);
  entry('left-coronary-artery','Left coronary artery','Artery','arteries','Arteria coronaria sinistra','A short trunk arises from the left aortic sinus and usually divides into the anterior interventricular and circumflex arteries.','Between the pulmonary trunk and left auricle.','Supplies much of the left heart through its branches.',['aorta','left-anterior-descending','circumflex-artery']);
  entry('left-anterior-descending','Anterior interventricular artery','Artery','arteries','Ramus interventricularis anterior','Also called the left anterior descending artery (LAD). Diagonal branches supply the left ventricular wall, and septal branches enter the interventricular septum.','Descends in the anterior interventricular groove toward the apex.','Supplies anterior ventricular muscle and the anterior two-thirds of the septum.',['left-coronary-artery','great-cardiac-vein','left-ventricle']);
  entry('circumflex-artery','Circumflex artery','Artery','arteries','Ramus circumflexus','This branch of the left coronary artery wraps around the left side of the heart in the coronary groove.','Between the left atrium and ventricle.','Supplies the left atrium and part of the left ventricular wall.',['left-coronary-artery','left-ventricle','great-cardiac-vein']);
  entry('right-coronary-artery','Right coronary artery','Artery','arteries','Arteria coronaria dextra','Arises from the right aortic sinus. It follows the coronary groove and typically gives rise to the right marginal and posterior interventricular branches.','Runs between the right atrium and ventricle.','Supplies right heart muscle and variable portions of the conduction system and inferior heart.',['aorta','right-marginal-artery','posterior-interventricular-artery']);
  entry('right-marginal-artery','Right marginal artery','Artery','arteries','Ramus marginalis dexter','This branch of the right coronary artery follows the acute margin of the heart toward the apex.','Along the right ventricular margin.','Supplies the right ventricular free wall.',['right-coronary-artery','right-ventricle']);
  entry('posterior-interventricular-artery','Posterior interventricular artery','Artery','arteries','Ramus interventricularis posterior','Also called the posterior descending artery. In the common right-dominant pattern shown, it arises from the right coronary artery.','Runs in the posterior interventricular groove.','Supplies the posterior portion of the interventricular septum and adjacent ventricular walls.',['right-coronary-artery','middle-cardiac-vein']);
  entry('great-cardiac-vein','Great cardiac vein','Vein','veins','Vena cardiaca magna','The great cardiac vein ascends beside the anterior interventricular artery. It curves left into the coronary groove and continues into the coronary sinus.','Anterior interventricular groove and left atrioventricular groove.','Drains venous blood from much of the left heart.',['left-anterior-descending','coronary-sinus']);
  entry('middle-cardiac-vein','Middle cardiac vein','Vein','veins','Vena cardiaca media','This vein ascends from the region of the apex alongside the posterior interventricular artery.','Posterior interventricular groove.','Drains the posterior ventricular walls into the coronary sinus.',['posterior-interventricular-artery','coronary-sinus']);
  entry('coronary-sinus','Coronary sinus','Vein','veins','Sinus coronarius','A wide venous channel collects blood from several cardiac veins before opening into the right atrium.','Posterior atrioventricular groove.','Returns most of the myocardium’s venous blood to the heart.',['right-atrium','great-cardiac-vein','middle-cardiac-vein']);
  entry('tricuspid-valve','Tricuspid valve','Valve','tissue','Valva tricuspidalis','The right atrioventricular valve opens during ventricular filling. Its leaflets close as the right ventricle contracts.','Between the right atrium and right ventricle.','Prevents backward flow into the right atrium during ventricular contraction.',['right-atrium','right-ventricle']);
  entry('pulmonary-valve','Pulmonary valve','Valve','tissue','Valva trunci pulmonalis','Three semilunar cusps open as right ventricular pressure exceeds pulmonary trunk pressure. They fill and close when the pressure gradient reverses.','At the outlet of the right ventricle.','Prevents blood from returning to the right ventricle.',['right-ventricle','pulmonary-trunk']);
  entry('mitral-valve','Mitral valve','Valve','tissue','Valva mitralis','Also called the bicuspid valve. Its two leaflets are tethered by chordae tendineae to papillary muscles in the left ventricle.','Between the left atrium and left ventricle.','Maintains one-way flow during left ventricular contraction.',['left-atrium','left-ventricle']);
  entry('aortic-valve','Aortic valve','Valve','tissue','Valva aortae','Its three semilunar cusps open during ventricular ejection and close as the aortic pressure becomes greater than the left ventricular pressure.','Between the left ventricle and the ascending aorta.','Prevents backward flow from the aorta into the left ventricle.',['left-ventricle','aorta']);
  entry('interventricular-septum','Interventricular septum','Partition','tissue','Septum interventriculare','This partition separates the ventricular cavities. Its broad muscular portion contracts with the ventricles, while a small membranous portion lies near the base.','Between the right and left ventricles.','Separates the two ventricular pressure chambers and carries conduction pathways.',['right-ventricle','left-ventricle','atrioventricular-bundle']);
  entry('papillary-muscles','Papillary muscles','Muscle','tissue','Musculi papillares','Ventricular muscle projections connect to the atrioventricular valve leaflets through chordae tendineae. They contract as ventricular pressure rises.','Project inward from the walls of both ventricles.','Tension the chordae to support the leaflets during contraction.',['chordae-tendineae','mitral-valve','tricuspid-valve']);
  entry('chordae-tendineae','Chordae tendineae','Tendinous cords','tissue','Chordae tendineae','These slender connective-tissue cords link papillary muscles to the mitral and tricuspid leaflets.','Inside both ventricles, beneath the atrioventricular valves.','Restrain the valve leaflets from prolapsing into the atria during systole.',['papillary-muscles','mitral-valve','tricuspid-valve']);
  entry('sinoatrial-node','Sinoatrial node','Conduction tissue','tissue','Nodus sinuatrialis','Specialized pacemaker cells normally initiate each heartbeat. The electrical impulse spreads through the atrial muscle.','In the right atrial wall at the junction with the superior vena cava.','Sets the normal rhythm for the heartbeat.',['right-atrium','atrioventricular-node']);
  entry('atrioventricular-node','Atrioventricular node','Conduction tissue','tissue','Nodus atrioventricularis','Conduction slows through this compact group of cells, allowing time for ventricular filling before ventricular activation.','In the lower right atrial septum, close to the coronary sinus opening.','Relays the atrial impulse into the atrioventricular bundle.',['sinoatrial-node','atrioventricular-bundle','coronary-sinus']);
  entry('atrioventricular-bundle','Atrioventricular bundle','Conduction tissue','tissue','Fasciculus atrioventricularis','Also called the bundle of His. It passes from the atrioventricular node through the fibrous skeleton and divides into right and left bundle branches.','From the atrioventricular node into the upper interventricular septum.','Conducts electrical activation toward the ventricular apex.',['atrioventricular-node','interventricular-septum','purkinje-fibers']);
  entry('purkinje-fibers','Purkinje fibers','Conduction tissue','tissue','Rami subendocardiales','A branching network of specialized cardiac muscle cells rapidly distributes the electrical impulse from the bundle branches. The model shows representative branches.','Beneath the endocardium of the ventricles.','Helps synchronize ventricular contraction.',['atrioventricular-bundle','right-ventricle','left-ventricle']);
  entry('small-cardiac-vein','Small cardiac vein','Vein','veins','Vena cardiaca parva','This variable vein follows the right coronary groove and commonly empties into the coronary sinus.','Along the right heart margin and posterior right atrioventricular groove.','Drains part of the right atrium and right ventricle.',['coronary-sinus','right-marginal-artery']);
  entry('anterior-cardiac-veins','Anterior cardiac veins','Veins','veins','Venae anteriores ventriculi dextri','Several small veins cross the anterior right ventricular surface and open directly into the right atrium.','On the front of the right ventricle.','Provide a direct route from the right ventricular myocardium to the right atrium.',['right-ventricle','right-atrium']);
  window.heartStructures = structures;
  const tau = 2*Math.PI;
  const {sin,cos,abs,exp,pow,sqrt} = Math;
  const add = (a,b) => a.map((v,i)=>v+b[i]);
  const sub = (a,b) => a.map((v,i)=>v-b[i]);
  const mul = (a,s) => a.map(v=>v*s);
  const unit = a => mul(a,1/(Math.hypot(...a)||1));
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  function rgb(hex) {return [1,3,5].map(x=>parseInt(hex.slice(x,x+2),16));}
  function hex(c) {return '#'+c.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');}
  const tint=(c,s,d=[0,0,0])=>hex(c.map((v,i)=>v*s+d[i]));
  function curve(keys,t) {
    const u=Math.max(0,Math.min(1,t))*(keys.length-1), i=Math.min(keys.length-2,Math.floor(u)), f=u-i;
    const p0=keys[Math.max(i-1,0)],p1=keys[i],p2=keys[i+1],p3=keys[Math.min(i+2,keys.length-1)];
    return p1.map((v,j)=>.5*((2*v)+(-p0[j]+p2[j])*f+(2*p0[j]-5*v+4*p2[j]-p3[j])*f*f+(-p0[j]+3*v-3*p2[j]+p3[j])*f*f*f));
  }
  // Slightly asymmetric field of myocardium: the apex belongs to the left ventricle.
  const profile=[
    [.56,-1.51,.10,.012,.014],[.49,-1.39,.10,.25,.20],[.39,-1.18,.09,.44,.34],
    [.28,-.96,.06,.59,.45],[.16,-.74,.04,.72,.54],[.065,-.49,.018,.84,.61],
    [.003,-.23,.00,.89,.64],[-.016,.008,-.015,.88,.61],[-.017,.20,-.04,.80,.54],
    [-.022,.31,-.058,.64,.44],[-.006,.34,-.072,.36,.28],[.008,.33,-.08,.045,.05]
  ];
  const groove=t=>1.04+.22*t+.12*sin(8*t)+.050*cos(15*t);
  const normAng=a=>Math.atan2(sin(a),cos(a));
  function surface(t,a,off=0) {
    const [cx,y,cz,rx,rz]=curve(profile,t), sa=sin(a),ca=cos(a);
    const trench=exp(-pow(normAng(a-groove(t))/.095,2))*.035;
    const inferiorFold=exp(-pow(normAng(a-4.18)/.10,2))*.028;
    const envelope=sin(Math.PI*t);
    const irregular=.036*sin(3*a+2.8*t)+.023*cos(2*a-4*t)+.014*sin(5*a-6*t);
    const tissue=.0018*sin(t*77+a*9+.6*sin(3*a))+.002*sin(t*166+a*22);
    const gain=1+irregular-trench-inferiorFold+tissue;
    return [cx+(rx*gain+off)*ca,y+envelope*(.11*ca+.014*sin(3*a+.8))+.015*sin(a-1)*sin(t*Math.PI*.5),cz+(rz*gain+off)*sa];
  }
  function isLeft(t,a) {
    return t<.075 || a<groove(t) || a>4.20+.07*cos(4*t);
  }
  function myocardium(g) {
    const rows=54, cols=90, vertices=[],colors=[], lv=[],rv=[];
    for(let i=0;i<=rows;i++) {
      const t=i/rows;
      for(let j=0;j<=cols;j++) {
        const a=j/cols*tau,p=surface(t,a),left=isLeft(t,a), [x,y,z]=p;
        const field=sin(6*x+9*y+4*z)*sin(13*x-8*z)+.52*sin(18*x-12*y+9*z);
        const phase=54*t+7*a+1.2*sin(6*t+a)+.4*cos(5*a);
        const fiber=pow(.5+.5*cos(phase*2),8)*.043+pow(.5+.5*cos(phase*3.68+2*t),10)*.017;
        const fold=exp(-pow(normAng(a-groove(t))/.15,2))*.07;
        const worn=.5+.5*sin(3.2*a-4.1*t);
        const c=left?[159,66,69]:[175,75,73];
        vertices.push(p); colors.push(tint(c,.958+.027*field+fiber-fold,[5*worn,5*worn,3*worn]));
      }
    }
    for(let i=0;i<rows;i++)for(let j=0;j<cols;j++) {
      const a=i*(cols+1)+j, k=a+cols+1;
      const group=isLeft((i+.5)/rows,(j+.5)/cols*tau)?lv:rv;
      group.push([a,k,k+1],[a,k+1,a+1]);
    }
    g.mesh('left-ventricle','tissue','#9d4348',vertices,lv,{vertexColors:colors});
    g.mesh('right-ventricle','tissue','#ab4d4c',vertices,rv,{vertexColors:colors});
  }
  // Deterministic lobulated atria with broad attachment surfaces and auricular folds.
  function atrial(g,id,center,radii,color,ear,flip) {
    const vertices=[],faces=[],colors=[],base=rgb(color),rows=ear?19:24,cols=ear?37:44;
    for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++) {
      const lat=-Math.PI/2+i*Math.PI/rows, a=j*tau/cols;
      const h=cos(lat),k=sin(lat),ca=cos(a),sa=sin(a), x=h*ca,y=k,z=h*sa;
      const ridge=ear?.053*sin(14*x+2.6*y+cos(5*y))*sin(2.5*z+.5):.018*sin(8*x+2*z)*cos(5*y);
      const warp=1+.075*sin(3*a+.5)*h*h+.038*cos(3.4*y+2*x)+ridge;
      const p=[center[0]+radii[0]*(x*warp+(ear?-.06: .05)*y*y),center[1]+radii[1]*(y*warp+(ear?-.32*flip*x+.14*x*x:.10*x)),center[2]+radii[2]*z*warp+(ear?.04*flip*x:.02*y)];
      vertices.push(p);
      const wrinkle=ear?.065*sin(14*x+2.6*y+cos(5*y)):.024*cos(15*x+7*y);
      colors.push(tint(base,1+wrinkle+.045*sin(5*x+3*z-1)*cos(6*y)));
    }
    for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const v=i*(cols+1)+j,b=v+cols+1;faces.push([v,b,b+1],[v,b+1,v+1]);}
    g.mesh(id,'tissue',color,vertices,faces,{vertexColors:colors});
  }
  // Axially textured tapered vessels, including visibly open, thick-walled cut faces.
  function vessel(g,id,layer,color,keys,radii,{open=false,caps=0,seed=0}={}) {
    const n=Math.max(13,keys.length*5),m=30,v=[],f=[],c=[],base=rgb(color), radiiKeys=radii.map(x=>[x]);
    let lastNormal;
    for(let i=0;i<=n;i++) {
      const t=i/n,p=curve(keys,t), tangent=unit(sub(curve(keys,t+.002),curve(keys,t-.002)));
      let normal;
      if(!lastNormal) normal=unit(cross(tangent,abs(tangent[2])<.75?[0,0,1]:[1,0,0]));
      else normal=unit(cross(cross(tangent,lastNormal),tangent));
      const normal2=unit(cross(tangent,normal));lastNormal=normal;
      const radius=curve(radiiKeys,t)[0];
      for(let j=0;j<=m;j++) {
        const a=j*tau/m,ca=cos(a),sa=sin(a);
        const grain=sin(9*a+6*t+seed)*.004+sin(6*a-2*t)*.008;
        const r=radius*(1+grain+.014*sin(9*t+seed)*sin(3*a));
        v.push(add(p,add(mul(normal,r*ca),mul(normal2,r*.95*sa))));
        const longitudinal=.46*sin(7*a+1.7*t+seed)+.27*sin(3*a-2*t)+.2*cos(17*a+3*t);
        c.push(tint(base,.996+.063*longitudinal+.008*cos(63*t+a)));
      }
    }
    for(let i=0;i<n;i++)for(let j=0;j<m;j++){const a=i*(m+1)+j,b=a+m+1;f.push([a,a+1,b],[a+1,b+1,b]);}
    function end(openAtStart) {
      const t=openAtStart?0:1,off=openAtStart?0:n*(m+1), p=curve(keys,t);
      const tangent=unit(sub(curve(keys,t+.003),curve(keys,t-.003))),r=radii[openAtStart?0:radii.length-1],sign=openAtStart?1:-1;
      let prev=off;
      [[.96,.008,1.18],[.77,.018,1.30],[.73,.07,.67],[.65,.36,.28],[.56,.73,.19]].forEach(([scale,depth,shade],index)=>{
        const cur=v.length;
        for(let j=0;j<=m;j++) {
          const perp=sub(v[off+j],p);
          v.push(add(p,add(mul(perp,scale),mul(tangent,sign*depth*r))));
          c.push(tint(base,shade,index<2?[12,8,6]:[0,0,0]));
        }
        for(let j=0;j<m;j++) {
          const a=prev+j,b=cur+j;
          if(openAtStart)f.push([a,b,a+1],[a+1,b,b+1]);else f.push([a,a+1,b],[a+1,b+1,b]);
        }
        prev=cur;
      });
      const mid=v.length;v.push(add(p,mul(tangent,sign*r*.77)));c.push(tint(base,.15));
      for(let j=0;j<m;j++)f.push(openAtStart?[prev+j,mid,prev+j+1]:[prev+j,prev+j+1,mid]);
    }
    if(open||caps===2)end(false);
    if(caps>0)end(true);
    g.mesh(id,layer,color,v,f,{vertexColors:c});
  }
  // Small epicardial branches hug the irregular ventricular wall at every point.
  function cord(g,id,layer,color,points,radii,sides=8) {
    const v=[],f=[];
    let previous;
    for(let i=0;i<points.length;i++) {
      const p=points[i],next=points[Math.min(points.length-1,i+1)],last=points[Math.max(0,i-1)],tangent=unit(sub(next,last));
      const n=previous?unit(cross(cross(tangent,previous),tangent)):unit(cross(tangent,abs(tangent[2])<.8?[0,0,1]:[0,1,0]));
      const b=unit(cross(tangent,n));previous=n;
      for(let j=0;j<sides;j++) {
        const ang=j*tau/sides,r=typeof radii==='number'?radii:radii[i];
        v.push(add(p,add(mul(n,r*cos(ang)),mul(b,r*sin(ang)))));
      }
    }
    for(let i=0;i<points.length-1;i++)for(let j=0;j<sides;j++) {
      const a=i*sides+j,n=i*sides+(j+1)%sides;f.push([a,n,a+sides],[n,n+sides,a+sides]);
    }
    g.mesh(id,layer,color,v,f);
  }
  function line(g,id,layer,color,fn,r1,r2,{n=20,off=.014,fat=false,wiggle=0}={}) {
    const points=[],radii=[],bed=[],bedR=[];
    for(let i=0;i<=n;i++) {
      const t=i/n,[h,a]=fn(t),w=wiggle*sin(t*11+.5)*sin(Math.PI*t);
      points.push(surface(h,a+w,off));
      const r=r1+(r2-r1)*t;radii.push(r*(1+.045*sin(10*t+.3)));
      if(fat){bed.push(surface(h,a+w,.002));bedR.push(r*(1.55+.22*cos(22*t)+.14*sin(41*t))+.006);}
    }
    if(fat)cord(g,'heart','tissue','#bc8861',bed,bedR,9);
    cord(g,id,layer,color,points,radii,r1>.021?10:7);
  }
  function coronary(g) {
    const art='#d2614e',vein='#56809e',minorArt='#c16255',minorVein='#667c95';
    // Anterior interventricular groove, progressively narrowing toward the apex.
    const lad=t=>[.84-.78*t,groove(.84-.78*t)];
    line(g,'left-anterior-descending','arteries',art,lad,.030,.0045,{n:36,off:.026,fat:true,wiggle:.012});
    line(g,'great-cardiac-vein','veins',vein,t=>{const [h,a]=lad(t);return [h,a-.085-.012*sin(11*t)];},.023,.004,{n:30,off:.023,wiggle:.014});
    const front=[
      [.72,1,-.65,.25],[.56,1,-.87,.28],[.41,1,-.67,.23],[.30,1,-.56,.20],
      [.70,-1,.43,.15],[.54,-1,.46,.21],[.37,-1,.35,.18]
    ];
    front.forEach(([base,side,span,drop],i)=>{
      const angle=groove(base),rad=[.016,.019,.014,.010,.013,.011,.009][i];
      const branch=t=>[base-drop*(.22*t+.78*t*t),angle+span*(.23*t+.77*sin(1.49*t))+.025*sin(8*t)];
      line(g,'left-anterior-descending','arteries',minorArt,branch,rad,.0017,{n:17,wiggle:.021});
      const [h,a]=branch(.53);
      line(g,'left-anterior-descending','arteries','#be6457',t=>[h-.11*t,a+span*.44*t+.045*sin(3*t)],rad*.56,.0011,{n:9,off:.012,wiggle:.025});
      if(side===1&&i%2===0)line(g,'great-cardiac-vein','veins',minorVein,t=>{const [ht,at]=branch(t);return [ht-.049*t,at-.061];},rad*.65,.0017,{n:14,off:.015});
    });
    // The atrioventricular grooves wind around both sides and meet posteriorly.
    const av=(a)=>.744+.030*sin(a-.27)+.016*cos(2*a+1);
    const rightGroove=t=>{const a=1.88+2.38*t;return [av(a),a];};
    const leftGroove=t=>{const a=1.23-3.25*t;return [av(a)+.034,a];};
    line(g,'right-coronary-artery','arteries',art,rightGroove,.031,.020,{n:30,fat:true,off:.023});
    line(g,'circumflex-artery','arteries',art,leftGroove,.026,.013,{n:32,fat:true,off:.021});
    line(g,'great-cardiac-vein','veins',vein,t=>{const [h,a]=leftGroove(t);return [h+.029,a];},.021,.036,{n:28,off:.025});
    line(g,'coronary-sinus','veins','#536e94',t=>{const a=4.49-1.11*t;return [av(a)+.047,a];},.049,.061,{n:23,off:.015});
    const rMarg=t=>[.75-.56*t,2.74-.22*t-.12*sin(4.2*t)];
    line(g,'right-marginal-artery','arteries',art,rMarg,.022,.003,{n:25,fat:true,off:.017});
    [.18,.38,.61].forEach((s,i)=>{
      const [h,a]=rMarg(s);
      line(g,'right-marginal-artery','arteries',minorArt,t=>[h-(.17-i*.02)*t,a-.36*t+.035*sin(5*t)],.012-i*.0015,.0015,{n:13,off:.012});
    });
    [.49,.78].forEach((a,i)=>{
      const curve=t=>[av(a)+.025-(.46-i*.10)*t,a-.22*t+.075*sin(6*t)];
      line(g,'circumflex-artery','arteries',minorArt,curve,.017-i*.003,.002,{n:20,fat:i===0});
      const [h,b]=curve(.43);
      line(g,'circumflex-artery','arteries',minorArt,t=>[h-.18*t,b-.20*t],.009,.002,{n:9});
    });
    line(g,'posterior-interventricular-artery','arteries',art,t=>[.77-.71*t,4.20+.07*cos(4*(.77-.71*t))],.025,.004,{n:26,fat:true,off:.021});
    line(g,'middle-cardiac-vein','veins',vein,t=>[.77-.71*t,4.30+.07*cos(4*(.77-.71*t))],.025,.004,{n:26,off:.021});
    [0,1,2,3,4].forEach(i=>{
      const h=.64-i*.095,s=i%2===0?-1:1;
      line(g,'posterior-interventricular-artery','arteries',minorArt,t=>[h-.20*t,4.19+s*.54*t+.04*sin(7*t)],.013,.002,{n:14,wiggle:.02});
    });
    line(g,'small-cardiac-vein','veins','#63809b',t=>{const [h,a]=rMarg(t);return [h,a+.088+.025*sin(7*t)];},.015,.002,{n:21,off:.016});
    line(g,'small-cardiac-vein','veins','#608096',t=>{const a=2.79+1.52*t;return [av(a)+.033,a];},.013,.024,{n:22,off:.018});
    [.0,.27,.54].forEach((extra,i)=>{
      const start=.48-.032*i,a0=1.83+extra;
      line(g,'anterior-cardiac-veins','veins',minorVein,t=>[start+(.275+i*.018)*t,a0+.24*t+.065*sin(t*5+i)],.002,.012,{n:15,off:.017});
      line(g,'anterior-cardiac-veins','veins',minorVein,t=>[start+.06+.061*t,a0-.12+.22*t],.0016,.005,{n:9,off:.014});
    });
    // Subtle surface fibre bundles suggest the oblique sweep of ventricular muscle.
    for(let j=0;j<34;j++) {
      const front=j%2===0;
      const idx=Math.floor(j/2),h=.19+(idx%8)*.067, a=front?1.46+(idx%3)*.26:5.60+(idx%4)*.24;
      line(g,front?'right-ventricle':'left-ventricle','tissue',front?'#b86561':'#a75a59',
        t=>[h+.041*sin(t*2.3)+.042*t,a+.42*t+.016*cos(t*5+j)],.0021,.00075,{n:9,off:.0015});
    }
    const connect=(id,c,keys,radii)=>{
      const p=[],r=[];
      for(let i=0;i<=15;i++){const t=i/15;p.push(curve(keys,t));r.push(curve(radii.map(a=>[a]),t)[0]);}
      cord(g,id,'arteries',c,p,r,10);
    };
    connect('left-coronary-artery',art,[[-.09,.27,.02],[.07,.24,.14],[.20,.23,.32],surface(.845,1.23,.026)],[.034,.035,.034,.029]);
    connect('right-coronary-artery',art,[[-.24,.26,.08],[-.36,.23,.24],[-.41,.16,.38],surface(rightGroove(0)[0],1.88,.02)],[.032,.033,.032,.029]);
  }

  function valve(g,id,center,radius,leaflets,tilt,atrioventricular) {
    const vertices=[],faces=[],colors=[];
    const [cx,cy,cz]=center;
    const rotate=(x,y,z)=>[cx+x,cy+y*cos(tilt)-z*sin(tilt),cz+y*sin(tilt)+z*cos(tilt)];
    const rim=[],rr=[];
    for(let j=0;j<=45;j++){const a=j*tau/45;rim.push(rotate(radius*cos(a),0,radius*.8*sin(a)));rr.push(.015);}
    g.tube(id,'tissue','#d9b296',rim,rr,{internal:true,sides:7});
    for(let n=0;n<leaflets;n++) {
      const start=vertices.length,uCount=10,vCount=7;
      for(let u=0;u<=uCount;u++)for(let w=0;w<=vCount;w++){
        const along=u/uCount,depth=w/vCount,a=tau*(n+along)/leaflets;
        const boundary=sin(Math.PI*along);
        const factor=1-depth*(.35+.54*boundary),height=-radius*depth*(.17+.37*boundary)*(atrioventricular?1:-1);
        vertices.push(rotate(radius*factor*cos(a),height,radius*.8*factor*sin(a)));
        colors.push(tint([203,166,145],.90+.14*boundary-.09*depth));
      }
      for(let u=0;u<uCount;u++)for(let w=0;w<vCount;w++){const a=start+u*(vCount+1)+w,b=a+vCount+1;faces.push([a,b,b+1],[a,b+1,a+1]);}
    }
    g.mesh(id,'tissue','#d7ad93',vertices,faces,{internal:true,vertexColors:colors});
    g.pin(id,center);
  }
  function internalAnatomy(g) {
    const vertices=[],faces=[],vColors=[],rows=24,cols=24;
    for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
      const t=i/rows,a=j*tau/cols,y=-1.22+1.37*t;
      const w=.024+.45*sin(Math.PI*t*.85),thick=.012+.094*sin(Math.PI*t*.88);
      vertices.push([.45-.42*t+thick*cos(a)+.19*sin(a)*w,y+.039*cos(a)*sin(Math.PI*t),.11-.15*t+w*sin(a)]);
      vColors.push(tint([180,92,95],1+.04*sin(16*t+4*a)));
    }
    for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const v=i*(cols+1)+j,b=v+cols+1;faces.push([v,b,b+1],[v,b+1,v+1]);}
    g.mesh('interventricular-septum','tissue','#b45e61',vertices,faces,{internal:true,vertexColors:vColors});
    g.pin('interventricular-septum',[.18,-.52,.06]);
    const papillary=[
      [[.43,-.79,.17],[.363,-.485,.106],[.284,.040,-.055]],
      [[.47,-.76,-.23],[.382,-.46,-.237],[.320,.02,-.19]],
      [[-.32,-.62,.23],[-.313,-.351,.16],[-.373,-.035,.107]],
      [[-.433,-.48,-.116],[-.402,-.28,-.041],[-.476,-.016,-.042]],
      [[-.12,-.52,.070],[-.182,-.319,.07],[-.309,-.022,.006]]
    ];
    papillary.forEach(([base,tip,edge],i)=>{
      const middle=base.map((v,k)=>v*.57+tip[k]*.43);
      g.tube('papillary-muscles','tissue','#b97371',[base,middle,tip],[.078,.068,.031],{internal:true,sides:11});
      for(let j=0;j<4;j++){
        const e=[edge[0]+(j-1.5)*.045,edge[1]+.009*sin(j),edge[2]+.03*cos(j)];
        const m=tip.map((v,k)=>v*.47+e[k]*.53+(k===2?.009*sin(j+i):0));
        g.tube('chordae-tendineae','tissue','#e4c7a1',[tip,m,e],[.008,.005,.003],{internal:true,sides:6});
      }
    });
    g.pin('papillary-muscles',papillary[0][1]);g.pin('chordae-tendineae',[.33,-.23,.04]);
    g.ellipsoid('sinoatrial-node','tissue','#e7bd71',[-.701,.465,-.114],[.033,.085,.018],{internal:true});
    g.pin('sinoatrial-node',[-.701,.465,-.114]);
    g.ellipsoid('atrioventricular-node','tissue','#e7bd71',[-.176,.076,-.162],[.051,.034,.030],{internal:true});
    g.pin('atrioventricular-node',[-.176,.076,-.162]);
    const trunk=[[-.18,.08,-.16],[-.115,.008,-.13],[-.054,-.100,-.083],[.020,-.20,-.040]];
    g.tube('atrioventricular-bundle','tissue','#e8bf71',trunk,[.022,.022,.020,.018],{internal:true});
    [[-.1,-.39,.075], [.18,-.40,-.08]].forEach((b,i)=>{
      const end=i?[.339,-1.02,-.025]:[.174,-.85,.166];
      g.tube('atrioventricular-bundle','tissue','#dfb273',[trunk[3],b,end],[.018,.016,.012],{internal:true});
      for(let j=0;j<5;j++){
        const f=j/4,d=i?1:-1;
        const mid=[end[0]+d*(.13+.09*f),end[1]+.11+.10*f,end[2]+.13*(f-.5)];
        const tip=[mid[0]+d*(.07+.04*f),mid[1]+.2+.04*cos(j),mid[2]+.12*(f-.5)];
        g.tube('purkinje-fibers','tissue','#e7c784',[end,mid,tip],[.012,.009,.004],{internal:true,sides:7});
        g.tube('purkinje-fibers','tissue','#e7c784',[mid,[tip[0]-.052*d,tip[1]-.034,tip[2]+.076]],[.006,.003],{internal:true,sides:6});
      }
    });
    g.pin('atrioventricular-bundle',trunk[2]);g.pin('purkinje-fibers',[.48,-.82,-.06]);
  }
  window.buildHeart = g => {
    myocardium(g);
    atrial(g,'right-atrium',[-.626,.20,-.003],[.342,.399,.363],'#9b5262',false,1);
    atrial(g,'left-atrium',[.20,.253,-.368],[.54,.32,.30],'#9f5663',false,1);
    atrial(g,'right-atrium',[-.525,.377,.221],[.277,.146,.189],'#b46a73',true,-1);
    atrial(g,'left-atrium',[.603,.259,.165],[.235,.179,.193],'#b36a72',true,1);

    const red='#cd544b',aorta='#c95045',blue='#45779c',caval='#50799c';
    // Larger veins lie behind the ventricular mass. Their cut ends point away from it.
    vessel(g,'inferior-vena-cava','veins',caval,[[-.59,.09,-.15],[-.67,-.16,-.25],[-.72,-.39,-.32],[-.68,-.53,-.39]],[.187,.175,.163,.163],{open:true,seed:4});
    vessel(g,'superior-vena-cava','veins',caval,[[-.63,.23,-.075],[-.651,.48,-.10],[-.647,.69,-.102],[-.626,.90,-.084],[-.643,1.156,-.017]],[.188,.173,.163,.154,.157],{open:true,seed:6});
    // Right and left superior and inferior pulmonary venous openings.
    vessel(g,'pulmonary-veins','veins',red,[[-.045,.248,-.414],[-.40,.28,-.45],[-.75,.342,-.414],[-.94,.41,-.36]],[.105,.092,.097,.105],{open:true,seed:3});
    vessel(g,'pulmonary-veins','veins',red,[[-.04,.10,-.437],[-.36,.090,-.48],[-.69,.105,-.444],[-.85,.116,-.397]],[.095,.090,.089,.088],{open:true,seed:4});
    vessel(g,'pulmonary-veins','veins',red,[[.47,.280,-.434],[.64,.33,-.447],[.805,.399,-.426],[.994,.424,-.351]],[.104,.094,.097,.10],{open:true,seed:8});
    vessel(g,'pulmonary-veins','veins',red,[[.477,.137,-.43],[.670,.136,-.423],[.800,.155,-.40],[.958,.17,-.296]],[.096,.087,.089,.095],{open:true,seed:9});
    // The aortic arch bends leftward and posteriorly into the descending thoracic aorta.
    vessel(g,'aorta','arteries',aorta,[[-.174,.135,-.010],[-.204,.392,.017],[-.245,.705,.024],[-.219,.925,.013],[-.097,1.080,-.042],[.102,1.119,-.138],[.299,1.024,-.261],[.416,.813,-.381],[.448,.558,-.468],[.425,.25,-.505],[.421,-.08,-.519],[.414,-.42,-.528]],[.202,.199,.183,.177,.171,.163,.154,.145,.140,.136,.130,.127],{open:true,seed:1});
    vessel(g,'brachiocephalic-trunk','arteries',red,[[-.16,1.034,-.018],[-.178,1.185,-.004],[-.222,1.319,.008],[-.324,1.478,.046]],[.114,.107,.098,.101],{open:true,seed:3});
    vessel(g,'left-common-carotid','arteries','#c2554c',[[.013,1.102,-.087],[.04,1.234,-.088],[.028,1.378,-.057],[.051,1.557,.004]],[.087,.078,.076,.078],{open:true,seed:9});
    vessel(g,'left-subclavian','arteries',red,[[.215,1.039,-.202],[.291,1.179,-.207],[.341,1.304,-.197],[.439,1.434,-.136]],[.100,.092,.088,.089],{open:true,seed:6});
    // The pulmonary trunk crosses anterior to the ascending aorta before bifurcating.
    vessel(g,'right-pulmonary-artery','arteries',blue,[[.208,.598,.115],[.031,.681,-.075],[-.32,.708,-.194],[-.621,.685,-.245],[-.862,.647,-.215],[-.971,.663,-.156]],[.136,.136,.123,.112,.107,.111],{open:true,seed:2});
    vessel(g,'pulmonary-trunk','arteries','#5689a7',[[-.192,.097,.286],[-.138,.248,.341],[.002,.396,.364],[.129,.534,.291],[.254,.633,.153],[.354,.65,.058]],[.214,.218,.204,.179,.165,.145],{seed:3});
    vessel(g,'left-pulmonary-artery','arteries','#5685a3',[[.242,.617,.167],[.383,.666,.065],[.57,.663,-.006],[.765,.620,-.054],[.948,.619,-.019]],[.152,.146,.131,.121,.121],{open:true,seed:1});
    coronary(g);

    valve(g,'aortic-valve',[-.173,.176,.01],.162,3,.28,false);
    valve(g,'pulmonary-valve',[-.155,.18,.31],.168,3,.36,false);
    valve(g,'tricuspid-valve',[-.42,-.015,.002],.219,3,.32,true);
    valve(g,'mitral-valve',[.265,.045,-.20],.197,2,-.25,true);

    internalAnatomy(g);
    const pins={
      heart:surface(.48,1.65,.025),'left-ventricle':surface(.38,.78,.04),'right-ventricle':surface(.53,1.95,.047),
      'right-atrium':[-.716,.29,.309],'left-atrium':[.413,.32,-.618],
      aorta:[-.235,.82,.195],'superior-vena-cava':[-.638,.91,.065],'inferior-vena-cava':[-.72,-.42,-.252],
      'pulmonary-trunk':[.063,.461,.495],'left-pulmonary-artery':[.764,.649,.058],
      'right-pulmonary-artery':[-.88,.674,-.115],'pulmonary-veins':[.819,.41,-.332],
      'brachiocephalic-trunk':[-.245,1.358,.097],'left-common-carotid':[.034,1.405,.013],'left-subclavian':[.359,1.354,-.092],
      'left-coronary-artery':[.175,.256,.319],'left-anterior-descending':surface(.49,groove(.49),.047),
      'right-coronary-artery':surface(.749,2.53,.04),'right-marginal-artery':surface(.55,2.55,.04),
      'great-cardiac-vein':surface(.59,groove(.59)-.089,.047),'coronary-sinus':surface(.777,3.74,.058),
      'circumflex-artery':surface(.79,.18,.039),'posterior-interventricular-artery':surface(.43,4.17,.04),
      'middle-cardiac-vein':surface(.43,4.285,.04), 'small-cardiac-vein':surface(.52,2.61,.03),'anterior-cardiac-veins':surface(.66,2.25,.03)
    };
    Object.entries(pins).forEach(([id,p])=>g.pin(id,p));
  };
})();
