var toggle_hum = document.getElementById("toggle_hum");
var toggle_wid = document.getElementById("toggle_wid");
Chart.defaults.global.legend.display = false;

let T = sessionStorage.getItem("T");
let H = sessionStorage.getItem("H");
let mode = sessionStorage.getItem("mode");

if (T === null) {
  T = 0;
}
if (H === null) {
  H = 999;
}
if (mode === null) {
  mode = false;
}

console.log("T = "+ T);
console.log("H = "+ H);

//console.log(data_th);
const response_th = await fetch("http://localhost:5000/api/temp_hum/get-data?t=5M");
var data_th = await response_th.json();
var data_th_now = data_th.data;
console.log(data_th);
current_data_t.innerText = data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[0]+':'+data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[1]+":"+data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[2];
async function IsAbleHT(data_th_now) {
    mode = sessionStorage.getItem("mode");
    if (mode === null) {
      mode = false;
    }
    if (mode == 'false'){
        if (T < data_th_now[0][9]){
            toggle_wid.disabled = false;
            console.log("wid Is able")
        }else{
            toggle_wid.disabled = true;
            toggle_wid.checked = false;

            console.log("wid Is disable")
        }
        if (H > data_th_now[0][10]){
            toggle_hum.disabled = false;
            console.log("hum Is able")
        }else{
            toggle_hum.disabled = true;
            toggle_hum.checked = false;

            console.log("hum Is disable")
        }
    }else{
        toggle_wid.disabled = false;
        toggle_hum.disabled = false;
    }
}
IsAbleHT(data_th_now)
var ctx_t = document.getElementById('Chart_temp').getContext('2d');
var myChart_temp = new Chart(ctx_t, {
    type: 'bar',
    data: {
        labels: ['1', '2', '3', '4', 'avg'],
        datasets: [{
            label: 'temperature',
            data: [data_th.data[0][1], data_th.data[0][2],data_th.data[0][3], data_th.data[0][4], data_th.data[0][9]],
            backgroundColor: [
                'rgba(240, 159, 200, 1)',
                'rgba(198, 120, 164, 1)',
                'rgba(243, 147, 126, 1)',
                'rgba(245, 162, 102, 1)',
                'rgba(215, 246, 199, 1)'
            ]
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////
current_data_h.innerText = data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[0]+':'+data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[1]+":"+data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[2];


var ctx_h = document.getElementById('Chart_hum').getContext('2d');
var myChart_hum = new Chart(ctx_h, {
    type: 'bar',
    data: {
        labels: ['1', '2', '3', '4', 'avg'],
        datasets: [{
            label: 'Humidity',
            data: [data_th.data[0][5], data_th.data[0][6],data_th.data[0][7], data_th.data[0][8], data_th.data[0][10]],
            backgroundColor: [
                'rgba(243, 147, 126, 1)',
                'rgba(245, 162, 102, 1)',
                'rgba(215, 246, 199, 1)',
                'rgba(122, 183, 140, 1)',
                'rgba(128, 228, 213, 1)'
            ]
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

setInterval(async function() {
  const response_th = await fetch("http://localhost:5000/api/temp_hum/get-data?t=5M");
  var data_th = await response_th.json();
  var data_th_now = data_th.data;
  myChart_temp.data.datasets[0].data = [data_th.data[0][1], data_th.data[0][2],data_th.data[0][3], data_th.data[0][4], data_th.data[0][9]];
  myChart_temp.update();
  myChart_hum.data.datasets[0].data = [data_th.data[0][5], data_th.data[0][6],data_th.data[0][7], data_th.data[0][8], data_th.data[0][10]];
  myChart_hum.update();
  let time = data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[0]+':'+data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[1]+":"+data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[2];
  current_data_h.innerText = time;
  current_data_t.innerText = time;
  IsAbleHT(data_th_now)

}, 15000);
////////////////////////////////////////////////////////////////////////////////////////////////
const response_hb = await fetch("http://localhost:5000/api/hum/get-data");
var data_hb = await response_hb.json();
var data_hb_now = data_hb.data;
console.log(data_hb);
current_data_hb.innerText = data_hb.data[0][0].split(' ')[1].split('.')[0].split('-')[0]+':'+data_hb.data[0][0].split(' ')[1].split('.')[0].split('-')[1]+":"+data_hb.data[0][0].split(' ')[1].split('.')[0].split('-')[2];

var ctx_hb = document.getElementById('Chart_hb').getContext('2d');
var myChart_hb = new Chart(ctx_hb, {
    type: 'bar',
    data: {
        labels: ['1', '2', '3', '4', '5', '6', 'avg'],
        datasets: [{
            label: 'Soil Humidity',
            data: [data_hb.data[0][1], data_hb.data[0][2], data_hb.data[0][3], data_hb.data[0][4], data_hb.data[0][5], data_hb.data[0][6], data_hb.data[0][7]],
            backgroundColor: [
                'rgba(240, 159, 200, 1)',
                'rgba(198, 120, 164, 1)',
                'rgba(243, 147, 126, 1)',
                'rgba(245, 162, 102, 1)',
                'rgba(215, 246, 199, 1)',
                'rgba(122, 183, 140, 1)',
                'rgba(128, 228, 213, 1)'
            ]
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
setInterval(async function() {
  const response_hb = await fetch("http://localhost:5000/api/hum/get-data");
  var data_hb = await response_hb.json();
  var data_hb_now = data_hb.data;
  current_data_hb.innerText = data_hb.data[0][0].split(' ')[1].split('.')[0].split('-')[0]+':'+data_hb.data[0][0].split(' ')[1].split('.')[0].split('-')[1]+":"+data_hb.data[0][0].split(' ')[1].split('.')[0].split('-')[2];

  myChart_hb.data.datasets[0].data = [data_hb.data[0][1], data_hb.data[0][2], data_hb.data[0][3], data_hb.data[0][4], data_hb.data[0][5], data_hb.data[0][6], data_hb.data[0][7]];
  myChart_hb.update();
}, 150000);



///window last opening///
async function fetchAndSetLastWindowOpen() {
  const response_wlsc = await fetch("http://localhost:5000/api/sensor/window/last-state-change/open");
  const data_wlsc = await response_wlsc.json();
  const lst_open = data_wlsc.date;
  console.log(lst_open);
  last_window_open.innerText = lst_open.split('.')[0];
}
fetchAndSetLastWindowOpen()

///humidity last opening///
async function fetchAndSetLastTotalHumOpen() {
    const response_hlsc = await fetch("http://localhost:5000/api/sensor/total_hum/last-state-change/on");
    var data_hlsc = await response_hlsc.json();
    var hum_lst_opening = data_hlsc.date;
    console.log(hum_lst_opening);
    last_thum_open.innerText = hum_lst_opening.split('.')[0];
}
fetchAndSetLastTotalHumOpen()


//window
const switchElement_t = document.getElementById("switch_wid");
const url = "http://localhost:5000/api/sensor/window/get-state"

const response = await fetch(url);
var data = await response.json();
var switchState = data.state;
console.log(`Window ${switchState}`);
if (switchState == "close") {
    toggle_wid.checked = false;
  } else {
    toggle_wid.checked = true;
    last_window_open.innerText = "IT'S OPEN NOW";
  }

switchElement_t.addEventListener("change", function() {
  IsAbleHT(data_th_now);

  if (switchState == "close") {
    switchElement_t.setAttribute("data-state", "open");
    switchState = "open";
    last_window_open.innerText = "IT'S OPEN NOW";
  } else {
    switchElement_t.setAttribute("data-state", "close");
    switchState = "close";
    fetchAndSetLastWindowOpen()
  }

  fetch(`http://localhost:5000/api/sensor/window/change-state/${switchState}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  })
    .then(response => {
      if (response.ok) {
        console.log(`Window ${switchState}`);

      } else {
        console.error("Failed to post state");
      }
    })
    .catch(error => console.error(error));

});


///TOTAL HUM
const switchElement_hum = document.getElementById("switch_hum");
const url_hum = "http://localhost:5000/api/sensor/total_hum/get-state"

const response_hum = await fetch(url_hum);
var data_hum = await response_hum.json();
var switchState_hum = data_hum.state;
console.log(`TOTAL_HUM ${switchState_hum}`);

if (switchState_hum == "off") {
    toggle_hum.checked = false;
  } else {
    toggle_hum.checked = true;
    last_thum_open.innerText = "IT'S OPEN NOW";
  }

switchElement_hum.addEventListener("change", function() {
  IsAbleHT(data_th_now);
  if (switchState_hum == "off") {
    switchState_hum = "on";
    console.log(`TOTAL_HUM ${switchState_hum}`);
    fetch(`http://localhost:5000/api/sensor/total_hum/change-state/on`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  })
    .then(response_hum => {
      if (response_hum.ok) {
        console.log(`TOTAL_HUM ${switchState_hum}`);
        last_thum_open.innerText = "IT'S OPEN NOW";
      } else {
        console.error("Failed to post state");
      }
    })
    .catch(error => console.error(error));

  } else {
    switchState_hum = "off";
    console.log(`TOTAL_HUM ${switchState_hum}`);
    fetch(`http://localhost:5000/api/sensor/total_hum/change-state/off`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  })
    .then(response_hum => {
      if (response_hum.ok) {
        console.log(`TOTAL_HUM ${switchState_hum}`);
        fetchAndSetLastTotalHumOpen()
      } else {
        console.error("Failed to post state");
      }
    })
    .catch(error => console.error(error));
  }

});
