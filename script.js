// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("space")
});
renderer.setSize(window.innerWidth, window.innerHeight);

// 🖱️ Mouse controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ☀️ Light (Sun)
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(0, 0, 0);
scene.add(light);

// 🌞 Sun (glow effect)
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xffaa00,
  emissive: 0xff5500,
  emissiveIntensity: 1
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// 🌍 Earth
const earthGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const earthTexture = new THREE.TextureLoader().load(
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"
);
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// 🔴 Mars
const marsGeometry = new THREE.SphereGeometry(1, 32, 32);
const marsMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
scene.add(mars);

// 🟡 Venus
const venusGeometry = new THREE.SphereGeometry(1.2, 32, 32);
const venusMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
const venus = new THREE.Mesh(venusGeometry, venusMaterial);
scene.add(venus);

// 🪐 Saturn
const saturnGeometry = new THREE.SphereGeometry(1.2, 32, 32);
const saturnMaterial = new THREE.MeshStandardMaterial({ color: 0xd2b48c });
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
scene.add(saturn);

// 🪐 Saturn Rings
const ringGeometry = new THREE.RingGeometry(2, 3, 32);
const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2;
saturn.add(ring);

// ⭐ Stars
const starsGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const positions = [];

for (let i = 0; i < starCount; i++) {
  positions.push(
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000
  );
}

starsGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);

const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 1
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Camera position
camera.position.z = 25;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.0005;

  // 🌍 Earth orbit
  earth.position.x = Math.cos(time) * 10;
  earth.position.z = Math.sin(time) * 10;
  earth.rotation.y += 0.01;

  // 🔴 Mars orbit
  mars.position.x = Math.cos(time * 0.8) * 15;
  mars.position.z = Math.sin(time * 0.8) * 15;

  // 🟡 Venus orbit
  venus.position.x = Math.cos(time * 1.2) * 7;
  venus.position.z = Math.sin(time * 1.2) * 7;

  // 🪐 Saturn orbit
  saturn.position.x = Math.cos(time * 0.6) * 20;
  saturn.position.z = Math.sin(time * 0.6) * 20;

  // 🖱️ Update controls
  controls.update();

  renderer.render(scene, camera);
}

animate();

// 📱 Resize fix
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
