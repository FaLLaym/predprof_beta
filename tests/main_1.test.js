/*
const fetchMock = require('fetch-mock');

// Import the code to be tested
const {
  IsAbleHT
} = require('./your-code-file.js');

// Mock the session storage for testing
global.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn()
};

describe('IsAbleHT function', () => {
  beforeEach(() => {
    // Reset the sessionStorage mocks before each test
    sessionStorage.getItem.mockReset();
    sessionStorage.setItem.mockReset();
  });

  it('should not disable toggle_wid and toggle_hum when mode is true', async () => {
    // Set up the test data
    const data_th_now = [['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 10, 20]];

    // Set the mode to true
    sessionStorage.getItem.mockReturnValueOnce('true');

    // Call the function being tested
    await IsAbleHT(data_th_now);

    // Check that toggle_wid and toggle_hum are not disabled
    expect(document.getElementById('toggle_wid').disabled).toBe(false);
    expect(document.getElementById('toggle_hum').disabled).toBe(false);
  });

  it('should disable toggle_wid and not toggle_hum when T >= data_th_now[0][9] and mode is false', async () => {
    // Set up the test data
    const data_th_now = [['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 20, 30]];

    // Set the T threshold to be greater than the value in data_th_now[0][9]
    sessionStorage.getItem.mockReturnValueOnce('false');
    sessionStorage.getItem.mockReturnValueOnce('21');

    // Call the function being tested
    await IsAbleHT(data_th_now);

    // Check that toggle_wid is disabled and toggle_hum is not disabled
    expect(document.getElementById('toggle_wid').disabled).toBe(true);
    expect(document.getElementById('toggle_hum').disabled).toBe(false);
  });

  it('should disable toggle_hum and not toggle_wid when H <= data_th_now[0][10] and mode is false', async () => {
    // Set up the test data
    const data_th_now = [['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 20, 10]];

    // Set the H threshold to be less than the value in data_th_now[0][10]
    sessionStorage.getItem.mockReturnValueOnce('false');
    sessionStorage.getItem.mockReturnValueOnce(null);
    sessionStorage.setItem.mockImplementationOnce(() => {});

    // Call the function being tested
    await IsAbleHT(data_th_now);

    // Check that toggle_hum is disabled and toggle_wid is not disabled
    expect(document.getElementById('toggle_hum').disabled).toBe(true);
    expect(document.getElementById('toggle_wid').disabled).toBe(false);
  });
});

describe('Chart rendering', () => {
  beforeAll(() => {
    // Mock the fetch response for testing
    fetchMock.get('http://localhost:5000/api/temp_hum/get-data?t=5M', {
      status: 200,
      body: {
        data: [['2022-01-01 12:00:00', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
      }
    });
  });

  afterAll(() => {
    // Remove the
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