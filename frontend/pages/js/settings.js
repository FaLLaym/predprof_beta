let btn = document.querySelector(".emergency");
let mode = 'false';
let data_values = new Array();

document.getElementById("emergency").addEventListener("click", function(event) {
  event.preventDefault();
  if (mode == "false"){
    mode = 'true'
    var T = 0;
    var H = 0;
    var Hb = 0;
    console.log("T: " + T + "  " + "H: " + H+ "  "+ "Hb: " + Hb );
    console.log("emergency mode on");
    btn.style.backgroundColor = "red";
  }else{
    btn.style.backgroundColor = "grey";
    mode = 'false'
    if (data_values.length != 0){
        T = data_values[0];
        H = data_values[1];
        Hb = data_values[2];
    }else{
        T = 0;
        H = 0;
        Hb = 0;
    }
    console.log("emergency mode off");
    console.log("T: " + T + "  " + "H: " + H+ "  "+ "Hb: " + Hb );
  }
});

document.getElementById("input_data").addEventListener("submit", function(event) {
  event.preventDefault();
  data_values = [];
  var T = document.getElementById("input_T").value;
  var H = document.getElementById("input_H").value;
  var Hb = document.getElementById("input_Hb").value;
  data_values.push(T);
  data_values.push(H);
  data_values.push(Hb);
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



