describe('renderGrid', () => {
  let wrapper;
  const data = [    ['2022-01-01', 1, 2],
    ['2022-01-02', 3, 4]
  ];
  const columns = ['Date', 'Value1', 'Value2'];

  beforeEach(() => {
    wrapper = document.createElement('div');
  });

  afterEach(() => {
    wrapper.remove();
  });

  it('should render grid with correct data and columns', () => {
    renderGrid(data, columns);

    const table = wrapper.querySelector('table');
    const ths = table.querySelectorAll('thead th');
    const tds = table.querySelectorAll('tbody td');

    expect(ths).toHaveLength(columns.length);
    expect(tds).toHaveLength(data.length * columns.length);

    ths.forEach((th, i) => {
      expect(th.textContent).toBe(columns[i]);
    });

    tds.forEach((td, i) => {
      expect(td.textContent).toBe(String(data[Math.floor(i / columns.length)][i % columns.length]));
    });
  });

  it('should update grid with new data and columns', () => {
    renderGrid(data, columns);

    const newData = [      ['2022-01-03', 5, 6],
      ['2022-01-04', 7, 8]
    ];
    const newColumns = ['Date', 'NewValue1', 'NewValue2'];

    renderGrid(newData, newColumns);

    const table = wrapper.querySelector('table');
    const ths = table.querySelectorAll('thead th');
    const tds = table.querySelectorAll('tbody td');

    expect(ths).toHaveLength(newColumns.length);
    expect(tds).toHaveLength(newData.length * newColumns.length);

    ths.forEach((th, i) => {
      expect(th.textContent).toBe(newColumns[i]);
    });

    tds.forEach((td, i) => {
      expect(td.textContent).toBe(String(newData[Math.floor(i / newColumns.length)][i % newColumns.length]));
    });
  });

  it('should limit number of rows to pagination limit', () => {
    renderGrid(data, columns);

    const table = wrapper.querySelector('table');
    const tds = table.querySelectorAll('tbody td');

    expect(tds).toHaveLength(13 * columns.length);
  });
});
