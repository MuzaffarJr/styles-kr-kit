import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tokens/tokens.css";
import { StudioHero } from "./sections/StudioHero";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StudioHero />
  </StrictMode>,
);
