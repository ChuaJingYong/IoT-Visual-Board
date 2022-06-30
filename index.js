import { initializeApp } from "firebase/app";
import { getDocs, getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
import { doc, getDoc, setDoc, collection, addDoc, updateDoc,
         deleteDoc, deleteField,onSnapshot, query, where,} from "firebase/firestore";


// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
// import { doc, getDoc, setDoc, collection, addDoc, updateDoc,deleteDoc, deleteField } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
// {
//     "hosting": {
//       "site": "iotvisualboard-jy",
  
//       "public": "public",
//       ...
//     }
//   }

// Run this when the website is ready
// firebase deploy --only hosting:iotvisualboard-jy
// "firebase": "^9.6.10"
const firebaseConfig = {
    apiKey: "AIzaSyBCcnCUBhc2_cqAcqIfJFOz3-l-frkezDc",
    authDomain: "fyp-webapplicationjy.firebaseapp.com",
    databaseURL: "https://fyp-webapplicationjy-default-rtdb.firebaseio.com",
    projectId: "fyp-webapplicationjy",
    storageBucket: "fyp-webapplicationjy.appspot.com",
    messagingSenderId: "682981890301",
    appId: "1:682981890301:web:ba75716577296b50f88694",
    measurementId: "G-4L536HZE8Z"
  };
 
// var admin = require("firebase-admin");
// const  admin  = require('firebase-admin/app');
// var serviceAccount = require("./serviceAccountKey2.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://fyp-webapplicationjy-default-rtdb.firebaseio.com"
// });

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();


// ----------------------CONTROL PANEL CONFIGURATIONS--------------------
// Initialize variables
var Led1Status, device1,DEVICE_SWITCH,
CATEGORY,SENSOR,DATE,DATATYPE;
var CATEGORY = ["latestDataset"],SENSOR = ["OpenWeather_data"],DATE = ["2022-04-03"],DATATYPE = ["Temperature"];

// Initialize for for loading switch options
var switchOptions,UNITS_TYPE1 ="°C"

// To get options for sensors
// Loops through the collected device names and create new options to choose from

// window. onload = function() { 
// // Initialize and get the control button options from the start
//   loadSwitchOptions()
// }

// To Load switch options
async function loadSwitchOptions(){
    try{
   
    var rawData = await getOptions("outputDevices");
    switchOptions = rawData[0];
    console.log('raw data and switch options',rawData,switchOptions)
    generateOptions(switchOptions,"selectOptions");
    }
    catch(err){
      console.error(err)
    }
}

// Listen from user to select which button to connect to which device
const selectOptions = document.getElementById("selectOptions")

selectOptions.onchange = async function(){
  // Get current selected option value
  device1 = selectOptions.value
  // console.log('Selected device:',device1)
  DEVICE_SWITCH = device1;

  //Extract the data from specified device from database to sync switch status with database status
  var tempDeviceValues= await getDocument("outputDevices",device1)
  var Led1Status = await tempDeviceValues.status
  console.log('Led1Status',Led1Status)
  switch1 = document.getElementById("switch1")
      
  // check from Firebase
  if(Led1Status == true){    
      //sync switch to turn on
      document.getElementById("switch1").checked = true
  } else {
      //sync switch to turn off
      document.getElementById("switch1").checked = false
  }
}

// Alerts the user if any , where("location", "==", "library")
// Listen to the device with the matching specified parameters
const queryFilter = query(collection(db, "unkonwn"), where("location", "==", "library"));
const firebaseListener = onSnapshot(queryFilter, { includeMetadataChanges: true } ,(querySnapshot) => {
    querySnapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        console.log('New item added: ', change.doc.data());
        // alert('New collection added: ', change.doc.data, "please refresh page")
      }
      if (change.type === 'modified') {
        console.log('Existing collection modified: ', change.doc.data());
        // alert('Existing collection modified: ', change.doc.data, "please refresh page")
      }
      if (change.type === 'removed') {
        // alert('Existing collection removed: ', change.doc.data, "please refresh page")
      }
    });
  });
// --------------------READ CATEGORY TYPE FROM USER--------------------
//Generates a new option list dynamically for user to choose category
var selCategory = [document.getElementById("selCategory1")]
var categoryFlag = [false,false];
var sensorFlag = [false,false];
var dateFlag = [false,false];
var dataFlag = [false,false];

selCategory[0].onclick = function(){
  // Checks for flags and runs only once when user clicks on the selections
  // User needs to refresh page to reload if new data was uploaded
  if (categoryFlag[0] == false){
    //Read from collectionList in Firebase and update selCategory list options
    updateCategoryOptions("collectionList","selCategory1")
  }
  categoryFlag[0]= true;
}

// Save the category choice for referencing to correct data type in Firebase
selCategory[0].onchange = function(){
  CATEGORY = [selCategory[0].value];
  console.log("CATEGORY",CATEGORY[0]);
  
  // Resets any existing input from the following fields
  if (categoryFlag[0] == true){
  var selSensor1 = document.getElementById("selSensor1")
  var selDate1 = document.getElementById("selDate1")
  var selData1 = document.getElementById("selData1")
  selSensor1.options[1] = null
  selSensor1.value = "select sensor" 
  selDate1.options[1] = null
  selDate1.value = "select date"
  selData1.options[1] = null
  selData1.value = "select data"
  }

  // update flag values
  sensorFlag[0] = false;
}
  
// --------------------READ SENSOR TYPE FROM USER--------------------

//Generates a new option list dynamically for user to choose category
const selSensor1 = document.getElementById("selSensor1")

selSensor1.onclick = function(){
  // Checks for flags and runs only once when user clicks on the selections
  if (sensorFlag[0] == false){
      const selSensor1 = document.getElementById("selSensor1")
      console.log('Sensor length',selSensor1.length)

      //Clear off any current options available to prevent stacking
      var limit = selSensor1.length-1
      // if(categoryFlag==false){
      //   limit=selSensor1.length-1
      //   console.log('CASE1111')
      // } else{
      //   limit=selSensor1.length
      //   console.log('CASE2222')
      // }

      for (let i = 0; i < (limit); i++){
          selSensor1.options[i+1] = null;}

    //Read from category type in Firebase and update selSensor1 list options      
    // updateCategoryOptions(CATEGORY,"selSensor1")
    console.log("category value",CATEGORY[0])
    getOptions(CATEGORY[0])
    .then((data)=>{
      //generate new options if current list is less than firebase list
      console.log("INTERNAL data values",data)
      generateOptions(data[0],"selSensor1")
    }) 

    // update own flag to true and following flags to false to reset their input
    sensorFlag[0]= true;
    dateFlag[0] = false;
    dataFlag[0] =false;
  }
}

// Save the category choice for referencing to correct data type in Firebase
selSensor1.onchange = function(){
  SENSOR = [selSensor1.value];
  console.log("SENSOR",SENSOR[0])

   // Resets any existing input from the following fields
  if (categoryFlag[0] == true){
  var selDate1 = document.getElementById("selDate1")
  var selData1 = document.getElementById("selData1")
  selDate1.options[1] = null
  selDate1.value = "select date"
  selData1.options[1] = null
  selData1.value = "select data"
  }

  // update next flag values
  dateFlag[0] = false;
}

// --------------------READ DATE FROM USER--------------------

//Generates a new option list dynamically for user to choose category
const selDate1 = document.getElementById("selDate1")

selDate1.onclick = function(){
  // Checks for flags and runs only once when user clicks on the selections
  if (dateFlag[0] == false){
      const selDate1 = document.getElementById("selDate1")
      //Clear off any current available to prevent stacking
      for (let i = 0; i < (selDate1.length-1); i++){
          selDate1.options[i+1] = null;}
    //Read from category type in Firebase and update selSensor1 list options      
    // updateCategoryOptions(CATEGORY,"selSensor1")
    console.log("sensor value",SENSOR[0])
    readNestedCollection(CATEGORY[0],SENSOR[0],"sensorData")
    .then((data)=>{
      //generate new options if current list is less than firebase list
      console.log("INTERNAL data values",data)
      generateOptions(data[0],"selDate1")
    }) 
    dateFlag[0]= true;
    dataFlag[0] =false;
  }
}

// Save the category choice for referencing to correct date in Firebase
selDate1.onchange = function(){
  DATE = [selDate1.value];
  console.log("DATE",DATE[0])

  // Resets any existing input from the following fields
  if (categoryFlag[0] == true){
    var selData1 = document.getElementById("selData1")
    selData1.options[1] = null
    selData1.value = "select data"
    }
  
    // update next flag values
    dataFlag[0] = false;
}

// --------------------READ DATA TYPE FROM USER--------------------

//Generates a new option list dynamically for user to choose category
const selData1 = document.getElementById("selData1")


