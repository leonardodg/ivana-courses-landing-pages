import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ThemePageApp from '../../../app/pages/ThemePageApp.tsx';
import ConsentManager from '../../../app/components/ConsentManager.tsx';
import '../../../styles/index.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemePageApp themeId="aromas" />
    <ConsentManager />
  </StrictMode>,
);
