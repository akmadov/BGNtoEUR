console.log("💶 EUR Converter Script Active");

const RATE = 1.95583;
const convertedTextCache = new Set(); // 🧠 track already-processed texts

function convertPriceText(bgnText) {
  const match = bgnText.match(/([\d,.]+)\s*лв/);
  if (!match) return null;

  const bgn = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (isNaN(bgn)) return null;

  const eur = (bgn / RATE).toFixed(2);
  return `EUR ${eur}`;
}

function appendConvertedPrice(el) {
  if (!el || typeof el.innerText !== "string") return;

  const originalText = el.innerText.trim();

  if (!originalText.includes("лв")) return;
  if (convertedTextCache.has(originalText)) return; // already processed

  const eur = convertPriceText(originalText);
  if (eur) {
    const span = document.createElement("span");
    span.className = "eur-price-addon";
    span.style.marginLeft = "6px";
    span.style.fontStyle = "italic";
    span.style.fontSize = "90%";
    span.textContent = `(${eur})`;
    el.appendChild(span);
    convertedTextCache.add(originalText); // mark as done
  }
}


function convertAllPrices() {
  const elements = document.querySelectorAll("span, p, div, h1, h2, h3");
  elements.forEach(el => appendConvertedPrice(el));
}

// 🚀 Initial run
window.addEventListener("load", () => {
  console.log("🔁 Initial price conversion...");
  convertAllPrices();

  // 🧲 Observe future changes
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          appendConvertedPrice(node);
          const nested = node.querySelectorAll?.("span, p, div, h1, h2, h3") || [];
          nested.forEach(el => appendConvertedPrice(el));
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
