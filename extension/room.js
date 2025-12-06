const urlInput = document.getElementById("url");
const copyButton = document.getElementById("copy");
const toggleButton = document.getElementById("toggle");

chrome.storage.local.get("roomId", ({ roomId }) => {
  if (roomId) {
    const url = new URL("http://localhost:5173");
    url.searchParams.set("id", roomId);
    urlInput.value = url.toString();
  }
});

copyButton.addEventListener("click", () => {
  urlInput.select();
  document.execCommand("copy");
});

toggleButton.addEventListener("click", () => {
  if (urlInput.type === "password") {
    urlInput.type = "text";
    toggleButton.textContent = "Hide";
  } else {
    urlInput.type = "password";
    toggleButton.textContent = "Show";
  }
});
