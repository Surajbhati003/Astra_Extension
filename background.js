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
          } else if (command === "fill-signature") {
            chrome.tabs.sendMessage(tab.id, { action: "fillSignature" });
          }
        }
      });
    });
  });
});
