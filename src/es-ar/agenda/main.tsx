import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AgendaArApp from '../../app/pages/AgendaArApp.tsx';
import ConsentManager from '../../app/components/ConsentManager.tsx';
import '../../styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AgendaArApp />
    <ConsentManager />
  </StrictMode>,
);
