import React from "react";
import { createRoot } from "react-dom/client";
import FloatingButton from "./components/FloatingButton";
import buttoncss from "./css/FloatingButton.module.css?inline";
import menucss from "./css/Menu.module.css?inline";

import { getCurrentCharacter, replaceCharacterImages } from "./utils/character";

console.log("C.AI Extra loaded!");

async function test() {
  const character = await getCurrentCharacter();

  console.log("character fetched:");
  console.log(character);

  if (!character) {
    return;
  }

  replaceCharacterImages(character.name);
}

test();

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
addStyles(shadowRoot, buttoncss, menucss);

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <FloatingButton />
  </React.StrictMode>,
);
