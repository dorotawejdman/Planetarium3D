import * as THREE from "three";
import { callNasa } from "./data.js";
import axios from "axios";
var data;
axios.defaults.baseURL = "http://localhost:3000/";

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

const planetNames = ["Earth", "Mars", "Saturn", "Mercury", "Venus", "Jupiter", "Uranus", "Neptune", "Pluto"]
// MAIN
//Pobranie danych
function getIds() {
  return axios({
    method: "get",
    url: "planetsIds",
  }).catch((err)=>{
    // console.log(err)
  }).then((res)=>{
    res.data.forEach(element => {
      planetNames.forEach(planet => {
        if(element.includes(planet+'  ')){
          // console.log(planet,":\n",element)
        }
      })
    });
  })
}





// let dataNasa;
// sessionStorage.setItem("dataNasa", dataNasa);
// const getDataFromNasa = async function () {
//   dataNasa = await callNasa();
//   console.log("DATA", +dataNasa);
//   const dataNasaNormalizeX = (+dataNasa.X / 2.5e8) * 3;
//   const dataNasaNormalizeY = (+dataNasa.Y / 2.5e8) * 3;
//   const dataNasaNormalizeZ = (+dataNasa.Z / 2.5e8) * 3;
//   console.log(dataNasaNormalizeX, dataNasaNormalizeY, dataNasaNormalizeZ);
//   sessionStorage.setItem("dataNasa", dataNasa);

//   let sphere1 = createSphere();
//   sphere1.position.set(
//     dataNasaNormalizeX,
//     dataNasaNormalizeY,
//     dataNasaNormalizeZ
//   );
//   scene.add(sphere1);
// };
// getDataFromNasa();


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


//Calle do api
function getPlanetPosition(planetId) {
  return axios({
    method: "get",
    url: `celestialBody/${planetId}`,
  }).catch((err)=>{
    console.log(err)
  }).then((res)=>{
    let sphere1 = createSphere();
    sphere1.position.set(
      (+res.data.X / 2.5e8) * 3,
      (+res.data.Y / 2.5e8) * 3,
      (+res.data.Z / 2.5e8) * 3
    );
    scene.add(sphere1);
    console.log("done", res.data.Z,     (+res.data.X / 2.5e8) * 3,
    (+res.data.Y / 2.5e8) * 3,
    (+res.data.Z / 2.5e8) * 3)
  })
}

getIds().then(res=>{

});


function getPlanets() {
  let codes =[199,299,399,499,599,699,799,899]
  codes.forEach(planetId=>{
    getPlanetPosition(`${planetId}`).then(res=>{
      // console.log('planet position',res)
    })
  })
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
const sunGeometry = new THREE.SphereGeometry(0.5, 64, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xf5c23d });
const sunSphere = new THREE.Mesh(sunGeometry, sunMaterial);
sunSphere.position.set(0, 0, 0);
scene.add(sunSphere);

//Tworzenie światla
const lightColor = new THREE.Color(0x223333);

//Swiatlo boczne
const light = new THREE.PointLight(lightColor, 2);
light.position.set(0, 7, 20);
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

// Tworzenie planety
const planet1 = createPlanet(0.1);
planet1.sphere.position.set(1, 1, 1);
// planet1.sphere.material.normalMap = normalTexture;
scene.add(planet1.orbit);

//Animacja
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.z += 0.005;
  planet1.orbit.rotation.z += 0.001;
};
animate();
