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
      console.log(`URL Requested from active tab (${currentTabId}): ${details.url}, Type: ${details.type}, Initiator: ${details.initiator}`);
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
  console.log(message.type);
  if (message.type === 'script-added' || message.type === 'script-loaded') {
    // !!!important
    console.log('Type:', message.type,'Script source:', message.src, 'from page:', message.pageUrl);
    // Here, you can keep track of the scripts and their relationships
    // You could, for instance, keep a map of pages to scripts
  }

  if (message.type === 'script-src-set') {
    console.log('Script source set:', message.src);
    const stack = message.stack;

    // 这里你需要写一些解析堆栈信息的逻辑
    // 以下代码只是一个非常简单的例子，实际上你可能需要更复杂的正则表达式
    const lines = stack.split('\n');
    lines.forEach((line) => {
      // 假设我们正在寻找的格式是 "at [function name] ([file url]:[line number]:[column number])"
      const match = line.match(/at .+ \((.+):(\d+):(\d+)\)/);
      if (match) {
        const [, fileUrl, lineNumber, columnNumber] = match;
        console.log(`Initiator file: ${fileUrl}, line: ${lineNumber}, column: ${columnNumber}`);
      }
    });
  }

});


