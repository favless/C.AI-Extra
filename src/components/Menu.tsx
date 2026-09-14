import React from "react";
import style from "../css/Menu.module.css";
import { useState } from "react";

type menuProps = {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Menu(props: menuProps) {
  const [tab, setTab] = useState(0);

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
        <div className={style.header}>
          <button onClick={() => setTab(0)}> &gt; Back</button>
          <span>{`Character: ${null}`}</span>
        </div>
        <span>Upload:</span>
        <input type="file" id="imgupload" />
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
