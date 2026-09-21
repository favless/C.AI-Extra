import { loadCharacter, saveCharacter } from "./database";

function waitForCharacterLink(): Promise<HTMLAnchorElement> {
  return new Promise((resolve) => {
    const findCharacterLink = () => {
      const chatDetails = document.getElementById("chat-details");

      if (!chatDetails) return null;

      return chatDetails.querySelector<HTMLAnchorElement>(
        'a[href^="/character/"]',
      );
    };

    const existing = findCharacterLink();

    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const characterLink = findCharacterLink();

      if (!characterLink) return;

      observer.disconnect();
      resolve(characterLink);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

export async function getCurrentCharacter() {
  if (!location.pathname.startsWith("/chat/")) {
    return null;
  }

  const characterLink = await waitForCharacterLink();

  const characterImage = characterLink.querySelector<HTMLImageElement>("img");

  if (!characterImage) return null;

  const href = characterLink.getAttribute("href");

  if (!href) return null;

  const name = characterImage.alt;
  const originalImageURL = characterImage.src;

  const existingCharacter = await loadCharacter(href);

  if (!existingCharacter) {
    await saveCharacter({
      href,
      name,
      images: [null, null, null, null],
      activeImage: 0,
      useImage: true,
      originalImageURL,
      backgrounds: [null, null, null, null],
      activeBackground: 0,
      useBackground: true,
    });
  }

  return {
    href,
    name,
  };
}
