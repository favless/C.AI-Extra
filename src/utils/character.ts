function waitForCharacterLink(): Promise<HTMLAnchorElement> {
  return new Promise((resolve) => {
    const findCharacterLink = () => {
      const chatDetails = document.getElementById("chat-details");

      if (!chatDetails) {
        return null;
      }

      return chatDetails.querySelector<HTMLAnchorElement>(
        'a[href^="/character/"]'
      );
    };

    const existing = findCharacterLink();

    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const characterLink = findCharacterLink();

      if (characterLink) {
        observer.disconnect();
        resolve(characterLink);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

export async function getCurrentCharacter() {
  const characterLink = await waitForCharacterLink();

  const characterImage =
    characterLink.querySelector<HTMLImageElement>("img");

  if (!characterImage) {
    return null;
  }

  return {
    href: characterLink.getAttribute("href"),
    name: characterImage.alt,
  };
}

export function replaceCharacterImages(name: string) {
  const replaceImages = () => {
    const images = document.querySelectorAll<HTMLImageElement>("img");

    images.forEach((img) => {
      if (img.alt === name || img.title === name) {
        img.src = "https://placehold.co/128x128/ff0000/ffffff?text=REPLACED";
      }
    });
  };

  // Replace images that already exist
  replaceImages();

  // Watch for new images being added
  const observer = new MutationObserver(() => {
    replaceImages();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}