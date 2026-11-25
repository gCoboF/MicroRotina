# Gera o relatório da auditoria MobileDU (HTML) a partir dos dados abaixo; o PDF sai do HTML.
import html, os, re
from collections import Counter

A, N, X = 'Atende', 'Não atende', 'Não se aplica'
# (id, nome, situação antes, evidência, correção proposta, situação depois)
D = [
 ('1. Ambiente', [
  ('1.1', 'Cor – Personalizar cor da tela', N, '06/30 Acessibilidade só oferece tamanho do texto e alto contraste; não há escolha de cor da tela.', 'Opção “Tema de cores” (Claro, Creme, Escuro) em 06/30.', A),
  ('1.2', 'Cor – Inverter as cores da tela', N, 'Nenhuma tela tem inversão de cores.', 'Chave “Inverter cores” em 06/30.', A),
  ('1.3', 'Cor – Reduzir o ponto branco', N, 'Não há controle de intensidade do branco.', 'Chave “Reduzir o branco” em 06/30.', A),
  ('1.4', 'Cor – Filtro da cor da tela', N, 'Não há filtro de cor. O estado dos hábitos já usa forma + texto, mas a tela não oferece película.', 'Opção “Filtro para daltonismo” em 06/30.', A),
  ('1.5', 'Cor – Intensidade e contraste da cor da tela', A, '06/30: chave “Alto contraste”. Texto de apoio #5C5C58 sobre branco ≈ 6,7:1.', '—', A),
  ('1.6', 'Brilho automático', X, 'Recurso do sistema operacional; o app não usa sensor de luz.', '—', X),
  ('1.7', 'Animação de telas', A, '06/30: “Baixo estímulo · sem animações”.', '—', A),
  ('1.8', 'Elementos piscantes', A, 'Nenhuma tela tem elemento piscante; o Baixo estímulo desliga as animações.', '—', A),
  ('1.9', 'Orientação da tela', N, 'Todas as 33 telas são 390 × 844 em retrato.', 'Tela 34 “Hoje (paisagem)” em duas colunas, como padrão para as demais.', A),
  ('1.10', 'Tempo de utilização', N, '15 Feedback some sozinho em 2 s; 23 Excluir dá só 10 s para desfazer. Não há como prolongar.', 'Chave “Avisos sem tempo limite” em 06/30 e aviso no texto de 23.', A),
  ('1.11', 'Idioma', N, 'Só português; não há opção de idioma.', 'Item “Idioma · Português (Brasil)” em 26 Ajustes.', A),
 ]),
 ('2. Texto', [
  ('2.1', 'Tipo de fonte', N, 'Não há escolha de fonte.', 'Item “Fonte” com opção Leitura fácil em 06/30.', A),
  ('2.2', 'Negrito', N, 'Não há opção de negrito para todo o texto.', 'Chave “Texto em negrito” em 06/30.', A),
  ('2.3', 'Tamanho de fonte', A, '06/30: Normal, Grande, Maior; “O texto cresce até 200% sem cortar nada”.', '—', A),
  ('2.4', 'Cor da fonte', N, 'A cor do texto só muda com o alto contraste.', 'Escolher a cor do texto dentro de “Tema de cores” (proposta, não desenhada).', N),
  ('2.5', 'Contraste da fonte', A, '06/30 “Alto contraste”; todo texto ≥ 4,5:1 (requisito RNF08).', '—', A),
  ('2.6', 'Espaçamento da fonte', N, 'Não há ajuste de entrelinha nem de espaçamento.', 'Item “Espaçamento do texto” (Normal, Amplo) em 06/30.', A),
 ]),
 ('3. Som', [
  ('3.1', 'Silenciar todos os efeitos sonoros', A, 'O app não toca som por padrão; 24 Lembrete: “Som suave” vem desmarcado.', '—', A),
  ('3.2', 'Mecanismo de controle de áudio', X, 'O app não reproduz áudio contínuo.', '—', X),
  ('3.3', 'Áudio de fundo', X, 'Não há áudio de fundo.', '—', X),
  ('3.4', 'Leitor de tela', A, '06/30: “Ler mensagens em voz”; as camadas têm nome para o leitor do sistema.', '—', A),
  ('3.5', 'Leitor de tela – Velocidade da fala', N, 'A leitura em voz do próprio app não tem controle de velocidade.', 'Item “Voz e velocidade” em 06/30.', A),
  ('3.6', 'Leitor de tela – Timbre da fala', N, 'A leitura em voz do app não permite escolher a voz.', 'Item “Voz e velocidade” em 06/30.', A),
  ('3.7', 'Leitor de tela – Leitura de todo o conteúdo', X, 'Recurso do leitor de tela do sistema.', '—', X),
  ('3.8', 'Leitor de tela – Como falar a pontuação', X, 'Recurso do leitor de tela do sistema.', '—', X),
  ('3.9', 'Leitor de tela – Falar o texto do item em foco', A, 'Camadas nomeadas por função e estado: “Hábito: Ler 1 página (feito)”, “Aba: Hoje (atual)”, “Botão: Novo”.', 'Melhoria: rótulo visível nos campos de 03 e 07.', A),
  ('3.10', 'Leitor de tela – Letras e palavras em maiúsculo', X, 'Recurso do leitor de tela do sistema.', '—', X),
  ('3.11', 'Leitor de tela – Ler cabeçalhos de tabelas', N, '25 Progresso: o calendário de 4 semanas é uma tabela, mas as células se chamam só “Dia praticado”, sem dia nem semana.', 'Nomear cada célula (“Segunda, semana 1: praticado”) e descrever a leitura na tela 35.', A),
  ('3.12', 'Leitor de tela – Número de linhas e colunas', N, 'O calendário não informa que tem 4 linhas e 7 colunas.', 'Anúncio “Últimas 4 semanas, tabela, 4 linhas e 7 colunas” (tela 35).', A),
  ('3.13', 'Leitor de tela – Indicar emojis', X, 'O app não usa emojis.', '—', X),
  ('3.14', 'Modo de leitura ao digitar', X, 'Recurso do teclado e do leitor do sistema.', '—', X),
  ('3.15', 'Falar a palavra inteira ao digitar', X, 'Recurso do teclado e do leitor do sistema.', '—', X),
 ]),
 ('4. Vídeo', [(f'4.{i}', n, X, 'O app não tem vídeos.', '—', X) for i, n in enumerate([
  'Legenda – Ativar ou desativar', 'Legenda – Fonte e estilo preferidos', 'Legenda – Tamanho da fonte',
  'Legenda – Cor e opacidade da fonte', 'Legenda – Cor de fundo e opacidade da caixa',
  'Ativar a janela de Libras nos vídeos', 'Audiodescrição'], 1)]),
 ('5. Zoom', [
  ('5.1', 'Ativar o zoom', N, 'Não há ampliação dentro do app; só o tamanho do texto.', 'Permitir ampliar com dois dedos nas telas (proposta, não desenhada).', N),
  ('5.2', 'Seguir o foco de seleção', X, 'Recurso da lupa do sistema.', '—', X),
  ('5.3', 'Exibir controle do zoom na tela', N, 'Não há controle de zoom.', 'Botão de lupa opcional (proposta, não desenhada).', N),
  ('5.4', 'Visibilidade do controle do zoom', X, 'Não existe controle de zoom próprio.', '—', X),
  ('5.5', 'Janela de ampliação e ampliação máxima', X, 'Recurso da lupa do sistema.', '—', X),
 ]),
 ('6. Entrada de dados', [
  ('6.1', 'Modelo do cursor', X, 'App de toque, sem cursor de ponteiro.', '—', X),
  ('6.2', 'Visualização do cursor', X, 'App de toque, sem cursor de ponteiro.', '—', X),
  ('6.3', 'Ação de cada tipo de toque', A, 'Tudo funciona com toque simples; nada exige arrastar, toque duplo ou longo.', '—', A),
  ('6.4', 'Intervalo de tempo de um toque', X, 'Configuração do sistema.', '—', X),
  ('6.5', 'Duração de um toque longo', X, 'O app não usa toque longo.', '—', X),
  ('6.6', 'Aumentar a área clicável em volta de um ícone', A, 'Áreas medidas: linha do hábito 342 × 68, “+ 1 copo” 84 × 44, “Novo” 96 × 48, Voltar 48 × 48, abas 90 × 64, teclas do PIN 72 × 72.', '—', A),
  ('6.7', 'Destacar o campo em edição', A, '03 e 07: campo em edição com borda de 2 px #4338CA (≈ 9:1 sobre branco).', 'Melhoria: borda de 3 px, cursor visível e rótulo acima do campo.', A),
  ('6.8', 'Preenchimento automático por tipo de campo', X, 'O app só pede um apelido; não há nome, e-mail ou telefone.', '—', X),
  ('6.9', 'Campo obrigatório com cor diferente', X, 'Um campo por tela; nenhum obrigatório marcado por cor.', '—', X),
  ('6.10', 'Digitação por toque direto', X, 'Recurso do teclado do sistema.', '—', X),
  ('6.11', 'Digitação com confirmação de voz', X, 'Recurso do teclado e do leitor do sistema.', '—', X),
  ('6.12', 'Digitação datilográfica', X, 'Recurso do teclado do sistema.', '—', X),
 ]),
 ('7. Notificações e alertas', [
  ('7.1', 'Ouvir notificações pelo leitor de tela', A, '24 Lembrete: canal “Leitura em voz”.', '—', A),
  ('7.2', 'Piscar o flash para alertas', N, '24 Lembrete oferece vibração, aviso, som e voz, mas nenhum alerta luminoso.', 'Canal “Piscar o flash” em 24.', A),
  ('7.3', 'Feedback sonoro sobre ações', N, 'Concluir um hábito dá retorno visual e vibração opcional, sem som.', 'Chave “Som ao concluir” em 06/30.', A),
 ]),
 ('8. Gestos', [
  ('8.1', 'Controle do app por gestos configuráveis', A, 'Nenhuma tarefa exige gesto ou movimento do aparelho; Voltar é sempre um botão visível.', '—', A),
 ]),
]

