// console.log("Background script loaded.");

// // Function to handle keyboard shortcut and activate the voice assistant
// chrome.commands.onCommand.addListener(function (command) {

//   if (command === "toggle-voice-assistant") {
//     // Get the active tab and inject script
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       if (tabs.length > 0) {
//         const tabId = tabs[0].id;
//         // Send a message to the content script to toggle the voice assistant
//         chrome.tabs.sendMessage(tabId, { action: "toggle-voice-assistant" });
//       } else {
//         console.error("No active tab found");
//       }
//     });
//   }
// });
//     if (command === "toggle-voice-assistant") {
//       // Get the active tab and inject script
//       chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         if (tabs.length > 0) {
//           const tabId = tabs[0].id;
//           // Send a message to the content script to toggle the voice assistant
//           chrome.tabs.sendMessage(tabId, { action: "toggle-voice-assistant" });
//         } else {
//           console.error("No active tab found");
//         }
//       });
//     }
//   });

