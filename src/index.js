import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { getPlanetPosition } from "./planets.service.js";
import { createSphere, createLight, customMaterial } from "./helper";
import {
  planetColors,
  constants,
  stepInHours,
  planetRotationTime,
} from "./constants";

const cleanScene = (scene) => {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  renderer.render(scene, camera);
};

const sendForm = (event) => {
  cancelAnimation();
  const formData = new FormData(event.target);
  event.preventDefault();
  createSunAndLights(scene);
  let startDate = formData.get("startDate");
  let stopDate = formData.get("stopDate");
  let step = formData.get("step");
  sleepTime = formData.get("speed");
  getPlanets(codes, scene, startDate, stopDate, step).then((response) => {
    planets = response;
    animate();
  });
};

const restartAnimation = () => {
  sleepTime = document.getElementById("speed").value;

  count = 0;
  if (!planets) {
    createSunAndLights(scene);
    planets = {};
    for (let item of codes) {
      let position = Object.values(JSON.parse(localStorage.getItem(item))[0]);
      let radius = localStorage.getItem("radius" + item);
      let sphere = createSphere(
        +radius,
        "fx000000",
        [position.X, position.Y, position.Z],
        "textured", //planetMat/starMat
        Math.floor(item / 100) - 1
      );
      planets[item] = sphere;
      scene.add(sphere);
    }
    animate();
  }
  console.log("restart");
};

const cancelAnimation = () => {
  window.cancelAnimationFrame(anim);
  cleanScene(scene);
  count = 0;
  planets = null;
  console.log("cancel");
};

// Arrow keys controls
const handleMovement = (event, camera) => {
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

//Resize strony
const handleResize = (renderer, camera) => {
  const innerHeight = window.innerHeight;
  const innerWidth = window.innerWidth;

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix(); //odswiezenie obrazu kamery
};

async function getPlanets(codes, scene, startDate, stopDate, step) {
  let planets = {};
  for (let item of codes) {
    const i = codes.indexOf(item);
    const res = await getPlanetPosition(`${item}`, startDate, stopDate, step);
    if (res) {
      let sphere = createSphere(
        res.data.radius,
        planetColors[i],
        [res.data.position.X, res.data.position.Y, res.data.position.Z],
        "textured", //planetMat/starMat
        Math.floor(item / 100) - 1
      );
      planets[item] = sphere;
      scene.add(sphere);

      //ADD plane
      console.log(res.data.position[0]);
      var mathPlane = new THREE.Plane();
      const plane = mathPlane.setFromCoplanarPoints(
        new THREE.Vector3(...Object.values(res.data.position[0])),
        new THREE.Vector3(...Object.values(res.data.position[1])),
        new THREE.Vector3(...Object.values(res.data.position[2]))
      );
      const localstorage = window.localStorage;
      localstorage.setItem("normal" + item, JSON.stringify(plane.normal));
      console.log(plane.normal);
    }
  }
  return planets;
}

function createSunAndLights(scene) {
  //Tworzenie kuli - slonca
  const sunRadiusNormal = 70000 / constants.radiusModifier;
  const sun = createSphere(0.5, 0xffc838, [0, 0, 0]);
  const sunCentrum = createSphere(
    0.2,
    0xffdf98,
    [0, 0, 0],
    "starMat", //planetMat/starMat
    8
  );
  sun.material = customMaterial;
  scene.add(sun);
  scene.add(sunCentrum);
  //Slonce
  const spotlight = createLight(0xffdf98, 1, 50, [0, 0]);
  scene.add(spotlight);

  //Tworzenie światla
  const lightColor = new THREE.Color(0x829393);
  //Swiatlo globalne
  const lightGlobal = new THREE.AmbientLight(0x202020); // soft white light
  scene.add(lightGlobal);
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

//Tworzenie sceny, kamery, renderera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  24, // Camera frustum vertical field of view. From bottom to top of view, in degrees. Default is 50.
  window.innerWidth / window.innerHeight,
  0.1, // Camera frustum near plane.
  1000 // Camera frustum far plane.
);
//Ustawienie camery
camera.position.z = 15;

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.autoClear = false;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Event listenery
var form = document.getElementById("planetsForm");
form.addEventListener("submit", sendForm);

document
  .getElementById("restartBtn")
  .addEventListener("click", restartAnimation);

document.getElementById("cancelBtn").addEventListener("click", cancelAnimation);

document.addEventListener("keydown", handleMovement, camera);

window.addEventListener("resize", () => {
  handleResize(renderer, camera);
});

handleResize(renderer, camera);

//GLOBAL variables
let codes = [199, 299, 399, 499, 599, 699, 799, 899];
let planets;
var count = 0;
var anim;
var sleepTime = 0;

function rotateAroundObjectAxis(object, axis, radians) {
  const rotObjectMatrix = new THREE.Matrix4();
  rotObjectMatrix.makeRotationAxis(axis, radians);
  object.matrix.multiply(rotObjectMatrix);
  console.log(axis.normalize(), rotObjectMatrix, object.rotation);
  object.rotation.setFromRotationMatrix(object.matrix);
}

const animate = () => {
  if (count < JSON.parse(localStorage.getItem("199")).length) {
    document.getElementsByClassName("count").innerHTML = "" + count;

    sleep(+sleepTime);
    for (let code of codes) {
      setTimeout(() => {
        if (JSON.parse(localStorage.getItem(code))[count] && planets) {
          planets[code].position.set(
            ...Object.values(JSON.parse(localStorage.getItem(code))[count])
          );
          var xAxis = new THREE.Vector3(
            ...Object.values(JSON.parse(localStorage.getItem("normal" + code)))
          );
          console.log(planets[code].rotation);
          planets[code].rotateOnAxis(xAxis, Math.PI / 10);
        }
      }, 0);
    }
    count += 1;
  } else {
  }
  anim = requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();
  console.log("animate");

  // planet1.orbit.rotation.z += 0.001;
};
