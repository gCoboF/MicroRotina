// Meus hábitos, detalhe, excluir (com desfazer) e lembrete multimodal.
import { useStore, today, addDays, type Channel, type Habit } from '../state';
import { go, replace, back } from '../router';
import { Button, Card, Field, Icon, List, Screen, ToggleRow } from '../ui';
import { useA11y } from '../a11y';
import { activeCount, whenText } from './NewHabit';
import { NotFound } from './Today';

const period = (t: string) => (t < '12:00' ? 'Manhã' : t < '18:00' ? 'Tarde' : 'Noite');
const WD = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const WDN = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export function MyHabits() {
  const { s, dispatch } = useStore();
  const hs = [...s.habits].sort((a, b) => a.time.localeCompare(b.time));
  const t = today(), monday = addDays(t, -((new Date(t + 'T12:00').getDay() + 6) % 7));
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  return (
    <Screen title="Meus hábitos" big nav="habitos">
      <ol className="week" aria-label="Esta semana">
        {week.map((d) => {
          const dt = new Date(d + 'T12:00');
          return <li key={d} className={d === t ? 'today' : ''} aria-current={d === t ? 'date' : undefined}
            aria-label={WDN[dt.getDay()] + ', ' + dt.getDate() + (d === t ? ', hoje' : '')}>
            <span aria-hidden="true">{WD[dt.getDay()]}<br /><b>{dt.getDate()}</b></span></li>;
        })}
      </ol>
      {['Manhã', 'Tarde', 'Noite'].map((p) => {
        const list = hs.filter((h) => period(h.time) === p);
        if (!list.length) return null;
        return (
          <List key={p} label={p}>
            {list.map((h) => (
              <button key={h.id} className="row" onClick={() => go('habito/' + h.id)}>
                <span className="time" aria-hidden="true">{h.time}</span>
                <span className="row-text">
                  <span className="row-title">{h.name}</span>
                  <span className="row-sub">{h.paused ? 'Pausado' : whenText(h)}{h.reminder.on ? ' · lembrete ligado' : ''}</span>
                </span>
                <Icon name="chevron" size={20} />
              </button>
            ))}
          </List>
        );
      })}
      <p className="muted small">{activeCount(s.habits)} de 5 ativos. O limite evita sobrecarga.</p>
      <div className="push">
        <Button icon="star" to="ideias">Ideias prontas</Button>
        <Button kind="secondary" icon="plus" disabled={activeCount(s.habits) >= 5}
          onClick={() => { dispatch({ type: 'set', patch: { draft: {} } }); go('novo/1'); }}>Criar do zero</Button>
      </div>
    </Screen>
  );
}

export function HabitDetail({ id }: { id: string }) {
  const { s, dispatch } = useStore();
  const { say } = useA11y();
  const h = s.habits.find((x) => x.id === id);
  if (!h) return <NotFound />;
  const save = (patch: Partial<Habit>) => dispatch({ type: 'habit', habit: { ...h, ...patch } });
  return (
    <Screen title={h.name} back fallback="habitos">
      <List>
        <button className="row" onClick={() => go('lembrete/' + h.id)}>
          <Icon name="bell" />
          <span className="row-text"><span className="row-title">Lembrete</span>
            <span className="row-sub">{h.reminder.on ? h.time + ' · ' + (h.reminder.channels.join(', ') || 'sem canal') : 'Desligado'}</span></span>
          <Icon name="chevron" size={20} />
        </button>
      </List>
      <dl className="facts">
        <div><dt>Quando</dt><dd>{whenText(h)} · {h.time}</dd></div>
        <div><dt>Duração</dt><dd>{h.minutes} {h.minutes === 1 ? 'minuto' : 'minutos'}</dd></div>
      </dl>
      <Field label="Versão de dia difícil" value={h.easyVersion} onChange={(v) => save({ easyVersion: v })} max={40} hint="Uma versão menor para dias sem energia." />
      <List>
        <ToggleRow icon="star" title="Essencial" sub="aparece mesmo em dia cansado" on={h.essential} onChange={(v) => save({ essential: v })} />
      </List>
      <div className="push">
        <Button kind="secondary" onClick={() => { dispatch({ type: 'set', patch: { draft: { ...h } } }); go('novo/1'); }}>Editar</Button>
        <Button kind="secondary" onClick={() => { save({ paused: !h.paused }); say(h.paused ? 'Hábito retomado.' : 'Hábito pausado, sem perder nada.'); }}>
          {h.paused ? 'Retomar hábito' : 'Pausar, sem perder nada'}
        </Button>
        <Button kind="danger" icon="trash" to={'excluir/' + h.id}>Excluir</Button>
        <p className="muted small center">Excluir leva 2 toques, o mesmo de criar.</p>
      </div>
    </Screen>
  );
}

