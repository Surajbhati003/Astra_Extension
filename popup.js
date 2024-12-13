document.addEventListener('DOMContentLoaded', async () => {
  // Step 1: Start the Voice Tutorial
  startVoiceTutorial();

  // Step 2: Handle TTS Toggle
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

  // Step 3: Save User Signature
  document.getElementById("saveSignature").addEventListener("click", () => {
    const signature = document.getElementById("signature").value;

    console.log("Saving signature: ", signature);
    console.log("chrome.storage: ", chrome.storage); 

    if (signature) {
      if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ userSignature: signature }, () => {
          alert("Signature saved successfully!");
        });
      } else {
        console.error("chrome.storage.local is undefined. Ensure permissions are correctly configured in the manifest.");
        alert("Failed to save the signature. Storage is unavailable.");
      }
    } else {
      alert("Please enter your signature.");
    }
  });
});

// Function to start voice tutorial
function startVoiceTutorial() {
  const tutorialSteps = [
    "Welcome to the Voice Assistant and Text-to-Speech Extension.",
    "To activate the voice assistant, press Ctrl+Shift+V.",
    "To start text-to-speech, press Ctrl+Shift+S.",
    "To stop text-to-speech, press Ctrl+Shift+T.",
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

// Function to speak text
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}

// Function to pause TTS
function pauseTTS() {
  // Add your text-to-speech pause logic here
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
  } else {
    console.error('Text-to-speech not supported in this browser.');
  }
}
