import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000/";

const planetNames = [
  "Earth",
  "Mars",
  "Saturn",
  "Mercury",
  "Venus",
  "Jupiter",
  "Uranus",
  "Neptune",
  "Pluto",
];
// MAIN
//Pobranie danych
export function getIds() {
  return axios({
    method: "get",
    url: "planetsIds",
  })
    .catch((err) => {
      // console.log(err)
    })
    .then((res) => {
      res.data.forEach((element) => {
        planetNames.forEach((planet) => {
          if (element.includes(planet + "  ")) {
            // console.log(planet,":\n",element)
          }
        });
      });
    });
}

//Calle do api
export function getPlanetPosition(planetId) {
  return axios({
    method: "get",
    url: `celestialBody/${planetId}`,
  })
    .then((res) => {
      const maxX = 3.5e9;
      const maxY = 3.5e9;
      const maxZ = 3.5e9;
      res.data.position.X = (+res.data.position.X / maxX) * 3;
      res.data.position.Y = (+res.data.position.Y / maxY) * 3;
      res.data.position.Z = (+res.data.position.Z / maxZ) * 3;
      res.data.radius = +res.data.radius / 200000;
      return res;
    })
    .catch((err) => {
      console.log("Error", err);
    });
}
