import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// HashRouter (URLs like index.html#/map) works both from a server and when the
// built file is opened straight from the disk.
import { HashRouter as BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ProgressProvider } from './state/ProgressContext';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </BrowserRouter>
  </StrictMode>,
);
