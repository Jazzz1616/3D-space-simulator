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

// Earth geometry
const geometry = new THREE.SphereGeometry(2, 32, 32);

// Texture (Earth image)
const texture = new THREE.TextureLoader().load(
  "https://threejs.org/examples/textures/earth_atmos_2048.jpg"
);

// Material
const material = new THREE.MeshBasicMaterial({ map: texture });

// Mesh
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

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