selData1.onclick = function(){
  console.log("We're here")
  // Checks for flags and runs only once when user clicks on the selections
  if (dataFlag[0] == false){
      const selData1 = document.getElementById("selData1")
      //Clear off any current available to prevent stacking
      for (let i = 0; i < (selData1.length-1); i++){
          selData1.options[i+1] = null;}
    //Read from sensor type in Firebase and update selData1 list options
    
    readNestedDocument(CATEGORY[0],SENSOR[0],"sensorData",DATE[0])
      .then((data)=>{
        console.log("all parameters check",CATEGORY[0],SENSOR[0],"sensorData",DATE[0])
        //generate new options from data[0] to Select Options "selData1"
        console.log("selData1 value",data)

        // Get the keys of the sensorValue type
        try{
          var object=data.dataPoints[0].sensorValues
          var keys = Object.keys(object)
          console.log("key values:",keys)
          console.log("key values for 1:",keys[1])
          generateOptions(keys,"selData1")
        } catch(err){
          console.log("Cause of error =>",err)
        }
        
      }) 
    dataFlag[0]= true;
  }
}

// Save the category choice for referencing to correct data type in Firebase
selData1.onchange = function(){
  DATATYPE = [selData1.value];
  console.log("DATATYPE",DATATYPE[0])
  UNITS_TYPE1 = checkUnits(DATATYPE[0]);
  console.log("UNITS_TYPE1 ",UNITS_TYPE1 )
}

const extractAllDates = async()=>{
  try{
    var dateList,dataList,limit,xValues =0;
    console.log("check CATEGORY, SENSOR", CATEGORY[0],SENSOR[0])
    var rawData = await readNestedCollection(CATEGORY[0],SENSOR[0],"sensorData")
    const results = await Promise.all([
    dateList =  rawData[0],
    dataList = rawData [1],
    limit = dateList.length
  ])
  var sensorValues
  console.log("sensorValues:",dataList)
  return sensorValues = dataList
  
  }catch(err){
    console.error(err)
  }
}

// ----------------EXTRACT DATA INTO ARRAY AND STORE INTO LOCAL STORAGE--------------------

var sensorData =[], sensorValues = [],energyData;
// var CATEGORY = "test",
// SENSOR = "distance",
// DATE = "2022-04-07",
// DATA = "Distance", UNITS_TYPE1;
// var energyData = [{"date": "2022-03-10", "energyValue":130}, {"date": "2022-03-09", "energyValue":220}, {"date": "2022-03-08", "energyValue":200}, {"date": "2022-03-07", "energyValue":250}, {"date": "2022-03-06", "energyValue":180}]
// var energyXData = energyData.map(    //extract all date values for energy usage
//       function (index){                           
//           return index.date;                  
//       }),
//     energyYData = energyData.map(    //extract all energy values for energy usage
//       function (index){                           
//           return index.energyValue;                  
//       });

//   //flip the array order
//   energyData = energyData.reverse();
//   // energyXData = energyXData.reverse();
//   // energyYData = energyYData.reverse();

// Initializes the main chart, average chart and power data
const btnGetData1 = document.getElementById('btnGetData1')
btnGetData1.onclick = async function(){
  try{
    sensorValues = await extractAllDates()
    console.log("sensorValues BOYA",sensorValues)
    
    // Extract date values from the sensor from Firebase
    var dateValues = await sensorValues.map(    
      function (index){                           
          return index.date;                  
      })
      console.log('dateValues:,',dateValues)

    document.getElementById("startDate").value = dateValues[0]
    document.getElementById("endDate").value = dateValues[dateValues.length-1]
    
    // Load up sensor chart and corresponding average chart
    filterDataByDate()
    // clearAvgChartData()
    read7DayData(CATEGORY,SENSOR)
    preparePowerData()
    return sensorValues
  }catch(err){
    console.log("error caught ==>",err)
  }
}

// --------------------------------------------------------------------
// ---------------------------CONFIG BLOCK-----------------------------
// --------------------------------------------------------------------

// Initialize the graph values with 0
var avgChartDates = 0, avgChartSensorData = 0, dates = 0 , sensorData = 0;

// Configuration for main chart1
const config = {
type: 'line',
  
data: {
  // labels: new_x_data, //x-axis data points
  // labels: xValues, //x-axis data points
  labels: dates,

  datasets: [{
      label: `${SENSOR[0]} Value`, //prints out the value of the data when hovered over
      // data: y_data,
      // data: yValues,
      data: sensorData,
      pointRadius:0, //default value is 3. Set this to 0 if want to remove the circle point on the lines
      backgroundColor:'rgba(54, 162, 235, 0.2)', //blue
      borderColor:'rgba(54, 162, 235, 1)',
      fill:false, //use true if want to show area under the graph
      borderWidth: 1,
      responsive:true, //Resizes the chart canvas when its container does 
  }]
},

options: {
  scales: {
            
    x: {
      grid: {
          display: false,
          // drawBorder: true,
          // drawOnChartArea: true,
          drawTicks: false,                
      },
      ticks:{
          maxTicksLimit:8, //Determines how many label points to show on the X-axis. 
      },
      title:{
          text: "Datetime", //name of the axis label
          display: true,
          color:'rgba(255, 159, 64, 1)',
          padding:4,
          font:{
              size:14},                
      },
    },

      y: {
          beginAtZero: true,
          grid:{
              display:true,
          },
          title:{
              text: `${SENSOR[0]} ${UNITS_TYPE1}`, //name of the axis label
              display: true,
              color:'rgba(255, 159, 64, 1)',
              padding:4,
              font:{
                  size:12},                
          }
      },
  
      
  },
  
  plugins: {

  }
}};

// Configuration for daily average values chart1
const configAvg1 = {
  type: 'bar',
      
  data: {
      labels: avgChartDates,
  
      datasets: [{
          label: `Weekly Average ${DATATYPE[0]} Value `, //prints out the value of the data when hovered over
          data: avgChartSensorData,
          pointRadius:0, //default value is 3. Set this to 0 if want to remove the circle point on the lines
          backgroundColor:'rgba(153, 102, 255, 0.2)', //blue
          borderColor:'rgba(153, 102, 255, 1)',
          fill:false, //use true if want to show area under the graph
          borderWidth: 1,
          responsive:true, //Resizes the chart canvas when its container does 
      }]
  },
  
  options: {
      scales: {
                
        x: {
          grid: {
              display: false,
              // drawBorder: true,
              // drawOnChartArea: true,
              drawTicks: false,                
          },
          // ticks:{
          //     maxTicksLimit:xy_data.length/4, //Determines how many label points to show on the X-axis. Label length = 25 here, so 25/4 = 6.25, so shows 7 points
          // },
          title:{
              text: "Date", //name of the axis label
              display: true,
              color:'rgba(153, 102, 255, 1)',
              padding:4,
              font:{
                  size:14},                
          },
        },
  
        y: {
            beginAtZero: true,
            grid:{
                display:true,
            },
            title:{
                text: `Avg ${DATATYPE[0]} ${UNITS_TYPE1}`, //name of the axis label
                display: true,
                color:'rgba(153, 102, 255, 1)',
                padding:4,
                font:{
                    size:12},                
            }
        },
      
          
      },
      
      plugins: {
  
      }
}};

// Configuration for total energy consumption chart
const configEnergy = {
  type: 'line',
      
  data: {
      labels: energyXData,
  
      datasets: [{
          label: 'Average Energy Usage', //prints out the value of the data when hovered over
          data: energyYData,
          pointRadius:0, //default value is 3. Set this to 0 if want to remove the circle point on the lines
          backgroundColor:'rgba(100, 200, 225, 0.2)', //blue
          borderColor:'rgba(100, 200, 225, 1)',
          fill:true, //use true if want to show area under the graph
          borderWidth: 1,
          responsive:true, //Resizes the chart canvas when its container does 
      }]
  },
  
  options: {
      scales: {
                
        x: {
          grid: {
              display: false,
              // drawBorder: true,
              // drawOnChartArea: true,
              drawTicks: false,                
          },
          // ticks:{
          //     maxTicksLimit:xy_data.length/4, //Determines how many label points to show on the X-axis. Label length = 25 here, so 25/4 = 6.25, so shows 7 points
          // },
          title:{
              text: "Date", //name of the axis label
              display: true,
              color:'rgba(153, 102, 255, 1)',
              padding:4,
              font:{
                  size:14},                
          },
        },
  
          y: {
              beginAtZero: true,
              grid:{
                  display:true,
              },
              title:{
                  text: `Energy Consumption Wh/day`, //name of the axis label
                  display: true,
                  color:'rgba(153, 102, 255, 1)',
                  padding:4,
                  font:{
                      size:12},                
              }
          },
      
          
      },
      
      plugins: {
  
      }
  }};

//----------------------------------------------------------------------
//--------------------Init/Render Block for Main Graph--------------------
//----------------------------------------------------------------------
// Initializes the chart with all the configuration settings inside
const myChart = new Chart(document.getElementById('myChart'),config); //initialize main chart
const avgChart = new Chart(document.getElementById('avgChart'),configAvg1) //initialize average-type chart
const avgEnergyChart = new Chart(document.getElementById('avgEnergyChart'),configEnergy) //initialize average-energy chart

