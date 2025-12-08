chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToStream",
    title: "Afficher dans le stream",
    contexts: ["image"],
  });
});

const sendToStream = async (url) => {
  const { code } = await chrome.storage.local.get("code");

  if (!code) {
    chrome.windows.create({
      url: chrome.runtime.getURL("dist/popup/index.html"),
      type: "popup",
      width: 400,
      height: 300,
    });
    return;
  }

  fetch("http://localhost:3333/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, code }),
  });
};

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "sendToStream") {
    sendToStream(info.srcUrl);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received message:", request);
  if (request.action === "tweet") {
    sendToStream(request.url);
  }
});
