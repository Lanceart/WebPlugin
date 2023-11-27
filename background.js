// import {openDB} from "./script/init_db";

// chrome.scripting.executeScript({
//   // target: {tabId: tabs[0].id},
//   files: ["./script/init_db"]
// });
console.log("I need create DB");
const depens = {};
class dependency {
  constructor(url,time,type) {
      this.url = url;
      this.type = type;
      this.time = time;
      this.size = 0;
      this.child = {};
      this.times = 1;
  }
  set_size(size){
    this.size = size;
  }

  set_child(child){
    this.child = child;
  }

  update_times(){
    this.time += 1;
  }
  greet() {
      console.log(`Hello, my url is ${this.url} and I am type of ${this.type} ms. And spend ${this.time}`);
  }
}

const updateStrategy = (existingurl, time, type) => {
  // depens.get
  ;
};

const skipStrategy = () => {
  // do nothing when repeated
};
const update_size = (urlitem, size) =>{
  console.log("I try to set the size");
  urlitem.set_size(size);
}

const update_child = (urlitem, child) =>{
  console.log("I try to set the child");
  urlitem.set_child(child);
}


class dependencyManager {
  constructor() {
      this.depends = new Map();
  }
  updateOneparam(url, param,strategy){
    if (this.depends.has(url)) {
      // this.depends.get(url).set_size(param);
      const item = this.depends.get(url);
      strategy(item, param);
  } else {
      // 如果实例不存在，则创建一个新实例
      ;
  }
    
  }
  createOrUpdate(url, time, type, strategy) {
      if (this.depends.has(url)) {
          // 应用提供的策略
          // strategy(this.depends.get(url), time);
          const item = this.depends.get(url);
          item.update_times();
          
      } else {
          // 如果实例不存在，则创建一个新实例
          this.depends.set(url, new dependency(url, time, type));
      }
  }


}


const manager = new dependencyManager();



let currentTabId = null;
let requestTimes = {};

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

      console.log("Request made to: " + details.url );
      requestTimes[details.requestId] = Date.now();
    }
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);
chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (currentTabId && details.tabId === currentTabId) {
      const startTime = requestTimes[details.requestId];
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`Request completed from: ${details.url}`);
      console.log(`Request took: ${duration}ms`);

      manager.createOrUpdate(details.url, duration, details.type, updateStrategy);
      
      delete requestTimes[details.requestId];
    }
  },
  {urls: ["<all_urls>"]}
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
    manager.updateOneparam(message.log.url, message.size, update_size);
    manager.updateOneparam(message.log.url, JSON.stringify(message.child), update_child);

    console.log("Fetched", message.log.url, "and the child :", message.child ,"Json", JSON.stringify(message.child));
  }
  if(message.type == 'finished_collection'){
    console.log(manager);
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
  // if (message.type === 'script-added' || message.type === 'script-loaded') {
  //   // !!!important
  //   console.log('Type:', message.type,'Script source:', message.src, 'from page:', message.pageUrl);
  //   // Here, you can keep track of the scripts and their relationships
  //   // You could, for instance, keep a map of pages to scripts
  // }

  // if (message.type === 'script-src-set') {
  //   console.log('Script source set:', message.src);
  //   const stack = message.stack;

  //   // 这里你需要写一些解析堆栈信息的逻辑
  //   // 以下代码只是一个非常简单的例子，实际上你可能需要更复杂的正则表达式
  //   const lines = stack.split('\n');
  //   lines.forEach((line) => {
  //     // 假设我们正在寻找的格式是 "at [function name] ([file url]:[line number]:[column number])"
  //     const match = line.match(/at .+ \((.+):(\d+):(\d+)\)/);
  //     if (match) {
  //       const [, fileUrl, lineNumber, columnNumber] = match;
  //       console.log(`Initiator file: ${fileUrl}, line: ${lineNumber}, column: ${columnNumber}`);
  //     }
  //   });
  // }

});


function downloadAllHttpLinks() {
  let links = Array.from(document.querySelectorAll('a[href^="http://"]')).map(a => a.href);
  console.log("Processing download");
  // 发送链接到背景脚本
  chrome.runtime.sendMessage({action: "downloadLinks", links: links});
}


const delay = 6000; 

// 使用 setTimeout 设置延迟
setTimeout(() => {
    console.log(manager);
}, delay);