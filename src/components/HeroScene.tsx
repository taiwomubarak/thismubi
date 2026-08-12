import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type HeroSceneProps = {
  onReady?: () => void;
};

export default function HeroScene({ onReady }: HeroSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const canvasHost = hostRef.current;
    if (!canvasHost) {
      console.warn('hero-canvas missing — skipping 3D scene');
      return undefined;
    }

    let disposed = false;
    let rafId = 0;
    let renderer: THREE.WebGLRenderer | undefined;
    let controls: OrbitControls | undefined;
    let onMouseMove: ((e: MouseEvent) => void) | undefined;
    let onScroll: (() => void) | undefined;
    let onResize: (() => void) | undefined;
    let scene: THREE.Scene | undefined;
    let timer: THREE.Timer | undefined;

    try {
scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);
scene.fog = new THREE.Fog(0x0a0a0a, 3.5, 8);

// Camera
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.2, 4.2);
camera.lookAt(0, 1.1, 0);

// Renderer
renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
canvasHost.appendChild(renderer.domElement);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambient);

// Key light — soft diffused studio
const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
keyLight.position.set(2, 3, 4);
keyLight.castShadow = true;
scene.add(keyLight);

// Fill light — cooler
const fillLight = new THREE.DirectionalLight(0x88aaff, 0.4);
fillLight.position.set(-3, 1, 2);
scene.add(fillLight);

// Rim light — amber from prosthetic arm
const amberLight = new THREE.PointLight(0xffb347, 2.5, 4);
amberLight.position.set(-0.6, 1.0, 0.5);
scene.add(amberLight);

// Magenta conduit glow
const magentaLight = new THREE.PointLight(0xff00ff, 1.2, 3);
magentaLight.position.set(0.5, 1.4, 0.3);
scene.add(magentaLight);

// Cyan conduit glow
const cyanLight = new THREE.PointLight(0x00ffff, 1.0, 3);
cyanLight.position.set(0.3, 1.6, -0.3);
scene.add(cyanLight);

// ==== CHARACTER GROUP ====
const character = new THREE.Group();

// --- Materials ---
const matSuit = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  roughness: 0.6,
  metalness: 0.3,
  emissive: 0x000000,
});

const matCarbon = new THREE.MeshStandardMaterial({
  color: 0x141414,
  roughness: 0.3,
  metalness: 0.8,
});

const matFabric = new THREE.MeshStandardMaterial({
  color: 0x202020,
  roughness: 0.9,
  metalness: 0.1,
});

const matSkin = new THREE.MeshStandardMaterial({
  color: 0x5c4634,
  roughness: 0.5,
  metalness: 0.0,
});

const matPolycarb = new THREE.MeshPhysicalMaterial({
  color: 0x444444,
  roughness: 0.15,
  metalness: 0.1,
  transmission: 0.6,
  thickness: 0.4,
  clearcoat: 1.0,
});

const matCopper = new THREE.MeshStandardMaterial({
  color: 0xb87333,
  roughness: 0.35,
  metalness: 0.9,
});

const matAmber = new THREE.MeshStandardMaterial({
  color: 0xffa500,
  emissive: 0xffa500,
  emissiveIntensity: 0.8,
  roughness: 0.2,
});

const matCyan = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  emissive: 0x00ffff,
  emissiveIntensity: 0.6,
  roughness: 0.3,
});

const matMagenta = new THREE.MeshStandardMaterial({
  color: 0xff00ff,
  emissive: 0xff00ff,
  emissiveIntensity: 0.6,
  roughness: 0.3,
});

// --- Torso / Exo-Weave suit ---
const torso = new THREE.Mesh(
  new THREE.CylinderGeometry(0.32, 0.28, 0.9, 24, 1),
  matSuit
);
torso.position.set(0, 1.35, 0);
torso.castShadow = true;
character.add(torso);

