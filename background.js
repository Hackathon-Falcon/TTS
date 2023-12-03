//クエリを作るapiを叩く関数
const createQuery = async (inputText) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:50021/audio_query?text=${inputText}&speaker=1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).catch((error) => {
      console.error("Error creating voice:", error);
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("response1", data);
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

//wavを作るapiを叩く関数
const createVoice = async (queryJson) => {
  try {
    const response = await fetch("http://127.0.0.1:50021/synthesis?speaker=1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryJson),
    }).catch((error) => {
      console.error("Error creating voice:", error);
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.blob();
    console.log("response2", data);
    return data;
  } catch (error) {
    console.error("Error creating voice:", error);
  }
};

//wavを取得する関数
const getBlob = async (inputText) => {
  try {
    const queryJson = await createQuery(inputText);
    const tmpBlob = await createVoice(queryJson);
    var reader = new FileReader();
    reader.onload = function () {
      const data = reader.result;
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          message: data,
        });
      });
    };
    reader.readAsDataURL(tmpBlob);
  } catch (error) {
    console.error("Error getting wave:", error);
  }
};

//コンテキストメニューを作成
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "readAloud",
    title: "読み上げするのだ",
    contexts: ["selection"],
  });
});

//使ってない
const doClick = (info, tabId, tabs) => {
  // コンテンツスクリプトを実行
  // chrome.tabs.executeScript(tabId, { file: "content.js" });

  // // 必要に応じて、追加のメッセージを content.js に送信
  // chrome.tabs.sendMessage(tabId, {
  //   action: "doSomething",
  //   data: info.selectionText,
  // });

  // const audio = document.createElement("audio");

  // let selectedText = info.selectedText;

  // var reader = new FileReader();
  // console.log("wav", tmpBlob);
  // reader.onload = function () {
  //   const url = reader.result;
  //   console.log("url", url);

  //   // 音声ファイルを登録
  //   const source = audio.appendChild(document.createElement("source"));
  //   source.setAttribute("src", url);
  //   audio.appendChild(source);
  //   document.body.appendChild(audio);
  // };

  // データの読み込みを開始
  reader.readAsDataURL(tmpBlob);
  // });
};

//コンテキストメニューをクリックした時の処理
let selectedText = "";
chrome.contextMenus.onClicked.addListener(function (info, tab, tabId) {
  if (info.menuItemId === "readAloud") {
    //selectedTextに選択したテキストが入ってない
    //コピーさせてテキストデータを取得する方法
    selectedText = info.selectionText;
    var successMessage = "成功しました! : " + selectedText;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showPopup,
      args: [successMessage],
    });

    console.log("selectedText", selectedText);
    getBlob(selectedText);
  }
});

function showPopup(message) {
  alert(message);
}

//選択した時点でアイコンだしたい。
