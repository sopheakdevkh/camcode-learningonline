import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('preload');
  });
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

