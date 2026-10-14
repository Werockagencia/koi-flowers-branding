// Extrae símbolo + logotipo de cada propuesta (SVG exportado desde el PDF de Illustrator)
// y genera assets/logos.js: un sprite SVG recoloreable vía CSS (--s símbolo, --w wordmark).
const fs = require('fs');
const path = require('path');

// k3 = Yūhi ajustado para impresión (ronda 02, desde el .ai actualizado); k3old = versión ronda 01 para el antes/después
const sources = { k1: 'p1.svg', k2: 'p4.svg', k3: 'v2/p7.svg', k3old: 'p7.svg' };
let sprite = '';

for (const [key, file] of Object.entries(sources)) {
  const svg = fs.readFileSync(path.join(__dirname, file), 'utf8');
  let defs = svg.match(/<defs>([\s\S]*?)<\/defs>/)[1];
  let body = svg.split('</defs>')[1].replace('</svg>', '');

  // prefijo de ids para que los glifos de cada propuesta no choquen
  defs = defs.replace(/id="glyph-/g, `id="${key}-glyph-`);
  body = body.replace(/#glyph-/g, `#${key}-glyph-`);

  // fuera el fondo
  body = body.replace(/<rect[^>]*\/>/, '');

  const word = [];
  const sym = [];
  const re = /<g [^>]*>[\s\S]*?<\/g>|<path[^>]*\/>/g;
  let m;
  while ((m = re.exec(body))) {
    const el = m[0];
    if (el.includes('-glyph-')) {
      word.push(el.replace(/fill="rgb\([^"]*\)"/g, 'fill="var(--w, currentColor)"'));
    } else {
      sym.push(
        el
          .replace(/fill="rgb\([^"]*\)"/g, 'fill="var(--s, currentColor)"')
          .replace(/stroke="rgb\([^"]*\)"/g, 'stroke="var(--s, currentColor)"')
      );
    }
  }
  sprite += `<defs>${defs}</defs>`;
  sprite += `<g id="${key}-sym">${sym.join('')}</g>`;
  sprite += `<g id="${key}-word">${word.join('')}</g>`;
  console.log(key, 'sym', sym.length, 'word', word.length);
}

sprite = sprite.replace(/\n/g, '').replace(/(\d+\.\d{2})\d+/g, '$1');
const out = `/* KOI Flowers · sprite de logotipos (generado por src/build-logos.js) */
window.KOI_SPRITE = ${JSON.stringify(
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">' +
    sprite +
    '</svg>'
)};
`;
fs.mkdirSync(path.join(__dirname, '..', 'assets'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'assets', 'logos.js'), out);
console.log('bytes', out.length);

// favicons: isotipo sobre círculo de color
const favs = { k1: ['p1.svg', '#C60521', '#FFD400'], k2: ['p4.svg', '#5E1BFF', '#19E6FF'], k3: ['v2/p7.svg', '#FF5733', '#FFFFFF'] };
const BBs = { k1: [332.7, 698.2, 401.3, 401.3], k2: [353.9, 700.07, 372.18, 362.98], k3: [304.71, 641.43, 467.19, 476.22] };
for (const [key, [file, bg, fg]] of Object.entries(favs)) {
  const svg = fs.readFileSync(path.join(__dirname, file), 'utf8');
  let body = svg.split('</defs>')[1].replace('</svg>', '').replace(/<rect[^>]*\/>/, '');
  const paths = (body.match(/<path[^>]*\/>/g) || []).map((p) => p.replace(/fill="rgb\([^"]*\)"/g, `fill="${fg}"`).replace(/stroke="rgb\([^"]*\)"/g, `stroke="${fg}"`)).join('');
  const b = BBs[key], cx = b[0] + b[2] / 2, cy = b[1] + b[3] / 2, r = Math.max(b[2], b[3]) * 0.66;
  const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${cx - r} ${cy - r} ${2 * r} ${2 * r}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${bg}"/>${paths.replace(/(\d+\.\d{2})\d+/g, '$1')}</svg>`;
  fs.writeFileSync(path.join(__dirname, '..', 'assets', `fav-${key}.svg`), fav);
}
console.log('favicons ok');
