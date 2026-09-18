import style from "../../css/sections/ToolList.module.css";
import { useSession } from "../context/SessionContext";

export default function ToolList() {
  const { setTab } = useSession();

  return (
    <div className={style.list}>
      <button onClick={() => setTab(1)}>Image Replacer</button>
    </div>
  );
}
