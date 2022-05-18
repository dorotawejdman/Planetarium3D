import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { getPlanetPosition, getIds } from "./planets.service.js";
import { createPlanet, createSphere, createLight, createCube } from "./helper";
import { planetColors } from "./constants";
getIds().then((res) => {});

// Arrow keys controls
const handleMovement = (event) => {
  if (event.key === "ArrowUp") {
    camera.position.y += 3;
  }
  if (event.key === "ArrowDown") {
    camera.position.y -= 3;
  }
  if (event.key === "ArrowRight") {
    camera.position.x += 3;
  }
  if (event.key === "ArrowLeft") {
    camera.position.x -= 3;
  }
};
document.addEventListener("keydown", handleMovement);

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

const controls = new OrbitControls(camera, renderer.domElement);
handleResize();
document.body.appendChild(renderer.domElement);



async function getPlanets() {
  let codes = [199, 299, 399, 499, 599, 699, 799, 899]
  for (let item of codes) {  
    const i = codes.indexOf(item)
    const res = await getPlanetPosition(`${item}`)
    if (res) {
      let sphere = createSphere(res.data.radius, planetColors[i]);
      sphere.position.set(
        res.data.position.X,
        res.data.position.Y,
        res.data.position.Z
        );
      scene.add(sphere);
    }
  }
}
getPlanets()


//Tworzenie kuli - slonca
const sun = createSphere(0.02, 0xffc838, [0, 0, 0]);
const sunCentrum = createSphere(0.03, 0xffc838, [0, 0, 0], "starMat");
scene.add(sun);
scene.add(sunCentrum);
//Slonce
const spotlight = createLight(0xf5c23d, 2, 50, [0, 0]);
scene.add(spotlight);

//Tworzenie światla
const lightColor = new THREE.Color(0x829393);
//Swiatlo boczne
const light = createLight(lightColor, 1.2, 0, [0, 7, 50]);
scene.add(light);

//Dodawanie tekstur
const textureLoader = new THREE.TextureLoader();
// const normalTexture = textureLoader.load("/textures/NormalMap.png");

//Ustawienie camery
camera.position.z = 15;

//Animacja
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (global.cube) {
    cube.rotation.x += 0.01;
    cube.rotation.z += 0.005;
  }
  controls.update();
  // planet1.orbit.rotation.z += 0.001;
};
animate();
