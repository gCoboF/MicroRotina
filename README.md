# MicroRotina · Grupo 18 (IHC · UFABC 2026.3)

App de micro-hábitos de 2 a 5 minutos para quem tem uma rotina que muda o tempo todo. Ele conta o total de dias praticados, sem sequência para perder; esquecer um dia não zera nada. A mascote Nuvi acompanha a pessoa e a meta se ajusta à energia do dia. Funciona sem cadastro, e os dados ficam no celular.

**Integrantes:** Gabriel Cobo Figueiro, Raul Vitor Carvalho Genaro, Leticia do Carmo Melo, Lucas Kenzo Oshima Matsuda.

## Links

- **App funcionando:** https://gcobof.github.io/MicroRotina/ (toque em "Ver com dados de exemplo" para ver como no protótipo)
- **Protótipo navegável (mesmas telas do Penpot):** https://gcobof.github.io/MicroRotina/prototipo/preview.html
- **Relatório da auditoria MobileDU:** https://gcobof.github.io/MicroRotina/auditoria/relatorio.html
- **Trello:** https://trello.com/invite/b/6aabdd25a49eb5504bd887f2/ATTI5638e08335bfdb53d4e41b4ef861f3acE9E8C8A6/ihc

## O que tem aqui

| Pasta ou arquivo | Conteúdo |
| --- | --- |
| `app/` | Front-end em React + TypeScript: as telas do protótipo funcionando, com 14 modos de acessibilidade reais. Veja o [README do app](app/README.md). |
| `prototipo-penpot/` | Plugin que gera o protótipo no Penpot e a prévia em HTML. Veja o [README do protótipo](prototipo-penpot/README.md). |
| `auditoria-mobiledu/` | Auditoria das 60 diretrizes MobileDU, telas antes e depois, prompts usados e o PDF entregue. |
| `video/` | Vídeo do pitch (4:19) e legendas. |
| `Requisitos_MicroRotina_Grupo18 -  v2.pdf` | Documento de requisitos. |
| `Mapa de Barreiras - Atividade 6.3.pdf` | Mapa de barreiras de acessibilidade. |
| `IHC 4.2.pdf`, `canvas_grupo18.pptx` | Entregas anteriores e canvas do projeto. |

## Como rodar o app

```bash
cd app
npm install
npm run dev
```

Abra `http://localhost:5173`. Para gerar a versão final, rode `npm run build`; a pasta `app/dist` é estática.

## Publicação

A cada push na `main`, o workflow `.github/workflows/pages.yml` gera o app e publica no GitHub Pages, junto com o protótipo e o relatório da auditoria.

Este repositório parte do [repositório original do grupo](https://github.com/LeticiadCM/IHC_projeto), com o histórico preservado.
