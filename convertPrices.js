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
  const priceSelectors = ["span", "p", "div", "h1", "h2", "h3"];
  priceSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (
        el.dataset &&
        el.dataset.eurConverted === "true"
      ) return;

      const text = el.innerText.trim();
      if (!text.includes("лв")) return;

      const eur = convertPriceText(text);
      if (eur) {
        el.innerText = `${text} (${eur})`;
        el.dataset.eurConverted = "true";
      }
    });
  });
}

// 👀 MutationObserver to catch dynamic updates
const observer = new MutationObserver(() => {
  convertAllPrices();
});

window.addEventListener("load", () => {
  console.log("💶 Price converter loaded and watching...");
  convertAllPrices();

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
});
