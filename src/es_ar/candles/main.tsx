import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CandlesArApp from '../../app/pages/CandlesArApp.tsx';
import ConsentManager from '../../app/components/ConsentManager.tsx';
import '../../styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CandlesArApp />
    <ConsentManager />
  </StrictMode>,
);
