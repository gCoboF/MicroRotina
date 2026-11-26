// Novo hábito em 3 passos e Ideias prontas.
import { useEffect, useState } from 'react';
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
          <Field label="Nome do hábito" value={name} onChange={(v) => set({ name: v })} max={40}
            hint="Algo pequeno, de 2 a 5 minutos. Escreva ou toque numa sugestão." />
          <div className="chips" role="group" aria-label="Sugestões de hábito">
            {QUICK.map((q) => (
              <button key={q.name} className="chip" aria-pressed={name === q.name}
                onClick={() => set({ name: q.name, minutes: q.minutes, parts: q.parts ?? null })}>{q.name}</button>
            ))}
          </div>
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

// passos 2 e 3 sem nome (aberto direto pela URL): volta ao passo 1
function useNeedsName(name?: string) {
  useEffect(() => { if (!name?.trim()) replace('novo/1'); }, [name]);
}

function Step2() {
  const { d, set } = useDraft();
  useNeedsName(d.name);
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
      {rel === 'hora' && (
        <div className="chips" role="group" aria-label="Horários comuns">
          {['07:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((t) => (
            <button key={t} className="chip" aria-pressed={time === t} onClick={() => set({ time: t })}>{t}</button>
          ))}
        </div>
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
  const { d: raw, dispatch } = useDraft();
  const { say } = useA11y();
  useNeedsName(raw.name);
  const rel = raw.rel || 'depois', anchor = raw.anchor || 'Almoçar';
  const d = { ...raw, rel, anchor, time: raw.time || suggestTime(rel, anchor), minutes: raw.minutes || 2 };
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
        <p className="muted small" style={{ margin: 0 }}><Icon name="clock" size={16} /> {whenText(d)} · {d.time} · {d.minutes} min</p>
      </Card>
      <p className="lead" style={{ fontSize: '1.3rem' }}>Quer um lembrete?</p>
      <p className="muted">Você decide. Nenhuma opção vem marcada.</p>
      <figure className="notif" aria-label="Prévia do lembrete">
        <figcaption className="muted small">Assim ele vai aparecer</figcaption>
        <div className="card notif-card">
          <span className="app-ic"><NuviMini /></span>
          <div><b>MicroRotina</b> <span className="muted small">{d.time}</span><br />Hora de {name.charAt(0).toLowerCase() + name.slice(1)}. Leva {d.minutes} min, sem pressa.</div>
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

// sugestões de um toque no passo 1
const QUICK: { name: string; minutes: number; parts?: Habit['parts'] }[] = [
  { name: 'Ler 1 página', minutes: 3 }, { name: 'Beber água', minutes: 1, parts: { goal: 1000, step: 250, unit: 'ml' } },
  { name: 'Alongar o corpo', minutes: 2 }, { name: 'Respirar fundo 5 vezes', minutes: 1 },
  { name: 'Arrumar a cama', minutes: 2 }, { name: 'Caminhar 5 minutos', minutes: 5 }
];

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
