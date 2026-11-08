// Interactive cortical surface: Conte69 (32k per hemisphere) coloured by the first
// functional-connectivity gradient, both shipped with BrainSpace (MICA-MNI/BrainSpace).
// Data are packed by ../tools (see README): Int16 positions ×0.1 mm, Uint16 faces, Uint8 scalar.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const host = document.querySelector('.hero-brain');
const canvas = document.getElementById('brain');

function fail(reason) {
  if (host) host.classList.add('fallback');
  console.warn('brain viewer disabled:', reason);
}

// Brand ramp, dark → light: deep green, moss, sage, straw, pale gold. Medial wall is grey.
const STOPS = ['#1f382c', '#3f6b4f', '#8fae7a', '#cfcf9c', '#f1dfae'].map(h => new THREE.Color(h));
const WALL = new THREE.Color('#7b8277');
function ramp(t, out) {
  const x = Math.min(Math.max(t, 0), 1) * (STOPS.length - 1);
  const i = Math.min(Math.floor(x), STOPS.length - 2);
  return out.copy(STOPS[i]).lerp(STOPS[i + 1], x - i);
}

async function init() {
  if (!host || !canvas) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { return fail(e); }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 1, 2000);
  scene.add(new THREE.HemisphereLight(0xfaf7ee, 0x314035, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-160, 140, 220); scene.add(key);
  const fill = new THREE.DirectionalLight(0xdfe8d6, 0.55); fill.position.set(180, -40, -160); scene.add(fill);

  let meta, bin;
  try {
    [meta, bin] = await Promise.all([
      fetch('media/brain/conte69.json').then(r => r.json()),
      fetch('media/brain/conte69.bin').then(r => r.arrayBuffer()),
    ]);
  } catch (e) { return fail(e); }

  const scalar = new Uint8Array(bin, meta.scalar_off);
  const group = new THREE.Group();
  const tmp = new THREE.Color();
  let vertexBase = 0;
  for (const h of meta.hemis) {
    const p16 = new Int16Array(bin, h.pos_off, h.nv * 3);
    const idx = new Uint16Array(bin, h.idx_off, h.nf * 3);
    const pos = new Float32Array(h.nv * 3);
    const col = new Float32Array(h.nv * 3);
    for (let i = 0; i < h.nv; i++) {
      pos[i * 3] = p16[i * 3] / meta.scale - meta.center[0];
      pos[i * 3 + 1] = p16[i * 3 + 1] / meta.scale - meta.center[1];
      pos[i * 3 + 2] = p16[i * 3 + 2] / meta.scale - meta.center[2];
      const s = scalar[vertexBase + i];
      const c = s === 0 ? WALL : ramp((s - 1) / 254, tmp);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    vertexBase += h.nv;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78, metalness: 0.0, flatShading: false });
    group.add(new THREE.Mesh(geo, mat));
  }
  // Surface coordinates are RAS (x right, y anterior, z superior). Stand the brain up: z → up.
  group.rotation.x = -Math.PI / 2;
  scene.add(group);

  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.7;
  controls.minPolarAngle = Math.PI * 0.2;
  controls.maxPolarAngle = Math.PI * 0.8;
  const dist = meta.radius * 3.1;
  camera.position.set(-dist * 0.86, dist * 0.22, dist * 0.46);
  camera.lookAt(0, 0, 0);

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);
  resize();

  let visible = true, raf = 0;
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) loop(); }, { threshold: 0.05 }).observe(host);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible) loop(); });
  function loop() {
    cancelAnimationFrame(raf);
    if (!visible || document.hidden) return;
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  host.classList.add('ready');
  loop();
  canvas.addEventListener('pointerdown', () => { controls.autoRotate = false; host.classList.add('touched'); }, { once: true });
}

init().catch(fail);
