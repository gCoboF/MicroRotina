// Acessibilidade (MobileDU 1.1–1.5, 1.7, 1.10, 2.1–2.6, 3.4–3.6, 7.3): cada opção muda o app na hora.
import { useStore, type Settings } from '../state';
import { FILTERS, useA11y } from '../a11y';
import { go } from '../router';
import { Button, Choice, List, Screen, ToggleRow } from '../ui';

export function Accessibility({ onboarding }: { onboarding: boolean }) {
  const { s, dispatch } = useStore();
  const { voices, speakNow, done } = useA11y();
  const st = s.settings;
  const set = (patch: Partial<Settings>) => dispatch({ type: 'settings', patch });
  return (
    <Screen title={onboarding ? 'Como fica melhor para você?' : 'Acessibilidade'} back fallback={onboarding ? 'perfil-inicio' : 'ajustes'}>
      <p className="muted">{onboarding ? 'Tudo opcional. Dá para mudar depois, em Ajustes.' : 'Ajuste o app do seu jeito. As mudanças valem na hora.'}</p>

      <h2 className="section">Texto</h2>
      <Choice legend="Tamanho do texto" columns value={st.textSize} onChange={(v) => set({ textSize: v })}
        options={[['normal', 'Normal', <span className="size-a" style={{ fontSize: 16 }} aria-hidden="true">Aa</span>],
          ['grande', 'Grande', <span className="size-a" style={{ fontSize: 21 }} aria-hidden="true">Aa</span>],
          ['maior', 'Maior', <span className="size-a" style={{ fontSize: 26 }} aria-hidden="true">Aa</span>]]} />
      <List>
        <ToggleRow icon="type" title="Fonte de leitura fácil" sub="Atkinson Hyperlegible" on={st.easyFont} onChange={(v) => set({ easyFont: v })} />
        <ToggleRow icon="book" title="Texto em negrito" on={st.bold} onChange={(v) => set({ bold: v })} />
        <ToggleRow icon="layout" title="Espaçamento amplo" sub="mais espaço entre linhas e letras" on={st.wideSpacing} onChange={(v) => set({ wideSpacing: v })} />
      </List>
      <p className="muted small">O texto cresce até 200% sem cortar nada. O zoom do celular também funciona.</p>

      <h2 className="section">Cores</h2>
      <List>
        <ToggleRow icon="contrast" title="Alto contraste" on={st.highContrast} onChange={(v) => set({ highContrast: v })} />
        <ToggleRow icon="eye" title="Inverter cores" on={st.invert} onChange={(v) => set({ invert: v })} />
        <ToggleRow icon="sunrise" title="Reduzir o branco" sub="cores menos brilhantes" on={st.dimWhite} onChange={(v) => set({ dimWhite: v })} />
      </List>
      <Choice legend="Tema de cores" value={st.theme} onChange={(v) => set({ theme: v })}
        options={[['claro', 'Claro'], ['creme', 'Creme'], ['escuro', 'Escuro']]} />
      <Choice legend="Filtro para daltonismo" value={st.colorFilter} onChange={(v) => set({ colorFilter: v })} options={FILTERS} />

      <h2 className="section">Movimento e tempo</h2>
      <List>
        <ToggleRow icon="wave" title="Baixo estímulo" sub="sem animações" on={st.lowStimulus} onChange={(v) => set({ lowStimulus: v })} />
        <ToggleRow icon="clock" title="Avisos sem tempo limite" sub="ficam até você fechar" on={st.noTimeouts} onChange={(v) => set({ noTimeouts: v })} />
      </List>

      <h2 className="section">Som e vibração</h2>
      <List>
        <ToggleRow icon="volume" title="Ler mensagens em voz" on={st.speak} onChange={(v) => { set({ speak: v }); if (v) speakNow('Pronto. Vou ler as mensagens em voz.'); }} />
        <ToggleRow icon="bell" title="Som ao concluir" on={st.soundOnDone} onChange={(v) => { set({ soundOnDone: v }); if (v) setTimeout(() => done('Assim soa ao concluir.'), 50); }} />
        <ToggleRow icon="phone" title="Vibrar ao concluir" sub="no celular" on={st.vibrateOnDone} onChange={(v) => { set({ vibrateOnDone: v }); if (v && 'vibrate' in navigator) navigator.vibrate([40, 60, 40]); }} />
      </List>
      {st.speak && (
        <>
          <Choice legend="Velocidade da voz" columns value={st.rate} onChange={(v) => { set({ rate: v }); }}
            options={[[0.8, 'Devagar'], [1, 'Normal'], [1.3, 'Rápida']]} />
          {voices.length > 0 && (
            <Choice legend="Voz" value={st.voice || voices[0].voiceURI} onChange={(v) => set({ voice: v })}
              options={voices.slice(0, 6).map((v) => [v.voiceURI, v.name.replace(/\(.*\)/, '').trim()] as [string, string])} />
          )}
          <Button kind="secondary" icon="volume" onClick={() => speakNow('Oi, eu sou a Nuvi. Um passo pequeno de cada vez.')}>Ouvir exemplo</Button>
        </>
      )}

      <div className="push">
        {onboarding ? (
          <>
            <Button to="novo/1">Continuar</Button>
            <Button kind="text" to="novo/1">Pular por agora</Button>
          </>
        ) : <Button onClick={() => go('ajustes')}>Pronto</Button>}
      </div>
    </Screen>
  );
}
