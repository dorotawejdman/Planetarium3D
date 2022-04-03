const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  24,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//Tworzenie szescianu
const cubeColor = new THREE.Color("hsl(90, 100%,60%)");
const cubeGeometry = new THREE.BoxGeometry(1, 2, 1);
const cubeMaterial = new THREE.MeshPhongMaterial({
  color: cubeColor,
  shininess: 80,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-1, -2, -10);
//Tworzenie kuli - slonca

const sunGeometry = new THREE.SphereGeometry(0.2, 64, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sunSphere = new THREE.Mesh(sunGeometry, sunMaterial);
sunSphere.position.set(1, 1, 1);
scene.add(sunSphere);

//Tworzenie światla
const lightColor = new THREE.Color("hsl(30, 100%, 90%)");
const light = new THREE.PointLight(lightColor, 2);
const light2 = new THREE.PointLight(lightColor, 2);
light.position.z = 20;
light.position.x = -20;
light.position.y = -20;
light2.position.set(20, -20, -20);

const spotlight = new THREE.PointLight(0xff0000, 10, 100);
spotlight.position.set(1, 1, 1);
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

//Animacja
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.z += 0.005;
};

animate();
