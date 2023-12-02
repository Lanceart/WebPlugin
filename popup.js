
// const button = document.querySelector('button');
// button.addEventListener('click', async () => {
//   console.log("oh click");
// });


// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if (request.type === 'urlRequest') {
//       const para = document.createElement("p");
//       para.textContent = request.url;
//       document.body.appendChild(para);
//     }
//   }
// );
var clicked = false;
document.getElementById('recording').addEventListener('click', () => {
  
  
  chrome.runtime.sendMessage({
    type: 'change_button_state'
  });

  

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      files: ['getContent.js']
    });
  });
});

document.getElementById('saveconsole').addEventListener('click', () => {
  console.log("run the download");
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      files: ['./script/saveconsole.js']
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var button = document.getElementById('myButton');
  if (button) {
      button.addEventListener('click', function() {
          chrome.tabs.create({'url': chrome.runtime.getURL('extension-page.html')});
      });
  }
});





