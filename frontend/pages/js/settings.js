var toggle_hum = document.getElementById("toggle_hum");
var toggle_wid = document.getElementById("toggle_wid");
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
async function IsAbleHT(data_th_now) {
    mode = sessionStorage.getItem("mode");
    if (mode === null) {
      mode = false;
    }
    if (mode == 'false'){
        if (T < data_th_now[0][9]){
            toggle_wid.disabled = false;
            console.log("wid Is able")
        }else{
            toggle_wid.disabled = true;
            toggle_wid.checked = false;

            console.log("wid Is disable")
        }
        if (H > data_th_now[0][10]){
            toggle_hum.disabled = false;
            console.log("hum Is able")
        }else{
            toggle_hum.disabled = true;
            toggle_hum.checked = false;

            console.log("hum Is disable")
        }
    }else{
        toggle_wid.disabled = false;
        toggle_hum.disabled = false;
    }
}

// добавляем обработчик события onchange
checkbox.addEventListener("change", function() {
  event.preventDefault();
  if (mode == "false"){
    mode = 'true'
    sessionStorage.setItem("mode",true);
    var T = 0;
    var H = 999;
    var Hb = 999;
    console.log("T: " + T + "  " + "H: " + H+ "  "+ "Hb: " + Hb );
    console.log("emergency mode on");
    txt.innerText = "EMERGENCY MODE";
    document.body.className = 'body_emergency';
    toggle_wid.disabled = false;
    toggle_hum.disabled = false;
  }else{
    document.body.className = 'body';
    txt.innerText = "";
    mode = 'false'
    sessionStorage.setItem("mode",false);
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
      event.target.reset();
      console.log("T: " + T + "  " + "H: " + H+ "  "+ "Hb: " + Hb );
       alert("Лимитеры успешно установлены");
    });


    //////////////////////
    const form = document.querySelector('.section-main_data');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const inputs = form.querySelectorAll('.input_data');
        const data = [];

        for (const input of inputs) {
            console.log(parseInt(input.value));
            data.push(parseInt(input.value)* 1.001);

        }
        console.log(data);
        event.target.reset();
        var today = new Date().toISOString();
        fetch('http://localhost:5000/api/hum/add-data', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "date": today,
            "h": data,
            "h_avg": null,
          }),
        })
          .then(response => {
            if (!response.ok) {
              /*console.error("Failed to post data");*/
            }
            alert("Данные успешно запиcаны в бд");
            console.log('Данные успешно отправлены на сервер');
          })
          .catch(eerror => console.error(error));

    });
}catch{console.log('its wrong page')}

