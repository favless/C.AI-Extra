import { loadCharacter } from "./database";
import type { CurrentCharacter } from "../types/CharacterTypes";
import bgcss from "./background.css?inline";

let backgroundElement: HTMLImageElement | null = null;
let backgroundURL: string | null = null;

export function createBackground() {
  const chatBody = document.querySelector<HTMLElement>("#chat-body");

  if (!chatBody) return;

  chatBody.style.position = "relative";

  backgroundElement = document.createElement("img");
  backgroundElement.className = "charrium-background";

  chatBody.prepend(backgroundElement);

  const style = document.createElement("style");
  style.textContent = bgcss;
  document.head.appendChild(style);
}

export async function updateBackground(
  currentCharacter: CurrentCharacter | null,
) {
  if (!backgroundElement) return;

  if (backgroundURL) {
    URL.revokeObjectURL(backgroundURL);
    backgroundURL = null;
  }

  if (!currentCharacter) {
    backgroundElement.src = "";
    backgroundElement.style.display = "none";
    return;
  }

  const character = await loadCharacter(currentCharacter.href);

  if (!character || !character.useBackground) {
    backgroundElement.src = "";
    backgroundElement.style.display = "none";
    return;
  }

  const background = character.backgrounds[character.activeBackground];

  if (!background) {
    backgroundElement.src = "";
    backgroundElement.style.display = "none";
    return;
  }

  backgroundURL = URL.createObjectURL(background);
  backgroundElement.src = backgroundURL;
  backgroundElement.style.display = "block";
}
