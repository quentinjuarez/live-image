chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "showRoom",
    title: "Afficher l'URL de la room",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "sendToStream",
    title: "Afficher dans le stream",
    contexts: ["image"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "showRoom") {
    let { roomId } = await chrome.storage.local.get("roomId");
    if (!roomId) {
      roomId = crypto.randomUUID();
      await chrome.storage.local.set({ roomId });
    }
    chrome.tabs.create({ url: "room.html" });
  } else if (info.menuItemId === "sendToStream") {
    const imageUrl = info.srcUrl;
    const { roomId } = await chrome.storage.local.get("roomId");

    if (!roomId) {
      // Create a notification to inform the user to create a room first
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Stream Image Viewer",
        message: "Please create a room first by right-clicking on the extension icon and selecting 'Afficher l'URL de la room'",
      });
      return;
    }

    fetch("http://localhost:3333/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageUrl, roomId }),
    });
  }
});
