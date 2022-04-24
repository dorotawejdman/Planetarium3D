//google-chrome --disable-web-security --user-data-dir=~/chromeTemp - open without CORS
import axios from "axios";
var data;
axios.defaults.baseURL = "https://ssd.jpl.nasa.gov/api";

//
// // myHeaders.append("Access-Control-Allow-Origin", "*");
// const myRequest = new Request(
//   "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='499'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='2006-01-01'&STOP_TIME='2006-01-20'&STEP_SIZE='1%20d'&QUANTITIES='1,9,20,23,24,29'",
//   {
//     method: "GET",
//     headers: myHeaders,
//   }
// );
export async function callNasa() {
  let data;
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: "/horizons.api?format=json&COMMAND='499'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTOR'&CENTER='500@10'&START_TIME='2006-01-01'&STOP_TIME='2006-01-20'&STEP_SIZE='1%20d'&QUANTITIES='1,9,20,23,24,29'&CSV_FORMAT='YES'",
      // headers: myHeaders,
    })
      .then((resp) => {
        // console.log(resp.data.result);
        data = resp.data.result.split("\n");

        var index = data.indexOf("$$SOE"); // => 18
        for (let i = 0; i < 5; i++) {
          var firstDayVec = data[index + 2 + 4 * i].split(","); //next is 2+4
          var firstDayVecXYZ = {};
          firstDayVecXYZ.X = firstDayVec[2];
          firstDayVecXYZ.Y = firstDayVec[3];
          firstDayVecXYZ.Z = firstDayVec[4];
          // console.log(firstDayVecXYZ, firstDayVecX, firstDayVecY, firstDayVecZ);
        }
        // result = firstDayVec;
        // return data;
        resolve(firstDayVecXYZ);
      })
      // .then((resp) => {
      //   // console.log("response", resp.data.result);
      //   console.log("dta", data);

      // })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });
}

// getData();
// fetch(myRequest).then((posts) => console.log(posts));

// You should do - 1 if you want your 'first' line to be 0
