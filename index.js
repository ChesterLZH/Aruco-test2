// declare global variables up here
var marker0 = getMarker(0);
var marker1 = getMarker(1);
var marker2 = getMarker(2);
var marker3 = getMarker(3);

var value1 = 0;
var marker0NotCounted = true;

var click1 = 0;
var click2 = 0;

let timer = 20;
let miliTimer = 12000;
let timerId;

var countDetect = document.getElementById("count1");
var countCpm = document.getElementById("count2");

var depth = 0;
var recoil = true;

var depth2 = 0;
var up = false;
var up2 = false;

var compressionDepthData = []; //detect 0,3, 5 or 7cm
var compressionCountData = [];
var cpmData = []; // 100-120cpm
var ventVolData = [];
var ventCountData = [];
var ventSpeedData = []; // 1sec rise
var timerData = [];

decreaseTimer();

function setup() {
  // code written in here will be executed once when the page loads
  setupAppCanvas();
}

function setupAppCanvas() {
  canvas = document.querySelector("#app-canvas");
  dpr = window.devicePixelRatio || 1;

  appWidth = window.innerWidth * dpr;
  appHeight = window.innerHeight * dpr;
  console.log("appWidth =", appWidth, " appHeight =", appHeight);

  canvas.width = appWidth;
  canvas.height = appHeight;

  ctx = canvas.getContext("2d");
}

function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.getElementById("timer").innerHTML = timer;
  } else if (timer === 0) {
    const chartCtx = document.getElementById("myChart");
    const myChart = new Chart(chartCtx, {
      type: "line",
      data: {
        labels: timerData,
        datasets: [
          {
            label: "Compression Depth",
            data: compressionDepthData,
            backgroundColor: ["rgba(75, 192, 192, 0.2)"],
            borderColor: ["rgba(75, 192, 192, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

function calculateCpm() {
  var seconds = new Date().getTime();

  click2 = (1 / ((seconds - click1) / 1000)) * 60;
  click1 = seconds;
  compressionCountData.push(value1);
  cpmData.push(Math.floor(click2));
  timerData.push(timer);
  countCpm.innerHTML = Math.floor(click2);
}

function countCompressions() {
  if (up && !up2) {
    value1++;
    countDetect.innerHTML = value1;
    calculateCpm();
  }
}

// function countCompressions(){
//   if (marker1.present && marker0NotCounted) {
//     value1++;
//     marker0NotCounted = false;
//     countDetect.innerHTML = value1;
//     calculateCpm();
//   }
//   else if (!marker1.present) {
//     marker0NotCounted = true;
//   }

// }

function compressionDepth() {
  if (marker0.present && marker1.present && marker2.present) {
    depth = 0;
    recoil = true;
    compressionMove();
  } else if (marker1.present && marker2.present && recoil) {
    depth = -3;
    recoil = false;
    compressionMove();
  } else if (marker1.present && marker2.present && !recoil) {
    depth = -3;
    recoil = false;
    compressionMove();
  } else if (marker2.present && recoil) {
    depth = -5;
    recoil = false;
    compressionMove();
  } else if (marker2.present && !recoil) {
    depth = -5;
    recoil = false;
    compressionMove();
  } else if (!marker2.present) {
    depth = -7;
    recoil = false;
    compressionMove();
  }
}

function compressionMove() {
  compressionDepthData.push(depth);
  timerData.push(timer);
  console.log(depth);
  if (depth > depth2) {
    up = false;
    countCompressions();
    up2 = up;
  } else if (depth < depth2) {
    up = true;
    countCompressions();
    up2 = up;
  }
  depth2 = depth;
}

function compressionGrade() {}

function calculateScore() {}

function update() {
  // code written in here will be executed every frame

  //countCompressions();
  compressionDepth();
}

// setupAppCanvas() function will initialize #app-canvas.
// if you intend to use #app-canvas, call this function in setup()
var canvas;
var ctx;
var dpr;
var appWidth;
var appHeight;