var combinedXData=[], combinedYData=[], tempData =[], energyXData = [], energyYData=[], energyData =[]
var indexStartDate, indexEndDate, startTime, endTime,timeRange,indexStartTime,indexEndTime;
// From original document
async function getUnits (){
  var DATA
  var UNITS_TYPE1 = await checkUnits(DATA)
  console.log(UNITS_TYPE1)
  return UNITS_TYPE1
}

// getUnits()


// Takes in the DATA type determined by user and pairs the corresponding unit type
// change string values to lower case to ignore caps when comparing
function checkUnits(sensorType){
  var lowerCaseValues = sensorType.toLowerCase()
  var unit={
    "temperature":"°C",
    "temperature:":"°C",
    "humidity":"%rh",
    "humidity:":"%rh",
    "distance":"cm",
    "distance:":"cm",
    "light_intensity":"cd",
    "light_intensity:":"cd",
    "digital_value":"state",
    "digital_value:":"state",
    "analogue_value":" ",
    "analogue_value:":" ",
  }
  console.log ("resultssss",unit [lowerCaseValues])
  return unit [lowerCaseValues]
}



//take in the values of the current x-y values, and apply changes based on the date inputs from the user

// var sensorValues = [
//   { "date": "2022-03-10", "dataPoints": [ { "dateTime": "04:00:00", "y": 28.379229005149668 }, { "dateTime": "04:00:05", "y": 28.04447838755896 }, { "dateTime": "04:00:10", "y": 26.703558637054133 }, { "dateTime": "04:00:15", "y": 29.198430947770824 }, { "dateTime": "04:00:20", "y": 26.576771751623408 }, { "dateTime": "04:00:25", "y": 30.803605850585342 }, { "dateTime": "04:00:30", "y": 28.988438787520963 }, { "dateTime": "04:00:35", "y": 32.75044479254011 }, { "dateTime": "04:00:40", "y": 31.61718266506038 }, { "dateTime": "04:00:45", "y": 30.116388798034937 }, { "dateTime": "04:00:50", "y": 29.60673962562626 }, { "dateTime": "04:00:55", "y": 25.944686321626662 }, { "dateTime": "04:00:60", "y": 20.948217676307014 }, { "dateTime": "04:01:05", "y": 23.69538489486983 }, { "dateTime": "04:01:10", "y": 27.635116177168157 }, { "dateTime": "04:01:15", "y": 29.040751660034797 }, { "dateTime": "04:01:20", "y": 30.354701364737704 }, { "dateTime": "04:01:25", "y": 29.26752146576818 }, { "dateTime": "04:01:30", "y": 27.061884377747063 }, { "dateTime": "04:01:35", "y": 31.873802929558273 }, { "dateTime": "04:01:40", "y": 29.399102698522753 }, { "dateTime": "04:01:45", "y": 28.752836753094897 }, { "dateTime": "04:01:50", "y": 26.166323079653715 }, { "dateTime": "04:01:55", "y": 21.493656714662556 }, { "dateTime": "04:01:60", "y": 21.263072941161365 }, { "dateTime": "04:02:05", "y": 18.21177559132837 }, { "dateTime": "04:02:10", "y": 17.22979762356985 }, { "dateTime": "04:02:15", "y": 18.56807205353652 }, { "dateTime": "04:02:20", "y": 18.02975355477865 }, { "dateTime": "04:02:25", "y": 17.748656451475664 }, { "dateTime": "04:02:30", "y": 20.665899397383654 }, { "dateTime": "04:02:35", "y": 20.84427489739965 }, { "dateTime": "04:02:40", "y": 24.95290251786397 }, { "dateTime": "04:02:45", "y": 25.469449335940162 }, { "dateTime": "04:02:50", "y": 29.168609827274373 } ] },
//   { "date": "2022-03-09", "dataPoints": [ { "dateTime": "05:00:20", "y": 25.253087780551926 }, { "dateTime": "05:00:25", "y": 29.203384110519416 }, { "dateTime": "05:00:30", "y": 28.37690972682849 }, { "dateTime": "05:00:35", "y": 29.223088381274394 }, { "dateTime": "05:00:40", "y": 30.12120808380871 }, { "dateTime": "05:00:45", "y": 34.70208009642679 }, { "dateTime": "05:00:50", "y": 29.98023517669527 }, { "dateTime": "05:00:55", "y": 27.36268624273692 }, { "dateTime": "05:00:60", "y": 31.279624396977763 }, { "dateTime": "05:01:05", "y": 34.96180507251562 }, { "dateTime": "05:01:10", "y": 35.38502509981209 }, { "dateTime": "05:01:15", "y": 34.51561892288643 }, { "dateTime": "05:01:20", "y": 33.07457259012712 }, { "dateTime": "05:01:25", "y": 36.015346525770745 }, { "dateTime": "05:01:30", "y": 36.759666695656456 }, { "dateTime": "05:01:35", "y": 41.290284494077945 }, { "dateTime": "05:01:40", "y": 41.48973939547605 }, { "dateTime": "05:01:45", "y": 38.99832987227697 }, { "dateTime": "05:01:50", "y": 42.23936711372737 }, { "dateTime": "05:01:55", "y": 47.21110786956834 }, { "dateTime": "05:01:60", "y": 42.815729203425484 }, { "dateTime": "05:02:05", "y": 40.189888063528954 }, { "dateTime": "05:02:10", "y": 42.17205781560148 }, { "dateTime": "05:02:15", "y": 44.03237734945641 }, { "dateTime": "05:02:20", "y": 43.86704646493443 }, { "dateTime": "05:02:25", "y": 44.91017579979387 }, { "dateTime": "05:02:30", "y": 48.34340955347506 }, { "dateTime": "05:02:35", "y": 45.6759329762492 }, { "dateTime": "05:02:40", "y": 45.69656265059705 }, { "dateTime": "05:02:45", "y": 47.85211700163838 }, { "dateTime": "05:02:50", "y": 43.331940631379865 }, { "dateTime": "05:02:55", "y": 47.2946426285978 }, { "dateTime": "05:02:60", "y": 46.224309568844404 }, { "dateTime": "05:03:05", "y": 42.28628743763907 }, { "dateTime": "05:03:10", "y": 38.24227608976367 } ] },
//   { "date": "2022-03-08", "dataPoints": [ { "dateTime": "06:00:20", "y": 27.807913501852312 }, { "dateTime": "06:00:25", "y": 27.795147566565298 }, { "dateTime": "06:00:30", "y": 28.718756331153923 }, { "dateTime": "06:00:35", "y": 26.110049180929256 }, { "dateTime": "06:00:40", "y": 30.440667880499426 }, { "dateTime": "06:00:45", "y": 32.5325827727124 }, { "dateTime": "06:00:50", "y": 34.609648397417466 }, { "dateTime": "06:00:55", "y": 29.909496748346037 }, { "dateTime": "06:00:60", "y": 28.235316604111095 }, { "dateTime": "06:01:05", "y": 27.30778396654069 }, { "dateTime": "06:01:10", "y": 22.425061164069625 }, { "dateTime": "06:01:15", "y": 19.362049225563837 }, { "dateTime": "06:01:20", "y": 23.618807759150258 }, { "dateTime": "06:01:25", "y": 21.69920271499909 }, { "dateTime": "06:01:30", "y": 25.228287004817957 }, { "dateTime": "06:01:35", "y": 29.6829049826098 }, { "dateTime": "06:01:40", "y": 29.70447668987979 }, { "dateTime": "06:01:45", "y": 26.313529536599503 }, { "dateTime": "06:01:50", "y": 26.99055988812322 }, { "dateTime": "06:01:55", "y": 27.792526287471375 }, { "dateTime": "06:01:60", "y": 25.388909715872032 }, { "dateTime": "06:02:05", "y": 22.360916147400463 }, { "dateTime": "06:02:10", "y": 23.543683217737367 }, { "dateTime": "06:02:15", "y": 22.248686418286795 }, { "dateTime": "06:02:20", "y": 25.9216654387922 }, { "dateTime": "06:02:25", "y": 23.456088016382676 }, { "dateTime": "06:02:30", "y": 22.49512282957452 }, { "dateTime": "06:02:35", "y": 19.577983387096314 }, { "dateTime": "06:02:40", "y": 20.734338304688336 }, { "dateTime": "06:02:45", "y": 21.553841653929034 }, { "dateTime": "06:02:50", "y": 23.719033712478968 }, { "dateTime": "06:02:55", "y": 18.75631181419896 }, { "dateTime": "06:02:60", "y": 21.100289557941466 }, { "dateTime": "06:03:05", "y": 25.68414815260469 }, { "dateTime": "06:03:10", "y": 27.54973526886431 } ] },
//   { "date": "2022-03-07", "dataPoints": [ { "dateTime": "07:53:00", "y": 22.283178575922292 }, { "dateTime": "07:53:05", "y": 25.19812359334974 }, { "dateTime": "07:53:10", "y": 28.682707881303003 }, { "dateTime": "07:53:15", "y": 31.442258491202022 }, { "dateTime": "07:53:20", "y": 34.13104411156591 }, { "dateTime": "07:53:25", "y": 33.75987103177731 }, { "dateTime": "07:53:30", "y": 38.23177775717184 }, { "dateTime": "07:53:35", "y": 39.01927082298573 }, { "dateTime": "07:53:40", "y": 41.537420018902175 }, { "dateTime": "07:53:45", "y": 44.69511735999545 }, { "dateTime": "07:53:50", "y": 49.53504779784778 }, { "dateTime": "07:53:55", "y": 44.92831701417664 }, { "dateTime": "07:53:60", "y": 48.12027583021903 }, { "dateTime": "07:54:05", "y": 49.882665327710015 }, { "dateTime": "07:54:10", "y": 50.44434486786275 }, { "dateTime": "07:54:15", "y": 50.80600518745386 }, { "dateTime": "07:54:20", "y": 50.065304721670145 }, { "dateTime": "07:54:25", "y": 45.632576332419205 }, { "dateTime": "07:54:30", "y": 49.89069347992698 }, { "dateTime": "07:54:35", "y": 49.00019477233459 }, { "dateTime": "07:54:40", "y": 44.723271340863235 }, { "dateTime": "07:54:45", "y": 48.490286808491604 }, { "dateTime": "07:54:50", "y": 44.506005876394475 }, { "dateTime": "07:54:55", "y": 40.018832278653555 }, { "dateTime": "07:54:60", "y": 41.45016594120603 }, { "dateTime": "07:55:05", "y": 42.03155340610094 }, { "dateTime": "07:55:10", "y": 42.17704317514171 }, { "dateTime": "07:55:15", "y": 45.517112048402836 }, { "dateTime": "07:55:20", "y": 49.379224459238316 }, { "dateTime": "07:55:25", "y": 53.28133888749853 }, { "dateTime": "07:55:30", "y": 57.28565748858874 }, { "dateTime": "07:55:35", "y": 56.987296293479 }, { "dateTime": "07:55:40", "y": 56.135669845723754 }, { "dateTime": "07:55:45", "y": 55.3581004253804 }, { "dateTime": "07:55:50", "y": 52.55036193409606 } ] },
//   { "date": "2022-03-06", "dataPoints": [ { "dateTime": "09:42:20", "y": 26.88989683606509 }, { "dateTime": "09:42:25", "y": 23.2146708880705 }, { "dateTime": "09:42:30", "y": 24.887109547579442 }, { "dateTime": "09:42:35", "y": 24.23969568815845 }, { "dateTime": "09:42:40", "y": 25.911875906092874 }, { "dateTime": "09:42:45", "y": 26.28807574391718 }, { "dateTime": "09:42:50", "y": 27.57549376854934 }, { "dateTime": "09:42:55", "y": 25.197055552310776 }, { "dateTime": "09:42:60", "y": 21.832011900067464 }, { "dateTime": "09:43:05", "y": 25.82452955089166 }, { "dateTime": "09:43:10", "y": 26.205613366166723 }, { "dateTime": "09:43:15", "y": 21.456648356113156 }, { "dateTime": "09:43:20", "y": 17.152707367458575 }, { "dateTime": "09:43:25", "y": 19.227094006276136 }, { "dateTime": "09:43:30", "y": 16.779935784966426 }, { "dateTime": "09:43:35", "y": 21.700680726159977 }, { "dateTime": "09:43:40", "y": 21.706510342230473 }, { "dateTime": "09:43:45", "y": 21.660866311511555 }, { "dateTime": "09:43:50", "y": 17.60076707013654 }, { "dateTime": "09:43:55", "y": 19.84475066512625 }, { "dateTime": "09:43:60", "y": 22.835348663611903 }, { "dateTime": "09:44:05", "y": 27.78947876919817 }, { "dateTime": "09:44:10", "y": 29.450129257525937 }, { "dateTime": "09:44:15", "y": 30.212830030539504 }, { "dateTime": "09:44:20", "y": 34.15771798700699 }, { "dateTime": "09:44:25", "y": 37.06288382481107 }, { "dateTime": "09:44:30", "y": 39.55326788842475 }, { "dateTime": "09:44:35", "y": 41.18645644677398 }, { "dateTime": "09:44:40", "y": 44.305190628861034 }, { "dateTime": "09:44:45", "y": 39.310928648033446 }, { "dateTime": "09:44:50", "y": 35.22242772665442 }, { "dateTime": "09:44:55", "y": 36.13044309845681 }, { "dateTime": "09:44:60", "y": 38.99069033666058 }, { "dateTime": "09:45:05", "y": 35.93196049297854 }, { "dateTime": "09:45:10", "y": 37.55101853001775 } ] } 
// ]


