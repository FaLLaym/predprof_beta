///window last opening///
async function fetchAndSetLastWindowOpen() {
  const response_wlsc = await fetch("http://localhost:5000/api/sensor/window/last-state-change/open");
  const data_wlsc = await response_wlsc.json();
  const lst_open = data_wlsc.date;
  console.log(lst_open);
  last_window_open.innerText = lst_open.split('.')[0];
}
fetchAndSetLastWindowOpen()

/**humidity last opening///
const response_hlsc = await fetch("http://localhost:5000/api/sensor/watering/last-state-change/on");
var data_hlsc = await response_hlsc.json();
var hum_lst_opening = data_hlsc.date;
console.log(hum_lst_opening);
last_thum_open.innerText = hum_lst_opening;
**/

//window
const switchElement = document.getElementById("switch_wid");
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
  }

switchElement.addEventListener("change", function() {

  if (switchState == "close") {
    switchElement.setAttribute("data-state", "open");
    switchState = "open";

  } else {
    switchElement.setAttribute("data-state", "close");
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
console.log(`Window ${switchState}`);

if (switchElement_hum == "off") {
    toggle_hum.checked = false;
  } else {
    toggle_hum.checked = true;
  }

switchElement_hum.addEventListener("change", function() {

  if (switchState_hum.checked) {
    switchState_hum = "on";
    console.log(`TOTAL_HUM ${switchState_hum}`);
  } else {
    switchState_hum = "off";
    console.log(`TOTAL_HUM ${switchState_hum}`);
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



