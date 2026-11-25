// Extrai os ícones e as expressões da Nuvi do protótipo (penpot-plugin/spec.js) para src/art.ts.
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '../../penpot-plugin/spec.js'), 'utf8');
const a = src.indexOf('  const C = {'), b = src.indexOf('  const nuvi = (x, y, s, mood)');
const fn = new Function(src.slice(a, b) + '\nreturn { ICONS, NUVI_MOODS, nuviSvg };');
const { ICONS, NUVI_MOODS, nuviSvg } = fn();
const nuvi = {};
for (const k of Object.keys(NUVI_MOODS)) nuvi[k] = nuviSvg(k, 120).replace(/ width="120" height="120"/, '');
const out = '// Gerado por scripts/extrair-arte.cjs a partir do protótipo. Não edite à mão.\n'
  + 'export const ICONS: Record<string, string> = ' + JSON.stringify(ICONS, null, 2) + ';\n\n'
  + 'export const NUVI_MOODS = ' + JSON.stringify(NUVI_MOODS, null, 2) + ' as const;\n\n'
  + 'export type Mood = keyof typeof NUVI_MOODS;\n\n'
  + 'export const NUVI_SVG: Record<Mood, string> = ' + JSON.stringify(nuvi, null, 2) + ';\n';
fs.writeFileSync(path.join(__dirname, '../src/art.ts'), out);
console.log(Object.keys(ICONS).length + ' ícones, ' + Object.keys(nuvi).length + ' expressões');
