"""Prepare local display copies of the versioned HRA GLBs and BodyParts3D v4 OBJ archive.
Usage: python prepare-atlas.py INPUT_DIRECTORY DIST_DIRECTORY (requires NumPy).
Keep the publisher files intact. Meshes retain indices and relative positions within each model.
"""
import csv
import gzip
import hashlib
import json
import re
import struct
import sys
import zipfile
from collections import defaultdict
from pathlib import Path

import numpy as np

src, site = map(Path, sys.argv[1:3])
out = site / 'assets/reference'
out.mkdir(exist_ok=True, parents=True)
regions = defaultdict(list)
terms = {}
sources = {}
versions = {'heart':'1.3','blood-vasculature':'1.3','lung':'1.4','trachea':'1.1','main-bronchus':'1.1'}

def hra_meshes(organ):
    version = versions[organ]
    filename = src / (organ + '-male.glb')
    data = filename.read_bytes()
    size = struct.unpack_from('<I', data, 12)[0]
    obj = json.loads(data[20:20+size])
    blob = memoryview(data)[28+size:]
    types = {5121:'u1',5123:'<u2',5125:'<u4',5126:'<f4'}
    def array(index):
        acc = obj['accessors'][index]
        view = obj['bufferViews'][acc['bufferView']]
        dim = {'VEC3':3,'SCALAR':1}[acc['type']]
        dtype=np.dtype(types[acc['componentType']])
        return np.ndarray((acc['count'],dim), dtype=dtype, buffer=blob, offset=view.get('byteOffset',0)+acc.get('byteOffset',0),strides=(view.get('byteStride',dim*dtype.itemsize),dtype.itemsize))
    cross = {r['node_name']:r for r in csv.DictReader((src/(organ+'-male-crosswalk.csv')).open())}
    meta = (src/(organ+'-male-metadata.yaml')).read_text()
    authors = re.findall('fullName: (.+)',meta.split('creators:')[1].split('project_leads:')[0])
    sources[organ] = {'publisher':'HuBMAP / Human Reference Atlas','title':meta.splitlines()[0].split(': ',1)[1],
        'version':'v'+version,'creators':authors,'doi':re.search(r'^doi: (.+)$',meta,re.M)[1].strip(),
        'url':f'https://apps.humanatlas.io/kg-explorer/ref-organ/{organ}-male/v{version}',
        'download':f'https://cdn.humanatlas.io/digital-objects/ref-organ/{organ}-male/v{version}/assets/3d-vh-m-{organ}.glb',
        'sha256':hashlib.sha256(data).hexdigest(),'license':'CC BY 4.0'}
    for node in obj['nodes']:
        # All of the five pinned source files carry their VHM positions in vertices.
        assert not any(k in node for k in ('matrix','translation','rotation','scale'))
        if 'mesh' not in node: continue
        name = node['name']
        for p in obj['meshes'][node['mesh']]['primitives']:
            assert p.get('mode',4)==4
            yield name[5:],array(p['attributes']['POSITION']),array(p['indices']).ravel(),cross.get(name,{}).get('OntologyID','')

def title(raw):
    raw=raw.replace('posetrior','posterior').replace('opthalmic','ophthalmic')
    d={'heart_right_ventricle':'Right ventricle','heart_left_ventricle':'Left ventricle','left_cardiac_atrium':'Left atrium','right_cardiac_atrium':'Right atrium','right_intermediate_bronchus':'Right bronchus intermedius','right_posterior_basal':'Right posterior basal bronchus','bronchus':'Bronchial tree (source composite)','right_posterior_descending_artery':'Posterior interventricular artery','right_marginal_artery':'Right marginal artery','left_marginal_branch':'Left marginal branch','diagonal_branch_of_left_anterior_descending_artery':'Diagonal branch of the LAD (source segment 2)','diagonal_branch_of_anterior_descending_branch_of_left_coronary_artery':'Diagonal branch of the LAD (source segment 1)'}
    if raw in d:return d[raw]
    if 'pulmonary_vein_' in raw:
        _,_,s,l=raw.split('_')
        return {'L':'Left','R':'Right'}[s]+' '+{'sup':'superior','inf':'inferior'}[l]+' pulmonary vein'
    if raw.startswith('papillary_muscle_of_heart_'):return raw.split('_')[-1].capitalize()+' papillary muscle'
    if raw.endswith(('_L','_R')):raw={'L':'left','R':'right'}[raw[-1]]+'_'+raw[:-2]
    raw=raw.replace('brachiocephalic_artery_a','brachiocephalic_trunk').replace('_artery_a','_artery').replace('vena_cava_a','vena_cava')
    return raw.replace('_',' ').capitalize()

