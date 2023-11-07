// content.js
// Send a message when a script is added to the DOM
document.addEventListener('DOMContentLoaded', function () {

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
  

//   // content.js
// (function() {
//     const originalCreateElement = document.createElement;
  
//     document.createElement = function(tagName) {
//       const element = originalCreateElement.call(document, tagName);
//       if (tagName.toLowerCase() === 'script') {
//         const originalSetAttribute = element.setAttribute;
//         element.setAttribute = function(name, value) {
//           if (name.toLowerCase() === 'src') {
//             // 捕获堆栈跟踪
//             const stack = new Error().stack;
//             console.log(stack);
//             // 将堆栈跟踪发送到背景脚本
//             chrome.runtime.sendMessage({
//               type: 'script-src-set',
//               src: value,
//               stack: stack
//             });
//           }
//           return originalSetAttribute.apply(this, arguments);
//         };
//       }
//       return element;
//     };
//   })();
  