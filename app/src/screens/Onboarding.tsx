// Primeiro uso: boas-vindas, combinados, apelido, PIN e acessibilidade.
import { useState } from 'react';
import { exampleState, useStore } from '../state';
import { go, replace, back } from '../router';
import { Button, Field, Icon, List, Nuvi, Screen, ToggleRow } from '../ui';
import { useA11y } from '../a11y';

export function Welcome() {
  const { dispatch } = useStore();
  return (
    <Screen title="Oi, eu sou a Nuvi!" hideTitle className="welcome">
      <div className="center" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Nuvi mood="hello" size={180} float />
        <p className="lead" aria-hidden="true">Oi, eu sou a Nuvi!</p>
        <p className="muted">Vou te acompanhar no MicroRotina, um passo pequeno de cada vez.</p>
      </div>
      <ul className="checks">
        {['De 2 a 5 minutos por hábito', 'Esqueceu um dia? Nada zera', 'Só um apelido, sem e-mail nem senha'].map((t) => (
          <li key={t}><Icon name="check" size={20} /> {t}</li>
        ))}
      </ul>
      <div className="push">
        <Button to="combinados">Começar</Button>
        <Button kind="text" to="transparencia">Tudo fica no seu celular · Saiba mais</Button>
        <Button kind="text" onClick={() => { dispatch({ type: 'load', state: exampleState() }); replace('checkin'); }}>
          Ver com dados de exemplo
        </Button>
      </div>
    </Screen>
  );
}

export function Agreements() {
  const items = ['Seus dados ficam só no seu celular.', 'Nada vem ligado: lembretes só se você ligar.', 'Esqueceu um dia? Nada é zerado.', 'Você exporta ou apaga tudo em até 2 toques.'];
  return (
    <Screen title="Antes de começar, um acordo entre nós" back fallback="">
      <ol className="agree">
        {items.map((t, i) => <li key={i}><span className="num" aria-hidden="true">{i + 1}</span><span>{t}</span></li>)}
      </ol>
      <div className="push"><Button to="perfil-inicio">Combinado, continuar</Button></div>
    </Screen>
  );
}

export function ProfileStart() {
  const { s, dispatch } = useStore();
  const [name, setName] = useState(s.nickname);
  const ok = name.trim().length > 0;
  return (
    <Screen title="Como posso te chamar?" back fallback="combinados">
      <Nuvi mood="happy" size={88} />
      <p className="muted">Só um apelido, para eu te cumprimentar.</p>
      <Field label="Apelido" value={name} onChange={setName} max={20} autoFocus
        hint={ok ? 'Fica só neste celular. Sem e-mail nem senha.' : 'Digite um apelido para continuar.'} />
      <List>
        <ToggleRow icon="lock" title="Proteger com PIN" sub="pedido ao abrir o app" on={!!s.pin}
          onChange={(v) => { if (v) go('pin'); else dispatch({ type: 'set', patch: { pin: null } }); }} />
      </List>
      <div className="push">
        <Button disabled={!ok} onClick={() => { dispatch({ type: 'set', patch: { nickname: name.trim() } }); go('acessibilidade-inicio'); }}>Continuar</Button>
        <Button kind="text" to="sync">Criar conta (ver em outros celulares)</Button>
      </div>
    </Screen>
  );
}

export function PinSetup() {
  const { dispatch } = useStore();
  const { say } = useA11y();
  const [first, setFirst] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const press = (k: string) => {
    setErr('');
    if (k === '⌫') return setPin((p) => p.slice(0, -1));
    const next = (pin + k).slice(0, 4);
    setPin(next);
    if (next.length < 4) return;
    if (!first) { setFirst(next); setPin(''); say('Digite o PIN de novo para confirmar.', { toast: false }); return; }
    if (next === first) { dispatch({ type: 'set', patch: { pin: next } }); say('PIN criado.'); back('perfil-inicio'); }
    else { setErr('Os PINs não batem. Tente de novo.'); say('Os PINs não batem. Tente de novo.', { toast: false }); setFirst(null); setPin(''); }
  };
  return (
    <Screen title={first ? 'Confirme o PIN' : 'Crie um PIN'} back fallback="perfil-inicio">
      <p className="muted center">Pedido ao abrir o app. Fica só neste celular.</p>
      <Keypad pin={pin} onKey={press} />
      {err && <p className="error" role="alert">{err}</p>}
    </Screen>
  );
}

export function Keypad({ pin, onKey }: { pin: string; onKey: (k: string) => void }) {
  return (
    <>
      <div className="pin-dots" aria-label={pin.length + ' de 4 dígitos'} role="img">
        {[0, 1, 2, 3].map((i) => <span key={i} className={i < pin.length ? 'on' : ''} />)}
      </div>
      <p className="muted center small" aria-hidden="true">{pin.length} de 4 dígitos</p>
      <div className="keypad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) =>
          k ? <button key={i} className="key" onClick={() => onKey(k)} aria-label={k === '⌫' ? 'Apagar dígito' : k}>{k}</button> : <span key={i} />)}
      </div>
    </>
  );
}

export function Lock() {
  const { s } = useStore();
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const { say } = useA11y();
  const press = (k: string) => {
    setErr('');
    if (k === '⌫') return setPin((p) => p.slice(0, -1));
    const next = (pin + k).slice(0, 4);
    setPin(next);
    if (next.length === 4) {
      if (next === s.pin) { sessionStorage.setItem('microrotina:unlocked', '1'); window.dispatchEvent(new Event('unlock')); }
      else { setPin(''); setErr('PIN incorreto. Tente de novo.'); say('PIN incorreto. Tente de novo.', { toast: false }); }
    }
  };
  return (
    <Screen title={'Oi, ' + s.nickname + '! Digite seu PIN'}>
      <Nuvi mood="calm" size={88} />
      <Keypad pin={pin} onKey={press} />
      {err && <p className="error" role="alert">{err}</p>}
    </Screen>
  );
}
