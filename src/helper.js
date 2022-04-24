createPlanet = (r = 0.4, color = 0xffffff) => {
  const sphere = createSphere(r, color);
  const orbit = new THREE.Object3D();
  orbit.add(sphere);
  return { sphere, orbit };
};
