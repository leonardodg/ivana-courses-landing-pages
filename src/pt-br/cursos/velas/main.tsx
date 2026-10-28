import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CandlesBrApp from '../../../app/pages/CandlesBrApp.tsx';
import ConsentManager from '../../../app/components/ConsentManager.tsx';
import '../../../styles/index.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CandlesBrApp />
    <ConsentManager />
  </StrictMode>,
);
