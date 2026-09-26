import * as THREE from "three";
import type { SceneFactory } from "../types";

/**
 * "Celadon Vessel" — sekin nafas oluvchi, seladon glazurli procedural shakl.
 * Glazurdagi mayda yoriqlar (crackle) fragment shader'da cellular noise bilan chiziladi.
 * Hech qanday tashqi asset yo'q: bundle'da faqat kod.
 */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;

  float wave(vec3 p, float t) {
    return sin(p.x * 2.1 + t * 0.6) * 0.06
         + sin(p.y * 3.3 - t * 0.45) * 0.045
         + sin((p.x + p.z) * 4.7 + t * 0.8) * 0.02;
  }

  void main() {
    vec3 p = position;
    float d = wave(p, uTime);
    // Pointer tomonga yengil "tortilish"
    d += dot(normalize(p.xy + 1e-4), uPointer) * 0.035;
    vec3 displaced = p + normal * d;

    vec4 world = modelMatrix * vec4(displaced, 1.0);
    vPos = displaced;
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uGlaze;
  uniform vec3 uDeep;
  uniform vec3 uRim;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;

  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453);
  }

  // F2 - F1 cellular: hujayra chegaralari = glazur yoriqlari
  float crackle(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    float f1 = 8.0, f2 = 8.0;
    for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++)
    for (int z = -1; z <= 1; z++) {
      vec3 g = vec3(float(x), float(y), float(z));
      vec3 r = g + hash3(i + g) - f;
      float d = dot(r, r);
      if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) { f2 = d; }
    }
    return sqrt(f2) - sqrt(f1);
  }

  void main() {
    vec3 n = normalize(vNormal);
    float fres = pow(1.0 - max(dot(n, vView), 0.0), 2.4);
    float light = 0.55 + 0.45 * max(dot(n, normalize(vec3(-0.4, 0.8, 0.6))), 0.0);

    vec3 base = mix(uDeep, uGlaze, light);
    float c = 1.0 - smoothstep(0.0, 0.06, crackle(vPos * 5.0));
    base = mix(base, uDeep * 0.85, c * 0.35);

    vec3 color = mix(base, uRim, fres * 0.9);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const createCeladonVessel: SceneFactory = (canvas, { maxDpr }) => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 6);

  // Vaza silueti: lathe profili
  const profile: THREE.Vector2[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = i / 48;
    const y = (t - 0.5) * 2.6;
    const r = 0.18 + 0.72 * Math.sin(Math.PI * Math.pow(t, 0.8)) * (1 - 0.35 * t) + 0.12 * Math.pow(t, 6);
    profile.push(new THREE.Vector2(r, y));
  }
  const geometry = new THREE.LatheGeometry(profile, 128);

  const uniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2() },
    uGlaze: { value: new THREE.Color("#8fc9b0") },
    uDeep: { value: new THREE.Color("#3d6e62") },
    uRim: { value: new THREE.Color("#eef1f6") },
  };
  const material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.z = -0.12;
  scene.add(mesh);

  const clock = new THREE.Clock(false);
  const pointerTarget = new THREE.Vector2();
  let raf = 0;

  const frame = () => {
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    uniforms.uPointer.value.lerp(pointerTarget, 0.06);
    mesh.rotation.y = t * 0.18 + uniforms.uPointer.value.x * 0.35;
    mesh.rotation.x = uniforms.uPointer.value.y * 0.15;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };

  return {
    start() {
      if (raf) return;
      clock.start();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      clock.stop();
    },
    renderOnce() {
      mesh.rotation.set(0, 0.6, -0.12);
      renderer.render(scene, camera);
    },
    resize(w, h) {
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Tor ekranda shakl sig'ishi uchun kamerani uzoqlashtiramiz
      camera.position.z = w / h < 0.8 ? 8.2 : 6;
      camera.updateProjectionMatrix();
    },
    setPointer(x, y) {
      pointerTarget.set(x, y);
    },
    dispose() {
      cancelAnimationFrame(raf);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
};

export default createCeladonVessel;
