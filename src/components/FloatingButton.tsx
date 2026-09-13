import style from "../css/FloatingButton.module.css";
import { useState, useEffect, useRef } from "react";

export default function FloatingButton() {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({
    x: 20,
    y: 20,
  });

  const dragOffset = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setPosition((currentPosition) => ({
        x: Math.max(0, Math.min(currentPosition.x, window.innerWidth - 60)),
        y: Math.max(0, Math.min(currentPosition.y, window.innerHeight - 60)),
      }));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!dragging) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      setPosition({
        x: event.clientX - dragOffset.current.x,
        y: event.clientY - dragOffset.current.y,
      });
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <button
      className={style.button}
      style={{ left: position.x, top: position.y }}
      onMouseDown={(event) => {
        setDragging(true);

        dragOffset.current = {
          x: event.clientX - position.x,
          y: event.clientY - position.y,
        };
      }}
      onMouseUp={() => setDragging(false)}
    >
      🛠
    </button>
  );
}
