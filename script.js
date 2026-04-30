// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("space"),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// 🖱️ Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 10;
controls.maxDistance = 100;

// 🌌 Ambient light (soft lighting)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// ☀️ Sun light
const light = new THREE.PointLight(0xffffff, 3, 500);
light.position.set(0, 0, 0);
scene.add(light);

// 🌞 Realistic Sun
const sunTexture = new THREE.TextureLoader().load(
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/sun.jpg"
);
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(3, 64, 64),
  new THREE.MeshBasicMaterial({ map: sunTexture })
);
scene.add(sun);

// ✨ Sun glow
const glow = new THREE.Mesh(
  new THREE.SphereGeometry(3.8, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.4
  })
);
scene.add(glow);

// 🌍 Earth
const earthTexture = new THREE.TextureLoader().load(
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"
);
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 64, 64),
  new THREE.MeshStandardMaterial({ map: earthTexture })
);
scene.add(earth);

// ☁️ Earth clouds
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

// 🔴 Mars
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xff4500 })
);
scene.add(mars);

// 🟡 Venus
const venus = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xffcc99 })
);
scene.add(venus);

// 🪐 Saturn
const saturn = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xd2b48c })
);
scene.add(saturn);

// 🪐 Saturn rings (better)
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

// ⭐ Stars (better density + size)
const starsGeometry = new THREE.BufferGeometry();
const starCount = 8000;
const positions = [];

for (let i = 0; i < starCount; i++) {
  positions.push(
    (Math.random() - 0.5) * 3000,
    (Math.random() - 0.5) * 3000,
    (Math.random() - 0.5) * 3000
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

// Camera
camera.position.z = 30;

// Animation
function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.0004;

  // 🌍 Earth orbit + rotation
  earth.position.x = Math.cos(time) * 10;
  earth.position.z = Math.sin(time) * 10;
  earth.rotation.y += 0.01;
  clouds.rotation.y += 0.012;

  // 🔴 Mars
  mars.position.x = Math.cos(time * 0.8) * 15;
  mars.position.z = Math.sin(time * 0.8) * 15;

  // 🟡 Venus
  venus.position.x = Math.cos(time * 1.2) * 7;
  venus.position.z = Math.sin(time * 1.2) * 7;

  // 🪐 Saturn
  saturn.position.x = Math.cos(time * 0.6) * 20;
  saturn.position.z = Math.sin(time * 0.6) * 20;

  // 🌞 Sun rotation
  sun.rotation.y += 0.002;

  // Controls
  controls.update();

  renderer.render(scene, camera);
}

animate();

// 📱 Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
