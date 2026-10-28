import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CareerHomeApp from '../app/pages/CareerHomeApp.tsx';
import ConsentManager from '../app/components/ConsentManager.tsx';
import '../styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CareerHomeApp />
    <ConsentManager />
  </StrictMode>,
);
