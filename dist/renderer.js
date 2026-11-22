(() => {
  'use strict';

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
  const mix = (x, y, t) => x + (y - x) * t;
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const norm = a => { const l = Math.hypot(...a) || 1; return a.map(v => v / l); };
  const zeroOffset = [0,0,0];
  const palettes = {
    anatomical: null,
    category: {arteries:'#e86550',veins:'#668fcb',airways:'#78b7a2',tissue:'#d89c8e'},
    contrast: {arteries:'#f3a547',veins:'#69bded',airways:'#77d7ac',tissue:'#c698cf'}
  };
  const colorCache = new Map();
  function color(value) {
    if (Array.isArray(value) || ArrayBuffer.isView(value)) {
      const s = Math.max(...value) > 1 ? 1 / 255 : 1;
      return [value[0] * s, value[1] * s, value[2] * s];
    }
    if (colorCache.has(value)) return colorCache.get(value);
    let n = value;
    if (typeof n === 'string') {
      let s = n.replace('#', '');
      if (s.length === 3) s = s.split('').map(c => c + c).join('');
      n = parseInt(s.slice(0, 6), 16);
    }
    if (!Number.isFinite(n)) n = 0xbc6566;
    const v = [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    colorCache.set(value, v);
    return v;
  }
  function cubic(a, b, c, d, t) {
    const u = t * t, v = u * t;
    return b + 0.5 * ((c - a) * t + (2*a - 5*b + 4*c - d) * u + (-a + 3*b - 3*c + d) * v);
  }
  function tubeGeometry(g, id, layer, hex, points, radii, options) {
    if (!points || points.length < 2) return;
    const p = [], r = [];
    points.forEach((v, i) => {
      const last = p[p.length - 1];
      if (last && Math.hypot(...sub(v, last)) < 0.00001) return;
      p.push(v);
      r.push(Math.max(.00012, Number(Array.isArray(radii) || ArrayBuffer.isView(radii) ? radii[Math.min(i, radii.length - 1)] : radii) || .001));
    });
    if (p.length < 2) return;
    const maxR = Math.max(...r);
    const sides = clamp(Math.round(options.sides || (maxR > .08 ? 24 : maxR > .026 ? 14 : maxR > .01 ? 10 : 7)), 4, 64);
    const path = [], radius = [];
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[Math.max(0, i - 1)], b = p[i], c = p[i + 1], d = p[Math.min(p.length - 1, i + 2)];
      const span = Math.hypot(...sub(b, c));
      const steps = clamp(Math.ceil(span / Math.max(.021, Math.min(.1, maxR * 1.1))), 2, p.length > 24 ? 3 : 8);
      for (let j = 0; j < steps; j++) {
        const t = j / steps;
        path.push(b.map((_, k) => cubic(a[k], b[k], c[k], d[k], t)));
        radius.push(mix(r[i], r[i + 1], t));
      }
    }
    path.push(p[p.length - 1]); radius.push(r[r.length - 1]);
    const verts = [], faces = [], tint = [], base = color(hex), ends = [];
    const cos = [], sin = [];
    for (let j = 0; j < sides; j++) { const a = TAU*j/sides; cos.push(Math.cos(a)); sin.push(Math.sin(a)); }
    let axis = null;
    for (let i = 0; i < path.length; i++) {
      const tangent = norm(sub(path[Math.min(path.length - 1, i + 1)], path[Math.max(0, i - 1)]));
      if (!axis) axis = norm(cross(tangent, Math.abs(tangent[1]) < .8 ? [0, 1, 0] : [1, 0, 0]));
      const projection = dot(axis, tangent);
      axis = norm(axis.map((v, k) => v - projection * tangent[k]));
      const other = cross(tangent, axis), center = path[i], rad = radius[i];
      const start = verts.length;
      for (let j = 0; j < sides; j++) {
        verts.push(center.map((v, k) => v + (axis[k]*cos[j] + other[k]*sin[j])*rad));
        tint.push(base);
        if (i) {
          const a = start+j-sides, b = start+(j+1)%sides-sides, c = b+sides, d = a+sides;
          faces.push([a,b,c],[a,c,d]);
        }
      }
      if (i === 0 || i === path.length - 1) ends.push({center, tangent, rad, start, atStart: i === 0});
    }
    for (const end of ends) {
      const {center,tangent,rad,start,atStart} = end;
      const inward = atStart ? 1 : -1;
      const hollow = !!options.hollow;
      const ring = (fraction, inset, shade, rim = false) => {
        const offset=verts.length;
        const c=base.map(v=>clamp(v*shade+(rim?.075:0),0,1));
        for(let j=0;j<sides;j++) {
          verts.push(center.map((v,k)=>v+(verts[start+j][k]-v)*fraction+tangent[k]*inward*inset*rad));
          tint.push(c);
        }
        return offset;
      };
      const join = (a,b) => {
        for(let j=0;j<sides;j++) {
          const k=(j+1)%sides;
          if(atStart) faces.push([a+k,a+j,b+j],[a+k,b+j,b+k]);
          else faces.push([a+j,a+k,b+j],[b+j,a+k,b+k]);
        }
      };
      let bottom = ring(1,0,hollow ? 1.10 : .8,hollow);
      if(hollow) {
        const lip=ring(.76,0,1.04,true);
        join(bottom,lip);
        const throat=ring(.715,.36,.38);
        join(lip,throat);
        bottom=ring(.65,.98,.16);
        join(throat,bottom);
      }
      const cap=verts.length;
      verts.push(center.map((v,k)=>v+tangent[k]*inward*(hollow ? 1.02 : 0)*rad));
      tint.push(base.map(a=>a*(hollow ? .10 : .78)));
      for(let j=0;j<sides;j++) {
        const k=(j+1)%sides;
        faces.push(atStart ? [bottom+k,bottom+j,cap] : [bottom+j,bottom+k,cap]);
      }
    }
    g.mesh(id,layer,hex,verts,faces,{...options,vertexColors:tint});
  }
  function ellipsoidGeometry(g,id,layer,hex,center,r,options) {
    const longest = Math.max(...r);
    const slices = options.sides || (longest > .42 ? 40 : longest > .14 ? 28 : longest > .065 ? 18 : 12);
    const stacks = Math.max(6, Math.ceil(slices / 2));
    const v = [[center[0],center[1]+r[1],center[2]]], f = [];
    for(let i=1;i<stacks;i++) {
      const theta=Math.PI*i/stacks, s=Math.sin(theta), c=Math.cos(theta);
      for(let j=0;j<slices;j++) {
        const a=TAU*j/slices;
        v.push([center[0]+r[0]*s*Math.cos(a), center[1]+r[1]*c, center[2]+r[2]*s*Math.sin(a)]);
      }
    }
    const south=v.length;v.push([center[0],center[1]-r[1],center[2]]);
    for(let j=0;j<slices;j++) {
      const k=(j+1)%slices; f.push([0,1+k,1+j]);
      for(let i=0;i<stacks-2;i++) {
        const a=1+i*slices+j,b=1+i*slices+k;
        f.push([a,b,a+slices],[b,b+slices,a+slices]);
      }
      const last=1+(stacks-2)*slices;f.push([last+j,last+k,south]);
    }
    g.mesh(id,layer,hex,v,f,options);
  }

  class Scene {
    constructor(builder) {
      this.parts=[]; this.pins=new Map(); this.bounds=new Map();
      this.shells=new Set(); this.internal=new Set(); this.layers=new Map(); this.groups=new Map();
      builder({
        mesh:this.mesh.bind(this),
        tube:(id,l,c,p,r,o={})=>tubeGeometry(this,id,l,c,p,r,o),
        ellipsoid:(id,l,c,p,r,o={})=>ellipsoidGeometry(this,id,l,c,p,r,o),
        pin:(id,p)=>this.pins.set(id,p)
      });
      this.pack();
      this.separation=new Map();
      for(const [id,b] of this.bounds){
        const mid=[0,1,2].map(k=>(b[k]+b[k+3])*.5);
        const length=Math.hypot(...mid);
        // Move every chunk and label of a named structure by one rigid translation.
        const factor=.74/Math.max(.55,length);
        this.separation.set(id,mid.map(x=>x*factor));
      }
    }
    mesh(id,layer,hex,vertices,faces,options={}) {
      if(!vertices?.length || !faces?.length) return;
      const packed=ArrayBuffer.isView(vertices);
      const n=packed?vertices.length/3:vertices.length, data=new Float32Array(n*9), base=color(hex);
      let b=this.bounds.get(id);
      if (!b) { b=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity]; this.bounds.set(id,b); }
      for(let i=0;i<n;i++) {
        const v=vertices[i], offset=i*9;
        const c=options.vertexColors?.[i] != null ? color(options.vertexColors[i]) : base;
        for(let k=0;k<3;k++) {
          const value=packed?vertices[i*3+k]:v[k];
          data[offset+k]=value; data[offset+6+k]=c[k];
          b[k]=Math.min(b[k],value); b[k+3]=Math.max(b[k+3],value);
        }
      }
      // Store area-weighted smooth normals once in object coordinates.
      const indexType=n>65535 ? Uint32Array : Uint16Array;
      const faceCount=packed?faces.length/3:faces.length;
      const idx=new indexType(faceCount*3);
      let count=0;
      for(let i=0;i<faceCount;i++) {
        const ia=packed?faces[3*i]:faces[i][0], ib=packed?faces[3*i+1]:faces[i][1], ic=packed?faces[3*i+2]:faces[i][2];
        if(ia>=n || ib>=n || ic>=n) continue;
        const a=ia*9,b=ib*9,c=ic*9;
        const ux=data[b]-data[a],uy=data[b+1]-data[a+1],uz=data[b+2]-data[a+2];
        const vx=data[c]-data[a],vy=data[c+1]-data[a+1],vz=data[c+2]-data[a+2];
        const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;
        for(const p of [a,b,c]){data[p+3]+=nx;data[p+4]+=ny;data[p+5]+=nz;}
        idx[count++]=ia;idx[count++]=ib;idx[count++]=ic;
      }
      for(let i=0;i<n;i++) {
        const o=i*9+3, l=Math.hypot(data[o],data[o+1],data[o+2]) || 1;
        data[o]/=l;data[o+1]/=l;data[o+2]/=l;
      }
      this.layers.set(id,layer);
      if(options.internal)this.internal.add(id);
      if(options.shell)this.shells.add(id);
      const muscle=layer==='tissue' && /heart|atrium|atrial|auricle|ventric|myocardi|septum|apex|papillary/.test(id);
      const mat=muscle?2:layer==='tissue'?1:0;
      const alpha=clamp(options.opacity??1,0,1), internal=!!options.internal;
      const key=[id,layer,alpha,internal,mat].join('|');
      let group=this.groups.get(key);
      if(!group){group={id,layer,alpha,internal,mat,chunks:[]};this.groups.set(key,group);}
      group.chunks.push({data,idx:count===idx.length?idx:idx.slice(0,count)});
    }
    pack() {
      for(const group of this.groups.values()) {
        let chunks=[], verts=0, indices=0;
        const flush=()=>{
          if(!verts) return;
          const data=new Float32Array(verts*9), Which=verts>65535?Uint32Array:Uint16Array, idx=new Which(indices);
          let v=0, j=0, cx=0, cy=0, cz=0;
          for(const c of chunks){
            data.set(c.data,v*9);
            for(let i=0;i<c.idx.length;i++)idx[j++]=v+c.idx[i];
            v+=c.data.length/9;
          }
          for(let i=0;i<data.length;i+=9){cx+=data[i];cy+=data[i+1];cz+=data[i+2];}
          const {id,layer,alpha,internal,mat}=group;
          this.parts.push({id,layer,alpha,internal,mat,data,idx,center:[cx/v,cy/v,cz/v]});
          chunks=[]; verts=0; indices=0;
        };
        for(const c of group.chunks) {
          if(verts+c.data.length/9>65535)flush();
          verts+=c.data.length/9; indices+=c.idx.length; chunks.push(c);
        }
        flush();
      }
      this.groups.clear();
      for(const [id,b] of this.bounds) {
        if(!this.pins.has(id))this.pins.set(id,[(b[0]+b[3])*.5,(b[1]+b[4])*.5,(b[2]+b[5])*.5]);
      }
    }
  }

  const vertexShader = `
    attribute vec3 position, normal, pigment;
    uniform vec4 angles, framing;
    uniform vec3 offset;
    uniform vec2 shift;
    varying vec3 surface, world, base;
    varying vec3 lightCoord; varying float depth;
    vec3 rotate(vec3 p) {
      float x=angles.x*p.x+angles.y*p.z, z=-angles.y*p.x+angles.x*p.z;
      return vec3(x,angles.z*p.y-angles.w*z,angles.w*p.y+angles.z*z);
    }
    void main() {
      vec3 p=rotate(position+offset);
      lightCoord=vec3(dot(p,vec3(.795,0.,.606)),dot(p,vec3(.406,.741,-.533)),dot(p,vec3(-.45,.67,.59)));
      surface=rotate(normal); world=position; base=pigment;depth=p.z;
      gl_Position=vec4(p.xy*framing.xy+shift,-p.z*.20,1.);
    }`;
  const fragmentShader = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
    #else
      precision mediump float;
    #endif
    varying vec3 surface,world,base;
    varying vec3 lightCoord; varying float depth;
    uniform vec4 material, tint;
    uniform sampler2D shadowTex;
    float blocked(vec2 uv,float depth,float bias){
      vec2 channels=texture2D(shadowTex,uv).rg;
      float closest=(channels.r+channels.g/255.)*6.-3.;
      return smoothstep(bias,bias+.026,closest-depth);
    }
    float hash(vec3 p){
      p=fract(p*.1031);p+=dot(p,p.yzx+33.33);
      return fract((p.x+p.y)*p.z);
    }
    float noise3(vec3 x) {
      vec3 i=floor(x),f=fract(x); f=f*f*(3.-2.*f);
      return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                 mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
    }
    void main(){
      vec3 n=normalize(surface); if(n.z<0.) n=-n;
      vec3 light=vec3(-.45,.67,.59);
      float diffuse=max(dot(n,light),0.), fill=max(dot(n,vec3(.75,-.15,.55)),0.);
      float rim=pow(1.-abs(n.z),3.);
      float lob=noise3(world*3.7), patch=noise3(world*13.);
      float grain=noise3(world*92.);
      float pattern=.985 + .095*(patch-.5) + .06*(lob-.5) + .038*(grain-.5);
      float gloss=.14, sharp=30.;
      if(material.y>1.5){
        float bend=world.y*.59+world.x*.64+world.z*.46+sin(world.y*3.+world.x*2.)*.10+(lob-.5)*.08;
        float fiber=sin(bend*171.+2.5*sin(world.x*7.+world.y*4.)+patch*2.7);
        float stria=pow(max(0.,fiber),4.);
        pattern+=.085*(lob-.5) + .095*(patch-.5) - .055*stria + .025*(grain-.5);
        gloss=.112;sharp=23.;
      } else if(material.y>.5){pattern+=.085*(patch-.5);gloss=.085;sharp=24.;}
      float spec=pow(max(0.,dot(n,vec3(-.255,.38,.889))),sharp);
      float sheen=pow(max(0.,dot(n,vec3(.56,.38,.735))),20.);
      vec2 uv=lightCoord.xy*.225+.5;
      float bias=.008+.022*(1.-diffuse);
      vec2 dx=vec2(.0029,0.),dy=dx.yx;
      float occlusion=.25*blocked(uv,lightCoord.z,bias);
      occlusion+=.125*(blocked(uv+dx,lightCoord.z,bias)+blocked(uv-dx,lightCoord.z,bias)+blocked(uv+dy,lightCoord.z,bias)+blocked(uv-dy,lightCoord.z,bias));
      occlusion+=.0625*(blocked(uv+dx+dy,lightCoord.z,bias)+blocked(uv-dx+dy,lightCoord.z,bias)+blocked(uv+dx-dy,lightCoord.z,bias)+blocked(uv-dx-dy,lightCoord.z,bias));
      float visibility=1.-occlusion*.69;
      vec3 illumination=vec3(.375,.355,.385)+diffuse*visibility*vec3(.91,.85,.84)+fill*vec3(.107,.15,.20);
      illumination*=1.-.10*occlusion;spec*=visibility;
      vec3 pigmentColor=mix(base,tint.rgb*(.42+.96*dot(base,vec3(.299,.587,.114))),tint.a);
      vec3 c=pigmentColor*illumination*pattern*(1.+clamp(depth,-1.3,1.3)*.045);
      c+=spec*gloss*vec3(1.,.86,.82)+sheen*.033*vec3(.65,.81,1.)+rim*.045*vec3(.66,.74,.83);
      c+=material.z*(pigmentColor*.09+vec3(.015,.009,0.));
      gl_FragColor=vec4(clamp(c,0.,1.),material.x);
    }`;

  const shadowVS=`
    attribute vec3 position;
    uniform vec4 angles;
    uniform vec3 offset;
    varying float altitude;
    void main(){
      vec3 q=position+offset;
      float x=angles.x*q.x+angles.y*q.z,z=-angles.y*q.x+angles.x*q.z;
      vec3 p=vec3(x,angles.z*q.y-angles.w*z,angles.w*q.y+angles.z*z);
      altitude=dot(p,vec3(-.45,.67,.59));
      gl_Position=vec4(.45*dot(p,vec3(.795,0.,.606)),.45*dot(p,vec3(.406,.741,-.533)),-altitude/3.,1.);
    }`;
  const shadowFS=`
    #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
    #else
      precision mediump float;
    #endif
    varying float altitude;
    void main(){float v=clamp((altitude+3.)/6.,0.,1.)*255.;gl_FragColor=vec4(floor(v)/255.,fract(v),0.,1.);}`;
  function compileProgram(gl,vs=vertexShader,fs=fragmentShader) {
    const make=(kind,source)=>{
      const sh=gl.createShader(kind);gl.shaderSource(sh,source);gl.compileShader(sh);
      if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));
      return sh;
    };
    const v=make(gl.VERTEX_SHADER,vs),f=make(gl.FRAGMENT_SHADER,fs);
    const p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);
    gl.deleteShader(v);gl.deleteShader(f);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));
    return p;
  }
  class GLPainter {
    constructor(canvas) {
      const options={alpha:true,antialias:true,premultipliedAlpha:true,depth:true,stencil:false,preserveDrawingBuffer:false};
      const gl=canvas.getContext('webgl',options)||canvas.getContext('experimental-webgl',options);
      if(!gl)throw new Error('WebGL unavailable');
      this.gl=gl;this.program=compileProgram(gl);gl.useProgram(this.program);
      this.uint=gl.getExtension('OES_element_index_uint');
      this.attrs={};
      for(const key of ['position','normal','pigment']) {
        this.attrs[key]=gl.getAttribLocation(this.program,key);gl.enableVertexAttribArray(this.attrs[key]);
      }
      this.uni={};
      for(const key of ['framing','angles','shift','material','offset','tint'])this.uni[key]=gl.getUniformLocation(this.program,key);
      this.shadowProgram=compileProgram(gl,shadowVS,shadowFS);
      this.shadowPos=gl.getAttribLocation(this.shadowProgram,'position');
      this.shadowAngles=gl.getUniformLocation(this.shadowProgram,'angles');
      this.shadowOffset=gl.getUniformLocation(this.shadowProgram,'offset');
      this.shadowTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.shadowTexture);
      this.shadowSize=512;
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,this.shadowSize,this.shadowSize,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
      for(const p of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,p,gl.NEAREST);
      for(const p of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,p,gl.CLAMP_TO_EDGE);
      this.shadowTarget=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,this.shadowTarget);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,this.shadowTexture,0);
      this.shadowDepth=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,this.shadowDepth);
      gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,this.shadowSize,this.shadowSize);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,this.shadowDepth);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);
      gl.uniform1i(gl.getUniformLocation(this.program,'shadowTex'),0);
      this.buffers=new Map();gl.clearColor(0,0,0,0);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
      gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
    }
    dispose() {
      this.clearBuffers();
      const gl=this.gl;
      gl.deleteTexture(this.shadowTexture);gl.deleteRenderbuffer(this.shadowDepth);gl.deleteFramebuffer(this.shadowTarget);
      gl.deleteProgram(this.program);gl.deleteProgram(this.shadowProgram);
    }
    clearBuffers() {
      for(const v of this.buffers.values()){this.gl.deleteBuffer(v.vertex);this.gl.deleteBuffer(v.index);}
      this.buffers.clear();
    }
    buffersFor(part) {
      if(this.buffers.has(part))return this.buffers.get(part);
      const gl=this.gl, vertex=gl.createBuffer(), index=gl.createBuffer();
      let data=part.data,idx=part.idx,arrays=false;
      if(idx instanceof Uint32Array && !this.uint) {
        const unpacked=new Float32Array(idx.length*9);
        for(let i=0;i<idx.length;i++)unpacked.set(data.subarray(idx[i]*9,idx[i]*9+9),i*9);
        data=unpacked;arrays=true;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER,vertex);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index);
      if(!arrays)gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,idx,gl.STATIC_DRAW);
      const v={vertex,index,count:idx.length,type:idx instanceof Uint32Array?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT,arrays};
      this.buffers.set(part,v);return v;
    }
    draw(rows,f,w,h) {
      const gl=this.gl;
      gl.useProgram(this.shadowProgram);
      for(const a of Object.values(this.attrs))gl.disableVertexAttribArray(a);
      gl.enableVertexAttribArray(this.shadowPos);
      gl.bindFramebuffer(gl.FRAMEBUFFER,this.shadowTarget);gl.viewport(0,0,this.shadowSize,this.shadowSize);
      gl.bindTexture(gl.TEXTURE_2D,null);gl.disable(gl.BLEND);gl.depthMask(true);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.uniform4f(this.shadowAngles,f.cy,f.sy,f.cp,f.sp);
      for(const {part,alpha} of rows) {
        if(alpha<.78)continue;
        const b=this.buffersFor(part);
        gl.bindBuffer(gl.ARRAY_BUFFER,b.vertex);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,b.index);
        gl.uniform3fv(this.shadowOffset,part.offset||zeroOffset);
        gl.vertexAttribPointer(this.shadowPos,3,gl.FLOAT,false,36,0);
        if(b.arrays)gl.drawArrays(gl.TRIANGLES,0,b.count);else gl.drawElements(gl.TRIANGLES,b.count,b.type,0);
      }
      gl.disableVertexAttribArray(this.shadowPos);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.useProgram(this.program);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.shadowTexture);
      for(const a of Object.values(this.attrs))gl.enableVertexAttribArray(a);
      gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);gl.depthMask(true);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.uniform4f(this.uni.angles,f.cy,f.sy,f.cp,f.sp);
      gl.uniform4f(this.uni.framing,2*f.scale/w,2*f.scale/h,0,0);
      gl.uniform2f(this.uni.shift,f.panX*2/w,-f.panY*2/h);
      let blend=null;
      for(const {part,alpha,selected} of rows) {
        const transparent=alpha<.995;
        if(blend!==transparent) {
          blend=transparent;
          if(blend)gl.enable(gl.BLEND);else gl.disable(gl.BLEND);
          gl.depthMask(!blend);
        }
        const b=this.buffersFor(part);
        gl.bindBuffer(gl.ARRAY_BUFFER,b.vertex);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,b.index);
        gl.vertexAttribPointer(this.attrs.position,3,gl.FLOAT,false,36,0);
        gl.vertexAttribPointer(this.attrs.normal,3,gl.FLOAT,false,36,12);
        gl.vertexAttribPointer(this.attrs.pigment,3,gl.FLOAT,false,36,24);
        const tint=part.tint||zeroOffset;
        gl.uniform3fv(this.uni.offset,part.offset||zeroOffset);gl.uniform4f(this.uni.tint,tint[0],tint[1],tint[2],part.tint?1:0);
        gl.uniform4f(this.uni.material,alpha,part.mat,selected?1:0,0);
        if(b.arrays)gl.drawArrays(gl.TRIANGLES,0,b.count);else gl.drawElements(gl.TRIANGLES,b.count,b.type,0);
      }
      gl.depthMask(true);
    }
  }
  function depthAt(v,f) { return f.sp*v[1]+f.cp*(-f.sy*v[0]+f.cy*v[2]); }
  function projectedVertices(part,f,sx,sy,scale) {
    const data=part.data,n=data.length/9;
    if(!part.projected || part.projected.length!==n*3)part.projected=new Float32Array(n*3);
    const dst=part.projected, [ox,oy,oz]=part.offset||zeroOffset;
    for(let i=0,j=0;i<data.length;i+=9,j+=3){
      const x=data[i]+ox,y=data[i+1]+oy,z=data[i+2]+oz,zr=-f.sy*x+f.cy*z;
      dst[j]=sx+scale*(f.cy*x+f.sy*z);
      dst[j+1]=sy-scale*(f.cp*y-f.sp*zr);
      dst[j+2]=f.sp*y+f.cp*zr;
    }
    return dst;
  }
  function textureAtVertices(part) {
    if(part.fabric)return part.fabric;
    const d=part.data, result=new Float32Array(d.length/9);
    for(let i=0,j=0;i<d.length;i+=9,j++) {
      const x=d[i],y=d[i+1],z=d[i+2];
      const patch=Math.sin(x*19.8+y*9.5+z*7.7)*Math.sin(x*5.6-y*17.2+z*13.3);
      let value=.98+.028*patch;
      if(part.mat>0) {
        const lob=Math.sin(y*3.1-x*5.8)*Math.cos(z*4.4-y*2.3);
        value+=.047*lob+.025*patch;
        if(part.mat===2) {
          const bend=y*.59+x*.64+z*.46+Math.sin(y*3+x*2)*.1+lob*.04;
          const fiber=Math.max(0,Math.sin(bend*171+2.5*Math.sin(x*7+y*4)+patch*1.35));
          value-=.047*fiber*fiber*fiber*fiber;
        }
      }
      result[j]=value;
    }
    part.fabric=result;return result;
  }
  function softwareShadows(rows,f) {
    const size=160, scale=size*.225, half=size*.5;
    const depths=new Float32Array(size*size);depths.fill(-Infinity);
    for(const {part,alpha} of rows){
      const src=part.data, idx=part.idx,[ox,oy,oz]=part.offset||zeroOffset;
      const values=part.lightCoords||(part.lightCoords=new Float32Array(src.length/3));
      for(let i=0,j=0;i<src.length;i+=9,j+=3){
        const xx=src[i]+ox,yy=src[i+1]+oy,zz=src[i+2]+oz;
        const x=f.cy*xx+f.sy*zz,zr=-f.sy*xx+f.cy*zz;
        const y=f.cp*yy-f.sp*zr,z=f.sp*yy+f.cp*zr;
        values[j]=half+scale*(x*.795+z*.606);
        values[j+1]=half+scale*(x*.406+y*.741-z*.533);
        values[j+2]=-x*.45+y*.67+z*.59;
      }
      if(alpha<.78)continue;
      for(let i=0;i<idx.length;i+=3){
        const a=idx[i]*3,b=idx[i+1]*3,c=idx[i+2]*3;
        const ax=values[a],ay=values[a+1],bx=values[b],by=values[b+1],cx=values[c],cy=values[c+1];
        const x0=Math.max(0,Math.ceil(Math.min(ax,bx,cx)-.5)),y0=Math.max(0,Math.ceil(Math.min(ay,by,cy)-.5));
        const x1=Math.min(size-1,Math.floor(Math.max(ax,bx,cx)-.5)),y1=Math.min(size-1,Math.floor(Math.max(ay,by,cy)-.5));
        if(x1<x0 || y1<y0)continue;
        const e0=by-cy,e1=cx-bx,e2=cy-ay,e3=ax-cx, det=e0*(ax-cx)+e1*(ay-cy);
        if(Math.abs(det)<.000001)continue;
        const du=e0/det,dv=e2/det,tu=e1/det,tv=e3/det;
        const zc=values[c+2],za=values[a+2]-zc,zb=values[b+2]-zc;
        let us=(e0*(x0+.5-cx)+e1*(y0+.5-cy))/det,vs=(e2*(x0+.5-cx)+e3*(y0+.5-cy))/det;
        for(let y=y0;y<=y1;y++,us+=tu,vs+=tv){
          let u=us,v=vs,k=y*size+x0;
          for(let x=x0;x<=x1;x++,k++,u+=du,v+=dv){
            if(u<0||v<0||u+v>1)continue;
            const z=zc+u*za+v*zb;if(z>depths[k])depths[k]=z;
          }
        }
      }
    }
    return {depths,size};
  }
  function shadeVertices(part,f,selected,shadow) {
    const d=part.data, n=d.length/9;
    if(!part.shades)part.shades=new Uint8ClampedArray(n*3);
    const dst=part.shades, tex=textureAtVertices(part);
    for(let i=0,j=0,k=0;i<d.length;i+=9,j+=3,k++){
      let nx=f.cy*d[i+3]+f.sy*d[i+5], zz=-f.sy*d[i+3]+f.cy*d[i+5];
      let ny=f.cp*d[i+4]-f.sp*zz,nz=f.sp*d[i+4]+f.cp*zz;
      if(nz<0){nx=-nx;ny=-ny;nz=-nz;}
      const key=Math.max(0,-nx*.45+ny*.67+nz*.59),fill=Math.max(0,nx*.75-ny*.15+nz*.55);
      const edge=1-Math.min(1,nz),rim=edge*edge*edge*.045;
      let sp=Math.pow(Math.max(0,-.255*nx+.38*ny+.889*nz),part.mat===2?23:30)*(part.mat===2?.112:part.mat===1?.085:.14);
      const sheen=Math.pow(Math.max(0,.56*nx+.38*ny+.735*nz),20)*.033;
      const depth=part.projected[j+2];
      const t=tex[k]*(1+clamp(depth,-1.3,1.3)*.045);
      const boost=selected?.09:0, coords=part.lightCoords;
      const ix=clamp(Math.floor(coords[j]-.5),0,shadow.size-2),iy=clamp(Math.floor(coords[j+1]-.5),0,shadow.size-2),
            index=iy*shadow.size+ix,bias=.02+(1-key)*.029,z=coords[j+2]+bias;
      let blocked=0;
      blocked+=clamp((shadow.depths[index]-z)*22,0,1);
      blocked+=clamp((shadow.depths[index+1]-z)*22,0,1);
      blocked+=clamp((shadow.depths[index+shadow.size]-z)*22,0,1);
      blocked+=clamp((shadow.depths[index+shadow.size+1]-z)*22,0,1);
      const visibility=1-blocked*.17,contact=1-blocked*.025;
      sp*=visibility;
      const tint=part.tint,lum=.42+.96*(d[i+6]*.299+d[i+7]*.587+d[i+8]*.114);
      const red=tint?tint[0]*lum:d[i+6],green=tint?tint[1]*lum:d[i+7],blue=tint?tint[2]*lum:d[i+8];
      dst[j]=255*(red*((.375+.91*key*visibility+.107*fill)*t*contact+boost)+sp+sheen*.65+rim*.66+(selected?.015:0));
      dst[j+1]=255*(green*((.355+.85*key*visibility+.15*fill)*t*contact+boost)+sp*.86+sheen*.81+rim*.74+(selected?.009:0));
      dst[j+2]=255*(blue*((.385+.84*key*visibility+.20*fill)*t*contact+boost)+sp*.82+sheen+rim*.83);
    }
    return dst;
  }
  class SoftPainter {
    constructor(canvas) {
      this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:true});
      if(!this.ctx)throw new Error('Canvas unavailable');
    }
    clearBuffers() {this.shadowKey=null;}
    draw(rows,f,w,h) {
      const key=[f.cy,f.sy,f.cp,f.sp,f.spread,...rows.map(row=>row.part.id+'/'+row.alpha)].join('|');
      if(key!==this.shadowKey){this.shadow=softwareShadows(rows,f);this.shadowKey=key;}
      const W=this.canvas.width,H=this.canvas.height,dpr=W/w;
      if(!this.frame || this.frame.width!==W || this.frame.height!==H){
        this.frame=this.ctx.createImageData(W,H);this.depth=new Float32Array(W*H);
      }
      const pix=this.frame.data,zbuffer=this.depth;pix.fill(0);zbuffer.fill(-Infinity);
      const scale=f.scale*dpr,sx=(w*.5+f.panX)*dpr,sy=(h*.5+f.panY)*dpr;
      for(const {part,alpha,selected} of rows) {
        const v=projectedVertices(part,f,sx,sy,scale),c=shadeVertices(part,f,selected,this.shadow),ind=part.idx;
        for(let k=0;k<ind.length;k+=3) {
          const a=ind[k]*3,b=ind[k+1]*3,d=ind[k+2]*3;
          const ax=v[a],ay=v[a+1],bx=v[b],by=v[b+1],cx=v[d],cy=v[d+1];
          const x0=Math.max(0,Math.ceil(Math.min(ax,bx,cx)-.5)),y0=Math.max(0,Math.ceil(Math.min(ay,by,cy)-.5));
          const x1=Math.min(W-1,Math.floor(Math.max(ax,bx,cx)-.5)),y1=Math.min(H-1,Math.floor(Math.max(ay,by,cy)-.5));
          if(x1<x0 || y1<y0)continue;
          const e0=by-cy,e1=cx-bx,e2=cy-ay,e3=ax-cx, area=e0*(ax-cx)+e1*(ay-cy);
          if(Math.abs(area)<.000001)continue;
          const inv=1/area,du=e0*inv,dv=e2*inv,tu=e1*inv,tv=e3*inv;
          const az=v[a+2],bz=v[b+2],cz=v[d+2], za=az-cz,zb=bz-cz;
          const r0=c[d],g0=c[d+1],b0=c[d+2];
          const ra=c[a]-r0,rb=c[b]-r0,ga=c[a+1]-g0,gb=c[b+1]-g0,ba=c[a+2]-b0,bb=c[b+2]-b0;
          let us=(e0*(x0+.5-cx)+e1*(y0+.5-cy))*inv, vs=(e2*(x0+.5-cx)+e3*(y0+.5-cy))*inv;
          for(let y=y0;y<=y1;y++,us+=tu,vs+=tv){
            let u=us,vv=vs,p=y*W+x0;
            for(let x=x0;x<=x1;x++,p++,u+=du,vv+=dv) {
              if(u<-.00001 || vv<-.00001 || u+vv>1.00001)continue;
              const z=cz+za*u+zb*vv;
              if(z<zbuffer[p])continue;
              const j=p*4,grain=part.mat ? (((x*19 ^ y*43)&7)-3)*.22 : 0;
              const red=r0+ra*u+rb*vv+grain,green=g0+ga*u+gb*vv+grain,blue=b0+ba*u+bb*vv+grain;
              if(alpha>=.995) {
                zbuffer[p]=z;pix[j]=red;pix[j+1]=green;pix[j+2]=blue;pix[j+3]=255;
              } else {
                const under=pix[j+3]/255*(1-alpha),total=alpha+under,old=under/total,s=alpha/total;
                pix[j]=pix[j]*old+red*s;pix[j+1]=pix[j+1]*old+green*s;pix[j+2]=pix[j+2]*old+blue*s;pix[j+3]=total*255;
              }
            }
          }
        }
      }
      this.ctx.putImageData(this.frame,0,0);
    }
  }
  function acquirePainter(canvas) {
    try { return new GLPainter(canvas); }
    catch(error) {
      // Shader/driver initialization may already have claimed the canvas context type.
      if(canvas.getContext('2d'))return new SoftPainter(canvas);
      const copy=document.createElement('canvas');
      copy.style.cssText='width:100%;height:100%;display:block';
      copy.className=canvas.className;
      copy.setAttribute('aria-hidden','true');
      canvas.before(copy);
      canvas.style.position='absolute';canvas.style.inset='0';canvas.style.opacity='0';
      return new SoftPainter(copy);
    }
  }
  const views={
    anterior:[0,0], front:[0,0], posterior:[180,0], back:[180,0],
    'left lateral':[-90,0], left:[-90,0], 'right lateral':[90,0],right:[90,0],
    superior:[0,88], inferior:[0,-88]
  };
  const defaultLayers={tissue:true,arteries:true,veins:true,airways:true};
  class AtlasViewer {
    constructor(canvas,options={}) {
      this.canvas=canvas;this.options=options;this.painter=acquirePainter(canvas);
      this.isSoftware=this.painter instanceof SoftPainter;
      this.cache=new WeakMap();this.layers={...defaultLayers};this.points=new Map();
      this.yaw=0;this.pitch=0;this.zoom=1;this.panX=0;this.panY=0;
      this.dragMode=false;this.autoRotate=false;this.selected=null;this.scene=null;
      this.opacity=1;this.spread=0;this.palette='anatomical';this.reveal=false;this.superficialIds=new Set();
      this.raf=0;this.lastFrame=0;this.interacting=false;this.destroyed=false;
      this.events=new AbortController();
      canvas.style.touchAction='none';
      this.bindInput();
      if(typeof ResizeObserver!=='undefined') {
        this.observer=new ResizeObserver(()=>this.requestDraw());this.observer.observe(canvas);
      }else window.addEventListener('resize',()=>this.requestDraw(),{signal:this.events.signal});
      canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.contextLost=true;},{signal:this.events.signal});
      canvas.addEventListener('webglcontextrestored',()=>{this.contextLost=false;this.painter=new GLPainter(canvas);this.requestDraw();},{signal:this.events.signal});
      this.requestDraw();
    }
    setScene(builder) {
      if(typeof builder!=='function')return;
      this.painter.clearBuffers();
      if(!this.cache.has(builder))this.cache.set(builder,new Scene(builder));
      this.scene=this.cache.get(builder);this.selected=null;this.superficialIds=new Set();
      this.reset();
    }
    setSpread(value) {if(Number.isFinite(value)){this.spread=clamp(value,0,1);this.requestDraw();}}
    setTissueOpacity(value) {if(Number.isFinite(value)){this.opacity=clamp(value,0,1);this.requestDraw();}}
    setPalette(value) {if(Object.hasOwn(palettes,value)){this.palette=value;this.requestDraw();}}
    setDepthMode(value) {this.reveal=value==='deep';this.requestDraw();}
    offsetFor(id) {
      const dir=this.scene?.separation.get(id);
      return this.spread && !this.isolated && dir ? dir.map(n=>n*this.spread) : zeroOffset;
    }
    setLayers(layers) {Object.assign(this.layers,layers);this.requestDraw();}
    select(id) {
      if (this.selected!==id && this.isolated) this.isolate(false);
      this.selected=id;this.requestDraw();
    }
    isolate(enabled) {
      this.isolated=!!enabled;
      this.pivot=null;
      this.panX=0;this.panY=0;this.zoom=1;
      const box=this.scene?.bounds.get(this.selected);
      if(this.isolated && box) {
        this.pivot=[0,1,2].map(i=>(box[i]+box[i+3])/2);
        const span=Math.max(box[3]-box[0],box[4]-box[1],box[5]-box[2]);
        this.zoom=clamp(2.5/Math.max(.045,span),.8,55);
      }
      this.requestDraw();
    }
    zoomBy(factor) {if(Number.isFinite(factor)&&factor>0)this.zoom=clamp(this.zoom*factor,.55,55);this.requestDraw();}
    rotateBy(dx,dy=0) {
      this.yaw=(this.yaw+dx)%360;this.pitch=clamp(this.pitch+dy,-89,89);this.requestDraw();
    }
    reset() {
      this.yaw=0;this.pitch=0;this.zoom=1;this.panX=0;this.panY=0;this.pivot=null;this.isolated=false;
      this.opacity=1;this.spread=0;this.palette='anatomical';this.reveal=false;this.autoRotate=false;this.requestDraw();
    }
    setView(name) {
      const v=views[String(name).trim().toLowerCase()];if(!v)return;
      this.yaw=v[0];this.pitch=v[1];this.autoRotate=false;this.requestDraw();
    }
    getView() {
      const yaw=(this.yaw%360+360)%360;
      if(Math.abs(this.pitch)>77)return this.pitch>0?'Superior':'Inferior';
      if(Math.abs(this.pitch)>12)return 'Oblique';
      for(const [angle,name] of [[0,'Anterior'],[90,'Right lateral'],[180,'Posterior'],[270,'Left lateral'],[360,'Anterior']])
        if(Math.abs(angle-yaw)<12)return name;
      return 'Oblique';
    }
    setAutoRotate(active) {this.autoRotate=!!active;this.lastFrame=0;this.requestDraw();}
    setPanMode(active) {this.dragMode=!!active;}
    size() {
      const box=this.canvas.getBoundingClientRect();
      return {w:box.width,h:box.height};
    }
    frame(w,h) {
      const cy=Math.cos(this.yaw*DEG),sy=Math.sin(this.yaw*DEG),cp=Math.cos(this.pitch*DEG),sp=Math.sin(this.pitch*DEG);
      const scale=Math.min(h/3.55,w/2.8)*this.zoom/(1+(!this.isolated?this.spread*.36:0));
      const [x,y,z]=this.pivot||[0,0,0];
      return {cy,sy,cp,sp,scale,spread:this.isolated?0:this.spread,panX:this.panX-scale*(cy*x+sy*z),panY:this.panY+scale*(cp*y-sp*(-sy*x+cy*z))};
    }
    project(id) {
      const s=this.scene,anchor=s?.pins.get(id);if(!anchor)return null;
      if(this.isolated && id!==this.selected)return null;
      if(this.reveal && (s.shells.has(id)||this.superficialIds.has(id))&&id!==this.selected)return null;
      const layer=s.layers.get(id);if((layer && this.layers[layer]===false)||(layer==='tissue' && this.opacity===0))return null;
      if(s.internal.has(id)&&!this.reveal&&this.selected!==id)return null;
      const offset=this.offsetFor(id),p=anchor.map((v,i)=>v+offset[i]);
      const {w,h}=this.size(),f=this.frame(w,h),z=-f.sy*p[0]+f.cy*p[2];
      return {x:w*.5+f.panX+f.scale*(f.cy*p[0]+f.sy*p[2]),y:h*.5+f.panY-f.scale*(f.cp*p[1]-f.sp*z)};
    }
    rows(f) {
      if(!this.scene)return [];
      const inner=this.scene.internal.has(this.selected),solid=[],transparent=[];
      for(const part of this.scene.parts) {
        const selected=part.id===this.selected;
        if(this.isolated && !selected)continue;
        if(this.reveal && (this.scene.shells.has(part.id)||this.superficialIds.has(part.id)) && !selected)continue;
        if(this.layers[part.layer]===false || (part.internal&&!selected&&!this.reveal))continue;
        let alpha=part.alpha;
        if(inner&&!selected&&!this.reveal)alpha=Math.min(alpha,part.layer==='tissue'?.12:.23);
        if(this.reveal&&!this.scene.shells.size&&part.layer==='tissue'&&!part.internal&&!selected)alpha=Math.min(alpha,.15);
        if(part.layer==='tissue')alpha*=this.opacity;
        if(alpha<=0)continue;
        part.offset=this.offsetFor(part.id);
        part.tint=palettes[this.palette]?.[part.layer]?color(palettes[this.palette][part.layer]):null;
        const row={part,alpha,selected,depth:depthAt(part.center,f)+depthAt(part.offset,f)};
        (alpha>=.995?solid:transparent).push(row);
      }
      transparent.sort((a,b)=>a.depth-b.depth);
      return solid.concat(transparent);
    }
    pick(x,y) {
      const {w,h}=this.size(),f=this.frame(w,h),cx=w*.5+f.panX,cy=h*.5+f.panY;
      let hit=null,best=-Infinity,transHit=null,transBest=-Infinity;
      for(const {part,alpha} of this.rows(f)){
        const v=projectedVertices(part,f,cx,cy,f.scale),idx=part.idx;
        for(let i=0;i<idx.length;i+=3) {
          const a=idx[i]*3,b=idx[i+1]*3,c=idx[i+2]*3;
          const ax=v[a],ay=v[a+1],bx=v[b],by=v[b+1],ex=v[c],ey=v[c+1];
          if(x<Math.min(ax,bx,ex)||x>Math.max(ax,bx,ex)||y<Math.min(ay,by,ey)||y>Math.max(ay,by,ey))continue;
          const ab=by-ey,ac=ex-bx,bb=ey-ay,bc=ax-ex,det=ab*(ax-ex)+ac*(ay-ey);
          if(Math.abs(det)<.00001)continue;
          const u=(ab*(x-ex)+ac*(y-ey))/det, t=(bb*(x-ex)+bc*(y-ey))/det;
          if(u<0||t<0||u+t>1)continue;
          const z=u*v[a+2]+t*v[b+2]+(1-u-t)*v[c+2];
          if(alpha<.40){if(z>transBest){transHit=part.id;transBest=z;}}
          else if(z>best){best=z;hit=part.id;}
        }
      }
      return hit||transHit;
    }
    requestDraw() {
      if(this.raf||this.destroyed)return;
      this.raf=requestAnimationFrame(t=>{this.raf=0;this.draw(t);});
    }
    draw(time) {
      if(this.contextLost || this.destroyed)return;
      const {w,h}=this.size();if(w<1||h<1)return;
      if(this.autoRotate && !this.interacting) {
        const dt=this.lastFrame?Math.min(.08,(time-this.lastFrame)/1000):0;
        this.yaw=(this.yaw+13*dt)%360;
      }
      this.lastFrame=time;
      const display=this.painter.canvas||this.canvas;
      let ratio=Math.min(window.devicePixelRatio||1,2);
      if(this.isSoftware) {
        const budget=(this.interacting||this.autoRotate)?330000:1050000;
        ratio=Math.min(ratio,Math.sqrt(budget/(w*h)));
      }
      const ww=Math.max(1,Math.round(w*ratio)),hh=Math.max(1,Math.round(h*ratio));
      if(display.width!==ww||display.height!==hh){display.width=ww;display.height=hh;}
      const f=this.frame(w,h);
      this.painter.draw(this.rows(f),f,w,h);
      this.options.onChange?.(this);
      const settings=[this.reveal,this.opacity,this.spread,this.palette,this.autoRotate,this.isolated].join('|');
      if(this.displaySignature!==settings || this.displayScene!==this.scene){
        this.displaySignature=settings;this.displayScene=this.scene;this.onDisplayChange?.();
      }
      if(this.autoRotate)this.requestDraw();
    }
    bindInput() {
      const c=this.canvas,signal=this.events.signal;
      const get=e=>[e.clientX,e.clientY];
      const pinch=()=> {
        const [a,b]=[...this.points.values()];return {distance:Math.hypot(a[0]-b[0],a[1]-b[1]),x:(a[0]+b[0])*.5,y:(a[1]+b[1])*.5};
      };
      c.addEventListener('pointerdown',e=>{
        if(e.button!==0 && e.button!==1)return;
        if(!this.points.size){this.start=get(e);this.last=this.start;this.moved=false;this.shiftPan=e.shiftKey||e.button===1;}
        this.points.set(e.pointerId,get(e));this.interacting=true;
        if(this.points.size>=2){this.moved=true;this.pinch=pinch();}
        c.setPointerCapture?.(e.pointerId);
      },{signal});
      c.addEventListener('pointermove',e=>{
        if(!this.points.has(e.pointerId))return;
        const p=get(e);this.points.set(e.pointerId,p);
        if(this.points.size>=2){
          const now=pinch(),old=this.pinch||now;
          if(old.distance>.01)this.zoomBy(now.distance/old.distance);
          this.panX+=now.x-old.x;this.panY+=now.y-old.y;this.pinch=now;
        }else {
          if(!this.moved && Math.hypot(p[0]-this.start[0],p[1]-this.start[1])>4)this.moved=true;
          if(!this.moved)return;
          const dx=p[0]-this.last[0],dy=p[1]-this.last[1];
          if(this.dragMode||this.shiftPan){this.panX+=dx;this.panY+=dy;}
          else this.rotateBy(dx*.43,dy*.37);
        }
        this.last=p;this.requestDraw();
      },{signal});
      const release=(e,cancelled)=>{
        if(!this.points.has(e.pointerId))return;
        this.points.delete(e.pointerId);
        if(this.points.size){this.last=[...this.points.values()][0];this.moved=true;return;}
        this.interacting=false;this.pinch=null;
        if(!cancelled&&!this.moved&&this.scene){
          const b=c.getBoundingClientRect(),id=this.pick(e.clientX-b.left,e.clientY-b.top);
          if(id)this.options.onPick?.(id);
        }
        this.requestDraw();
      };
      c.addEventListener('pointerup',e=>release(e,false),{signal});
      c.addEventListener('pointercancel',e=>release(e,true),{signal});
      c.addEventListener('wheel',e=>{
        e.preventDefault();
        const pixels=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?300:1);
        this.zoomBy(Math.exp(-clamp(pixels,-220,220)*.0017));
      },{passive:false,signal});
      c.addEventListener('keydown',e=>{
        const rotations={ArrowRight:[10,0],ArrowLeft:[-10,0],ArrowUp:[0,-10],ArrowDown:[0,10]};
        if(rotations[e.key]){e.preventDefault();this.rotateBy(...rotations[e.key]);}
        else if(['+','=','-','_','−'].includes(e.key)){e.preventDefault();this.zoomBy(['+','='].includes(e.key)?1.2:1/1.2);}
      },{signal});
      c.addEventListener('dblclick',()=>this.reset(),{signal});
    }
    destroy(){
      this.destroyed=true;this.events.abort();this.observer?.disconnect();
      if(this.raf)cancelAnimationFrame(this.raf);
      if(this.painter.dispose)this.painter.dispose();else this.painter.clearBuffers();
    }
  }
  window.AtlasViewer=AtlasViewer;
})();