function filterDataByDate(){ 

  console.log('sensorValues',sensorValues)
    //Extraction of all the date values from sensorValues JSON document
    var dateValues = sensorValues.map(    
        function (index){                           
            return index.date;                  
        })
        console.log('dateValues:,',dateValues)
    
    // dates2 = [...dates]; //here we use the rest operator (...) to duplicate the array values. Original is not affected
    // sensorData2 = [...sensorData];  //sidenote: the rest operator can only duplicate basic arrays. E.g. nested arrays can't be duplicated
    var dateValues2= [...dateValues]
       
    console.log("dateValues2:",dateValues2)

    // Read startDate and endDate values from input 
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    console.log('start and end date:',startDate ,endDate)
    
    // Fills up empty date with default date if date not found
    if (startDate == 0){
      startDate = dateValues2[0]
      alert("Default start date is now",startDate)
    }else if (endDate == 0){
      endDate = dateValues2[dateValues2.length-1]
      alert("Default endDate is now",endDate)
    }
    
    //Set up temporary variablest to check if user input date range is within available data range. 
    //If not, match it to the maximum data range currently available
    var tempMin = dateValues2[0]
    var tempMax = dateValues2[dateValues2.length-1]
    var tempMinDate = new Date(tempMin)
    var tempMaxDate = new Date(tempMax)
    var tempStartDate = new Date(startDate)
    var tempEndDate = new Date(endDate)
  
    // Catches for cases where End Date is earlier than Start Date
    if(tempStartDate.getTime()>tempEndDate.getTime()){
      alert("Error! End Date is earlier than Start Date")
    }
  
    //If startDate range is too low, change it to the maximum date range available
    //.getTime() is used to compare between dates
    if (tempStartDate.getTime() < tempMinDate.getTime()){
      console.log('endTime value is out of lower boundary!')
      console.log(`Value of startDate ${startDate} has been changed to ${tempMin}`)
      alert(`${startDate} isn't found in database and has been defaulted to ${tempMin}`)
      
    //   Set default date value in the input field
      startDate = tempMin;
      document.getElementById("startDate").value = startDate;
    } else if (tempStartDate.getTime() > tempMaxDate.getTime()){
     
      // If exceeds today's date, let it be equal to today's date
      console.log('endTime value is out of upper boundary!')
      console.log(`Value of startDate ${startDate} has been changed to ${tempMax}`)
      alert(`${startDate} isn't found in database and has been defaulted to ${tempMax}`)
      
    //   Set default date value in the input field    
      startDate = tempMax;
      document.getElementById("startDate").value =startDate;
    } 
  
     // If exceeds max time value, let it be equal to today's date
    if (tempEndDate.getTime()> tempMaxDate.getTime()){
      alert(`${endDate} isn't found in database and has been defaulted to ${tempMax}`)
    //   Set default date value in the input field  
      endDate = tempMax;
      document.getElementById("endDate").value = endDate;
    }
    else if (tempEndDate.getTime()< tempMinDate.getTime()){
        console.log('endTime value is out of lower boundary!')
        console.log(`Value of startTime ${endDate} has been changed to ${tempMin}`)
        alert(`${endDate} isn't found in database and has been defaulted to ${tempMin}`)
        
    //   Set default date value in the input field     
        endDate = tempMin;
        document.getElementById("endDate").value = endDate;
    }
  
    //get the index number in array (range of which we're trying to read from)
    indexStartDate = dateValues2.indexOf(startDate);
    indexEndDate = dateValues2.indexOf(endDate);
    console.log('indexStartDate values and indexEndDate values: ',indexStartDate,indexEndDate);
    
  
    //call function to combine all the x-y values from their respective objects between the specified range from the sensorValues
    mergeDataAcrossDifferentDays(indexStartDate,indexEndDate)
    //returns combinedXData, combinedYData

    myChart.config.data.labels = combinedXData;
    myChart.config.data.datasets[0].data = combinedYData;
    myChart.update();
    
    console.log('test index and end:' ,indexStartDate,indexEndDate)
    return indexStartDate, indexEndDate,combinedXData, combinedYData;
  }