// Chest plating
const chestPlate = new THREE.Mesh(
  new THREE.BoxGeometry(0.4, 0.3, 0.12),
  matCarbon
);
chestPlate.position.set(0, 1.55, 0.28);
chestPlate.rotation.x = 0.1;
character.add(chestPlate);

// Cyan conduit on chest — vertical energy line
const cyanConduit = new THREE.Mesh(
  new THREE.BoxGeometry(0.015, 0.55, 0.02),
  matCyan
);
cyanConduit.position.set(-0.08, 1.55, 0.33);
character.add(cyanConduit);

// Magenta conduit
const magentaConduit = new THREE.Mesh(
  new THREE.BoxGeometry(0.015, 0.45, 0.02),
  matMagenta
);
magentaConduit.position.set(0.1, 1.52, 0.33);
magentaConduit.rotation.z = 0.2;
character.add(magentaConduit);

// Spine conduit (back)
const spineConduit = new THREE.Mesh(
  new THREE.BoxGeometry(0.02, 0.7, 0.02),
  matCyan
);
spineConduit.position.set(0, 1.4, -0.28);
character.add(spineConduit);

// --- Head ---
const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.19, 32, 32),
  matSkin
);
head.position.set(0, 2.0, 0);
head.castShadow = true;
character.add(head);

// Jaw sharper — sculpt down
head.scale.y = 1.25;

// Hair — geometric undercut dreadlocks (abstract)
const hairBack = new THREE.Mesh(
  new THREE.CylinderGeometry(0.17, 0.2, 0.28, 16),
  matCarbon
);
hairBack.position.set(0, 2.1, -0.12);
hairBack.rotation.x = 0.5;
character.add(hairBack);

// Dreadlock strands (fiber-optic)
for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2;
  const x = Math.cos(angle) * 0.18;
  const z = Math.sin(angle) * 0.18 - 0.08;
  const dread = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.01, 0.28 + Math.random() * 0.15, 8),
    i % 2 === 0 ? matCarbon : matCyan
  );
  dread.position.set(x, 1.93 - (i * 0.02), z);
  dread.rotation.z = Math.sin(angle) * 0.25;
  dread.rotation.x = 0.2;
  character.add(dread);
}

// AR interface ring around head (cyan + magenta fragments)
const arRing = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.004, 8, 48),
  matCyan
);
arRing.position.set(0, 2.05, 0);
arRing.rotation.x = Math.PI / 2.3;
character.add(arRing);

const arRing2 = new THREE.Mesh(
  new THREE.TorusGeometry(0.34, 0.003, 8, 32, Math.PI * 0.6),
  matMagenta
);
arRing2.position.set(0.1, 2.08, 0);
arRing2.rotation.x = Math.PI / 1.8;
arRing2.rotation.z = 0.5;
character.add(arRing2);

// --- Neck ---
const neck = new THREE.Mesh(
  new THREE.CylinderGeometry(0.08, 0.1, 0.15, 16),
  matSuit
);
neck.position.set(0, 1.85, 0);
character.add(neck);

// --- Shoulders (carbon fiber plates) ---
const shoulderL = new THREE.Mesh(
  new THREE.SphereGeometry(0.13, 16, 16),
  matCarbon
);
shoulderL.position.set(-0.35, 1.62, 0);
shoulderL.scale.set(1, 1.4, 1);
character.add(shoulderL);

const shoulderR = new THREE.Mesh(
  new THREE.SphereGeometry(0.13, 16, 16),
  matCarbon
);
shoulderR.position.set(0.35, 1.62, 0);
shoulderR.scale.set(1, 1.4, 1);
character.add(shoulderR);

// --- Arms ---
// Right arm (normal, suit)
const armRUpper = new THREE.Mesh(
  new THREE.CylinderGeometry(0.07, 0.06, 0.45, 12),
  matSuit
);
armRUpper.position.set(0.4, 1.35, 0);
armRUpper.rotation.z = -0.15;
character.add(armRUpper);

