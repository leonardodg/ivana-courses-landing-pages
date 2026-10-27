import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CareerPageApp from '../../app/pages/CareerPageApp.tsx';
import ConsentManager from '../../app/components/ConsentManager.tsx';
import '../../styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CareerPageApp slug="macrame" />
    <ConsentManager />
  </StrictMode>,
);
