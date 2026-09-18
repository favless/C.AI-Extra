import style from "../css/Menu.module.css";
import global from "../css/Global.module.css";
import ToolList from "./tabs/ToolList";

import { useEffect } from "react";
import { getCurrentCharacter } from "../utils/character";
import { useSession } from "./context/SessionContext";

import ImageReplacer from "./tabs/ImageReplacer";

export default function Menu() {
  const { tab, setCurrentCharacter, menuOpen, setMenuOpen } = useSession();

  useEffect(() => {
    getCurrentCharacter().then((character) => {
      setCurrentCharacter(character);
    });
  }, []);

  return (
    <div
      className={style.container}
      style={
        menuOpen
          ? { opacity: "1", pointerEvents: "auto" }
          : { opacity: "0", pointerEvents: "none" }
      }
    >
      <div
        className={style.menu}
        style={menuOpen ? { opacity: "1" } : { opacity: "0" }}
      >
        <div className={style.header}>
          <h2>
            {tab === 0 && "Charrium"}
            {tab === 1 && "Image Replacer"}
          </h2>
          <button className={style.close} onClick={() => setMenuOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="800px"
              height="800px"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M6 6L18 18" stroke="#000000" stroke-linecap="round" />
              <path
                d="M18 6L6.00001 18"
                stroke="#000000"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
        <div className={global.divider}></div>

        <div>
          {tab === 0 && <ToolList />}
          {tab === 1 && <ImageReplacer />}
        </div>
      </div>
    </div>
  );
}
