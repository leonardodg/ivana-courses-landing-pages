import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import OnlineCoursePageApp from '../../../../app/pages/OnlineCoursePageApp.tsx';
import ConsentManager from '../../../../app/components/ConsentManager.tsx';
import '../../../../styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OnlineCoursePageApp slug="velas" />
    <ConsentManager />
  </StrictMode>,
);