# conferência contra o relatório anterior (feito só pelo vídeo)
PREV = {'1.10': A, '3.4': N, '3.5': X, '3.6': X, '3.9': N, '3.11': X, '3.12': X, '6.6': N, '6.7': N, '6.11': N, '7.1': N, '7.2': X}
MOTIVO = {
 '1.10': 'Há limites de tempo: o “Feito!” some em 2 s e o desfazer dura 10 s.',
 '3.4': 'A opção “Ler mensagens em voz” existe em 06/30.',
 '3.5': 'O app tem leitura em voz própria, então velocidade é aplicável.',
 '3.6': 'Mesmo motivo de 3.5: a voz é do app.',
 '3.9': 'As camadas do Penpot têm nome por função e estado.',
 '3.11': 'O calendário de 25 Progresso é uma tabela de 4 × 7.',
 '3.12': 'Mesmo motivo de 3.11.',
 '6.6': 'A área clicável é a linha inteira (342 × 68), não só o círculo de 40 px; “Novo” tem 96 × 48.',
 '6.7': 'Os campos já têm borda de destaque de 2 px na cor #4338CA.',
 '6.11': 'Confirmação de voz ao digitar é do teclado do sistema, como 6.10 e 6.12.',
 '7.1': 'O lembrete tem o canal “Leitura em voz”.',
 '7.2': 'O app pode oferecer o flash como canal do lembrete, útil para pessoas surdas.',
}

