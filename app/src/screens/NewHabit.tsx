// Novo hábito em 3 passos e Ideias prontas.
import { useState } from 'react';
import { newHabit, useStore, type Habit } from '../state';
import { go, replace } from '../router';
import { Button, Card, Choice, Field, Icon, List, Nuvi, Screen, Steps, ToggleRow } from '../ui';
import { useA11y } from '../a11y';

export const ANCHORS = ['Acordar', 'Tomar café', 'Almoçar', 'Jantar', 'Dormir'];
const BASE: Record<string, number> = { Acordar: 7 * 60, 'Tomar café': 8 * 60, Almoçar: 13 * 60, Jantar: 20 * 60, Dormir: 22 * 60 + 30 };
const hhmm = (m: number) => String(Math.floor(((m + 1440) % 1440) / 60)).padStart(2, '0') + ':' + String(((m % 60) + 60) % 60).padStart(2, '0');
export const suggestTime = (rel: string, anchor: string) => hhmm((BASE[anchor] ?? 720) + (rel === 'antes' ? -15 : 30));
export const whenText = (h: Pick<Habit, 'rel' | 'anchor' | 'time'>) =>
  h.rel === 'hora' ? 'Às ' + h.time : (h.rel === 'antes' ? 'Antes de ' : 'Depois de ') + h.anchor.toLowerCase();
export const activeCount = (hs: Habit[]) => hs.filter((h) => !h.paused).length;

function useDraft() {
  const { s, dispatch } = useStore();
  const d = s.draft || {};
  const set = (patch: Partial<Habit>) => dispatch({ type: 'set', patch: { draft: { ...d, ...patch } } });
  return { d, set, s, dispatch };
}

export function NewHabit({ step }: { step: number }) {
  if (step === 2) return <Step2 />;
  if (step === 3) return <Step3 />;
  return <Step1 />;
}

function Step1() {
  const { d, set, s } = useDraft();
  const full = activeCount(s.habits) >= 5 && !d.id;
  const name = d.name || '';
  return (
    <Screen title="Novo hábito" back fallback="habitos">
      <Steps n={1} />
      <p className="lead">O que você quer fazer?</p>
      {full ? (
        <Card soft>
          <p><b>Você já tem 5 hábitos ativos.</b> O limite evita sobrecarga.</p>
          <p className="muted">Pause um hábito para adicionar outro.</p>
          <Button kind="secondary" to="habitos">Ver meus hábitos</Button>
        </Card>
      ) : (
        <>
          <Field label="Nome do hábito" value={name} onChange={(v) => set({ name: v })} max={40} autoFocus
            hint="Algo pequeno, de 2 a 5 minutos. Ex.: Ler 1 página." />
          <List>
            <ToggleRow title="Dividir em partes" sub="ex.: 1 L de água em copos de 250 ml" on={!!d.parts}
              onChange={(v) => set({ parts: v ? { goal: 1000, step: 250, unit: 'ml' } : null })} />
          </List>
          {d.parts && (
            <Choice legend="Cada parte" columns value={d.parts.step} onChange={(v) => set({ parts: { ...d.parts!, step: v } })}
              options={[[200, '200 ml'], [250, '250 ml'], [500, '500 ml']]} />
          )}
          <p className="muted small">Opcional. Fazer só uma parte já conta como dia praticado.</p>
          <Button kind="text" icon="star" to="ideias">Ver ideias prontas</Button>
        </>
      )}
      <div className="push">
        <Button disabled={full || !name.trim()} to="novo/2">Próximo</Button>
      </div>
    </Screen>
  );
}

function Step2() {
  const { d, set } = useDraft();
  const rel = d.rel || 'depois', anchor = d.anchor || 'Almoçar';
  const time = d.time || suggestTime(rel, anchor);
  return (
    <Screen title="Novo hábito" back fallback="novo/1">
      <Steps n={2} />
      <p className="lead">Quando você vai fazer?</p>
      <Choice legend="Junto de algo que você já faz, ou num horário" columns value={rel}
        onChange={(v) => set({ rel: v, time: v === 'hora' ? time : suggestTime(v, anchor) })}
        options={[['antes', 'Antes de'], ['depois', 'Depois de'], ['hora', 'Hora exata']]} />
      {rel !== 'hora' && (
        <Choice legend={rel === 'antes' ? 'Antes de…' : 'Depois de…'} value={anchor}
          onChange={(v) => set({ anchor: v, time: suggestTime(rel, v) })} options={ANCHORS.map((a) => [a, a] as [string, string])} />
      )}
      <Field label={rel === 'hora' ? 'Horário' : 'Horário aproximado'} type="time" value={time} onChange={(v) => set({ time: v })}
        hint={rel === 'hora' ? undefined : whenText({ rel, anchor, time }) + ', sugerimos ' + time + '. Você muda quando quiser.'} />
      <Choice legend="Duração" columns value={d.minutes || 2} onChange={(v) => set({ minutes: v })}
        options={[[1, '1 min'], [2, '2 min'], [3, '3 min'], [5, '5 min']]} />
      <div className="push"><Button to="novo/3" onClick={() => set({ rel, anchor, time })}>Próximo</Button></div>
    </Screen>
  );
}

