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
    .then(
      (res) => {
        const maxX = 3.5e9;
        const maxY = 3.5e9;
        const maxZ = 3.5e9;
        console.log(res);
        return {
          X: (+res.data.X / maxX) * 3,
          Y: (+res.data.Y / maxY) * 3,
          Z: (+res.data.Z / maxZ) * 3,
        };

        //   console.log(
        //     planetId,
        //     res.data,
        //     (+res.data.X / maxX) * 3,
        //     (+res.data.Y / maxY) * 3,
        //     (+res.data.Z / maxZ) * 3
        //   );
      },
      (error) => {
        return error;
        console.log("There was an error when downloading planet: ", planetId);
      }
    )
    .catch((err) => {
      console.log("Error", err);
    });
}
