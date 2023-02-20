setInterval(async () => {
  const mode = sessionStorage.getItem("mode") || false;
  if (mode == 'false') {
    const Hb = sessionStorage.getItem("Hb");
    const response = await fetch("http://localhost:5000/api/hum/get-data");
    const data = await response.json();
    const dataNow = data.data[0];

    switches.forEach((toggle, index) => {
      const switchNumber = index + 1;
      const dataThreshold = dataNow[switchNumber + 9];
      if (Hb < dataThreshold) {
        toggle.checked = false;
        toggle.disabled = true;
      } else {
        toggle.disabled = false;
      }
    });
  } else {
    switches.forEach((toggle) => {
      toggle.checked = false;
      toggle.disabled = true;
    });
  }
}, 1500);
