console.log("Content script loaded.");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toggle-high-contrast") {
    toggleHighContrast(request.enabled);
  } else if (request.action === "toggle-screen-magnification") {
    toggleScreenMagnification(request.enabled);
  }
});

function toggleHighContrast(enabled) {
  if (enabled) {
    enableHighContrast();
  } else {
    disableHighContrast();
  }
}

function toggleScreenMagnification(enabled) {
  if (enabled) {
    enableScreenMagnification();
  } else {
    disableScreenMagnification();
  }
}

function enableHighContrast() {
  const style = document.createElement('style');
  style.id = 'high-contrast-style';
  style.innerHTML = `
    * {
      background-color: #000 !important;
      color: #fff !important;
      outline: 2px solid #fff !important;
      outline-offset: -2px;
    }
    a {
      color: #0d6efd !important;
    }
    button, input, select, textarea {
      background-color: #444 !important;
      color: #fff !important;
      border: 2px solid #fff !important;
    }
  `;
  document.head.appendChild(style);
}

function disableHighContrast() {
  const style = document.getElementById('high-contrast-style');
  if (style) {
    style.remove();
  }
}

function enableScreenMagnification() {
  const style = document.createElement('style');
  style.id = 'screen-magnification-style';
  style.innerHTML = `
    html {
      zoom: 1.25;
    }
    * {
      max-width: 100%;
      overflow: visible !important;
    }
  `;
  document.head.appendChild(style);
}

function disableScreenMagnification() {
  const style = document.getElementById('screen-magnification-style');
  if (style) {
    style.remove();
  }
}

// Initialize accessibility features based on the stored state
chrome.storage.sync.get(['highContrastEnabled', 'screenMagnificationEnabled'], function (data) {
  if (data.highContrastEnabled) {
    toggleHighContrast(true);
  }
  if (data.screenMagnificationEnabled) {
    toggleScreenMagnification(true);
  }
});
