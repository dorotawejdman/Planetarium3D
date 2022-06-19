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

export function normalizePosition(position) {
  position.Z = (+position.Z / constants.distanceModifier.z) * 3;
  position.Y = (+position.Y / constants.distanceModifier.y) * 3;
  position.X = (+position.X / constants.distanceModifier.x) * 3;
  return position;
}

//Calle do api
export function getPlanetPosition(
  planetId,
  startDate = "2006-01-01",
  stopDate = "2006-02-20",
  step = "1 DAYS"
) {
  return axios({
    method: "get",
    url: `celestialBody/${planetId}/${startDate}/${stopDate}/${step}`,
  })
    .then((res) => {
      res.data.position.map((pos) => {
        normalizePosition(pos);
      });
      res.data.radius = res.data.radius / constants.radiusModifier;
      localstorage.setItem(planetId, JSON.stringify(res.data.position));

      console.log(planetId, "\n ", res.data);
      return res;
    })
    .catch((err) => {
      console.log("Error", err);
    });
}