def add(scene,tid,name,layer,v,idx,origin,node,oid):
    assert np.isfinite(v).all() and idx.min()>=0 and idx.max()<len(v) and idx.size%3==0
    regions[scene].append((tid,v,idx))
    key=(scene,tid)
    if key not in terms: terms[key]=dict(id=tid,name=name,layer=layer,origin=origin,ontology=oid,nodes=[])
    terms[key]['nodes'].append(node)

for organ in versions:
    for raw,v,idx,oid in hra_meshes(organ):
        tid='vh-'+raw.replace('_','-').lower()
        group='ref-heart' if organ=='heart' else 'ref-lungs'
        name=title(raw)
        if raw.startswith('papillary_muscle_of_heart_'):
            source_rows=csv.DictReader((src/'heart-male-crosswalk.csv').open())
            name=next(r['label'] for r in source_rows if r['node_name']=='VH_M_'+raw)
        unresolved={'left_posetrior_basal_bronchopulmonary_segment','right_apical_bronchus','right_anterior_basal_bronchus'}
        if raw in unresolved:oid=''

        if organ=='blood-vasculature':
            chosen={'aortic_arch','ascending_aorta','brachiocephalic_artery_a','left_common_carotid_artery_a','left_subclavian_artery_a','superior_vena_cava','inferior_vena_cava_a','great_cardiac_vein','middle_cardiac_vein','anterior_cardiac_vein','coronary_sinus','posterior_vein_of_left_ventricle','small_cardiac_vein','oblique_vein_of_left_atrium','left_anterior_descending_artery','right_marginal_artery','right_posterior_descending_artery','left_coronary_artery','right_coronary_artery','left_marginal_branch'}
            # Only use coronary source labels that can be corroborated by position and course.
            if raw not in chosen and not raw.startswith('pulmonary_'): continue
            group='ref-heart'
        layer='tissue'
        if organ=='blood-vasculature':layer='veins' if any(x in raw for x in ['vein','sinus','vena_cava']) else 'arteries'
        elif organ!='heart' and ('bronchus' in raw or organ in ['main-bronchus','trachea'] or raw=='right_posterior_basal'):layer='airways'
        label='VH_M_'+raw
        add(group,tid,name,layer,v,idx,organ,label,oid)
        if organ=='blood-vasculature' and raw.startswith(('pulmonary_artery_','pulmonary_vein_')):
            add('ref-lungs',tid,name,layer,v,idx,organ,label,oid)

