import type { CharacterData } from "../types/CharacterTypes";
import { loadAllCharacters } from "./database";

type CharacterImage = CharacterData & {
  imageURL: string | null;
};

let characterImages: CharacterImage[] = [];

let imageObserver: MutationObserver | null = null;

function getCharacterMap() {
  return new Map(
    characterImages.map((character) => [character.chatPath, character]),
  );
}

function replaceImage(img: HTMLImageElement, character: CharacterImage) {
  if (!character.imageURL) return;

  if (img.src === character.imageURL) return;

  img.src = character.imageURL;
}

// Replace a single image based on its surrounding /chat/ link
function replaceChatLinkedImage(img: HTMLImageElement) {
  const anchor = img.closest<HTMLAnchorElement>('a[href^="/chat/"]');

  if (!anchor) return;

  const chatPath = anchor.getAttribute("href");

  if (!chatPath) return;

  const character = getCharacterMap().get(chatPath);

  if (!character) return;

  replaceImage(img, character);
}

// Replace all /chat/ linked images inside a given element
function replaceChatLinkedImages(root: ParentNode = document) {
  const images = root.querySelectorAll<HTMLImageElement>(
    'a[href^="/chat/"] img',
  );

  images.forEach((image) => {
    replaceChatLinkedImage(image);
  });
}

function replaceMainContentImages() {
  const isCharacterPage =
    location.pathname.startsWith("/chat/") ||
    location.pathname.startsWith("/character/");

  if (!isCharacterPage) return;

  const currentPath = location.pathname;

  const character = characterImages.find(
    (character) => character.chatPath === currentPath,
  );

  if (!character || !character.imageURL) return;

  const mainContent = document.getElementById("main-content");

  if (!mainContent) return;

  const images = mainContent.querySelectorAll<HTMLImageElement>("img");

  images.forEach((image) => {
    if (image.alt === character.name || image.title === character.name) {
      replaceImage(image, character);
    }
  });
}

function replaceImages(root: ParentNode = document) {
  if (
    location.pathname.startsWith("/chat/") ||
    location.pathname.startsWith("/character/")
  ) {
    replaceMainContentImages();
    replaceChatLinkedImages(root);
    return;
  }

  replaceChatLinkedImages(root);
}

function replaceAddedNode(node: Node) {
  if (!(node instanceof Element)) return;

  const isCharacterPage =
    location.pathname.startsWith("/chat/") ||
    location.pathname.startsWith("/character/");

  if (isCharacterPage) {
    const mainContent = document.getElementById("main-content");

    if (mainContent && (node === mainContent || mainContent.contains(node))) {
      replaceMainContentImages();
    }
  }

  if (node instanceof HTMLImageElement) {
    replaceChatLinkedImage(node);
  }

  replaceChatLinkedImages(node);
}

export async function startImageReplacement() {
  if (imageObserver) {
    return;
  }

  await reloadImageReplacements();

  imageObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;

      for (const node of mutation.addedNodes) {
        replaceAddedNode(node);
      }
    }
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
    if (character.imageURL?.startsWith("blob:")) {
      URL.revokeObjectURL(character.imageURL);
    }
  }

  characterImages = [];
}

export async function reloadImageReplacements() {
  for (const character of characterImages) {
    if (character.imageURL?.startsWith("blob:")) {
      URL.revokeObjectURL(character.imageURL);
    }
  }

  const characters = await loadAllCharacters();

  characterImages = characters.map((character) => {
    if (character.useImage) {
      const image = character.images[character.activeImage];

      return {
        ...character,
        imageURL: image ? URL.createObjectURL(image) : null,
      };
    }

    return {
      ...character,
      imageURL: character.originalImageURL,
    };
  });

  replaceImages();
}
