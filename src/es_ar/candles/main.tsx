import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CandlesArApp from '../../app/components/candles-ar/CandlesArApp.tsx';
import '../../styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CandlesArApp />
  </StrictMode>,
);
