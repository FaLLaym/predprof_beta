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