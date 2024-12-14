document.addEventListener('DOMContentLoaded', () => {
    // Start the voice tutorial
    startVoiceTutorial();
  
    // Initialize the high contrast and screen magnification toggles
    const highContrastToggle = document.getElementById('high-contrast-toggle');
    const screenMagnificationToggle = document.getElementById('screen-magnification-toggle');
  
    // Load saved settings
    chrome.storage.sync.get(['highContrastEnabled', 'screenMagnificationEnabled'], function (data) {
      highContrastToggle.checked = data.highContrastEnabled || false;
      screenMagnificationToggle.checked = data.screenMagnificationEnabled || false;
  
      // Apply settings immediately on page load
      toggleHighContrast(data.highContrastEnabled);
      toggleScreenMagnification(data.screenMagnificationEnabled);
    });
  
    // Save the setting and apply it dynamically when toggled
    highContrastToggle.addEventListener('change', () => {
      const enabled = highContrastToggle.checked;
      chrome.storage.sync.set({ highContrastEnabled: enabled });
      chrome.runtime.sendMessage({ action: 'toggle-high-contrast', enabled: enabled });
    });
  
    screenMagnificationToggle.addEventListener('change', () => {
      const enabled = screenMagnificationToggle.checked;
      chrome.storage.sync.set({ screenMagnificationEnabled: enabled });
      chrome.runtime.sendMessage({ action: 'toggle-screen-magnification', enabled: enabled });
    });
  });
  
  function startVoiceTutorial() {
    const tutorialSteps = [
      "Welcome to the Voice Assistant and Text-to-Speech Extension.",
      "To activate the voice assistant, press Ctrl+Shift+V.",
      "Use the Tab and arrow keys to navigate through web content and hear it read aloud.",
      "You can say 'search for' followed by your query to perform a search.",
      "Here are some useful keyboard shortcuts: Press F for full screen in YouTube videos, Ctrl+L to focus on the address bar, and Ctrl+F to open the find bar."
    ];
  
    tutorialSteps.forEach((step, index) => {
      setTimeout(() => {
        speakText(step);
      }, index * 5000); // 5 seconds delay between each step
    });
  }
  
  function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
  