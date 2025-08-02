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
  const priceSelectors = ["span", "p", "div", "h1", "h2", "h3"];

  priceSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
      if (!el.innerText.includes("лв")) return;

      const existingEUR = el.querySelector(".eur-price");
      const currentBGN = el.innerText.match(/([\d,.]+)\s*лв/);

      // If there's already a EUR price, check if we need to update it
      if (existingEUR && currentBGN) {
        const eur = convertPriceText(el.innerText);
        if (eur && existingEUR.textContent !== `(${eur} EUR)`) {
          existingEUR.textContent = `(${eur} EUR)`;
        }
        return;
      }

      // Add new EUR price
      if (!el.dataset.eurConverted) {
        const eur = convertPriceText(el.innerText);
        if (eur) {
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
      }
    });
  });
}

// Wait for page to fully load, then watch for dynamic price changes
window.addEventListener("load", () => {
  console.log("🔁 Starting auto price conversion…");

  setTimeout(() => {
    convertAllPrices();

    // Check every 2 seconds for updates
    setInterval(() => {
      convertAllPrices();
    }, 2000);
  }, 3000);
});
