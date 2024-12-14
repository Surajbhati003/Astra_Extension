document.addEventListener('DOMContentLoaded', function () {
  const highContrastToggle = document.getElementById('high-contrast-toggle');
  const screenMagnificationToggle = document.getElementById('screen-magnification-toggle');

  // Check the initial state of the toggles
  chrome.storage.sync.get(['highContrastEnabled', 'screenMagnificationEnabled'], function (data) {
    if (data.highContrastEnabled) {
      highContrastToggle.checked = true;
    }
    if (data.screenMagnificationEnabled) {
      screenMagnificationToggle.checked = true;
    }
  });

  // Handle high contrast toggle change
  highContrastToggle.addEventListener('change', function () {
    const isEnabled = highContrastToggle.checked;
    chrome.storage.sync.set({ highContrastEnabled: isEnabled });

    // Send a message to the content script to enable/disable high contrast
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle-high-contrast', enabled: isEnabled });
    });
  });

  // Handle screen magnification toggle change
  screenMagnificationToggle.addEventListener('change', function () {
    const isEnabled = screenMagnificationToggle.checked;
    chrome.storage.sync.set({ screenMagnificationEnabled: isEnabled });

    // Send a message to the content script to enable/disable screen magnification
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle-screen-magnification', enabled: isEnabled });
    });
  });
});
