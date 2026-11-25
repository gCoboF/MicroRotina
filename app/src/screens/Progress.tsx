// Progresso: total de dias (sem sequência) e calendário como tabela legível pelo leitor de tela (MobileDU 3.11, 3.12).
import { addDays, daysPracticed, practiced, today, useStore } from '../state';
import { Bar, Card, Icon, Nuvi, Screen } from '../ui';

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const SHORT = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

export function Progress() {
  const { s } = useStore();
  const t = today();
  const total = daysPracticed(s);
  const next = Math.max(10, Math.ceil((total + 1) / 10) * 10);
  const monday = addDays(t, -((new Date(t + 'T12:00').getDay() + 6) % 7) - 21);
  const weeks = Array.from({ length: 4 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(monday, w * 7 + d)));
  const state = (d: string) => (d > t ? 'f' : d === t ? 'h' : practiced(s, d) ? 'd' : s.rest[d] ? 'r' : 'm');
  const label = { d: 'praticado', r: 'descanso', h: 'hoje', f: 'dia futuro', m: 'sem registro' };
  // hábito mais firme: o que mais tem dias feitos
  const counts = s.habits.map((h) => ({ h, n: Object.values(s.log).filter((day) => (day[h.id] || 0) > 0).length })).sort((a, b) => b.n - a.n);
  const firm = counts[0];
  return (
    <Screen title="Progresso" big nav="progresso">
      <div className="two-col">
        <div>
          <Card soft>
            <div className="hello-row">
              <p style={{ margin: 0 }}><span className="big-n" style={{ fontSize: '3rem', fontWeight: 700, display: 'block', lineHeight: 1 }}>{total}</span>
                <span className="muted">{total === 1 ? 'dia praticado' : 'dias praticados'}</span></p>
              <Nuvi mood="sunny" size={84} />
            </div>
            <p className="muted small" style={{ marginBottom: 0 }}>{total ? 'Cada um deles foi você cuidando de você.' : 'O primeiro dia praticado aparece aqui.'}</p>
          </Card>
          <Card>
            <h2 className="section" style={{ marginTop: 0 }}>Próximo marco</h2>
            <p className="hello-row" style={{ margin: 0 }}><b>{next} dias</b><span className="muted">faltam {next - total}</span></p>
            <Bar value={total / next} label={'Progresso até ' + next + ' dias'} />
            <p className="muted small" style={{ margin: '8px 0 0' }}>Mais {next - total} {next - total === 1 ? 'dia praticado' : 'dias praticados'} e a gente celebra junto.</p>
          </Card>
          {firm && firm.n > 0 && (
            <Card soft className="noticed">
              <p style={{ margin: 0 }}><Icon name="star" size={18} /> <b>A Nuvi reparou</b></p>
              <p style={{ margin: 0 }}>{firm.h.name} é o seu hábito mais firme: {firm.n} dias. Isso é constância de verdade.</p>
            </Card>
          )}
        </div>
        <div>
          <table className="cal">
            <caption>Últimas 4 semanas</caption>
            <thead>
              <tr><td />{DAYS.map((d, i) => <th key={d} scope="col"><abbr title={d}>{SHORT[i]}</abbr><span className="sr-only">{d}</span></th>)}</tr>
            </thead>
            <tbody>
              {weeks.map((w, i) => (
                <tr key={i}>
                  <th scope="row"><span className="sr-only">Semana </span>{i + 1}</th>
                  {w.map((d, j) => {
                    const st = state(d);
                    return <td key={d}><span className={'dot ' + st} aria-hidden="true" /><span className="sr-only">{DAYS[j]}, semana {i + 1}: {label[st]}</span></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="legend" aria-label="Legenda">
            <li><span className="dot d" aria-hidden="true" />Praticado</li>
            <li><span className="dot r" aria-hidden="true" />Descanso</li>
            <li><span className="dot h" aria-hidden="true" />Hoje</li>
          </ul>
          <p className="muted small">Dias sem registro não contam contra você. O total só soma.</p>
        </div>
      </div>
    </Screen>
  );
}