//take in the values of the current x-y values, and apply changes based on the date inputs from the user
function filterDataByTime(){ 
//Extract startTime and endTime input from user
var startTime = document.getElementById('startTime');
var endTime = document.getElementById('endTime');  
console.log('--------------------------------------------------')
console.log('start and endtime:',typeof(startTime.value),endTime.value)

// Round off seconds value in startTime and endTime to multiples of 5
startTime=roundOffTime(startTime.value);
endTime=roundOffTime(endTime.value);
// Sets the new rounded off values to the current numbers in the input time field 
document.getElementById("startTime").value = startTime;
document.getElementById("endTime").value = endTime;

//extract the time range period from the date range given by user
filterDataByDate() 

//return indexStartDate, indexEndDate
var time = [...combinedXData]; //here we use the rest operator (...) to duplicate the array values. Original is not affected
var dailySensorData = [...combinedYData];  //sidenote: the rest operator can only duplicate basic arrays. E.g. nested arrays can't be duplicated
console.log('time values and sensor data: ',time,dailySensorData)
console.log('yooooooooo ',indexStartDate, indexEndDate)
extractDateTimeFromSpecifedDocument(indexStartDate);

//returns an array "tempData" with dateTime values from specified document
tempx1 = tempData;
extractDateTimeFromSpecifedDocument(indexEndDate);
tempx2 = tempData;
// console.log('tempx1 and tempx2 data:',tempx1,tempx2)

//Check if user input Start time fits within the range of data
tempMin = tempx1[0]
tempMax = tempx1[tempx1.length-1]
if (startTime < tempMin){ 
  //   Set default time value in the input field  
  alert(`${startTime} isn't found in database and has been defaulted to ${tempMin}`)  
  startTime = tempMin;
  document.getElementById("startTime").value = startTime
} else if (startTime> tempMax){
  //   Set default time value in the input field  
  alert(`${startTime} isn't found in database and has been defaulted to ${tempMax}`)  
  startTime = tempMax;
  document.getElementById("startTime").value = startTime
}

tempMin = tempx2[0]
tempMax = tempx2[tempx2.length-1]
if (endTime < tempMin){
  //   Set default time value in the input field  
  alert(`${endTime} isn't found in database and has been defaulted to ${tempMin}`)  
  endTime = tempMin;
  document.getElementById("endTime").value = endTime;
} else if (endTime> tempMax){
  //   Set default time value in the input field  
  alert(`${endTime} isn't found in database and has been defaulted to ${tempMax}`)  
  endTime = tempMax;
  document.getElementById("endTime").value = endTime;
}

indexStartTime = tempx1.indexOf(startTime);
indexEndTime = tempx2.indexOf(endTime);
console.log('index of start and end time values:',indexStartTime,indexEndTime)

//Setting up the max length for the x/y data to be sliced by
date1Remainder = tempx1.length - indexStartTime -1;
indexEndTime = indexEndTime + 1;
inBetweenLength = ((indexStartDate - 1) - indexEndDate)*tempx1.length;
maxLength = date1Remainder + inBetweenLength + indexEndTime;

//Applying the upper and lower time limits defined by user, on the original extracted data from specified date range via slicing method
const filterTime = time.slice(indexStartTime, maxLength);
const filterDailySensorData = dailySensorData.slice(indexStartTime, maxLength);
// console.log('filterTime values: ',filterTime)
// console.log('filterDailySensorData values:',filterDailySensorData)

//updates the labels and data in the chart
myChart.config.data.labels = filterTime;
myChart.config.data.datasets[0].data = filterDailySensorData;
// //   activate the two lines below if want to have adaptable x axis label
//   newLength = filterTime.length
//   myChart.config.options.scales.x.ticks.maxTicksLimit = newLength/4
myChart.update();
}

function mergeDataAcrossDifferentDays(startIndex,endIndex){
  console.log("START and END INDEX",startIndex,endIndex)
  var limit = (endIndex+1) - startIndex; // endIndex + 1 to make up for starting from zero index
  console.log('limit values: ',limit)
  //Reinitialize the data back to 0 to prevent the values from being accumulative
  combinedXData = []
  combinedYData = []

  for (let i = 0; i < limit; i++) {
    // console.log("Hotly baked sensor Values!!!",sensorValues)
    console.log("startIndex VALUES",startIndex)
  
// Loops through each date dateTime and sensorValues data from multiple objects if a date range and merge them into one array
      var tempCombinedXData = sensorValues[startIndex].dataPoints.map(   //Looks into the specified index date
      function (index){                           
          return index.dateTime;                  
      })
      // console.log("tempCombinedX values",tempCombinedXData)
      var tempCombinedYData = sensorValues[startIndex].dataPoints.map(    //currently since index number = 0, only the first object is looked into
      function (index){                           
          return index.sensorValues[DATATYPE[0]];                  
      })
      console.log("tempCombinedY values",tempCombinedYData)

      combinedXData = combinedXData.concat(tempCombinedXData); //merges the array values for each day's values into a single array.
      combinedYData = combinedYData.concat(tempCombinedYData);
      startIndex = startIndex +1;
    }

  return combinedXData ,combinedYData;
}

function extractMinMax(startIndex,endIndex){
  maxLength = sensorValues[startIndex].dataPoints.length-1
  // console.log('maxLength values: ',maxLength)
  min = sensorValues[endIndex].dataPoints[0].dateTime                     //extract the first dateTime value of the start date specified by user
  max = sensorValues[startIndex].dataPoints[maxLength].dateTime //extract the last dateTime value of the end date specified by user
  console.log('min values here:',min)
  return min,max;
}   

function extractDateTimeFromSpecifedDocument(specifiedIndex){
tempData=[]; //reinitialize tempData as 0 to prevent accumulating values
tempData= sensorValues[specifiedIndex].dataPoints.map(    //extracts all dateTime values from 
      function (index){                           
          return index.dateTime;                  //may  need to extract only the date specifically into one array for the (...) rest method to dupilcate the values cleanly
      })
      // console.log('tempData are:',tempData)
return tempData;
}

//Takes in input time, rounds off the "seconds" value to 0 or 5 and returns the result
function roundOffTime (input_time){
// Split the time string into "hour/minutes" and "/seconds" parts
console.log('------------------------')
console.log('inputTime vlaue', input_time)
var firstHalf= input_time.substring(0,6)
var secondHalf= input_time.substring(6,8) //extracts the seconds value
var roundedSeconds = Math.round(secondHalf / 5) * 5
var roundedSeconds = roundedSeconds.toString().padStart(2, '0'); //add a padding in front
return roundedDate = firstHalf + roundedSeconds   
}

var dates = 0;
var sensorValuesforAvg,dayCounter,averageDailyTemp

// -------------------------------------------------------------------
// ------------------- GET AVERAGE CHART DATA-------------------------
// -------------------------------------------------------------------

// var CATEGORY  = ["latestDataset"] ,SENSOR = ["Distance_data"], DATATYPE = ["Distance:"]
async function read7DayData(CATEGORY,SENSOR){
  try{
    var dateList,dataList,limit, weekLimit =7, last7days=[];
    console.log("HELOOA values",CATEGORY[0],SENSOR[0],)
    var rawData = await readNestedCollection(CATEGORY[0],SENSOR[0],"sensorData")
    
    const results = await Promise.all([
    dateList =  rawData[0],
    dataList = rawData [1],
    limit = dateList.length ])

    // var limit = limit
    console.log("limit here is",limit)
    console.log("dateList",dateList)
    console.log("dataList",dataList)

  // If Firebase data has more than 7 dates, collect only the most recent dates
    if ( limit>7){
      // reverse the order of the data to get the most recent 7 days
      dateList = dateList.reverse();
      //collect only the last 7 day data
      for (let i = 0; i<7; i++){
        last7days.push(
          {"date": dateList[i],"dataPoints":dataList[(limit -1) - i].dataPoints}
          )}
      // reverse the order of the data back to get correct order
    last7days = last7days.reverse();
    } else{

    for (let i = 0; i<limit; i++){
      last7days.push(
        {"date": dateList[i],"dataPoints":dataList[(limit -1) - i].dataPoints}
        )}
    }
  
    console.log('last 7 days:',last7days)
    var sensorValuesforAvg = [last7days]
    console.log('INSIDE SENSOR:',sensorValuesforAvg[0])
    fetchAverageData(sensorValuesforAvg[0])
    
  }catch(err){
    console.error(err)
  }
}


//---------------------Second Init/Render Block for Average Graph------------------------------

// Update chart button
// read from collection and see how many documents are there and store their id into an array
// read up till the last 7 documents and collect the values from each of them and store into an array
// fetchAverageData read from this array

