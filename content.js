// content.js
// Send a message when a script is added to the DOM
document.addEventListener('DOMContentLoaded', function () {
    console.log("oh shit");
    // Listen to the script elements that are being added dynamically
    new MutationObserver((mutations, obs) => {
      for (let mutation of mutations) {
        for (let node of mutation.addedNodes) {
          if (node.tagName?.toLowerCase() === 'script') {
            chrome.runtime.sendMessage({
              type: 'script-added',
              src: node.src,
              pageUrl: location.href
            });
          }
        }
      }
    }).observe(document, { subtree: true, childList: true });
  });
  
  // Listen to existing scripts
  const existingScripts = document.querySelectorAll('script');
  existingScripts.forEach(script => {
    if (script.src) {
      chrome.runtime.sendMessage({
        type: 'script-loaded',
        src: script.src,
        pageUrl: location.href
      });
    }
  });
  