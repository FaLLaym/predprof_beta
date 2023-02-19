/*
const { renderGrid } = require('./your-file'); // Import the function you want to test

describe('renderGrid', () => {
  test('renders grid with correct data and columns', () => {
    const data = [      ['2022-01-01 00:00:00', 20, 30],
      ['2022-01-01 01:00:00', 21, 31],
      ['2022-01-01 02:00:00', 22, 32],
    ];
    const columns = ['Date', 'Temperature', 'Humidity'];
    const wrapper = document.createElement('div');
    renderGrid(data, columns, wrapper);
    expect(wrapper.innerHTML).toMatchSnapshot(); // Use snapshot testing to check if the grid is rendered correctly
  });

  test('updates grid with new data and columns', () => {
    const oldData = [      ['2022-01-01 00:00:00', 20, 30],
      ['2022-01-01 01:00:00', 21, 31],
      ['2022-01-01 02:00:00', 22, 32],
    ];
    const oldColumns = ['Date', 'Temperature', 'Humidity'];
    const newData = [      ['2022-01-01 03:00:00', 23, 33],
      ['2022-01-01 04:00:00', 24, 34],
      ['2022-01-01 05:00:00', 25, 35],
    ];
    const newColumns = ['Date', 'Temp', 'Humid'];
    const wrapper = document.createElement('div');
    renderGrid(oldData, oldColumns, wrapper);
    renderGrid(newData, newColumns, wrapper);
    expect(wrapper.innerHTML).toMatchSnapshot();
  });
});
*/
var assert = require('assert');

assert.throws(
  function() {
    throw new Error("Wrong value");
  },
  function(err) {
    if ( (err instanceof Error) && /value/.test(err) ) {
      return true;
    }
  },
  "unexpected error"
);

function multiply(a, b) {
  return a * b;
}

// примеры тестов
describe('multiply', function() {
  it('должна вернуть 6 для 2 * 3', function() {
    assert.equal(multiply(2, 3), 6);
  });

  it('должна вернуть -12 для -2 * 6', function() {
    assert.equal(multiply(-2, 6), -12);
  });

  it('должна вернуть 0 для 0 * 100', function() {
    assert.equal(multiply(0, 100), 0);
  });
});