console.log("[LIVE-IMAGE] contentScript loaded");

// Right click position
let lastClickedElement = null;

document.addEventListener(
  "contextmenu",
  (e) => {
    lastClickedElement = e.target;
  },
  true
);

function findClosestImage(element) {
  if (!element) return null;

  let currentElement = element;
  const maxDepth = 10;
  let depth = 0;

  while (currentElement && depth < maxDepth) {
    // img
    if (currentElement.tagName === "IMG" && currentElement.src) {
      return {
        type: "img",
        url: currentElement.src,
        element: currentElement,
      };
    }

    // background-image
    const computedStyle = window.getComputedStyle(currentElement);
    const bgImage = computedStyle.backgroundImage;

    if (bgImage && bgImage !== "none") {
      const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
      if (urlMatch && urlMatch[1]) {
        return {
          type: "background",
          url: urlMatch[1],
          element: currentElement,
        };
      }
    }

    // child img
    const imgChild = currentElement.querySelector("img[src]");
    if (imgChild && imgChild.src) {
      return {
        type: "img",
        url: imgChild.src,
        element: imgChild,
      };
    }

    // child with background-image
    const childWithBg = Array.from(currentElement.children).find((child) => {
      const style = window.getComputedStyle(child);
      return style.backgroundImage && style.backgroundImage !== "none";
    });

    if (childWithBg) {
      const style = window.getComputedStyle(childWithBg);
      const urlMatch = style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
      if (urlMatch && urlMatch[1]) {
        return {
          type: "background",
          url: urlMatch[1],
          element: childWithBg,
        };
      }
    }

    currentElement = currentElement.parentElement;
    depth++;
  }

  return null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "findClosestImage") {
    const result = findClosestImage(lastClickedElement);

    if (result) {
      console.log(`[LIVE-IMAGE] Image trouvée (${result.type}):`, result.url);

      chrome.runtime.sendMessage({
        action: "send",
        url: result.url,
        pageUrl: window.location.href,
      });
    } else {
      console.log("[LIVE-IMAGE] Aucune image trouvée");
      alert("Aucune image ou background trouvé à proximité de cet élément.");
    }
  }
});

(function () {
  const BTN_CLASS = "live-image-btn";

  function createButton(article) {
    const btn = document.createElement("button");

    const svgCode = `
<svg viewBox="0 0 311 326" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M22 0L0 56V284H78V326H122L163 284H226L311 199V0H22ZM282 185L234 233H156L114 275V233H49V29H282V185Z" fill="currentColor"/>
<path d="M49.5 234L116 100L171.5 184.5L225.5 117L284 184.5" stroke="currentColor" stroke-width="20"/>
</svg>`;
    btn.className = BTN_CLASS;

    btn.title = "View Live Image";
    btn.innerHTML = svgCode;

    btn.style.padding = "0";
    btn.style.width = "35px";
    btn.style.height = "35px";
    btn.style.borderRadius = "100%";
    btn.style.background = "transparent";
    btn.style.color = "rgb(113, 118, 123)";
    btn.style.cursor = "pointer";
    btn.style.border = "none";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.transition = "all 0.2s ease-in-out";

    // Style the SVG
    const svg = btn.querySelector("svg");
    if (svg) {
      svg.style.width = "20px";
      svg.style.height = "20px";
      svg.style.transition = "all 0.2s ease-in-out";
    }

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
        action: "send",
        url: tweetUrl,
        pageUrl: window.location.href,
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
