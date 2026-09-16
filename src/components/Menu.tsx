import React from "react";
import style from "../css/Menu.module.css";
import { useState } from "react";

import { useEffect } from "react";
import {
  getCurrentCharacter,
  reloadImageReplacements,
} from "../utils/character";
import { saveCharacter } from "../utils/database";

type menuProps = {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Menu(props: menuProps) {
  const [tab, setTab] = useState(0);

  const [character, setCharacter] = useState<{
    href: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    getCurrentCharacter().then((character) => {
      setCharacter(character);
    });
  }, []);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !character) {
      return;
    }

    //TODO change this later to take activeImage from selected and properly handle the img array
    await saveCharacter({
      href: character.href,
      name: character.name,
      images: [file],
      activeImage: 0,
    });

    reloadImageReplacements();

    console.log("Image saved!");
  }

  function ToolHeader() {
    return (
      <div className={style.header}>
        <button onClick={() => setTab(0)}> &gt; Back</button>
        <span>{`Character: ${character?.name ?? "None"}`}</span>
      </div>
    );
  }

  // tab 0
  function ToolList() {
    return (
      <div className={style.list}>
        <button onClick={() => setTab(1)}>Image Replacer</button>
        <button>Info Replacer</button>
        <button>Custom Appearance</button>
      </div>
    );
  }

  // tab 1
  function ImageReplacer() {
    return (
      <div>
        <ToolHeader />
        <span>Upload:</span>
        <input
          type="file"
          id="imgupload"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
    );
  }

  return (
    <div className={style.container}>
      <div className={style.menu}>
        <div className={style.header}>
          <h2>
            {tab === 0 && "Tool Menu"}
            {tab === 1 && "Image Replacer"}
          </h2>
          <button
            className={style.close}
            onClick={() => props.setMenuOpen(false)}
          >
            x
          </button>
        </div>

        <div>
          {tab === 0 && <ToolList />}
          {tab === 1 && <ImageReplacer />}
        </div>
      </div>
    </div>
  );
}
