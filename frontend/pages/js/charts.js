Chart.defaults.global.legend.display = false;

const response_th = await fetch("http://localhost:5000/api/temp_hum/get-data?t=5M");
var data_th = await response_th.json();
var data_th_now = data_th.data;
console.log(data_th);
current_data_t.innerText = data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[0]+':'+data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[1]+":"+data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[2];

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
  myChart_temp.data.datasets[0].data = [data_th.data[0][1], data_th.data[0][2],data_th.data[0][3], data_th.data[0][4], data_th.data[0][9]];
  myChart_temp.update();
  myChart_hum.data.datasets[0].data = [data_th.data[0][5], data_th.data[0][6],data_th.data[0][7], data_th.data[0][8], data_th.data[0][10]];
  myChart_hum.update();
  let time = data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[0]+':'+data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[1]+":"+data_th.data[0][0].split(' ')[1].split('.')[0].split('-')[2];
  current_data_h.innerText = time;
  current_data_t.innerText = time;


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