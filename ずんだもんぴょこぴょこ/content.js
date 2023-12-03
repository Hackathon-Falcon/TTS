// 3つの画像のURL
let imageUrl1 = chrome.runtime.getURL("images/image1.png");
let imageUrl2 = chrome.runtime.getURL("images/image2.png");
let imageUrl3 = chrome.runtime.getURL("images/image3.png");

// 画像要素の作成
let imageElement = document.createElement("img");
imageElement.style.width = "100px"; // 画像の幅を調整
imageElement.style.height = "100px"; // 画像の高さを調整
imageElement.style.position = "fixed";
imageElement.style.bottom = "0";
imageElement.style.right = "0";
document.body.appendChild(imageElement);

// 画像を切り替える関数
function switchImages() {
    // 現在の画像を取得
    let currentImage = imageElement.src;

    // 画像を切り替え
    if (currentImage === imageUrl1) {
        imageElement.src = imageUrl2;
    } else if (currentImage === imageUrl2) {
        imageElement.src = imageUrl3;
    } else {
        imageElement.src = imageUrl1;
    }
}

// 一定の間隔で画像を切り替える（ここでは5000ミリ秒＝5秒）

setInterval(switchImages, 400)
// 初期状態で最初の画像を表示
imageElement.src = imageUrl1;