console.log("Service worker is running");

chrome.contextMenus.create({
  id: "image_menu",
  title: "Envoyer l'image",
  contexts: ["image"],
});

chrome.contextMenus.onClicked.addListener((info, _tab) => {
  const { menuItemId, srcUrl } = info;

  if (menuItemId === "image_menu") {
    chrome.storage.local.set({ imgUrl: srcUrl });
  }
});

export {};
