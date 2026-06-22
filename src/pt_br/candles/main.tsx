import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CandlesApp from '../../app/components/candles/CandlesApp.tsx';
import '../../styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CandlesApp />
  </StrictMode>,
);
