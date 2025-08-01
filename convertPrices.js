console.log("🧿 Safe EUR converter loaded");

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
  // Skip if already appended
  if (el.querySelector('.eur-price-addon')) return;

  const text = el.innerText;
  if (!text.includes("лв")) return;

  const eur = convertPriceText(text);
  if (eur) {
    const span = document.createElement("span");
    span.className = "eur-price-addon";
    span.style.marginLeft = "6px";
    span.style.fontStyle = "italic";
    span.style.fontSize = "90%";
    span.textContent = `(${eur})`;
    el.appendChild(span);
  }
}

function convertAllPrices() {
  const elements = document.querySelectorAll("span, p, div, h1, h2, h3");
  elements.forEach(el => {
    if (el.innerText.includes("лв")) {
      appendConvertedPrice(el);
    }
  });
}

// Run on initial load
window.addEventListener("load", () => {
  console.log("🚀 EUR converter running...");
  convertAllPrices();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.innerText?.includes("лв")) {
            appendConvertedPrice(node);
          }
          const nested = node.querySelectorAll?.("span, p, div, h1, h2, h3") || [];
          nested.forEach(el => {
            if (el.innerText.includes("лв")) appendConvertedPrice(el);
          });
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