PAIRS = [
 ('acess0', 'acess0_2col', 'Acessibilidade (06/30)', '1.1, 1.2, 1.3, 1.4, 1.10, 2.1, 2.2, 2.6, 3.5, 3.6, 7.3', 'Painel ampliado em quatro grupos: Texto, Cores, Movimento e tempo, Som e vibração. A tela agora rola; à direita, a tela dividida em duas partes.'),
 ('perfil0', 'perfil0', 'Perfil · primeiro uso (03)', '6.7, 3.9', 'Rótulo “Apelido” visível, borda de 3 px e cursor no campo em edição.'),
 ('p1', 'p1', 'Novo hábito 1 de 3 (07)', '6.7, 3.9', 'Rótulo “Nome do hábito”, borda de 3 px e cursor.'),
 ('ajustes', 'ajustes', 'Ajustes (26)', '1.11', 'Novo item “Idioma”.'),
 ('lembrete', 'lembrete', 'Lembrete (24)', '7.2', 'Novo canal “Piscar o flash”.'),
 ('excluir', 'excluir', 'Excluir hábito (23)', '1.10', 'O texto avisa que dá para tirar o limite de 10 s.'),
 ('hoje', 'hoje_land', 'Hoje → Hoje em paisagem (11 → 34)', '1.9', 'Mesmo conteúdo em duas colunas para o celular deitado.'),
 ('prog', 'leitor', 'Progresso → Leitor de tela (25 → 35)', '3.9, 3.11, 3.12', 'Células do calendário com dia, semana e estado; a tela 35 mostra o que o leitor fala. A aparência de 25 não muda.'),
]

