// Estado do app: tudo fica no aparelho (localStorage). Nada é enviado para fora.
import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';

export type TextSize = 'normal' | 'grande' | 'maior';
export type Theme = 'claro' | 'creme' | 'escuro';
export type ColorFilter = 'nenhum' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'cinza';
export type Energy = 'alta' | 'cansado' | 'esgotado' | 'pulou';

export interface Settings {
  textSize: TextSize;
  easyFont: boolean;
  bold: boolean;
  wideSpacing: boolean;
  highContrast: boolean;
  theme: Theme;
  invert: boolean;
  dimWhite: boolean;
  colorFilter: ColorFilter;
  lowStimulus: boolean;
  noTimeouts: boolean;
  speak: boolean;
  voice: string;
  rate: number;
  soundOnDone: boolean;
  vibrateOnDone: boolean;
  lang: 'pt-BR';
}

export type Channel = 'vibrar' | 'tela' | 'som' | 'voz' | 'flash';

export interface Habit {
  id: string;
  name: string;
  minutes: number;
  rel: 'antes' | 'depois' | 'hora';
  anchor: string;
  time: string;
  essential: boolean;
  parts: { goal: number; step: number; unit: string } | null;
  reminder: { on: boolean; channels: Channel[] };
  paused: boolean;
  easyVersion: string;
}

export interface AppState {
  onboarded: boolean;
  nickname: string;
  pin: string | null;
  settings: Settings;
  habits: Habit[];
  log: Record<string, Record<string, number>>;
  energy: Record<string, Energy>;
  rest: Record<string, boolean>;
  syncOn: boolean;
  draft: Partial<Habit> | null;
}

export const DEFAULT_SETTINGS: Settings = {
  textSize: 'normal', easyFont: false, bold: false, wideSpacing: false, highContrast: false, theme: 'claro',
  invert: false, dimWhite: false, colorFilter: 'nenhum', lowStimulus: false, noTimeouts: false,
  speak: false, voice: '', rate: 1, soundOnDone: false, vibrateOnDone: false, lang: 'pt-BR'
};

export const EMPTY: AppState = {
  onboarded: false, nickname: '', pin: null, settings: DEFAULT_SETTINGS, habits: [], log: {}, energy: {}, rest: {}, syncOn: false, draft: null
};

const KEY = 'microrotina:v1';

export const today = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};
export const addDays = (iso: string, n: number) => {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return today(d);
};
export const uid = () => Math.random().toString(36).slice(2, 10);

export const newHabit = (p: Partial<Habit>): Habit => ({
  id: uid(), name: '', minutes: 2, rel: 'depois', anchor: 'Almoçar', time: '13:30', essential: false, parts: null,
  reminder: { on: false, channels: [] }, paused: false, easyVersion: '', ...p
});

// progresso de um hábito num dia: 0 a 1
export const progressOf = (s: AppState, h: Habit, day: string) => {
  const v = s.log[day]?.[h.id] || 0;
  return h.parts ? Math.min(1, v / h.parts.goal) : Math.min(1, v);
};
export const isDone = (s: AppState, h: Habit, day: string) => progressOf(s, h, day) >= 1;
// dia praticado: qualquer parte de qualquer hábito conta
export const practiced = (s: AppState, day: string) => Object.values(s.log[day] || {}).some((v) => v > 0);
export const daysPracticed = (s: AppState) => Object.keys(s.log).filter((d) => practiced(s, d)).length;

export type Action =
  | { type: 'set'; patch: Partial<AppState> }
  | { type: 'settings'; patch: Partial<Settings> }
  | { type: 'log'; day: string; id: string; value: number }
  | { type: 'habit'; habit: Habit }
  | { type: 'removeHabit'; id: string }
  | { type: 'reset' }
  | { type: 'load'; state: AppState };

function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case 'set': return { ...s, ...a.patch };
    case 'settings': return { ...s, settings: { ...s.settings, ...a.patch } };
    case 'log': {
      const day = { ...(s.log[a.day] || {}) };
      if (a.value <= 0) delete day[a.id]; else day[a.id] = a.value;
      return { ...s, log: { ...s.log, [a.day]: day } };
    }
    case 'habit': {
      const exists = s.habits.some((h) => h.id === a.habit.id);
      return { ...s, habits: exists ? s.habits.map((h) => (h.id === a.habit.id ? a.habit : h)) : [...s.habits, a.habit] };
    }
    case 'removeHabit': return { ...s, habits: s.habits.filter((h) => h.id !== a.id) };
    case 'reset': return EMPTY;
    case 'load': return a.state;
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw);
    return { ...EMPTY, ...p, settings: { ...DEFAULT_SETTINGS, ...(p.settings || {}) } };
  } catch {
    return EMPTY;
  }
}

const Ctx = createContext<{ s: AppState; dispatch: (a: Action) => void } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* armazenamento indisponível */ }
  }, [s]);
  return <Ctx.Provider value={{ s, dispatch }}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('StoreProvider ausente');
  return c;
};

export const storedBytes = (s: AppState) => new Blob([JSON.stringify(s)]).size;

// dados de exemplo: a Ana, com 46 dias de histórico, para ver o app como no protótipo
export function exampleState(): AppState {
  const habits = [
    newHabit({ name: 'Arrumar a cama', minutes: 2, rel: 'depois', anchor: 'Acordar', time: '07:00', essential: true, easyVersion: 'Esticar só o lençol' }),
    newHabit({ name: 'Ler 1 página', minutes: 3, rel: 'depois', anchor: 'Tomar café', time: '08:30', essential: true, easyVersion: 'Ler só 1 frase', reminder: { on: true, channels: ['vibrar', 'tela'] } }),
    newHabit({ name: 'Alongar o pescoço', minutes: 2, rel: 'depois', anchor: 'Almoçar', time: '15:00' }),
    newHabit({ name: 'Beber água', minutes: 1, rel: 'hora', anchor: '', time: '11:00', essential: true, parts: { goal: 1000, step: 250, unit: 'ml' } }),
    newHabit({ name: 'Respirar fundo 5 vezes', minutes: 1, rel: 'antes', anchor: 'Dormir', time: '22:00' })
  ];
  const log: AppState['log'] = {};
  const t = today();
  const rest: Record<string, boolean> = {};
  for (let i = 1; i <= 52; i++) {
    const d = addDays(t, -i);
    if (i % 9 === 4 || i % 13 === 0) { rest[d] = true; continue; }
    log[d] = {};
    habits.forEach((h, k) => { if ((i + k) % 3 !== 0) log[d][h.id] = h.parts ? h.parts.goal : 1; });
    log[d][habits[1].id] = 1;
  }
  log[t] = { [habits[0].id]: 1, [habits[1].id]: 1, [habits[2].id]: 1, [habits[3].id]: 500 };
  return { ...EMPTY, onboarded: true, nickname: 'Ana', habits, log, rest };
}
