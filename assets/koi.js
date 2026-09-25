/* KOI Flowers · motor de universos de marca (We Rock)
   - logo(): compone versiones del logotipo desde el sprite vectorial
   - patterns / mockups: aplicaciones generadas con los colores de cada propuesta
   - renderUniverse(): arma el mini manual completo desde un objeto de configuración */
(function () {
  'use strict';
  if (/shot/.test(location.search)) document.documentElement.classList.add('shot');

  // ---------------------------------------------------------------- sprite
  document.body.insertAdjacentHTML('afterbegin', window.KOI_SPRITE);

  // cajas medidas sobre el arte original (unidades del PDF)
  const BB = {
    k1: { sym: [332.7, 698.2, 401.3, 401.3], word: [242.16, 1130.17, 601.51, 67.61] },
    k2: { sym: [353.9, 700.07, 372.18, 362.98], word: [231.39, 1096.19, 619.16, 67.16] },
    k3: { sym: [308.8, 642.28, 462.4, 475.37], word: [241.32, 1190.03, 599.57, 64.81] },
  };

  const f = (n) => +n.toFixed(2);
  const use = (id, tr) => `<use href="#${id}" xlink:href="#${id}"${tr ? ` transform="${tr}"` : ''}/>`;

  /** Versiones: full (vertical original) · h (horizontal) · sym (isotipo) · word (logotipo) · rev (orden invertido, solo para "usos incorrectos") */
  function logo(k, v = 'full', o = {}) {
    const s = BB[k].sym, w = BB[k].word;
    let vb, inner;
    if (v === 'sym') { vb = s; inner = use(`${k}-sym`); }
    else if (v === 'word') { vb = w; inner = use(`${k}-word`); }
    else if (v === 'h') {
      const H = s[3], sc = (H * 0.27) / w[3], gap = H * 0.2;
      const X = s[0] + s[2] + gap, cy = s[1] + H / 2;
      const tx = X - w[0] * sc, ty = cy - (w[1] + w[3] / 2) * sc;
      vb = [s[0], s[1], s[2] + gap + w[2] * sc, H];
      inner = use(`${k}-sym`) + use(`${k}-word`, `translate(${f(tx)} ${f(ty)}) scale(${f(sc)})`);
    } else if (v === 'rev') {
      const gap = w[1] - (s[1] + s[3]);
      const dy = -(w[1] - s[1]);
      const dyS = w[3] + gap;
      vb = [Math.min(s[0], w[0]), s[1], Math.max(s[0] + s[2], w[0] + w[2]) - Math.min(s[0], w[0]), s[3] + gap + w[3]];
      inner = use(`${k}-word`, `translate(0 ${f(dy)})`) + use(`${k}-sym`, `translate(0 ${f(dyS)})`);
    } else {
      const x0 = Math.min(s[0], w[0]), x1 = Math.max(s[0] + s[2], w[0] + w[2]);
      vb = [x0, s[1], x1 - x0, w[1] + w[3] - s[1]];
      inner = use(`${k}-sym`) + use(`${k}-word`);
    }
    const p = o.pad || 0;
    const box = [vb[0] - vb[2] * p, vb[1] - vb[3] * p, vb[2] * (1 + 2 * p), vb[3] * (1 + 2 * p)].map(f).join(' ');
    const style = `${o.s ? `--s:${o.s};` : ''}${o.w ? `--w:${o.w};` : ''}${o.style || ''}`;
    return `<svg class="lg ${o.cls || ''}" viewBox="${box}" role="img" aria-label="KOI Flowers" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"${style ? ` style="${style}"` : ''}>${inner}</svg>`;
  }

  /** <use> de una parte encajada en un cuadrado de lado S centrado en (cx,cy) — para patrones y mockups SVG */
  function place(k, part, cx, cy, S, rot = 0) {
    const b = BB[k][part], sc = S / Math.max(b[2], b[3]);
    return use(`${k}-${part}`, `translate(${f(cx)} ${f(cy)}) rotate(${rot}) scale(${f(sc)}) translate(${f(-(b[0] + b[2] / 2))} ${f(-(b[1] + b[3] / 2))})`);
  }
  function placeW(k, part, cx, cy, W, rot = 0) {
    const b = BB[k][part], sc = W / b[2];
    return use(`${k}-${part}`, `translate(${f(cx)} ${f(cy)}) rotate(${rot}) scale(${f(sc)}) translate(${f(-(b[0] + b[2] / 2))} ${f(-(b[1] + b[3] / 2))})`);
  }

  // ---------------------------------------------------------------- color utils
  function rgb(hex) { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function cmyk(hex) {
    const [r, g, b] = rgb(hex).map((v) => v / 255);
    const k = 1 - Math.max(r, g, b);
    if (k >= 1) return '0 · 0 · 0 · 100';
    return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k].map((v) => Math.round(v * 100)).join(' · ');
  }
  function lum(hex) { const [r, g, b] = rgb(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
  const onColor = (hex) => (lum(hex) > 0.45 ? '#111' : '#fff');

  // ---------------------------------------------------------------- patrones
  const WA = '573125766056';
  let uid = 0;
  const nid = (p) => `${p}${++uid}`;
  const PAT = {
    seigaiha(id, bg, fg, size = 44, sw = 0.035) {
      const r = size / 2;
      const scale = (cx, cy) => [0.95, 0.72, 0.49, 0.26].map((q) => `<circle cx="${cx}" cy="${cy}" r="${f(r * q)}" fill="${bg}" stroke="${fg}" stroke-width="${f(size * sw)}"/>`).join('');
      return `<pattern id="${id}" width="${size}" height="${r}" patternUnits="userSpaceOnUse"><rect width="${size}" height="${r}" fill="${bg}"/>${scale(0, 0)}${scale(size, 0)}${scale(r, r / 2)}${scale(0, r)}${scale(size, r)}</pattern>`;
    },
    koiGrid(id, k, bg, fg, size = 120, fg2) {
      const s = size;
      return `<pattern id="${id}" width="${s}" height="${s}" patternUnits="userSpaceOnUse"><rect width="${s}" height="${s}" fill="${bg}"/><g style="--s:${fg}">${place(k, 'sym', s * 0.25, s * 0.25, s * 0.34, 0)}</g><g style="--s:${fg2 || fg}">${place(k, 'sym', s * 0.75, s * 0.75, s * 0.34, 90)}</g></pattern>`;
    },
    waves(id, bg, fg, size = 60) {
      const h = size / 2;
      return `<pattern id="${id}" width="${size}" height="${h}" patternUnits="userSpaceOnUse"><rect width="${size}" height="${h}" fill="${bg}"/><path d="M0 ${h / 2} C ${size / 4} 0, ${size / 4} ${h}, ${size / 2} ${h / 2} S ${size * 0.75} 0, ${size} ${h / 2}" fill="none" stroke="${fg}" stroke-width="${size * 0.04}" stroke-linecap="round"/></pattern>`;
    },
    stripes(id, colors, size = 24) {
      const h = size * colors.length;
      return `<pattern id="${id}" width="${size * 4}" height="${h}" patternUnits="userSpaceOnUse">${colors.map((c, i) => `<rect y="${i * size}" width="${size * 4}" height="${size}" fill="${c}"/>`).join("")}</pattern>`;
    },
    suns(id, k, bg, fg, size = 150, dot) {
      const s = size;
      return `<pattern id="${id}" width="${s}" height="${s}" patternUnits="userSpaceOnUse"><rect width="${s}" height="${s}" fill="${bg}"/><g style="--s:${fg}">${place(k, 'sym', s * 0.3, s * 0.3, s * 0.36, -12)}</g><circle cx="${s * 0.78}" cy="${s * 0.78}" r="${s * 0.1}" fill="${dot || fg}"/><circle cx="${s * 0.78}" cy="${s * 0.22}" r="${s * 0.025}" fill="${dot || fg}"/><circle cx="${s * 0.22}" cy="${s * 0.8}" r="${s * 0.025}" fill="${dot || fg}"/></pattern>`;
    },
  };
  const defsHost = (() => {
    const d = document.createElement('div');
    d.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs></defs></svg>';
    document.body.prepend(d.firstChild);
    return document.body.firstChild.querySelector('defs');
  })();
  function pattern(kind, ...args) {
    const id = nid('pat');
    defsHost.insertAdjacentHTML('beforeend', PAT[kind](id, ...args));
    return id;
  }
  defsHost.insertAdjacentHTML('beforeend', `<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>`);
  const fillSvg = (patId, extra = '') => `<svg class="fill" preserveAspectRatio="none" aria-hidden="true"><rect width="100%" height="100%" fill="url(#${patId})"/>${extra}</svg>`;
  const grain = (op = 0.12) => `<svg class="fill" style="opacity:${op};mix-blend-mode:multiply;pointer-events:none" aria-hidden="true"><rect width="100%" height="100%" filter="url(#grain)" fill="#000"/></svg>`;

  // ---------------------------------------------------------------- mockups
  // t: { k, pri, s, w, paper, paperS, paperW, accent, ink, dark, surf, fD, fB, pat, patLight, headline, sub, cta, handle, bio, grid[] }
  const M = {};

  M.cards = (t) => `
    <div class="abs" style="inset:0;background:radial-gradient(90% 90% at 30% 20%, ${t.surfHi || 'rgba(255,255,255,.35)'}, transparent 60%), ${t.surf}"></div>
    ${grain(0.08)}
    <div class="abs" style="left:7%;top:14%;width:50%;aspect-ratio:1.75;transform:rotate(-9deg);background:${t.pri};border-radius:6px;display:grid;place-items:center;padding:0 9%;
      box-shadow:0 1px 1px rgba(0,0,0,.2),0 18px 40px -8px rgba(0,0,0,.45),0 40px 70px -20px rgba(0,0,0,.35)">
      ${logo(t.k, 'full', { s: t.s, w: t.w, style: 'max-height:78%;width:auto;max-width:100%' })}
    </div>
    <div class="abs" style="right:6%;bottom:9%;width:48%;aspect-ratio:1.75;transform:rotate(5deg);background:${t.paper};border-radius:6px;padding:6.5% 7%;display:flex;flex-direction:column;justify-content:space-between;color:${t.ink};
      box-shadow:0 1px 1px rgba(0,0,0,.18),0 22px 44px -10px rgba(0,0,0,.45),0 50px 80px -24px rgba(0,0,0,.3)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
        <div>
          <div style="font-family:${t.fD};font-size:clamp(9px,2.6cqw,17px);line-height:1.1;font-weight:${t.dW || 400}">Valentina Koi</div>
          <div style="font-family:${t.fB};font-size:clamp(6px,1.35cqw,10px);letter-spacing:.14em;text-transform:uppercase;opacity:.65;margin-top:3px">Directora floral</div>
        </div>
        <div style="width:17%">${logo(t.k, 'sym', { s: t.paperS })}</div>
      </div>
      <div style="font-family:${t.fB};font-size:clamp(6px,1.35cqw,10.5px);line-height:1.55;opacity:.85">hola@koiflowers.com<br>+00 000 000 000<br>${t.handle}</div>
    </div>`;

  M.bag = (t) => `
    <div class="abs" style="inset:0;background:linear-gradient(180deg, ${t.surf} 0 70%, ${t.floor || 'rgba(0,0,0,.08)'} 70%), ${t.surf}"></div>
    <div class="abs" style="left:0;right:0;top:70%;height:30%;background:linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.02))"></div>
    <div class="abs" style="left:50%;bottom:17%;width:46%;height:5%;transform:translateX(-46%);background:radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,.45), transparent 70%);filter:blur(4px)"></div>
    <div class="abs" style="left:27%;bottom:19%;width:40%;height:58%">
      <svg class="abs" viewBox="0 0 100 40" style="left:14%;bottom:99%;width:72%;overflow:visible" aria-hidden="true">
        <path d="M18 40 C 18 6, 44 2, 44 40" fill="none" stroke="${t.handle2 || t.ink}" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>
        <path d="M56 40 C 56 6, 82 2, 82 40" fill="none" stroke="${t.handle2 || t.ink}" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>
      </svg>
      <div class="abs" style="inset:0;background:${t.bag || t.pri};border-radius:2px 2px 3px 3px;box-shadow:inset -18px 0 30px -12px rgba(0,0,0,.35), inset 0 10px 0 -6px rgba(255,255,255,.12);overflow:hidden">
        <div class="abs" style="left:0;right:0;top:0;height:9%;background:rgba(0,0,0,.12)"></div>
        <div class="abs" style="left:50%;top:48%;transform:translate(-50%,-50%);width:66%">${logo(t.k, 'full', { s: t.bagS || t.s, w: t.bagW || t.w })}</div>
        <div class="abs" style="inset:0;background:linear-gradient(100deg, rgba(255,255,255,.14), transparent 40%, rgba(0,0,0,.08))"></div>
        ${grain(0.1)}
      </div>
      <div class="abs" style="left:100%;top:0;bottom:0;width:20%;background:${t.bag || t.pri};filter:brightness(.72);transform:skewY(-14deg);transform-origin:left top;clip-path:polygon(0 0,100% 6%,100% 100%,0 100%)"></div>
      <div class="abs" style="left:100%;top:0;bottom:0;width:20%;transform:skewY(-14deg);transform-origin:left top;background:linear-gradient(90deg, rgba(0,0,0,.25), transparent);clip-path:polygon(0 0,100% 6%,100% 100%,0 100%)"></div>
    </div>`;

  M.tag = (t) => {
    const cid = nid('c');
    return `
    <div class="abs" style="inset:0;background:${t.surf}"></div>
    ${grain(0.08)}
    <div class="abs" style="left:-5%;right:-5%;top:58%;height:13%;background:${t.ribbon || t.accent};transform:rotate(-7deg);box-shadow:0 10px 24px -8px rgba(0,0,0,.35);display:flex;align-items:center;gap:6%;overflow:hidden;white-space:nowrap;padding-left:4%">
      ${Array.from({ length: 7 }, () => `<div style="flex:0 0 22%">${logo(t.k, 'word', { w: t.ribbonW || t.pri })}</div>`).join('')}
      <div class="abs" style="inset:0;background:linear-gradient(180deg, rgba(255,255,255,.28), transparent 45%, rgba(0,0,0,.12))"></div>
    </div>
    <svg class="abs" viewBox="0 0 400 320" style="inset:0;width:100%;height:100%" aria-hidden="true">
      <path d="M-10 40 C 90 60, 150 50, 205 104" fill="none" stroke="${t.twine || '#b99a6b'}" stroke-width="3"/>
      <path d="M205 104 C 230 70, 300 50, 420 70" fill="none" stroke="${t.twine || '#b99a6b'}" stroke-width="3"/>
    </svg>
    <div class="abs" style="left:39%;top:22%;width:24%;aspect-ratio:.58;transform:rotate(8deg);transform-origin:50% 8%;
      background:${t.tag || t.paper};clip-path:polygon(22% 0,78% 0,100% 12%,100% 100%,0 100%,0 12%);filter:drop-shadow(0 14px 18px rgba(0,0,0,.35));
      display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.4cqw;padding:5cqw 2.6cqw 2.4cqw">
      <div class="abs" style="left:50%;top:7%;width:10%;aspect-ratio:1;border-radius:50%;transform:translateX(-50%);background:${t.surf};box-shadow:inset 0 1px 2px rgba(0,0,0,.4)"></div>
      <div style="width:100%;flex:none">${logo(t.k, 'sym', { s: t.tagS || t.paperS })}</div>
      <div style="font-family:${t.fD};font-weight:${t.dW || 400};font-size:clamp(6px,1.6cqw,12px);letter-spacing:.12em;text-align:center;color:${t.tagW || t.paperW};line-height:1.2">${t.tagText || 'Con amor'}</div>
    </div>
    <span hidden id="${cid}"></span>`;
  };

  M.sticker = (t) => {
    const pid = pattern(...t.pat);
    const tid = nid('tp');
    return `
    ${fillSvg(pid)}
    <div class="abs" style="inset:0;background:
      linear-gradient(115deg, rgba(255,255,255,.18) 0 18%, transparent 18.2% 40%, rgba(0,0,0,.14) 40.2% 41%, transparent 41.2% 72%, rgba(255,255,255,.12) 72.2%),
      radial-gradient(90% 70% at 70% 30%, rgba(255,255,255,.18), transparent 60%)"></div>
    ${grain(0.1)}
    <div class="abs" style="left:50%;top:50%;width:40%;aspect-ratio:1;transform:translate(-50%,-50%) rotate(-8deg);border-radius:50%;background:${t.stk || t.paper};
      box-shadow:0 2px 2px rgba(0,0,0,.15),0 14px 30px -8px rgba(0,0,0,.45);display:grid;place-items:center">
      <svg viewBox="0 0 200 200" class="abs" style="inset:0;width:100%;height:100%" aria-hidden="true">
        <defs><path id="${tid}" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs>
        <text font-family="${t.fB.replace(/"/g, "'")}" font-size="13" fill="${t.stkW || t.paperW}" font-weight="600"><textPath href="#${tid}" xlink:href="#${tid}" textLength="480" lengthAdjust="spacing">KOI FLOWERS · FLORES CON ALMA · HECHO A MANO ·</textPath></text>
      </svg>
      <div style="width:50%">${logo(t.k, 'sym', { s: t.stkS || t.paperS })}</div>
    </div>`;
  };

  M.sign = (t) => `
    <div class="abs" style="inset:0;background:${t.wall || t.surf}"></div>
    <div class="abs" style="inset:0;background:repeating-linear-gradient(180deg, transparent 0 34px, rgba(0,0,0,.05) 34px 36px), repeating-linear-gradient(90deg, transparent 0 70px, rgba(0,0,0,.035) 70px 72px)"></div>
    <div class="abs" style="inset:0;background:radial-gradient(70% 90% at 10% 10%, rgba(255,255,255,.28), transparent 60%)"></div>
    ${grain(0.14)}
    <div class="abs" style="left:0;top:22%;width:7%;height:12%;background:linear-gradient(180deg,#3a3a3a,#161616);border-radius:0 4px 4px 0"></div>
    <div class="abs" style="left:6%;top:26.5%;width:58%;height:2.4%;background:linear-gradient(180deg,#4a4a4a,#111);border-radius:0 3px 3px 0;box-shadow:0 8px 12px -4px rgba(0,0,0,.4)"></div>
    <div class="abs" style="left:24%;top:29%;width:.7%;height:6%;background:#222"></div>
    <div class="abs" style="left:52%;top:29%;width:.7%;height:6%;background:#222"></div>
    <div class="abs" style="left:17%;top:34.5%;width:42%;aspect-ratio:1;border-radius:50%;background:${t.signEdge || t.dark};transform:translate(1.4%,1.2%);filter:blur(0)"></div>
    <div class="abs" style="left:20%;top:44%;width:42%;aspect-ratio:1;border-radius:50%;background:rgba(0,0,0,.28);filter:blur(16px)"></div>
    <div class="abs" style="left:17%;top:34.5%;width:42%;aspect-ratio:1;border-radius:50%;background:${t.sign || t.pri};display:grid;place-items:center;
      box-shadow:inset 0 0 0 5px ${t.signRing || t.s}, inset 0 0 0 9px ${t.sign || t.pri}, inset -14px -18px 40px rgba(0,0,0,.25), inset 10px 12px 30px rgba(255,255,255,.12)">
      <div style="width:66%">${logo(t.k, 'full', { s: t.signS || t.s, w: t.signW || t.w })}</div>
    </div>`;

  M.neon = (t) => {
    const g = t.glow || t.s;
    return `
    <div class="abs" style="inset:0;background:${t.wall || "#1a1426"}"></div>
    <div class="abs" style="inset:0;background:repeating-linear-gradient(180deg, transparent 0 22px, rgba(0,0,0,.35) 22px 24px), repeating-linear-gradient(90deg, transparent 0 58px, rgba(0,0,0,.28) 58px 60px);opacity:.7"></div>
    <div class="abs" style="inset:0;background:radial-gradient(45% 55% at 50% 48%, ${g}55, transparent 70%)"></div>
    ${grain(0.25)}
    <div class="abs" style="left:50%;top:52%;width:44%;transform:translate(-50%,-50%)">
      ${logo(t.k, "full", { s: t.s, w: t.w, style: `filter:drop-shadow(0 0 2px ${g}) drop-shadow(0 0 10px ${g}) drop-shadow(0 0 28px ${g})` })}
    </div>`;
  };

  M.insta = (t) => {
    const tiles = t.grid.map((g) => {
      if (g.type === 'sym') return `<div style="background:${g.bg};display:grid;place-items:center;padding:22%">${logo(t.k, 'sym', { s: g.fg })}</div>`;
      if (g.type === 'pat') { const pid = pattern(...t.pat); return `<div style="position:relative">${fillSvg(pid)}</div>`; }
      if (g.type === 'word') return `<div style="background:${g.bg};display:grid;place-items:center;padding:12%">${logo(t.k, 'word', { w: g.fg })}</div>`;
      if (g.type === 'txt') return `<div style="background:${g.bg};color:${g.fg};display:grid;place-items:center;padding:10%;text-align:center;font-family:${t.fD};font-weight:${t.dW || 400};font-size:clamp(5px,1.25cqw,10px);line-height:1.15">${g.txt}</div>`;
      if (g.type === 'full') return `<div style="background:${g.bg};display:grid;place-items:center;padding:14%">${logo(t.k, 'full', { s: g.fg, w: g.fg2 || g.fg })}</div>`;
      return `<div style="background:${g.bg}"></div>`;
    }).join('');
    return `
    <div class="abs" style="inset:0;background:${t.surf}"></div>
    <div class="abs" style="inset:0;background:radial-gradient(60% 70% at 50% 40%, ${t.glow || 'rgba(255,255,255,.35)'}, transparent 70%)"></div>
    <div class="abs" style="left:50%;top:9%;width:37%;aspect-ratio:.49;transform:translateX(-50%) rotate(-4deg);border-radius:9% / 4.5%;background:#0c0c0e;padding:2.2%;
      box-shadow:0 0 0 1.5px #2a2a2e inset, 0 30px 60px -12px rgba(0,0,0,.55)">
      <div style="width:100%;height:100%;border-radius:7.5% / 3.6%;overflow:hidden;background:#fff;color:#111;font-family:-apple-system,system-ui,sans-serif;display:flex;flex-direction:column">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6% 7% 3%;font-size:clamp(5px,1.35cqw,10px);font-weight:700">${t.handle.replace('@', '')}<span style="letter-spacing:2px">···</span></div>
        <div style="display:flex;align-items:center;gap:7%;padding:2% 7%">
          <div style="flex:0 0 26%;aspect-ratio:1;border-radius:50%;background:${t.pri};display:grid;place-items:center;padding:4.5%;box-shadow:0 0 0 2px #fff, 0 0 0 3.5px ${t.accent}">${logo(t.k, 'sym', { s: t.s })}</div>
          <div style="flex:1;display:flex;justify-content:space-between;text-align:center;font-size:clamp(4px,1.05cqw,8px);line-height:1.2"><div><b style="font-size:1.3em">128</b><br>posts</div><div><b style="font-size:1.3em">12,4k</b><br>seguidores</div><div><b style="font-size:1.3em">310</b><br>seguidos</div></div>
        </div>
        <div style="padding:3% 7% 4%;font-size:clamp(4px,1.05cqw,8px);line-height:1.35"><b>KOI Flowers</b><br>${t.bio}</div>
        <div style="display:flex;gap:3%;padding:0 7% 5%"><div style="flex:1;text-align:center;padding:3% 0;border-radius:4px;background:#efefef;font-size:clamp(4px,1cqw,7.5px);font-weight:600">Seguir</div><div style="flex:1;text-align:center;padding:3% 0;border-radius:4px;background:#efefef;font-size:clamp(4px,1cqw,7.5px);font-weight:600">Mensaje</div></div>
        <div style="flex:1;display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:1fr;gap:1.5px;overflow:hidden">${tiles}</div>
      </div>
    </div>`;
  };

  M.box = (t) => `
    <div class="abs" style="inset:0;background:${t.surf}"></div>
    ${grain(0.1)}
    <div class="abs" style="left:24%;top:20%;width:52%;aspect-ratio:1;transform:rotate(-7deg) translate(3%,4%);background:rgba(0,0,0,.35);filter:blur(18px);border-radius:3px"></div>
    <div class="abs" style="left:24%;top:14%;width:52%;aspect-ratio:1;transform:rotate(-7deg);background:${t.box || t.pri};border-radius:3px;overflow:hidden;
      box-shadow:inset 0 0 0 3px rgba(0,0,0,.08), inset 0 0 40px rgba(0,0,0,.2)">
      <div class="abs" style="left:0;right:0;top:44%;height:12%;background:${t.ribbon || t.accent};box-shadow:0 2px 6px rgba(0,0,0,.25)"></div>
      <div class="abs" style="top:0;bottom:0;left:44%;width:12%;background:${t.ribbon || t.accent};box-shadow:2px 0 6px rgba(0,0,0,.25)"></div>
      <div class="abs" style="inset:0;background:linear-gradient(135deg, rgba(255,255,255,.18), transparent 50%, rgba(0,0,0,.14))"></div>
      <div class="abs" style="left:50%;top:50%;width:40%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:${t.seal || t.paper};display:grid;place-items:center;padding:8%;box-shadow:0 6px 14px rgba(0,0,0,.3)">
        ${logo(t.k, 'full', { s: t.sealS || t.paperS, w: t.sealW || t.paperW })}
      </div>
      ${grain(0.12)}
    </div>`;

  M.apron = (t) => `
    <div class="abs" style="inset:0;background:${t.surf}"></div>
    <div class="abs" style="inset:0;background:radial-gradient(60% 60% at 50% 45%, rgba(255,255,255,.28), transparent 70%)"></div>
    ${grain(0.08)}
    <svg class="abs" viewBox="0 0 400 320" style="inset:0;width:100%;height:100%" aria-hidden="true">
      <defs><filter id="${nid('sh')}"></filter></defs>
      <path d="M170 28 C 150 70, 150 86, 150 100 M230 28 C 250 70, 250 86, 250 100" stroke="${t.strap || t.ink}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M150 100 L 250 100 L 256 150 C 290 160, 300 170, 302 176 L 296 330 L 104 330 L 98 176 C 100 170, 110 160, 144 150 Z" fill="rgba(0,0,0,.28)" transform="translate(6 8)" style="filter:blur(6px)"/>
      <path d="M150 100 L 250 100 L 256 150 C 290 160, 300 170, 302 176 L 296 330 L 104 330 L 98 176 C 100 170, 110 160, 144 150 Z" fill="${t.apron || t.dark}"/>
      <path d="M98 176 C 60 180, 40 186, 20 200 M302 176 C 340 180, 360 186, 380 200" stroke="${t.strap || t.ink}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M150 262 L 250 262 L 250 312 L 150 312 Z" fill="rgba(0,0,0,.14)"/>
      <path d="M150 262 L 250 262" stroke="rgba(255,255,255,.18)" stroke-width="1.5" stroke-dasharray="4 3"/>
      <path d="M200 262 L 200 312" stroke="rgba(255,255,255,.18)" stroke-width="1.5" stroke-dasharray="4 3"/>
      <path d="M150 100 L 250 100 L 256 150 C 290 160, 300 170, 302 176 L 296 330 L 104 330 L 98 176 C 100 170, 110 160, 144 150 Z" fill="url(#${nid('x')})" opacity="0"/>
      <g style="--s:${t.apronS || t.s};--w:${t.apronW || t.w}">${place(t.k, 'sym', 200, 150, 58)}${placeW(t.k, 'word', 200, 196, 96)}</g>
    </svg>
    <div class="abs" style="inset:0;background:linear-gradient(95deg, rgba(255,255,255,.08), transparent 30%, rgba(0,0,0,.12) 80%);mix-blend-mode:soft-light"></div>`;

  M.web = (t) => `
    <div class="abs" style="inset:0;background:${t.surf}"></div>
    <div class="abs" style="left:7%;right:7%;top:12%;bottom:-6%;border-radius:12px 12px 0 0;background:${t.webBg || t.paper};overflow:hidden;box-shadow:0 30px 70px -20px rgba(0,0,0,.5)">
      <div style="height:6%;min-height:14px;background:#e9e7e4;display:flex;align-items:center;gap:6px;padding:0 1.6%">
        <i style="width:1.1%;min-width:6px;aspect-ratio:1;border-radius:50%;background:#ff5f57"></i><i style="width:1.1%;min-width:6px;aspect-ratio:1;border-radius:50%;background:#febc2e"></i><i style="width:1.1%;min-width:6px;aspect-ratio:1;border-radius:50%;background:#28c840"></i>
        <span style="margin-left:2%;flex:0 1 40%;height:60%;border-radius:6px;background:#fff;font:clamp(5px,1cqw,9px)/1 system-ui;color:#888;display:flex;align-items:center;padding-left:1.5%">koiflowers.com</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:2.2% 5%;color:${t.webInk || t.ink};font-family:${t.fB};font-size:clamp(5px,1.1cqw,11px);letter-spacing:.12em;text-transform:uppercase">
        <div style="width:19%">${logo(t.k, 'h', { s: t.webS || t.paperS, w: t.webW || t.paperW })}</div>
        <div style="display:flex;gap:2.4em">Ramos<span>Eventos</span><span>Suscripción</span><span>Contacto</span></div>
      </div>
      <div style="display:grid;grid-template-columns:1.1fr 1fr;height:78%">
        <div style="padding:5% 5% 0;display:flex;flex-direction:column;justify-content:center;gap:4%;color:${t.webInk || t.ink}">
          <div style="font-family:${t.fB};font-size:clamp(5px,1cqw,10px);letter-spacing:.2em;text-transform:uppercase;opacity:.6">${t.webEyebrow || 'Florería de autor'}</div>
          <div style="font-family:${t.fD};font-weight:${t.dW || 400};font-size:clamp(14px,4.6cqw,46px);line-height:1;letter-spacing:${t.dTrack || '-.01em'}">${t.headline}</div>
          <div style="font-family:${t.fB};font-size:clamp(6px,1.25cqw,12px);line-height:1.5;opacity:.75;max-width:34ch">${t.sub}</div>
          <div style="margin-top:2%"><span style="display:inline-block;padding:1.1em 2em;border-radius:${t.btnR || '99px'};background:${t.webBtn || t.pri};color:${t.webBtnInk || '#fff'};font-family:${t.fB};font-weight:600;font-size:clamp(5px,1.1cqw,11px);letter-spacing:.08em">${t.cta}</span></div>
        </div>
        <div style="position:relative;margin:0 5% 5% 0;border-radius:${t.heroR || '10px'};overflow:hidden;background:${t.pri}">
          ${t.webArt ? t.webArt(t) : `<div class="abs" style="inset:14%">${logo(t.k, 'sym', { s: t.s })}</div>`}
        </div>
      </div>
    </div>`;

  M.pot = (t) => `
    <div class="abs" style="inset:0;background:${t.surf}"></div>
    <div class="abs" style="left:0;right:0;top:72%;bottom:0;background:rgba(0,0,0,.07)"></div>
    <div class="abs" style="left:31%;top:79%;width:44%;height:6%;border-radius:50%;background:rgba(0,0,0,.35);filter:blur(8px)"></div>
    <svg class="abs" viewBox="0 0 400 320" style="inset:0;width:100%;height:100%" aria-hidden="true">
      <g stroke="#3f6b3a" stroke-width="3" fill="none" stroke-linecap="round"><path d="M200 120 C 196 80, 180 60, 160 40"/><path d="M200 120 C 205 70, 225 50, 248 36"/><path d="M200 120 C 200 90, 202 60, 204 30"/></g>
      <g fill="#4d7d45"><path d="M184 86 c -26 -10 -34 -2 -40 8 c 16 4 30 2 40 -8z"/><path d="M216 80 c 26 -12 36 -4 42 6 c -16 6 -32 4 -42 -6z"/></g>
      <g fill="${t.flower1 || t.accent}"><circle cx="160" cy="40" r="15"/><circle cx="248" cy="36" r="17"/><circle cx="204" cy="28" r="13"/></g>
      <g fill="${t.flower2 || t.paper}" opacity=".9"><circle cx="160" cy="40" r="6"/><circle cx="248" cy="36" r="7"/><circle cx="204" cy="28" r="5"/></g>
      <path d="M128 118 L 272 118 L 256 250 L 144 250 Z" fill="${t.pot || t.pri}"/>
      <rect x="120" y="108" width="160" height="26" rx="3" fill="${t.pot || t.pri}"/>
      <rect x="120" y="108" width="160" height="26" rx="3" fill="rgba(0,0,0,.12)"/>
      <path d="M128 118 L 272 118 L 256 250 L 144 250 Z" fill="url(#${t._potGrad = nid('pg')})"/>
      <defs><linearGradient id="${t._potGrad}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient></defs>
      <g style="--s:${t.potS || t.s};--w:${t.potW || t.w}">${place(t.k, 'sym', 200, 176, 62)}${placeW(t.k, 'word', 200, 224, 74)}</g>
    </svg>`;

  // ---------------------------------------------------------------- render
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let CUR = { name: "" };
  function head(n, title, desc) {
    return `<div class="sec-head rv"><div class="sec-num"><b>${n}</b> / ${CUR.name}</div><h2 class="sec-title">${title}</h2><p class="sec-desc">${desc}</p></div>`;
  }

  function renderUniverse(C) {
    CUR = C;
    const k = C.k;
    const P = Object.fromEntries(C.palette.map((c) => [c.id, c.hex]));
    const app = $('#app');
    let h = '';

    // 01 concepto
    h += `<section class="sec" id="concepto"><div class="wrap">${head('01', 'Concepto', C.concept.intro)}
      <div class="concept">
        <div class="rv">${C.concept.text.map((p, i) => (i === 0 ? `<p class="lead" style="font-family:${C.concept.leadFont || 'inherit'}">${p}</p><div style="height:28px"></div>` : `<p>${p}</p>`)).join('')}
          <div class="kw">${C.concept.keywords.map((w) => `<span>${w}</span>`).join('')}</div></div>
        <div class="sym-stage rv" style="background:${C.concept.stage.bg}">${logo(k, 'sym', { s: C.concept.stage.s, cls: C.concept.stage.cls || '' })}</div>
      </div></div></section>`;

    // 02 logotipo
    const L = C.lockup;
    h += `<section class="sec alt" id="logo"><div class="wrap">${head('02', 'Logotipo', 'La firma completa y sus versiones. Cada una resuelve un espacio distinto: fachada, empaque, redes o un sello pequeño.')}
      <div class="tile hero-logo rv" style="background:${L.bg}">${logo(k, 'full', { s: L.s, w: L.w, style: 'max-height:100%;width:auto' })}<div class="cap" style="color:${onColor(L.bg)}"><span>Versión principal</span><span>Vertical</span></div></div>
      <div style="height:24px"></div>
      <div class="grid g3">
        ${[
          ['h', 'Horizontal', 'Web, encabezados, firmas de correo', L.alt],
          ['sym', 'Isotipo', 'Avatar, sellos, detalles de empaque', L.alt2 || L.alt],
          ['word', 'Logotipo', 'Cintas, textiles, espacios angostos', L.alt3 || L.alt],
        ].map(([v, n, d, b]) => `<div class="rv"><div class="tile ver ${v === 'h' || v === 'word' ? 'wide' : ''}" style="background:${b.bg}">${logo(k, v, { s: b.s, w: b.w, style: v === 'sym' ? 'max-height:100%;width:auto' : '' })}</div><div class="ver-meta"><b>${n}</b><span class="muted">${d}</span></div></div>`).join('')}
      </div></div></section>`;

    // 03 construcción
    const s = BB[k].sym, w = BB[k].word;
    const x0 = Math.min(s[0], w[0]), x1 = Math.max(s[0] + s[2], w[0] + w[2]);
    const fb = [x0, s[1], x1 - x0, w[1] + w[3] - s[1]];
    const X = w[3];
    const m = X * 1.8;
    const cx = s[0] + s[2] / 2, cy = s[1] + s[3] / 2, R = Math.max(s[2], s[3]) / 2;
    const G = C.build;
    const buildSvg = `<svg class="lg" viewBox="${f(fb[0] - m)} ${f(fb[1] - m)} ${f(fb[2] + 2 * m)} ${f(fb[3] + 2 * m)}" aria-label="Construcción y área de protección" xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect x="${f(fb[0] - X)}" y="${f(fb[1] - X)}" width="${f(fb[2] + 2 * X)}" height="${f(fb[3] + 2 * X)}" fill="${G.zone}" stroke="${G.guide}" stroke-width="1.2" stroke-dasharray="6 5"/>
      <rect x="${f(fb[0])}" y="${f(fb[1])}" width="${f(fb[2])}" height="${f(fb[3])}" fill="none" stroke="${G.guide}" stroke-width="1"/>
      <g stroke="${G.guide}" stroke-width="1" fill="none" opacity=".9">
        <circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 0.5)}"/>
        <line x1="${f(cx - R)}" y1="${f(cy)}" x2="${f(cx + R)}" y2="${f(cy)}"/><line x1="${f(cx)}" y1="${f(cy - R)}" x2="${f(cx)}" y2="${f(cy + R)}"/>
        <line x1="${f(cx - R * 0.707)}" y1="${f(cy - R * 0.707)}" x2="${f(cx + R * 0.707)}" y2="${f(cy + R * 0.707)}"/><line x1="${f(cx + R * 0.707)}" y1="${f(cy - R * 0.707)}" x2="${f(cx - R * 0.707)}" y2="${f(cy + R * 0.707)}"/>
        <line x1="${f(fb[0] - m)}" y1="${f(w[1])}" x2="${f(fb[0] + fb[2] + m)}" y2="${f(w[1])}"/><line x1="${f(fb[0] - m)}" y1="${f(w[1] + w[3])}" x2="${f(fb[0] + fb[2] + m)}" y2="${f(w[1] + w[3])}"/>
      </g>
      <g style="--s:${G.s};--w:${G.w}">${use(`${k}-sym`)}${use(`${k}-word`)}</g>
      ${[[fb[0] - X, fb[1] - X], [fb[0] + fb[2], fb[1] - X], [fb[0] - X, fb[1] + fb[3]], [fb[0] + fb[2], fb[1] + fb[3]]].map(([a, b]) => `<rect x="${f(a)}" y="${f(b)}" width="${f(X)}" height="${f(X)}" fill="${G.mod}"/><text x="${f(a + X / 2)}" y="${f(b + X / 2 + 7)}" text-anchor="middle" font-size="22" font-family="Georgia,serif" font-style="italic" fill="${G.modInk}">x</text>`).join('')}
      <text x="${f(fb[0] + fb[2] + X + 10)}" y="${f(w[1] + w[3] / 2 + 7)}" font-size="20" font-family="Georgia,serif" font-style="italic" fill="${G.guide}">x</text>
    </svg>`;
    h += `<section class="sec" id="construccion"><div class="wrap">${head('03', 'Construcción', 'Retícula, proporciones y el aire mínimo que el logo necesita para respirar. <em>x</em> = altura de las mayúsculas de “KOI FLOWERS”.')}
      <div class="build">
        <div class="tile stage rv" style="background:${G.bg}">${buildSvg}<div class="cap" style="color:${G.guide}"><span>Área de protección = 1x</span><span>Retícula circular</span></div></div>
        <div class="grid rv" style="align-content:start">
          <div class="card" style="padding:28px">
            <div class="eyebrow">Área de protección</div>
            <p style="margin:.6em 0 0">Ningún texto, imagen o borde debe invadir el espacio equivalente a <b>1x</b> alrededor de la marca. En piezas pequeñas se respeta como mínimo <b>0,5x</b>.</p>
          </div>
          <div class="card">
            <div class="minsizes">
              <figure><div style="width:112px">${logo(k, 'full', { s: G.s2 || G.s, w: G.w2 || G.w })}</div><figcaption>Vertical · mín. 25 mm / 120 px</figcaption></figure>
              <figure><div style="width:110px">${logo(k, 'h', { s: G.s2 || G.s, w: G.w2 || G.w })}</div><figcaption>Horizontal · mín. 30 mm</figcaption></figure>
              <figure><div style="width:32px">${logo(k, 'sym', { s: G.s2 || G.s })}</div><figcaption>Isotipo · mín. 8 mm / 32 px</figcaption></figure>
            </div>
          </div>
          ${C.build.note ? `<div class="card" style="padding:28px"><div class="eyebrow">Nota de diseño</div><p style="margin:.6em 0 0">${C.build.note}</p></div>` : ''}
        </div>
      </div></div></section>`;

    // 04 color
    h += `<section class="sec alt" id="color"><div class="wrap">${head('04', 'Color', C.colorIntro)}
      <div class="swatches">${C.palette.map((c) => `<div class="sw rv"><div class="chip" style="background:${c.hex};color:${onColor(c.hex)};${lum(c.hex) > 0.85 ? 'box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)' : ''}"><span class="role">${c.role}</span><span class="nm">${c.name}</span></div>
        <dl><dt>HEX</dt><dd><button class="copy" data-copy="${c.hex}" title="Copiar">${c.hex}</button></dd><dt>RGB</dt><dd>${rgb(c.hex).join(' · ')}</dd><dt>CMYK*</dt><dd>${cmyk(c.hex)}</dd></dl></div>`).join('')}</div>
      <div class="ratio rv">${C.palette.filter((c) => c.share).map((c) => `<div style="flex:${c.share};background:${c.hex};color:${onColor(c.hex)}">${c.share}%</div>`).join('')}</div>
      <p class="small muted" style="margin-top:14px">Proporción sugerida de uso en piezas de marca. *CMYK aproximado — se ajusta con prueba de color en imprenta.</p>
      </div></section>`;

    // 05 versiones cromáticas
    h += `<section class="sec" id="versiones"><div class="wrap">${head('05', 'Versiones cromáticas', 'Combinaciones aprobadas sobre fondos de la paleta. Siempre con contraste suficiente para que los koi se lean con claridad.')}
      <div class="grid g3">${C.variants.map((v) => `<div class="rv"><div class="tile ver" style="background:${v.bg};${lum(v.bg) > 0.85 ? 'box-shadow:inset 0 0 0 1px var(--line)' : ''}">${logo(k, 'full', { s: v.s, w: v.w, style: 'max-height:100%;width:auto' })}</div><div class="ver-meta"><b>${v.label}</b><span class="muted">${v.note || ''}</span></div></div>`).join('')}</div>
      </div></section>`;

    // 06 tipografía
    const T = C.type;
    h += `<section class="sec alt" id="tipografia"><div class="wrap">${head('06', 'Tipografía', T.intro)}
      <div class="type-grid">
        <div class="card specimen rv"><div class="eyebrow">Principal · ${T.d.role}</div><div class="aa" style="font-family:${T.d.css};font-weight:${T.d.w || 400}">${T.d.aa || 'Aa'}</div>
          <div class="abc" style="font-family:${T.d.css};font-weight:${T.d.w || 400}">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br>${T.d.lower === false ? '' : 'abcdefghijklmnñopqrstuvwxyz<br>'}0123456789 &amp; ¡!¿?</div>
          <div class="meta"><span><b style="color:var(--fg)">${T.d.name}</b> — ${T.d.note}</span><span>${T.d.src}</span></div></div>
        <div class="card specimen rv"><div class="eyebrow">Secundaria · ${T.b.role}</div><div class="aa" style="font-family:${T.b.css};font-weight:${T.b.w || 400}">${T.b.aa || 'Aa'}</div>
          <div class="abc" style="font-family:${T.b.css}">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br>abcdefghijklmnñopqrstuvwxyz<br>0123456789 &amp; ¡!¿?</div>
          <div class="meta"><span><b style="color:var(--fg)">${T.b.name}</b> — ${T.b.note}</span><span>${T.b.src}</span></div></div>
      </div>
      <div style="height:24px"></div>
      <div class="card hier rv">
        <div class="row"><span class="tag">Titular · ${T.d.name}</span><div style="font-family:${T.d.css};font-weight:${T.d.w || 400};font-size:clamp(32px,5vw,60px);line-height:1.02;letter-spacing:${T.d.track || '-.01em'}">${T.sample.h}</div></div>
        <div class="row"><span class="tag">Subtítulo · ${T.b.name}</span><div style="font-family:${T.b.css};font-size:clamp(20px,2.4vw,28px);line-height:1.3;${T.b.subStyle || ''}">${T.sample.s}</div></div>
        <div class="row"><span class="tag">Texto · ${T.b.name}</span><div style="font-family:${T.b.css};max-width:62ch">${T.sample.p}</div></div>
      </div></div></section>`;

    // 07 elementos gráficos
    const pats = C.patterns.map((p) => ({ ...p, id: pattern(...p.args) }));
    h += `<section class="sec" id="patron"><div class="wrap">${head('07', 'Elementos gráficos', C.patternIntro)}
      <div class="tile pattern-hero rv">${fillSvg(pats[0].id)}${C.patternOverlay ? C.patternOverlay() : ''}<div class="cap" style="color:${pats[0].capColor || '#fff'}"><span>${pats[0].name}</span><span>Papel de envoltura · redes · fondos</span></div></div>
      <div style="height:24px"></div>
      <div class="grid g3">${pats.slice(1).map((p) => `<div class="rv"><div class="tile" style="aspect-ratio:4/3">${fillSvg(p.id)}</div><div class="ver-meta"><b>${p.name}</b><span class="muted">${p.note || ''}</span></div></div>`).join('')}
        ${C.extraGraphic ? `<div class="rv">${C.extraGraphic()}</div>` : ''}</div>
      </div></section>`;

    // 08 usos incorrectos
    const D = C.dont;
    const donts = [
      ['Deformar', 'No estirar ni comprimir', logo(k, 'full', { s: D.s, w: D.w, style: 'transform:scaleX(1.45) scaleY(.8)' })],
      ['Rotar', 'Siempre en posición vertical', logo(k, 'full', { s: D.s, w: D.w, style: 'transform:rotate(-22deg)' })],
      ['Recolorear', 'Solo colores de la paleta', logo(k, 'full', { s: '#2E9E44', w: '#3A7BD5' })],
      ['Bajo contraste', 'Evitar fondos que lo apaguen', logo(k, 'full', { s: D.low, w: D.low })],
      ['Efectos', 'Sin sombras, brillos ni degradados', logo(k, 'full', { s: D.s, w: D.w, style: 'filter:drop-shadow(6px 8px 0 rgba(0,0,0,.45)) blur(.6px)' })],
      ['Reordenar', 'No alterar la composición', logo(k, 'rev', { s: D.s, w: D.w })],
    ];
    h += `<section class="sec alt" id="incorrectos"><div class="wrap">${head('08', 'Usos incorrectos', 'Para que la marca se reconozca siempre igual, estos son los errores más comunes a evitar.')}
      <div class="grid g3">${donts.map(([n, d, svg], i) => `<div class="rv"><div class="tile dont" style="background:${i === 3 ? D.lowBg : D.bg}">${svg}</div><div class="dont-cap"><b>${n}</b><span class="muted">${d}</span></div></div>`).join('')}</div>
      </div></section>`;

    // 09 aplicaciones
    h += `<section class="sec" id="aplicaciones"><div class="wrap">${head('09', 'Aplicaciones', C.mockIntro)}
      <div class="mocks">${C.mocks.map(([type, span, label, over]) => {
        const t = { ...C.mock, ...(over || {}) };
        return `<div class="mock ${span} rv" style="--surf:${t.surf};--mlbl:${t.lbl || 'rgba(0,0,0,.55)'}"><span class="lbl">${label}</span>${M[type](t)}<div class="light"></div></div>`;
      }).join('')}</div>
      <p class="small muted" style="margin-top:18px">Mockups ilustrativos para visualizar la identidad en uso. Datos de contacto y textos de ejemplo.</p>
      </div></section>`;

    // 10 opinión
    h += `<section class="sec alt" id="opinion"><div class="wrap">${head('10', 'Tu opinión', 'Cuéntanos qué sientes con esta propuesta. Tus notas se guardan en este dispositivo y las verás en el formulario final.')}
      <div class="fb rv">
        <div><p class="lead" style="font-family:${C.concept.leadFont || 'inherit'}">¿KOI Flowers se siente así?</p><p class="muted">No hay respuestas incorrectas: “me gusta el símbolo pero no el color” es justo el tipo de comentario que nos ayuda a afinar la siguiente ronda.</p></div>
        <div>
          <div class="react" role="group" aria-label="Reacción">${['💛 Me encanta', '✏️ Con ajustes', '🤔 No me convence'].map((r) => `<button type="button" aria-pressed="false" data-r="${r}">${r}</button>`).join('')}</div>
          <textarea class="note" id="note" placeholder="Lo que más me gusta… lo que cambiaría… (colores, tipografía, símbolo, sensación)"></textarea>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px"><button class="btn" type="button" id="wa1" style="background:#1FA855;border-color:#1FA855;color:#fff">Enviar mi opinión por WhatsApp</button><a class="btn ghost" href="index.html#feedback">Formulario completo →</a></div>
          <div class="saved" id="saved"></div>
        </div>
      </div></div></section>`;

    // navegación final
    h += `<div class="wrap"><div class="next">${C.nav.map((n) => `<a href="${n.href}" style="background:${n.bg};color:${n.fg};border-color:transparent"><small style="color:inherit;opacity:.7">${n.small}</small><strong style="font-family:${n.font}">${n.title}</strong></a>`).join('')}</div>
      <div class="foot"><span>KOI Flowers · Identidad visual · Ronda 01</span><span>We Rock Agencia · Septiembre 2026 · Documento confidencial</span></div></div>`;

    app.insertAdjacentHTML('beforeend', h);
    wireFeedback(C.k);
    wireCommon();
  }

  // ---------------------------------------------------------------- comportamiento
  const store = {
    get(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; } },
    set(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); return true; } catch (e) { return false; } },
  };

  function wireFeedback(k) {
    const key = `koi-fb-${k}`;
    const data = store.get(key) || { r: '', note: '' };
    const btns = document.querySelectorAll('.react button');
    const note = $('#note'), saved = $('#saved');
    const paint = () => btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.r === data.r)));
    const save = () => { const ok = store.set(key, data); saved.textContent = ok ? 'Guardado en este dispositivo ✓' : ''; };
    paint(); note.value = data.note || '';
    btns.forEach((b) => b.addEventListener('click', () => { data.r = data.r === b.dataset.r ? '' : b.dataset.r; paint(); save(); }));
    let tm; note.addEventListener('input', () => { data.note = note.value; clearTimeout(tm); tm = setTimeout(save, 350); });
    $('#wa1').addEventListener('click', () => {
      const txt = `*KOI Flowers — Propuesta ${CUR.name}*
Reacción: ${data.r || '—'}${data.note ? `
${data.note}` : ''}`;
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');
    });
  }

  function toast(msg) {
    let el = $('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 1600);
  }

  function wireCommon() {
    const sy = new URLSearchParams(location.search).get('y');
    if (sy && +sy) { document.body.style.marginTop = -sy + 'px'; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv:not(.in)').forEach((el) => io.observe(el));
    const bar = $('.topbar');
    if (bar) { const on = () => bar.classList.toggle('solid', scrollY > window.innerHeight * 0.6); on(); addEventListener('scroll', on, { passive: true }); }
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-copy]');
      if (!b) return;
      navigator.clipboard && navigator.clipboard.writeText(b.dataset.copy).then(() => toast(`${b.dataset.copy} copiado`), () => {});
    });
  }

  window.KOI = { WA, logo, place, placeW, pattern, fillSvg, grain, renderUniverse, wireCommon, store, toast, BB, onColor };
})();
