// Function to speak text using the Web Speech API
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Default language is English
    window.speechSynthesis.speak(utterance);
  }
  
  // Check if the element is visible
  function isVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.top >= 0;
  }
  
  // Event listener for the 'Tab' key
  document.addEventListener('keydown', async (event) => {
    const enabled = await chrome.storage.sync.get('ttsEnabled');
    if (enabled.ttsEnabled === false) return;
  
    if (event.key === 'Tab') {
      setTimeout(() => {
        const activeElement = document.activeElement; // Currently focused element
        if (isVisible(activeElement)) {
          const elementText = activeElement.getAttribute('aria-label') || activeElement.innerText || activeElement.value;
          if (elementText) {
            speakText(elementText.trim());
          } else {
            speakText("NULL");
          }
        }
      }, 100); // Delay to ensure the next element is focused
    }
  });
  