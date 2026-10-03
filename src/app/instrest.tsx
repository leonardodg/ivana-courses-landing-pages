import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import InstrestApp from "./pages/InstrestApp.tsx";
import '../styles/index.css';


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InstrestApp />
  </StrictMode>,
);
