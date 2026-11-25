// Dia a dia: check-in de energia, Hoje, água em partes, conclusão, Tudo feito, Dia Difícil e Descanso.
import { useState } from 'react';
import { daysPracticed, isDone, progressOf, today, useStore, type Energy, type Habit } from '../state';
import { go, replace } from '../router';
import { Bar, Button, Card, Icon, Nuvi, Screen } from '../ui';
import { useA11y } from '../a11y';
import { activeCount, whenText } from './NewHabit';

const DATE = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function CheckIn() {
  const { s, dispatch } = useStore();
  const pick = (e: Energy) => {
    dispatch({ type: 'set', patch: { energy: { ...s.energy, [today()]: e } } });
    replace(e === 'esgotado' ? 'dificil' : 'hoje');
  };
  const opts: [Energy, string, string, string][] = [
    ['alta', 'Com energia', 'Até 5 micro-hábitos', 'sun'],
    ['cansado', 'Cansado(a)', 'Só os essenciais', 'cloud'],
    ['esgotado', 'Esgotado(a)', 'Só 1 micro-ação de 2 min', 'moon']
  ];
  return (
    <Screen title={'Como está sua energia hoje, ' + s.nickname + '?'}>
      <Nuvi mood="curious" size={96} />
      <p className="muted">Não tem resposta certa. A meta se ajusta ao seu dia.</p>
      <div className="list">
        {opts.map(([e, t, sub, ic]) => (
          <button key={e} className="row" onClick={() => pick(e)}>
            <Icon name={ic} />
            <span className="row-text"><span className="row-title">{t}</span><span className="row-sub">{sub}</span></span>
            <Icon name="chevron" size={20} />
          </button>
        ))}
      </div>
      <div className="push"><Button kind="text" onClick={() => pick('pulou')}>Agora não</Button></div>
    </Screen>
  );
}

// quais hábitos entram na meta de hoje
export function todayHabits(s: ReturnType<typeof useStore>['s']) {
  const e = s.energy[today()];
  const all = s.habits.filter((h) => !h.paused).sort((a, b) => a.time.localeCompare(b.time));
  if (e === 'cansado') return { shown: all.filter((h) => h.essential), waiting: all.filter((h) => !h.essential), energy: e };
  return { shown: all, waiting: [] as Habit[], energy: e };
}

export function useComplete() {
  const { s, dispatch } = useStore();
  const { say, done } = useA11y();
  return (h: Habit, value?: number) => {
    const d = today();
    const prev = s.log[d]?.[h.id] || 0;
    const next = value ?? (h.parts ? Math.min(h.parts.goal, prev + h.parts.step) : 1);
    dispatch({ type: 'log', day: d, id: h.id, value: next });
    const undo = () => dispatch({ type: 'log', day: d, id: h.id, value: prev });
    const finished = h.parts ? next >= h.parts.goal : true;
    done(finished ? 'Feito' : 'Registrado');
    if (finished) {
      const after = { ...s, log: { ...s.log, [d]: { ...(s.log[d] || {}), [h.id]: next } } };
      const { shown } = todayHabits(after);
      if (shown.length && shown.every((x) => isDone(after, x, d))) {
        say('Tudo feito por hoje. Agora o resto do dia é seu.', { undo: () => { undo(); replace('hoje'); } });
        go('tudo-feito');
        return;
      }
      say('Feito: ' + h.name + '. Um passo de cada vez. Hoje já conta.', { undo });
    } else say(h.parts!.step + ' ' + h.parts!.unit + ' registrados · ' + next + ' de ' + h.parts!.goal + ' ' + h.parts!.unit, { undo });
  };
}

