const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const htmlPath = process.argv[2] || path.join(__dirname, '..', 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const expectedNumber = '5583999601029';
const expectedMessage = 'Eai, galera da RISING, cade o meu MAPA de recorrência??';
const anchors = [...html.matchAll(/<a\b([^>]*\bdata-whatsapp="[^"]+"[^>]*)>/g)].map(match =>
  Object.fromEntries([...match[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(attribute => [attribute[1], attribute[2]]))
);
assert.equal(anchors.length, 2, 'O hero e o CTA final devem ter links nativos.');

function checkDestination(href) {
  const url = new URL(href);
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/' + expectedNumber);
  assert.equal(url.searchParams.get('text'), expectedMessage);
}

// Sem JavaScript, o HTML deve conter o destino completo, sem depender de pop-up.
for (const anchor of anchors) {
  checkDestination(anchor.href);
  assert.equal(anchor.target, '_self');
  assert.equal(anchor.onclick, undefined);
}

const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script); // Também validar a sintaxe do script completo.
const whatsappScript = script.split('// Visor de seis páginas reais.')[0];

function executeConfiguration(code) {
  const links = anchors.map(anchor => ({
    ...anchor,
    listeners: [],
    addEventListener(type) { this.listeners.push(type); }
  }));
  const context = {URL, document: {querySelectorAll(selector) {
    assert.equal(selector, '[data-whatsapp]');
    return links;
  }}};
  vm.runInNewContext(code, context);
  for (const link of links) {
    checkDestination(link.href);
    assert.equal(link.target, '_self');
    assert.equal(link.href, anchors[links.indexOf(link)].href, 'Preservar a mesma codificação do link direto do chat.');
    assert.equal(link.listeners.length, 0, 'O script não deve interceptar o clique.');
  }
  return links;
}

executeConfiguration(whatsappScript);
// Uma configuração incompleta não pode transformar o botão em um clique inerte.
const fallbackLinks = executeConfiguration(whatsappScript.replace("whatsappDestino: '5583999601029'", "whatsappDestino: ''"));
fallbackLinks.forEach((link, index) => assert.equal(link.href, anchors[index].href));

// Todas as alterações visuais de hover do CTA devem exigir mouse, não toque.
const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
let desktopHoverRules = 0;
function checkHoverRules(source, context = []) {
  let cursor = 0;
  while (cursor < source.length) {
    const open = source.indexOf('{', cursor);
    if (open < 0) return;
    const selector = source.slice(cursor, open).trim();
    let depth = 1;
    let close = open + 1;
    while (depth && close < source.length) {
      if (source[close] === '{') depth++;
      if (source[close] === '}') depth--;
      close++;
    }
    assert.equal(depth, 0, 'O CSS deve ter blocos balanceados.');
    const body = source.slice(open + 1, close - 1);
    if (selector.startsWith('@media')) checkHoverRules(body, [...context, selector]);
    else if (selector.includes('.r-cta:hover')) {
      const mouseOnly = context.some(media => /hover:\s*hover/.test(media) && /pointer:\s*fine/.test(media));
      const reducedMotion = context.some(media => /prefers-reduced-motion:\s*reduce/.test(media));
      assert(mouseOnly || reducedMotion, 'O hover do CTA não pode ser aplicado indiscriminadamente ao toque.');
      if (mouseOnly) desktopHoverRules++;
    }
    cursor = close;
  }
}
checkHoverRules(css);
assert(desktopHoverRules >= 3, 'Preservar o acabamento de hover no desktop.');

console.log('WhatsApp: 2 links nativos na própria página, href exato do chat, sem interceptação, fallback sem JavaScript e hover exclusivo de mouse.');
