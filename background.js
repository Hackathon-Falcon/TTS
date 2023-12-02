var selectedText = "";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "setSelectedText") {
    selectedText = request.text;
  }
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "readAloud",
    title: "読み上げするのだ",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "readAloud") {
    //selectedTextに選択したテキストが入ってない
    //コピーさせてテキストデータを取得する方法
    var successMessage = "成功しました! : " + selectedText;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showPopup,
      args: [successMessage]
    });
  }
});

function showPopup(message) {
  alert(message);
}

//選択した時点でアイコンだしたい。