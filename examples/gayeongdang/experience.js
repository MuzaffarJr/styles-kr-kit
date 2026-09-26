import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

const root = document.documentElement;
const intro = document.querySelector('#intro');
const canvas = document.querySelector('#hanok-scene');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const chapters = [...document.querySelectorAll('main > section')];
const rail = [...document.querySelectorAll('.chapter-rail a')];
const revealTargets = [...document.querySelectorAll('[data-reveal],.chapter .section-index,.chapter h2,.chapter p,.chapter .text-link,.chapter .image-frame,.chapter .booking-form,.chapter .map-card,.chapter .rooms-heading,.chapter .room-card')];

if (!reduced) root.classList.add('js-motion');
const revealer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealer.unobserve(entry.target); } });
}, { rootMargin: '0px 0px -8% 0px', threshold: .04 });
revealTargets.forEach(el => revealer.observe(el));
let active = 0;
let pointerX = 0, pointerY = 0;
let scrollRatio = 0;
let scene = null, camera = null, renderer = null, house = null, lanterns = [];
let raf = 0;
let last = 0;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const smooth = (a, b, t) => a + (b - a) * t;

function updateScroll() {
  const total = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  scrollRatio = clamp(scrollY / total, 0, 1);
  root.style.setProperty('--progress', `${(scrollRatio * 100).toFixed(2)}%`);
  const midpoint = scrollY + innerHeight * .52;
  let index = 0;
  for (let i = 0; i < chapters.length; i++) if (chapters[i].offsetTop <= midpoint) index = i;
  active = index;
  rail.forEach((a, i) => { a.classList.toggle('active', i === index); if (i === index) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
  root.style.setProperty('--veil-opacity', index === 0 ? '1' : index === 4 ? '.55' : '.8');
}
addEventListener('scroll', updateScroll, { passive: true });
addEventListener('resize', updateScroll, { passive: true });
addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { pointerX = e.clientX / innerWidth - .5; pointerY = e.clientY / innerHeight - .5; } }, { passive: true });
updateScroll();

function box(group, material, width, height, depth, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); return mesh;
}
function makeHanok() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x10191a, .027);
  camera = new THREE.PerspectiveCamera(36, innerWidth / innerHeight, .1, 120);
  renderer = new THREE.WebGLRenderer({ canvas, antialias: innerWidth > 700, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.35 : 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.shadowMap.enabled = innerWidth > 700;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const wood = new THREE.MeshStandardMaterial({ color: 0x503b2e, roughness: .84 });
  const woodLight = new THREE.MeshStandardMaterial({ color: 0x8a6345, roughness: .8 });
  const plaster = new THREE.MeshStandardMaterial({ color: 0xb6ab8d, roughness: 1 });
  const roof = new THREE.MeshStandardMaterial({ color: 0x263b3c, roughness: .87, metalness: .07, side: THREE.DoubleSide });
  const roofEdge = new THREE.MeshStandardMaterial({ color: 0x182a2d, roughness: .7 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x68746b, roughness: 1 });
  const warmWindow = new THREE.MeshStandardMaterial({ color: 0xd4a473, emissive: 0x925f31, emissiveIntensity: .35, roughness: 1 });

  house = new THREE.Group(); scene.add(house);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0x151f1e, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.12; ground.receiveShadow = true; scene.add(ground);
  box(house, wood, 11.5, .35, 6.1, 0, .05, -1.3);
  box(house, plaster, 10.2, 2.6, 4.6, 0, 1.65, -1.45);
  box(house, wood, 11.6, .22, 6.2, 0, 3.05, -1.3);
  box(house, woodLight, 12.2, .28, 7, 0, .38, -1.3);
  // The layered roof uses sloped ceramic planes with visible ridge and tiled battens.
  for (const direction of [-1, 1]) {
    const panel = box(house, roof, 6.4, .22, 7.65, direction * 2.9, 4.18, -1.35);
    panel.rotation.z = direction * -.31;
    for (let row = 0; row < 15; row++) {
      const x = direction * (.38 + row * .38);
      const beam = box(house, roofEdge, .07, .09, 7.7, x, 5.03 - Math.abs(x) * .32, -1.35);
      beam.rotation.z = direction * -.31;
    }
    box(house, roofEdge, .32, .26, 7.9, direction * 5.9, 3.18, -1.35);
  }
  box(house, roofEdge, .52, .36, 7.9, 0, 5.02, -1.35);
  for (const x of [-5,-3.25,-1.5,1.5,3.25,5]) {
    for (const z of [-3.7,1.1]) box(house, wood, .29, 2.9, .29, x, 1.85, z);
    box(house, woodLight, .25, 2.25, .3, x, 1.67, 1.03);
  }
  for (const x of [-3.9,-2.35,2.35,3.9]) {
    box(house, warmWindow, 1.3, 1.75, .04, x, 1.78, 1.07);
    for (let i = -1; i <= 1; i++) box(house, wood, .045, 1.8, .075, x + i * .34, 1.78, 1.12);
    for (let i = -1; i <= 1; i++) box(house, wood, 1.35, .045, .075, x, 1.78 + i * .42, 1.12);
  }
  box(house, woodLight, 2.5, 2.3, .12, 0, 1.55, 1.14);
  for (const x of [-.85,.85]) for (let i = 0; i < 4; i++) box(house, wood, .035, 2.2, .08, x + i * .22, 1.55, 1.24);
  const step = box(house, stone, 4.7, .19, 1.1, 0, .04, 2.32); step.receiveShadow = true;
  for (let i=0;i<18;i++) {
    const x = (i%6 - 2.5) * 1.55 + Math.sin(i*6.7)*.3;
    const z = 4.2 + Math.floor(i/6)*1.48 + Math.cos(i*5)*.25;
    const slab = new THREE.Mesh(new THREE.CylinderGeometry(.56,.6,.1,7), stone);
    slab.rotation.y = i * 1.7; slab.position.set(x,-.02,z); slab.receiveShadow = true; scene.add(slab);
  }
  for (const x of [-6.65,6.65]) {
    box(scene, wood, .12, 1.65, .12, x, .78, 2.75);
    box(scene, wood, .55, .16, .55, x, 1.62, 2.75);
    const lantern = box(scene, warmWindow, .42, .6, .42, x, 1.22, 2.75);
    const lamp = new THREE.PointLight(0xe9aa68, innerWidth > 700 ? 14 : 7, 9, 2);
    lamp.position.copy(lantern.position); scene.add(lamp); lanterns.push(lamp);
  }
  const moon = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 20), new THREE.MeshBasicMaterial({ color: 0xe2b28e }));
  moon.position.set(-8, 11, -25); scene.add(moon);
  const moonGlow = new THREE.PointLight(0xd8a982, 18, 55); moonGlow.position.copy(moon.position); scene.add(moonGlow);
  scene.add(new THREE.AmbientLight(0x718b86, 2.1));
  const key = new THREE.DirectionalLight(0xc2cfbf, 4.2); key.position.set(-8, 12, 9); key.castShadow = innerWidth > 700;
  key.shadow.mapSize.set(1024,1024); key.shadow.camera.left=-18;key.shadow.camera.right=18;key.shadow.camera.top=18;key.shadow.camera.bottom=-18;scene.add(key);
  const fill = new THREE.DirectionalLight(0xb67351, 2.5);fill.position.set(7, 4, -3);scene.add(fill);
  const count = innerWidth < 700 ? 140 : 280;
  const coords = new Float32Array(count*3);
  for (let i=0;i<count;i++) { coords[i*3]=(Math.random()-.5)*42;coords[i*3+1]=Math.random()*15;coords[i*3+2]=(Math.random()-.5)*30; }
  const points = new THREE.BufferGeometry();points.setAttribute('position',new THREE.BufferAttribute(coords,3));
  scene.add(new THREE.Points(points,new THREE.PointsMaterial({color:0xe8d8b4,size:.035,transparent:true,opacity:.42,depthWrite:false})));
}

