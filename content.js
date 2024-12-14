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

<<<<<<< Updated upstream
function toggleScreenMagnification(enabled) {
  if (enabled) {
    enableScreenMagnification();
  } else {
    disableScreenMagnification();
=======
function initializeSpeechRecognition(language = 'en-US') {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = language;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function (event) {
    const speechResult = event.results[0][0].transcript.toLowerCase();
    console.log("You said: ", speechResult);
    processVoiceCommand(speechResult, recognition.lang);
  };

  recognition.onerror = function (event) {
    console.log("Speech Recognition Error: ", event.error);
    // Restart recognition on error to keep listening
    recognition.start();
  };

  recognition.onend = function () {
    // Restart recognition when it ends to keep listening
    recognition.start();
  };

  window.recognition = recognition;
}

function startVoiceRecognition() {
  if (!window.recognition) {
    initializeSpeechRecognition();
>>>>>>> Stashed changes
  }
}

<<<<<<< Updated upstream
function enableHighContrast() {
  const style = document.createElement('style');
  style.id = 'high-contrast-style';
  style.innerHTML = `
    * {
      background-color: #000 !important;
      color: #fff !important;
      outline: 2px solid #fff !important;
      outline-offset: -2px;
=======
function processVoiceCommand(command, language) {
  console.log("Processing command: ", command);

  let searchKeyword = "search for";
  let query = command;
  if (language === 'kn-IN') {
    searchKeyword = "ಹುಡುಕಿ";
    query = command.replace(searchKeyword, "").trim();
  } else if (language === 'hi-IN') {
    searchKeyword = "खोजें";
    query = command.replace(searchKeyword, "").trim();
    // Translating Hindi query to English (simplistic approach)
    query = translateToEnglish(query);
  }

  if (command.startsWith("search for") || command.endsWith(searchKeyword)) {
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
function translateToEnglish(query) {
  // This is a simplistic approach. For better results, consider using an API like Google Translate.
  const hindiToEnglish = {
    'जूते': 'shoes',
    'मोबाइल': 'mobile',
    'लैपटॉप': 'laptop',
    // Add more translations as needed
  };

  const words = query.split(' ');
  const translatedWords = words.map(word => hindiToEnglish[word] || word);
  return translatedWords.join(' ');
}

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
>>>>>>> Stashed changes
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
