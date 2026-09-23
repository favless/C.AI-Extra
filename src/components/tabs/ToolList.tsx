import style from "../../css/sections/ToolList.module.css";
import { useSession } from "../../context/SessionContext";

export default function ToolList() {
  const { setTab, currentCharacter } = useSession();

  function NoCharacterLabel() {
    return (
      <span
        className={style.warning}
      >{`[ Open a chat to use this tool ]`}</span>
    );
  }

  return (
    <div className={style.list}>
      <button
        onClick={() => {
          if (currentCharacter) {
            setTab(1);
          }
        }}
        style={
          currentCharacter
            ? undefined
            : { cursor: "not-allowed", opacity: "0.7" }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="800px"
          height="800px"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M9 9.5V7.5C9 5.84315 10.3431 4.5 12 4.5C13.6569 4.5 15 5.84315 15 7.5V9.5C15 10.6104 14.3967 11.5799 13.5 12.0987V13.323C13.5 13.7319 13.749 14.0996 14.1286 14.2514L16.1788 15.0715C17.5807 15.6323 18.5 16.9901 18.5 18.5H5.5C5.5 16.9901 6.41927 15.6323 7.82119 15.0715L9.87139 14.2514C10.251 14.0996 10.5 13.7319 10.5 13.323V12.0987C9.6033 11.5799 9 10.6104 9 9.5Z"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Icon Replacer
        {!currentCharacter && <NoCharacterLabel />}
      </button>
      <button
        onClick={() => {
          if (currentCharacter) {
            setTab(2);
          }
        }}
        style={
          currentCharacter
            ? undefined
            : { cursor: "not-allowed", opacity: "0.7" }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="800px"
          height="800px"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect
            x="5.5"
            y="5.5"
            width="13"
            height="13"
            rx="1"
            stroke="#000000"
          />
          <circle cx="9.5" cy="9.5" r="1" stroke="#000000" />
          <path
            d="M8 16L9.5 13.5L11 16L13.5 12L16 16"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Custom Background
        {!currentCharacter && <NoCharacterLabel />}
      </button>
    </div>
  );
}
