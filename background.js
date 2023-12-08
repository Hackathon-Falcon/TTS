// VALUE
const ZUNDAMON_VOICE = 1;
// const BASE_URL = "http://127.0.0.1:50021";
const BASE_URL = `https://zundamon.ngrok.io`;

//クエリを作るapiを叩く関数
const createQuery = async (inputTexts, selectedCharacter) => {
  try {
    const API_URL = "audio_query";

    const TXT_RIMIT = 150;
    let text = "";
    let inputTexts = [];
  
    let len = inputText.length;
    if (len > TXT_RIMIT) {
      for (let i = 0; i <= len; i++) {
  
        text += inputText[i];
        if (i % TXT_RIMIT == 0) {
          inputTexts.push(text);
          text = "";
        }
      }

    } else {
      inputTexts.push(inputText);
    }

    for(let i=0; i<inputTexts.length; i++){
      const response = await fetch(
        `${BASE_URL}/${API_URL}?text=${inputTexts[i]}&speaker=${selectedCharacter}`,
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
  
      let data= [];
      data.push(await response.json()); 
      console.log("response1", data);
    }

    return data;
  } catch (error) {
    console.error("error", error);
  }
};

//wavを作るapiを叩く関数
const createVoice = async (queryJson, selectedCharacter) => {
  try {
    const API_URL = "synthesis";

    const response = await fetch(
      `${BASE_URL}/${API_URL}?speaker=${selectedCharacter}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(queryJson),
      }
    ).catch((error) => {
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
const getBlob = async (inputText, selectedCharacter) => {
  try {
    const queryJsons = await createQuery(inputText, selectedCharacter);

    let tmpBlobs= [];
    for(let i=0; i< queryJsons.length; i++){
      tmpBlobs.push(await createVoice(queryJsons[i], selectedCharacter));
    }

    var reader = new FileReader();
    reader.onload = function () {
      const data = reader.result;
      console.log("data", data);
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          message: data,
        });
      });
    };

    for(let i=0; i< queryJsons.length; i++){
      reader.readAsDataURL(tmpBlobs[i]);
    }
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

let selectedCharacter = ZUNDAMON_VOICE;
chrome.runtime.onMessage.addListener(function (message) {
  if (message.type == "changeCharacter") {
    console.log("呼ばれた");
    console.log("message.value typeof", typeof message.value);
    console.log("message.value", message.value);
    selectedCharacter = message.value;
  }
});

//コンテキストメニューをクリックした時の処理
let selectedText = "";
chrome.contextMenus.onClicked.addListener(function (info, tab, tabId) {
  if (info.menuItemId === "readAloud") {
    console.log("info", info);

    selectedText = info.selectionText;
    console.log("selectedText", selectedText);
    getBlob(selectedText, selectedCharacter);
    return true;
  }
});

function showPopup(message) {
  alert(message);
}
