$(document).addEventListener("mouseup", function () {
  var selectedText = window.getSelection().toString().trim();
  chrome.runtime.sendMessage({ type: "setSelectedText", text: selectedText });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Data from API:", message.data);
  return true;
});
