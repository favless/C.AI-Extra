import React from "react";
import { createRoot } from "react-dom/client";
import FloatingButton from "./components/FloatingButton";
import { startImageReplacement } from "./utils/character";
import { SessionProvider } from "./components/context/SessionContext";

import buttoncss from "./css/FloatingButton.module.css?inline";
import menucss from "./css/Menu.module.css?inline";
import toolheadercss from "./css/sections/ToolHeader.module.css?inline";
import toollistcss from "./css/sections/ToolList.module.css?inline";
import globalcss from "./css/Global.module.css?inline";

console.log("C.AI Extra loaded!");

startImageReplacement();

function addStyles(shadowRoot: ShadowRoot, ...styles: string[]) {
  for (const css of styles) {
    const style = document.createElement("style");
    style.textContent = css;
    shadowRoot.appendChild(style);
  }
}

const host = document.createElement("div");
document.body.appendChild(host);
const shadowRoot = host.attachShadow({ mode: "open" });
const container = document.createElement("div");
shadowRoot.appendChild(container);

// CSS GOES HERE
addStyles(
  shadowRoot,
  buttoncss,
  menucss,
  toolheadercss,
  toollistcss,
  globalcss,
);

const theme = {
  "ce-background": "#131314",
  "ce-foreground": "#ffffff",
  "ce-accent": "#5b8cff",
  "ce-secondary": "#27272a",
  "ce-border": "#0e0e0e",
};

for (const [name, value] of Object.entries(theme)) {
  host.style.setProperty(`--${name}`, value);
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <SessionProvider>
      <FloatingButton />
    </SessionProvider>
  </React.StrictMode>,
);
