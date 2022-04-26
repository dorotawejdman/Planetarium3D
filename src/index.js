import * as THREE from "three";
import { getPlanetPosition, getIds } from "./planets.service.js";
const planetColors = [
  "#2365c1",
  "#c1a323",
  "#23b6c1",
  "#23c166",
  "#9dc123",
  "#c12323",
  "#c12359",
  "#c123b1",
  "#c123b1",
];
getIds().then((res) => {});

//Helpers
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

const createPlanet = (r = 0.4, color = 0xffffff) => {
  const sphere = createSphere(r, color);
  const orbit = new THREE.Object3D();
  orbit.add(sphere);
  return { sphere, orbit };
};

//Resize strony
const handleResize = () => {
  const innerHeight = window.innerHeight;
  const innerWidth = window.innerWidth;

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix(); //odswiezenie obrazu kamery
};

window.addEventListener("resize", handleResize);

//Tworzenie sceny, kamery, renderera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  24,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
handleResize();
document.body.appendChild(renderer.domElement);

function getPlanets() {
  let codes = [199, 299, 399, 499, 599, 699, 799, 899];
  codes.forEach((planetId, i) => {
    getPlanetPosition(`${planetId}`).then((res) => {
      let sphere = createSphere(0.1, planetColors[i]);
      sphere.position.set(res.X, res.Y, res.Z);
      scene.add(sphere);
      console.log("planet position", res);
    });
  });
}
getPlanets();
//Tworzenie szescianu
const cubeColor = new THREE.Color(0xfad36e);
const cubeGeometry = new THREE.BoxGeometry(1, 2, 1);
const cubeMaterial = new THREE.MeshPhongMaterial({
  color: cubeColor,
  shininess: 80,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-4, -4, -10);
scene.add(cube);

//Tworzenie kuli - slonca
const sunGeometry = new THREE.SphereGeometry(0.1, 64, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xf5c23d });
const sunSphere = new THREE.Mesh(sunGeometry, sunMaterial);
sunSphere.position.set(0, 0, 0);
scene.add(sunSphere);

//Tworzenie światla
const lightColor = new THREE.Color(0x829393);

//Swiatlo boczne
const light = new THREE.PointLight(lightColor, 2);
light.position.set(0, 7, 50);
scene.add(light);
// const light2 = new THREE.PointLight(lightColor, 2);
// light2.position.set(20, -20, -20);
// scene.add(light2);

const spotlight = new THREE.PointLight(0xcccc22, 10, 50);
spotlight.position.set(0, 0, 0);
scene.add(spotlight);

//Dodawanie tekstur
const textureLoader = new THREE.TextureLoader();
// const normalTexture = textureLoader.load("/textures/NormalMap.png");

//Ustawienie camery
camera.position.z = 15;

//Animacja
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.z += 0.005;
  // planet1.orbit.rotation.z += 0.001;
};
animate();
