// Liquid orange WebGL shader (LYGIA-grade simplex fbm + domain warp + pseudo-lighting)
// 単一フルスクリーン三角形にフラグメントシェーダーを描く。カーソル追従＋下から湧き上がる開幕。
const FRAG = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform float u_seed; uniform float u_intro;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec2 v){
 const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
 vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
 vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
 vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0);
 vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
 vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
 vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
 m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
 vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
 return 130.0*dot(m,g);
}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*(snoise(p)*0.5+0.5);p*=2.02;a*=.5;}return v;}
float field(vec2 p,vec2 r,float bump){return fbm(p*1.12+r*2.0+bump*1.8);}
void main(){
 vec2 uv=gl_FragCoord.xy/u_res.xy; vec2 p=uv; p.x*=u_res.x/u_res.y;
 float t=u_time*0.028+u_seed;
 vec2 m=u_mouse; m.x*=u_res.x/u_res.y;
 float md=distance(p,m); float bump=exp(-md*md*4.0)*0.30;
 vec2 q=vec2(fbm(p*1.12+vec2(0.,t)),fbm(p*1.12+vec2(5.2,1.3)-t*0.6));
 vec2 r=vec2(fbm(p*1.12+q*1.6+vec2(1.7,9.2)+bump*1.1-t*0.4),fbm(p*1.12+q*1.6+vec2(8.3,2.8)+t*0.34));
 float e=0.0021;
 float f=field(p,r,bump);
 float fx=field(p+vec2(e,0.),r,bump);
 float fy=field(p+vec2(0.,e),r,bump);
 vec3 nrm=normalize(vec3((f-fx)/e,(f-fy)/e,2.4));
 vec3 L=normalize(vec3(0.5,0.6,0.95));
 float diff=clamp(dot(nrm,L),0.0,1.0);
 float spec=pow(clamp(dot(reflect(-L,nrm),vec3(0.,0.,1.)),0.0,1.0),20.0);
 vec3 deep=vec3(0.34,0.06,0.03),mid=vec3(0.80,0.19,0.09),brt=vec3(0.90,0.30,0.13),gold=vec3(0.97,0.66,0.40);
 vec3 col=mix(deep,mid,smoothstep(0.18,0.64,f));
 col=mix(col,brt,smoothstep(0.66,0.94,f));
 col*=0.76+0.30*diff;
 col+=spec*gold*0.22;
 col+=bump*0.14*vec3(1.0,0.6,0.3);
 col*=1.0-0.26*pow(distance(uv,vec2(0.5)),2.0);
 col+=(hash(uv*(u_time+1.0))-0.5)*0.008;
 float front=u_intro*1.28;
 float rl=smoothstep(front, front-0.26, uv.y);
 float edge=smoothstep(0.04,0.0,abs(uv.y-(front-0.13)))*(1.0-step(1.0,u_intro));
 col=mix(deep*0.5,col,rl); col+=edge*gold*0.28;
 gl_FragColor=vec4(col,1.0);
}`;
const VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

export function initLiquid(canvas: HTMLCanvasElement, seed = 0, introMs = 0): () => void {
  const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "high-performance" });
  if (!gl) { canvas.style.background = "#C53E13"; return () => {}; }
  const sh = (type: number, src: string) => { const o = gl.createShader(type)!; gl.shaderSource(o, src); gl.compileShader(o); return o; };
  const pr = gl.createProgram()!;
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr); gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const la = gl.getAttribLocation(pr, "a"); gl.enableVertexAttribArray(la); gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(pr, "u_res"), uT = gl.getUniformLocation(pr, "u_time"), uM = gl.getUniformLocation(pr, "u_mouse"), uS = gl.getUniformLocation(pr, "u_seed"), uI = gl.getUniformLocation(pr, "u_intro");
  gl.uniform1f(uS, seed);
  const scale = 0.58; let mx = 0.5, my = 0.6, tx = 0.5, ty = 0.6;
  const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight; canvas.width = Math.max(2, w * scale); canvas.height = Math.max(2, h * scale); gl.viewport(0, 0, canvas.width, canvas.height); };
  window.addEventListener("resize", resize); resize();
  const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = 1.0 - (e.clientY - r.top) / r.height; };
  const parent = canvas.parentElement; parent?.addEventListener("pointermove", onMove);
  const t0 = performance.now(); let raf = 0;
  const loop = (now: number) => {
    mx += (tx - mx) * 0.07; my += (ty - my) * 0.07;
    let intro = introMs ? Math.min(1, (now - t0) / introMs) : 1; intro = 1 - Math.pow(1 - intro, 3);
    gl.uniform2f(uRes, canvas.width, canvas.height); gl.uniform1f(uT, (now - t0) * 0.001); gl.uniform2f(uM, mx, my); gl.uniform1f(uI, intro);
    gl.drawArrays(gl.TRIANGLES, 0, 3); raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); parent?.removeEventListener("pointermove", onMove); };
}
