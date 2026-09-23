export type CharacterData = {
  chatPath: string;
  name: string;
  images: (Blob | null)[];
  originalImageURL: string;
  activeImage: number;
  useImage: boolean;
  backgrounds: (Blob | null)[];
  activeBackground: number;
  useBackground: boolean;
  backgroundOpacity: number;
};

export type CurrentCharacter = {
  chatPath: string;
  name: string;
};
