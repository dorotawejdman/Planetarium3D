// fetch("https://api.le-systeme-solaire.net/rest.php/knowncount?rowData=true", {
//   method: "GET",
//   headers: { "Access-Control-Allow-Origin": "*" },
// })
//   .then((response) => response.json())
//   .then((posts) => console.log(posts));

// var request = new XMLHttpRequest();
// // request.open("GET", "https://api.le-systeme-solaire.net/rest/bodies/terre");
// request.open(
//   "GET",
//   "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='499'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='2006-01-01'&STOP_TIME='2006-01-20'&STEP_SIZE='1%20d'&QUANTITIES='1,9,20,23,24,29'"
// );
// // request.open("GET", "https://ssd.jpl.nasa.gov/api/horizons.api");
// request.send();
// request.onload = () => {
//   console.log(JSON.parse(request.response));
// };

const myHeaders = new Headers();
// myHeaders.append("Access-Control-Allow-Origin", "https://ssd.jpl.nasa.gov");
const myRequest = new Request(
  "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='499'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='2006-01-01'&STOP_TIME='2006-01-20'&STEP_SIZE='1%20d'&QUANTITIES='1,9,20,23,24,29'",
  {
    method: "GET",
    headers: myHeaders,
  }
);

fetch(myRequest)
  .then((posts) => console.log(posts))
  .then((posts) => console.log(posts));