LACUNAS = [
 ('Alta', '1.10 Tempo de utilização', 'WCAG 2.2.1', 'Quem lê devagar ou usa leitor de tela perde o “Feito!” e o desfazer de 10 s.', 'Chave “Avisos sem tempo limite”.'),
 ('Alta', '3.11 e 3.12 Calendário para leitor de tela', 'WCAG 1.3.1', 'Para quem é cego, o progresso vira 28 vezes “Dia praticado”, sem dia nem semana.', 'Nomear as células e anunciar 4 linhas e 7 colunas.'),
 ('Alta', '2.1, 2.2 e 2.6 Fonte, negrito e espaçamento', 'WCAG 1.4.12', 'Pessoas com dislexia e baixa visão só podiam aumentar o tamanho.', 'Fonte de leitura fácil, negrito e espaçamento amplo.'),
 ('Média', '1.1 a 1.4 Cores da tela', 'WCAG 1.4.8', 'Sensibilidade à luz e daltonismo dependiam só do alto contraste.', 'Tema de cores, inverter, reduzir o branco e filtro.'),
 ('Média', '7.2 e 7.3 Redundância sensorial', 'NBR 17060 1.1.20', 'Lembrete sem alerta luminoso para pessoas surdas; conclusão sem som para pessoas cegas.', 'Canal “Piscar o flash” e “Som ao concluir”.'),
 ('Média', '1.9 Orientação da tela', 'WCAG 1.3.4', 'Quem usa o celular preso a um suporte ou cadeira de rodas fica na horizontal.', 'Tela Hoje em paisagem.'),
 ('Média', '3.5 e 3.6 Voz e velocidade', '—', 'A leitura em voz do app não se ajustava a cada pessoa.', 'Item “Voz e velocidade”.'),
 ('Baixa', '1.11 Idioma', 'WCAG 3.1.1', 'Sem opção de idioma.', 'Item “Idioma” em Ajustes.'),
 ('Baixa', '2.4, 5.1 e 5.3 Cor do texto e zoom', 'WCAG 1.4.4', 'A lupa do sistema e o tamanho do texto cobrem parte.', 'Proposta registrada, não desenhada.'),
]

def cnt(i):
    return Counter(r[i] for _, rows in D for r in rows)

def badge(s):
    c = {A: '#E5F4E4;color:#1E5B23', N: '#FBEBEB;color:#8A1F24', X: '#F0EFEC;color:#4A4A46'}[s]
    return f'<span class="b" style="background:{c}">{s}</span>'

esc = html.escape
rows_html = ''
for cat, rows in D:
    rows_html += f'<h3>{esc(cat)} ({len(rows)})</h3><table><tr><th style="width:15%">Diretriz</th><th style="width:11%">Situação</th><th style="width:37%">Evidência</th><th style="width:26%">Correção proposta</th><th style="width:11%">Depois</th></tr>'
    for i, n, s, ev, co, dp in rows:
        rows_html += f'<tr><td><b>{i}</b> {esc(n)}</td><td>{badge(s)}</td><td>{esc(ev)}</td><td>{esc(co)}</td><td>{badge(dp)}</td></tr>'
    rows_html += '</table>'

cats = ''
for cat, rows in D:
    c0 = Counter(r[2] for r in rows); c1 = Counter(r[5] for r in rows)
    cats += f'<tr><td>{esc(cat)}</td><td>{len(rows)}</td><td>{c0[A]}</td><td>{c0[N]}</td><td>{c0[X]}</td><td>{c1[A]}</td><td>{c1[N]}</td></tr>'
b, a = cnt(2), cnt(5)
cats += f'<tr class="tot"><td>Total</td><td>60</td><td>{b[A]}</td><td>{b[N]}</td><td>{b[X]}</td><td>{a[A]}</td><td>{a[N]}</td></tr>'

allrows = {r[0]: r for _, rows in D for r in rows}
conf = ''.join(f'<tr><td><b>{k}</b> {esc(allrows[k][1])}</td><td>{badge(PREV[k])}</td><td>{badge(allrows[k][2])}</td><td>{esc(MOTIVO[k])}</td></tr>' for k in PREV)

lac = ''.join(f'<tr><td>{p}</td><td>{esc(d)}</td><td>{w}</td><td>{esc(q)}</td><td>{esc(c)}</td></tr>' for p, d, w, q, c in LACUNAS)

pairs = ''
for bf, af, title, dirs, what in PAIRS:
    pairs += f'''<div class="pair"><div class="ph"><b>{esc(title)}</b><span class="dir">MobileDU {dirs}</span></div><p class="what">{esc(what)}</p>
    <div class="imgs"><figure><figcaption>Antes</figcaption><img src="antes/{bf}.png"></figure><figure><figcaption>Depois</figcaption><img src="depois/{af}.png"></figure></div></div>'''

