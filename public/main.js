const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  24,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//Tworzenie szescianu
const cubeColor = new THREE.Color(0xfad36e);
const cubeGeometry = new THREE.BoxGeometry(1, 2, 1);
const cubeMaterial = new THREE.MeshPhongMaterial({
  color: cubeColor,
  shininess: 80,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-4, -4, -10);
//Tworzenie kuli - slonca

const sunGeometry = new THREE.SphereGeometry(0.5, 64, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xf5c23d });
const sunSphere = new THREE.Mesh(sunGeometry, sunMaterial);
sunSphere.position.set(0,0,0);
scene.add(sunSphere);

//Tworzenie światla
const lightColor = new THREE.Color(0xf5c23d);
const light = new THREE.PointLight(lightColor, 2);
const light2 = new THREE.PointLight(lightColor, 2);
light.position.z = 20;
light.position.x = -20;
light.position.y = -20;
light2.position.set(20, -20, -20);

const spotlight = new THREE.PointLight(0xcccc22, 10, 50);
spotlight.position.set(0,0,0);
scene.add(spotlight);

//Dodanie obiektow do sceny

// scene.add(light);
// scene.add(light2);
scene.add(cube);

//Ustawienie camery
camera.position.z = 15;

//Resize strony
const handleResize = () => {
  const { innerWidth, innerHeight } = windowrenderer.setSize(
    innerWidth,
    innerHeight
  );
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix; //odswiezenie obrazu kamery
};

const createSphere = (r = 0.1, color = 0xffffff) => {
  const sphereMat = new THREE.MeshPhongMaterial({
    color,
    shininess: 50,
  });
  const sphereGeometry = new THREE.SphereGeometry(r, 50, 50);
  return new THREE.Mesh(sphereGeometry, sphereMat);
};

const createLight = (i = 1, color = 0xffffff) => {
  return new THREE.PointLight(color, i);
};

createPlanet = (r = 0.4, color = 0xffffff) => {
  const sphere = createSphere(r, color);
  const orbit = new THREE.Object3D();
  orbit.add(sphere);
  return { sphere, orbit };
};

const planet1 = createPlanet(0.1);
console.log(planet1);
planet1.sphere.position.set(1, 1, 1);

scene.add(planet1.orbit);
//Animacja
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.z += 0.005;
  planet1.orbit.rotation.z += 0.01;
};

animate();

window.addEventListener("resize", handleResize);
