# MicroRotina · protótipo navegável no Penpot

Plugin do Penpot que desenha 23 telas (mais 1 board de rastreabilidade), com grupos nomeados, paleta, interações e 2 fluxos.

## Como usar

1. Subir o servidor local (deixe rodando):

   ```bash
   python3 "/Users/gcobof/MicroHabit - IHC/penpot-plugin/server.py"
   ```

2. No Penpot, abra um arquivo com uma página vazia.
3. `Ctrl+Alt+P` (Mac: `Cmd+Alt+P`) abre o gerenciador de plugins. Cole a URL `http://localhost:4400/manifest.json` e instale.
4. Abra o plugin. Numa página vazia ele gera sozinho; se a janela do plugin aparecer, também dá para clicar em **Gerar protótipo**.
5. Clique em **Present** (▶) no canto superior direito. Escolha o fluxo **1 · Primeiro uso** ou **2 · Dia a dia**.

## Prévia sem Penpot

`http://localhost:4400/preview.html` navega o mesmo protótipo no navegador. `?all=1` mostra todas as telas.

## Editar

Altere `spec.js`, rode `sh build.sh` e gere de novo no Penpot (numa página vazia).
