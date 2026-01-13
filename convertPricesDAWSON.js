// EUR -> BGN (BGN = EUR * 1.95583)
const RATE_BGN_PER_EUR = 1.95583;

// Detect EUR in common Wix price formats:
// - "€12.34" / "€ 12,34"
// - "12.34 €" / "12,34€"
// - with spaces, &nbsp;, non-breaking spaces
const EUR_REGEX =
  /(?:€)(?:\s*|&nbsp;|\u00A0)?(\d+(?:[.,]\d{0,2})?)|(\d+(?:[.,]\d{0,2})?)(?:\s*|&nbsp;|\u00A0)?(?:€)/g;

const DIGIT_REGEX = /^\d+(?:[.,]\d+)?$/;

function parseEurFromText(text) {
  const matches = [...text.matchAll(EUR_REGEX)];
  if (!matches || matches.length === 0) return null;

  // We’ll pick the first numeric capture we can reliably parse
  // Capture group 1: after €
  // Capture group 2: before €
  let candidate = null;

  for (const m of matches) {
    if (m[1] && m[1].match(DIGIT_REGEX)) {
      candidate = m[1];
      break;
    }
    if (m[2] && m[2].match(DIGIT_REGEX)) {
      candidate = m[2];
      break;
    }
  }

  if (!candidate) return null;

  // Normalize decimal comma -> dot for parsing
  const eur = parseFloat(candidate.replace(",", "."));
  if (Number.isNaN(eur)) return null;

  return eur;
}

function formatBgn(bgn) {
  // Wix often uses comma decimals in BG, keep that style:
  // 2 decimals, comma decimal separator
  return bgn.toFixed(2).replace(".", ",");
}

function shouldSkipEl(el) {
  if (!el) return true;

  // Must contain the EUR symbol somewhere
  const txt = (el.innerText || "").trim();
  if (!txt.includes("€")) return true;

  // Avoid duplicating if we already appended
  if (el.querySelector(".bgn-price")) return true;

  // Avoid if element already contains leva (maybe Wix already shows dual currency somewhere)
  if (txt.includes("лв") || txt.includes("BGN")) return true;

  // Also avoid if innerHTML already contains our marker
  if ((el.innerHTML || "").includes('class="bgn-price"')) return true;

  return false;
}

function appendBGN(el, bgnText, color, fontSize) {
  // Don’t append if it already exists
  if (el.querySelector(".bgn-price")) return;

  const span = document.createElement("span");
  span.className = "bgn-price";
  span.textContent = ` / ${bgnText} лв.`;
  span.style.cssText = `
    font-size: ${fontSize || "1em"};
    color: ${color || "#043640"};
    margin-left: 6px;
    white-space: nowrap;
  `;
  el.appendChild(span);
}

// Strategy A: append a <span> (safer, avoids overwriting Wix-rendered nodes)
function convertWithAppending(selectors) {
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (shouldSkipEl(el)) return;

      const eur = parseEurFromText(el.innerText);
      if (eur == null) return;

      const bgn = eur * RATE_BGN_PER_EUR;
      appendBGN(el, formatBgn(bgn), el.style.color, el.style.fontSize);
    });
  });
}

// Strategy B: modify innerText (use only where Wix renders nested/fragmented text nodes)
function convertWithInnerText(selectors) {
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (shouldSkipEl(el)) return;

      const eur = parseEurFromText(el.innerText);
      if (eur == null) return;

      const bgn = eur * RATE_BGN_PER_EUR;
      el.innerText += ` / ${formatBgn(bgn)} лв.`;
    });
  });
}

/* ===== Your page-specific converters (mirrors your original structure) ===== */

function convertCategoryPrices() {
  convertWithAppending([
    '[data-hook="product-item-price-to-pay"]',
    '[data-hook="product-item-price-before-discount"]',
    '[data-hook="formatted-primary-price"]',
    '[data-hook="challenge-pricing"]',
  ]);
}

function convertProductPagePrice() {
  document.querySelectorAll('div[data-testid="richTextElement"]').forEach((wrap) => {
    const el = wrap.querySelector("p, h2, span, div");
    if (!el || shouldSkipEl(el)) return;

    const eur = parseEurFromText(el.innerText);
    if (eur == null) return;

    const bgn = eur * RATE_BGN_PER_EUR;
    appendBGN(el, formatBgn(bgn), el.style.color, el.style.fontSize);
  });
}

