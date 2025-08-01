const RATE = 1.95583;
const convertedTextCache = new WeakSet(); // Track only DOM elements now

function convertPriceText(bgnText) {
  const match = bgnText.match(/([\d,.]+)\s*лв/);
  if (!match) return null;

  const bgn = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (isNaN(bgn)) return null;

  const eur = (bgn / RATE).toFixed(2);
  return `EUR ${eur}`;
}

function appendConvertedPrice(el) {
  if (!el || typeof el.innerText !== "string") return;
  if (convertedTextCache.has(el)) return;

  const originalText = el.innerText.trim();
  if (!originalText.includes("лв")) return;

  const eur = convertPriceText(originalText);
  if (eur) {
    const span = document.createElement("span");
    span.className = "eur-price-addon";
    span.style.marginLeft = "6px";
    span.style.fontStyle = "italic";
    span.style.fontSize = "90%";
    span.textContent = `(${eur})`;

    el.appendChild(span);
    convertedTextCache.add(el);
  }
}

function convertAllPrices() {
  const priceSelectors = ["span", "p", "div", "h1", "h2", "h3"];
  priceSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(appendConvertedPrice);
  });
}

// 👀 Observe changes and react
const observer = new MutationObserver(() => {
  convertAllPrices();
});

window.addEventListener("load", () => {
  console.log("🧪 Observer active: watching for price updates...");
  convertAllPrices(); // Run initially
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
});
