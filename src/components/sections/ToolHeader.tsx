import { useSession } from "../context/SessionContext";
import style from "../../css/sections/ToolHeader.module.css";
import global from "../../css/Global.module.css";

export default function ToolHeader() {
  const { currentCharacter, setTab } = useSession();

  return (
    <>
      <div className={style.header}>
        <button onClick={() => setTab(0)}>
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
        <span>{`Character: ${currentCharacter?.name ?? "None"}`}</span>
      </div>
      <div className={global.divider}></div>
    </>
  );
}
