import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CareerInterestApp from '../../app/pages/CareerInterestApp.tsx';
import ConsentManager from '../../app/components/ConsentManager.tsx';
import '../../styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CareerInterestApp />
    <ConsentManager />
  </StrictMode>,
);