const armRFore = new THREE.Mesh(
  new THREE.CylinderGeometry(0.055, 0.04, 0.4, 12),
  matSuit
);
armRFore.position.set(0.42, 0.92, 0);
armRFore.rotation.z = -0.1;
character.add(armRFore);

const handR = new THREE.Mesh(
  new THREE.SphereGeometry(0.04, 12, 12),
  matSkin
);
handR.position.set(0.38, 0.72, 0);
handR.scale.set(0.7, 1.2, 0.7);
character.add(handR);

// Cyan conduit on right arm
const armConduitR = new THREE.Mesh(
  new THREE.BoxGeometry(0.012, 0.25, 0.012),
  matCyan
);
armConduitR.position.set(0.44, 1.12, 0);
armConduitR.rotation.z = -0.15;
character.add(armConduitR);

// --- LEFT ARM: ADVANCED PROSTHETIC (translucent polycarbonate, amber core) ---
// Upper prosthetic
const prostUpper = new THREE.Mesh(
  new THREE.CylinderGeometry(0.08, 0.07, 0.45, 16, 1, true),
  matPolycarb
);
prostUpper.position.set(-0.4, 1.35, 0);
prostUpper.rotation.z = 0.15;
character.add(prostUpper);

// Copper wiring inside upper
for (let i = 0; i < 4; i++) {
  const wire = new THREE.Mesh(
    new THREE.CylinderGeometry(0.006, 0.006, 0.4, 8),
    matCopper
  );
  wire.position.set(-0.4 + Math.sin(i) * 0.02, 1.35 - (i * 0.08), Math.cos(i) * 0.05);
  wire.rotation.z = 0.15;
  character.add(wire);
}

// Elbow joint — gears
const elbowGear = new THREE.Mesh(
  new THREE.TorusGeometry(0.07, 0.015, 8, 24),
  matCopper
);
elbowGear.position.set(-0.4, 0.9, 0);
elbowGear.rotation.y = Math.PI / 2;
character.add(elbowGear);

// Forearm prosthetic
const prostFore = new THREE.Mesh(
  new THREE.CylinderGeometry(0.065, 0.05, 0.42, 16, 1, true),
  matPolycarb
);
prostFore.position.set(-0.42, 0.88, 0);
prostFore.rotation.z = 0.1;
character.add(prostFore);

// Hydraulic pistons inside forearm
for (let i = 0; i < 3; i++) {
  const piston = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, 0.35, 8),
    matCopper
  );
  piston.position.set(-0.42 + Math.cos(i * 2) * 0.03, 0.88 - (i * 0.1), Math.sin(i * 2) * 0.03);
  piston.rotation.z = 0.1;
  character.add(piston);
}

// Amber GLOW core in forearm
const amberCore = new THREE.Mesh(
  new THREE.SphereGeometry(0.04, 16, 16),
  matAmber
);
amberCore.position.set(-0.42, 0.92, 0);
amberCore.scale.set(0.7, 1.3, 0.7);
character.add(amberCore);

// Amber glow (outer glow using additive sprite)
const amberGlow = new THREE.Mesh(
  new THREE.SphereGeometry(0.09, 16, 16),
  new THREE.MeshBasicMaterial({
    color: 0xffa500,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
  })
);
amberGlow.position.copy(amberCore.position);
character.add(amberGlow);

// Prosthetic hand
const prostHand = new THREE.Mesh(
  new THREE.BoxGeometry(0.08, 0.03, 0.1),
  matCarbon
);
prostHand.position.set(-0.38, 0.68, 0);
character.add(prostHand);

// Fingers (mechanical)
for (let i = 0; i < 4; i++) {
  const finger = new THREE.Mesh(
    new THREE.BoxGeometry(0.012, 0.02, 0.08),
    matCarbon
  );
  finger.position.set(-0.38, 0.67, -0.05 + (i * 0.036));
  character.add(finger);
}

