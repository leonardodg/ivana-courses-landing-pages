import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CountrySelectApp from './pages/CountrySelectApp.tsx';
import ConsentManager from './components/ConsentManager.tsx';
import '../styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CountrySelectApp />
    <ConsentManager />
  </StrictMode>,
);
