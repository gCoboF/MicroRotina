// Rotas por hash (#/hoje, #/habito/abc): o botão voltar do navegador e do celular funcionam.
import { useEffect, useState } from 'react';

const read = () => (location.hash.replace(/^#\/?/, '') || '').split('/').filter(Boolean);
let depth = 0;

export function useRoute() {
  const [r, setR] = useState(read);
  useEffect(() => {
    const on = () => {
      setR(read());
      window.scrollTo(0, 0);
      // leva o foco ao título da nova tela, para leitor de tela e teclado
      requestAnimationFrame(() => (document.querySelector('h1') as HTMLElement | null)?.focus({ preventScroll: true }));
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return r;
}

export const go = (path: string) => { depth++; location.hash = '/' + path; };
export const replace = (path: string) => {
  history.replaceState(null, '', '#/' + path);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
};
export const back = (fallback = 'hoje') => {
  if (depth > 0) { depth--; history.back(); } else replace(fallback);
};
