// Функция для получения и установки статуса для toggle
async function toggleStatus(url, toggleElement) {
  const response = await fetch(url);
  const data = await response.json();
  const status = data.status;
  if (status == "open" or "on"){
    toggleElement.checked = true;
  }else{
    toggleElement.checked = false;
  }

}

// Получение элементов для toggle
const toggleWid = document.getElementById('toggle_wid');
const toggleHum = document.getElementById('toggle_hum');
var switchState_hum = 'off';
var switchState_t = 'close';
// Установка начального статуса toggle
toggleWStatus('http://localhost:5000/api/sensor/window/get-state', toggleWid);
toggleStatus('http://localhost:5000/api/sensor/total_hum/get-state', toggleHum);

// Обработчик изменения статуса для toggle_wid
toggleWid.addEventListener('change', async function () {
  const status = this.checked;
  if (status == true){
    switchState_t = "open";
  }else{
    switchState_t = "close";
  }
  const response = await fetch(`http://localhost:5000/api/sensor/window/change-state/${switchState_t}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
});

// Обработчик изменения статуса для toggle_hum
toggleHum.addEventListener('change', async function () {
  const status = this.checked;
  if (status == true){
    switchState_hum = "on";
  }else{
    switchState_hum = "off";
  }
  const response = await fetch(`http://localhost:5000/api/sensor/total_hum/${switchState_hum}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
});
/** Отрисовка времени
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
    last_thum_open.innerText = hum_lst_opening;
}
fetchAndSetLastTotalHumOpen()

T = sessionStorage.getItem("T");
H = sessionStorage.getItem("H");
Hb = sessionStorage.getItem("H");

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
const toggle_wid = document.getElementById("toggle_wid");
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
  const response_th = await fetch("http://localhost:5000/api/temp_hum/get-data?t=5M");
  var data_th = await response_th.json();
  var data_th_now = data_th.data;
  var t_avg = data_th_now[0][9];

  if (T == 'null'){
    T = 0;
  }

  if (t_avg < T) {
    // Enable toggle switch
    switchState.disabled = false;
    // Change toggle switch state
    switchState.checked = !switchState.checked;
  } else {
    // Disable toggle switch
    switchState.disabled = true;
  }





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
const toggle_hum = document.getElementById("toggle_hum");

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
  const response_th = await fetch("http://localhost:5000/api/temp_hum/get-data?t=5M");
  var data_th = await response_th.json();
  var data_th_now = data_th.data;
  var h_avg = data_th_now[0][10];

  if (H == 'null'){
    H = 0;
  }

  if (h_avg > H) {
    // Enable toggle switch
    switchState_hum.disabled = false;
    // Change toggle switch state
    switchState_hum.checked = !switchState_hum.checked;
  } else {
    // Disable toggle switch
    switchState_hum.disabled = true;
  }
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