const views = [
  {p:[10,6.1,17],t:[0,1.7,-1]},
  {p:[-10,4.6,12],t:[0,2,-1]},
  {p:[5.8,3.5,11],t:[0,1.7,-1]},
  {p:[4.8,3.7,10.5],t:[0,2.1,-1]},
  {p:[3.4,4.7,15],t:[0,1.7,-1]},
  {p:[-3.7,5.3,17],t:[0,1.3,-1]}
];
let look = new THREE.Vector3();
function frame(ms) {
  const dt = Math.min(.05, (ms-last)/1000 || .016);last=ms;
  const target = views[active];
  const speed = reduced ? 1 : 1-Math.exp(-1.8*dt);
  camera.position.lerp(new THREE.Vector3(...target.p).add(new THREE.Vector3(pointerX*.65,-pointerY*.4,0)),speed);
  look.lerp(new THREE.Vector3(...target.t),speed);
  camera.lookAt(look);
  if (!reduced) {house.rotation.y = Math.sin(ms*.00012)*.012;lanterns.forEach((light,i)=>{light.intensity=(innerWidth>700?14:7)+Math.sin(ms*.003+i*2)*1.3;});}
  renderer.render(scene,camera);
  if (!reduced && !document.hidden) raf=requestAnimationFrame(frame); else raf=0;
}
function resize() {if (!renderer)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<700?1.35:1.75));renderer.setSize(innerWidth,innerHeight);}
addEventListener('resize',resize,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(frame)}});
try {makeHanok();camera.position.set(...views[0].p);look.set(...views[0].t);camera.lookAt(look);raf=requestAnimationFrame(frame);} catch (error) {console.warn('3D scene unavailable',error);root.classList.add('no-webgl');canvas.style.backgroundImage="linear-gradient(90deg,#071011ad,#07101155),url('https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Traditional_hanok_houses_at_golden_hour_in_Bukchon_Hanok_Village_in_Seoul.jpg/1280px-Traditional_hanok_houses_at_golden_hour_in_Bukchon_Hanok_Village_in_Seoul.jpg')";canvas.style.backgroundSize='cover';}
setTimeout(()=>{intro.classList.add('done');document.querySelector('[data-reveal]')?.classList.add('visible')},reduced?0:1050);
