const toggleSwitch = async (switchNumber, toggleState) => {
  try {
    const response = await fetch(`http://localhost:5000/api/sensor/watering/change-state/${toggleState}?id=${switchNumber}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      console.log(`Switch ${switchNumber} successfully toggled`);
    } else {
      console.error(`Error toggling switch ${switchNumber}: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error toggling switch ${switchNumber}: ${error}`);
  }
};

const switches = document.querySelectorAll('.toggle');

switches.forEach((toggle, index) => {
  toggle.addEventListener('change', (event) => {
    const switchNumber = index + 1;
    const toggleState = event.target.checked ? 'on' : 'off';
    toggleSwitch(switchNumber, toggleState);
  });
});

const setSwitchStates = async () => {
  for (let index = 1; index <= switches.length; index++) {
    const response = await fetch(`http://localhost:5000/api/sensor/watering/get-state?id=${index}`);
    const data = await response.json();
    const switchState = data.state;
    switches[index-1].checked = switchState === 'on';
  }
};

setSwitchStates();
setInterval(async function() {
    var mode = sessionStorage.getItem("mode")||false;
    if(mode=='false'){
        Hb = sessionStorage.getItem("Hb");
        const response_hb = await fetch("http://localhost:5000/api/hum/get-data");
        var data_hb = await response_hb.json();
        var data_hb_now = data_hb.data;

        switches.forEach((toggle, index) => {
            const switchNumber = index + 1;
            if(Hb<data_hb_now[0][switchNumber]){
                target.checked = false;
                target.disabled = true;
            }

        });
    }else{
       switches.forEach((toggle, index) => {
            target.checked = false;
            target.disabled = true;
        });
    }


}, 1500);