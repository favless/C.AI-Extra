import { loadAllCharacters } from "./database";
import type { CharacterData } from "../types/CharacterTypes";

type CharacterImage = CharacterData & {
  imageURL: string | null;
};

function waitForCharacterLink(): Promise<HTMLAnchorElement> {
  return new Promise((resolve) => {
    const findCharacterLink = () => {
      const chatDetails = document.getElementById("chat-details");

      if (!chatDetails) {
        return null;
      }

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

  const characterImage = characterLink.querySelector<HTMLImageElement>("img");

  if (!characterImage) {
    return null;
  }

  const href = characterLink.getAttribute("href");

  if (!href) {
    return null;
  }

  return {
    href,
    name: characterImage.alt,
  };
}

function replaceImages() {
  const images = document.querySelectorAll<HTMLImageElement>("img");

  images.forEach((img) => {
    characterImages.forEach((char) => {
      if ((img.alt === char.name || img.title === char.name) && char.imageURL) {
        img.src = char.imageURL;
      }
    });
  });
}

let characterImages: CharacterImage[] = [];

let imageObserver: MutationObserver | null = null;

export async function startImageReplacement() {
  if (imageObserver) {
    return;
  }

  await reloadImageReplacements();

  imageObserver = new MutationObserver(() => {
    replaceImages();
  });

  imageObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export function stopImageReplacement() {
  imageObserver?.disconnect();
  imageObserver = null;

  for (const character of characterImages) {
    if (character.imageURL) {
      URL.revokeObjectURL(character.imageURL);
    }
  }

  characterImages = [];
}

export async function reloadImageReplacements() {
  for (const character of characterImages) {
    if (character.imageURL) {
      URL.revokeObjectURL(character.imageURL);
    }
  }

  const characters = await loadAllCharacters();

  characterImages = characters.map((char) => {
    const image = char.images[char.activeImage];

    return {
      ...char,
      imageURL: image ? URL.createObjectURL(image) : null,
    };
  });

  replaceImages();
}