export function DeleteHabit({ id }: { id: string }) {
  const { s, dispatch } = useStore();
  const { say } = useA11y();
  const h = s.habits.find((x) => x.id === id);
  if (!h) return <NotFound />;
  const limit = s.settings.noTimeouts ? 'enquanto o aviso estiver na tela' : 'por 10 s';
  return (
    <Screen title={'Excluir “' + h.name + '”?'} back>
      <p className="muted">Ele sai da lista. Seus dias praticados continuam guardados. Dá para desfazer {limit}.</p>
      <div className="push">
        <Button kind="danger" onClick={() => {
          dispatch({ type: 'removeHabit', id: h.id });
          say('“' + h.name + '” excluído.', { undo: () => dispatch({ type: 'habit', habit: h }) });
          replace('habitos');
        }}>Excluir</Button>
        <Button kind="secondary" onClick={() => back('habitos')}>Manter</Button>
      </div>
    </Screen>
  );
}

const CHANNELS: [Channel, string][] = [['vibrar', 'Vibração'], ['tela', 'Aviso na tela'], ['som', 'Som suave'], ['voz', 'Leitura em voz'], ['flash', 'Piscar a tela (flash)']];

export function Reminder({ id }: { id: string }) {
  const { s, dispatch } = useStore();
  const { alert } = useA11y();
  const h = s.habits.find((x) => x.id === id);
  if (!h) return <NotFound />;
  const save = (patch: Partial<Habit>) => dispatch({ type: 'habit', habit: { ...h, ...patch } });
  const toggle = (c: Channel) => {
    const ch = h.reminder.channels.includes(c) ? h.reminder.channels.filter((x) => x !== c) : [...h.reminder.channels, c];
    save({ reminder: { ...h.reminder, channels: ch } });
  };
  return (
    <Screen title="Lembrete" back fallback={'habito/' + h.id}>
      <p className="muted">{h.name} · {whenText(h).toLowerCase()}</p>
      <List>
        <ToggleRow icon="bell" title="Lembrete" sub="desligar leva 1 toque" on={h.reminder.on} onChange={(v) => save({ reminder: { ...h.reminder, on: v } })} />
      </List>
      <Field label="Horário" type="time" value={h.time} onChange={(v) => save({ time: v })} />
      <fieldset className="choice" disabled={!h.reminder.on}>
        <legend>Como avisar (pode marcar mais de um)</legend>
        {CHANNELS.map(([c, label]) => (
          <label key={c} className={'opt' + (h.reminder.channels.includes(c) ? ' sel' : '')}>
            <input type="checkbox" checked={h.reminder.channels.includes(c)} onChange={() => toggle(c)} />
            <span>{label}</span>
            <span className={'box' + (h.reminder.channels.includes(c) ? ' on' : '')} aria-hidden="true"><Icon name="check" size={16} /></span>
          </label>
        ))}
      </fieldset>
      <Card soft><p className="small" style={{ margin: 0 }}>O flash do celular só pode ser usado pelo app instalado. Nesta versão web, a tela pisca.</p></Card>
      <div className="push">
        <Button kind="secondary" icon="bell" disabled={!h.reminder.on}
          onClick={() => alert('Hora de ' + h.name.charAt(0).toLowerCase() + h.name.slice(1) + '. Leva ' + h.minutes + ' min, sem pressa.', h.reminder.channels)}>
          Testar lembrete
        </Button>
        <Button onClick={() => back('habitos')}>Salvar</Button>
      </div>
    </Screen>
  );
}
