document.addEventListener('DOMContentLoaded', startVoiceTutorial);

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

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}