export function Today() {
  const { s } = useStore();
  const complete = useComplete();
  const d = today();
  const { shown, waiting, energy } = todayHabits(s);
  const doneN = shown.filter((h) => isDone(s, h, d)).length;
  const total = daysPracticed(s);
  return (
    <Screen title={greet() + ', ' + s.nickname} big nav="hoje" className="today">
      <div className="two-col">
        <div>
          <div className="hello-row">
            <p className="date">{cap(DATE.format(new Date()))}</p>
            <Nuvi mood={doneN === shown.length && shown.length ? 'proud' : 'happy'} size={64} />
          </div>
          <Card soft className="summary">
            <div className="summary-top">
              <span className="big-n">{total}</span><span className="muted">{total === 1 ? 'dia praticado' : 'dias praticados'}</span>
              <span className="today-n">{doneN} de {shown.length} hoje</span>
            </div>
            <Bar value={shown.length ? doneN / shown.length : 0} label="Hábitos feitos hoje" />
          </Card>
          {energy === 'cansado' && (
            <p className="goal-note"><Icon name="cloud" size={20} /><span><b>Meta de hoje: só os essenciais.</b> {waiting.length} {waiting.length === 1 ? 'hábito espera' : 'hábitos esperam'} por amanhã.</span></p>
          )}
          <button className="link-row" onClick={() => go('dificil')}><Icon name="moon" size={20} /> Dia difícil? Fazer só 1 micro-ação</button>
          <button className="link-row muted" onClick={() => go('transparencia')}><Icon name="lock" size={18} /> Seus dados ficam só neste celular</button>
        </div>
        <section aria-labelledby="hoje-h">
          <div className="hello-row">
            <h2 id="hoje-h" style={{ margin: 0, fontSize: '1.25rem' }}>Hoje</h2>
            <button className="link-row" onClick={() => go(activeCount(s.habits) >= 5 ? 'habitos' : 'ideias')}><Icon name="plus" size={20} /> Novo</button>
          </div>
          {shown.length === 0 ? (
            <Card><p>Nenhum hábito ainda.</p><Button to="ideias">Criar o primeiro</Button></Card>
          ) : (
            <ul className="list habits">
              {shown.map((h) => <HabitRow key={h.id} h={h} onDone={() => complete(h)} />)}
            </ul>
          )}
        </section>
      </div>
    </Screen>
  );
}

function HabitRow({ h, onDone }: { h: Habit; onDone: () => void }) {
  const { s } = useStore();
  const d = today();
  const p = progressOf(s, h, d), done = p >= 1, v = s.log[d]?.[h.id] || 0;
  const meta = h.parts && !done ? v + ' ' + h.parts.unit + ' de ' + h.parts.goal / 1000 + ' L' : (done ? 'Feito · ' : '') + h.minutes + ' min · ' + h.time;
  return (
    <li className="habit">
      <button className="habit-info" onClick={() => go(h.parts ? 'agua/' + h.id : 'habito/' + h.id)} aria-label={h.name + ', ' + meta + '. Abrir detalhes'}>
        <span className="habit-name">{h.name}</span>
        <span className="habit-meta" aria-hidden="true">{meta}</span>
        {h.parts && !done && <Bar value={p} label={'Progresso de ' + h.name} />}
      </button>
      {h.parts && !done ? (
        <button className="plus-btn" onClick={onDone} aria-label={'Registrar 1 copo de ' + h.parts.step + ' ' + h.parts.unit}>+ 1 copo</button>
      ) : (
        <button className={'check' + (done ? ' done' : '')} aria-pressed={done} disabled={done}
          aria-label={done ? h.name + ': feito' : 'Concluir ' + h.name} onClick={onDone}>
          <Icon name="check" size={22} />
        </button>
      )}
    </li>
  );
}

export function Water({ id }: { id: string }) {
  const { s } = useStore();
  const complete = useComplete();
  const h = s.habits.find((x) => x.id === id);
  if (!h || !h.parts) return <NotFound />;
  const v = s.log[today()]?.[h.id] || 0, n = Math.round(h.parts.goal / h.parts.step), filled = Math.floor(v / h.parts.step);
  return (
    <Screen title={h.name} back>
      <p><span className="big-n" style={{ fontSize: '2.5rem', fontWeight: 700 }}>{v} {h.parts.unit}</span> <span className="muted">de {h.parts.goal / 1000} L hoje</span></p>
      <div className="cups" role="group" aria-label={'Copos de ' + h.parts.step + ' ' + h.parts.unit}>
        {Array.from({ length: n }, (_, i) => (
          <button key={i} className={'cup' + (i < filled ? ' full' : '')} disabled={i !== filled}
            aria-label={'Copo ' + (i + 1) + (i < filled ? ', registrado' : i === filled ? ', registrar este copo' : ', ainda vazio')}
            onClick={() => complete(h)}><span className="cup-n">{i + 1}</span></button>
        ))}
      </div>
      <p className="muted small">Cada copo tem {h.parts.step} {h.parts.unit}. Toque no próximo para registrar.</p>
      <Card soft><p style={{ margin: 0 }}>Meio caminho já conta como dia praticado.</p></Card>
      <div className="push">
        <Button disabled={filled >= n} onClick={() => complete(h)}>{filled >= n ? 'Meta de hoje feita' : filled === n - 1 ? 'Registrar o último copo' : 'Registrar 1 copo'}</Button>
      </div>
    </Screen>
  );
}

