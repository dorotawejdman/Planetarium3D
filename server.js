const express = require("express");
const axios = require("axios");
const cors = require("cors");
axios.defaults.baseURL = "https://ssd.jpl.nasa.gov/api";
const app = express();

app.use(express.static("public"));
app.use(cors());
app.get("/", (req, res) => {
  console.log("here");
  res.status(200).json({ message: "lol" });
});

// This sets up a route to localhost:3000/random and goes off and hits
// cat-fact.herokuapp.com/facts/random
app.get("/planetsIds", async (req, res) => {
  const planetListPath = `/horizons.api?format=json&COMMAND='MB'`;
  try {
    const response = await axios.get(planetListPath);
    data = response.data.result.split("\n");
    // console.log(response.data)
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

app.get("/celestialBody/:bodyId", async (req, res) => {
  // const bodyId = req.query.bodyId;
  const { bodyId } = req.params;

  console.log(bodyId);
  const apiPath = `/horizons.api?format=json&COMMAND='${bodyId}'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTOR'&CENTER='500@10'&START_TIME='2006-01-01'&STOP_TIME='2006-01-20'&STEP_SIZE='1%20d'&QUANTITIES='1,9,20,23,24,29'&CSV_FORMAT='YES'`;

  try {
    await axios
      .get(apiPath)
      .catch(function (error) {
        if (error.response) {
          console.log("Cannot get celestial body from NASA");
          // console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      })
      .then((response) => {
        let data = response.data.result.split("\n");
        let planetRadius = "";
        for (let i = 0; i < 20; i++) {
          if (data[i].toLowerCase().includes("vol. mean radius")) {
            const id = data[i].indexOf("=");
            planetRadius = data[i].slice(id, id + 15);
            planetRadius = planetRadius
              .split(" ")
              .join("")
              .split("+")[0]
              .split("=")[1];
          }
        }
        var index = data.indexOf("$$SOE"); // => 18
        for (let i = 0; i < 5; i++) {
          var firstDayVec = data[index + 2 + 4 * i].split(","); //next is 2+4
          var firstDayVecXYZ = {};
          firstDayVecXYZ.X = firstDayVec[2];
          firstDayVecXYZ.Y = firstDayVec[3];
          firstDayVecXYZ.Z = firstDayVec[4];
        }
        console.log({ position: firstDayVecXYZ, radius: +planetRadius });
        res.json({ position: firstDayVecXYZ, radius: +planetRadius });
      });
  } catch (err) {
    console.log(err);
    res.status(500).send("Cannot get celestial body from local api");
  }
});

app.listen(3000, () => console.log("App available on port 3000"));
