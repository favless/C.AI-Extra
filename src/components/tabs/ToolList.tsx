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
        Image Replacer
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
        Custom Background
        {!currentCharacter && <NoCharacterLabel />}
      </button>
    </div>
  );
}
