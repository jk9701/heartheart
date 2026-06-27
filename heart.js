const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

camera.position.z = 520;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const path = document.querySelector("#heart-path");
const length = path.getTotalLength();

const vertices = [];
const tl = gsap.timeline();

for (let i = 0; i < length; i += 0.7) {
  const point = path.getPointAtLength(i);

  const vector = new THREE.Vector3(
    point.x - 300,
    -point.y + 280,
    0
  );

  vector.x += (Math.random() - 0.5) * 25;
  vector.y += (Math.random() - 0.5) * 25;
  vector.z += (Math.random() - 0.5) * 80;

  vertices.push(vector);

  tl.from(vector, {
    x: 0,
    y: 0,
    z: 0,
    ease: "power2.inOut",
    duration: gsap.utils.random(2, 5)
  }, i * 0.002);
}

const originalVertices = vertices.map(v => v.clone());

const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

const material = new THREE.PointsMaterial({
  size: 4,
  color: 0xff2a6d,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const particles = new THREE.Points(geometry, material);
particles.scale.set(1.5, 1.5, 1.5);
scene.add(particles);

const starVertices = [];

for (let i = 0; i < 900; i++) {
  starVertices.push(
    new THREE.Vector3(
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 1200,
      (Math.random() - 0.5) * 1000
    )
  );
}

const starGeometry = new THREE.BufferGeometry().setFromPoints(starVertices);

const starMaterial = new THREE.PointsMaterial({
  size: 1.4,
  color: 0xffffff,
  transparent: true,
  opacity: 0.55
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

let isPressed = false;

function scatterHeart() {
  isPressed = true;

  vertices.forEach((v) => {
    gsap.to(v, {
      x: v.x + (Math.random() - 0.5) * 900,
      y: v.y + (Math.random() - 0.5) * 900,
      z: v.z + (Math.random() - 0.5) * 900,
      duration: 0.8,
      ease: "power3.out"
    });
  });
}

function collectHeart() {
  isPressed = false;

  vertices.forEach((v, i) => {
    gsap.to(v, {
      x: originalVertices[i].x,
      y: originalVertices[i].y,
      z: originalVertices[i].z,
      duration: 1.3,
      ease: "power3.inOut"
    });
  });
}

window.addEventListener("mousedown", scatterHeart);
window.addEventListener("mouseup", collectHeart);

window.addEventListener("touchstart", scatterHeart);
window.addEventListener("touchend", collectHeart);

function animate() {
  requestAnimationFrame(animate);

  const t = Date.now() * 0.001;

  material.color.setHSL((Math.sin(t) + 1) / 2, 1, 0.6);

  particles.rotation.y += 0.003;
  particles.rotation.z += 0.001;

  stars.rotation.y += 0.0005;
  stars.rotation.x += 0.0002;

  if (isPressed) {
    vertices.forEach((v) => {
      v.x += (Math.random() - 0.5) * 0.7;
      v.y += (Math.random() - 0.5) * 0.7;
    });
  }

  geometry.setFromPoints(vertices);

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
