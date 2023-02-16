const s = document.getElementById('s1');
const options = [
  {
    name: 't&h',
    url: 'http://localhost:5000/api/temp_hum/get-data?t=5M',
    columns: [
      'date', 't1', 't2', 't3', 't4', 'h1', 'h2', 'h3', 'h4', 't_avg', 'h_avg'
    ]
  },
  {
    name: 'hb',
    url: 'http://localhost:5000/api/hum/get-data',
    columns: [
      'date', 'hb1', 'hb2', 'hb3', 'hb4', 'hb5', 'hb6', 'hb_avg'
    ]
  }
];

let grid;

async function renderGrid(data, columns) {
  if (grid) {
    grid.updateConfig({
      columns: columns,
      data: data,
    }).forceRender();
  } else {
    grid = new gridjs.Grid({
      columns: columns,
      data: data,
      pagination: {
        limit: 13
      },
    }).render(document.getElementById("wrapper"));
  }
}

s.addEventListener('change', async () => {
  const selectedOption = options.find(option => option.name === s.value);
  const response = await fetch(selectedOption.url);
  const data = await response.json();
  const data_table = data.data.slice(0, selectedOption.name === 't&h' ? 78 : 30);
  var arr = new Array(data_table.length);
  for (var i = 0; i < arr.length; i++) {
      arr[i] = new Array(data_table[0].length);
      for (var j = 0; j < data_table[i].length; j++) {
        if (j == 0) {
          var splitResult = data_table[i][j].split(' ');
          if (splitResult.length >= 2) {
            arr[i][j] = splitResult[1].split('.')[0].replace(/-/g, ':');
          } else {
            arr[i][j] = data_table[i][j];
          }
        } else {
          arr[i][j] = data_table[i][j];
        }
      }
  }
  renderGrid(arr, selectedOption.columns);
});

// Initial load
s.dispatchEvent(new Event('change'));

// Periodic data updates
setInterval(async function() {
  const selectedOption = options.find(option => option.name === s.value);
  const response = await fetch(selectedOption.url);
  const data = await response.json();
  console.log(data);
  const data_table = data.data.slice(0, selectedOption.name === 't&h' ? 78 : 30);
  var arr = new Array(data_table.length);
  for (var i = 0; i < arr.length; i++) {
      arr[i] = new Array(data_table[0].length);
      for (var j = 0; j < data_table[i].length; j++) {
        if (j == 0) {
          var splitResult = data_table[i][j].split(' ');
          if (splitResult.length >= 2) {
            arr[i][j] = splitResult[1].split('.')[0].replace(/-/g, ':');
          } else {
            arr[i][j] = data_table[i][j];
          }
        } else {
          arr[i][j] = data_table[i][j];
        }
      }
  }
  console.log(arr);
  renderGrid(arr, selectedOption.columns);
}, 15000);
