console.log("Content script loaded.");

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle-voice-assistant") {
    toggleVoiceAssistant();
  } else if (request.action === "start-tts") {
    startTextToSpeech();
  } else if (request.action === "stop-tts") {
    stopTextToSpeech();
  }
  if (request.action === "fillSignature") {
    chrome.storage.local.get("userSignature", (result) => {
      if (result.userSignature) {
        const signatureField = document.querySelector('input[name="signature"], textarea[name="signature"]');
        
        if (signatureField) {
          const img = document.createElement("img");
          img.src = chrome.runtime.getURL("signatures/download.jpg");
          
          signatureField.value = result.userSignature;
          alert("Signature field filled successfully!");
        } else {
          alert("Signature field not found on this page.");
        }
      } else {
        alert("No signature saved. Please save your signature in the extension settings.");
      }
    });
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
    speakText("Voice assistant activated. Please speak your query.");
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
    recognition.start();
  };

  recognition.onend = function () {
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
      return searchInput;
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
      window.recognition.start();
    }
  } else {
    speakText("Command not recognized.");
    window.recognition.start();
  }
}

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; // Default language is English
  window.speechSynthesis.speak(utterance);
}

/* Text-to-Speech Functionality */

let ttsUtterance;

function startTextToSpeech() {
  // Stop any ongoing speech synthesis
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  const text = document.body.innerText;
  ttsUtterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(ttsUtterance);
}

function stopTextToSpeech() {
  if (ttsUtterance) {
    window.speechSynthesis.cancel();
  }
}

// Event listeners for the 'Tab' and arrow keys
document.addEventListener('keydown', (event) => {
  if (event.key === 'Tab' || event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
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

// Initialize speech recognition when the script is loaded
initializeSpeechRecognition();
