//google-chrome --disable-web-security --user-data-dir=~/chromeTemp - open without CORS
var data;
axios.defaults.baseURL = 'https://ssd.jpl.nasa.gov/api';

const myHeaders = new Headers();
// myHeaders.append("Access-Control-Allow-Origin", "*");
const myRequest = new Request(
  "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='499'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='2006-01-01'&STOP_TIME='2006-01-20'&STEP_SIZE='1%20d'&QUANTITIES='1,9,20,23,24,29'",
  {
    method: "GET",
    headers: myHeaders,
  }
);

new Promise((resolve, reject) => {
  axios({
    method: "get",
    url: "/horizons.api?format=json&COMMAND='499'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTOR'&CENTER='500@10'&START_TIME='2006-01-01'&STOP_TIME='2006-01-20'&STEP_SIZE='1%20d'&QUANTITIES='1,9,20,23,24,29'&CSV_FORMAT='YES'",
    headers: myHeaders,
  })
  .then((resp)=>{
    console.log(resp.data.result)
    data=resp.data.result.split('\n')
   
    var index = data.indexOf('$$SOE'); // => 18
    for(let i=0; i<10;i++){
      var firstDayVec = data[index+2+4*i].split(',') //next is 2+4
      var firstDayVecX = firstDayVec[2]
      var firstDayVecY = firstDayVec[3]
      var firstDayVecZ = firstDayVec[4]
      console.log(firstDayVecX,firstDayVecY,firstDayVecZ)
    }
  })
    .then((resp) => {
      // console.log(resp.data.result);
    
      resolve();
    })
    .catch((err) => {
      console.log(err);
      reject();
    });

  })

fetch(myRequest)
  .then((posts) => console.log(posts));


// You should do - 1 if you want your 'first' line to be 0