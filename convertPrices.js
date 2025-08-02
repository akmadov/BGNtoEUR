const RATE = 1.95583;

function convertBGNToEUR(bgnText) {
  const match = bgnText.match(/([\d,.]+)\s*лв/);
  if (!match) return null;

  const bgn = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (isNaN(bgn)) return null;

  const eur = (bgn / RATE).toFixed(2);
  return `EUR ${eur}`;
}

function scanAndConvertPrices(rootNode) {
  const elements = rootNode.querySelectorAll("span, p, div, h1, h2, h3");

  elements.forEach((el) => {
    if (el.dataset.eurConverted) return;

    const text = el.innerText;
    if (!text.includes("лв")) return;

    const eur = convertBGNToEUR(text);
    if (eur) {
      el.innerText += ` (${eur})`;
      el.dataset.eurConverted = "true";
    }
  });
}

// Required export for Wix Blocks
export function render($root, props) {
  setTimeout(() => {
    scanAndConvertPrices(document.body);
  }, 1500);
}
