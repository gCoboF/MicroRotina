// Motor de acessibilidade: aplica os ajustes na página e oferece voz, som, vibração, flash e avisos.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useStore, type ColorFilter, type Settings } from './state';

// Correção de cor (daltonização): M = I + E·(I − S), S simula a deficiência e E desloca o erro para canais visíveis.
type M3 = number[][];
const SIM: Record<string, M3> = {
  protanopia: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
  deuteranopia: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]],
  tritanopia: [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]]
};
const SHIFT: Record<string, M3> = {
  protanopia: [[0, 0, 0], [0.7, 1, 0], [0.7, 0, 1]],
  deuteranopia: [[1, 0.7, 0], [0, 0, 0], [0, 0.7, 1]],
  tritanopia: [[1, 0, 0.7], [0, 1, 0.7], [0, 0, 0]]
};
const mul = (a: M3, b: M3) => a.map((r) => b[0].map((_, j) => r.reduce((s, v, k) => s + v * b[k][j], 0)));
function matrix(f: ColorFilter) {
  if (f === 'cinza') return '0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0';
  const S = SIM[f], E = SHIFT[f];
  const IminusS = S.map((r, i) => r.map((v, j) => (i === j ? 1 : 0) - v));
  const M = mul(E, IminusS).map((r, i) => r.map((v, j) => v + (i === j ? 1 : 0)));
  return M.map((r) => r.map((v) => v.toFixed(4)).join(' ') + ' 0 0').join('  ') + '  0 0 0 1 0';
}

export const FILTERS: [ColorFilter, string][] = [
  ['nenhum', 'Nenhum'], ['protanopia', 'Protanopia (vermelho)'], ['deuteranopia', 'Deuteranopia (verde)'],
  ['tritanopia', 'Tritanopia (azul)'], ['cinza', 'Tons de cinza']
];

function applySettings(st: Settings) {
  const h = document.documentElement;
  h.lang = st.lang;
  h.dataset.theme = st.theme;
  h.dataset.size = st.textSize;
  h.classList.toggle('contrast', st.highContrast);
  h.classList.toggle('easy-font', st.easyFont);
  h.classList.toggle('bold', st.bold);
  h.classList.toggle('wide', st.wideSpacing);
  h.classList.toggle('low-stim', st.lowStimulus);
  h.classList.toggle('invert', st.invert);
  const f: string[] = [];
  if (st.invert) f.push('invert(1) hue-rotate(180deg)');
  if (st.dimWhite) f.push('brightness(0.86)');
  if (st.colorFilter !== 'nenhum') f.push('url(#filtro-cor)');
  h.style.setProperty('--page-filter', f.join(' ') || 'none');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', st.theme === 'escuro' ? '#121218' : '#4338CA');
}

interface Toast { id: number; text: string; undo?: () => void }
interface A11y {
  say: (text: string, opts?: { toast?: boolean; undo?: () => void }) => void;
  done: (text: string) => void;
  alert: (text: string, channels: string[]) => void;
  voices: SpeechSynthesisVoice[];
  speakNow: (text: string) => void;
}
const Ctx = createContext<A11y | null>(null);
export const useA11y = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('A11yProvider ausente');
  return c;
};

let audio: AudioContext | null = null;
function chime() {
  try {
    audio = audio || new AudioContext();
    const t = audio.currentTime;
    [[660, 0], [880, 0.12]].forEach(([f, d]) => {
      const o = audio!.createOscillator(), g = audio!.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + d);
      g.gain.exponentialRampToValueAtTime(0.18, t + d + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.45);
      o.connect(g).connect(audio!.destination);
      o.start(t + d); o.stop(t + d + 0.5);
    });
  } catch { /* sem áudio */ }
}

export function A11yProvider({ children }: { children: ReactNode }) {
  const { s } = useStore();
  const st = s.settings;
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [live, setLive] = useState('');
  const [flash, setFlash] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const nextId = useRef(1);
  const stRef = useRef(st);
  stRef.current = st;

  useEffect(() => applySettings(st), [st]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const load = () => setVoices(speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('pt')));
    load();
    speechSynthesis.addEventListener('voiceschanged', load);
    return () => speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);

  const speakNow = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR';
    u.rate = stRef.current.rate;
    const v = speechSynthesis.getVoices().find((x) => x.voiceURI === stRef.current.voice);
    if (v) u.voice = v;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }, []);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const say = useCallback<A11y['say']>((text, opts) => {
    setLive(''); setTimeout(() => setLive(text), 30);
    if (stRef.current.speak) speakNow(text);
    if (opts?.toast === false) return;
    const id = nextId.current++;
    setToasts([{ id, text, undo: opts?.undo }]);
    if (!stRef.current.noTimeouts) setTimeout(() => dismiss(id), opts?.undo ? 10000 : 4000);
  }, [dismiss, speakNow]);

  const done = useCallback((text: string) => {
    if (stRef.current.soundOnDone) chime();
    if (stRef.current.vibrateOnDone && 'vibrate' in navigator) navigator.vibrate([40, 60, 40]);
    say(text, { toast: false });
  }, [say]);

  const alert = useCallback((text: string, channels: string[]) => {
    if (channels.includes('vibrar') && 'vibrate' in navigator) navigator.vibrate([200, 100, 200]);
    if (channels.includes('som')) chime();
    if (channels.includes('voz')) speakNow(text);
    if (channels.includes('flash')) { setFlash(true); setTimeout(() => setFlash(false), 900); }
    if (channels.includes('tela') || channels.length === 0) say(text);
    else { setLive(''); setTimeout(() => setLive(text), 30); }
  }, [say, speakNow]);

  return (
    <Ctx.Provider value={{ say, done, alert, voices, speakNow }}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <filter id="filtro-cor" colorInterpolationFilters="linearRGB">
          <feColorMatrix type="matrix" values={matrix(st.colorFilter === 'nenhum' ? 'cinza' : st.colorFilter)} />
        </filter>
      </svg>
      {children}
      <div className="sr-only" role="status" aria-live="polite">{live}</div>
      <div className="toasts" role="region" aria-label="Avisos">
        {toasts.map((t) => (
          <div className="toast" key={t.id}>
            <span>{t.text}</span>
            {t.undo && <button className="toast-btn" onClick={() => { t.undo!(); dismiss(t.id); }}>Desfazer</button>}
            {(st.noTimeouts || t.undo) && <button className="toast-x" onClick={() => dismiss(t.id)} aria-label="Fechar aviso">×</button>}
          </div>
        ))}
      </div>
      {flash && <div className="flash" aria-hidden="true" />}
    </Ctx.Provider>
  );
}
