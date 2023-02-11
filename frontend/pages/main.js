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





//window
const switchElement = document.getElementById("switch_wid");
const url = "http://localhost:5000/api/sensor/window/get-state"
const URL = "http://localhost:5000/api/sensor/window/change-state/"

const response = await fetch(url);
var data = await response.json();
var switchState = data.state;
console.log(switchState);
switchElement.addEventListener("click", function() {

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

///window last opening///
const url_wlsc = "http://localhost:5000/api/sensor/window/last-state-change/open"
const response_wlsc = await fetch(url_wlsc);
var data_wlsc = await response_wlsc.json();
var lst_open = data_wlsc.date;
console.log(lst_open);
last_open.innerText = lst_open;


///humidity last opening///
const url_hlsc = "http://localhost:5000/api/sensor/watering/last-state-change/"
const response_hlsc = await fetch(url_hlsc);
var data_hlsc = await response_hlsc.json();
var hum_lst_opening = data_hlsc.date;
console.log(hum_lst_opening);
hum_last_open.innerText = hum_lst_opening;

///


