import { useEffect, useState } from "react";
import { useSession } from "../../context/SessionContext";
import style from "../../css/sections/CustomBackground.module.css";
import header from "../../css/sections/ToolHeader.module.css";
import global from "../../css/Global.module.css";

import { loadCharacter, saveCharacter } from "../../utils/database";
import type { CharacterData } from "../../types/CharacterTypes";

import Switch from "../modules/Switch";
import { updateBackground } from "../../utils/background";

export default function CustomBackground() {
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [switchState, setSwitchState] = useState<boolean>(true);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [backgroundURLs, setBackgroundURLs] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const { setTab, currentCharacter } = useSession();

  // HANDLE SELECTED CHARACTER
  useEffect(() => {
    if (!currentCharacter) {
      setCharacter(null);
      return;
    }

    loadCharacter(currentCharacter.chatPath).then((character) => {
      setCharacter(character);
    });
  }, [currentCharacter]);

  // HANDLE ACTIVE BACKGROUND CHANGE
  useEffect(() => {
    if (!character || !currentCharacter) return;

    if (character.activeBackground === activeSlot) return;

    const newCharacter = {
      ...character,
      activeBackground: activeSlot,
    };

    async function update() {
      await saveCharacter(newCharacter);
      setCharacter(newCharacter);
      await updateBackground(currentCharacter);
    }

    update();
  }, [activeSlot]);

  // HANDLE BACKGROUND SLOTS & USEBACKGROUND SWITCH STATE
  useEffect(() => {
    const urls = character?.backgrounds.map((image) =>
      image ? URL.createObjectURL(image) : null,
    ) ?? [null, null, null, null];

    setBackgroundURLs(urls);

    // SWITCH STATE
    if (character) {
      setSwitchState(character?.useBackground);
    }

    return () => {
      urls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [character]);

  async function handleBackgroundToggle(toggle: boolean) {
    if (!currentCharacter || !character) return;

    const newCharacter: CharacterData = {
      ...character,
      useBackground: toggle,
    };

    await saveCharacter(newCharacter);
    setCharacter(newCharacter);
    await updateBackground(currentCharacter);

    setSwitchState(toggle);
  }

  // SELF EXPLANATORY
  async function handleBackgroundUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    if (!currentCharacter || !character) return;

    const file = event.target.files?.[0];
    if (!file) return;

    const backgrounds = character
      ? [...character.backgrounds]
      : [null, null, null, null];

    backgrounds[selectedSlot] = file;

    const newCharacter: CharacterData = {
      ...character,
      backgrounds,
      activeBackground: selectedSlot,
    };

    await saveCharacter(newCharacter);

    setCharacter(newCharacter);

    await updateBackground(currentCharacter);

    console.log(`Image saved to slot ${selectedSlot}!`);
  }

  async function handleBackgroundOpacity(opacity: number) {
    if (!character || !currentCharacter) return;

    const newCharacter: CharacterData = {
      ...character,
      backgroundOpacity: opacity,
    };

    await saveCharacter(newCharacter);
    setCharacter(newCharacter);

    await updateBackground(currentCharacter);
  }

  async function deleteSelectedBackground() {
    if (!currentCharacter || !character) return;

    const newBackgrounds = character.backgrounds;
    newBackgrounds[selectedSlot] = null;

    const newCharacter: CharacterData = {
      ...character,
      backgrounds: newBackgrounds,
    };

    await saveCharacter(newCharacter);
    setCharacter(newCharacter);
    await updateBackground(currentCharacter);
  }

  function UploadedSlot() {
    return (
      <img
        src={
          backgroundURLs[selectedSlot]
            ? backgroundURLs[selectedSlot]
            : undefined
        }
        alt="Selected Background"
      />
    );
  }

  function EmptySlot() {
    return (
      <label className={style.empty}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleBackgroundUpload(e)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="800px"
          height="800px"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M5.00003 15.7468V18C5.00003 18.5523 5.44775 19 6.00003 19H12H18C18.5523 19 19 18.5523 19 18V15.7468"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.2023 5.91651L12.2023 14.4165"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.546 8.26682L12.2021 5L8.8583 8.26682"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Upload Image
      </label>
    );
  }

  return (
    <div className={global.verticalflex}>
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
        <div className={header.info}>
          <Switch
            checked={switchState}
            onChange={(checked) => handleBackgroundToggle(checked)}
          />
          <span>{`Character: ${currentCharacter?.name}`}</span>
          {character?.useBackground ? "" : <span>[DISABLED]</span>}
        </div>
      </div>
      <div className={global.divider}></div>
      <div className={style["bg-container"]}>
        <button
          onClick={() =>
            selectedSlot > 0 ? setSelectedSlot(selectedSlot - 1) : undefined
          }
        >{`<`}</button>
        <div className={style.mid}>
          {backgroundURLs[selectedSlot] ? <UploadedSlot /> : <EmptySlot />}
          <button
            className={style.delete}
            onClick={() => deleteSelectedBackground()}
          >
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
        <button
          onClick={() =>
            selectedSlot < 3 ? setSelectedSlot(selectedSlot + 1) : undefined
          }
        >{`>`}</button>
      </div>
      <span>{`Opacity: ${character?.backgroundOpacity ?? 100}%`}</span>
      <input
        type="range"
        min="0"
        max="100"
        className={global.slider}
        value={character?.backgroundOpacity ?? 100}
        onChange={(event) =>
          handleBackgroundOpacity(Number(event.target.value))
        }
      />
      <button
        className={`${style.apply} ${selectedSlot == character?.activeBackground || !backgroundURLs[selectedSlot] ? style.cantapply : ""}`}
        onClick={() => {
          backgroundURLs[selectedSlot]
            ? setActiveSlot(selectedSlot)
            : undefined;
        }}
      >
        {selectedSlot == character?.activeBackground
          ? "Selected image is active"
          : "Use this image"}
      </button>
    </div>
  );
}
