import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LegalApp from '../../app/pages/LegalApp.tsx';
import ConsentManager from '../../app/components/ConsentManager.tsx';
import '../../styles/index.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LegalApp doc="reembolso" language="es" />
    <ConsentManager />
  </StrictMode>,
);
