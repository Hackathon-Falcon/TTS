// VALUE
const ZUNDAMON_VOICE= 1;
// const BASE_URL = 'http://127.0.0.1:50021';
const BASE_URL= `https://1c37-218-38-158-181.ngrok-free.app`;

// For options
// let selectedVolume = localStorage.getItem('selectedVolume');

let selectedCharacter = () =>{
  let result;
  
  // try{
  //   result= localStorage.getItem('selectedCharacter');
  // }catch{
  //   throw new Error('Value not found in localStorage');
  // }finally{
  //   result = ZUNDAMON_VOICE
  // }
  
  result= ZUNDAMON_VOICE;
  
  return result;
}



//クエリを作るapiを叩く関数
const createQuery = async (inputText) => {
  try {
    const API_URL = 'audio_query';

    const response = await fetch(
      `${BASE_URL}/${API_URL}?text=${inputText}&speaker=${selectedCharacter()}`,
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
    console.error("error", error);
  }
};

//wavを作るapiを叩く関数
const createVoice = async (queryJson) => {
  try {
    const API_URL = 'synthesis';

    const response = await fetch(
      `${BASE_URL}/${API_URL}?speaker=${selectedCharacter()}`, 
      {
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
      console.log("data", data);
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

//コンテキストメニューをクリックした時の処理
let selectedText = "";
chrome.contextMenus.onClicked.addListener(function (info, tab, tabId) {
  if (info.menuItemId === "readAloud") {
    selectedText = info.selectionText;
    console.log("selectedText", selectedText);
    getBlob(selectedText);
  }
});

function showPopup(message) {
  alert(message);
}