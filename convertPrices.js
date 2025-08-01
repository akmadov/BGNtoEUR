console.log("🕓 Waiting to convert prices...");

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
  try {
    console.log("🔁 Running price conversion...");
    const priceSelectors = ["span", "p", "div", "h1", "h2", "h3"];
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
    console.log("✅ Prices converted.");
  } catch (err) {
    console.error("❌ Error during conversion:", err);
  }
}

window.addEventListener("load", () => {
  console.log("🚀 Page loaded. Starting 10-second delay...");
  setTimeout(convertAllPrices, 10000);
});
