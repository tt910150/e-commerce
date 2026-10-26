/* Mahsulot rasmlari: har bir buyum uchun SVG illyustratsiya.
   Haqiqiy suratlar qo'shilganda product.image maydoni ishlatiladi (app.js ga qarang). */

const PALETTES = [
  { bg: "#f6dde0", bg2: "#efc9ce", a: "#9b1d3a", b: "#e3a33b", c: "#23306b", d: "#6e8f55" },
  { bg: "#dfe3f4", bg2: "#cbd2ee", a: "#23306b", b: "#9b1d3a", c: "#e3a33b", d: "#ffffff" },
  { bg: "#f6e8c9", bg2: "#efd9a6", a: "#c27c1a", b: "#9b1d3a", c: "#23306b", d: "#6e8f55" },
  { bg: "#dfe9d5", bg2: "#cbdcbd", a: "#6e8f55", b: "#9b1d3a", c: "#e3a33b", d: "#23306b" }
];

let __uid = 0;

/* So'zana rozetkasi — sayt naqshining asosi */
function rosette(cx, cy, r, p, opt = {}) {
  const petals = opt.petals || 8;
  let s = `<g>`;
  // tashqi barglar
  for (let i = 0; i < petals; i++) {
    const ang = (360 / petals) * i;
    s += `<ellipse cx="${cx}" cy="${cy - r * 0.62}" rx="${r * 0.2}" ry="${r * 0.38}" fill="${i % 2 ? p.c : p.a}" transform="rotate(${ang} ${cx} ${cy})"/>`;
  }
  // o'rta barglar
  for (let i = 0; i < petals; i++) {
    const ang = (360 / petals) * i + 180 / petals;
    s += `<ellipse cx="${cx}" cy="${cy - r * 0.45}" rx="${r * 0.12}" ry="${r * 0.26}" fill="${p.b}" transform="rotate(${ang} ${cx} ${cy})"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.36}" fill="${p.a}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.28}" fill="none" stroke="${p.b}" stroke-width="${r * 0.04}" stroke-dasharray="${r * 0.06} ${r * 0.05}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.18}" fill="${p.c}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.08}" fill="${p.b}"/>`;
  return s + `</g>`;
}

function frame(p, inner) {
  const id = "g" + (++__uid);
  return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" role="img">
    <defs>
      <pattern id="${id}" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="${p.bg2}"/></pattern>
      <radialGradient id="${id}l" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="400" height="500" fill="${p.bg}"/>
    <rect width="400" height="500" fill="url(#${id})"/>
    <rect width="400" height="500" fill="url(#${id}l)"/>
    <rect y="390" width="400" height="110" fill="${p.bg2}" opacity=".7"/>
    ${inner}
  </svg>`;
}
const shadow = (cx, y, rx) => `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${rx * 0.14}" fill="#1d1f33" opacity=".13"/>`;

const ART = {
  bag(p) {
    return frame(p, `${shadow(200, 412, 130)}
      <path d="M140 205 C140 120, 260 120, 260 205" fill="none" stroke="#6b3b22" stroke-width="13" stroke-linecap="round"/>
      <path d="M95 205 h210 l20 190 a14 14 0 0 1 -14 16 h-222 a14 14 0 0 1 -14 -16 z" fill="${p.a}"/>
      <g opacity=".95">
        <path d="M95 205 h210 l3 30 h-216 z" fill="${p.c}"/>
        ${[0,1,2,3,4,5,6].map(i => `<path d="M${102 + i * 32} 255 q16 30 0 60 q-16 30 0 60" fill="none" stroke="${p.b}" stroke-width="9" opacity=".85"/>`).join("")}
        ${[0,1,2,3,4,5].map(i => `<path d="M${118 + i * 32} 262 q12 25 0 50 q-12 25 0 50" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`).join("")}
      </g>
      <rect x="185" y="226" width="30" height="20" rx="5" fill="${p.b}"/>`);
  },
  candle(p) {
    return frame(p, `${shadow(200, 410, 110)}
      <rect x="120" y="190" width="160" height="215" rx="22" fill="#fff" opacity=".55"/>
      <rect x="128" y="250" width="144" height="148" rx="16" fill="${p.d === '#ffffff' ? '#f4ead8' : '#f7efe2'}"/>
      <rect x="120" y="290" width="160" height="62" fill="${p.a}"/>
      <text x="200" y="328" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#fff">Mohira</text>
      <path d="M200 250 v-28" stroke="#3a2a20" stroke-width="4"/>
      <path d="M200 160 c18 26 22 44 0 64 c-22 -20 -18 -38 0 -64z" fill="${p.c}"/>
      <path d="M200 186 c8 14 9 24 0 34 c-9 -10 -8 -20 0 -34z" fill="#fff4c2"/>
      <circle cx="200" cy="205" r="70" fill="${p.c}" opacity=".12"/>`);
  },
  painting(p) {
    return frame(p, `${shadow(200, 418, 140)}
      <rect x="70" y="80" width="260" height="330" rx="6" fill="#7a5a3c"/>
      <rect x="86" y="96" width="228" height="298" fill="#fffaf2"/>
      <rect x="100" y="110" width="200" height="270" fill="${p.bg}"/>
      <circle cx="245" cy="170" r="26" fill="${p.c}" opacity=".9"/>
      <path d="M100 300 L160 200 L200 260 L240 190 L300 290 V380 H100z" fill="${p.a}" opacity=".85"/>
      <path d="M100 330 L150 270 L210 320 L260 280 L300 320 V380 H100z" fill="${p.b}" opacity=".6"/>
      <path d="M100 350 Q200 330 300 352 V380 H100z" fill="${p.d === '#ffffff' ? '#6e8f55' : p.d}" opacity=".7"/>`);
  },
  plate(p) {
    let rays = "";
    for (let i = 0; i < 24; i++) rays += `<path d="M200 262 L200 140" stroke="${i % 2 ? p.c : p.a}" stroke-width="7" stroke-linecap="round" transform="rotate(${i * 15} 200 262)" opacity=".85"/>`;
    return frame(p, `${shadow(200, 418, 150)}
      <circle cx="200" cy="262" r="150" fill="#fff"/>
      <circle cx="200" cy="262" r="140" fill="#f8f6f1"/>
      <circle cx="200" cy="262" r="128" fill="none" stroke="${p.c}" stroke-width="10"/>
      ${rays}
      <circle cx="200" cy="262" r="84" fill="#f8f6f1"/>
      ${rosette(200, 262, 78, p)}`);
  },
  vase(p) {
    return frame(p, `${shadow(200, 412, 90)}
      <path d="M170 120 q-10 -40 -30 -60 M200 120 q0 -50 10 -80 M230 120 q14 -40 36 -56" stroke="#8a7a55" stroke-width="4" fill="none"/>
      <circle cx="140" cy="60" r="12" fill="${p.b}"/><circle cx="210" cy="40" r="10" fill="${p.c}"/><circle cx="266" cy="64" r="12" fill="${p.b}"/>
      <path d="M168 118 h64 v26 c60 40 70 130 40 200 q-10 30 -30 66 h-84 q-20 -36 -30 -66 c-30 -70 -20 -160 40 -200z" fill="${p.a}"/>
      <path d="M140 240 h120" stroke="${p.c}" stroke-width="14"/>
      ${[0,1,2,3,4].map(i => `<circle cx="${148 + i * 26}" cy="290" r="8" fill="${p.c}"/>`).join("")}
      <path d="M150 320 q50 26 100 0" stroke="${p.c}" stroke-width="6" fill="none"/>`);
  },
  earrings(p) {
    const one = (x) => `
      <path d="M${x} 110 a14 14 0 1 1 0.1 0" fill="none" stroke="#9aa0b5" stroke-width="5"/>
      <circle cx="${x}" cy="150" r="9" fill="#c9ccd8"/>
      <path d="M${x - 44} 170 h88 l-44 60 z" fill="#c9ccd8"/>
      <path d="M${x - 34} 176 h68 l-34 46 z" fill="${p.c === '#e3a33b' ? '#23306b' : p.c}"/>
      ${[-30,-15,0,15,30].map((d, i) => `<line x1="${x + d}" y1="${230 - Math.abs(d) * 0.6}" x2="${x + d}" y2="${300 - Math.abs(d) * 0.8}" stroke="#c9ccd8" stroke-width="3"/><circle cx="${x + d}" cy="${306 - Math.abs(d) * 0.8}" r="${i === 2 ? 11 : 7}" fill="${i === 2 ? p.b : '#c9ccd8'}"/>`).join("")}`;
    return frame(p, `<rect x="70" y="350" width="260" height="56" rx="10" fill="${p.a}" opacity=".9"/>${one(140)}${one(260)}`);
  },
  necklace(p) {
    let beads = "";
    for (let i = 0; i <= 20; i++) {
      const t = i / 20, ang = Math.PI * (0.08 + 0.84 * t);
      const x = 200 - Math.cos(ang) * 140, y = 90 + Math.sin(ang) * 170;
      beads += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i % 2 ? 7 : 9}" fill="${i % 2 ? '#c9ccd8' : p.b}"/>`;
    }
    return frame(p, `${shadow(200, 412, 100)}${beads}
      <path d="M200 262 l46 22 v70 l-46 30 l-46 -30 v-70z" fill="#c9ccd8"/>
      <path d="M200 276 l32 16 v54 l-32 20 l-32 -20 v-54z" fill="${p.a}"/>
      <circle cx="200" cy="320" r="14" fill="${p.b}"/>
      ${[-30, -10, 10, 30].map(d => `<line x1="${200 + d}" y1="376" x2="${200 + d}" y2="400" stroke="#c9ccd8" stroke-width="3"/><circle cx="${200 + d}" cy="404" r="6" fill="${p.b}"/>`).join("")}`);
  },
  sweets(p) {
    let balls = "";
    const rnd = (n) => { const x = Math.sin(n * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); };
    const pts = [];
    for (let i = 0; i < 90; i++) {
      const a = rnd(i) * Math.PI * 2, d = Math.sqrt(rnd(i + 101)) * 100;
      pts.push([200 + Math.cos(a) * d, 300 + Math.sin(a) * d * 0.4 - (100 - d) * 0.55, i]);
    }
    pts.sort((p, q) => p[1] - q[1]);
    for (const [x, y, i] of pts) {
      balls += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${6 + rnd(i + 7) * 5}" fill="${i % 5 ? '#e7b25a' : '#d18f2e'}"/>`;
    }
    return frame(p, `${shadow(200, 380, 160)}
      <ellipse cx="200" cy="320" rx="160" ry="60" fill="#fff"/>
      <ellipse cx="200" cy="314" rx="150" ry="52" fill="${p.c}"/>
      <ellipse cx="200" cy="308" rx="132" ry="44" fill="#f8f6f1"/>
      ${balls}
      ${[0,1,2,3,4,5].map(i => `<ellipse cx="${150 + i * 20}" cy="${220 + (i % 2) * 14}" rx="7" ry="4" fill="${p.b}" transform="rotate(${i * 30} ${150 + i * 20} ${220})"/>`).join("")}`);
  },
  cake(p) {
    return frame(p, `${shadow(200, 404, 150)}
      <ellipse cx="200" cy="384" rx="150" ry="26" fill="#fff"/>
      <path d="M80 250 v110 a120 26 0 0 0 240 0 v-110z" fill="#fff4ec"/>
      <path d="M80 300 a120 26 0 0 0 240 0" fill="none" stroke="${p.a}" stroke-width="6"/>
      <ellipse cx="200" cy="250" rx="120" ry="26" fill="#fffaf5"/>
      ${[0,1,2,3,4,5,6,7].map(i => `<path d="M${88 + i * 32} 252 q8 22 16 0" fill="#fff4ec" stroke="#f1dccb" stroke-width="2"/>`).join("")}
      ${[[150,236],[200,228],[250,236],[178,250],[224,250]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="13" fill="${p.b}"/><path d="M${x} ${y - 12} q6 -22 18 -26" stroke="#4c6b3b" stroke-width="3" fill="none"/>`).join("")}`);
  },
  pillow(p) {
    return frame(p, `${shadow(200, 404, 150)}
      <path d="M70 120 q130 -20 260 0 q20 140 0 270 q-130 20 -260 0 q-20 -140 0 -270z" fill="${p.d === '#6e8f55' ? '#f8f1e4' : '#f4efe6'}"/>
      <path d="M90 140 q110 -16 220 0 q16 115 0 230 q-110 16 -220 0 q-16 -115 0 -230z" fill="none" stroke="${p.c}" stroke-width="5" stroke-dasharray="10 8"/>
      ${rosette(200, 255, 95, p)}
      ${[[110,160],[290,160],[110,350],[290,350]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="12" fill="${p.b}"/><circle cx="${x}" cy="${y}" r="5" fill="${p.a}"/>`).join("")}`);
  },
  suzani(p) {
    return frame(p, `
      <rect x="60" y="60" width="280" height="350" fill="#fbf6ec"/>
      <rect x="72" y="72" width="256" height="326" fill="none" stroke="${p.a}" stroke-width="10"/>
      ${Array.from({ length: 9 }, (_, i) => `<circle cx="${86 + i * 28.5}" cy="90" r="7" fill="${i % 2 ? p.c : p.b}"/><circle cx="${86 + i * 28.5}" cy="380" r="7" fill="${i % 2 ? p.c : p.b}"/>`).join("")}
      ${rosette(200, 235, 92, p)}
      ${rosette(118, 140, 30, p, { petals: 6 })}${rosette(282, 140, 30, p, { petals: 6 })}
      ${rosette(118, 330, 30, p, { petals: 6 })}${rosette(282, 330, 30, p, { petals: 6 })}
      <path d="M60 410 v18 M90 410 v22 M120 410 v18 M150 410 v22 M180 410 v18 M210 410 v22 M240 410 v18 M270 410 v22 M300 410 v18 M330 410 v22" stroke="${p.a}" stroke-width="4"/>`);
  },
  dress(p) {
    return frame(p, `${shadow(200, 420, 120)}
      <path d="M200 60 v24" stroke="#7a5a3c" stroke-width="5"/>
      <path d="M130 96 q70 -16 140 0" stroke="#7a5a3c" stroke-width="6" fill="none"/>
      <path d="M160 96 q40 30 80 0 l40 40 l-22 26 l-16 -12 v40 l70 220 h-264 l70 -220 v-40 l-16 12 l-22 -26z" fill="${p.a}"/>
      <clipPath id="dr${++__uid}"><path d="M160 96 q40 30 80 0 l40 40 l-22 26 l-16 -12 v40 l70 220 h-264 l70 -220 v-40 l-16 12 l-22 -26z"/></clipPath>
      <g clip-path="url(#dr${__uid})">
        ${[0,1,2,3,4,5,6,7,8].map(i => `<path d="M${40 + i * 40} 90 q22 60 0 120 q-22 60 0 120 q22 60 0 120" fill="none" stroke="${i % 2 ? p.b : p.c}" stroke-width="14" opacity=".9"/>`).join("")}
      </g>
      <path d="M160 96 q40 30 80 0" fill="none" stroke="${p.b}" stroke-width="8"/>`);
  }
};

function productArt(product) {
  const p = PALETTES[product.pal % PALETTES.length];
  return (ART[product.art] || ART.pillow)(p);
}

/* Bosh sahifadagi katta rozetka */
function heroRosette(svg) {
  const P = PALETTES[0];
  let s = `<circle cx="250" cy="250" r="244" fill="${P.bg}"/>`;
  s += `<g class="spin-rev">`;
  for (let i = 0; i < 36; i++) s += `<circle cx="250" cy="22" r="${i % 3 ? 5 : 9}" fill="${i % 3 ? P.c : P.b}" transform="rotate(${i * 10} 250 250)"/>`;
  s += `</g><g class="spin">`;
  for (let i = 0; i < 12; i++) {
    s += `<path d="M250 52 c34 40 34 86 0 118 c-34 -32 -34 -78 0 -118z" fill="${i % 2 ? P.c : P.a}" transform="rotate(${i * 30} 250 250)"/>`;
    s += `<path d="M250 78 c14 22 14 44 0 62 c-14 -18 -14 -40 0 -62z" fill="${P.b}" transform="rotate(${i * 30} 250 250)"/>`;
  }
  for (let i = 0; i < 12; i++) s += `<circle cx="250" cy="66" r="7" fill="#fff" transform="rotate(${i * 30 + 15} 250 250)"/>`;
  s += `</g>`;
  s += `<circle cx="250" cy="250" r="86" fill="#fff"/>`;
  s += rosette(250, 250, 80, { a: P.a, b: P.b, c: P.c });
  svg.innerHTML = s;
}
