import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import InterestApp from '../../app/pages/InterestApp.tsx';
import ConsentManager from '../../app/components/ConsentManager.tsx';
import '../../styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InterestApp country="AR" />
    <ConsentManager />
  </StrictMode>,
);
