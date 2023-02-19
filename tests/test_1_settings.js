test('should enable/disable both toggles when in emergency mode', () => {
  // Arrange
  const toggle_wid = document.getElementById('toggle_wid');
  const toggle_hum = document.getElementById('toggle_hum');
  const checkbox = document.getElementById('inpLock');

  // Act
  checkbox.checked = true;
  checkbox.dispatchEvent(new Event('change'));

  // Assert
  expect(document.body.className).toBe('body_emergency');
  expect(document.getElementById('emergency_text_header').innerText).toBe('EMERGENCY MODE');
  expect(toggle_wid.disabled).toBe(false);
  expect(toggle_hum.disabled).toBe(false);

  // Act
  checkbox.checked = false;
  checkbox.dispatchEvent(new Event('change'));

  // Assert
  expect(document.body.className).toBe('');
  expect(document.getElementById('emergency_text_header').innerText).toBe('');
  expect(toggle_wid.disabled).toBe(true);
  expect(toggle_hum.disabled).toBe(true);
});
