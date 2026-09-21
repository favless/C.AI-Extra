import type { CharacterData } from "../types/CharacterTypes";
import { loadAllCharacters } from "./database";

type CharacterImage = CharacterData & {
  imageURL: string | null;
};

let characterImages: CharacterImage[] = [];

let imageObserver: MutationObserver | null = null;

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
    if (char.useImage) {
      const image = char.images[char.activeImage];

      return {
        ...char,
        imageURL: image ? URL.createObjectURL(image) : null,
      };
    }

    return {
      ...char,
      imageURL: char.originalImageURL,
    };
  });

  replaceImages();
}