async function fetchAverageData(sensorValues){  
  console.log("sensorvalues inside fetch average",sensorValues)
  //Extraction of all the datetime "x variables" from a specified date given by user
  var xValues = await sensorValues[0].dataPoints.map(    //currently since index number = 0, only the first object is looked into
      function (index){                           
          return index.dateTime;                  
      })
      console.log("HASLKFJALDKFJALSKDF")
  console.log('Temp date value length is: ',sensorValues.length)

  var weekLimitNotReached = true, tempValue = 0, averageDailyTemp = [],
      startDay = 0, dayCounter = 0,dateLabels = [];

  sensorValues.forEach((index)=>{
    dateLabels.push(index.date)
  })
  
  // dateLabels.reverse(); //flip the order of the collected dates
  
  const dateRange = sensorValues.length - 1;

  if(dateRange<6){ // 7 days = array[0] to array [6] 
    dayCounter = (6 - dateRange); //offset the difference to ensure this loop can also run when data is less than 7 days
  }

  while (dayCounter<=6) { //loop to ensure all data is captured even when there is less than 7 days worth of data to read from
    var total = 0;
    var currentDay = extractSensorValuesFromSpecifedDocument(startDay,sensorValues)
    currentDay.forEach((data)=>{
      total += data;
    })

    // Get the average sensor values for current day being looped through
    const dailyTemp= total/currentDay.length;
    var dailyTemp2dp = dailyTemp.toFixed(2);
    
    // Store each day average data result into array (up to 7 days)
    averageDailyTemp.push(dailyTemp2dp)
    
    //increments by one each time it goes through the loop
    dayCounter ++; 
    startDay ++; 
  }

  // averageDailyTemp.reverse(); //flip the order of the average temp
  Number(averageDailyTemp)
  console.log('Flipped values:',averageDailyTemp)

  //Weekly average
  var tempTotal = 0, weekSum = 0;
  averageDailyTemp.forEach((data)=>{
    tempTotal+=Number(data);
    return tempTotal;
  })

  // Get week average data and fix it to 2 decimal places
  var weekAvg = (tempTotal/averageDailyTemp.length).toFixed(2)

  
  //updates the labels and data in the chart
  document.querySelector(".avgTemp").innerText = weekAvg + UNITS_TYPE1;
  avgChart.config._config.data.labels = dateLabels;
  avgChart.config._config.data.datasets[0].data = averageDailyTemp;
  // avgChart.config._config.data.datasets[0].label = `Weekly Average ${DATATYPE[0]} Value `,
  // avgChart.config._config.data.options.scales.y.title.text = `Avg ${DATATYPE[0]} ${UNITS_TYPE1}`,
  avgChart.update();
}

function clearAvgChartData(){
  document.querySelector(".avgTemp").innerText = null;
  avgChart.config._config.data.labels = 0;
  avgChart.config._config.data.datasets[0].data = 0;
  avgChart.update();
}

//Extract sensor values from document specified by its index
function extractSensorValuesFromSpecifedDocument(specifiedIndex,sensorValues){
  var tempData=[]; //reinitialize tempData as 0 to prevent accumulating values
  //extracts all distance values from dataPoints
  tempData= sensorValues[specifiedIndex].dataPoints.map(   
        function (index){       
          var values = index.sensorValues                
            return Number(values[DATATYPE[0]]);                  
        })
  return tempData;
}

//---------------------Third Init/Render Block for Average Graph------------------------------

async function preparePowerData(){
  try{
    var rawData =await getOptions("energyData")
    energyData = rawData[1][0].energyData
    energyData.reverse()
    console.log("energyData",energyData)

    var XYdata = await extractEnergyXYValues(energyData)
    console.log("XY DATAKLSFA",XYdata)
    var energyXData = XYdata[0]
    var energyYData = XYdata[1]
    console.log("energyXData",energyXData)
    console.log("energyYData",energyYData)
    // Update the values into Avg Energy Chart
    avgEnergyChart.config._config.data.labels = energyXData;
    avgEnergyChart.config._config.data.datasets[0].data = energyYData;
    avgEnergyChart.update();

  }catch(err){
    console.error("Cause of error =>",err)
  }
}




function fetchAverageEnergy(inputEnergyDate,inputEnergyValue){
  //takes in date and energy input from user

var position;
let found =  energyData.some((data,index)=>{
  //checks array for any matching date with the user input date
  if(data.date == inputEnergyDate.value){
      //extract the position index of the matching date if found
      position=index;
      // energyYData[index] = inputEnergyValue.value;
      return true;
    }
    else 
    {
      // console.log('new date and energy value:',inputEnergyDate.value,inputEnergyValue.value)
      return false;
    }
  // energyYData = energyYData.reverse();
  // energyData.some((data,index)=>{
  //   // console.log('date and index values:',data.date,index)
  //   // console.log('inputEnergyDate',inputEnergyDate)
  //   if(data.date == inputEnergyDate.value){
  //     // console.log('date matches!', index)
  //     // console.log('ENRGYYY VALUE:',energyData[index].energyValue)
  //     energyYData[index] = inputEnergyValue.value;
  //     // console.log('ermmmmm:',energyYData[index].energyValue)
  //     // energyData[index].energyValue = inputEnergyValue.value;
  //     // console.log('ermmmmm:',energyYData[index].energyValue)
  //   }
  //   else 
  //   {
  //     console.log('new date and energy value:',inputEnergyDate.value,inputEnergyValue.value)
  //   }
    // { console.log('date no match yo',index)
      // return false};
  })

  console.log('value of found is:',found,position)
  if(found == true){
    //if duplicate is found, replace previous energy value with new energy value
    energyData[position].energyValue = inputEnergyValue.value;
    //UPDATE ONLINE DATABASE ALSO
  } else{
    //if duplicate not found, insert new data into energyData array

    

    // insert in new date time and energy value
    console.log("current array values:",energyData)

    //create a temp object to store the new date and energyvalue
    let  data_obj = {};
    data_obj.date =inputEnergyDate.value;
    data_obj.energyValue = inputEnergyValue.value
    console.log('object value:',data_obj);

    //push in the new object into original average energy array
    energyData.push(data_obj)
    //UPDATE ONLINE DATABASE ALSO
    
    let xData = energyData.map((index)=>{
      return index.date
    })



    console.log('data type for X:',xData, typeof(xData))

    energyData = energyData.sort();
    console.log("new array values:",energyData)
  }

  energyXData = energyData.map(    //extract all date values for energy usage
        function (index){                           
            return index.date;                  
        });

  energyYData = energyData.map(    //extract all energy values for energy usage
        function (index){                           
            return index.energyValue;                  
        });

  // console.log ('new current Y values:',energyYData);

  var weekAvg = 0;

  //updates the labels and data in the chart
  document.querySelector(".avgEnergy").innerText = weekAvg + "kW/h";
  avgEnergyChart.config._config.data.labels = energyXData;
  avgEnergyChart.config._config.data.datasets[0].data = energyYData;
  avgEnergyChart.update();

  // console.log('Value of found:',pos);
  //update the newly-arranged array back to database
  
}

var inputEnergyValue = document.getElementById('inputEnergyValue'),
  buttonEnergy = document.getElementById('buttonEnergy');

async function extractEnergyXYValues (energyYData){
  //extract all date values for energy usage
  var energyXData = energyData.map(    
  function (index){                           
      return index.date;                  
  });

  //extract all energy values for energy usage
  var energyYData = energyData.map(    
  function (index){                           
      return index.energyValue/1000;                  
  });

  return [energyXData,energyYData]
}

async function update(){
  // var docRef = doc(db,"test","distance")
  // setDoc(docRef,{"documentName":"distance"});

  var secRef = doc(db,"test","distance","sensorData","2022-04-07")
  updateDoc(secRef,{"dataPoints":
  {
    "dateTime":generateTime(),
    "sensorValues": generateRandom()
  }  
});

}


// -----------------Listeners for user inputs for main chart------------
// Filter dates when startDate selected
var startDate = document.getElementById("startDate")
startDate.onchange = function(){filterDataByDate()}
// Filter dates when endtDate selected
var endDate = document.getElementById("endDate")
endDate.onchange = function(){filterDataByDate()}

var startTime = document.getElementById("startTime")
startTime.onchange = function(){filterDataByTime()}

var endTime = document.getElementById("endTime")
endTime.onchange = function(){filterDataByTime()}


 //===================Total Average Energy listeners==========================
  
  // This event is fired when AveragePower button is clicked
  buttonTotalEnergy.addEventListener("click", function () {
    var inputEnergyDate = document.getElementById('inputEnergyDate');
    inputEnergyValue = document.getElementById('inputEnergyValue');
    
    fetchAverageEnergy(inputEnergyDate,inputEnergyValue);
  
    console.log('input date:',inputEnergyDate.value)
    console.log(inputEnergyValue.value)
    var str = inputEnergyValue.value;
  
    
  });
  
  // This event is fired when user presses "Enter" in the Average Power input textbox
  inputEnergyValue.addEventListener("keyup", function(event){
    if(event.key== 'Enter'){
      console.log('enter is pressed')
      buttonEnergy.click();
    }
  })

//-------------------------Additional buttons---------------------
function toggleTooltip()
{
  var t = document.getElementById("toggleTooltip");
  console.log('t.value: ',t.value)
  console.log(typeof(t.value))
  if(t.value=="YES"){ //Toggles OFF the graph points if already ON
    t.value="NO";
    myChart.config.data.datasets[0].pointRadius= 0;
    myChart.update()}
  else if(t.value=="NO"){ //Toggles ON the graph points if already OFF
    t.value="YES";
    myChart.config.data.datasets[0].pointRadius = 2;
    myChart.update()}
}


