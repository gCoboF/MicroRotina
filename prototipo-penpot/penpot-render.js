// Renderer do Penpot: lê buildSpec() e cria boards, formas, textos, grupos, interações e fluxos.
// Concatenado depois de spec.js pelo build.sh, gerando plugin.js.

penpot.ui.open('MicroRotina · Gerador de protótipo', 'index.html?theme=' + penpot.theme, { width: 320, height: 300 });

function say(type, text) {
  try { penpot.ui.sendMessage({ type: type, text: text }); } catch (e) { /* janela do plugin indisponível */ }
}

function trySet(shape, key, value) {
  try { shape[key] = value; } catch (e) { /* propriedade não suportada nesta versão */ }
}

function applyBox(shape, el, ox, oy) {
  try { shape.resize(el.w, el.h); } catch (e) { /* ignora */ }
  shape.x = ox + el.x;
  shape.y = oy + el.y;
}

function paint(shape, el) {
  if (el.t !== 'text') {
    shape.fills = el.fill ? [{ fillColor: el.fill, fillOpacity: el.op == null ? 1 : el.op }] : [];
    if (el.stroke) shape.strokes = [{ strokeColor: el.stroke, strokeWidth: el.sw || 1, strokeAlignment: 'inner' }];
    if (el.r) trySet(shape, 'borderRadius', el.r);
  }
}

async function drawEl(el, board, ox, oy, pending) {
  let shape = null;
  if (el.t === 'group') {
    const kids = [];
    for (const c of el.children.slice().reverse()) {
      const s = await drawEl(c, board, ox, oy, pending);
      if (s) kids.push(s);
    }
    if (!kids.length) return null;
    shape = penpot.group(kids);
    if (shape) {
      shape.name = el.name;
      if (el.action) pending.push([shape, el.action]);
    }
    return shape;
  }
  if (el.t === 'svg') {
    try { shape = await Promise.resolve(penpot.createShapeFromSvg(el.svg)); } catch (e) { shape = null; }
    if (!shape) return null;
    board.appendChild(shape);
    // o Penpot usa o viewBox do SVG como tamanho; ajusta para o tamanho pedido
    try { shape.resize(el.w, el.h); } catch (e) { /* ignora */ }
    shape.x = ox + el.x;
    shape.y = oy + el.y;
    shape.name = el.name;
    return shape;
  }
  if (el.t === 'rect') shape = penpot.createRectangle();
  else if (el.t === 'ellipse') shape = penpot.createEllipse();
  else if (el.t === 'text') shape = await Promise.resolve(penpot.createText(el.text));
  if (!shape) return null;

  board.appendChild(shape);
  applyBox(shape, el, ox, oy);
  if (el.t === 'text') {
    trySet(shape, 'growType', 'fixed');
    applyBox(shape, el, ox, oy);
    trySet(shape, 'fontSize', String(el.size));
    trySet(shape, 'fontWeight', String(el.weight));
    trySet(shape, 'lineHeight', String(el.lh || 1.25));
    trySet(shape, 'align', el.align);
    trySet(shape, 'verticalAlign', el.valign);
    trySet(shape, 'fills', [{ fillColor: el.color }]);
    shape.name = el.text.length > 40 ? el.text.slice(0, 40) + '…' : el.text;
  } else {
    paint(shape, el);
    shape.name = el.name || (el.t === 'rect' ? 'Retângulo' : 'Círculo');
  }
  if (el.rot) trySet(shape, 'rotation', el.rot);
  if (el.t === 'text' && el.name) shape.name = el.name;
  return shape;
}

function makeAction(a, boards) {
  if (a.back) return { type: 'previous-screen' };
  const dest = boards[a.to];
  if (!dest) return null;
  return { type: 'navigate-to', destination: dest };
}

async function generate() {
  const spec = buildSpec();
  const boards = {};
  const pending = [];
  const page = penpot.currentPage;
  let n = 0;

  // Cada board novo vai para o topo da lista e o ▶ começa pelo topo:
  // cria de trás para frente (documentação primeiro) para Boas-vindas ficar no topo.
  const isDoc = (b) => b.id === 'doc' || b.id === 'nuvi';
  const ordered = spec.boards.filter((b) => !isDoc(b)).concat(spec.boards.filter(isDoc)).reverse();
  for (const b of ordered) {
    n++;
    say('status', 'Desenhando ' + b.name + ' (' + n + '/' + spec.boards.length + ')…');
    const board = penpot.createBoard();
    board.name = b.name;
    board.x = b.x; board.y = b.y;
    board.resize(b.w, b.h);
    board.fills = [{ fillColor: b.fill, fillOpacity: 1 }];
    trySet(board, 'clipContent', true);
    boards[b.id] = board;
    // appendChild põe cada forma nova por baixo das anteriores: desenha de trás para frente
    for (const el of b.els.slice().reverse()) await drawEl(el, board, b.x, b.y, pending);
    if (b.after) pending.push([board, b.after]);
  }

  say('status', 'Ligando interações…');
  let links = 0;
  for (const p of pending) {
    const shape = p[0], a = p[1];
    const act = makeAction(a, boards);
    if (!act) continue;
    try {
      if (a.delay) shape.addInteraction('after-delay', act, a.delay);
      else shape.addInteraction('click', act);
      links++;
    } catch (e) { say('status', 'Falha numa interação: ' + e.message); }
  }

  for (const f of spec.flows) {
    try { page.createFlow(f.name, boards[f.start]); } catch (e) { say('status', 'Falha ao criar fluxo: ' + e.message); }
  }

  try {
    const lib = penpot.library.local;
    Object.keys(spec.colors).forEach(function (k) {
      const c = lib.createColor();
      c.name = 'MicroRotina/' + k;
      c.color = spec.colors[k];
    });
  } catch (e) { /* paleta é opcional */ }

  try { penpot.viewport.zoomToFitAll(); } catch (e) { /* ignora */ }
  say('done', 'Pronto: ' + spec.boards.length + ' telas, ' + links + ' interações, 2 fluxos. Clique em Present (▶) para navegar.');
}

let running = false;
async function run() {
  if (running) return;
  running = true;
  try { await generate(); }
  catch (e) { say('error', 'Erro: ' + (e && e.message ? e.message : String(e))); }
  finally { running = false; }
}

penpot.ui.onMessage(function (msg) {
  if (msg === 'generate' || (msg && msg.type === 'generate')) run();
});

// Página vazia: gera sozinho, para funcionar mesmo se a janela do plugin não carregar.
function pageIsEmpty() {
  try {
    const root = penpot.currentPage.root;
    return !root || !root.children || root.children.length === 0;
  } catch (e) { return false; }
}
setTimeout(function () { if (pageIsEmpty()) run(); }, 800);
