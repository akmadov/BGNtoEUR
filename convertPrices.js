const RATE = 1.95583;

function convertPriceText(bgnText) {
  const numeric = bgnText.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
  const bgn = parseFloat(numeric);
  if (isNaN(bgn)) return null;
  return (bgn / RATE).toFixed(2);
}

function appendEurPrice(el, eur) {
  // Check if already appended
  if (el.querySelector(".eur-price")) return;

  const eurSpan = document.createElement("span");
  eurSpan.className = "eur-price";
  eurSpan.textContent = ` (${eur} EUR)`;
  eurSpan.style.cssText = `
    display: block;
    text-align: center;
    color: #2E2E2E;
    margin-top: 2px;
    font-size: inherit;
  `;
  el.appendChild(eurSpan);
}

function convertPriceInElement(el) {
  if (!el || el.dataset.eurConverted === "true") return;

  const text = el.innerText;
  if (!text.includes("лв")) return;

  const eur = convertPriceText(text);
  if (!eur) return;

  appendEurPrice(el, eur);
  el.dataset.eurConverted = "true";
}

function convertAllDesignatedPrices() {
  const selectors = [
    // ✅ CATEGORY PAGE
    '[data-hook="product-item-price-to-pay"]',

    // ✅ PRODUCT PAGE
    '[data-testid="richTextElement"]',

    // ✅ MAIN CART
    '[data-hook="SubTotals.subtotalText"]',
    '[data-hook="Total.formattedValue"]',

    // ✅ SIDE CART
    '[data-hook="CartItemDataHook.price"]',
    '[data-hook="CartItemDataHook.totalPrice"] div',
    '[data-hook="Footer.subtotalValue"]',

    // ✅ CHECKOUT SUMMARY + LINE ITEMS
    '[data-hook="FoldableSummarySectionDataHook.total"]',
    '[data-hook="LineItemDataHooks.Price"]',
    '[data-hook="total-row-value"] span'
  ];

  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(convertPriceInElement);
  });
}

// 🔁 Auto-run conversion every 2 seconds after load
window.addEventListener("load", () => {
  console.log("🔁 Starting auto price conversion…");

  setTimeout(() => {
    convertAllDesignatedPrices();
    setInterval(convertAllDesignatedPrices, 2000);
  }, 3000);
});
