import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
  getPlanetPosition,
  getIds,
  normalizePosition,
} from "./planets.service.js";
import { createPlanet, createSphere, createLight, createCube } from "./helper";
import { planetColors, constants } from "./constants";
import { Parameters } from "./parameters";


const cleanScene = (scene) => {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  renderer.render(scene, camera);
};

var form = document.getElementById("planetsForm");
let sendForm = (event) => {
  count = 0;
  cleanScene(scene);
  const formData = new FormData(event.target);
  event.preventDefault();
  main();
  let startDate = formData.get("startDate");
  let stopDate = formData.get("stopDate");
  let step = formData.get("step");
  sleepTime = formData.get("speed");
  getPlanets(codes, scene, startDate, stopDate, step).then((response) => {
    planets = response;
    animate();
    //Animacja
  });
  console.log(formData, event.target, formData.get("startDate"));
};
form.addEventListener("submit", sendForm);
document.getElementById("restartBtn").addEventListener("click", () => {
  count = 0;
  if(!planets) {
    main();
    planets = {}
    for (let item of codes) {
      let position = Object.values(JSON.parse(localStorage.getItem(item))[0])
      let radius = localStorage.getItem('radius'+item)
      console.log(position, radius)
      let sphere = createSphere(
        +radius,
        'fx000000',
        [position.X, position.Y, position.Z],
        "textured", //planetMat/starMat
        Math.floor(item / 100) - 1
      );
      planets[item] = sphere;
      scene.add(sphere);
    }
    console.log(planets)
    animate();
    console.log(scene)
  }


  console.log("restart");
});
document.getElementById("cancelBtn").addEventListener("click", () => {
  window.cancelAnimationFrame(anim);
  count = 0;
  console.log("cancel");
  cleanScene(scene);
});
//
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
      console.log("   item[0]", Math.floor(item / 100) - 1);
      let sphere = createSphere(
        res.data.radius,
        planetColors[i],
        [res.data.position.X, res.data.position.Y, res.data.position.Z],
        "textured", //planetMat/starMat
        Math.floor(item / 100) - 1
      );
      planets[item] = sphere;

      scene.add(sphere);
    }
  }
  return planets;
}

// const animate = () => {
//   // console.log(JSON.parse(localStorage.getItem(planetId)))

//   requestAnimationFrame(animate);

//   renderer.render(scene, camera);

//   // planet1.orbit.rotation.z += 0.001;

// };

function createSunAndLights(scene) {
  //Tworzenie kuli - slonca
  const sunRadiusNormal = 70000 / constants.radiusModifier;
  // const sun = createSphere(0.03, 0xffc838, [0, 0, 0]);
  const sunCentrum = createSphere(
    0.2,
    0xffc838,
    [0, 0, 0],
    "starMat", //planetMat/starMat
    8
  );
  sunCentrum.layers.set(1);
  // scene.add(sun);
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

document.addEventListener("keydown", handleMovement, camera);
window.addEventListener("resize", () => {
  handleResize(renderer, camera);
});
handleResize(renderer, camera);
let codes = [199, 299, 399, 499, 599, 699, 799, 899];

let planets;

// let params = new Parameters();

/////////////////////////////////BLOOM
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 10; //intensity of glow
bloomPass.radius = 1;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);
///////////////////////////////

function main() {
  // getIds().then((res) => {
  //   console.log(res);
  // });

  createSunAndLights(scene);
  const localStorage = window.localStorage;
}

var count = 0;
var anim;
var sleepTime = 0;
// const counter = document.getElementsByClassName("count");
// console.log(counter);
const animate = () => {
  if (count < JSON.parse(localStorage.getItem("199")).length) {
    document.getElementsByClassName("count").innerHTML = "" + count;
    // console.log(document.getElementsByClassName("count").innerHTML);

    sleep(+sleepTime);
    for (let code of codes) {
      setTimeout(() => {
        if (JSON.parse(localStorage.getItem(code))[count]) {
          planets[code].position.set(
            ...Object.values(JSON.parse(localStorage.getItem(code))[count])
          );
        }
      }, 0);
    }
    // console.log(count, scene, " scene\n", scene.children[6].position);
    count += 1;
  } else {
  }
  anim = requestAnimationFrame(animate);

  renderer.clear();
  
  camera.layers.set(1);
  bloomComposer.render();
  
  // renderer.clearDepth();
  camera.layers.set(0);
  renderer.render(scene, camera);

  // renderer.render(scene, camera);
  // camera.layers.set(1);
  // bloomComposer.render();
  // camera.layers.set(0);
  // renderer.render(scene, camera);
  controls.update();
  console.log("animate");

  // planet1.orbit.rotation.z += 0.001;
};
