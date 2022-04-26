import * as THREE from "three";
import { getPlanetPosition, getIds } from "./planets.service.js";
import { createPlanet, createSphere, createLight, createCube } from "./helper";
import { planetColors } from "./constants";
getIds().then((res) => {});

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

// Pobranie pozycji planet i usytuowanie ich na scenie
function getPlanets() {
  let codes = [199, 299, 399, 499, 599, 699, 799, 899];
  codes.forEach((planetId, i) => {
    getPlanetPosition(`${planetId}`)
      .then((res) => {
        let sphere = createSphere(0.05, planetColors[i]);
        sphere.position.set(res.X, res.Y, res.Z);
        scene.add(sphere);
        console.log("planet position", res);
      })
      .catch((err) => {
        console.log("Problem");
      });
  });
}
getPlanets();
console.log(scene);
//Tworzenie kuli - slonca
const sun = createSphere(0.1, 0xffc838, [0, 0, 0]);
scene.add(sun);

//Tworzenie światla
const lightColor = new THREE.Color(0x829393);

//Swiatlo boczne

const light = createLight(lightColor, 2, 0, [0, 7, 50]);
scene.add(light);

const spotlight = createLight(0xf5c23d, 10, 50, [0, 0]);
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
  if (global.cube) {
    cube.rotation.x += 0.01;
    cube.rotation.z += 0.005;
  }

  // planet1.orbit.rotation.z += 0.001;
};
animate();
