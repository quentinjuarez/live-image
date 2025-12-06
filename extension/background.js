chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToStream",
    title: "Afficher dans le stream",
    contexts: ["image"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== "sendToStream") return;

  const imageUrl = info.srcUrl;

  fetch("http://localhost:3333/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageUrl }),
  });
});
