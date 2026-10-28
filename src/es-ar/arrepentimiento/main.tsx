import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ArrepentimientoApp from '../../app/pages/ArrepentimientoApp.tsx';
import ConsentManager from '../../app/components/ConsentManager.tsx';
import '../../styles/index.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ArrepentimientoApp />
    <ConsentManager />
  </StrictMode>,
);
