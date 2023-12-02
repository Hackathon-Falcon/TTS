var selectedText = "";

document.addEventListener("mouseup", function () {
  var selectedText = window.getSelection().toString().trim();
  chrome.runtime.sendMessage({ type: "setSelectedText", text: selectedText });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "getSelectedText") {
    sendResponse({ text: selectedText });
  }
});