// // Generate fake data
// while(true){
//   var test = new Date()
//   var seconds = test.getSeconds()
//   if (seconds % 5 == 0){
//     update().then(()=>{console.log("values logged:",test,seconds)})
//     counter ++;
//   }
//   if (counter ==2){
//     break;
//   }
// }




function interval_5s(d) {
  var hours = format_two_digits(d.getHours());
  var minutes = format_two_digits(d.getMinutes());
  var seconds = format_two_digits(d.getSeconds());
  return hours + ":" + minutes + ":" + seconds;
}

function time_format(d) {
  var hours = format_two_digits(d.getHours());
  var minutes = format_two_digits(d.getMinutes());
  var seconds = format_two_digits(d.getSeconds());
  return hours + ":" + minutes + ":" + seconds;
}
function format_two_digits(n) {
  return n < 10 ? '0' + n : n;
}
function generateTime(){
  var d = new Date();
  var formatted_time
  return formatted_time = time_format(d);  
}
function generateRandom(min = 20, max = 50) {

  // find diff
  let difference = max - min;

  // generate random number 
  let rand = Math.random();

  // multiply with difference 
  rand = Math.floor( rand * difference);

  // add with min value 
  rand = rand + min;

  return rand;
}

// console.log("new time:",generateTime())
function updateCategoryOptions(colReference,optionType){
  getOptions(colReference)
      .then((data)=>{
        //generate new options if current list is less than firebase list
        console.log("INTERNAL data values",data)
        generateOptions(data[0],optionType)
      }) 
}

// doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());


async function getOptions(collectionChoice){
    // Takes in user input on which collection to look into
    var values=[], selectionList = []
    
    // wait for documents to load 
    var colRef=  collection(db, collectionChoice)
    const collectionSnapshot = await getDocs(colRef);
    
    // push raw values into values [] and value id into selectionList[]
    collectionSnapshot.forEach((doc) => {
    values.push({...doc.data(),id:doc.id})
    selectionList.push(doc.id)
});
return [selectionList,values];
}

// getOptions("sensors_final_test")

async function createDocument(documentChoice){
  // Add a new document in collection "cities"
  await setDoc(doc(db, "ghostTest", documentChoice), 
  { "ghost type:":"Gengar"});
  console.log("New document",documentChoice,"created")
}

// createDocument("ghostTest")

function generateOptions(loopData,elementID_string){
  loopData.forEach((data)=>{
    //Get ID of select input
    const elementID = document.getElementById(elementID_string)
    //create a new option, syntax = Option ('Option text', 'Option value')
    //Value is its unique ID in a sense, while text is what the users get to see
    const option = new Option(data,data);
    // add it to the select list
    elementID.add(option, undefined);
    })
  }

function deleteOptions(elementID_string){
  var options = document.getElementById(elementID_string);
  options.remove(options.selectedIndex);
}



var collectionChoice = "outputDevices"
// getOptions(collectionChoice )


var documentChoice = "buzzer"

//asynchronous function to get Firebase document
async function getDocument(collectionChoice,documentChoice){
  try{
  var docRef = doc(db,collectionChoice,documentChoice)
  const docSnap = await getDoc(docRef);
  
  if(docSnap.exists()){
      console.log('docSnap data',docSnap.data())
  return docSnap.data()
  }} catch(err){
      console.log('error value:',err)
  }
}

//Needs document,collection2 and document 2 references
//asynchronous function to get Nested Firebase document
async function readNestedDocument(collectionChoice,documentChoice,collectionChoice2,documentChoice2){
  try{
  var docRef = doc(db,collectionChoice,documentChoice,collectionChoice2,documentChoice2)
  const docSnap = await getDoc(docRef);
  
  if(docSnap.exists()){
      console.log('docSnap data',docSnap.data())
  return docSnap.data()
  }} catch(err){
      console.log('error value:',err)
  }
}

async function readNestedCollection(collectionChoice,documentChoice,collectionChoice2){
  var values=[], selectionList = []
  var colRef=  collection(db, collectionChoice,documentChoice,collectionChoice2)
  const collectionSnapshot = await getDocs(colRef);
  
  collectionSnapshot.forEach((doc) => {
    values.push({...doc.data(),id:doc.id})
    selectionList.push(doc.id)
});
return [selectionList,values];
}


//asynchronous function to update Firebase document
async function updateDocument(collectionChoice,documentChoice,input){
    const docRef = doc(db, collectionChoice, documentChoice);
    await updateDoc(docRef, input);
}


function newgetDocument(documentChoice){
  var docref = doc(db,"outputDevices",documentChoice)
  getDoc(docref).then((docSnapshot)=>{
    console.log("docSnapshot valuesHARLO: ",docSnapshot.data(),docSnapshot.id)
  })
}
// getDocument(documentChoice)


function selectOutputDevice(){

}
// readDocument(deviceValue)
var switch1 = document.getElementById("switch1") 
var Led1Status = "0"

// // Reading from firebase values updating the toggle buttons
// document.addEventListener('DOMContentLoaded', function() {
//   var checkboxes = document.querySelectorAll('input[type=checkbox][name=gender]');

//   for (var checkbox of checkboxes)
//   {
//       checkbox.addEventListener('change', function(event)
//       {
//           if (event.target.checked) {
//               alert(`${event.target.value} is checked`);
//           }
//           else {
//               alert(`${event.target.value} is unchecked`);
//           }
//       });
//   }
// }, false);



switch1.onclick = function(){
    if(Led1Status == true){    // post to firebase
        // toggle firebase status value to false
        Led1Status = false;
        updateDocument("outputDevices",DEVICE_SWITCH,{"status": Led1Status})
        .then(()=>{console.log(`Led1Status is ${Led1Status}`)})
    } else {
        // toggle firebase status value to true
        Led1Status = true;
        updateDocument("outputDevices",DEVICE_SWITCH,{"status": Led1Status})
        .then(()=>{console.log(`Led1Status is ${Led1Status}`)})
    }
}


// const querySnapshot = await getDocs(collection(db, "sensors_final_test"));
// querySnapshot.forEach((doc) => {
//   console.log(`${doc.id} => ${doc.data()}`);
// });


// // -----------------UPDATING DOCUMENT DATA---------

// async function updateDeviceStatus(){
//     var ref = doc(db, "outputDevices",deviceValue);

//     if (switch1.value == "checked"){
//         await updateDoc(ref, {status:true}).then(()=>{
//             alert(`{deviceValue} has been turned ON`)
//         })
//         .catch((error)=>{
//             alert("Unsuccessful operation, error:" + error);
//         })
//     } else{
//         await updateDoc(ref, {status:false}).then(()=>{
//             alert(`{deviceValue} has been turned OFF`)
//         })
//         .catch((error)=>{
//             alert("Unsuccessful operation, error:" + error);
//         })
//     }

// }

// // -------------------Assign Events to button-------------
//     switch1.addEventListener("click",AddDocument_customID)

// Useful Functions or EventListeners
btnAdd.onclick = (e) => {
  e.preventDefault();
  // create a new option, syntax = Option ('Option text', 'Option value')
  const option = new Option(new Date(),new Date());
  // add it to the list
  format.add(option, undefined);
};


// -----------------------------------------------------------------
// ---------------Complex incomplete functions----------------------
// -----------------------------------------------------------------
// function checkForCategoryListUpdate(){
//   getOptions("outputDevices")
//   .then((data)=>{

//     //Check for current option length
//     var selCategory=document.getElementById("selCategory")
//     console.log("option length and data length",selCategory.length,data[0].length)
//     //Get new data from firebase if current options are less than firebase data
//     if ((selCategory.length-1)<data[0].length){
//       for (let i = 0; i < (selCategory.length-1); i++){
//               selCategory.options[i+1] = null;}

//       getOptions("outputDevices")
//       .then((data)=>{
//         //generate new options if current list is less than firebase list
//         console.log("INTERNAL data values",data)
//         generateOptions(data[0],"selCategory")
//       }) 
//     } else if ((selCategory.length-1)>data[0].length){ //If firebase data has decreased
        
//       //Remove current set of data
//         for (let i = 0; i < (selCategory.length-1); i++){
//           selCategory.options[i+1] = null;}

//           // recreate new updated fields
//           getOptions("outputDevices")
//             .then((data)=>{
//               //generate new options if current list is less than firebase list
//               console.log("INTERNAL data values",data)
//               generateOptions(data[0],"selCategory")
//       }) 
//     }
//   })
//   // document.body.removeEventListener('selCategory', checkForCategoryListUpdate);
// }

async function obtainDocument(input){
  console.log("I'm in")
  try {
      var docRef = doc(db,"pseudodata",input)
      const docSnap = await getDoc(docRef); 
      if(docSnap.exists()){
          // console.log('docSnap data',docSnap.data())
          var newObject = docSnap.data()
          // Object value is extracted as an array
          var key_value = Object.values(newObject)
          // Extract the array item (only one element inside)
          var string_value = key_value[0]
          // console.log("string value",string_value)
          // Get the current data from the array
          // console.log("BYEE",typeof(string_value))
          
          // console.log("ELOOO",string_value)
          return string_value
      }} catch(err){
          console.log('error value:',err)
      }}

