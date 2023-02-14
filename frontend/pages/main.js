//window
const switchElement = document.getElementById("switch_wid");
const url = "http://localhost:5000/api/sensor/window/get-state"

const response = await fetch(url);
var data = await response.json();
var switchState = data.state;
console.log(`Window ${switchState}`);

switchElement.addEventListener("change", function() {

  if (switchState == "close") {
    switchElement.setAttribute("data-state", "open");
    switchState = "open";
  } else {
    switchElement.setAttribute("data-state", "close");
    switchState = "close";
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

switchElement_hum.addEventListener("change", function() {

  if (switchState_hum == "off") {
    switchElement_hum.setAttribute("data_hum-state", "on");
    switchState_hum = "on";
  } else {
    switchElement_hum.setAttribute("data_hum-state", "off");
    switchState_hum = "off";
  }


  fetch(`http://localhost:5000/api/sensor/total_hum/${switchState_hum}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  })
    .then(response_hum => {
      if (response_hum.ok) {
        console.log(`TOTAL_HUM ${switchState_hum}`);
      } else {
        console.error("Failed to post state");
      }
    })
    .catch(error => console.error(error));

});


/**window last opening///
const url_wlsc = "http://localhost:5000/api/sensor/window/last-state-change/open"
const response_wlsc = await fetch(url_wlsc);
var data_wlsc = await response_wlsc.json();
var lst_open = data_wlsc.date;
console.log(lst_open);
last_open.innerText = lst_open;
**/

/**humidity last opening///
const url_hlsc = "http://localhost:5000/api/sensor/watering/last-state-change/"
const response_hlsc = await fetch(url_hlsc);
var data_hlsc = await response_hlsc.json();
var hum_lst_opening = data_hlsc.date;
console.log(hum_lst_opening);
hum_last_open.innerText = hum_lst_opening;

**/



////////////////////////////////////////////////////////////////////////////////////////////////
const response_th = await fetch("http://localhost:5000/api/temp_hum/get-data?t=5M");
var data_th = await response_th.json();
var data_th_now = data_th.data;
console.log(data_th);


var ctx = document.getElementById('Chart_temp').getContext('2d');
var myChart_temp = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['1', '2', '3', '4', 'ср'],
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

var ctx = document.getElementById('Chart_hum').getContext('2d');
var myChart_hum = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['1', '2', '3', '4', 'ср'],
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
    console.log(data_th);

    myChart_hum.update();
    myChart_temp.update();
    console.log("Всё ок, я обновил график влажности и температуры!");
}, 150000);

////////////////////////////////////////////////////////////////////////////////////////////////
const response_hb = await fetch("http://localhost:5000/api/hum/get-data");
var data_hb = await response_hb.json();
var data_hb_now = data_hb.data;
console.log(data_hb);

var ctx = document.getElementById('Chart_hb').getContext('2d');
var myChart_hb = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['1', '2', '3', '4', '5', '6', 'ср'],
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
    console.log(data_hb);

    myChart_hb.data.datasets[0].data = [data_hb.data[0][1], data_hb.data[0][2], data_hb.data[0][3], data_hb.data[0][4], data_hb.data[0][5], data_hb.data[0][6], data_hb.data[0][7]];
    myChart_hb.update();
    console.log("Всё ок, я обновил график влажности почвы!");
}, 150000);