import * as THREE from "three";

//Dodawanie tekstur
const textureLoader = new THREE.TextureLoader();
// const normalTexture = textureLoader.load("textures/mercury.jpg");
let textures = [];
textures.push(textureLoader.load("textures/mercury.jpg"));
textures.push(textureLoader.load("textures/venus.jpg"));
textures.push(textureLoader.load("textures/earth.jpg"));
textures.push(textureLoader.load("textures/mars.jpg"));
textures.push(textureLoader.load("textures/jupiter.jpg"));
textures.push(textureLoader.load("textures/saturn.jpg"));
textures.push(textureLoader.load("textures/uranus.jpg"));
textures.push(textureLoader.load("textures/neptune.jpg"));

export const createPlanet = (r = 0.4, color = 0xffffff) => {
  const sphere = createSphere(r, color);
  const orbit = new THREE.Object3D();
  orbit.add(sphere);
  return { sphere, orbit };
};

//Helpers
export const createSphere = (
  r = 0.01,
  color = 0xffffff,
  position = [0, 0, 0],
  material = "planetMat",
  textureId = null
) => {
  console.log("create sphere", textures[textureId], textureId);
  let sphereMat = new THREE.MeshPhongMaterial({
    color,
    shininess: 20,
    // map: normalTexture,
  });

  if (material === "starMat") {
    sphereMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.2,
    });
  }

  if (material === "textured") {
    sphereMat = new THREE.MeshPhongMaterial({
      map: textures[textureId],
    });
  }

  const sphereGeometry = new THREE.SphereGeometry(r, 50, 50);
  const sphere = new THREE.Mesh(sphereGeometry, sphereMat);
  sphere.position.set(...position);
  return sphere;
};

export const createLight = (
  color = 0xffffff,
  i = 1,
  distance = 0,
  position = [0, 0, 0]
) => {
  const light = new THREE.PointLight(color, i);
  light.position.set(...position);
  return light;
};

export const createCube = () => {
  //Tworzenie szescianu
  const cubeColor = new THREE.Color(0xfad36e);
  const cubeGeometry = new THREE.BoxGeometry(1, 2, 1);
  const cubeMaterial = new THREE.MeshPhongMaterial({
    color: cubeColor,
    shininess: 80,
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-4, -4, -10);
  return cube;
};
