// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("space")
});
renderer.setSize(window.innerWidth, window.innerHeight);

// 🌍 Earth geometry
const geometry = new THREE.SphereGeometry(2, 32, 32);

// Texture (Earth image)
const texture = new THREE.TextureLoader().load(
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"
);

// Material
const material = new THREE.MeshBasicMaterial({ map: texture });

// Mesh
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

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

// Position camera
camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate Earth
  earth.rotation.y += 0.002;

  renderer.render(scene, camera);
}

animate();
