let isLogging = false; // Flag to toggle logging

// Function to handle each request
const logUrl = details => {
  console.log("URL:", details.url);
};

// Toggle the logging of HTTP request URLs
function toggleLogging() {
  if (isLogging) {
    // Stop logging requests
    chrome.webRequest.onBeforeRequest.removeListener(logUrl);
    isLogging = false;
  } else {
    // Start logging requests
    chrome.webRequest.onBeforeRequest.addListener(
      logUrl,
      { urls: ["<all_urls>"] },
      ["requestBody"]
    );
    isLogging = true;
  }
}

// Listen for a message from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggleLogging") {
    toggleLogging();
    // Send response back to the popup if needed
    sendResponse({logging: isLogging});
  }
});

// Optional: Update the icon to reflect whether logging is active
function updateIcon() {
  const path = isLogging ? "icon-on.png" : "icon-off.png";
  chrome.browserAction.setIcon({ path: path });
}
