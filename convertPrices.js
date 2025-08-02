const RATE = 1.95583;

function convertBGNtoEUR(bgnText) {
  const match = bgnText.match(/([\d\s,.]+)\s*лв/i);
  if (!match) return null;

  let bgn = match[1].replace(/\s/g, "").replace(",", ".");
  let bgnFloat = parseFloat(bgn);
  if (isNaN(bgnFloat)) return null;

  const eur = (bgnFloat / RATE).toFixed(2);
  return `(${eur} EUR)`;
}

function convertWixPrices() {
  const priceElements = document.querySelectorAll('[data-hook="product-item-price-to-pay"]');

  priceElements.forEach((el) => {
    // Avoid duplicates
    if (el.querySelector(".custom-eur-price")) return;

    const text = el.innerText;
    if (!text.includes("лв")) return;

    const eurText = convertBGNtoEUR(text);
    if (!eurText) return;

    // Create the EUR span
    const span = document.createElement("span");
    span.textContent = eurText;
    span.className = "custom-eur-price";
    span.style.cssText = `
      flex: 0 0 100%;
      display: block;
      line-height: 0.85em;
      font-size: 0.85em;
      color: #2E2E2E;
      text-align: center;
      white-space: nowrap;
      -webkit-text-stroke: 0.5px rgba(36, 36, 36, 0.35);
      paint-order: stroke fill;
    `;

    el.appendChild(span);
  });
}

// Run initially after DOM load
window.addEventListener("load", () => {
  console.log("💶 Running EUR converter...");
  setTimeout(convertWixPrices, 1000);
});

// Monitor for DOM changes (e.g., filters, pagination)
const observer = new MutationObserver(() => convertWixPrices());
observer.observe(document.body, { childList: true, subtree: true });