var array = ["Humidity","&lon=","Temperature"]
var urlUserRequest = "https://api.openweathermap.org/data/2.5/weather?lat="

async function defineAPIConnection(){
  for (let i = 0; i<array.length;i++){
    if (i % 2 == 0 ){
    var sensorType = array[i]
    console.log("current array Item",array[i])
    // Read from specified sensor data
    var heheh = await obtainDocument(sensorType)
    console.log("RESULTS",heheh)

    urlUserRequest=urlUserRequest+heheh
  }
  else{
    urlUserRequest=urlUserRequest+array[i]
  }
}
  urlUserRequest= await urlUserRequest +"&units=metric&appid=2abd298b2848b5c4b89a5361d054d652"
  console.log("request results: ",urlUserRequest)
  return urlUserRequest
}

async function fetchAPIresults(){
  // Send requeset to API with correct parameters to get back a response JSON file
  var urlUserRequest= await defineAPIConnection();
  var response = await fetch(urlUserRequest)
  // converts results to readable json
  var feedback = await response.json()

  // Extract temperature and humidity feedback
  var temperatureFeedback = feedback.main.temp;
  var humidityFeedback = feedback.main.humidity;
  console.log(`Temp values are ${temperatureFeedback}, humidity values are ${humidityFeedback}`)
}



async function fetchAPIresults2(){
  // Send requeset to API with correct parameters to get back a response JSON file
  const urlUserRequest = "https://api.openweathermap.org/data/2.5/weather?lat=3.1398&lon=101.6853&units=metric&appid=2abd298b2848b5c4b89a5361d054d652"
  var response = await fetch(urlUserRequest)
  // converts results to readable json
  var feedback = await response.json()

  // Extract temperature and humidity feedback
  var temperatureFeedback = feedback.main.temp;
  var humidityFeedback = feedback.main.humidity;
  console.log(`Temp values are ${temperatureFeedback}, humidity values are ${humidityFeedback}`)
}
// fetchAPIresults()

// Connect to API to send and received data every 5s

var timer


  function startTimer(){
    timer = setInterval(function() {
        fetchAPIresults2()
        // console.log("2 seconds are up",new Date());
    }, 5000);
  }

  function endTimer (){
    console.log("Timer stopped");
    clearInterval(timer);
  }

 var connectAPI = document.getElementById("connectAPI")
 var disconnectAPI = document.getElementById("disconnectAPI")

 connectAPI.onclick= function (){
     startTimer()
 }

 disconnectAPI.onclick= function (){
    endTimer()
}

// "https://api.openweathermap.org/data/2.5/weather?lat=3.1398&lon=101.6853&units=metric&appid=2abd298b2848b5c4b89a5361d054d652"

// var urlUserRequest = userInput[0] + userInput[1] + userInput[2] + userInput[3] + userInput[4]
// var urlUserRequest = "https://api.openweathermap.org/data/2.5/weather?lat=" + 3.1398 
// + "&lon=" + 101.6853 + "&units=metric&appid=2abd298b2848b5c4b89a5361d054d652"
// async function defineAPIConnection()
// // Click button to start timer. Calls for API value every 5s
// function startTimer(){
//   timer = setInterval(function() {
//       fetchAPIresults2()
//       // console.log("2 seconds are up",new Date());
//   }, 5000);
// }
// Click button to end timer. Calls for API value every 5s

// ------------------------------ CONNECT TO API-------------------------

// Initialize the URL storage array and database reference array
var dataRequest = [], URLLink = [], dataForURL, testCounter;

//Runs everytime user adds new data for URL
const btnURLInput = document.getElementById('btnURLInput')
btnURLInput.onclick = function(){
  // Extract  value from user input for URL section 
  const URLInput = document.getElementById("URLInput").value
  console.log("Values are:",URLInput)

  URLLink.push(URLInput);
  var dataForURL = document.getElementById("APIAddress").innerHTML;
  document.getElementById("APIAddress").innerHTML = dataForURL + URLInput;
  console.log("URLLink values:",URLLink)

  // Clears off current values for user to enter fresh values
  document.getElementById('URLInput').value = ''
}

async function loadAPIConnectionOptions(){
  try{
  var rawData = await getOptions("pseudodata");
  switchOptions = rawData[0];
  console.log('raw data and switch options',rawData,switchOptions)
  generateOptions(switchOptions,"APIConnectionOptions");
  }
  catch(err){
    console.error(err)
  }
}
// Loads up the database options for the user to config to send to the API from the start
loadAPIConnectionOptions()

// const APIConnectionOptions = document.getElementById("APIConnectionOptions")
// APIConnectionOptions.onchange = function(){
//   const selectedOptions = document.getElementById("APIConnectionOptions").value
//   console.log("selectedOptions",selectedOptions)
// }

//Runs everytime user adds new data for database options
const btnDatabaseInput = document.getElementById('btnDatabaseInput')
btnDatabaseInput.onclick = function(){
  // Extract  value from user input for database
  // const databaseInput = document.getElementById("databaseInput").value
  // console.log("Values are:",databaseInput)

  const databaseInput = document.getElementById("APIConnectionOptions").value
  console.log("Values are:",databaseInput)
  // Store data into array
  dataRequest.push(databaseInput);
  // Connects the database
  // dataForURL = dataForURL + databaseInput;
  console.log("dbSensor values:",dataRequest)
  var dataForURL = document.getElementById("APIAddress").innerHTML
  document.getElementById("APIAddress").innerHTML = dataForURL + databaseInput;

  // Clears off current values for user to enter fresh values
  document.getElementById('databaseInput').value = ''

}

// Connect with API address every 5s
const btnConnectTimer = document.getElementById("connectTimer")
btnConnectTimer.onclick = function(){
  URLUpdate(URLLink,dataRequest);
}

// Reset stored URL and database reference arrays
const btnResetAPI = document.getElementById("resetAPI")
btnResetAPI.onclick = function(){
  // clear off global (string) dataForURL, dataRequest and URLLink arrays
  URLLink = [];
  dataRequest = [];
  dataForURL = '';
  document.getElementById("APIAddress").innerHTML = '';
  console.log("current array values:",URLLink,dataRequest);
}

async function URLUpdate(URLLink,dataRequest){
  var testForURL
  var firstItem = 0, lastItem = dataRequest.length -1;

  
 
  // dataRequest.forEach((data,index)=>{
  for (let index = 0; index < dataRequest.length; index++) {
    if (index == firstItem){
      console.log("First entered")
      console.log("current data reference is ",dataRequest[0])
      // Extracts the latest data object from specified sensor from user and the value is stored in dataValue
      dataRequest[0] = await fetchDataFromDatabase(dataRequest[0]);
      var dataValue = Object.values(dataRequest[0] )
      console.log("updated data reference is ",dataValue)
      // Insert the new data value from the database into the URL
      // testForURL = URLLink[0] + dataRequest[0]
      testForURL = URLLink[0] + dataValue
    } else {
      // add the new data
      // Extracts the latest data object from specified sensor from user and the value is stored in dataValue
      console.log("current data reference is ",dataRequest[index])
      dataRequest[index] = await fetchDataFromDatabase(dataRequest[index]);
      var dataValue = Object.values(dataRequest[index] )
      console.log("updated reference data:",dataValue)
      // Insert the new data value from the database into the URL
      // testForURL = testForURL+ URLLink[index] + dataRequest[index]
      testForURL = testForURL+ URLLink[index] + dataValue
    }

    if (index == lastItem){
      console.log("Last entered")
      testForURL = testForURL + URLLink[URLLink.length -1]
    }
  }

  console.log("testForURL values:",testForURL)
  return testForURL
}

async function fetchDataFromDatabase(databaseRef){
  // Extract data from the specified document from the "pseudodata" collection
  // var rawData = await getDocument("pseudodata","Temperature")
  var rawData = await getDocument("pseudodata","Temperature")
  // Generally extracts the key value to be referenced to. In this case it's "sensorValues"
  var dataRef = Object.keys(rawData)
  // Bracket notation is used to extract the data in general form
  var databaseData = await rawData[dataRef]
  console.log('databaseValues',databaseData);

  // ----------MODIFY OR REMOVE THIS PART IF ACTUAL DATA INSTEAD OF PSEUDODATA IS USED----------
  var modifiedData = pseudodataPreparation(databaseData)

  // extracts the newest data value from the database
  var data = await modifiedData
  var latestData = data[data.length - 1]
  console.log("latest data value:",latestData)
  return latestData
}

// Miniumum needs to start at 1 since the slice method extracts based on defined lower and upper limits
var pseudoCounter = 1;
// This function is used to hardcode a scenario where new data seems to be coming from the preset 10 data in the pseudodata set.
async function pseudodataPreparation (inputData){
  var extractedPseudoDataRange = await inputData.slice(0, pseudoCounter);
  console.log("extracted range:",extractedPseudoDataRange)
  pseudoCounter ++;
  return extractedPseudoDataRange
}

// pseudodataPreparation();