function Step3() {
  const { d, dispatch } = useDraft();
  const { say } = useA11y();
  const save = (remind: boolean) => {
    const h = newHabit({ ...d, reminder: { on: remind, channels: remind ? ['vibrar', 'tela'] : [] } });
    dispatch({ type: 'habit', habit: h });
    dispatch({ type: 'set', patch: { draft: null, onboarded: true } });
    say('Hábito criado: ' + h.name + ', ' + whenText(h).toLowerCase() + '.');
    if (remind) replace('lembrete/' + h.id); else replace('hoje');
  };
  const name = d.name || '';
  return (
    <Screen title="Novo hábito" back fallback="novo/2">
      <Steps n={3} />
      <div className="hello-row"><p className="lead">Quase pronto</p><Nuvi mood="wink" size={64} /></div>
      <Card soft>
        <p className="habit-name">{name}</p>
        <p className="muted small" style={{ margin: 0 }}><Icon name="clock" size={16} /> {whenText({ rel: d.rel || 'depois', anchor: d.anchor || 'Almoçar', time: d.time || '13:30' })} · {d.time} · {d.minutes || 2} min</p>
      </Card>
      <p className="lead" style={{ fontSize: '1.3rem' }}>Quer um lembrete?</p>
      <p className="muted">Você decide. Nenhuma opção vem marcada.</p>
      <figure className="notif" aria-label="Prévia do lembrete">
        <figcaption className="muted small">Assim ele vai aparecer</figcaption>
        <div className="card notif-card">
          <span className="app-ic"><NuviMini /></span>
          <div><b>MicroRotina</b> <span className="muted small">{d.time}</span><br />Hora de {name.charAt(0).toLowerCase() + name.slice(1)}. Leva {d.minutes || 2} min, sem pressa.</div>
        </div>
      </figure>
      <div className="push">
        <Button icon="bell" onClick={() => save(true)}>Sim, me avise</Button>
        <Button kind="secondary" icon="bellOff" onClick={() => save(false)}>Agora não</Button>
        <p className="muted small center">As duas opções salvam o hábito. Dá para mudar depois.</p>
      </div>
    </Screen>
  );
}

const NuviMini = () => <span style={{ display: 'inline-block', width: 28, height: 28 }} aria-hidden="true"><Nuvi mood="happy" size={28} /></span>;

const IDEAS: { name: string; tag: string; when: string; minutes: number; icon: string; patch: Partial<Habit> }[] = [
  { name: 'Beber 1 L de água', tag: 'Corpo', when: 'Em partes, o dia todo', minutes: 1, icon: 'droplet', patch: { parts: { goal: 1000, step: 250, unit: 'ml' }, rel: 'hora', time: '11:00' } },
  { name: 'Alongar o corpo', tag: 'Corpo', when: 'Antes do trabalho', minutes: 2, icon: 'activity', patch: { rel: 'depois', anchor: 'Tomar café' } },
  { name: 'Revisar 1 parágrafo', tag: 'Mente', when: 'Depois de estudar', minutes: 3, icon: 'book', patch: { rel: 'depois', anchor: 'Jantar' } },
  { name: 'Respirar fundo 5 vezes', tag: 'Mente', when: 'Antes de dormir', minutes: 1, icon: 'wind', patch: { rel: 'antes', anchor: 'Dormir' } },
  { name: 'Pausa de tela', tag: 'Mente', when: 'A cada hora', minutes: 1, icon: 'monitor', patch: { rel: 'hora', time: '15:00' } },
  { name: 'Organizar a mesa', tag: 'Casa', when: 'Ao terminar o dia', minutes: 3, icon: 'layout', patch: { rel: 'depois', anchor: 'Jantar' } }
];

export function Ideas() {
  const { dispatch } = useStore();
  const [tag, setTag] = useState('Todas');
  return (
    <Screen title="Ideias prontas" back fallback="habitos">
      <p className="muted">Escolha uma e ajuste do seu jeito.</p>
      <div className="chips" role="group" aria-label="Filtrar ideias">
        {['Todas', 'Corpo', 'Mente', 'Casa'].map((t) => <button key={t} className="chip" aria-pressed={tag === t} onClick={() => setTag(t)}>{t}</button>)}
      </div>
      <ul className="ideas">
        {IDEAS.filter((i) => tag === 'Todas' || i.tag === tag).map((i) => (
          <li key={i.name} className="card idea">
            <span className="idea-ic"><Icon name={i.icon} /></span>
            <span className="row-text"><span className="row-title">{i.name}</span><span className="row-sub">{i.when} · {i.minutes} min</span></span>
            <button className="icon-btn add" aria-label={'Adicionar: ' + i.name}
              onClick={() => { dispatch({ type: 'set', patch: { draft: { name: i.name, minutes: i.minutes, ...i.patch } } }); go('novo/1'); }}>
              <Icon name="plus" />
            </button>
          </li>
        ))}
      </ul>
      <Button kind="secondary" icon="plus" onClick={() => { dispatch({ type: 'set', patch: { draft: {} } }); go('novo/1'); }}>Criar do zero</Button>
    </Screen>
  );
}
