import { loadCharacter, saveCharacter } from "./database";

function waitForCharacterImage(): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const findCharacterImage = () => {
      const chatDetails = document.getElementById("chat-details");

      if (!chatDetails) return null;

      return chatDetails.querySelector<HTMLImageElement>("img");
    };

    const existing = findCharacterImage();

    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const characterImage = findCharacterImage();

      if (!characterImage) return;

      observer.disconnect();
      resolve(characterImage);
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

  const chatPath = location.pathname;

  const characterImage = await waitForCharacterImage();

  const name = characterImage.alt;
  const originalImageURL = characterImage.src;

  const existingCharacter = await loadCharacter(chatPath);

  if (!existingCharacter) {
    await saveCharacter({
      chatPath,
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
    chatPath,
    name,
  };
}
