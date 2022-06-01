import axios from "axios";
import { constants } from "./constants";
axios.defaults.baseURL = "http://localhost:3000/";
const localstorage = window.localStorage;

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
      localstorage.setItem("planetsIDs", res.data);
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
      localstorage.setItem(planetId, JSON.stringify(res.data.position));

      res.data.position.X =
        (+res.data.position.X / constants.distanceModifier.x) * 3;
      res.data.position.Y =
        (+res.data.position.Y / constants.distanceModifier.y) * 3;
      res.data.position.Z =
        (+res.data.position.Z / constants.distanceModifier.z) * 3;
      res.data.radius = +res.data.radius / constants.radiusModifier;
      return res;
    })
    .catch((err) => {
      console.log("Error", err);
    });
}
