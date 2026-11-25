// Spec das telas do MicroRotina (microHabit) — Grupo 18, IHC UFABC.
// Fonte única: gera o protótipo no Penpot (plugin) e a prévia em HTML (preview.html).
// Ações: {to:'idDoBoard'} navega, {back:true} volta à tela anterior.

function buildSpec() {
  const W = 390, H = 844;
  // Paleta enxuta: neutros + 1 cor de destaque. A Nuvi é o único elemento ilustrado.
  const C = {
    bg: '#FFFFFF', surface: '#F6F6F3', ink: '#1A1A1A', sub: '#5C5C58',
    mute: '#6B6B66', line: '#E7E7E2',
    accent: '#4338CA', accentSoft: '#EEEDFB',
    pipo: '#FFD66E', cheek: '#F4A98C',
    white: '#FFFFFF', scrim: '#111111'
  };

  // Ícones de traço (24×24, stroke 2)
  const ICONS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 16v-4M12 16V8M17 16v-7"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    type: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    contrast: '<circle cx="12" cy="12" r="10"/><path d="M12 2v20"/>',
    wave: '<path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/>',
    volume: '<path d="M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M3 8v8M21 8v8"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    bellOff: '<path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"/><path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="m2 2 20 20"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    wind: '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    sunrise: '<path d="M12 2v6M4.9 10.9l1.4 1.4M2 18h2M20 18h2M17.7 12.3l1.4-1.4M22 22H2M16 18a4 4 0 0 0-8 0M8 6l4-4 4 4"/>'
  };

  let E = [];
  const R = (x, y, w, h, o) => E.push(Object.assign({ t: 'rect', x, y, w, h, fill: C.white }, o || {}));
  const O = (x, y, w, h, o) => E.push(Object.assign({ t: 'ellipse', x, y, w, h, fill: C.white }, o || {}));
  const T = (x, y, w, h, text, o) => E.push(Object.assign({ t: 'text', x, y, w, h, text, size: 17, weight: 400, color: C.ink, align: 'left', valign: 'top' }, o || {}));
  const I = (x, y, name, color, s) => {
    s = s || 24;
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || C.ink) + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + '</svg>';
    E.push({ t: 'svg', x, y, w: s, h: s, svg, name: 'Ícone ' + name });
  };
  const G = (name, action, fn) => {
    const parent = E; E = [];
    fn();
    const kids = E; E = parent;
    E.push({ t: 'group', name, action, children: kids });
  };

  // ---------- Nuvi, a nuvem ----------
  // Desenhada como um único SVG (corpo + rosto), para ficar nítida no Penpot.
  const NUVI_MOODS = {
    hello: 'Olá!', happy: 'Feliz', proud: 'Orgulhosa', cheer: 'Comemorando', wink: 'Piscando',
    curious: 'Curiosa', calm: 'Tranquila', peace: 'Em paz', tired: 'Cansada', sleepy: 'Dormindo',
    cozy: 'Aconchego', sunny: 'Sol saindo', concern: 'Atenta'
  };
  const spark = (x, y, r) => '<path d="M' + x + ' ' + (y - r) + ' Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y + r)
    + ' Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + ' Z" fill="' + C.accent + '"/>';
  const nuviSvg = (mood, s) => {
    const ink = C.ink, k = 'stroke="' + ink + '" stroke-width="3" stroke-linecap="round" fill="none"';
    const body = { sleepy: '#EEF0F5', tired: '#F3F4F7' }[mood] || '#FFFFFF';
    const eyeO = (cx, cy) => '<ellipse cx="' + cx + '" cy="' + cy + '" rx="4" ry="6" fill="' + ink + '"/>';
    const arcUp = (cx) => '<path d="M' + (cx - 5) + ' 70 Q' + cx + ' 62 ' + (cx + 5) + ' 70" ' + k + '/>';
    const arcDown = (cx) => '<path d="M' + (cx - 5) + ' 68 Q' + cx + ' 73 ' + (cx + 5) + ' 68" ' + k + '/>';
    const half = (cx) => '<path d="M' + (cx - 5) + ' 67 h10" ' + k + '/>' + '<ellipse cx="' + cx + '" cy="70" rx="4" ry="3" fill="' + ink + '"/>';
    const cheeks = '<ellipse cx="42" cy="79" rx="6" ry="3" fill="#F4A98C" opacity=".6"/><ellipse cx="82" cy="79" rx="6" ry="3" fill="#F4A98C" opacity=".6"/>';
    const m = {
      smile: '<path d="M55 79 Q62 86 69 79" ' + k + '/>',
      soft: '<path d="M57 81 Q62 84 67 81" ' + k + '/>',
      big: '<path d="M52 78 Q62 94 72 78 Z" fill="' + ink + '" stroke="' + ink + '" stroke-width="2" stroke-linejoin="round"/><ellipse cx="62" cy="86" rx="5" ry="2.5" fill="#F4A98C"/>',
      o: '<ellipse cx="62" cy="81" rx="3.5" ry="4.5" fill="' + ink + '"/>',
      flat: '<path d="M57 82 h10" ' + k + '/>',
      wavy: '<path d="M55 82 q3.5 -3 7 0 t7 0" ' + k + '/>'
    };
    const eyeS = (cx, cy) => '<ellipse cx="' + cx + '" cy="' + cy + '" rx="5" ry="7" fill="' + ink + '"/><circle cx="' + (cx + 1.6) + '" cy="' + (cy - 2.6) + '" r="1.8" fill="#FFFFFF"/>';
    let back = '', face = '', extra = '';
    switch (mood) {
      case 'hello':
        face = eyeS(50, 67) + eyeS(74, 67)
          + '<path d="M55 78 Q62 89 69 78 Z" fill="' + ink + '" stroke="' + ink + '" stroke-width="2" stroke-linejoin="round"/><ellipse cx="62" cy="84" rx="3.5" ry="2" fill="#F4A98C"/>'
          + '<ellipse cx="40" cy="79" rx="7" ry="3.5" fill="#F4A98C" opacity=".75"/><ellipse cx="84" cy="79" rx="7" ry="3.5" fill="#F4A98C" opacity=".75"/>';
        extra = '<path d="M13 80 Q4 74 6 62 M105 80 Q114 74 112 62" ' + k + '/>' + spark(20, 36, 6) + spark(100, 22, 7) + spark(114, 44, 4);
        break;
      case 'peace':
        face = arcDown(50) + arcDown(74) + m.soft + cheeks;
        extra = '<path d="M108 8 A12 12 0 1 0 118 26 A11 11 0 0 1 108 8 Z" fill="#FFD66E" stroke="' + ink + '" stroke-width="2.5" stroke-linejoin="round"/>'
          + spark(18, 30, 5) + spark(32, 14, 3.5) + spark(92, 40, 3);
        break;
      case 'proud': face = arcUp(50) + arcUp(74) + m.smile + cheeks; break;
      case 'cheer':
        face = arcUp(50) + arcUp(74) + m.big + cheeks;
        extra = '<path d="M11 66 L3 52 M110 64 L117 50" ' + k + '/><path d="M18 22 v8 M14 26 h8 M104 16 v8 M100 20 h8" stroke="' + C.accent + '" stroke-width="3" stroke-linecap="round"/>';
        break;
      case 'wink': face = eyeO(50, 68) + arcUp(74) + m.smile + cheeks; break;
      case 'curious':
        face = '<ellipse cx="50" cy="68" rx="5" ry="7" fill="' + ink + '"/>' + eyeO(74, 68) + '<path d="M67 56 L81 53" ' + k + '/>' + m.o;
        extra = '<path d="M100 24 q8 -8 14 0 q2 6 -6 9 v4" stroke="' + C.accent + '" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="108" cy="44" r="2" fill="' + C.accent + '"/>';
        break;
      case 'calm': face = arcDown(50) + arcDown(74) + m.soft + cheeks; break;
      case 'tired': face = half(50) + half(74) + m.flat; break;
      case 'sleepy':
        face = arcDown(50) + arcDown(74) + '<ellipse cx="62" cy="81" rx="3" ry="2.5" fill="' + ink + '"/>';
        extra = '<path d="M90 18 h9 l-9 9 h9 M104 6 h6 l-6 6 h6" stroke="' + C.accent + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
        break;
      case 'cozy':
        face = arcUp(46) + arcUp(66) + '<path d="M51 80 Q56 84 61 80" ' + k + '/>' + '<ellipse cx="38" cy="79" rx="6" ry="3" fill="#F4A98C" opacity=".6"/>';
        extra = '<path d="M98 84 q9 0 9 7 t-9 7" stroke="' + ink + '" stroke-width="3" fill="none"/>'
          + '<rect x="72" y="78" width="26" height="24" rx="5" fill="#FFD66E" stroke="' + ink + '" stroke-width="3"/>'
          + '<path d="M80 72 q-3 -5 0 -9 M89 72 q-3 -5 0 -9" stroke="' + C.accent + '" stroke-width="2.5" stroke-linecap="round" fill="none"/>';
        break;
      case 'sunny':
        back = '<circle cx="90" cy="34" r="16" fill="#FFD66E" stroke="' + ink + '" stroke-width="3"/><path d="M90 8 v6 M112 34 h6 M106 16 l4 -4" stroke="' + ink + '" stroke-width="3" stroke-linecap="round"/>';
        face = arcUp(50) + arcUp(74) + m.smile + cheeks;
        break;
      case 'concern':
        face = eyeO(50, 69) + eyeO(74, 69) + '<path d="M44 60 Q49 55 55 56 M80 60 Q75 55 69 56" ' + k + '/>' + m.wavy;
        break;
      default: face = eyeO(50, 68) + eyeO(74, 68) + m.smile + cheeks;
    }
    const cloud = '<path d="M30 92 a20 20 0 0 1 2 -40 a26 26 0 0 1 50 -6 a22 22 0 0 1 8 46 z" fill="' + body + '" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s + '" viewBox="0 0 120 120">' + back + cloud + face + extra + '</svg>';
  };
  const nuvi = (x, y, s, mood) => {
    E.push({ t: 'svg', x, y, w: s, h: s, svg: nuviSvg(mood, s), name: 'Nuvi, a nuvem (' + (NUVI_MOODS[mood] || mood) + ')' });
  };

  // ---------- componentes ----------
  const statusBar = () => {
    T(24, 14, 80, 20, '9:41', { size: 15, weight: 700 });
    T(266, 14, 100, 20, '100%', { size: 15, weight: 700, align: 'right' });
  };

  const header = (title, back) => {
    if (back !== false) {
      G('Voltar', { back: true }, () => {
        R(12, 44, 48, 48, { fill: C.white, r: 24, name: 'Área de toque' });
        I(24, 56, 'back', C.ink);
      });
      T(64, 44, 300, 48, title, { size: 18, weight: 700, valign: 'center' });
    } else {
      T(24, 52, 342, 40, title, { size: 28, weight: 700, valign: 'center' });
    }
  };

  const btn = (x, y, w, label, kind, action, h, icon) => {
    h = h || 56;
    const k = {
      primary: { fill: C.accent, stroke: null, color: C.white },
      secondary: { fill: C.white, stroke: C.mute, color: C.ink },
      text: { fill: C.white, stroke: null, color: C.accent }
    }[kind || 'primary'];
    G('Botão: ' + label, action, () => {
      R(x, y, w, h, { fill: k.fill, stroke: k.stroke || undefined, sw: 1.5, r: 14 });
      if (icon) {
        // ícone + texto centralizados juntos no botão
        const tw = Math.round(label.length * 9.2), sx = x + Math.max(12, (w - 28 - tw) / 2);
        I(sx, y + (h - 20) / 2, icon, k.color, 20);
        T(sx + 28, y, tw + 12, h, label, { size: 16, weight: 700, color: k.color, valign: 'center' });
      } else {
        T(x, y, w, h, label, { size: 17, weight: 700, color: k.color, align: 'center', valign: 'center' });
      }
    });
  };

  const toggle = (x, y, on) => {
    R(x, y, 52, 32, { fill: on ? C.accent : C.white, stroke: on ? C.accent : C.mute, sw: 2, r: 16, name: on ? 'Chave ligada' : 'Chave desligada' });
    O(on ? x + 24 : x + 4, y + 4, 24, 24, { fill: on ? C.white : C.mute });
  };

  const card = (y, h, fill) => R(24, y, 342, h, { fill: fill || C.white, stroke: fill ? undefined : C.line, sw: 1, r: 18, name: 'Cartão' });
  const divider = (y, x0) => R(x0 || 40, y, 366 - (x0 || 40), 1, { fill: C.line, name: 'Divisória' });

  // linha de lista dentro de um cartão: right = 'chevron' | 'toggleOn' | 'toggleOff' | null
  const row = (y, h, title, sub, right, action, icon) => {
    G('Item: ' + title, action || null, () => {
      R(24, y, 342, h, { fill: C.white, op: 0.01, name: 'Área de toque' });
      const tx = icon ? 72 : 40;
      if (icon) I(36, y + (h - 24) / 2, icon, C.ink);
      if (sub) {
        T(tx, y + h / 2 - 22, 240, 24, title, { size: 17, weight: 600 });
        T(tx, y + h / 2 + 2, 240, 20, sub, { size: 14, color: C.sub });
      } else T(tx, y, 240, h, title, { size: 17, weight: 600, valign: 'center' });
      if (right === 'chevron') I(334, y + (h - 20) / 2, 'chevron', C.mute, 20);
      if (right === 'toggleOn') toggle(298, y + (h - 32) / 2, true);
      if (right === 'toggleOff') toggle(298, y + (h - 32) / 2, false);
    });
  };

  const list = (y, items, h) => {
    h = h || 64;
    card(y, items.length * h);
    items.forEach((it, i) => {
      if (i) divider(y + i * h, it[4] ? 72 : 40);
      row(y + i * h, h, it[0], it[1], it[2], it[3], it[4]);
    });
    return y + items.length * h;
  };

  const bottomNav = (active) => {
    R(0, 764, W, 80, { fill: C.white, name: 'Barra de navegação' });
    R(0, 764, W, 1, { fill: C.line });
    [['hoje', 'Hoje', 'home', 'hoje'], ['habitos', 'Hábitos', 'calendar', 'meus'], ['prog', 'Progresso', 'chart', 'prog'], ['ajustes', 'Ajustes', 'sliders', 'ajustes']].forEach((it, i) => {
      const x = 8 + i * 94, on = active === it[0];
      G('Aba: ' + it[1] + (on ? ' (atual)' : ''), { to: it[3] }, () => {
        R(x, 768, 90, 64, { fill: C.white, name: 'Área de toque' });
        if (on) R(x + 33, 765, 24, 3, { fill: C.accent, r: 2, name: 'Indicador da aba atual' });
        I(x + 33, 778, it[2], on ? C.accent : C.mute);
        T(x, 806, 90, 20, it[1], { size: 13, weight: on ? 700 : 400, align: 'center', color: on ? C.accent : C.sub });
      });
    });
  };

  const steps = (n) => {
    T(24, 100, 342, 20, 'Passo ' + n + ' de 3', { size: 14, weight: 600, color: C.sub });
    for (let i = 1; i <= 3; i++) R(24 + (i - 1) * 116, 126, 110, 4, { fill: i <= n ? C.accent : C.line, r: 2 });
  };

  const checkCircle = (x, y, state) => {
    if (state === 'done') { O(x, y, 40, 40, { fill: C.accent }); I(x + 10, y + 10, 'check', C.white, 20); }
    else O(x, y, 40, 40, { fill: C.white, stroke: C.mute, sw: 2 });
  };

  // ---------- boards ----------
  const boards = [];
  const board = (id, name, fn, o) => {
    E = [];
    fn();
    boards.push(Object.assign({ id, name, w: W, h: H, fill: C.bg, els: E }, o || {}));
  };

  const HAB = [
    { name: 'Arrumar a cama', meta: '2 min · 07:00' },
    { name: 'Ler 1 página', meta: '3 min · 08:30' },
    { name: 'Alongar o pescoço', meta: '2 min · 15:00' },
    { name: 'Beber água', meta: '1 L · 11:00' },
    { name: 'Respirar fundo 5 vezes', meta: '1 min · 22:00' }
  ];

  const homeContent = (done, waterMl, toast) => {
    const waterDone = waterMl >= 1000;
    statusBar();
    T(24, 56, 260, 20, 'Quarta, 8 de outubro', { size: 15, color: C.sub });
    T(24, 78, 260, 36, 'Bom dia, Ana', { size: 28, weight: 700 });
    nuvi(300, 46, 72, waterDone ? 'proud' : 'happy');
    const todoTo = done >= 4 ? 'tudofeito' : 'feedback';
    card(132, 100, C.surface);
    T(40, 144, 80, 48, '47', { size: 40, weight: 700 });
    T(96, 160, 150, 22, 'dias praticados', { size: 15, color: C.sub });
    T(226, 160, 124, 22, done + ' de 5 hoje', { size: 15, weight: 700, align: 'right' });
    R(40, 204, 310, 6, { fill: C.line, r: 3 });
    R(40, 204, Math.round(310 * done / 5), 6, { fill: C.accent, r: 3 });
    T(24, 252, 200, 36, 'Hoje', { size: 20, weight: 700, valign: 'center' });
    btn(270, 246, 96, 'Novo', 'text', { to: 'biblioteca' }, 48, 'plus');
    const y0 = 300, rh = 68;
    card(y0, rh * 5);
    HAB.forEach((h, i) => {
      const y = y0 + i * rh;
      if (i) divider(y);
      const isWater = i === 3;
      const state = i < 3 || (isWater && waterDone) ? 'done' : isWater ? 'part' : 'todo';
      if (state === 'part') {
        G('Hábito: Beber água (parcial, ' + waterMl + ' ml de 1 L)', { to: 'agua' }, () => {
          R(24, y, 250, rh, { fill: C.white, op: 0.01, name: 'Área de toque' });
          T(40, y + 12, 220, 24, h.name, { size: 17, weight: 600 });
          T(40, y + 36, 220, 20, waterMl + ' ml de 1 L', { size: 14, color: C.sub });
          R(40, y + 58, 200, 4, { fill: C.line, r: 2 });
          R(40, y + 58, Math.round(200 * waterMl / 1000), 4, { fill: C.accent, r: 2 });
        });
        btn(272, y + 12, 84, '+ 1 copo', 'secondary', { to: waterMl >= 750 ? 'feedback' : 'hoje_copo' }, 44);
      } else {
        G('Hábito: ' + h.name + (state === 'done' ? ' (feito)' : ' (a fazer)'), state === 'todo' ? { to: todoTo } : null, () => {
          R(24, y, 342, rh, { fill: C.white, op: 0.01, name: 'Área de toque' });
          T(40, y + 12, 250, 24, h.name, { size: 17, weight: 600 });
          T(40, y + 36, 250, 20, (state === 'done' ? 'Feito · ' : '') + h.meta, { size: 14, color: C.sub });
          checkCircle(314, y + 14, state);
        });
      }
    });
    G('Dia difícil? Fazer só 1 micro-ação', { to: 'dificil' }, () => {
      R(24, 650, 342, 48, { fill: C.white, name: 'Área de toque' });
      I(28, 662, 'moon', C.accent, 22);
      T(60, 650, 280, 48, 'Dia difícil? Fazer só 1 micro-ação', { size: 15, weight: 700, color: C.accent, valign: 'center' });
      I(342, 664, 'chevron', C.accent, 20);
    });
    if (toast) {
      R(24, 650, 342, 100, { fill: C.white, name: 'Fundo do aviso' });
      R(24, 684, 342, 60, { fill: C.ink, r: 14, name: 'Aviso: copo registrado' });
      T(40, 684, 220, 60, '1 copo registrado · ' + waterMl + ' ml', { size: 15, color: C.white, valign: 'center' });
      G('Desfazer copo', { back: true }, () => {
        R(262, 690, 96, 48, { fill: C.ink, r: 10, name: 'Área de toque' });
        T(262, 690, 96, 48, 'Desfazer', { size: 15, weight: 700, color: '#C9C6FF', align: 'center', valign: 'center' });
      });
      return;
    }
    G('Ver painel de transparência', { to: 'painel' }, () => {
      R(24, 704, 342, 48, { fill: C.white, name: 'Área de toque' });
      I(28, 718, 'lock', C.sub, 18);
      T(54, 704, 300, 48, 'Seus dados ficam só neste celular', { size: 14, color: C.sub, valign: 'center' });
    });
  };

  // 01
  board('boasvindas', 'Boas-vindas', () => {
    statusBar();
    O(75, 92, 240, 240, { fill: C.accentSoft, name: 'Halo' });
    nuvi(95, 112, 200, 'hello');
    T(24, 352, 342, 44, 'Oi, eu sou a Nuvi!', { size: 30, weight: 700, align: 'center' });
    T(24, 400, 342, 52, 'Vou te acompanhar no MicroRotina, um passo pequeno de cada vez.', { size: 17, color: C.sub, align: 'center' });
    ['De 2 a 5 minutos por hábito', 'Esqueceu um dia? Nada zera', 'Só um apelido, sem e-mail nem senha'].forEach((s, i) => {
      const y = 484 + i * 40;
      I(56, y + 4, 'check', C.accent, 20);
      T(86, y, 280, 28, s, { size: 16 });
    });
    btn(24, 660, 342, 'Começar', 'primary', { to: 'combinados' });
    G('Privacidade: saiba mais', { to: 'painel' }, () => {
      R(24, 728, 342, 48, { fill: C.white, name: 'Área de toque' });
      T(24, 728, 342, 48, 'Tudo fica no seu celular · Saiba mais', { size: 14, color: C.sub, align: 'center', valign: 'center' });
    });
  });

  // 02
  board('combinados', 'Combinados', () => {
    statusBar(); header('');
    T(24, 100, 342, 76, 'Antes de começar, um acordo entre nós', { size: 26, weight: 700, lh: 1.2 });
    [
      'Seus dados ficam só no seu celular.',
      'Nada vem ligado: lembretes só se você ligar.',
      'Esqueceu um dia? Nada é zerado.',
      'Você exporta ou apaga tudo em até 2 toques.'
    ].forEach((s, i) => {
      const y = 204 + i * 76;
      if (i) R(24, y - 8, 342, 1, { fill: C.line });
      O(24, y + 8, 32, 32, { fill: C.accentSoft });
      T(24, y + 8, 32, 32, String(i + 1), { size: 15, weight: 700, color: C.accent, align: 'center', valign: 'center' });
      T(72, y, 294, 48, s, { size: 17, valign: 'center', lh: 1.25 });
    });
    btn(24, 660, 342, 'Combinado, continuar', 'primary', { to: 'perfil0' });
  });

  // login mínimo: só apelido, guardado no aparelho; bloqueio opcional usa o do próprio celular
  const perfilBoard = (id, name, onboarding, pinOn) => {
    board(id, name, () => {
      statusBar(); header(onboarding ? '' : 'Perfil');
      if (onboarding) {
        // padrão mais privado (só no celular); conta é um caminho secundário e opcional
        nuvi(16, 92, 88, 'happy');
        T(24, 188, 342, 36, 'Como posso te chamar?', { size: 26, weight: 700 });
        T(24, 228, 342, 24, 'Só um apelido, para eu te cumprimentar.', { size: 16, color: C.sub });
        T(24, 258, 342, 20, 'Apelido', { size: 14, weight: 700, color: C.ink });
        R(24, 282, 342, 56, { fill: C.white, stroke: C.accent, sw: 3, r: 14, name: 'Campo de texto: apelido (em edição)' });
        R(40, 298, 2, 24, { fill: C.accent, name: 'Cursor' });
        T(46, 282, 240, 56, 'Ana', { size: 17, valign: 'center' });
        T(290, 282, 62, 56, '3/20', { size: 14, color: C.sub, align: 'right', valign: 'center' });
        I(24, 356, 'shield', C.sub, 18);
        T(50, 352, 316, 44, 'Fica só neste celular. Sem e-mail nem senha.', { size: 14, color: C.sub });
        // switch: desligado abre a criação do PIN; ligado desativa e volta ao estado sem PIN
        list(404, [[
          'Proteger com PIN', pinOn ? 'Ativado · pedido ao abrir o app' : 'Desativado',
          pinOn ? 'toggleOn' : 'toggleOff', { to: pinOn ? 'perfil0' : 'pin' }, 'lock'
        ]], 72);
      } else {
        nuvi(16, 92, 88, 'happy');
        T(24, 188, 342, 36, 'Como posso te chamar?', { size: 26, weight: 700 });
        T(24, 228, 342, 44, 'Só um apelido, para eu te cumprimentar. Fica guardado neste celular.', { size: 16, color: C.sub });
        T(24, 290, 342, 22, 'Apelido', { size: 14, weight: 700, color: C.sub });
        R(24, 318, 342, 56, { fill: C.white, stroke: C.accent, sw: 2, r: 14, name: 'Campo de texto: apelido' });
        T(40, 318, 240, 56, 'Ana', { size: 17, valign: 'center' });
        T(290, 318, 62, 56, '3/20', { size: 14, color: C.sub, align: 'right', valign: 'center' });
        list(398, [['Bloquear o app', 'Com a digital ou o PIN do celular', 'toggleOff', null, 'lock']], 76);
      }
      if (onboarding) {
        btn(24, 660, 342, 'Continuar', 'primary', { to: 'acess0' });
        btn(24, 724, 342, 'Criar conta (ver em outros celulares)', 'text', { to: 'sync' }, 48);
      } else btn(24, 700, 342, 'Salvar', 'primary', { back: true });
    });
  };
  perfilBoard('perfil0', 'Perfil (primeiro uso)', true);
  perfilBoard('perfil0pin', 'Perfil (PIN ativado)', true, true);

  // PIN opcional: protege o app no próprio celular, sem conta
  board('pin', 'Criar PIN', () => {
    statusBar(); header('');
    T(24, 104, 342, 36, 'Crie um PIN', { size: 26, weight: 700, align: 'center' });
    T(24, 144, 342, 44, 'Pedido ao abrir o app. Fica só neste celular.', { size: 16, color: C.sub, align: 'center' });
    for (let i = 0; i < 4; i++) {
      const x = 135 + i * 32;
      O(x, 216, 18, 18, { fill: i < 2 ? C.accent : C.white, stroke: C.accent, sw: 2, name: i < 2 ? 'Dígito preenchido' : 'Dígito vazio' });
    }
    T(24, 250, 342, 22, '2 de 4 dígitos', { size: 14, color: C.sub, align: 'center' });
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].forEach((k, i) => {
      if (!k) return;
      const x = 51 + (i % 3) * 108, y = 300 + Math.floor(i / 3) * 84;
      G('Tecla ' + (k === '⌫' ? 'apagar' : k), null, () => {
        O(x, y, 72, 72, { fill: k === '⌫' ? C.white : C.surface, name: 'Área de toque' });
        T(x, y, 72, 72, k, { size: 26, weight: 600, align: 'center', valign: 'center' });
      });
    });
    btn(24, 660, 342, 'Confirmar PIN', 'primary', { to: 'perfil0pin' });
    btn(24, 724, 342, 'Usar a digital do celular', 'text', { to: 'perfil0pin' }, 48);
  });

  // acessibilidade
  const accessBoard = (id, name, onboarding) => {
    board(id, name, () => {
      statusBar(); header(onboarding ? '' : 'Acessibilidade');
      if (onboarding) {
        T(24, 100, 342, 68, 'Como fica melhor para você?', { size: 26, weight: 700, lh: 1.2 });
        T(24, 170, 342, 24, 'Tudo opcional. Dá para mudar depois.', { size: 16, color: C.sub });
      } else T(24, 100, 342, 66, 'Ajuste o app do seu jeito.', { size: 16, color: C.sub });
      T(24, 212, 342, 22, 'Tamanho do texto', { size: 14, weight: 700, color: C.sub });
      [['Normal', 16, true], ['Grande', 21, false], ['Maior', 26, false]].forEach((s, i) => {
        const x = 24 + i * 118;
        G('Tamanho: ' + s[0] + (s[2] ? ' (selecionado)' : ''), null, () => {
          R(x, 240, 106, 76, { fill: s[2] ? C.accentSoft : C.white, stroke: s[2] ? C.accent : C.line, sw: s[2] ? 2 : 1, r: 14 });
          T(x, 248, 106, 36, 'Aa', { size: s[1], weight: 700, color: s[2] ? C.accent : C.ink, align: 'center', valign: 'center' });
          T(x, 284, 106, 22, s[0], { size: 14, weight: s[2] ? 700 : 400, color: s[2] ? C.accent : C.sub, align: 'center' });
        });
      });
      // MobileDU: texto (2.1, 2.2, 2.6), cores (1.1–1.5, 2.4), movimento e tempo (1.7, 1.10), som (3.4–3.6, 7.3)
      list(332, [
        ['Fonte', 'Padrão · Leitura fácil disponível', 'chevron', null, 'type'],
        ['Texto em negrito', 'Desligado', 'toggleOff', null, 'book'],
        ['Espaçamento do texto', 'Normal · Amplo ajuda na dislexia', 'chevron', null, 'layout']
      ], 64);
      T(24, 532, 342, 24, 'O texto cresce até 200% sem cortar nada.', { size: 14, color: C.sub });
      T(24, 576, 342, 22, 'CORES', { size: 13, weight: 700, color: C.sub });
      list(604, [
        ['Alto contraste', 'Desligado', 'toggleOff', null, 'contrast'],
        ['Tema de cores', 'Claro · Creme · Escuro', 'chevron', null, 'sun'],
        ['Inverter cores', 'Desligado', 'toggleOff', null, 'eye'],
        ['Reduzir o branco', 'Cores menos brilhantes', 'toggleOff', null, 'sunrise'],
        ['Filtro para daltonismo', 'Nenhum', 'chevron', null, 'droplet']
      ], 64);
      T(24, 944, 342, 22, 'MOVIMENTO E TEMPO', { size: 13, weight: 700, color: C.sub });
      list(972, [
        ['Baixo estímulo', 'Desligado · sem animações', 'toggleOff', null, 'wave'],
        ['Avisos sem tempo limite', 'Desligado · ficam até você fechar', 'toggleOff', null, 'clock']
      ], 64);
      T(24, 1120, 342, 22, 'SOM E VIBRAÇÃO', { size: 13, weight: 700, color: C.sub });
      list(1148, [
        ['Ler mensagens em voz', 'Desligado', 'toggleOff', null, 'volume'],
        ['Voz e velocidade', 'Voz 1 · velocidade normal', 'chevron', null, 'activity'],
        ['Som ao concluir', 'Desligado', 'toggleOff', null, 'bell'],
        ['Vibrar ao concluir', 'Desligado', 'toggleOff', null, 'phone']
      ], 64);
      if (onboarding) {
        btn(24, 1424, 342, 'Continuar', 'primary', { to: 'p1' });
        btn(24, 1488, 342, 'Pular por agora', 'text', { to: 'p1' }, 48);
      } else btn(24, 1424, 342, 'Salvar', 'primary', { back: true });
    }, { h: onboarding ? 1560 : 1500 });
  };
  accessBoard('acess0', 'Acessibilidade (primeiro uso)', true);

  // 04-06 criação
  board('p1', 'Novo hábito 1 de 3', () => {
    statusBar(); header('Novo hábito'); steps(1);
    T(24, 152, 342, 36, 'O que você quer fazer?', { size: 26, weight: 700 });
    T(24, 192, 342, 24, 'Algo pequeno, de 2 a 5 minutos.', { size: 16, color: C.sub });
    T(24, 222, 342, 20, 'Nome do hábito', { size: 14, weight: 700, color: C.ink });
    R(24, 246, 342, 56, { fill: C.white, stroke: C.accent, sw: 3, r: 14, name: 'Campo de texto: nome do hábito (em edição)' });
    R(40, 262, 2, 24, { fill: C.accent, name: 'Cursor' });
    T(46, 246, 240, 56, 'Ler 1 página', { size: 17, valign: 'center' });
    T(290, 246, 62, 56, '12/40', { size: 14, color: C.sub, align: 'right', valign: 'center' });
    list(318, [['Dividir em partes', 'Ex.: 1 L de água em copos de 250 ml', 'toggleOff', null]], 76);
    T(24, 408, 342, 44, 'Opcional. Fazer só uma parte já conta como dia praticado.', { size: 14, color: C.sub });
    btn(24, 462, 342, 'Ver ideias prontas', 'text', { to: 'biblioteca' }, 48);
    btn(24, 724, 342, 'Próximo', 'primary', { to: 'p2' });
  });

  board('p2', 'Novo hábito 2 de 3', () => {
    statusBar(); header('Novo hábito'); steps(2);
    T(24, 152, 342, 36, 'Quando você vai fazer?', { size: 26, weight: 700 });
    R(24, 204, 342, 52, { fill: C.surface, r: 14, name: 'Antes ou depois' });
    G('Antes de', null, () => T(28, 208, 165, 44, 'Antes de', { size: 16, color: C.sub, align: 'center', valign: 'center' }));
    G('Depois de (selecionado)', null, () => {
      R(197, 208, 165, 44, { fill: C.accentSoft, stroke: C.accent, sw: 2, r: 11 });
      T(197, 208, 165, 44, 'Depois de', { size: 16, weight: 700, color: C.accent, align: 'center', valign: 'center' });
    });
    ['Acordar', 'Tomar café', 'Almoçar', 'Jantar', 'Dormir', 'Hora exata'].forEach((s, i) => {
      const x = 24 + (i % 2) * 175, y = 272 + Math.floor(i / 2) * 64, sel = i === 2;
      G('Momento: ' + s + (sel ? ' (selecionado)' : ''), null, () => {
        R(x, y, 167, 56, { fill: C.white, stroke: sel ? C.accent : C.line, sw: sel ? 2 : 1, r: 14 });
        T(x + 16, y, 120, 56, s, { size: 16, weight: sel ? 700 : 400, color: sel ? C.accent : C.ink, valign: 'center' });
        if (sel) I(x + 135, y + 18, 'check', C.accent, 20);
      });
    });
    T(24, 476, 342, 22, 'Horário aproximado', { size: 14, weight: 700, color: C.sub });
    card(504, 80);
    T(40, 504, 160, 80, '13:30', { size: 34, weight: 700, valign: 'center' });
    G('Diminuir horário', null, () => { R(238, 520, 48, 48, { fill: C.white, stroke: C.mute, sw: 1.5, r: 24 }); I(250, 532, 'minus', C.ink); });
    G('Aumentar horário', null, () => { R(302, 520, 48, 48, { fill: C.white, stroke: C.mute, sw: 1.5, r: 24 }); I(314, 532, 'plus', C.ink); });
    T(24, 594, 342, 44, 'Depois de almoçar, sugerimos 13:30. Você muda quando quiser.', { size: 14, color: C.sub });
    btn(24, 724, 342, 'Próximo', 'primary', { to: 'p3' });
  });

  board('p3', 'Novo hábito 3 de 3', () => {
    statusBar(); header('Novo hábito'); steps(3);
    T(24, 152, 342, 36, 'Quase pronto', { size: 26, weight: 700 });
    card(204, 92, C.surface);
    T(40, 218, 300, 26, 'Ler 1 página', { size: 18, weight: 700 });
    I(40, 252, 'clock', C.sub, 16);
    T(62, 248, 290, 24, 'Depois de almoçar · 13:30 · 3 min', { size: 15, color: C.sub });
    nuvi(296, 132, 70, 'wink');
    O(24, 324, 48, 48, { fill: C.accentSoft, name: 'Fundo do ícone' });
    I(36, 336, 'bell', C.accent, 24);
    T(88, 322, 278, 28, 'Quer um lembrete?', { size: 20, weight: 700 });
    T(88, 350, 278, 24, 'Você decide. Nenhuma opção vem marcada.', { size: 15, color: C.sub });
    T(24, 400, 342, 22, 'Assim ele vai aparecer', { size: 14, weight: 700, color: C.sub });
    R(24, 428, 342, 84, { fill: C.surface, r: 20, name: 'Prévia da notificação' });
    R(40, 442, 40, 40, { fill: C.accent, r: 11, name: 'Ícone do app' });
    nuvi(40, 442, 40, 'happy');
    T(88, 442, 200, 20, 'MicroRotina', { size: 13, weight: 700, color: C.sub });
    T(290, 442, 60, 20, '13:30', { size: 13, color: C.sub, align: 'right' });
    T(88, 462, 262, 40, 'Hora de ler 1 página. Leva 3 min, sem pressa.', { size: 15, lh: 1.25 });
    btn(24, 660, 167, 'Sim, me avise', 'secondary', { to: 'lembrete' }, 56, 'bell');
    btn(199, 660, 167, 'Agora não', 'secondary', { to: 'hoje' }, 56, 'bellOff');
    T(24, 726, 342, 44, 'As duas opções salvam o hábito. Dá para mudar depois.', { size: 14, color: C.sub, align: 'center' });
  });

  // 07
  board('checkin', 'Check-in de energia', () => {
    statusBar();
    nuvi(16, 60, 96, 'curious');
    T(24, 164, 342, 76, 'Como está sua energia hoje, Ana?', { size: 26, weight: 700, lh: 1.2 });
    T(24, 244, 342, 44, 'Não tem resposta certa. A meta se ajusta ao seu dia.', { size: 16, color: C.sub });
    const opts = [
      ['Com energia', 'Até 5 micro-hábitos', 'happy', 'hoje'],
      ['Cansado(a)', 'Só os essenciais', 'tired', 'hoje'],
      ['Esgotado(a)', 'Só 1 micro-ação de 2 min', 'sleepy', 'dificil']
    ];
    card(304, 80 * opts.length);
    opts.forEach((o, i) => {
      const y = 304 + i * 80;
      if (i) divider(y, 96);
      G('Energia: ' + o[0], { to: o[3] }, () => {
        R(24, y, 342, 80, { fill: C.white, op: 0.01, name: 'Área de toque' });
        nuvi(32, y + 8, 60, o[2]);
        T(100, y + 16, 220, 24, o[0], { size: 17, weight: 600 });
        T(100, y + 42, 220, 20, o[1], { size: 14, color: C.sub });
        I(334, y + 30, 'chevron', C.mute, 20);
      });
    });
    btn(24, 560, 342, 'Agora não', 'text', { to: 'hoje' }, 48);
  });

  // 08
  board('hoje', 'Hoje', () => { homeContent(3, 500); bottomNav('hoje'); });
  board('hoje_copo', 'Hoje (+1 copo)', () => { homeContent(3, 750, true); bottomNav('hoje'); });

  // água em partes: 1 ação principal; desfazer fica no aviso
  const waterBoard = (id, name, ml, next, toast) => {
    board(id, name, () => {
      statusBar(); header('Beber água');
      T(24, 116, 342, 60, ml + ' ml', { size: 48, weight: 700, align: 'center' });
      T(24, 176, 342, 24, 'de 1 L hoje', { size: 16, color: C.sub, align: 'center' });
      const n = ml / 250;
      for (let i = 0; i < 4; i++) {
        const x = 51 + i * 76, full = i < n, nextCup = i === n;
        const draw = () => {
          R(x, 228, 60, 84, { fill: full ? C.accent : C.white, stroke: full ? C.accent : C.mute, sw: nextCup ? 2 : 1.5, r: 12, name: full ? 'Copo registrado' : 'Copo vazio' });
          if (full) I(x + 18, 258, 'check', C.white, 24);
          if (nextCup) I(x + 18, 258, 'plus', C.accent, 24);
        };
        if (nextCup) G('Registrar este copo', { to: next }, draw); else draw();
      }
      T(24, 324, 342, 22, 'Cada copo tem 250 ml. Toque no próximo para registrar.', { size: 14, color: C.sub, align: 'center' });
      card(370, 60, C.surface);
      T(40, 370, 310, 60, 'Meio caminho já conta como dia praticado.', { size: 15, valign: 'center' });
      btn(24, 456, 342, ml >= 750 ? 'Registrar o último copo' : 'Registrar 1 copo', 'primary', { to: next }, 56, 'plus');
      btn(24, 520, 342, 'Outra quantidade', 'text', null, 48);
      I(24, 594, 'bell', C.sub, 18);
      T(50, 590, 316, 44, 'Lembretes às 11:00, 14:00 e 17:00', { size: 14, color: C.sub });
      if (toast) {
        R(24, 760, 342, 60, { fill: C.ink, r: 14, name: 'Aviso: copo registrado' });
        T(40, 760, 220, 60, '1 copo registrado', { size: 15, color: C.white, valign: 'center' });
        G('Desfazer copo', { back: true }, () => {
          R(262, 766, 96, 48, { fill: C.ink, r: 10, name: 'Área de toque' });
          T(262, 766, 96, 48, 'Desfazer', { size: 15, weight: 700, color: '#C9C6FF', align: 'center', valign: 'center' });
        });
      }
    });
  };
  waterBoard('agua', 'Água (500 ml)', 500, 'agua2');
  waterBoard('agua2', 'Água (750 ml)', 750, 'feedback', true);

  // feedback
  board('feedback', 'Feedback de conclusão', () => {
    homeContent(3, 500);
    R(0, 0, W, H, { fill: C.scrim, op: 0.45, name: 'Fundo escurecido' });
    R(24, 528, 342, 292, { fill: C.white, r: 28, name: 'Painel inferior' });
    R(175, 540, 40, 4, { fill: C.line, r: 2 });
    nuvi(145, 548, 100, 'cheer');
    T(40, 660, 310, 34, 'Feito!', { size: 26, weight: 700, align: 'center' });
    T(40, 696, 310, 44, 'Um passo de cada vez. Hoje já conta.', { size: 16, color: C.sub, align: 'center' });
    btn(40, 748, 310, 'Continuar', 'primary', { to: 'hoje2' }, 52);
  }, { after: { to: 'hoje2', delay: 2000 } });
  board('hoje2', 'Hoje (atualizado)', () => { homeContent(4, 1000); bottomNav('hoje'); });

  // Modo "Tudo feito": a Home vira uma tela calma quando os 5 hábitos do dia acabam
  board('tudofeito', 'Hoje · tudo feito', () => {
    statusBar();
    T(24, 56, 342, 20, 'Quarta, 8 de outubro', { size: 15, color: C.sub, align: 'center' });
    nuvi(105, 92, 180, 'peace');
    T(24, 272, 342, 36, 'Tudo feito por hoje, Ana', { size: 26, weight: 700, align: 'center' });
    T(24, 312, 342, 48, 'Agora o resto do dia é seu. Amanhã a gente continua.', { size: 16, color: C.sub, align: 'center' });
    R(105, 376, 180, 36, { fill: C.white, r: 18, name: 'Selo' });
    T(105, 376, 180, 36, '48 dias praticados', { size: 15, weight: 700, color: C.accent, align: 'center', valign: 'center' });
    R(24, 432, 342, 204, { fill: C.white, r: 18, name: 'Resumo do dia' });
    HAB.forEach((h, i) => {
      const y = 444 + i * 36;
      I(40, y + 8, 'check', C.accent, 20);
      T(72, y, 220, 36, h.name, { size: 15, valign: 'center' });
      T(290, y, 60, 36, h.meta.split(' · ')[0], { size: 13, color: C.sub, align: 'right', valign: 'center' });
    });
    I(24, 660, 'moon', C.sub, 18);
    T(50, 656, 316, 44, 'Lembretes em silêncio até amanhã, 07:00.', { size: 14, color: C.sub });
    bottomNav('hoje');
  }, { fill: '#F4F3FA' });

  // Dia difícil: acolhedor, com escolha e opção de só descansar
  board('dificil', 'Modo Dia Difícil', () => {
    statusBar(); header('');
    nuvi(135, 84, 120, 'cozy');
    T(24, 214, 342, 36, 'Hoje vamos com calma', { size: 26, weight: 700, align: 'center' });
    T(24, 252, 342, 48, 'Dias assim fazem parte. Se quiser, escolha só uma coisa pequena.', { size: 16, color: C.sub, align: 'center' });
    const opts = [['Respirar fundo 5 vezes', '1 min', true], ['Beber 1 copo d’água', '1 min', false], ['Alongar os ombros', '1 min', false]];
    card(324, 64 * opts.length);
    opts.forEach((o, i) => {
      const y = 324 + i * 64;
      if (i) divider(y);
      G('Opção: ' + o[0] + (o[2] ? ' (selecionada)' : ''), null, () => {
        R(24, y, 342, 64, { fill: C.white, op: 0.01, name: 'Área de toque' });
        T(40, y + 10, 250, 24, o[0], { size: 17, weight: o[2] ? 700 : 400 });
        T(40, y + 34, 250, 20, o[1], { size: 14, color: C.sub });
        O(322, y + 20, 24, 24, { fill: C.white, stroke: o[2] ? C.accent : C.mute, sw: 2 });
        if (o[2]) O(328, y + 26, 12, 12, { fill: C.accent });
      });
    });
    btn(24, 532, 342, 'Fazer agora', 'primary', { to: 'feedback' });
    btn(24, 596, 342, 'Hoje só quero descansar', 'text', { to: 'descanso' }, 48);
    T(24, 660, 342, 44, 'Os outros hábitos esperam por amanhã. Nada se perde.', { size: 14, color: C.sub, align: 'center' });
    bottomNav('hoje');
  });

  board('descanso', 'Descanso', () => {
    statusBar(); header('');
    nuvi(125, 150, 140, 'sleepy');
    T(24, 316, 342, 76, 'Descansar também é cuidar de você', { size: 26, weight: 700, align: 'center', lh: 1.2 });
    T(24, 400, 342, 48, 'Seus hábitos voltam amanhã, do jeito que estavam.', { size: 16, color: C.sub, align: 'center' });
    btn(24, 724, 342, 'Voltar para Hoje', 'secondary', { to: 'hoje' });
  });

  // agenda
  board('meus', 'Meus hábitos', () => {
    statusBar(); header('Meus hábitos', false);
    const rh = 60;
    const sect = (y, label, icon) => { I(24, y, icon, C.sub, 18); T(50, y, 316, 20, label.toUpperCase(), { size: 13, weight: 700, color: C.sub, valign: 'center' }); };
    // semana atual: o calendário que dá contexto à agenda
    I(24, 104, 'calendar', C.accent, 20);
    T(52, 104, 300, 20, 'Outubro · esta semana', { size: 15, weight: 700, valign: 'center' });
    R(24, 132, 342, 68, { fill: C.surface, r: 16, name: 'Semana' });
    ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].forEach((d, i) => {
      const x = 28 + i * 48, today = i === 2;
      if (today) R(x + 2, 138, 44, 56, { fill: C.accent, r: 12, name: 'Hoje' });
      T(x, 142, 48, 18, d, { size: 12, color: today ? C.white : C.sub, align: 'center' });
      T(x, 162, 48, 24, String(6 + i), { size: 17, weight: 700, color: today ? C.white : C.ink, align: 'center' });
    });
    const agenda = (y, items) => {
      card(y, items.length * rh);
      items.forEach((it, i) => {
        const yy = y + i * rh;
        if (i) divider(yy, 96);
        G('Hábito: ' + it[1] + ' às ' + it[0] + (it[2] ? ', lembrete ligado' : ', sem lembrete'), { to: 'detalhe' }, () => {
          R(24, yy, 342, rh, { fill: C.white, op: 0.01, name: 'Área de toque' });
          T(40, yy, 52, rh, it[0], { size: 15, weight: 700, valign: 'center' });
          T(96, yy, 170, rh, it[1], { size: 16, valign: 'center' });
          if (it[2]) { I(284, yy + 20, 'bell', C.sub, 18); T(306, yy, 52, rh, 'Ligado', { size: 13, color: C.sub, valign: 'center' }); }
          else {
            R(266, yy + 14, 92, 32, { fill: C.accentSoft, r: 16, name: 'Definir lembrete' });
            I(276, yy + 22, 'plus', C.accent, 16);
            T(294, yy + 14, 60, 32, 'Lembrete', { size: 13, weight: 700, color: C.accent, valign: 'center' });
          }
        });
      });
      return y + items.length * rh;
    };
    sect(216, 'Manhã', 'sunrise');
    agenda(242, [['07:00', 'Arrumar a cama', true], ['08:30', 'Ler 1 página', false]]);
    sect(376, 'Tarde', 'sun');
    agenda(402, [['11:00', 'Beber água', true], ['15:00', 'Alongar o pescoço', true]]);
    sect(536, 'Noite', 'moon');
    agenda(562, [['22:00', 'Respirar fundo', true]]);
    T(24, 630, 342, 20, '5 de 5 ativos. O limite evita sobrecarga.', { size: 14, color: C.sub });
    btn(24, 660, 167, 'Ideias prontas', 'secondary', { to: 'biblioteca' }, 52);
    btn(199, 660, 167, 'Criar do zero', 'primary', { to: 'p1' }, 52, 'plus');
    bottomNav('habitos');
  });

  // biblioteca
  board('biblioteca', 'Ideias prontas', () => {
    statusBar(); header('Ideias prontas');
    T(24, 100, 342, 24, 'Escolha uma e ajuste do seu jeito.', { size: 16, color: C.sub });
    // filtros por tema
    let cx = 24;
    [['Todas', true], ['Corpo', false], ['Mente', false], ['Casa', false]].forEach((f) => {
      const w = f[0].length * 9 + 30;
      G('Filtro: ' + f[0] + (f[1] ? ' (selecionado)' : ''), null, () => {
        R(cx, 136, w, 44, { fill: f[1] ? C.accent : C.white, stroke: f[1] ? undefined : C.line, sw: 1, r: 22 });
        T(cx, 136, w, 44, f[0], { size: 15, weight: f[1] ? 700 : 400, color: f[1] ? C.white : C.ink, align: 'center', valign: 'center' });
      });
      cx += w + 8;
    });
    const rh = 76, y0 = 200;
    const items = [
      ['Beber 1 L de água', 'Em partes, o dia todo', '1 min', 'droplet'],
      ['Alongar o corpo', 'Antes do trabalho', '2 min', 'activity'],
      ['Revisar 1 parágrafo', 'Depois de estudar', '3 min', 'book'],
      ['Respirar fundo 5 vezes', 'Antes de dormir', '1 min', 'wind'],
      ['Pausa de tela', 'A cada hora', '1 min', 'monitor'],
      ['Organizar a mesa', 'Ao terminar o dia', '3 min', 'layout']
    ];
    card(y0, rh * items.length);
    items.forEach((it, i) => {
      const y = y0 + i * rh;
      if (i) divider(y, 88);
      O(36, y + 16, 44, 44, { fill: C.accentSoft, name: 'Fundo do ícone' });
      I(46, y + 26, it[3], C.accent, 24);
      T(92, y + 14, 200, 24, it[0], { size: 16, weight: 600 });
      T(92, y + 40, 200, 20, it[1] + ' · ' + it[2], { size: 14, color: C.sub });
      G('Adicionar: ' + it[0], { to: 'p2' }, () => {
        R(306, y + 14, 48, 48, { fill: C.white, stroke: C.accent, sw: 1.5, r: 24, name: 'Área de toque' });
        I(318, y + 26, 'plus', C.accent, 24);
      });
    });
    btn(24, 700, 342, 'Criar do zero', 'secondary', { to: 'p1' });
  });

  // detalhe
  board('detalhe', 'Detalhe do hábito', () => {
    statusBar(); header('Ler 1 página');
    G('Lembrete: 08:30, ligado. Ajustar', { to: 'lembrete' }, () => {
      card(104, 96, C.surface);
      T(40, 116, 200, 20, 'Lembrete', { size: 14, weight: 700, color: C.sub });
      T(40, 138, 160, 44, '08:30', { size: 32, weight: 700 });
      T(170, 146, 160, 22, 'Ligado · vibração', { size: 14, color: C.sub, align: 'right' });
      I(334, 142, 'chevron', C.mute, 20);
    });
    list(216, [
      ['Quando', 'Depois de tomar café', null, null],
      ['Duração', '3 minutos', null, null],
      ['Versão de dia difícil', 'Ler só 1 frase', null, null]
    ], 64);
    btn(24, 436, 342, 'Editar', 'secondary', { to: 'p1' });
    btn(24, 502, 342, 'Pausar, sem perder nada', 'secondary', { to: 'meus' });
    btn(24, 568, 342, 'Excluir', 'secondary', { to: 'excluir' });
    T(24, 640, 342, 44, 'Excluir leva 2 toques, o mesmo de criar. Dá para desfazer por 10 s.', { size: 14, color: C.sub });
  });

  // excluir
  board('excluir', 'Excluir hábito', () => {
    statusBar(); header('');
    T(24, 120, 342, 76, 'Excluir “Ler 1 página”?', { size: 26, weight: 700, lh: 1.2 });
    T(24, 200, 342, 76, 'Ele sai da lista. Seus dias praticados continuam guardados. Você terá 10 s para desfazer, ou sem limite se ligar “Avisos sem tempo limite”.', { size: 16, color: C.sub });
    btn(24, 656, 342, 'Excluir', 'secondary', { to: 'meus' });
    btn(24, 722, 342, 'Manter', 'secondary', { back: true });
  });

  // lembrete
  board('lembrete', 'Lembrete', () => {
    statusBar(); header('Lembrete');
    T(24, 100, 342, 24, 'Ler 1 página · depois de almoçar', { size: 16, color: C.sub });
    list(140, [['Lembrete ligado', 'Desligar leva 1 toque', 'toggleOn', null, 'bell']], 72);
    T(24, 236, 342, 22, 'Horário', { size: 14, weight: 700, color: C.sub });
    card(264, 80);
    T(40, 264, 160, 80, '13:30', { size: 34, weight: 700, valign: 'center' });
    G('Diminuir horário', null, () => { R(238, 280, 48, 48, { fill: C.white, stroke: C.mute, sw: 1.5, r: 24 }); I(250, 292, 'minus', C.ink); });
    G('Aumentar horário', null, () => { R(302, 280, 48, 48, { fill: C.white, stroke: C.mute, sw: 1.5, r: 24 }); I(314, 292, 'plus', C.ink); });
    T(24, 366, 342, 22, 'Como avisar', { size: 14, weight: 700, color: C.sub });
    const rh = 56, y0 = 394;
    const ch = [['Vibração', true], ['Aviso na tela', true], ['Som suave', false], ['Leitura em voz', false], ['Piscar o flash', false]];
    card(y0, rh * ch.length);
    ch.forEach((c, i) => {
      const y = y0 + i * rh;
      if (i) divider(y);
      G('Canal: ' + c[0] + (c[1] ? ' (selecionado)' : ' (não selecionado)'), null, () => {
        R(24, y, 342, rh, { fill: C.white, op: 0.01, name: 'Área de toque' });
        T(40, y, 240, rh, c[0], { size: 16, valign: 'center' });
        R(326, y + 16, 24, 24, { fill: c[1] ? C.accent : C.white, stroke: c[1] ? C.accent : C.mute, sw: 2, r: 6 });
        if (c[1]) I(329, y + 19, 'check', C.white, 18);
      });
    });
    btn(24, 724, 342, 'Salvar', 'primary', { to: 'hoje' });
  });

  // progresso
  board('prog', 'Progresso', () => {
    statusBar(); header('Progresso', false);
    card(104, 128, C.surface);
    T(40, 116, 120, 56, '47', { size: 48, weight: 700 });
    T(40, 172, 200, 22, 'dias praticados', { size: 15, color: C.sub });
    nuvi(270, 108, 88, 'sunny');
    T(40, 204, 310, 20, 'Cada um deles foi você cuidando de você.', { size: 14, color: C.sub });
    T(24, 256, 342, 22, 'Últimas 4 semanas', { size: 14, weight: 700, color: C.sub });
    ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].forEach((d, i) => T(32 + i * 48, 286, 40, 20, d, { size: 13, color: C.sub, align: 'center' }));
    const pat = ['dddddpd', 'ddpdddd', 'dddpddd', 'ddhffff'];
    pat.forEach((rw, r) => rw.split('').forEach((c, i) => {
      const x = 38 + i * 48, y = 314 + r * 40;
      const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
      const nm = dias[i] + ', semana ' + (r + 1) + ': ' + { d: 'praticado', p: 'descanso', h: 'hoje', f: 'dia futuro' }[c];
      if (c === 'd') O(x, y, 28, 28, { fill: C.accent, name: nm });
      if (c === 'p') O(x, y, 28, 28, { fill: C.white, stroke: C.mute, sw: 2, name: nm });
      if (c === 'h') { O(x - 3, y - 3, 34, 34, { fill: C.white, stroke: C.accent, sw: 2, name: nm }); O(x + 8, y + 8, 12, 12, { fill: C.accent }); }
      if (c === 'f') O(x + 10, y + 10, 8, 8, { fill: C.line, name: nm });
    }));
    O(24, 478, 14, 14, { fill: C.accent }); T(44, 474, 90, 22, 'Praticado', { size: 13, color: C.sub });
    O(132, 478, 14, 14, { fill: C.white, stroke: C.mute, sw: 2 }); T(152, 474, 110, 22, 'Descanso', { size: 13, color: C.sub });
    O(268, 478, 14, 14, { fill: C.white, stroke: C.accent, sw: 2 }); T(288, 474, 60, 22, 'Hoje', { size: 13, color: C.sub });
    T(24, 520, 342, 22, 'Próximo marco', { size: 14, weight: 700, color: C.sub });
    card(548, 92);
    T(40, 562, 220, 24, '50 dias', { size: 18, weight: 700 });
    T(220, 562, 130, 24, 'faltam 3', { size: 15, color: C.sub, align: 'right' });
    R(40, 600, 310, 6, { fill: C.line, r: 3 });
    R(40, 600, 291, 6, { fill: C.accent, r: 3 });
    T(40, 612, 310, 20, 'Mais 3 dias praticados e a gente celebra junto.', { size: 13, color: C.sub });
    card(656, 92, C.accentSoft);
    I(40, 672, 'star', C.accent, 22);
    T(74, 668, 280, 22, 'A Nuvi reparou', { size: 14, weight: 700, color: C.accent });
    T(74, 690, 280, 44, 'Ler 1 página é o seu hábito mais firme: 31 dias. Isso é constância de verdade.', { size: 14, lh: 1.25 });
    bottomNav('prog');
  });

  // ajustes
  board('ajustes', 'Ajustes', () => {
    statusBar(); header('Ajustes', false);
    list(104, [
      ['Perfil', 'Ana · bloqueio desligado', 'chevron', { to: 'perfil' }, 'user'],
      ['Acessibilidade', null, 'chevron', { to: 'acess' }, 'eye'],
      ['Lembretes', null, 'chevron', { to: 'lembrete' }, 'bell'],
      ['Transparência', null, 'chevron', { to: 'painel' }, 'shield'],
      ['Idioma', 'Português (Brasil)', 'chevron', null, 'globe']
    ], 60);
    T(24, 432, 342, 22, 'SEUS DADOS', { size: 13, weight: 700, color: C.sub });
    list(460, [
      ['Usar em outros aparelhos', 'Desligado · opcional', 'chevron', { to: 'sync' }, 'cloud'],
      ['Exportar meus dados', 'JSON ou TXT', 'chevron', { to: 'exportado' }, 'download'],
      ['Apagar todos os dados', 'Pede 1 confirmação', 'chevron', { to: 'apagar' }, 'trash']
    ], 68);
    T(24, 720, 342, 20, 'MicroRotina v0.4 · Grupo 18 · IHC UFABC', { size: 13, color: C.sub, align: 'center' });
    bottomNav('ajustes');
  });
  perfilBoard('perfil', 'Perfil (ajustes)', false);

  // conta opcional: local-first; sincronizar só se a pessoa quiser, cifrado de ponta a ponta
  board('sync', 'Usar em outros aparelhos', () => {
    statusBar(); header('');
    nuvi(16, 92, 88, 'calm');
    T(24, 188, 342, 68, 'Quer usar em outros aparelhos?', { size: 26, weight: 700, lh: 1.2 });
    T(24, 260, 342, 44, 'É opcional. Sem isso, tudo continua só neste celular.', { size: 16, color: C.sub });
    [
      ['lock', 'Cifrado no seu celular antes de sair. Nem a gente consegue ler.'],
      ['shield', 'Sem senha para criar ou lembrar.'],
      ['trash', 'Desligar apaga a cópia da nuvem em 1 toque.']
    ].forEach((b, i) => {
      const y = 324 + i * 60;
      O(24, y, 40, 40, { fill: C.accentSoft });
      I(32, y + 8, b[0], C.accent, 24);
      T(80, y - 2, 286, 44, b[1], { size: 15, valign: 'center', lh: 1.25 });
    });
    btn(24, 560, 342, 'Continuar com Apple', 'secondary', { to: 'syncon' });
    btn(24, 624, 342, 'Continuar com Google', 'secondary', { to: 'syncon' });
    btn(24, 688, 342, 'Receber link por e-mail', 'text', { to: 'syncon' }, 48);
    btn(24, 740, 342, 'Agora não', 'text', { back: true }, 48);
  });

  board('syncon', 'Sincronização ligada', () => {
    statusBar(); header('Outros aparelhos');
    card(104, 112, C.surface);
    O(40, 124, 40, 40, { fill: C.accent });
    I(48, 132, 'check', C.white, 24);
    T(96, 122, 254, 24, 'Sincronização ligada', { size: 18, weight: 700 });
    T(96, 148, 254, 44, 'Conta Google · cifrada de ponta a ponta. Última cópia: agora.', { size: 14, color: C.sub, lh: 1.25 });
    T(24, 240, 342, 22, 'APARELHOS', { size: 13, weight: 700, color: C.sub });
    list(268, [
      ['Este celular', 'iPhone · agora', null, null, 'phone'],
      ['Tablet', 'iPad · há 2 horas', null, null, 'monitor']
    ], 68);
    I(24, 424, 'eye', C.sub, 18);
    T(50, 420, 316, 44, 'O painel de Transparência mostra tudo o que foi enviado.', { size: 14, color: C.sub });
    btn(24, 656, 342, 'Desligar e apagar a cópia da nuvem', 'secondary', { to: 'ajustes' });
    btn(24, 722, 342, 'Concluir', 'primary', { to: 'ajustes' });
  });
  accessBoard('acess', 'Acessibilidade (ajustes)', false);

  // transparência
  board('painel', 'Transparência', () => {
    statusBar(); header('Transparência');
    card(104, 120, C.surface);
    T(40, 116, 220, 56, '0 KB', { size: 44, weight: 700 });
    T(40, 174, 230, 40, 'enviados para fora deste celular', { size: 15, color: C.sub, lh: 1.2 });
    nuvi(272, 116, 84, 'calm');
    const items = ['Só um apelido: sem e-mail nem senha','Sem anúncios nem rastreadores', 'Nuvem só se você ligar, e cifrada','Lembretes só se você ligar'];
    items.forEach((s, i) => {
      const y = 248 + i * 44;
      I(28, y + 10, 'check', C.accent, 20);
      T(60, y, 300, 40, s, { size: 16, valign: 'center' });
    });
    T(24, 440, 342, 22, 'GUARDADO AQUI', { size: 13, weight: 700, color: C.sub });
    T(24, 466, 342, 24, '5 hábitos · 47 registros · ~12 KB', { size: 16 });
    btn(24, 656, 342, 'Exportar meus dados', 'secondary', { to: 'exportado' });
    btn(24, 722, 342, 'Apagar todos os dados', 'secondary', { to: 'apagar' });
  });

  // exportado
  board('exportado', 'Dados exportados', () => {
    statusBar(); header('');
    nuvi(135, 100, 120, 'cheer');
    T(24, 228, 342, 36, 'Arquivo pronto', { size: 26, weight: 700, align: 'center' });
    T(24, 268, 342, 24, 'meus-dados.json · 12 KB', { size: 16, color: C.sub, align: 'center' });
    T(24, 300, 342, 48, 'Salvo no seu celular. Nada foi enviado a servidor algum.', { size: 16, color: C.sub, align: 'center' });
    btn(24, 656, 342, 'Exportar também em TXT', 'secondary', { to: 'exportado' });
    btn(24, 722, 342, 'Concluir', 'primary', { to: 'ajustes' });
  });

  // apagar
  board('apagar', 'Apagar tudo', () => {
    statusBar(); header('');
    T(24, 120, 342, 40, 'Apagar todos os dados?', { size: 26, weight: 700 });
    T(24, 168, 342, 72, 'Remove 5 hábitos e 47 registros deste celular. Não dá para desfazer.', { size: 16, color: C.sub });
    btn(24, 252, 342, 'Exportar antes', 'text', { to: 'exportado' }, 48, 'download');
    nuvi(135, 340, 120, 'concern');
    btn(24, 656, 342, 'Apagar definitivamente', 'secondary', { to: 'boasvindas' });
    btn(24, 722, 342, 'Cancelar', 'secondary', { back: true });
  });

  // Hoje em paisagem (MobileDU 1.9): mesmo conteúdo, em duas colunas
  board('hoje_land', 'Hoje (paisagem)', () => {
    T(24, 10, 80, 20, '9:41', { size: 15, weight: 700 });
    T(720, 10, 100, 20, '100%', { size: 15, weight: 700, align: 'right' });
    T(24, 40, 260, 20, 'Quarta, 8 de outubro', { size: 15, color: C.sub });
    T(24, 62, 220, 36, 'Bom dia, Ana', { size: 26, weight: 700 });
    nuvi(232, 34, 64, 'happy');
    R(24, 112, 276, 96, { fill: C.surface, r: 18, name: 'Cartão' });
    T(40, 122, 80, 48, '47', { size: 40, weight: 700 });
    T(96, 138, 120, 22, 'dias praticados', { size: 15, color: C.sub });
    T(40, 172, 244, 22, '3 de 5 hoje', { size: 15, weight: 700 });
    G('Dia difícil? Fazer só 1 micro-ação', { to: 'dificil' }, () => {
      R(24, 220, 276, 48, { fill: C.white, op: 0.01, name: 'Área de toque' });
      I(28, 232, 'moon', C.accent, 20);
      T(56, 220, 240, 48, 'Dia difícil? Só 1 micro-ação', { size: 15, weight: 700, color: C.accent, valign: 'center' });
    });
    [['Hoje', 'home', 'hoje'], ['Hábitos', 'calendar', 'meus'], ['Progresso', 'chart', 'prog'], ['Ajustes', 'sliders', 'ajustes']].forEach((it, i) => {
      const x = 24 + i * 69, on = i === 0;
      G('Aba: ' + it[0] + (on ? ' (atual)' : ''), { to: it[2] }, () => {
        R(x, 300, 66, 64, { fill: C.white, name: 'Área de toque' });
        I(x + 21, 306, it[1], on ? C.accent : C.mute);
        T(x - 4, 334, 74, 20, it[0], { size: 12, weight: on ? 700 : 400, align: 'center', color: on ? C.accent : C.sub });
      });
    });
    R(324, 0, 1, 390, { fill: C.line, name: 'Divisória' });
    T(348, 36, 200, 36, 'Hoje', { size: 20, weight: 700, valign: 'center' });
    btn(724, 30, 96, 'Novo', 'text', { to: 'biblioteca' }, 48, 'plus');
    const y0 = 84, rh = 58;
    R(348, y0, 472, rh * 5, { fill: C.white, stroke: C.line, sw: 1, r: 18, name: 'Cartão' });
    HAB.forEach((h, i) => {
      const y = y0 + i * rh, done = i < 3;
      if (i) R(364, y, 440, 1, { fill: C.line, name: 'Divisória' });
      G('Hábito: ' + h.name + (done ? ' (feito)' : ' (a fazer)'), done ? null : { to: 'feedback' }, () => {
        R(348, y, 472, rh, { fill: C.white, op: 0.01, name: 'Área de toque' });
        T(364, y + 8, 340, 22, h.name, { size: 16, weight: 600 });
        T(364, y + 30, 340, 20, (done ? 'Feito · ' : '') + h.meta, { size: 13, color: C.sub });
        if (done) { O(768, y + 11, 36, 36, { fill: C.accent }); I(777, y + 20, 'check', C.white, 18); }
        else O(768, y + 11, 36, 36, { fill: C.white, stroke: C.mute, sw: 2 });
      });
    });
  }, { w: H, h: W });

  // o que o leitor de tela fala no Progresso (MobileDU 3.9, 3.11, 3.12)
  board('leitor', 'Leitor de tela · Progresso', () => {
    T(24, 32, 552, 36, 'Leitor de tela · Progresso', { size: 24, weight: 700 });
    T(24, 72, 552, 44, 'Ordem de foco e o que é falado em cada item. Os nomes vêm das camadas do protótipo.', { size: 15, color: C.sub });
    [
      ['Título', '“Progresso, cabeçalho”'],
      ['Total', '“47 dias praticados”'],
      ['Calendário', '“Últimas 4 semanas, tabela, 4 linhas e 7 colunas”'],
      ['Cabeçalho da coluna', '“Segunda” … “Domingo”'],
      ['Célula', '“Segunda, semana 1: praticado”'],
      ['Célula', '“Sexta, semana 1: descanso”'],
      ['Célula', '“Quarta, semana 4: hoje”'],
      ['Legenda', '“Praticado, Descanso, Hoje”'],
      ['Próximo marco', '“50 dias, faltam 3”'],
      ['Aba', '“Progresso, aba, selecionada, 3 de 4”']
    ].forEach((r, i) => {
      const y = 136 + i * 62;
      O(24, y + 8, 32, 32, { fill: C.accentSoft });
      T(24, y + 8, 32, 32, String(i + 1), { size: 15, weight: 700, color: C.accent, align: 'center', valign: 'center' });
      T(72, y, 180, 48, r[0], { size: 15, weight: 700, valign: 'center' });
      T(252, y, 324, 48, r[1], { size: 15, valign: 'center', lh: 1.25 });
    });
  }, { w: 600 });

  // ---------- numeração e grade ----------
  const cols = 6, gx = 80, gy = 120;
  const num = {};
  boards.forEach((b, i) => { num[b.id] = String(i + 1).padStart(2, '0'); });
  let rowY = 0, rowH = 0, colX = 0;
  boards.forEach((b, i) => {
    if (i && i % cols === 0) { rowY += rowH + gy; rowH = 0; colX = 0; }
    b.name = num[b.id] + ' ' + b.name;
    b.x = colX; b.y = rowY;
    colX += b.w + gx; rowH = Math.max(rowH, b.h);
  });
  const ref = (...ids) => ids.map((i) => num[i]).join(', ');

  // ---------- rastreabilidade ----------
  E = [];
  T(40, 32, 1000, 44, 'MicroRotina · Rastreabilidade do protótipo', { size: 32, weight: 700 });
  T(40, 80, 1040, 28, 'Grupo 18 · IHC UFABC · Cada linha liga um requisito às telas que o atendem. Use Present (▶) para navegar.', { size: 16, color: C.sub });
  T(40, 128, 500, 28, 'Requisitos funcionais', { size: 20, weight: 700, color: C.accent });
  [
    'RF01 Cadastro em até 3 passos, 2 campos → ' + ref('p1', 'p2', 'p3'),
    'RF02 Concluir com 1 toque → ' + ref('hoje'),
    'RF03 Feedback acolhedor, até 2 s → ' + ref('feedback'),
    'RF04 Local por padrão, sem cadastro; nuvem opcional e cifrada → ' + ref('perfil0', 'sync', 'syncon', 'painel'),
    'RF05 Total de dias, sem streak nem vermelho → ' + ref('hoje', 'prog'),
    'RF06 Lembrete opcional, horário e canal → ' + ref('p2', 'p3', 'lembrete', 'meus'),
    'RF07 Biblioteca com 6 sugestões → ' + ref('biblioteca'),
    'RF08 Exportar e apagar em até 2 toques → ' + ref('ajustes', 'exportado', 'apagar'),
    'RF09 Modo baixo estímulo → ' + ref('acess0', 'acess'),
    'RF10 Sem feed, ranking ou paywall → nenhuma tela tem',
    'RF11 Modo Dia Difícil → ' + ref('checkin', 'dificil', 'descanso')
  ].forEach((s, i) => T(40, 164 + i * 34, 520, 28, s, { size: 16 }));
  T(580, 128, 500, 28, 'Não funcionais e design universal', { size: 20, weight: 700, color: C.accent });
  [
    'RNF07 Alvos de toque ≥ 44–48 dp → todas',
    'RNF08 Texto ≥ 4,5:1 (apoio #5C5C58 ≈ 6,7:1) → todas',
    'RNF09 No máximo 5 hábitos na tela → ' + ref('hoje', 'meus'),
    'RNF10 Simetria: excluir/desligar ≤ 2 toques → ' + ref('detalhe', 'excluir', 'apagar'),
    'Daltonismo: estado = forma + texto, nunca só cor',
    'Cegos: camadas nomeadas pela função e estado',
    'Surdos: feedback visual + vibração → ' + ref('feedback', 'lembrete'),
    'Baixo estímulo: 1 cor de destaque, sem emojis'
  ].forEach((s, i) => T(580, 164 + i * 34, 520, 28, s, { size: 16 }));
  T(580, 446, 500, 28, 'Barreiras do Mapa 6.3 corrigidas', { size: 20, weight: 700, color: C.accent });
  [
    'B1 Texto de apoio escuro (#5C5C58) e ≥ 14 px',
    'B2 Círculo de concluir 40 px dentro de linha de 68 px',
    'B3 Aviso de privacidade legível e clicável',
    'B4 Feito = ✓ preenchido + palavra “Feito”, sem riscar'
  ].forEach((s, i) => T(580, 482 + i * 34, 520, 28, s, { size: 16 }));
  T(40, 546, 500, 28, 'Diferenciais', { size: 20, weight: 700, color: C.accent });
  [
    'Nuvi, mascote com 12 expressões que acompanham o dia',
    'Progresso em partes (água em copos) → ' + ref('hoje', 'hoje_copo', 'agua', 'agua2'),
    'Horário e lembrete já na criação → ' + ref('p2', 'p3'),
    'Check-in de energia, Dia Difícil e descanso → ' + ref('checkin', 'dificil', 'descanso'),
    'Painel de transparência: 0 KB enviados → ' + ref('painel'),
    'Modo Tudo feito: o dia termina em calma → ' + ref('tudofeito')
  ].forEach((s, i) => T(40, 582 + i * 34, 520, 28, s, { size: 16 }));
  const doc = { id: 'doc', name: '00 Rastreabilidade', w: 1120, h: 800, fill: C.white, els: E, x: 0, y: -940 };

  // ---------- folha de expressões da Nuvi ----------
  E = [];
  T(40, 32, 800, 44, 'Nuvi · expressões', { size: 32, weight: 700 });
  T(40, 80, 820, 28, 'A nuvem muda de “clima” com o dia. Nunca fica brava nem triste com você.', { size: 16, color: C.sub });
  const uses = {
    hello: 'Boas-vindas', happy: 'Hoje, perfil', proud: 'Hoje, quase tudo feito', cheer: 'Conclusão, exportar',
    wink: 'Escolher lembrete', curious: 'Check-in', calm: 'Transparência', peace: 'Tudo feito', tired: 'Check-in: cansado(a)',
    sleepy: 'Check-in: esgotado(a)', cozy: 'Dia difícil', sunny: 'Progresso', concern: 'Apagar dados'
  };
  Object.keys(NUVI_MOODS).forEach((k, i) => {
    const x = 40 + (i % 6) * 140, y = 140 + Math.floor(i / 6) * 250;
    R(x, y, 124, 124, { fill: C.surface, r: 20, name: 'Fundo' });
    nuvi(x + 2, y + 2, 120, k);
    T(x, y + 136, 124, 24, NUVI_MOODS[k], { size: 16, weight: 700, align: 'center' });
    T(x, y + 162, 124, 44, uses[k], { size: 13, color: C.sub, align: 'center', lh: 1.2 });
  });
  const sheet = { id: 'nuvi', name: '00 Nuvi · expressões', w: 900, h: 900, fill: C.white, els: E, x: 1200, y: -940 };

  return {
    W, H, colors: C,
    boards: [doc, sheet].concat(boards),
    flows: [
      { name: '1 · Primeiro uso', start: 'boasvindas' },
      { name: '2 · Dia a dia', start: 'checkin' }
    ]
  };
}

if (typeof module !== 'undefined') module.exports = { buildSpec };
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
