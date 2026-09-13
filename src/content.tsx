import React from "react";
import { createRoot } from "react-dom/client";
import FloatingButton from "./components/FloatingButton";

console.log("C.AI Extra loaded!");

const container = document.createElement("div");

document.body.appendChild(container);

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <FloatingButton />
  </React.StrictMode>,
);
