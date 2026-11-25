// Ajustes, perfil, idioma e dados: transparência, sincronização opcional, exportar e apagar.
import { useState } from 'react';
import { storedBytes, useStore } from '../state';
import { go, replace, back } from '../router';
import { Button, Card, Choice, Field, Icon, LinkRow, List, Nuvi, Screen, ToggleRow } from '../ui';
import { useA11y } from '../a11y';

export function SettingsHome() {
  const { s } = useStore();
  return (
    <Screen title="Ajustes" big nav="ajustes">
      <List>
        <LinkRow icon="user" title="Perfil" sub={s.nickname + ' · bloqueio ' + (s.pin ? 'ligado' : 'desligado')} to="perfil" />
        <LinkRow icon="eye" title="Acessibilidade" sub="texto, cores, movimento, som" to="acessibilidade" />
        <LinkRow icon="bell" title="Lembretes" sub={s.habits.filter((h) => h.reminder.on).length + ' ligados'} to="lembretes" />
        <LinkRow icon="shield" title="Transparência" to="transparencia" />
        <LinkRow icon="globe" title="Idioma" sub="Português (Brasil)" to="idioma" />
      </List>
      <List label="Seus dados">
        <LinkRow icon="cloud" title="Usar em outros aparelhos" sub={s.syncOn ? 'Ligado · cifrado' : 'Desligado · opcional'} to={s.syncOn ? 'sync-ligado' : 'sync'} />
        <LinkRow icon="download" title="Exportar meus dados" sub="JSON ou TXT" to="exportar" />
        <LinkRow icon="trash" title="Apagar todos os dados" sub="pede 1 confirmação" to="apagar" />
      </List>
      <p className="muted small center">MicroRotina v0.5 · Grupo 18</p>
    </Screen>
  );
}

export function Reminders() {
  const { s } = useStore();
  return (
    <Screen title="Lembretes" back fallback="ajustes">
      <p className="muted">Nada vem ligado. Escolha o hábito e como quer ser avisado.</p>
      <List>
        {s.habits.map((h) => <LinkRow key={h.id} icon={h.reminder.on ? 'bell' : 'bellOff'} title={h.name} sub={h.reminder.on ? h.time + ' · ligado' : 'Desligado'} to={'lembrete/' + h.id} />)}
      </List>
    </Screen>
  );
}

export function Profile() {
  const { s, dispatch } = useStore();
  const { say } = useA11y();
  const [name, setName] = useState(s.nickname);
  return (
    <Screen title="Perfil" back fallback="ajustes">
      <Nuvi mood="happy" size={80} />
      <p className="muted">Só um apelido, para eu te cumprimentar. Fica guardado neste celular.</p>
      <Field label="Apelido" value={name} onChange={setName} max={20} hint={name.trim() ? undefined : 'Digite um apelido para salvar.'} />
      <List>
        <ToggleRow icon="lock" title="Bloquear o app com PIN" sub="pedido ao abrir" on={!!s.pin}
          onChange={(v) => { if (v) go('pin'); else { dispatch({ type: 'set', patch: { pin: null } }); say('Bloqueio desligado.'); } }} />
      </List>
      <div className="push">
        <Button disabled={!name.trim()} onClick={() => { dispatch({ type: 'set', patch: { nickname: name.trim() } }); say('Perfil salvo.'); back('ajustes'); }}>Salvar</Button>
      </div>
    </Screen>
  );
}

export function Language() {
  return (
    <Screen title="Idioma" back fallback="ajustes">
      <Choice legend="Idioma do app" value="pt-BR" onChange={() => undefined} options={[['pt-BR', 'Português (Brasil)']]} />
      <p className="muted small">Outros idiomas entram aqui quando estiverem prontos. O app segue o idioma escolhido, não o do celular.</p>
    </Screen>
  );
}

export function Transparency() {
  const { s } = useStore();
  const kb = Math.max(1, Math.round(storedBytes(s) / 1024));
  const items = ['Só um apelido: sem e-mail nem senha', 'Sem anúncios nem rastreadores', 'Nuvem só se você ligar, e cifrada', 'Lembretes só se você ligar'];
  return (
    <Screen title="Transparência" back fallback="ajustes">
      <Card soft>
        <div className="hello-row">
          <p style={{ margin: 0 }}><span style={{ fontSize: '2.75rem', fontWeight: 700, display: 'block', lineHeight: 1 }}>0 KB</span><span className="muted">enviados para fora deste celular</span></p>
          <Nuvi mood="calm" size={80} />
        </div>
      </Card>
      <ul className="checks">{items.map((t) => <li key={t}><Icon name="check" size={20} /> {t}</li>)}</ul>
      <h2 className="section">Guardado aqui</h2>
      <p>{s.habits.length} hábitos · {Object.keys(s.log).length} dias registrados · ~{kb} KB</p>
      <div className="push">
        <Button kind="secondary" icon="download" to="exportar">Exportar meus dados</Button>
        <Button kind="danger" icon="trash" to="apagar">Apagar todos os dados</Button>
      </div>
    </Screen>
  );
}

