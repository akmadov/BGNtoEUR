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
  const priceSelectors = ["p", "span", "div", "h1", "h2", "h3"];
  priceSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (el.dataset.eurConverted) return;

      const text = el.innerText;
      if (!text.includes("лв")) return;

      const eur = convertPriceText(text);
      if (eur) {
        el.innerText = `${text} (${eur})`;
        el.dataset.eurConverted = "true";
      }
    });
  });
  console.log("✅ EUR prices updated.");
}

function startConversionLoop() {
  convertAllPrices();
  setInterval(convertAllPrices, 2000); // Every 2 seconds
}

window.addEventListener("load", () => {
  console.log("🚀 Price converter loaded & running...");
  setTimeout(startConversionLoop, 1000);
});
