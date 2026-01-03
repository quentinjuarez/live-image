const DEV_MODE = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToStream",
    title: "Afficher dans le stream",
    contexts: ["image"],
  });

  if (DEV_MODE) {
    chrome.contextMenus.create({
      id: "sendToStream-beta",
      title: "Afficher dans le stream (beta)",
      contexts: ["all"],
    });
  }
});

const sendToStream = async (url, pageUrl) => {
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

  const { settings } = await chrome.storage.local.get("settings");

  fetch("http://localhost:3333/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      code,
      settings: settings || {
        displayDuration: 5,
        width: 80,
      },
      meta: { pageUrl },
    }),
  });
};

chrome.contextMenus.onClicked.addListener(async (info, tab, test) => {
  if (info.menuItemId === "sendToStream") {
    sendToStream(info.srcUrl, info.pageUrl);
  } else if (info.menuItemId === "sendToStream-beta") {
    chrome.tabs.sendMessage(tab.id, {
      action: "findClosestImage",
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received message:", request);
  if (request.action === "send" || request.action === "stop") {
    sendToStream(request.url, request.pageUrl);
  }
});
