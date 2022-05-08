import * as THREE from "three";
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
  material = "planetMat"
) => {
  let sphereMat = new THREE.MeshPhongMaterial({
    color,
    shininess: 20,
  });

  if (material === "starMat") {
    sphereMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.5,
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
