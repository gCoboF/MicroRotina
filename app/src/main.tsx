import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './state';
import { A11yProvider } from './a11y';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <A11yProvider>
        <App />
      </A11yProvider>
    </StoreProvider>
  </StrictMode>
);
