import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AgendaApp from "../app/pages/AgendaApp.tsx";
import "../styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AgendaApp />
  </StrictMode>,
);
