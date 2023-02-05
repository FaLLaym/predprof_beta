//window
const switchElement = document.getElementById("switch_wid");
const url = "http://localhost:5000/api/sensor/window/get-state"
const URL = "http://localhost:5000/api/sensor/window/change-state/"
var switchState = "close";
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


