chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToStream",
    title: "Afficher dans le stream",
    contexts: ["image"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "sendToStream") {
    const { roomId } = await chrome.storage.local.get("roomId");

    if (!roomId) {
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
      body: JSON.stringify({ image: info.srcUrl, roomId }),
    });
  }
});
