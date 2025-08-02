const RATE = 1.95583;

function convertPriceText(bgnText) {
  const match = bgnText.match(/([\d,.]+)\s*лв/);
  if (!match) return null;

  const bgn = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (isNaN(bgn)) return null;

  const eur = (bgn / RATE).toFixed(2);
  return eur;
}

function convertAllPrices() {
  console.log("🔁 Running conversion…");
  const priceSelectors = ["span", "p", "div", "h1", "h2", "h3"];

  priceSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
      if (el.dataset.eurConverted) return;
      if (!el.innerText.includes("лв")) return;
      if (el.querySelector(".eur-price")) return;

      const originalText = el.innerText.trim();
      const eur = convertPriceText(originalText);

      if (eur) {
        const eurSpan = document.createElement("span");
        eurSpan.className = "eur-price";
        eurSpan.textContent = `(${eur} EUR)`;

        // ✅ Styling to match original price (no small text)
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
  console.log("✅ Prices converted");
}

// Delay to ensure DOM is fully loaded (helps with React/Wix rendering)
window.addEventListener("load", () => {
  setTimeout(convertAllPrices, 3000); // adjust delay as needed
});
