const RATE = 1.95583;

function convertPriceText(bgnText) {
  const match = bgnText.match(/([\d,.]+)\s*лв/);
  if (!match) return null;

  const bgn = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (isNaN(bgn)) return null;

  const eur = (bgn / RATE).toFixed(2);
  return `EUR ${eur}`;
}

function convertAllPrices() {
  console.log("🧪 Running safe price conversion...");
  const priceSelectors = ["span", "p", "div"];
  priceSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (
        el.dataset?.eurOriginalText ||
        !el.innerText.includes("лв")
      ) return;

      const originalText = el.innerText;
      const converted = convertPriceText(originalText);
      if (!converted) return;

      el.innerText = `${originalText.trim()} (${converted})`;
      el.dataset.eurOriginalText = originalText.trim(); // Prevent double conversions
    });
  });
  console.log("✅ Price conversion done.");
}

window.addEventListener("load", () => {
  console.log("🧪 Price converter loaded.");
  setTimeout(convertAllPrices, 3000); // Give React time to fully render
});
