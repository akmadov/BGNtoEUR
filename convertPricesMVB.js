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
  if (el.querySelector(".eur-price")) return;

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

// Category page
function convertCategoryPrices() {
  const productPriceElements = document.querySelectorAll('[data-hook="product-item-price-to-pay"]');
  productPriceElements.forEach((el) => {
    if (el.querySelector(".eur-price")) return;
    const eur = convertPriceText(el.textContent);
    if (eur) appendEUR(el, eur);
  });
}

// Product page
function convertProductPagePrice() {
  const richTextDivs = document.querySelectorAll('div[data-testid="richTextElement"]');
  richTextDivs.forEach((div) => {
    const p = div.querySelector("p, h2, span");
    if (!p || !p.innerText.includes("лв") || p.querySelector(".eur-price")) return;
    const eur = convertPriceText(p.innerText);
    if (eur) appendEUR(p, eur);
  });
}

// Cart page
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

// Checkout
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
      if (!text.includes("лв") || text.includes("€")) return;
      const eur = convertPriceText(text);
      if (eur) el.innerText = `${text} (${eur} €)`;
    });
  });
}

// Thank you page
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
      if (!text.includes("лв") || text.includes("€")) return;
      const eur = convertPriceText(text);
      if (eur) el.innerText = `${text} (${eur} €)`;
    });
  });
}

// Friend's site support
function convertFriendSitePrices() {
  const selectors = [
    '[data-hook="challenge-pricing"]',
    '[data-hook="ONLY_ONE_TIME_PAYMENT_PRICING"]',
    '[data-hook="payment-checkout-summary-plan-price"]',
    '[data-hook="payment-checkout-summary-plan-total"]',
    '.sM1Fq9n' // total BGN price span in custom sections
  ];
  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      const text = el.innerText;
      if (!text.includes("лв") && !text.includes("BGN")) return;
      if (text.includes("€")) return;
      const eur = convertPriceText(text);
      if (eur) el.innerText = `${text} (${eur} €)`;
    });
  });

  // Also handle <div data-testid="richTextElement"> for friend's site too
  const divs = document.querySelectorAll('div[data-testid="richTextElement"]');
  divs.forEach((div) => {
    const spans = div.querySelectorAll("h2, span, li");
    spans.forEach((el) => {
      if (!el.innerText.includes("лв") || el.innerText.includes("€")) return;
      const eur = convertPriceText(el.innerText);
      if (eur) el.innerText = `${el.innerText} (${eur} €)`;
    });
  });
}

function convertAllPrices() {
  convertCategoryPrices();
  convertProductPagePrice();
  convertCartTotals();
  convertSideCartPrices();
  convertCheckoutSummaryPrices();
  convertThankYouPrices();
  convertFriendSitePrices(); // ✅ new for friend
}

window.addEventListener("load", () => {
  console.log("💶 BGN to EUR converter running");
  setTimeout(() => {
    convertAllPrices();
    setInterval(convertAllPrices, 2000); // Allow dynamic page updates
  }, 3000);
});
