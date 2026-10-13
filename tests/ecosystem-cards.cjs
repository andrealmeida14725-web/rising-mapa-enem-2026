const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const html = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', 'dist', 'index.html'), 'utf8');
const sections = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"[^>]*>[\s\S]*?<\/section>/g)];
assert.deepEqual(sections.map(section => section[1]), ['oferta', 'como-usar', 'sobre']);
const about = sections[2][0];
const cards = [...about.matchAll(/<article class="r-ecosystem-card"[^>]*>[\s\S]*?<\/article>/g)].map(card => card[0]);
assert.equal(cards.length, 6);
const titles = cards.map(card => card.match(/<h4>([^<]+)<\/h4>/)[1]);
assert.deepEqual(titles, ['Assessoria individual', 'Planejamento personalizado', 'Plataforma de estudos', 'Materiais direcionados', 'Prática com questões', 'Suporte em redação']);
for (const card of cards) {
  assert(card.includes('role="listitem"'));
  assert(card.includes('data-reveal'));
  assert(card.includes('class="r-ecosystem-icon" aria-hidden="true"'));
  assert(card.includes('<svg viewBox="0 0 24 24" focusable="false">'));
  const description = card.match(/<p>([^<]+)<\/p>/)[1];
  assert(description.length > 50 && description.length < 130);
  assert(!/<a\b|<button\b|<input\b/.test(card), 'Os cards explicam o ecossistema, não são controles de navegação.');
}
assert(about.includes('O seu ecossistema de aprovação.'));
assert(about.includes('<figure class="r-team"'));
assert(about.includes('alt="Foto real de quatro integrantes da equipe RISING."'));
assert(about.indexOf('r-ecosystem-grid') < about.indexOf('id="receber"'));
const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
assert(css.includes('.r-ecosystem-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}'));
assert(css.includes('@media(max-width:1050px){.r-ecosystem-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}'));
assert(/@media\(max-width:600px\)\{[\s\S]*?\.r-ecosystem-grid\{grid-template-columns:1fr;gap:12px\}/.test(css));
console.log('Ecossistema: 6 cards com ícones e descrições, layout 3/2/1 colunas e somente 3 seções.');
