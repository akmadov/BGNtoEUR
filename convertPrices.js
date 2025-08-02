const RATE = 1.95583;

function convertPriceText(bgnText) {
  const cleaned = bgnText.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
  const bgn = parseFloat(cleaned);
  if (isNaN(bgn)) return null;
  return (bgn / RATE).toFixed(2);
}

function appendEUR(el, eur) {
  const eurSpan = document.createElement("span");
  eurSpan.className = "eur-price";
  eurSpan.textContent = ` (${eur} EUR)`;
  eurSpan.style.cssText = `
    font-size: 0.9em;
    color: #2E2E2E;
    margin-left: 6px;
    white-space: nowrap;
  `;
  el.appendChild(eurSpan);
}

function convertCategoryPrices() {
  const productPriceElements = document.querySelectorAll('[data-hook="product-item-price-to-pay"]');
  productPriceElements.forEach((el) => {
    if (el.querySelector(".eur-price")) return;
    const eur = convertPriceText(el.textContent);
    if (eur) appendEUR(el, eur);
  });
}

function convertProductPagePrice() {
  const richTextDivs = document.querySelectorAll('div[data-testid="richTextElement"]');
  richTextDivs.forEach((div) => {
    const p = div.querySelector("p");
    if (!p || !p.innerText.includes("лв") || p.querySelector(".eur-price")) return;
    const eur = convertPriceText(p.innerText);
    if (eur) appendEUR(p, eur);
  });
}

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

function convertAllPrices() {
  convertCategoryPrices();
  convertProductPagePrice();
  convertCartTotals();
  convertSideCartPrices();
}

window.addEventListener("load", () => {
  console.log("🧪 EUR price converter running (all contexts)");

  setTimeout(() => {
    convertAllPrices();
    setInterval(convertAllPrices, 2000);
  }, 3000);
});
