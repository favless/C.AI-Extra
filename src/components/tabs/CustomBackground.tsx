import { useEffect, useState } from "react";
import { useSession } from "../../context/SessionContext";
import style from "../../css/sections/CustomBackground.module.css";
import header from "../../css/sections/ToolHeader.module.css";
import global from "../../css/Global.module.css";

import { loadCharacter, saveCharacter } from "../../utils/database";
import { reloadImageReplacements } from "../../utils/imageReplacement";
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

    loadCharacter(currentCharacter.href).then((character) => {
      setCharacter(character);
    });
  }, [currentCharacter]);

  // HANDLE ACTIVE BACKGROUND CHANGE
  useEffect(() => {
    if (!character) return;

    if (character.activeImage === activeSlot) return;

    const newCharacter = {
      ...character,
      activeBackground: activeSlot,
    };

    saveCharacter(newCharacter);
    setCharacter(newCharacter);

    updateBackground(currentCharacter);
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
    reloadImageReplacements();

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

    updateBackground(currentCharacter);

    console.log(`Image saved to slot ${selectedSlot}!`);
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
        <div className={style.info}>
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
        {backgroundURLs[selectedSlot] ? <UploadedSlot /> : <EmptySlot />}
        <button
          onClick={() =>
            selectedSlot < 3 ? setSelectedSlot(selectedSlot + 1) : undefined
          }
        >{`>`}</button>
      </div>
      <button
        className={`${style.apply} ${selectedSlot == character?.activeBackground ? style.cantapply : ""}`}
        onClick={() => {
          setActiveSlot(selectedSlot);
        }}
      >
        {selectedSlot == character?.activeBackground
          ? "Selected image is active"
          : "Use this image"}
      </button>
    </div>
  );
}
