console.log("hello world from background");

chrome.contextMenus.create({
  id: "image_menu",
  title: "Afficher l'image dans une nouvelle fenêtre",
  contexts: ["image"],
});

chrome.contextMenus.onClicked.addListener((info, _tab) => {
  const { menuItemId, srcUrl } = info;

  if (menuItemId === "image_menu") {
    chrome.storage.local.set({ imgUrl: srcUrl });
  }
});

export {};
