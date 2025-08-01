console.log("🧿 MutationObserver version of Price Converter loaded");

const RATE = 1.95583;

function convertPriceText(bgnText) {
  const match = bgnText.match(/([\d,.]+)\s*лв/);
  if (!match) return null;

  const bgn = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (isNaN(bgn)) return null;

  const eur = (bgn / RATE).toFixed(2);
  return `EUR ${eur}`;
}

function convertPricesInNode(node) {
  if (!node || !node.innerText) return;

  const text = node.innerText;
  if (node.dataset && node.dataset.eurConverted) return;

  if (text.includes("лв")) {
    const eur = convertPriceText(text);
    if (eur) {
      node.innerText = `${text} (${eur})`;
      node.dataset.eurConverted = "true";
    }
  }
}

function convertAllPrices() {
  const elements = document.querySelectorAll("span, p, div, h1, h2, h3");
  elements.forEach(convertPricesInNode);
}

// Observe DOM changes and react dynamically
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === 1) {
        convertPricesInNode(node);
        const descendants = node.querySelectorAll?.("span, p, div, h1, h2, h3") || [];
        descendants.forEach(convertPricesInNode);
      }
    }
  }
});

window.addEventListener("load", () => {
  console.log("🚀 Page loaded, starting DOM observation");
  convertAllPrices();

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
