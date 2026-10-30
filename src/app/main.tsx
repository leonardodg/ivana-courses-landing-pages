import App from './App.tsx';
import { mount } from './lib/mount.tsx';
import '../styles/index.css';

// Debug: print VITE env variables at page load (temporary)
// console.log('DEBUG VITE_WEBHOOK_URL:', import.meta.env.VITE_WEBHOOK_URL);

mount(
  <App />
);
