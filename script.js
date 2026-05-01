// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.00025);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("space"),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;

// 🎬 BLOOM SETUP
const composer = new THREE.EffectComposer(renderer);

const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new THREE.UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.8, // strength
  0.5, // radius
  0.6  // threshold
);
composer.addPass(bloomPass);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 10;
controls.maxDistance = 200;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff, 6, 2000);
scene.add(light);

// ================= 🌞 REALISTIC SUN =================

// High quality texture
const sunTexture = new THREE.TextureLoader().load(
  "https://www.solarsystemscope.com/textures/download/2k_sun.jpg"
);

// Core Sun
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(3, 128, 128),
  new THREE.MeshBasicMaterial({
    map: sunTexture,
    color: 0xffffff
  })
);
scene.add(sun);

// Corona (fiery edge)
const coronaTexture = new THREE.TextureLoader().load(
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/lensflare/lensflare0.png"
);

const corona = new THREE.Mesh(
  new THREE.SphereGeometry(4.5, 64, 64),
  new THREE.MeshBasicMaterial({
    map: coronaTexture,
    color: 0xffaa00,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
);
scene.add(corona);

// Outer glow
const outerGlow = new THREE.Mesh(
  new THREE.SphereGeometry(6, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0xff5500,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  })
);
scene.add(outerGlow);

// ================= 🌍 EARTH =================

const earthTexture = new THREE.TextureLoader().load(
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"
);

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 64, 64),
  new THREE.MeshStandardMaterial({ map: earthTexture })
);
scene.add(earth);

// Clouds
const cloudTexture = new THREE.TextureLoader().load(
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png"
);

const clouds = new THREE.Mesh(
  new THREE.SphereGeometry(1.55, 64, 64),
  new THREE.MeshStandardMaterial({
    map: cloudTexture,
    transparent: true
  })
);
earth.add(clouds);

// ================= PLANETS =================

// Mars
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xff4500 })
);
scene.add(mars);

// Venus
const venus = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xffcc99 })
);
scene.add(venus);

// Saturn
const saturn = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xd2b48c })
);
scene.add(saturn);

// Saturn Rings
const ring = new THREE.Mesh(
  new THREE.RingGeometry(2, 3.5, 64),
  new THREE.MeshBasicMaterial({
    color: 0xdddddd,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7
  })
);
ring.rotation.x = Math.PI / 2;
saturn.add(ring);

// ================= ⭐ STARS =================

const starsGeometry = new THREE.BufferGeometry();
const starCount = 15000;
const positions = [];

for (let i = 0; i < starCount; i++) {
  positions.push(
    (Math.random() - 0.5) * 5000,
    (Math.random() - 0.5) * 5000,
    (Math.random() - 0.5) * 5000
  );
}

starsGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);

const stars = new THREE.Points(
  starsGeometry,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.2
  })
);
scene.add(stars);

// ================= 🌌 NEBULA =================

const nebulaTexture = new THREE.TextureLoader().load(
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"
);

const nebula = new THREE.Mesh(
  new THREE.SphereGeometry(2500, 64, 64),
  new THREE.MeshBasicMaterial({
    map: nebulaTexture,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.08
  })
);
scene.add(nebula);

// Camera
camera.position.z = 50;

// ================= 🎬 ANIMATION =================

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.0004;

  // Earth orbit
  earth.position.x = Math.cos(time) * 10;
  earth.position.z = Math.sin(time) * 10;
  earth.rotation.y += 0.01;
  clouds.rotation.y += 0.012;

  // Mars
  mars.position.x = Math.cos(time * 0.8) * 15;
  mars.position.z = Math.sin(time * 0.8) * 15;

  // Venus
  venus.position.x = Math.cos(time * 1.2) * 7;
  venus.position.z = Math.sin(time * 1.2) * 7;

  // Saturn
  saturn.position.x = Math.cos(time * 0.6) * 20;
  saturn.position.z = Math.sin(time * 0.6) * 20;

  // Sun animation
  sun.rotation.y += 0.002;
  corona.rotation.y -= 0.001;

  const pulse = 0.15 * Math.sin(Date.now() * 0.004);
  corona.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
  outerGlow.scale.set(1 + pulse * 1.5, 1 + pulse * 1.5, 1 + pulse * 1.5);

  controls.update();

  // 🎬 IMPORTANT: use composer instead of renderer
  composer.render();
}

animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});
