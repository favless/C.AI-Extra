import React from "react";
import style from "../css/Menu.module.css";

type menuProps = {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Menu(props: menuProps) {
  return (
    <div className={style.container}>
      <div className={style.menu}>
        <h2>cai-extra</h2>
        <button onClick={() => props.setMenuOpen(false)}>close</button>

        <button>Image Replacer</button>
      </div>
    </div>
  );
}
