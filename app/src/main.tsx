import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './state';
import { A11yProvider } from './a11y';
import App from './App';
// fontes guardadas no próprio app: nenhuma requisição para fora (RNF03)
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/source-sans-3/700.css';
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
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
