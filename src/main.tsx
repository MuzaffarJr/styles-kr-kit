import { StrictMode, useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import "./tokens/tokens.css";
import { StudioHero } from "./sections/StudioHero";
import { WorkShowcase } from "./sections/WorkShowcase";
import { Playground } from "./pages/Playground";

// Minimal hash routing: "#playground" — sahna playground'i, qolgani — studio sahifasi.
function useHash() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("hashchange", cb);
      return () => window.removeEventListener("hashchange", cb);
    },
    () => window.location.hash,
    () => "",
  );
}

function App() {
  const hash = useHash();
  if (hash === "#playground") return <Playground />;
  return (
    <>
      <StudioHero />
      <main>
        <WorkShowcase />
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
