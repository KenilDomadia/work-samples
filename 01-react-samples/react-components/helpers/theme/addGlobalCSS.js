function addGlobalCSS(themeConfig) {
  let styleNode = document.getElementById("demo-global-css");
  if (!styleNode) {
    styleNode = document.createElement("style");
    styleNode.id = "demo-global-css";
    document.head.appendChild(styleNode);
  }

  const cssString = `
    body, button, input {
      font-family: ${themeConfig.font.contentFont};
    }

    body {
      font-size: 16px;
      color: ${themeConfig.color.text};
    }

  `;

  styleNode.innerHTML = cssString;
}

export default addGlobalCSS;
