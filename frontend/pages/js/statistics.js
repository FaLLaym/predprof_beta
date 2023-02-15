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
