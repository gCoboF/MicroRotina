// Componentes de interface: todos com nome acessível, alvo de toque ≥ 48 px e foco visível.
import { useId, type ReactNode } from 'react';
import { ICONS, NUVI_SVG, NUVI_MOODS, type Mood } from './art';
import { back as goBack, go } from './router';

export function Icon({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"
      dangerouslySetInnerHTML={{ __html: ICONS[name] || '' }} />
  );
}

export function Nuvi({ mood, size = 96, float = false, decorative = true }: { mood: Mood; size?: number; float?: boolean; decorative?: boolean }) {
  return (
    <span className={'nuvi' + (float ? ' float' : '')} style={{ width: size, height: size }}
      role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : 'Nuvi, ' + NUVI_MOODS[mood]}
      aria-hidden={decorative ? true : undefined} dangerouslySetInnerHTML={{ __html: NUVI_SVG[mood] }} />
  );
}

export function Screen({ title, back, children, nav, big = false, fallback, className = '', hideTitle = false }: {
  title: string; back?: boolean; children: ReactNode; nav?: string; big?: boolean; fallback?: string; className?: string; hideTitle?: boolean;
}) {
  return (
    <div className={'screen ' + className}>
      <header className="top">
        {back && (
          <button className="icon-btn" onClick={() => goBack(fallback)} aria-label="Voltar">
            <Icon name="back" />
          </button>
        )}
        <h1 tabIndex={-1} className={(big ? 'big' : '') + (hideTitle ? ' sr-only' : '')}>{title}</h1>
      </header>
      <main className="content">{children}</main>
      {nav && <BottomNav active={nav} />}
    </div>
  );
}

export function Button({ children, kind = 'primary', onClick, icon, to, disabled, label }: {
  children: ReactNode; kind?: 'primary' | 'secondary' | 'text' | 'danger'; onClick?: () => void; icon?: string; to?: string;
  disabled?: boolean; label?: string;
}) {
  return (
    <button className={'btn ' + kind} disabled={disabled} aria-label={label}
      onClick={() => { onClick?.(); if (to) go(to); }}>
      {icon && <Icon name={icon} size={20} />}
      <span>{children}</span>
    </button>
  );
}

export function Card({ children, soft = false, className = '' }: { children: ReactNode; soft?: boolean; className?: string }) {
  return <div className={'card' + (soft ? ' soft' : '') + (className ? ' ' + className : '')}>{children}</div>;
}

// linha de lista que abre outra tela
export function LinkRow({ icon, title, sub, to, onClick }: { icon?: string; title: string; sub?: string; to?: string; onClick?: () => void }) {
  return (
    <button className="row" onClick={() => { onClick?.(); if (to) go(to); }}>
      {icon && <Icon name={icon} />}
      <span className="row-text"><span className="row-title">{title}</span>{sub && <span className="row-sub">{sub}</span>}</span>
      <Icon name="chevron" size={20} />
    </button>
  );
}

// chave liga/desliga (role="switch")
export function ToggleRow({ icon, title, sub, on, onChange }: { icon?: string; title: string; sub?: string; on: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <button className="row" role="switch" aria-checked={on} aria-describedby={sub ? id : undefined} onClick={() => onChange(!on)}>
      {icon && <Icon name={icon} />}
      <span className="row-text">
        <span className="row-title">{title}</span>
        <span className="row-sub" id={id}>{on ? 'Ligado' : 'Desligado'}{sub ? ' · ' + sub : ''}</span>
      </span>
      <span className={'switch' + (on ? ' on' : '')} aria-hidden="true"><span /></span>
    </button>
  );
}

// grupo de opções exclusivas (radio)
export function Choice<T extends string | number>({ legend, value, options, onChange, columns = false }: {
  legend: string; value: T; options: [T, string, ReactNode?][]; onChange: (v: T) => void; columns?: boolean;
}) {
  const name = useId();
  return (
    <fieldset className={'choice' + (columns ? ' cols' : '')}>
      <legend>{legend}</legend>
      {options.map(([v, label, extra]) => (
        <label key={String(v)} className={'opt' + (v === value ? ' sel' : '')}>
          <input type="radio" name={name} checked={v === value} onChange={() => onChange(v)} />
          {extra}
          <span>{label}</span>
          {v === value && <span className="opt-check" aria-hidden="true"><Icon name="check" size={18} /></span>}
        </label>
      ))}
    </fieldset>
  );
}

export function List({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <section className="list-wrap" aria-label={label}>
      {label && <h2 className="section">{label}</h2>}
      <div className="list">{children}</div>
    </section>
  );
}

export function BottomNav({ active }: { active: string }) {
  const tabs: [string, string, string][] = [['hoje', 'Hoje', 'home'], ['habitos', 'Hábitos', 'calendar'], ['progresso', 'Progresso', 'chart'], ['ajustes', 'Ajustes', 'sliders']];
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {tabs.map(([to, label, icon]) => (
        <a key={to} href={'#/' + to} className={'tab' + (active === to ? ' on' : '')} aria-current={active === to ? 'page' : undefined}>
          <Icon name={icon} />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}

export function Field({ label, value, onChange, max, hint, autoFocus, inputMode, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; max?: number; hint?: string; autoFocus?: boolean;
  inputMode?: 'text' | 'numeric'; type?: string;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="field-box">
        <input id={id} type={type} value={value} maxLength={max} autoFocus={autoFocus} inputMode={inputMode}
          aria-describedby={hint ? id + 'h' : undefined} onChange={(e) => onChange(e.target.value)} />
        {max && <span className="count" aria-hidden="true">{value.length}/{max}</span>}
      </div>
      {hint && <p className="hint" id={id + 'h'}>{hint}</p>}
    </div>
  );
}

export function Steps({ n }: { n: number }) {
  return (
    <div className="steps">
      <p className="step-label">Passo {n} de 3</p>
      <div className="step-bar" role="progressbar" aria-label="Progresso da criação" aria-valuemin={1} aria-valuemax={3} aria-valuenow={n}>
        {[1, 2, 3].map((i) => <span key={i} className={i <= n ? 'on' : ''} />)}
      </div>
    </div>
  );
}

export function Bar({ value, label }: { value: number; label: string }) {
  return (
    <div className="bar" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}>
      <span style={{ width: Math.round(value * 100) + '%' }} />
    </div>
  );
}
