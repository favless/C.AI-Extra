export type CharacterData = {
  href: string;
  name: string;
  images: (Blob | null)[];
  originalImageURL: string;
  activeImage: number;
  useImage: boolean;
};

export type CurrentCharacter = {
  href: string;
  name: string;
};
