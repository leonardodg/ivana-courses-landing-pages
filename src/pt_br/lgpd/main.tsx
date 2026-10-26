import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LgpdApp from '../../app/pages/LgpdApp.tsx';
import ConsentManager from '../../app/components/ConsentManager.tsx';
import '../../styles/index.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LgpdApp />
    <ConsentManager />
  </StrictMode>,
);
