const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const html = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', 'dist', 'index.html'), 'utf8');
const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
const glow = css.match(/\.r-portrait::before\{content:[^}]*\}/)[0];
assert(glow.includes('rgba(171,0,12,.58)'), 'Usar o vermelho #ab000c da marca.');
assert(glow.includes('filter:blur(34px)'), 'O halo deve ter bordas difusas.');
assert(glow.includes('z-index:-1'), 'A luz deve ficar atrás da foto.');
assert(glow.includes('pointer-events:none'), 'A luz não deve interceptar toques.');
assert(glow.includes('animation:r-light-breathe 10s ease-in-out infinite'));
assert.equal((css.match(/@keyframes r-light-breathe/g) || []).length, 1);
const frames = css.match(/@keyframes r-light-breathe\{0%,100%\{([^}]+)\}50%\{([^}]+)\}\}/);
assert(frames, 'A respiração deve voltar ao mesmo estado ao fechar o ciclo.');
for (const frame of frames.slice(1)) {
  const properties = frame.split(';').filter(Boolean).map(declaration => declaration.split(':')[0]);
  assert.deepEqual(properties.sort(), ['opacity', 'transform']);
}
assert(css.includes('.r-portrait::before{inset:14% -12% 18%;filter:blur(24px)}'), 'Adaptar o halo ao celular.');
assert(/@media\(prefers-reduced-motion:reduce\)\{html\{scroll-behavior:auto\}\*,\*::before,\*::after\{transition:none!important;animation:none!important\}\}/.test(css));
console.log('Luz do retrato: vermelho RISING, camada atrás da foto, respiração de 10s, adaptação móvel e movimento reduzido.');
