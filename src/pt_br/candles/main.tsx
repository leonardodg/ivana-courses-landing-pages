import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CandlesBrApp from '../../app/pages/CandlesBrApp.tsx';
import '../../styles/index.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CandlesBrApp />
  </StrictMode>,
);