// Polycarbonate plate overlay lines
for (let i = 0; i < 5; i++) {
  const plateLine = new THREE.Mesh(
    new THREE.TorusGeometry(0.065, 0.002, 6, 16),
    matCopper
  );
  plateLine.position.set(-0.4 - Math.sign(i - 2) * 0.02, 1.3 - i * 0.1, 0);
  plateLine.rotation.x = Math.PI / 2;
  character.add(plateLine);
}

// --- Legs ---
const legLUpper = new THREE.Mesh(
  new THREE.CylinderGeometry(0.09, 0.07, 0.5, 12),
  matSuit
);
legLUpper.position.set(-0.15, 0.7, 0);
character.add(legLUpper);

const legRUpper = new THREE.Mesh(
  new THREE.CylinderGeometry(0.09, 0.07, 0.5, 12),
  matSuit
);
legRUpper.position.set(0.15, 0.7, 0);
character.add(legRUpper);

// Knee plates (carbon)
const kneeL = new THREE.Mesh(
  new THREE.SphereGeometry(0.08, 12, 8),
  matCarbon
);
kneeL.position.set(-0.15, 0.45, 0.05);
kneeL.scale.set(1, 0.6, 1.3);
character.add(kneeL);

const kneeR = new THREE.Mesh(
  new THREE.SphereGeometry(0.08, 12, 8),
  matCarbon
);
kneeR.position.set(0.15, 0.45, 0.05);
kneeR.scale.set(1, 0.6, 1.3);
character.add(kneeR);

const legLLower = new THREE.Mesh(
  new THREE.CylinderGeometry(0.06, 0.05, 0.5, 12),
  matFabric
);
legLLower.position.set(-0.15, 0.2, 0);
character.add(legLLower);

const legRLower = new THREE.Mesh(
  new THREE.CylinderGeometry(0.06, 0.05, 0.5, 12),
  matFabric
);
legRLower.position.set(0.15, 0.2, 0);
character.add(legRLower);

// Boots
const bootL = new THREE.Mesh(
  new THREE.BoxGeometry(0.14, 0.1, 0.24),
  matCarbon
);
bootL.position.set(-0.15, -0.03, 0.05);
character.add(bootL);

const bootR = new THREE.Mesh(
  new THREE.BoxGeometry(0.14, 0.1, 0.24),
  matCarbon
);
bootR.position.set(0.15, -0.03, 0.05);
character.add(bootR);

// Wireframe overlay on lower legs (subtle)
const wireL = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.065, 0.055, 0.5, 10, 1)),
  new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.25 })
);
wireL.position.copy(legLLower.position);
character.add(wireL);

const wireR = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.065, 0.055, 0.5, 10, 1)),
  new THREE.LineBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.25 })
);
wireR.position.copy(legRLower.position);
character.add(wireR);

// --- Waist belt ---
const belt = new THREE.Mesh(
  new THREE.TorusGeometry(0.31, 0.03, 8, 24),
  matCarbon
);
belt.position.set(0, 1.0, 0);
belt.rotation.x = Math.PI / 2;
character.add(belt);

// Amber buckle
const buckle = new THREE.Mesh(
  new THREE.BoxGeometry(0.06, 0.06, 0.04),
  matAmber
);
buckle.position.set(0, 1.0, 0.31);
character.add(buckle);

scene.add(character);

// ==== PEDESTAL (brushed dark metal) ====
const pedestalGeo = new THREE.CylinderGeometry(1.1, 1.3, 0.1, 48);
const pedestalMat = new THREE.MeshStandardMaterial({
  color: 0x111111,
  roughness: 0.4,
  metalness: 0.8,
});
const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
pedestal.position.set(0, -0.05, 0);
pedestal.receiveShadow = true;
scene.add(pedestal);

// Pedestal wireframe overlay
const pedestalWire = new THREE.LineSegments(
  new THREE.EdgesGeometry(pedestalGeo),
  new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.15 })
);
pedestalWire.position.copy(pedestal.position);
scene.add(pedestalWire);

