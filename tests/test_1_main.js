describe('IsAbleHT', () => {
  it('should disable humidity toggle when humidity is too high', () => {
    // Arrange
    const data_th_now = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 90]]; // humidity is 90%
    const toggle_hum = { disabled: false, checked: false };
    const toggle_wid = { disabled: false, checked: false };
    sessionStorage.setItem('mode', 'false');
    sessionStorage.setItem('H', '80');

    // Act
    IsAbleHT(data_th_now);

    // Assert
    expect(toggle_hum.disabled).toBe(true);
    expect(toggle_hum.checked).toBe(false);
    expect(toggle_wid.disabled).toBe(false);
    expect(toggle_wid.checked).toBe(false);
  });

  it('should disable wind toggle when temperature is too low', () => {
    // Arrange
    const data_th_now = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 90]];
    const toggle_hum = { disabled: false, checked: false };
    const toggle_wid = { disabled: false, checked: false };
    sessionStorage.setItem('mode', 'false');
    sessionStorage.setItem('T', '10');

    // Act
    IsAbleHT(data_th_now);

    // Assert
    expect(toggle_wid.disabled).toBe(true);
    expect(toggle_wid.checked).toBe(false);
    expect(toggle_hum.disabled).toBe(false);
    expect(toggle_hum.checked).toBe(false);
  });

  it('should not disable any toggles in manual mode', () => {
    // Arrange
    const data_th_now = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 90]];
    const toggle_hum = { disabled: false, checked: false };
    const toggle_wid = { disabled: false, checked: false };
    sessionStorage.setItem('mode', 'true');

    // Act
    IsAbleHT(data_th_now);

    // Assert
    expect(toggle_hum.disabled).toBe(false);
    expect(toggle_hum.checked).toBe(false);
    expect(toggle_wid.disabled).toBe(false);
    expect(toggle_wid.checked).toBe(false);
  });
});
