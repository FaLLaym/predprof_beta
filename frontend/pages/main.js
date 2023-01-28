let response_w = await fetch("http://localhost:5000/api/sensor/window/get-state");
var window_state = false
if (response_w.ok) {
  let window = await response_w.json();
  console.log(window.state);
  if window.state == "close":
    window_state = false;
  else:
    window_state = true;
  console.log(window_state);
} else {
  alert("Ошибка HTTP: " + response.status);
}