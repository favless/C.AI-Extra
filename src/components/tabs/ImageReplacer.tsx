import { useSession } from "../../context/SessionContext";
import { saveCharacter } from "../../utils/database";
import { reloadImageReplacements } from "../../utils/character";
import { loadCharacter } from "../../utils/database";
import { useState, useEffect } from "react";
import type { CharacterData } from "../../types/CharacterTypes";

import ToolHeader from "../sections/ToolHeader";
import ImageSlot from "../logic/ImageSlot";
import style from "../../css/sections/ImageReplacer.module.css";

export default function ImageReplacer() {
  const { currentCharacter } = useSession();
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [imageURLs, setImageURLs] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  // HANDLE SELECTED CHARACTER
  useEffect(() => {
    if (!currentCharacter) {
      setCharacter(null);
      return;
    }

    loadCharacter(currentCharacter.href).then((character) => {
      setCharacter(character);

      if (character) {
        setActiveSlot(character.activeImage);
      }
    });
  }, [currentCharacter]);

  // HANDLE IMAGE SLOTS
  useEffect(() => {
    const urls = character?.images.map((image) =>
      image ? URL.createObjectURL(image) : null,
    ) ?? [null, null, null, null];

    setImageURLs(urls);

    return () => {
      urls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [character]);

  // HANDLE ACTIVE IMAGE CHANGE
  useEffect(() => {
    if (!character) return;

    if (character.activeImage === activeSlot) return;

    const newCharacter = {
      ...character,
      activeImage: activeSlot,
    };

    saveCharacter(newCharacter);
    setCharacter(newCharacter);

    reloadImageReplacements();
  }, [activeSlot]);

  // SELF EXPLANATORY
  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    slot: number,
  ) {
    if (!currentCharacter) return;

    const file = event.target.files?.[0];
    if (!file) return;

    const images = character ? [...character.images] : [null, null, null, null];

    images[slot] = file;

    const newCharacter: CharacterData = {
      href: currentCharacter.href,
      name: currentCharacter.name,
      images,
      activeImage: slot,
    };

    await saveCharacter(newCharacter);

    setCharacter(newCharacter);

    reloadImageReplacements();

    console.log(`Image saved to slot ${slot}!`);
  }

  return (
    <div>
      <ToolHeader />
      <div className={style["image-container"]}>
        <div className={style.left}>
          <ImageSlot
            character={character}
            ownSlot={0}
            handleImageUpload={handleImageUpload}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            imageURLs={imageURLs}
          />
          <ImageSlot
            character={character}
            ownSlot={1}
            handleImageUpload={handleImageUpload}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            imageURLs={imageURLs}
          />
          <ImageSlot
            character={character}
            ownSlot={2}
            handleImageUpload={handleImageUpload}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            imageURLs={imageURLs}
          />
          <ImageSlot
            character={character}
            ownSlot={3}
            handleImageUpload={handleImageUpload}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            imageURLs={imageURLs}
          />
        </div>
        <div className={style.right}>
          <img
            src={imageURLs[selectedSlot] ? imageURLs[selectedSlot] : undefined}
            alt="Selected Image"
          />
        </div>
      </div>
      <button
        className={`${style.apply} ${selectedSlot == character?.activeImage ? style.cantapply : ""}`}
        onClick={() => {
          setActiveSlot(selectedSlot);
        }}
      >
        {selectedSlot == character?.activeImage
          ? "Selected image is active"
          : "Use this image"}
      </button>
    </div>
  );
}
