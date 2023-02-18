
let mode = 'false';
let data_values = new Array();
var checkbox = document.getElementById("inpLock");
var label = document.querySelector(".btn-lock");
var txt = document.getElementById("emergency_text_header");
var mode_storage = sessionStorage.getItem("mode");
if(mode_storage=='null'){
    checkbox.checked = 'true';
    mode = 'true';
}else{
    checkbox.checked = 'false';
    mode = 'false';
}
// добавляем обработчик события onchange
checkbox.addEventListener("change", function() {
  event.preventDefault();
  if (mode == "false"){
    mode = 'true'
    var T = 0;
    var H = 999;
    var Hb = 999;
    console.log("T: " + T + "  " + "H: " + H+ "  "+ "Hb: " + Hb );
    console.log("emergency mode on");
    txt.innerText = "EMERGENCY MODE";
    document.body.className = 'body_emergency';
  }else{
    document.body.className = 'body';
    txt.innerText = "";
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
        const response = await fetch('http://localhost:5000/api/hum/add-data', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "date":new Date().toISOString(),
                "h":data,
                "h_avg":null,
            })
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
