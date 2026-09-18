import { useSession } from "../context/SessionContext";
import { saveCharacter } from "../../utils/database";
import { reloadImageReplacements } from "../../utils/character";

import ToolHeader from "../sections/ToolHeader";

export default function ImageReplacer() {
  const { currentCharacter } = useSession();

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !currentCharacter) {
      return;
    }

    //TODO change this later to take activeImage from selected and properly handle the img array
    await saveCharacter({
      href: currentCharacter?.href,
      name: currentCharacter?.name,
      images: [file],
      activeImage: 0,
    });

    reloadImageReplacements();

    console.log("Image saved!");
  }

  return (
    <div>
      <ToolHeader />
      <span>Upload:</span>
      <input
        type="file"
        id="imgupload"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
}