// Pedestal stem
const stem = new THREE.Mesh(
  new THREE.CylinderGeometry(0.7, 0.9, 0.7, 32),
  pedestalMat
);
stem.position.set(0, -0.45, 0);
stem.castShadow = true;
scene.add(stem);

const base = new THREE.Mesh(
  new THREE.CylinderGeometry(1.4, 1.5, 0.12, 48),
  pedestalMat
);
base.position.set(0, -0.85, 0);
base.receiveShadow = true;
scene.add(base);

// Ground plane
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x080808,
  roughness: 0.95,
  metalness: 0.0,
});
const ground = new THREE.Mesh(new THREE.CircleGeometry(6, 48), groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.91;
ground.receiveShadow = true;
scene.add(ground);

// ==== PARTICLE FLOATING (memory fragments) ====
const particleCount = 800;
const particlesGeo = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const radius = 1.5 + Math.random() * 2.5;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = radius * Math.cos(phi) * 0.6 + 1.2;
  positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

  // Mostly white dust with occasional yellow spores
  const r = Math.random();
  if (r > 0.92) {
    colors[i * 3] = 1.0;
    colors[i * 3 + 1] = 0.9;
    colors[i * 3 + 2] = 0.2;
  } else {
    colors[i * 3] = 0.5;
    colors[i * 3 + 1] = 0.5;
    colors[i * 3 + 2] = 0.55;
  }
}

particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMat = new THREE.PointsMaterial({
  size: 0.012,
  vertexColors: true,
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

// ==== HUD DATA FRAGMENTS (floating text sprites) ====
function createHudText(
  text: string,
  x: number,
  y: number,
  z: number,
  color = 0x00ffff,
  size = 0.06,
) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, opacity: 0 }));
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 28px monospace';
  ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.8;
  ctx.fillText(text, 256, 60);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.position.set(x, y, z);
  sprite.scale.set(size * (canvas.width / canvas.height), size, 1);
  return sprite;
}

// Floating AR data (English + Kanji per the prompt)
const hud1 = createHudText('3D HUMAN CHARACTER DESIGN PHASE 4.1', -0.2, 2.6, 0.5, 0x00ffff, 0.14);
const hud2 = createHudText('POLYCOUNT: 2,400,000', -0.3, 2.55, 0.7, 0xff00ff, 0.1);
const hud3 = createHudText('RENDER ENGINE: CYBER-CORE v9', 0.4, 1.2, 0.6, 0xffa500, 0.1);
const hud4 = createHudText('接続: 安定 (CONNECT: STABLE)', 0.2, 2.4, -0.5, 0x00ffff, 0.1);
const hud5 = createHudText('VRAM Σ 84.7%', -0.45, 1.8, 0.4, 0xff00ff, 0.08);
const hud6 = createHudText('SUITLAB.PBR v3', 0.35, 1.0, -0.4, 0xffa500, 0.08);
const hud7 = createHudText('▲ MEMORY FRAGMENT: FOUND', 0, 2.7, -0.2, 0xffa500, 0.07);
const hud8 = createHudText('CANON EOS R5 / 85mm f1.2', -0.3, 0.6, 0.5, 0xffffff, 0.07);
const hud9 = createHudText('LIVE: 記憶 (MEMORY)', 0.45, 0.8, 0.35, 0x00ffff, 0.09);
[hud1, hud2, hud3, hud4, hud5, hud6, hud7, hud8, hud9].forEach((hud) => scene!.add(hud));

// ==== ORBIT CONTROLS (slow auto-rotation) ====
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = false;
controls.minDistance = 2.2;
controls.maxDistance = 5.5;
controls.maxPolarAngle = Math.PI / 2.2;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;
controls.target.set(0, 1.2, 0);

// Mouse interaction — slight parallax
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;

onMouseMove = (e: MouseEvent) => {
  targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
};
window.addEventListener('mousemove', onMouseMove);

