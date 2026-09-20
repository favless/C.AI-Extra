import { useSession } from "../../context/SessionContext";
import { saveCharacter } from "../../utils/database";
import { reloadImageReplacements } from "../../utils/character";
import { loadCharacter } from "../../utils/database";
import { useState, useEffect } from "react";
import type { CharacterData } from "../../types/CharacterTypes";

import ImageSlot from "../logic/ImageSlot";
import Switch from "../util/Switch";

import style from "../../css/sections/ImageReplacer.module.css";
import global from "../../css/Global.module.css";
import header from "../../css/sections/ToolHeader.module.css";

export default function ImageReplacer() {
  const { currentCharacter, setTab } = useSession();
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [switchState, setSwitchState] = useState<boolean>(true);
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

  // HANDLE IMAGE SLOTS & USEIMAGE SWITCH STATE
  useEffect(() => {
    const urls = character?.images.map((image) =>
      image ? URL.createObjectURL(image) : null,
    ) ?? [null, null, null, null];

    setImageURLs(urls);

    // SWITCH STATE
    if (character) {
      setSwitchState(character?.useImage);
    }

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

  async function deleteSelectedImage() {
    if (!currentCharacter || !character) return;

    const newImages = character.images;
    newImages[selectedSlot] = null;

    const newCharacter: CharacterData = {
      ...character,
      images: newImages,
    };

    await saveCharacter(newCharacter);
    setCharacter(newCharacter);
    reloadImageReplacements();
  }

  async function handleImageToggle(toggle: boolean) {
    if (!currentCharacter || !character) return;

    const newCharacter: CharacterData = {
      ...character,
      useImage: toggle,
    };

    await saveCharacter(newCharacter);
    setCharacter(newCharacter);
    reloadImageReplacements();

    setSwitchState(toggle);
  }

  // SELF EXPLANATORY
  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    slot: number,
  ) {
    if (!currentCharacter || !character) return;

    const file = event.target.files?.[0];
    if (!file) return;

    const images = character ? [...character.images] : [null, null, null, null];

    images[slot] = file;

    const newCharacter: CharacterData = {
      href: currentCharacter.href,
      name: currentCharacter.name,
      images,
      originalImageURL: character.originalImageURL,
      activeImage: slot,
      useImage: character.useImage,
    };

    await saveCharacter(newCharacter);

    setCharacter(newCharacter);

    reloadImageReplacements();

    console.log(`Image saved to slot ${slot}!`);
  }

  return (
    <div>
      <div className={header.header}>
        <button className={header.back} onClick={() => setTab(0)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M19.2854 12.0002L11.2727 12.0002"
              stroke="#000000"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16.5101 15.6364L19.9999 12L16.5101 8.36363"
              stroke="#000000"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.4545 7V4H4V20H13.4545V17"
              stroke="#000000"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Back
        </button>
        <div className={style.info}>
          <Switch
            checked={switchState}
            onChange={(checked) => handleImageToggle(checked)}
          />
          <span>{`Character: ${currentCharacter?.name}`}</span>
          {character?.useImage ? "" : <span>[DISABLED]</span>}
        </div>
      </div>
      <div className={global.divider}></div>
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
        <div className={style.divider}></div>
        <div className={style.right}>
          <img
            src={imageURLs[selectedSlot] ? imageURLs[selectedSlot] : undefined}
            alt="Selected Image"
          />
          <button onClick={deleteSelectedImage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="800px"
              height="800px"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6.59999 6.90909L8.39999 20H15.6L17.4 6.90909"
                stroke="#000000"
              />
              <path
                d="M6 6.66667L18 6.66667"
                stroke="#000000"
                stroke-linecap="round"
              />
              <path
                d="M14.5714 7V6C14.5714 4.89543 13.676 4 12.5714 4H12H11.4286C10.324 4 9.42858 4.89543 9.42858 6V7"
                stroke="#000000"
              />
              <path
                d="M11.9806 10.5463V16.3645"
                stroke="#000000"
                stroke-linecap="round"
              />
              <path
                d="M9.60001 10.5454L10.2 16.3645"
                stroke="#000000"
                stroke-linecap="round"
              />
              <path
                d="M14.4 10.5455L13.8 16.3646"
                stroke="#000000"
                stroke-linecap="round"
              />
            </svg>
          </button>
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
