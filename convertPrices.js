const RATE = 1.95583;

function convertBGNtoEUR(bgnText) {
  const match = bgnText.match(/([\d.,\s]+)\s*лв/i);
  if (!match) return null;

  let bgn = match[1].replace(/\s/g, "").replace(",", ".");
  bgn = parseFloat(bgn);
  if (isNaN(bgn)) return null;

  const eur = (bgn / RATE).toFixed(2);
  return `(${eur} EUR)`;
}

function processPriceElement(el) {
  if (el.dataset.eurConverted) return; // Already converted

  const text = el.innerText;
  if (!text.includes("лв")) return;

  const eurPrice = convertBGNtoEUR(text);
  if (!eurPrice) return;

  // Check if EUR already exists visually
  if (el.innerText.includes("EUR")) return;

  const span = document.createElement("span");
  span.textContent = ` ${eurPrice}`;
  span.style.fontSize = "0.85em";
  span.style.color = "#2E2E2E";
  span.style.marginLeft = "4px";
  span.style.display = "inline-block";

  el.appendChild(span);
  el.dataset.eurConverted = "true";
}

function convertAllPrices() {
  const priceElements = document.querySelectorAll("p, span, div, h1, h2, h3");
  priceElements.forEach((el) => {
    processPriceElement(el);
  });
}

// Observe for dynamic content (category/product pages)
const observer = new MutationObserver(() => {
  convertAllPrices();
});

observer.observe(document.body, { childList: true, subtree: true });

// Run once on initial load after delay
window.addEventListener("load", () => {
  console.log("✅ Price converter script loaded");
  setTimeout(convertAllPrices, 1000); // Wait to allow page to load fully
});
