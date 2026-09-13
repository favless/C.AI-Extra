import style from "../css/FloatingButton.module.css";
import { useState, useEffect, useRef } from "react";

export default function FloatingButton() {
  const [dragging, setDragging] = useState(false);
  const dragTimer = useRef<number | null>(null);
  const didDrag = useRef(false);

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
    const handleMouseUp = () => {
      if (dragTimer.current !== null) {
        clearTimeout(dragTimer.current);
        dragTimer.current = null;
      }

      setDragging(false);
    };

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

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

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [dragging]);

  return (
    <button
      className={style.button}
      style={{ left: position.x, top: position.y }}
      onMouseDown={(event) => {
        didDrag.current = false;
        dragTimer.current = window.setTimeout(() => {
          didDrag.current = true;
          setDragging(true);

          dragOffset.current = {
            x: event.clientX - position.x,
            y: event.clientY - position.y,
          };
        }, 350);
      }}
      onClick={() => {
        if (!didDrag.current) {
          console.log("menu opened");
        }
      }}
    >
      🛠
    </button>
  );
}
