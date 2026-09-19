import style from "../../css/sections/ImageReplacer.module.css";
import type { CharacterData } from "../../types/CharacterTypes";

type slotProps = {
  character: CharacterData | null;
  ownSlot: number;
  handleImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    slot: number,
  ) => void;
  selectedSlot: number;
  setSelectedSlot: React.Dispatch<React.SetStateAction<number>>;
  imageURLs: (string | null)[];
};

export default function ImageSlot(props: slotProps) {
  return (
    <div className={style["image-slot"]}>
      <label
        className={style.empty}
        style={{
          display: props.character?.images[props.ownSlot] ? "none" : "flex",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => props.handleImageUpload(e, props.ownSlot)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="800px"
          height="800px"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M5.00003 15.7468V18C5.00003 18.5523 5.44775 19 6.00003 19H12H18C18.5523 19 19 18.5523 19 18V15.7468"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.2023 5.91651L12.2023 14.4165"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.546 8.26682L12.2021 5L8.8583 8.26682"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Upload Image
      </label>
      <button
        className={style.uploaded}
        style={{
          display: props.character?.images[props.ownSlot] ? "flex" : "none",
          borderColor:
            props.selectedSlot == props.ownSlot
              ? "var(--muted-foreground)"
              : undefined,
        }}
        onClick={() => props.setSelectedSlot(props.ownSlot)}
      >
        <img
          src={props.imageURLs[props.ownSlot] ?? undefined}
          alt="Character Image"
        />
      </button>
    </div>
  );
}
