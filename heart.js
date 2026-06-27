const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
//or z = 400 for bif one
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const path = document.querySelector("#heart-path");
const length = path.getTotalLength();

const vertices = [];
const tl = gsap.timeline();

for (let i = 0; i < length; i += 0.8) {
  const point = path.getPointAtLength(i);

  const vector = new THREE.Vector3(
    point.x - 300,
    -point.y + 280,
    0
  );

  vector.x += (Math.random() - 0.5) * 30;
  vector.y += (Math.random() - 0.5) * 30;
  vector.z += (Math.random() - 0.5) * 70;

  vertices.push(vector);

  tl.from(vector, {
    x: 0,
    y: 0,
    z: 0,
    ease: "power2.inOut",
    duration: gsap.utils.random(2, 5)
  }, i * 0.002);
}

const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

const material = new THREE.PointsMaterial({
  size: 3,
  color: 0xff2a6d
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

function animate() {
  requestAnimationFrame(animate);

  particles.rotation.y += 0.003;
  particles.rotation.z += 0.001;

  geometry.setFromPoints(vertices);

  renderer.render(scene, camera);
}

animate();
