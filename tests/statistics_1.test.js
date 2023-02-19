/*const { JSDOM } = require('jsdom');
const Grid = require('gridjs');

const { renderGrid } = require('./your-file.js');

describe('renderGrid', () => {
  let container;

  beforeEach(() => {
    const dom = new JSDOM('<!DOCTYPE html><html><body><div id="wrapper"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    container = document.getElementById('wrapper');
  });

  afterEach(() => {
    gridjs.unmount(container);
  });

  it('should render a grid with the given data and columns', () => {
    const data = [      ['1', '2', '3'],
      ['4', '5', '6']
    ];
    const columns = ['A', 'B', 'C'];

    renderGrid(data, columns);

    const grid = container.querySelector('.gridjs__container');
    expect(grid).toBeTruthy();

    const columnHeaders = grid.querySelectorAll('.gridjs__th');
    expect(columnHeaders.length).toBe(3);
    expect(columnHeaders[0].textContent).toBe('A');
    expect(columnHeaders[1].textContent).toBe('B');
    expect(columnHeaders[2].textContent).toBe('C');

    const cells = grid.querySelectorAll('.gridjs__td');
    expect(cells.length).toBe(6);
    expect(cells[0].textContent).toBe('1');
    expect(cells[1].textContent).toBe('2');
    expect(cells[2].textContent).toBe('3');
    expect(cells[3].textContent).toBe('4');
    expect(cells[4].textContent).toBe('5');
    expect(cells[5].textContent).toBe('6');
  });

  it('should update an existing grid with the given data and columns', () => {
    const initialData = [      ['1', '2', '3'],
      ['4', '5', '6']
    ];
    const initialColumns = ['A', 'B', 'C'];

    renderGrid(initialData, initialColumns);

    const newData = [      ['7', '8', '9'],
      ['10', '11', '12']
    ];
    const newColumns = ['D', 'E', 'F'];

    renderGrid(newData, newColumns);

    const grid = container.querySelector('.gridjs__container');
    expect(grid).toBeTruthy();

    const columnHeaders = grid.querySelectorAll('.gridjs__th');
    expect(columnHeaders.length).toBe(3);
    expect(columnHeaders[0].textContent).toBe('D');
    expect(columnHeaders[1].textContent).toBe('E');
    expect(columnHeaders[2].textContent).toBe('F');

    const cells = grid.querySelectorAll('.gridjs__td');
    expect(cells.length).toBe(6);
    expect(cells[0].textContent).toBe('7');
    expect(cells[1].textContent).toBe('8');
    expect(cells[2].textContent).toBe('9');
    expect(cells[3].textContent).toBe('10');
    expect(cells[4].textContent).toBe('11');
    expect(cells[5].textContent).toBe('12');
  });
});
// импортируем библиотеку для юнит-тестирования (например, Mocha)
const assert = require('assert');

// функция для тестирования
function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}
*/
// примеры тестов

// импортируем библиотеку для юнит-тестирования (например, Mocha)

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