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
      
      console.log(`URL Requested from active tab (${currentTabId}): ${details.url}, Type: ${details.type}, Initiator: ${details.initiator}. full ${JSON.stringify(details)}`);
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
  if(message.type == 'FETCHING_LINKS'){
    console.log("Fetched", message.log, "and the size :", message.size);
  }
  if(message.type == 'COLLECT_LINKS'){
    chrome.storage.local.set({ 'collections': message.links }, () => {
      console.log('Links stored in chrome.storage.local');
    });
    console.log(message.links);
  }
  if(message.download === "request") {
    console.log(message.url);
    var blob = new Blob([message.url], {type: 'text/plain'});
    // chrome.storage.local.set({name: 'hahaha'});
    var reader = new FileReader();
        reader.onload = function() {
            var url = reader.result;

            // 使用chrome.downloads.download下载文本
            chrome.downloads.download({
                url: url
              });
        };
        reader.readAsDataURL(blob);
    // chrome.downloads.download({url: message.url});
  }
  // console.log(message.type);
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


function downloadAllHttpLinks() {
  let links = Array.from(document.querySelectorAll('a[href^="http://"]')).map(a => a.href);
  console.log("Processing download");
  // 发送链接到背景脚本
  chrome.runtime.sendMessage({action: "downloadLinks", links: links});
}

