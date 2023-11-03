
// const button = document.querySelector('button');
// button.addEventListener('click', async () => {
//   console.log("oh click");
// });


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'urlRequest') {
      const para = document.createElement("p");
      para.textContent = request.url;
      document.body.appendChild(para);
    }
  }
);
