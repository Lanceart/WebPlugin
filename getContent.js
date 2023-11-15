console.log("try to download");
chrome.runtime.sendMessage({download: "request", url: document.documentElement.outerHTML});

// document.querySelectorAll('img').forEach(img => {
    
//     chrome.downloads.download({url: img.src});
//   });
  