import { loadCharacter, saveCharacter } from "./database";

function waitForCharacterImage(
  previousName?: string,
): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const findCharacterImage = () => {
      const chatDetails = document.getElementById("chat-details");

      return chatDetails?.querySelector<HTMLImageElement>("img") ?? null;
    };

    const existing = findCharacterImage();

    if (existing && (!previousName || existing.alt !== previousName)) {
      resolve(existing);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    const observer = new MutationObserver(() => {
      const characterImage = findCharacterImage();

      if (
        characterImage &&
        (!previousName || characterImage.alt !== previousName)
      ) {
        clearTimeout(timeout);
        observer.disconnect();
        resolve(characterImage);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["alt", "src"],
    });

    // Don't wait forever if the user opens another chat with the same name,
    // or if Character.AI doesn't change the image element.
    timeout = setTimeout(() => {
      observer.disconnect();

      const characterImage = findCharacterImage();

      if (characterImage) {
        resolve(characterImage);
      } else {
        // Wait for an image to appear if there isn't one yet.
        const imageObserver = new MutationObserver(() => {
          const image = findCharacterImage();

          if (image) {
            imageObserver.disconnect();
            resolve(image);
          }
        });

        imageObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    }, 1000);
  });
}

export async function getCurrentCharacter(previousName?: string) {
  if (!location.pathname.startsWith("/chat/")) {
    return null;
  }

  const chatPath = location.pathname;

  const characterImage = await waitForCharacterImage(previousName);

  // The user may have navigated again while we were waiting.
  if (location.pathname !== chatPath) {
    return null;
  }

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
      backgroundOpacity: 100,
    });
  }

  return {
    chatPath,
    name,
  };
}