function download(name: string, text: string, type: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function Export() {
  const { s } = useStore();
  const { say } = useA11y();
  const json = () => { download('meus-dados-microrotina.json', JSON.stringify(s, null, 2), 'application/json'); say('Arquivo JSON salvo no seu aparelho.'); };
  const txt = () => {
    const lines = ['MicroRotina · meus dados', 'Apelido: ' + s.nickname, '', 'Hábitos:',
      ...s.habits.map((h) => '- ' + h.name + ' (' + h.minutes + ' min, ' + h.time + ')'), '', 'Dias registrados:',
      ...Object.keys(s.log).sort().map((d) => d + ': ' + Object.keys(s.log[d]).length + ' registro(s)')];
    download('meus-dados-microrotina.txt', lines.join('\n'), 'text/plain');
    say('Arquivo TXT salvo no seu aparelho.');
  };
  return (
    <Screen title="Exportar meus dados" back fallback="ajustes">
      <Nuvi mood="cheer" size={110} />
      <p className="muted">O arquivo é gerado aqui e salvo no seu aparelho. Nada é enviado a servidor algum.</p>
      <div className="push">
        <Button icon="download" onClick={json}>Baixar em JSON</Button>
        <Button kind="secondary" icon="download" onClick={txt}>Baixar em TXT</Button>
      </div>
    </Screen>
  );
}

export function Erase() {
  const { s, dispatch } = useStore();
  return (
    <Screen title="Apagar todos os dados?" back fallback="ajustes">
      <p className="muted">Remove {s.habits.length} hábitos e {Object.keys(s.log).length} dias registrados deste celular. Não dá para desfazer.</p>
      <Button kind="text" icon="download" to="exportar">Exportar antes</Button>
      <Nuvi mood="concern" size={110} />
      <div className="push">
        <Button kind="danger" onClick={() => { localStorage.clear(); sessionStorage.clear(); dispatch({ type: 'reset' }); replace(''); }}>Apagar definitivamente</Button>
        <Button kind="secondary" onClick={() => back('ajustes')}>Cancelar</Button>
      </div>
    </Screen>
  );
}

export function Sync() {
  const { dispatch } = useStore();
  const { say } = useA11y();
  const turnOn = (how: string) => { dispatch({ type: 'set', patch: { syncOn: true } }); say('Sincronização ligada com ' + how + '. Protótipo: nada foi enviado.'); replace('sync-ligado'); };
  return (
    <Screen title="Quer usar em outros aparelhos?" back fallback="ajustes">
      <Nuvi mood="calm" size={88} />
      <p className="muted">É opcional. Sem isso, tudo continua só neste celular.</p>
      <ul className="checks">
        <li><Icon name="lock" size={20} /> Cifrado no seu celular antes de sair. Nem a gente consegue ler.</li>
        <li><Icon name="shield" size={20} /> Sem senha para criar ou lembrar.</li>
        <li><Icon name="trash" size={20} /> Desligar apaga a cópia da nuvem em 1 toque.</li>
      </ul>
      <Card soft><p className="small" style={{ margin: 0 }}>Nesta versão de front-end a sincronização é simulada: nenhum dado sai do aparelho.</p></Card>
      <div className="push">
        <Button kind="secondary" onClick={() => turnOn('Apple')}>Continuar com Apple</Button>
        <Button kind="secondary" onClick={() => turnOn('Google')}>Continuar com Google</Button>
        <Button kind="text" onClick={() => back('ajustes')}>Agora não</Button>
      </div>
    </Screen>
  );
}

export function SyncOn() {
  const { dispatch } = useStore();
  const { say } = useA11y();
  return (
    <Screen title="Outros aparelhos" back fallback="ajustes">
      <Card soft><p style={{ margin: 0 }}><b>Sincronização ligada</b></p><p className="muted small" style={{ margin: 0 }}>Cifrada de ponta a ponta. Última cópia: agora.</p></Card>
      <p className="muted small">O painel de Transparência mostra tudo o que foi enviado.</p>
      <div className="push">
        <Button kind="danger" onClick={() => { dispatch({ type: 'set', patch: { syncOn: false } }); say('Sincronização desligada e cópia da nuvem apagada.'); replace('ajustes'); }}>Desligar e apagar a cópia da nuvem</Button>
        <Button onClick={() => replace('ajustes')}>Concluir</Button>
      </div>
    </Screen>
  );
}
