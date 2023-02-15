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