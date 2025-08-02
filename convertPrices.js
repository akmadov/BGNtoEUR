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
  const priceSelectors = ["span", "p", "div"];
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
      if (!eur) return;

      // Create a new span element for the EUR value
      const eurSpan = document.createElement("span");
      eurSpan.textContent = ` (${eur})`;
      eurSpan.style.marginLeft = "4px";
      eurSpan.style.fontSize = "90%";
      eurSpan.style.color = "#333";
      eurSpan.style.fontStyle = "italic";

      // Append the EUR span safely without modifying existing content
      el.appendChild(eurSpan);
      el.dataset.eurConverted = "true";
    });
  });
}

// Watch for dynamically loaded prices
const observer = new MutationObserver(() => {
  convertAllPrices();
});

window.addEventListener("load", () => {
  console.log("💶 EUR converter is running and observing...");
  convertAllPrices();

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