// Scroll — subtle camera height change
let scrollY = 0;
onScroll = () => {
  scrollY = window.scrollY / window.innerHeight;
};
window.addEventListener('scroll', onScroll);

// ==== ANIMATION LOOP ====
timer = new THREE.Timer();
timer.connect(document);

function animate(timestamp?: number) {
  if (disposed) return;
  rafId = requestAnimationFrame(animate);

  if (timestamp !== undefined) timer!.update(timestamp);
  const t = timer!.getElapsed();

  // Smooth mouse parallax
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;

  // Camera parallax (subtle)
  camera.position.x += (mouseX * 0.25 - camera.position.x * 0.0) - (camera.position.x * 0.0);
  controls!.target.y = 1.2 - scrollY * 0.5;

  // Pulses
  amberLight.intensity = 2.0 + Math.sin(t * 2) * 0.8;
  magentaLight.intensity = 0.8 + Math.sin(t * 3) * 0.4;
  cyanLight.intensity = 0.7 + Math.cos(t * 2.5) * 0.3;

  // Conduit pulsing
  matCyan.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.3;
  matMagenta.emissiveIntensity = 0.4 + Math.cos(t * 3) * 0.3;
  matAmber.emissiveIntensity = 0.6 + Math.sin(t * 2.2) * 0.4;

  // Particles drift
  const posAttr = particles.geometry.attributes.position as THREE.BufferAttribute;
  const colorAttr = particles.geometry.attributes.color as THREE.BufferAttribute;
  const pos = posAttr.array as Float32Array;

  for (let i = 0; i < particleCount; i++) {
    const idx = i * 3;
    pos[idx + 1] += Math.sin(t * 0.5 + i) * 0.0003;
    pos[idx] += Math.cos(t * 0.3 + i * 2) * 0.0002;

    // Reposition if out of bounds
    if (pos[idx + 1] > 3.5) pos[idx + 1] = -0.5;
  }

  // Yellow spores flicker
  for (let i = 0; i < particleCount; i++) {
    if (colors[i * 3] > 0.9) {
      const flicker = Math.sin(t * 3 + i) > 0 ? 1.0 : 0.3;
      colors[i * 3 + 1] = 0.9 * flicker;
      colors[i * 3 + 2] = 0.2 * flicker;
    }
  }

  posAttr.needsUpdate = true;
  colorAttr.needsUpdate = true;

  // AR rings rotate slowly
  arRing.rotation.z = t * 0.5;
  arRing2.rotation.z = -t * 0.4 + 0.5;

  // HUD sprites — slight floating
  hud1.position.y = 2.6 + Math.sin(t * 1.5) * 0.02;
  hud2.position.y = 2.55 + Math.cos(t * 1.3) * 0.015;
  hud3.position.y = 1.2 + Math.sin(t * 1.7) * 0.02;
  hud4.position.y = 2.4 + Math.sin(t * 1.2 + 1) * 0.015;
  hud7.position.y = 2.7 + Math.sin(t * 2) * 0.02;
  hud9.position.y = 0.8 + Math.cos(t * 1.8) * 0.015;

  controls!.update();
  renderer!.render(scene!, camera);
}

animate();

// ==== RESIZE ====
onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer!.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', onResize);

      onReadyRef.current?.();
    } catch (err) {
      console.error('3D scene failed to start:', err);
      onReadyRef.current?.();
    }

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      timer?.disconnect();
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
      if (onScroll) window.removeEventListener('scroll', onScroll);
      if (onResize) window.removeEventListener('resize', onResize);
      if (controls) controls.dispose();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement?.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
      try {
        if (scene) {
          scene.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            if (mesh.geometry) mesh.geometry.dispose?.();
            if (mesh.material) {
              if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose?.());
              else (mesh.material as THREE.Material).dispose?.();
            }
          });
        }
      } catch {
        /* ignore */
      }
    };
  }, []);

  return <div id="hero-canvas" className="hero-canvas" ref={hostRef} />;
}
