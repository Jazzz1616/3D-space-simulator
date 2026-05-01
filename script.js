// ================= SETUP =================

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
camera.position.z = 50;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("space"),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;

// ================= BLOOM =================

const composer = new THREE.EffectComposer(renderer);

const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new THREE.UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5, // strength
  0.4, // radius
  0.7  // threshold
);
composer.addPass(bloomPass);

// ================= CONTROLS =================

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 10;
controls.maxDistance = 200;

// ================= LIGHT =================

scene.add(new THREE.AmbientLight(0xffffff, 0.15));

const sunLight = new THREE.PointLight(0xffffff, 6, 2000);
scene.add(sunLight);

// ================= SUN =================

const textureLoader = new THREE.TextureLoader();

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(3, 128, 128),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("https://www.solarsystemscope.com/textures/download/2k_sun.jpg")
  })
);
scene.add(sun);

// Corona
const corona = new THREE.Mesh(
  new THREE.SphereGeometry(4.5, 64, 64),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/lensflare/lensflare0.png"),
    color: 0xffaa00,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
);
scene.add(corona);

// Outer glow
const glow = new THREE.Mesh(
  new THREE.SphereGeometry(6, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0xff5500,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  })
);
scene.add(glow);

// ================= EARTH =================

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 64, 64),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg")
  })
);
scene.add(earth);

// Clouds
const clouds = new THREE.Mesh(
  new THREE.SphereGeometry(1.55, 64, 64),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png"),
    transparent: true
  })
);
earth.add(clouds);

// ================= PLANETS =================

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xff4500 })
);
scene.add(mars);

const venus = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xffcc99 })
);
scene.add(venus);

const saturn = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xd2b48c })
);
scene.add(saturn);

// Saturn rings
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

// ================= STARS =================

const starGeometry = new THREE.BufferGeometry();
const starCount = 12000;
const starPositions = [];

for (let i = 0; i < starCount; i++) {
  starPositions.push(
    (Math.random() - 0.5) * 5000,
    (Math.random() - 0.5) * 5000,
    (Math.random() - 0.5) * 5000
  );
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starPositions, 3)
);

const stars = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({ color: 0xffffff, size: 1.2 })
);
scene.add(stars);

// ================= ANIMATION =================

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.0004;

  // Orbits
  earth.position.set(Math.cos(time) * 10, 0, Math.sin(time) * 10);
  mars.position.set(Math.cos(time * 0.8) * 15, 0, Math.sin(time * 0.8) * 15);
  venus.position.set(Math.cos(time * 1.2) * 7, 0, Math.sin(time * 1.2) * 7);
  saturn.position.set(Math.cos(time * 0.6) * 20, 0, Math.sin(time * 0.6) * 20);

  // Rotation
  earth.rotation.y += 0.01;
  clouds.rotation.y += 0.012;
  sun.rotation.y += 0.002;
  corona.rotation.y -= 0.001;

  // Glow pulse
  const pulse = 0.15 * Math.sin(Date.now() * 0.004);
  corona.scale.setScalar(1 + pulse);
  glow.scale.setScalar(1 + pulse * 1.5);

  controls.update();

  composer.render();
}

animate();

// ================= RESIZE =================

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});
