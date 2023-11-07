// chrome.webRequest.onBeforeRequest.addListener(
//   function(details) {
//     console.log('URL Requested:', details.url);
//     // Send message to popup if it's open
//     chrome.runtime.sendMessage({type: 'urlRequest', url: details.url});
//   },
//   { urls: ["<all_urls>"] } // This filters for all URLs. Adjust if needed.
// );


let currentTabId = null;

// Listen for tab activation changes to update the currentTabId
chrome.tabs.onActivated.addListener(activeInfo => {
  currentTabId = activeInfo.tabId;
});

// Use the webRequest API to log requests from the current active tab
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (currentTabId && details.tabId === currentTabId) {
      // console.log(details);
      // !!! important
      // console.log(`URL Requested from active tab (${currentTabId}): ${details.url}, Type: ${details.type}, Initiator: ${details.initiator}`);
      // If you want to communicate with the popup, you can send a message:
      // chrome.runtime.sendMessage({tabId: currentTabId, url: details.url});
    }
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);

// Make sure to update the currentTabId when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    currentTabId = tabId;
  }
});

// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'script-added' || message.type === 'script-loaded') {
    console.log('Script source:', message.src, 'from page:', message.pageUrl);
    // Here, you can keep track of the scripts and their relationships
    // You could, for instance, keep a map of pages to scripts
  }
});


