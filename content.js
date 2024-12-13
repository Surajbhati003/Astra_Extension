// Function to speak text using the Web Speech API
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Default language is English
    window.speechSynthesis.speak(utterance);
  }
  
  // Event listener for the 'Tab' key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      setTimeout(() => {
        const activeElement = document.activeElement; // Currently focused element
        const elementText = activeElement.getAttribute('aria-label') || activeElement.innerText || activeElement.value;
  
        if (elementText) {
          speakText(elementText.trim());
        } else {
          speakText("No accessible text found.");
        }
      }, 100); // Delay to ensure the next element is focused
    }
  });
  