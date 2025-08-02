function convertPriceText(bgnText) {
  const match = bgnText.match(/([\d,.]+)\s*лв/);
  if (!match) return null;

  const bgn = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (isNaN(bgn)) return null;

  const eur = (bgn / 1.95583).toFixed(2);
  return eur;
}

function convertCartPrices() {
  const selectors = [
    '[data-hook="SubTotals.subtotalText"]',
    '[data-hook="Total.formattedValue"]'
  ];

  selectors.forEach((selector) => {
    const el = document.querySelector(selector);
    if (!el) return;

    // Remove any previously added EUR spans
    const existingEUR = el.querySelector(".eur-price");
    if (existingEUR) existingEUR.remove();

    if (!el.innerText.includes("лв")) return;

    const eur = convertPriceText(el.innerText);
    if (eur) {
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

window.addEventListener("load", () => {
  console.log("💳 Main cart currency conversion started…");

  setTimeout(() => {
    convertCartPrices();

    // Keep checking every 2 seconds for updates (e.g. quantity changes)
    setInterval(() => {
      convertCartPrices();
    }, 2000);
  }, 2000);
});
