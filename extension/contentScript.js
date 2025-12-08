console.log("[LIVE-IMAGE] contentScript loaded");

(function () {
  const BTN_CLASS = "my-injected-btn";

  function createButton(article) {
    const btn = document.createElement("button");
    btn.textContent = "+";
    btn.className = BTN_CLASS;

    btn.style.padding = "0";
    btn.style.width = "35px";
    btn.style.height = "35px";
    btn.style.borderRadius = "100%";
    btn.style.background = "transparent";
    btn.style.color = "rgb(113, 118, 123)";
    btn.style.cursor = "pointer";
    btn.style.border = "none";
    btn.style.fontSize = "16px";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.transition = "all 0.2s ease-in-out";
    // hover style
    btn.onmouseover = () => {
      btn.style.background = "rgba(29, 155, 240, 0.1)";
      btn.style.color = "rgb(29, 155, 240)";
    };

    btn.onmouseout = () => {
      btn.style.background = "transparent";
      btn.style.color = "rgb(113, 118, 123)";
    };

    btn.onclick = (e) => {
      e.stopPropagation();
      const linkEl = article.querySelector('a[href*="/status/"]');
      const tweetUrl = linkEl
        ? "https://x.com" + linkEl.getAttribute("href")
        : null;
      chrome.runtime.sendMessage({
        action: "tweet",
        url: tweetUrl,
      });
    };

    return btn;
  }

  function injectButton(article) {
    if (article.querySelector("." + BTN_CLASS)) return;

    // X.com stable action bar container
    // located inside the article footer → 3rd child wrap
    const actionBar = article.querySelector('[role="group"]');
    if (!actionBar) return;
    console.log(actionBar);

    actionBar.appendChild(createButton(article));
  }

  const observer = new MutationObserver(() => {
    document
      .querySelectorAll('article[data-testid="tweet"]')
      .forEach(injectButton);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  document
    .querySelectorAll('article[data-testid="tweet"]')
    .forEach(injectButton);
})();
