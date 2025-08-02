const RATE = 1.95583;

function convertPriceText(bgnText) {
  const match = bgnText.match(/([\d,.]+)\s*лв/);
  if (!match) return null;

  const bgn = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (isNaN(bgn)) return null;

  const eur = (bgn / RATE).toFixed(2);
  return eur;
}

function convertCartTotals() {
  const cartSelectors = [
    '[data-hook="SubTotals.subtotalText"]',
    '[data-hook="Total.formattedValue"]'
  ];

  cartSelectors.forEach((selector) => {
    const el = document.querySelector(selector);
    if (!el || !el.innerText.includes("лв")) return;

    const existingEUR = el.querySelector(".eur-price");
    const eur = convertPriceText(el.innerText);
    if (!eur) return;

    if (existingEUR) {
      existingEUR.textContent = ` (${eur} EUR)`;
    } else {
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
  });
}

function convertAllPrices() {
  const priceSelectors = ["span", "p", "div", "h1", "h2", "h3"];

  priceSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
      // ✅ Skip prices in the side cart
      if (el.getAttribute("data-hook") === "CartItemDataHook.totalPrice") return;
      if (!el.innerText.includes("лв")) return;

      const existingEUR = el.querySelector(".eur-price");
      const eur = convertPriceText(el.innerText);
      if (!eur) return;

      // If there's already a EUR price, check if we need to update it
      if (existingEUR) {
        if (existingEUR.textContent !== `(${eur} EUR)`) {
          existingEUR.textContent = `(${eur} EUR)`;
        }
        return;
      }

      // Add new EUR price
      if (!el.dataset.eurConverted) {
        const eurSpan = document.createElement("span");
        eurSpan.className = "eur-price";
        eurSpan.textContent = `(${eur} EUR)`;
        eurSpan.style.cssText = `
          display: block;
          text-align: center;
          color: #2E2E2E;
          margin-top: 2px;
        `;
        el.appendChild(eurSpan);
        el.dataset.eurConverted = "true";
      }
    });
  });

  // ✅ Handle cart subtotal and total
  convertCartTotals();
}

// 🔁 Auto-run conversion every 2 seconds after load
window.addEventListener("load", () => {
  console.log("🔁 Starting auto price conversion…");

  setTimeout(() => {
    convertAllPrices();
    setInterval(convertAllPrices, 2000);
  }, 3000);
});
