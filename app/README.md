# MicroRotina · front-end

App de micro-hábitos de 2 a 5 minutos, do Grupo 18 (IHC · UFABC). Esta é a versão funcional do protótipo do Penpot, já com as correções da auditoria MobileDU.

Tudo roda no navegador e os dados ficam no aparelho (`localStorage`). Nada é enviado para fora.

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. Para ver o app como no protótipo, toque em **Ver com dados de exemplo** na tela de boas-vindas.

Para gerar a versão final, rode `npm run build`. A pasta `dist/` pode ser publicada em qualquer hospedagem estática.

## Telas

| Fluxo | Rotas |
| --- | --- |
| Primeiro uso | boas-vindas, `combinados`, `perfil-inicio`, `pin`, `acessibilidade-inicio` |
| Novo hábito | `novo/1`, `novo/2`, `novo/3`, `ideias` |
| Dia a dia | `checkin`, `hoje`, `agua/:id`, `tudo-feito`, `dificil`, `descanso` |
| Hábitos | `habitos`, `habito/:id`, `excluir/:id`, `lembrete/:id` |
| Progresso | `progresso` |
| Ajustes e dados | `ajustes`, `perfil`, `acessibilidade`, `lembretes`, `idioma`, `transparencia`, `exportar`, `apagar`, `sync`, `sync-ligado` |

## Acessibilidade que funciona de verdade

Os ajustes ficam em **Ajustes › Acessibilidade** e valem na hora, em todas as telas.

| Ajuste | O que faz | MobileDU |
| --- | --- | --- |
| Tamanho do texto | Normal, Grande (130%) e Maior (160%); o layout se reorganiza sem cortar | 2.3 |
| Fonte de leitura fácil | Troca para Atkinson Hyperlegible | 2.1 |
| Texto em negrito | Todo o texto em negrito | 2.2 |
| Espaçamento amplo | Entrelinha 1,8 e mais espaço entre letras e palavras (WCAG 1.4.12) | 2.6 |
| Alto contraste | Texto preto, bordas fortes; também no tema escuro | 1.5, 2.5 |
| Tema de cores | Claro, Creme ou Escuro | 1.1, 2.4 |
| Inverter cores | Inverte a tela, mantendo a Nuvi nas cores originais | 1.2 |
| Reduzir o branco | Diminui o brilho das cores claras | 1.3 |
| Filtro para daltonismo | Correção de cor para protanopia, deuteranopia e tritanopia, ou tons de cinza | 1.4 |
| Baixo estímulo | Desliga todas as animações (também respeita o "reduzir movimento" do sistema) | 1.7 |
| Avisos sem tempo limite | Avisos e o "Desfazer" ficam até a pessoa fechar | 1.10 |
| Ler mensagens em voz | Lê avisos e confirmações com a voz do aparelho, com escolha de voz e velocidade | 3.4, 3.5, 3.6 |
| Som ao concluir | Toca um som curto ao concluir um hábito | 7.3 |
| Vibrar ao concluir | Vibra ao concluir (em celulares que permitem) | 7.3 |

Também valem em todo o app:

- **Alvos de toque:** todos com pelo menos 48 px (MobileDU 6.6).
- **Foco e campos:** foco visível em todos os controles e campo em edição com borda de 3 px (MobileDU 6.7).
- **Leitor de tela:**
  - botões, chaves (`role="switch"`) e opções com nome e estado;
  - avisos anunciados em uma região `aria-live`;
  - foco levado ao título a cada troca de tela (MobileDU 3.9).
- **Calendário do Progresso:** é uma tabela com cabeçalhos de dia e semana, e cada célula é lida como "Segunda, semana 1: praticado" (MobileDU 3.11 e 3.12).
- **Lembrete multimodal:** vibração, aviso na tela, som, leitura em voz e flash. Na versão web, a tela pisca no lugar do flash (MobileDU 7.1 e 7.2).
- **Paisagem:** em celular deitado ou tela larga, Hoje e Progresso ficam em duas colunas (MobileDU 1.9).

## Organização

- `src/state.tsx`: dados no aparelho, hábitos, registros e dados de exemplo.
- `src/a11y.tsx`: motor de acessibilidade. Aplica os ajustes na página e cuida da voz, do som, da vibração, do flash e dos avisos.
- `src/ui.tsx`: componentes acessíveis (botões, chaves, opções, campos, navegação).
- `src/screens/`: as telas.
- `src/art.ts`: ícones e expressões da Nuvi, gerados a partir do protótipo com `npm run arte`.

## Limites desta versão

- **Sincronização:** "Usar em outros aparelhos" é só simulada; nada sai do aparelho.
- **Lembretes:** a hora do lembrete fica salva, mas não há notificação agendada. O botão "Testar lembrete" mostra como seria o aviso.
- **Idioma:** só português (Brasil).
