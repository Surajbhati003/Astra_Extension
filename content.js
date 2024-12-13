console.log("Content script loaded.");

window.isVoiceAssistantActive = false; // Track assistant status

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toggle-voice-assistant") {
    toggleVoiceAssistant();
  }
});

function toggleVoiceAssistant() {
  if (window.isVoiceAssistantActive) {
    window.recognition.stop();
    speakText("Voice assistant deactivated.");
    window.isVoiceAssistantActive = false;
  } else {
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
    const speechResult = event.results[0][0].transcript.trim().toLowerCase();
    processVoiceCommand(speechResult);
  };

  recognition.onerror = function (event) {
    console.log("Speech Recognition Error: ", event.error);
    if (window.isVoiceAssistantActive) {
      recognition.start();
    }
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
    const query = command.replace(/^search for\s*/, "");
    const searchInputSelectors = [
      'input[type="search"]',
      'input[name*="search"]',
      'input[placeholder*="Search"]',
      'input[type="text"]',
      '[role="search"] input'
    ];

    let searchInput = null;

    searchInputSelectors.some((selector) => {
      searchInput = document.querySelector(selector);
      return searchInput;
    });

    if (searchInput) {
      searchInput.value = query;
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      searchInput.dispatchEvent(new Event("change", { bubbles: true }));

      speakText(`Searching for ${query}`);
      window.isVoiceAssistantActive = false;
      window.recognition.stop();
    } else {
      speakText("No search field found on the page.");
    }
  } else {
    speakText("Command not recognized.");
  }
}

function speakText(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

initializeSpeechRecognition();