prompts = open(os.path.join(os.path.dirname(__file__), 'prompts.md')).read()
blocks = re.findall(r'## (.+?)\n\n```\n(.*?)```', prompts, re.S)
prom = ''.join(f'<h3>{esc(t)}</h3><pre>{esc(b)}</pre>' for t, b in blocks)

H = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Auditoria MobileDU · MicroRotina</title><style>
@page {{ size: A4; margin: 16mm 14mm; }}
body {{ font: 10pt/1.4 "Helvetica Neue", Arial, sans-serif; color: #1A1A1A; }}
h1 {{ font-size: 20pt; margin: 0 0 4px; }} h2 {{ font-size: 14pt; margin: 22px 0 8px; color: #4338CA; page-break-after: avoid; }}
h3 {{ font-size: 11pt; margin: 14px 0 6px; page-break-after: avoid; }}
.sub {{ color: #5C5C58; margin: 0 0 14px; }}
table {{ width: 100%; border-collapse: collapse; margin-bottom: 8px; }}
th, td {{ border: 1px solid #E7E7E2; padding: 4px 6px; vertical-align: top; text-align: left; }}
th {{ background: #F6F6F3; font-size: 9pt; }} td {{ font-size: 9pt; }} tr {{ page-break-inside: avoid; }}
tr.tot td {{ font-weight: 700; background: #F6F6F3; }}
.b {{ display: inline-block; padding: 1px 6px; border-radius: 8px; font-size: 8.5pt; font-weight: 700; white-space: nowrap; }}
.pair {{ page-break-inside: avoid; margin: 0 0 18px; }}
.ph {{ display: flex; justify-content: space-between; gap: 8px; border-bottom: 2px solid #4338CA; padding-bottom: 3px; }}
.dir {{ color: #4338CA; font-weight: 700; font-size: 9pt; }}
.what {{ margin: 4px 0 6px; color: #3A3A36; }}
.imgs {{ display: flex; gap: 14px; align-items: flex-start; }}
figure {{ margin: 0; flex: 1; text-align: center; }} figcaption {{ font-weight: 700; font-size: 9pt; margin-bottom: 3px; }}
figure img {{ max-width: 100%; max-height: 118mm; border: 1px solid #D5DBE8; }}
pre {{ white-space: pre-wrap; background: #F6F6F3; border: 1px solid #E7E7E2; padding: 8px; font-size: 8.5pt; }}
.pb {{ page-break-before: always; }}
</style></head><body>
<h1>Auditoria MobileDU · Protótipo MicroRotina</h1>
<p class="sub">Trabalho do Grupo 18 · 19/11/2026 · Biblioteca MobileDU (Coletto, 2026), skill mobiledu-diretrizes do Intera/UFABC</p>
<p><b>Método.</b> As 60 diretrizes foram verificadas no próprio protótipo: telas exportadas e especificação das telas, com textos, medidas em px e nomes das camadas. Cada resultado foi conferido contra a tela citada (prompt 2). O relatório anterior, feito só a partir do vídeo, tinha 12 situações que mudaram na conferência (seção 3).</p>
<h2>1. Resumo</h2>
<table><tr><th>Categoria</th><th>Diretrizes</th><th>Atende</th><th>Não atende</th><th>Não se aplica</th><th>Atende depois</th><th>Não atende depois</th></tr>{cats}</table>
<p>A versão acessível corrige {b[N] - a[N]} das {b[N]} diretrizes não atendidas. Ficam como proposta, sem desenho: 2.4 cor da fonte, 5.1 e 5.3 zoom no app.</p>
<h2>2. Lacunas priorizadas</h2>
<table><tr><th>Prioridade</th><th>Diretriz</th><th>WCAG / norma</th><th>Quem é afetado</th><th>Correção</th></tr>{lac}</table>
<h2>3. Conferência: o que a IA tinha errado</h2>
<table><tr><th>Diretriz</th><th>Relatório anterior</th><th>Após conferência</th><th>Motivo</th></tr>{conf}</table>
<h2 class="pb">4. Relatório diretriz por diretriz</h2>{rows_html}
<h2 class="pb">5. Telas antes e depois</h2>{pairs}
<h2 class="pb">6. Prompts usados</h2>
<p>O pedido do enunciado foi refinado em três etapas: auditar, conferir e gerar a versão acessível.</p>{prom}
</body></html>'''
open(os.path.join(os.path.dirname(__file__), 'relatorio.html'), 'w').write(H)
print('antes', dict(b), 'depois', dict(a))
