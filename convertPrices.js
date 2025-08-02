  const RATE = 1.95583;

  function convertPriceText(bgnText) {
    const match = bgnText.match(/([\d,.]+)\s*лв/);
    if (!match) return null;

    const bgn = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
    if (isNaN(bgn)) return null;

    const eur = (bgn / RATE).toFixed(2);
    return `(${eur} EUR)`;
  }

  function convertAllPrices() {
    const elements = document.querySelectorAll("*:not([data-eur-converted])");

    elements.forEach((el) => {
      if (
        el.getAttribute("data-hook") === "CartItemDataHook.totalPrice" ||
        el.innerText.includes("EUR") ||
        !el.innerText.includes("лв")
      ) {
        return;
      }

      const eur = convertPriceText(el.innerText);
      if (eur) {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.alignItems = "center";
        wrapper.style.fontSize = getComputedStyle(el).fontSize;

        const original = document.createElement("div");
        original.innerText = el.innerText;

        const converted = document.createElement("div");
        converted.innerText = eur;

        wrapper.appendChild(original);
        wrapper.appendChild(converted);

        el.innerText = "";
        el.appendChild(wrapper);
        el.dataset.eurConverted = "true";
      }
    });
  }

  window.addEventListener("load", () => {
    setInterval(() => {
      console.log("🔁 Running conversion check");
      convertAllPrices();
    }, 2000);
  });
