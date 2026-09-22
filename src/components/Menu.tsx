import style from "../css/Menu.module.css";
import global from "../css/Global.module.css";
import ToolList from "./tabs/ToolList";
import { useSession } from "./../context/SessionContext";

import ImageReplacer from "./tabs/ImageReplacer";
import CustomBackground from "./tabs/CustomBackground";

export default function Menu() {
  const { tab, menuOpen, setMenuOpen } = useSession();

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
            {tab === 2 && "Custom Background"}
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
          {tab === 2 && <CustomBackground />}
        </div>
      </div>
    </div>
  );
}
