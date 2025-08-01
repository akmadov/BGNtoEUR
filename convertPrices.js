console.log("🧿 MutationObserver: Safe append mode");

const RATE = 1.95583;

function convertPriceText(bgnText) {
  const match = bgnText.match(/([\d,.]+)\s*лв/);
  if (!match) return null;

  const bgn = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (isNaN(bgn)) return null;

  const eur = (bgn / RATE).toFixed(2);
  return `EUR ${eur}`;
}

function appendConvertedPrice(el) {
  if (el.dataset.eurConverted) return;

  const text = el.innerText;
  if (!text.includes("лв")) return;

  const eur = convertPriceText(text);
  if (eur) {
    const span = document.createElement("span");
    span.style.marginLeft = "8px";
    span.style.fontStyle = "italic";
    span.style.fontSize = "90%";
    span.textContent = `(${eur})`;
    el.appendChild(span);

    el.dataset.eurConverted = "true";
  }
}

function convertAllPrices() {
  const elements = document.querySelectorAll("span, p, div, h1, h2, h3");
  elements.forEach(appendConvertedPrice);
}

// Watch DOM
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === 1) {
        appendConvertedPrice(node);
        const descendants = node.querySelectorAll?.("span, p, div, h1, h2, h3") || [];
        descendants.forEach(appendConvertedPrice);
      }
    }
  }
});

window.addEventListener("load", () => {
  console.log("🚀 DOM loaded – observing and appending...");
  convertAllPrices();
  observer.observe(document.body, { childList: true, subtree: true });
});
