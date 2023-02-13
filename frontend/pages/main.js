//window
const switchElement = document.getElementById("switch_wid");
const switchElement_hum = document.getElementById("switch_hum");
const url = "http://localhost:5000/api/sensor/window/get-state"
const url_hum = "http://localhost:5000/api/sensor/total_hum/get-state"

const response = await fetch(url);
var data = await response.json();
var switchState = data.state;
console.log(switchState);
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
        console.log("State posted successfully");
      } else {
        console.error("Failed to post state");
      }
    })
    .catch(error => console.error(error));

});

const response_hum = await fetch(url_hum);
var data_hum = await response_hum.json();
var switchState_hum = data_hum.state;
console.log(switchState_hum);

switchElement_hum.addEventListener("change", function() {

  if (switchState_hum == "off") {
    switchElement_hum.setAttribute("data-state", "on");
    switchState_hum = "on";
  } else {
    switchElement_hum.setAttribute("data-state", "off");
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
        console.log("State posted successfully");
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
fetch("http://localhost:5000/api/temp_hum/get-data?t=5M")
  .then(response => response.json())
  .then(data => {
    const responseData = data;
    // use responseData as needed here
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
const response_th = await fetch("http://localhost:5000/api/temp_hum/get-data?t=5M");
var data_th = await response.json();
var data_th_now = data_th.data;
console.log(data_th);


var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['1', '2', '3', '4', 'ср'],
        datasets: [{
            label: 'temperature',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(255, 255, 192, .8)',
                'rgba(75, 192, 192, .8)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
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