function convertCartTotals() {
  convertWithAppending([
    '[data-hook="SubTotals.subtotalText"]',
    '[data-hook="Total.formattedValue"]',
    '[data-hook="TotalShipping.estimatedShipping"]',
    'dd[data-hook="SubTotals.subtotalText"]',
    'dd[data-hook="Total.formattedValue"]',
    'dd[data-hook="TotalShipping.estimatedShipping"]',
  ]);
}

function convertCheckout() {
  convertWithAppending([
    '[data-hook="total-row-value"] span',
    '[data-hook="total-row-value"]',
    '[data-hook="LineItemDataHooks.Price"]',
    '[data-hook="FoldableSummarySectionDataHook.total"]',
  ]);
}

// Side cart: you had two functions with the same name (bug).
// I’m keeping both behaviors, split into two functions:

function convertSideCartPrices_append() {
  convertWithAppending([
    '[data-hook="CartItemDataHook.price"]',
    '[data-hook="CartItemDataHook.totalPrice"] div',
    '[data-hook="Footer.subtotalValue"]',
    '[data-hook="cart-widget-item-price"]',
    '[data-hook="cart-widget-total"]',
  ]);
}

function convertSideCartPrices_innerText() {
  convertWithInnerText([
    '[data-hook="CartItemDataHook.totalPrice"] div div',
    '[data-hook="CartItemDataHook.comparePrice"]',
    '[data-hook="LineItemDataHooks.ComparePrice"]',
    '[data-hook="TotalsSectionDataHooks.TaxIncluded"]',
    '[data-hook="Footer.estimatedTotalValue"]',
    '[data-hook="dropdown-content-option"]',
    '[data-hook="dropdown-base-text"]',
    '[data-hook="core-radio-button"]',
    '[data-hook="DeliveryOptionPreview__deliveryOptionPrice"]',
    '[data-hook="Footer.subtotalValue"]',
    '[data-wix-line-item-price="CartItemDataHook.price"]',
  ]);
}

function convertCheckoutSummaryPrices() {
  convertWithInnerText(['[data-hook="payment-checkout-summary-plan-price"]']);
}

function convertThankYouPrices() {
  convertWithInnerText([
    '[data-hook="ProductLineItemDataHook.totalPrice"]',
    '[data-hook="subtotal-row-value"]',
    '[data-hook="challenge-pricing"]',
  ]);
}

function convertFilter() {
  convertWithInnerText(['[data-hook="filter-type-PRICE "] span']);
  document.querySelectorAll('[data-hook="filter-type-PRICE "] span').forEach((el) => {
    el.style.fontSize = "17px";
  });
}

function convertAllPrices() {
  convertCategoryPrices();
  convertProductPagePrice();
  convertCartTotals();

  convertSideCartPrices_append();
  convertSideCartPrices_innerText();

  convertCheckoutSummaryPrices();
  convertThankYouPrices();
  convertFilter();
  convertCheckout();
}

/* ===== Your existing “remove appended price on mobile place order click” logic ===== */

window.addEventListener("load", () => {
  function removeEl(node) {
    if (!node) return;
    if (typeof node.remove === "function") node.remove();
    else if (node.parentNode) node.parentNode.removeChild(node);
  }

  function attachPlaceOrderCleanup() {
    const btn = document.querySelector('[data-hook="place-order-button"]');
    if (!btn) return;

    if (btn.dataset.listenerAttached) return;
    btn.dataset.listenerAttached = "true";

    btn.addEventListener("click", () => {
      if (!window.matchMedia("(max-width: 768px)").matches) return;

      document.querySelectorAll(".bgn-price").forEach((el) => removeEl(el));
    });
  }

  // Run conversions frequently, like your original.
  setTimeout(() => {
    setInterval(convertAllPrices, 200);
  }, 150);

  // Re-attach button listener as DOM changes
  setTimeout(() => {
    setInterval(attachPlaceOrderCleanup, 1200);
  }, 1500);

  new MutationObserver(attachPlaceOrderCleanup).observe(document.body, {
    childList: true,
    subtree: true,
  });

  attachPlaceOrderCleanup();
});
