let btn = document.querySelector(".emergency");
let mode = 'false';
let data_values = new Array();

const elements = document.getElementsByTagName('*');
const logo = document.getElementsByTagName('.header_logo');
const html = document.querySelector('html');

document.getElementById("emergency").addEventListener("click", function(event) {
  event.preventDefault();
  if (mode == "false"){
    mode = 'true'
    var T = 0;
    var H = 999;
    var Hb = 999;
    console.log("T: " + T + "  " + "H: " + H+ "  "+ "Hb: " + Hb );
    console.log("emergency mode on");
    btn.style.backgroundColor = "red";
    /**
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.color = 'red';
    }
    logo.style.backgroundImage = 'linear-gradient(to right, #FF0000, #000000)';
    headerLogo.style.webkitBackgroundClip = 'text';
    headerLogo.style.webkitTextFillColor = 'transparent';
    html.style.background = 'linear-gradient(to right, #FF0000, #000000)';
    **/
  }else{
    btn.style.backgroundColor = "grey";
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.color = 'white';
    }

    mode = 'false'
    if (sessionStorage.getItem("T") != 0){
        T = sessionStorage.getItem("T");
        H = sessionStorage.getItem("H");
        Hb = sessionStorage.getItem("H");

    }else{
        T = 0;
        H = 999;
        Hb = 999;
    }
    console.log("emergency mode off");
    console.log("T: " + T + "  " + "H: " + H+ "  "+ "Hb: " + Hb );
  }
});
try{
    document.getElementById("input_data").addEventListener("submit", function(event) {
      event.preventDefault();
      data_values = [];
      var T = document.getElementById("input_T").value;
      var H = document.getElementById("input_H").value;
      var Hb = document.getElementById("input_Hb").value;
      sessionStorage.setItem("T", T);
      sessionStorage.setItem("H", H);
      sessionStorage.setItem("H", Hb);

      console.log("T: " + T + "  " + "H: " + H+ "  "+ "Hb: " + Hb );
    });
    //////////////////////
    const form = document.querySelector('.section-main_data');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const inputs = form.querySelectorAll('.input_data');
        const data = [];

        for (const input of inputs) {
            data.push(input.value);
        }
        console.log(data);
        const response = await fetch('http://localhost:5000/api/data', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data })
        });

        if (response.ok) {
            const json = await response.json();
            console.log(json);
        } else {
            console.error('Error:', response.statusText);
        }
    });
}catch{console.log('its wrong page')}

const response_hb = await fetch("http://localhost:5000/api/hum/get-data");
var data_hb = await response_hb.json();
var data_hb_now = data_hb.data;
console.log(data_hb);
/**
async function IsAbleWindow() {
  const response_hb = await fetch("http://localhost:5000/api/hum/get-data");  const data_wlsc = await response_wlsc.json();
  var data_hb = await response_hb.json();
  var data_hb_now = data_hb.data;
  if
  if(data_hb[0][9] > sessionStorage.getItem("T")){
    toggle_wid.checked = false;
    toggle_wid.disable = true;
  }
  if(data_hb[0][10] < H){
    toggle_hum.checked = false;
    toggle_hum.disable = true;
  }
}

while(true){
    IsAbleWindowAndTHum()
}
**/