export type CharacterData = {
  href: string;
  name: string;
  images: (Blob | null)[];
  activeImage: number;
};

export type CurrentCharacter = {
  href: string;
  name: string;
};
