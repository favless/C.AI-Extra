import { loadCharacter } from "./database";
import type { CurrentCharacter } from "../types/CharacterTypes";
import bgcss from "./background.css?inline";

let backgroundElement: HTMLImageElement | null = null;
let backgroundURL: string | null = null;
let backgroundUpdateId = 0;

function waitForChatBody(): Promise<HTMLElement> {
  const existing = document.querySelector<HTMLElement>("#chat-body");
  if (existing) return Promise.resolve(existing);

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const chatBody = document.querySelector<HTMLElement>("#chat-body");
      if (!chatBody) return;

      observer.disconnect();
      resolve(chatBody);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

export function createBackground() {
  const chatBody = document.querySelector<HTMLElement>("#chat-body");
  if (!chatBody) return;

  chatBody.style.position = "relative";

  if (!backgroundElement) {
    backgroundElement = document.createElement("img");
    backgroundElement.className = "charrium-background";
    backgroundElement.style.display = "none";
  }

  // Character.AI can replace the chat body during SPA navigation.
  if (backgroundElement.parentElement !== chatBody) {
    chatBody.prepend(backgroundElement);
  }

  if (!document.getElementById("charrium-background-style")) {
    const style = document.createElement("style");
    style.id = "charrium-background-style";
    style.textContent = bgcss;
    document.head.appendChild(style);
  }
}

export async function updateBackground(
  currentCharacter: CurrentCharacter | null,
) {
  const updateId = ++backgroundUpdateId;

  if (!currentCharacter) {
    if (backgroundURL) {
      URL.revokeObjectURL(backgroundURL);
      backgroundURL = null;
    }

    if (backgroundElement) {
      backgroundElement.removeAttribute("src");
      backgroundElement.style.display = "none";
    }

    return;
  }

  await waitForChatBody();

  // Another character may have been selected while we were waiting.
  if (updateId !== backgroundUpdateId) return;

  createBackground();

  if (!backgroundElement) return;

  const character = await loadCharacter(currentCharacter.chatPath);

  // Another update may have started while IndexedDB was loading.
  if (updateId !== backgroundUpdateId) return;

  const background = character?.backgrounds?.[character.activeBackground];

  if (!character || !character.useBackground || !background) {
    if (backgroundURL) {
      URL.revokeObjectURL(backgroundURL);
      backgroundURL = null;
    }

    backgroundElement.removeAttribute("src");
    backgroundElement.style.display = "none";
    return;
  }

  if (backgroundURL) {
    URL.revokeObjectURL(backgroundURL);
    backgroundURL = null;
  }

  backgroundURL = URL.createObjectURL(background);
  backgroundElement.src = backgroundURL;

  backgroundElement.style.opacity = String(
    (character.backgroundOpacity ?? 100) / 100,
  );

  backgroundElement.style.display = "block";
}
