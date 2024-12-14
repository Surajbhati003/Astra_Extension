chrome.commands.onCommand.addListener(function (command) {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(tab => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      }, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          if (command === "toggle-voice-assistant") {
            chrome.tabs.sendMessage(tab.id, { action: "toggle-voice-assistant" });
          } else if (command === "start-tts") {
            chrome.tabs.sendMessage(tab.id, { action: "start-tts" });
          } else if (command === "stop-tts") {
            chrome.tabs.sendMessage(tab.id, { action: "stop-tts" });
          }
        }
      });
    });
  });
});


chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle-high-contrast') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle-high-contrast' });
      });
    } else if (command === 'toggle-screen-magnification') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle-screen-magnification' });
      });
    }
  });
  