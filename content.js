console.log("Content script loaded.");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toggle-voice-assistant") {
    toggleVoiceAssistant();
  } else if (request.action === "start-tts") {
    startTextToSpeech();
  } else if (request.action === "stop-tts") {
    stopTextToSpeech();
  }
});

/* Voice Assistant for Queries */

function toggleVoiceAssistant() {
  const isVoiceAssistantActive = window.isVoiceAssistantActive || false; // Track whether the assistant is active

  if (isVoiceAssistantActive) {
    // Stop the voice assistant (clear the recognition process or reset)
    window.recognition.stop();
    speakText("Voice assistant deactivated.");
    window.isVoiceAssistantActive = false;
  } else {
    // Start the voice assistant (initiate speech recognition)
    startVoiceRecognition();
    speakText("Voice assistant activated");
    window.isVoiceAssistantActive = true;
  }
}

function initializeSpeechRecognition() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function (event) {
    const speechResult = event.results[0][0].transcript.toLowerCase();
    console.log("You said: ", speechResult);
    processVoiceCommand(speechResult);
  };

  recognition.onerror = function (event) {
    console.log("Speech Recognition Error: ", event.error);
    // Restart recognition on error to keep listening
    recognition.start();
  };

  recognition.onend = function () {
    // Restart recognition when it ends to keep listening if still active
    if (window.isVoiceAssistantActive) {
      recognition.start();
    }
  };

  window.recognition = recognition;
}

function startVoiceRecognition() {
  if (!window.recognition) {
    initializeSpeechRecognition();
  }
  window.recognition.start();
}

function processVoiceCommand(command) {
  console.log("Processing command: ", command);

  if (command.startsWith("search for")) {
    const query = command.replace(/^search for\s*/, "").trim();
    console.log("Search query: ", query);
    const searchInputSelectors = [
      'input[type="search"]',
      'input[name*="search"]',
      'input[placeholder*="Search"]',
      'input[type="text"]'
    ];

    let searchInput = null;

    searchInputSelectors.some((selector) => {
      searchInput = document.querySelector(selector);
      console.log(`Searching with selector: ${selector}, Found: ${searchInput}`);
      return searchInput; // Stop iteration if a match is found
    });

    if (searchInput) {
      // Clear the existing text in the search input
      searchInput.value = '';

      // Set the new query
      searchInput.value = query;
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));

      // Create and dispatch a 'keydown' event to press Enter
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true });
      searchInput.dispatchEvent(enterEvent);

      // Create and dispatch a 'keyup' event to press Enter
      const keyUpEvent = new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true });
      searchInput.dispatchEvent(keyUpEvent);

      speakText(`Searching for ${query}`);
      window.isVoiceAssistantActive = false; // Deactivate after processing command
      window.recognition.stop();
    } else {
      speakText("No search field found on the page.");
      // Keep listening if no search field is found
      window.recognition.start();
    }
  } else {
    speakText("Command not recognized.");
    // Keep listening if command is not recognized
    window.recognition.start();
  }
}

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; // Default language is English
  window.speechSynthesis.speak(utterance);
}

/* Text-to-Speech Functionality */


// Event listeners for the 'Tab' and arrow keys
document.addEventListener('keydown', (event) => {
  if (event.key === 'Tab' || event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    setTimeout(() => {
      const activeElement = document.activeElement; // Currently focused element
      const elementText = activeElement.getAttribute('aria-label') || activeElement.innerText || activeElement.value;

      if (elementText) {
        speakText(elementText.trim());
      } else {
        speakText(" ");
      }
    }, 50); // Delay to ensure the next element is focused
  }
});

// Initialize speech recognition when the script is loaded
initializeSpeechRecognition();
