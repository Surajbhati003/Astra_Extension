document.addEventListener('DOMContentLoaded', async () => {
    const ttsToggle = document.getElementById('ttsToggle');
  
    // Load saved setting
    const { ttsEnabled } = await chrome.storage.sync.get('ttsEnabled');
    ttsToggle.checked = ttsEnabled !== false; // Default to enabled if not set
  
    // Save the setting when toggled
    ttsToggle.addEventListener('change', () => {
      chrome.storage.sync.set({ ttsEnabled: ttsToggle.checked });
      if (!ttsToggle.checked) {
        pauseTTS();
      }
    });
  });
  
  function pauseTTS() {
    // Add your text-to-speech pause logic here
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    } else {
      console.error('Text-to-speech not supported in this browser.');
    }
  }
  