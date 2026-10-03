import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import '../styles/index.css';

// Debug: print VITE env variables at page load (temporary)
// console.log('DEBUG VITE_WEBHOOK_URL:', import.meta.env.VITE_WEBHOOK_URL);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
