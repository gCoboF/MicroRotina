# Prompts usados na auditoria MobileDU

O pedido sugerido no enunciado ("Usando a skill MobileDU, audite este protótipo diretriz por diretriz.") foi refinado em três prompts. O primeiro faz a auditoria, o segundo confere os resultados no protótipo e o terceiro gera a versão acessível.

## Prompt 1 · Auditoria

```
Usando a skill MobileDU (Coletto, 2026), audite o protótipo MicroRotina diretriz por diretriz.

Material: as telas exportadas do protótipo (numeradas de 01 a 33, com o nome de cada uma) e a especificação das telas, com textos, tamanhos em px e os destinos de cada toque. Considere só o que aparece nesse material.

Para cada uma das 60 diretrizes, nas 8 categorias (Ambiente, Texto, Som, Vídeo, Zoom, Entrada de dados, Notificações e alertas, Gestos), informe:
1. Diretriz: número e nome.
2. Situação: Atende, Não atende ou Não se aplica.
3. Evidência: número e nome da tela e o elemento exato (texto, controle, medida). Sem evidência na tela, não marque Atende.
4. Correção proposta: o que mudar e em qual tela. Use "—" quando atende.

Regras de decisão:
- Antes de marcar Não atende, procure a opção em todas as telas, inclusive Ajustes, Acessibilidade e Lembrete.
- Use Não se aplica só quando o app não tem aquele tipo de conteúdo (vídeo, tabela, áudio contínuo) ou quando o recurso é exclusivo do sistema operacional. Diga qual dos dois casos é.
- Meça alvos de toque pela área clicável do grupo, não pelo ícone desenhado. O mínimo é 44 × 44 px.
- Cite o critério WCAG 2.2 relacionado quando houver.

Entregue:
- uma tabela por categoria;
- um resumo com totais por situação e por categoria;
- as 5 lacunas mais importantes, em ordem de prioridade (alta, média, baixa), com o motivo: quem é afetado e quão grave é.
```

## Prompt 2 · Conferência

```
Confira cada linha da auditoria contra as telas e a especificação. A IA pode errar.

Para cada diretriz:
- abra a tela citada como evidência e confirme que o elemento existe e tem a medida informada;
- quando a conclusão mudar, registre o que estava errado e a situação corrigida.

No fim, liste as diretrizes cuja situação mudou, com o motivo de cada mudança.
```

## Prompt 3 · Versão acessível

```
Com base na auditoria conferida, gere a versão acessível do protótipo MicroRotina, corrigindo as lacunas de prioridade alta e média.

Regras:
- mantenha o estilo visual (cor de destaque #4338CA, fonte, Nuvi), a linguagem acolhedora e os fluxos existentes;
- cada mudança precisa citar a diretriz MobileDU que a justifica;
- não remova funções nem textos que já atendem a outras diretrizes.

Entregue:
- as telas alteradas;
- uma lista "antes → depois" com a tela, o que mudou e a diretriz que justifica.
```
