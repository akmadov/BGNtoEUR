const RATE = 1.95583;

function convertPriceText(bgnText) {
  const cleaned = bgnText
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");
  const bgn = parseFloat(cleaned);
  if (isNaN(bgn)) return null;
  return (bgn / RATE).toFixed(2);
}

function appendEUR(el, eur) {
  const eurSpan = document.createElement("span");
  eurSpan.className = "eur-price";
  eurSpan.textContent = ` (${eur} €)`;
  eurSpan.style.cssText = `
    font-size: 1.0em;
    color: #2E2E2E;
    margin-left: 6px;
    white-space: nowrap;
  `;
  el.appendChild(eurSpan);
}

// Category (product listings)
function convertCategoryPrices() {
  const productPriceElements = document.querySelectorAll('[data-hook="product-item-price-to-pay"]');
  productPriceElements.forEach((el) => {
    if (el.querySelector(".eur-price")) return;
    const eur = convertPriceText(el.textContent);
    if (eur) appendEUR(el, eur);
  });
}

// Individual product page
function convertProductPagePrice() {
  const richTextDivs = document.querySelectorAll('div[data-testid="richTextElement"]');
  richTextDivs.forEach((div) => {
    const p = div.querySelector("p");
    if (!p || !p.innerText.includes("лв") || p.querySelector(".eur-price")) return;
    const eur = convertPriceText(p.innerText);
    if (eur) appendEUR(p, eur);
  });
}

// Cart page totals
function convertCartTotals() {
  const cartSelectors = [
    '[data-hook="SubTotals.subtotalText"]',
    '[data-hook="Total.formattedValue"]'
  ];
  cartSelectors.forEach((selector) => {
    const el = document.querySelector(selector);
    if (el && !el.querySelector(".eur-price")) {
      const eur = convertPriceText(el.innerText);
      if (eur) appendEUR(el, eur);
    }
  });
}

// Side cart
function convertSideCartPrices() {
  const selectors = [
    '[data-hook="CartItemDataHook.price"]',
    '[data-hook="CartItemDataHook.totalPrice"] div',
    '[data-hook="Footer.subtotalValue"]'
  ];
  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (el.querySelector(".eur-price")) return;
      const eur = convertPriceText(el.innerText);
      if (eur) appendEUR(el, eur);
    });
  });
}

// Checkout & Order Summary
function convertCheckoutSummaryPrices() {
  const selectors = [
    '[data-hook="FoldableSummarySectionDataHook.total"]',
    '[data-hook="LineItemDataHooks.Price"]',
    '[data-hook="total-row-value"] span'
  ];
  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      const text = el.innerText;
      if (!text.includes("лв")) return;
      if (text.includes("€")) return; // Prevent duplicates
      const eur = convertPriceText(text);
      if (eur) el.innerText = `${text} (${eur} €)`;
    });
  });
}

// ✅ Thank You Page prices
function convertThankYouPrices() {
  const selectors = [
    '[data-hook="ProductLineItemDataHook.totalPrice"]',
    '[data-hook="subtotal-row-value"]',
    '[data-hook="total-row-value"]'
  ];
  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      const text = el.innerText;
      if (!text.includes("лв")) return;
      if (text.includes("€")) return;
      const eur = convertPriceText(text);
      if (eur) el.innerText = `${text} (${eur} €)`;
    });
  });
}

// Run all conversion handlers
function convertAllPrices() {
  convertCategoryPrices();
  convertProductPagePrice();
  convertCartTotals();
  convertSideCartPrices();
  convertCheckoutSummaryPrices();
  convertThankYouPrices(); // ✅ now included
}

window.addEventListener("load", () => {
  console.log("🧪 price converter running (all contexts)");

  setTimeout(() => {
    convertAllPrices();
    setInterval(convertAllPrices, 2000);
  }, 3000);
});
