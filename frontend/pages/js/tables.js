const s = document.getElementById('s1');
const options = [ 't&h', 'hb' ];

let grid = null;

async function renderGrid(data, columns) {
  if (grid !== null && columns) {
    grid.updateConfig({
      columns: columns,
      data: data,
    }).forceRender();
  } else {
    grid = new gridjs.Grid({
      columns: [
        'date', 't1', 't2', 't3', 't4', 'h1', 'h2', 'h3', 'h4', 't_avg', 'h_avg'
      ],
      data: data,
      pagination: {
        limit: 15
      },
    }).render(document.getElementById("wrapper"));
  }
}

const columns_th=['date', 't1', 't2', 't3', 't4', 'h1', 'h2', 'h3', 'h4', 't_avg', 'h_avg'];
const columns_hb=['date', 'hb1', 'hb2', 'hb3', 'hb4', 'hb5', 'hb6', 'hb_avg'];

options.forEach(async (element, key) => {
  if (element === 't&h') {
    const response = await fetch("http://localhost:5000/api/temp_hum/get-data?t=5M");
    const data = await response.json();
    const data_table = data.data.slice(0, 75);
    renderGrid(data_table,columns_th);
    // Periodic data updates
    setInterval(async function() {
        const response = await fetch("http://localhost:5000/api/temp_hum/get-data?t=5M");
        const data = await response.json();
        const data_table = data.data;
        renderGrid(data_table);
    }, 150000);
  }
  if (element === 'hb') {
    const response_hb = await fetch('http://localhost:5000/api/hum/get-data');
    const data_hb = await response_hb.json();
    const data_table_hb = data_hb.data.slice(0, 30);
    renderGrid(data_table_hb,columns_hb);
    // Periodic data updates
    setInterval(async function() {
        const response_hb = await fetch('http://localhost:5000/api/hum/get-data');
        const data_hb = await response_hb.json();
        const data_table_hb = data_hb.data.slice(0, 30);
        renderGrid(data_table_hb,columns_hb);
    }, 150000);
  }
});


