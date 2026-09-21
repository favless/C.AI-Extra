export type CharacterData = {
  href: string;
  name: string;
  images: (Blob | null)[];
  originalImageURL: string;
  activeImage: number;
  useImage: boolean;
  backgrounds: (Blob | null)[];
  activeBackground: number;
  useBackground: boolean;
};

export type CurrentCharacter = {
  href: string;
  name: string;
};