archive=src/'isa_BP3D_4.0_obj_99.zip'
sources['bp']={'publisher':'Database Center for Life Science','title':'BodyParts3D adult male vascular structures','version':'4.0','creators':['Database Center for Life Science'],'doi':'https://doi.org/10.1093/nar/gkn613','url':'https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html','download':'https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip','sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'license':'CC BY 4.0'}
bp=defaultdict(list)
classes=defaultdict(set)
for line in (src/'isa_element_parts.txt').read_text().splitlines()[1:]:
    concept,term,element=line.split('\t')
    classes[element].add(term)
with zipfile.ZipFile(archive) as z:
    for f in z.namelist():
        if not f.endswith('.obj'):continue
        header=z.open(f).read(1300).decode()
        match=re.search(r'# English name : ([^\r\n]+)',header)
        if not match:continue
        name=match[1].strip();n=name.lower()
        if not re.search(r'\b(artery|arteries|aorta|vein|veins|vena cava|venous|coronary sinus|arterial|pulmonary trunk|brachiocephalic trunk|celiac trunk|sagittal sinus|transverse sinus|sigmoid sinus|straight sinus|cavernous sinus|petrosal sinus|basilar sinus)\b',n):continue
        if re.search(r'groove|foramen|sulcus|impression|notch|ligament|nerve|lymph|sinus of valsalva',n):continue
        oid=re.search(r'# Concept ID : ([^\r\n]+)',header)[1]
        fid=Path(f).stem
        # FJ2041 and FJ2044 are abdominal in position; their source FMA class is pulmonary.
        # Withhold this ambiguous label instead of publishing an inferred territory.
        if oid=='FMA8620':continue
        text=z.read(f).decode()
        vertices=re.findall(r'^v (.+)$',text,re.M)
        xyz=np.fromstring(' '.join(vertices),sep=' ',dtype=np.float32).reshape((-1,3))
        faces=re.findall(r'^f (.+)$',text,re.M)
        face_values=np.fromstring(re.sub(r'/[^\s]*','',' '.join(faces)),dtype=np.int32,sep=' ')-1
        assert face_values.size==len(faces)*3
        # Source X increases leftward, Z superiorly, negative Y anteriorly.
        xyz=xyz[:,[0,2,1]].copy();xyz[:,2]*=-1
        layer='veins' if re.search(r'vein|vena cava|venous|sinus',n) else 'arteries'
        bp[(name,oid,layer)].append((xyz,face_values,fid))
for (name,oid,layer),parts in bp.items():
    samples=np.vstack([p[0] for p in parts]);x,y,z=samples.mean(axis=0);n=name.lower()
    if re.search(r'brachiocephalic',n):region='thorax'
    elif re.search(r'penis|pudendal|perineal|rectal|prostatic|vesical|gluteal|obturator',n):region='abdomen'
    elif re.search(r'brachial|interosseous|radial recurrent|cephalic vein|basilic|cubital|radial (vein|artery)|ulnar|palmar|hand|axillary|humeral|subscapular|circumflex scapular|thoracodorsal|antebrachial|metacarpal|digital.*finger',n):region='arm'
    elif re.search(r'femoral|tibial|saphenous|fibular|popliteal|plantar|foot|pedis|metatarsal|circumflex iliac',n):region='leg'
    elif y>1400 and not re.search('brachiocephalic|subclavian',n):region='head'
    elif y<800:region='leg'
    elif y<1090 or re.search('hepatic|portal|renal|gastric|mesenteric|iliac|cystic|gonadal|suprarenal|testicular|splenic|gastroepiploic|celiac',n):region='abdomen'
    elif abs(x)>155:region='arm'
    else:region='thorax'
    for xyz,idx,fid in parts:add('bp-'+region,'bp-'+oid.lower(),name,layer,xyz,idx,'bp',fid,oid)
    inherited=set.intersection(*(classes[fid] for _,_,fid in parts))-{n}
    categories=[x for x in inherited if re.search(r'pulmonary|portal|coronary|systemic (artery|vein)|cerebral|hepatic|renal|segment of aorta|tributary of|branch of|subdivision of',x)]
    terms[('bp-'+region,'bp-'+oid.lower())]['classes']=sorted(categories,key=lambda x:(-len(x),x))[:9]

manifest={};total=0
for scene,pieces in regions.items():
    lo=np.min([v.min(axis=0) for _,v,i in pieces],axis=0)
    hi=np.max([v.max(axis=0) for _,v,i in pieces],axis=0)
    ctr=(lo+hi)*.5
    scale=min(3.10/(hi[1]-lo[1]),2.55/(hi[0]-lo[0]),3.25/(hi[2]-lo[2]))
    buf=bytearray();chunks=[]; records={item:terms[(scene,item)] for item,_,_ in pieces}
    for tid,v,idx in pieces:
        coords=(v-ctr)*scale
        # Quantize to well below source resolution. No triangle reduction.
        q=np.rint(coords*16000).astype('<i2')
        assert np.max(np.abs(coords-q.astype(float)/16000))<.00004
        if len(buf)%4:buf.extend(b'\0'*(4-len(buf)%4))
        pos=len(buf);buf.extend(q.tobytes())
        if len(buf)%4:buf.extend(b'\0'*(4-len(buf)%4))
        offset=len(buf);stride=2 if len(v)<65536 else 4
        buf.extend(idx.astype('<u2' if stride==2 else '<u4').tobytes())
        chunks.append([tid,pos,len(v),offset,len(idx),stride])
    for k in records:
        vs=np.vstack([v for tid,v,_ in pieces if k==tid])
        mid=(vs.max(0)+vs.min(0))/2
        anchor=vs[np.argmin(np.sum((vs-mid)**2,axis=1))]
        records[k]['pin']=np.round((anchor-ctr)*scale,5).tolist()
    output=out/(scene+'.geom.gz')
    output.write_bytes(gzip.compress(bytes(buf),compresslevel=6,mtime=0))
    manifest[scene]={'parts':list(records.values()),'chunks':chunks,'file':'assets/reference/'+output.name,'triangles':sum(len(idx)//3 for _,_,idx in pieces)}
    total+=manifest[scene]['triangles']
    print(scene,len(records),'structures',manifest[scene]['triangles'],'triangles',output.stat().st_size,'bytes',flush=True)
(site/'reference-data.js').write_text('window.atlasSources='+json.dumps(sources,separators=(',',':'))+';\nwindow.atlasMeshes='+json.dumps(manifest,separators=(',',':'))+';\n')
print('Total geometry triangles across views:',total)
