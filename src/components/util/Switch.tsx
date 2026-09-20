import style from "../../css/util/Switch.module.css";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function Switch({ checked, onChange }: SwitchProps) {
  return (
    <button
      className={`${style.switch} ${checked && style.switchOn}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      <span className={style.thumb} />
    </button>
  );
}