export function AllDone() {
  const { s } = useStore();
  const { shown } = todayHabits(s);
  return (
    <Screen title={'Tudo feito por hoje, ' + s.nickname} nav="hoje" className="calm">
      <div className="center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Nuvi mood="peace" size={160} float />
        <p className="muted">Agora o resto do dia é seu. Amanhã a gente continua.</p>
        <p className="badge">{daysPracticed(s)} dias praticados</p>
      </div>
      <ul className="list done-list">
        {shown.map((h) => <li key={h.id} className="row"><Icon name="check" size={20} /><span className="row-text">{h.name}</span><span className="muted small">{h.parts ? h.parts.goal / 1000 + ' L' : h.minutes + ' min'}</span></li>)}
      </ul>
      <p className="muted small center"><Icon name="bellOff" size={16} /> Lembretes em silêncio até amanhã.</p>
      <Button kind="text" to="hoje">Ver a lista de hoje</Button>
    </Screen>
  );
}

const SMALL = [['Respirar fundo 5 vezes', '1 min'], ['Beber 1 copo d’água', '1 min'], ['Alongar os ombros', '1 min']];
export function HardDay() {
  const { s } = useStore();
  const { say, done } = useA11y();
  const [pick, setPick] = useState<number | null>(null);
  const { dispatch } = useStore();
  return (
    <Screen title="Hoje vamos com calma" back nav="hoje">
      <Nuvi mood="cozy" size={96} />
      <p className="muted">Dias assim fazem parte. Se quiser, escolha só uma coisa pequena.</p>
      <fieldset className="choice">
        <legend>Uma micro-ação</legend>
        {SMALL.map(([t, m], i) => (
          <label key={t} className={'opt' + (pick === i ? ' sel' : '')}>
            <input type="radio" name="pequena" checked={pick === i} onChange={() => setPick(i)} />
            <span className="row-text"><span>{t}</span><span className="row-sub">{m}</span></span>
            {pick === i && <span className="opt-check" aria-hidden="true"><Icon name="check" size={18} /></span>}
          </label>
        ))}
      </fieldset>
      <div className="push">
        <Button disabled={pick === null} onClick={() => {
          const d = today();
          dispatch({ type: 'log', day: d, id: 'dificil', value: 1 });
          done('Feito');
          say('Feito. ' + SMALL[pick!][0] + '. Hoje já conta.');
          replace('hoje');
        }}>Fazer agora</Button>
        <Button kind="text" onClick={() => { dispatch({ type: 'set', patch: { rest: { ...s.rest, [today()]: true } } }); go('descanso'); }}>Hoje só quero descansar</Button>
        <p className="muted small center">Os outros hábitos esperam por amanhã. Nada se perde.</p>
      </div>
    </Screen>
  );
}

export function Rest() {
  return (
    <Screen title="Descansar também é cuidar de você" className="calm">
      <div className="center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Nuvi mood="sleepy" size={160} />
        <p className="muted">Seus hábitos voltam amanhã, do jeito que estavam.</p>
      </div>
      <div className="push"><Button kind="secondary" onClick={() => replace('hoje')}>Voltar para Hoje</Button></div>
    </Screen>
  );
}

export function NotFound() {
  return <Screen title="Não encontrado" back><p>Essa tela não existe mais.</p><Button to="hoje">Ir para Hoje</Button></Screen>;
}

export { whenText };
