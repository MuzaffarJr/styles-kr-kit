import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tokens/tokens.css";
import { StudioHero } from "./sections/StudioHero";
import { WorkShowcase } from "./sections/WorkShowcase";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StudioHero />
    <main>
      <WorkShowcase />
    </main>
  </StrictMode>,
);
