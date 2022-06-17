import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  getPlanetPosition,
  getIds,
  normalizePosition,
} from "./planets.service.js";
import { createPlanet, createSphere, createLight, createCube } from "./helper";
import { planetColors, constants } from "./constants";

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
  24, // Camera frustum vertical field of view. From bottom to top of view, in degrees. Default is 50.
  window.innerWidth / window.innerHeight,
  0.1, // Camera frustum near plane.
  1000 // Camera frustum far plane.
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

const controls = new OrbitControls(camera, renderer.domElement);
handleResize();
document.body.appendChild(renderer.domElement);

const planets = {};
let codes = [199, 299, 399, 499, 599, 699, 799, 899];
async function getPlanets() {
  for (let item of codes) {
    const i = codes.indexOf(item);
    const res = await getPlanetPosition(`${item}`);
    if (res) {
      let sphere = createSphere(res.data.radius, planetColors[i]);
      sphere.position.set(
        res.data.position.X,
        res.data.position.Y,
        res.data.position.Z
      );
      planets[item] = sphere;
      console.log(planets);
      scene.add(sphere);
    }
  }
}
getPlanets();
console.log(planets);

//Tworzenie kuli - slonca
const sunRadiusNormal = 70000 / constants.radiusModifier;
const sun = createSphere(0.03, 0xffc838, [0, 0, 0]);
const sunCentrum = createSphere(
  sunRadiusNormal,
  0xffc838,
  [0, 0, 0],
  "starMat"
);
scene.add(sun);
scene.add(sunCentrum);
//Slonce
const spotlight = createLight(0xf5c23d, 2, 50, [0, 0]);
scene.add(spotlight);

//Tworzenie światla
const lightColor = new THREE.Color(0x829393);
//Swiatlo boczne
const light = createLight(lightColor, 1.2, 0, [0, 7, 50]);
// scene.add(light);
const lightGlobal = new THREE.AmbientLight(0x404040); // soft white light
scene.add(lightGlobal);

//Dodawanie tekstur
const textureLoader = new THREE.TextureLoader();
// const normalTexture = textureLoader.load("/textures/NormalMap.png");

//Ustawienie camery
camera.position.z = 15;

//Animacja
const localStorage = window.localStorage;
let count = 0;
const animate = () => {
  // console.log(JSON.parse(localStorage.getItem(planetId)))
  if (count < 100) {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (global.cube) {
      cube.rotation.x += 0.01;
      cube.rotation.z += 0.005;
    }
    for (let code of codes) {
      console.log(
        normalizePosition(JSON.parse(localStorage.getItem(code))[count])
      );
      console.log(planets);
      planets[code].position.set(
        ...Object.values(JSON.parse(localStorage.getItem(code))[count])
      );
    }

    controls.update();
    // planet1.orbit.rotation.z += 0.001;
  }

  count += 1;
};
animate();
