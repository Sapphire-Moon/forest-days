// Hand-drawn style SVG art: Totoro, activity info and the garden ("My World") decorations.
// Animations live in CSS (see style.css, "scene animations").

export const ACTIVITIES = {
  study: {
    label: 'Study', icon: '📚', color: '#6f9bd1', sounds: ['birds', 'pencil', 'pages', 'breeze'],
    start: ['Let\'s study up in the treehouse — the leaves will keep us company!', 'One page at a time, little sprout.'],
  },
  college: {
    label: 'College / Class', icon: '🚃', color: '#d0675b', sounds: ['train'],
    start: ['All aboard! Let\'s ride to class together.', 'The forest train is waiting — learn lots today!'],
  },
  read: {
    label: 'Reading', icon: '📖', color: '#9b7fc4', sounds: ['wind', 'birds', 'leaves'],
    start: ['Let\'s read under the big tree.', 'Stories make the leaves dance.'],
  },
  cook: {
    label: 'Cooking', icon: '🍳', color: '#e3934a', sounds: ['sizzle', 'bubbles', 'clinks'],
    start: ['Something smells yummy already!', 'Can I taste it when it\'s ready? Hmm-mmm!'],
  },
  eat: {
    label: 'Eating', icon: '🍙', color: '#e6b84a', sounds: ['clinks', 'birds', 'breeze'],
    start: ['Itadakimasu! Eat slowly and enjoy.', 'Rice balls are my favourite too.'],
  },
  shower: {
    label: 'Shower / Bath', icon: '🛁', color: '#62b3c9', sounds: ['shower'],
    start: ['Splish splash! Bubbles everywhere.', 'Warm water washes the tired away.'],
  },
  shop: {
    label: 'Shopping', icon: '🧺', color: '#c97a9b', sounds: ['crowd', 'chimes', 'footsteps'],
    start: ['To the village market! Don\'t forget the list.', 'Maybe they sell acorns…'],
  },
  commute: {
    label: 'Commute / Waiting', icon: '☂️', color: '#7a8fa6', sounds: ['rain', 'drips'],
    start: ['I\'ll walk the lantern path with you.', 'Listen to the rain on the umbrella…'],
  },
  exercise: {
    label: 'Exercise / Walk', icon: '🏃', color: '#6fae5c', sounds: ['wind', 'birds', 'footsteps'],
    start: ['Run like the wind through the forest!', 'Big breaths of forest air!'],
  },
  clean: {
    label: 'Cleaning', icon: '🧹', color: '#a68a64', sounds: ['broom', 'birds'],
    start: ['The soot sprites will help you tidy up!', 'Sweep sweep — the dust bunnies are running away!'],
  },
  sleep: {
    label: 'Sleep / Rest', icon: '🌙', color: '#4e5d94', sounds: ['crickets', 'breeze'],
    start: ['Sweet dreams. I\'ll guard the forest tonight.', 'The fireflies will sing you to sleep.'],
  },
  relax: {
    label: 'Free time', icon: '🌾', color: '#93b86b', sounds: ['wind', 'stream', 'birds'],
    start: ['Free time! Let\'s sit on the shrine steps in the sunshine.', 'Resting is important too.'],
  },
};

export function timeOfDay(d = new Date()) {
  const h = d.getHours() + d.getMinutes() / 60;
  if (h < 5.5 || h >= 20) return 'night';
  if (h < 8) return 'dawn';
  if (h < 17) return 'day';
  return 'dusk';
}

const PAL = {
  dawn: { sky: ['#f4b49b', '#fde3c4'], far: '#b5c79f', near: '#86ad7c', tree: ['#5f8c5a', '#79a66c'], ground: '#9dc283' },
  day: { sky: ['#7dbde6', '#d6eef8'], far: '#a9cf9a', near: '#76ad69', tree: ['#4f8a4b', '#6aa45f'], ground: '#8fc47a' },
  dusk: { sky: ['#e3876a', '#f7cf9b'], far: '#a7a88a', near: '#7a9468', tree: ['#4d6b48', '#647f55'], ground: '#86a66d' },
  night: { sky: ['#16213f', '#37497a'], far: '#2f4560', near: '#26394f', tree: ['#1b2b3d', '#24394d'], ground: '#2c4257' },
};

let _id = 0;
const nid = p => `${p}${++_id}`;
const R = (a, b) => a + Math.random() * (b - a);
const f1 = n => n.toFixed(1);

// ---------- characters ----------

export function totoroSVG(mood = 'happy') {
  const fur = '#7f8c93', dark = '#5f6b72', belly = '#f3ecd6';
  const pupil = mood === 'sad' ? 3 : 4.2;
  const eyes = mood === 'sleep'
    ? '<path d="M-25 -26 q7 5 14 0 M11 -26 q7 5 14 0" stroke="#2b2b2b" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
    : `<g class="blink"><circle cx="-18" cy="-26" r="8" fill="#fff"/><circle cx="18" cy="-26" r="8" fill="#fff"/>
       <circle cx="-17" cy="-25" r="${pupil}" fill="#222"/><circle cx="17" cy="-25" r="${pupil}" fill="#222"/></g>`;
  const mouth = mood === 'sad'
    ? '<path d="M-10 -9 Q0 -16 10 -9" stroke="#3a3a3a" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
    : mood === 'sleep'
      ? '<ellipse cx="0" cy="-12" rx="4" ry="3" fill="#3a3a3a"/>'
      : '<path d="M-24 -17 Q0 0 24 -17 Q0 -9 -24 -17Z" fill="#3a3a3a"/>';
  const tear = mood === 'sad' ? '<path d="M-24 -18 q-3 6 0 8 q3 -2 0 -8Z" fill="#9fd3f2"/>' : '';
  return `<g class="totoro ${mood}">
    <path d="M-25 -38 Q-36 -82 -22 -88 Q-11 -72 -9 -46Z" fill="${fur}"/>
    <path d="M25 -38 Q36 -82 22 -88 Q11 -72 9 -46Z" fill="${fur}"/>
    <ellipse cx="0" cy="0" rx="48" ry="55" fill="${fur}"/>
    <ellipse cx="-43" cy="10" rx="10" ry="25" fill="${dark}" transform="rotate(12 -43 10)"/>
    <ellipse cx="43" cy="10" rx="10" ry="25" fill="${dark}" transform="rotate(-12 43 10)"/>
    <ellipse cx="0" cy="15" rx="35" ry="37" fill="${belly}"/>
    <path d="M-17 0 l5 -5 l5 5 M-3 -2 l5 -5 l5 5 M11 0 l5 -5 l5 5 M-10 10 l5 -5 l5 5 M4 10 l5 -5 l5 5"
      stroke="${fur}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${eyes}${tear}
    <ellipse cx="0" cy="-33" rx="5" ry="2.6" fill="#333"/>
    <path d="M-26 -22 L-52 -29 M-26 -18 L-55 -18 M-26 -14 L-52 -7 M26 -22 L52 -29 M26 -18 L55 -18 M26 -14 L52 -7"
      stroke="#3a3a3a" stroke-width="1.4" stroke-linecap="round"/>
    ${mouth}
    <ellipse cx="-20" cy="53" rx="15" ry="6" fill="${dark}"/><ellipse cx="20" cy="53" rx="15" ry="6" fill="${dark}"/>
  </g>`;
}

const at = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;

export const soot = (x, y, s = 1, cls = 'hop') => at(x, y, s, `<g class="${cls}">
  <circle r="10" fill="#1a1a1a" stroke="#1a1a1a" stroke-width="7" stroke-dasharray="1.5 2.5"/>
  <circle cx="-4" cy="-2" r="3.4" fill="#fff"/><circle cx="4" cy="-2" r="3.4" fill="#fff"/>
  <circle cx="-4" cy="-2" r="1.5"/><circle cx="4" cy="-2" r="1.5"/></g>`);

// ---------- scenery helpers ----------

const cloud = (y, s, dur, op = 0.92) => `<g class="drift" style="animation-duration:${dur}s;animation-delay:-${f1(R(0, dur))}s">
  <g transform="translate(-150 ${y}) scale(${s})" fill="#fff" opacity="${op}">
    <ellipse rx="46" ry="16"/><ellipse cx="-22" cy="-9" rx="24" ry="15"/><ellipse cx="16" cy="-14" rx="28" ry="20"/></g></g>`;

export const tree = (x, y, s, p, trunk = '#6b4a33') => at(x, y, s, `
  <path d="M-11 0 Q-6 -50 -15 -92 L15 -92 Q6 -50 12 0Z" fill="${trunk}"/>
  <g class="sway" style="animation-duration:${f1(R(4, 7))}s">
    <circle cx="-42" cy="-100" r="38" fill="${p[0]}"/><circle cx="40" cy="-104" r="40" fill="${p[0]}"/><circle cx="0" cy="-142" r="52" fill="${p[0]}"/>
    <circle cx="-16" cy="-154" r="30" fill="${p[1]}"/><circle cx="26" cy="-126" r="26" fill="${p[1]}"/><circle cx="-40" cy="-116" r="20" fill="${p[1]}"/>
  </g>`);

const tufts = (n, y0, y1, color, x0 = 0, x1 = 800) => Array.from({ length: n }, () => {
  const x = R(x0, x1), y = R(y0, y1);
  return `<g class="grass" style="animation-delay:-${f1(R(0, 3))}s"><path d="M${f1(x)} ${f1(y)} q-3 -10 -8 -14 M${f1(x)} ${f1(y)} q0 -13 2 -18 M${f1(x)} ${f1(y)} q4 -9 9 -12"
    stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
}).join('');

const flowers = (n, y0, y1, colors = ['#fff', '#f7d14c', '#f29ab0']) => Array.from({ length: n }, (_, i) =>
  `<circle cx="${f1(R(0, 800))}" cy="${f1(R(y0, y1))}" r="${f1(R(2, 3.5))}" fill="${colors[i % colors.length]}"/>`).join('');

const fireflies = (n, [x, y, w, h]) => Array.from({ length: n }, () =>
  `<circle class="firefly" style="animation-duration:${f1(R(4, 8))}s;animation-delay:-${f1(R(0, 8))}s"
    cx="${f1(R(x, x + w))}" cy="${f1(R(y, y + h))}" r="2.6" fill="#f9f3a0" filter="url(#glow)"/>`).join('');

export const GLOBAL_DEFS = `<defs>
  <filter id="glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="2.5" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="12"/></filter>
  <radialGradient id="warm"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".85"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>
</defs>`;
// Shared filters/gradients are injected once into the page (see app.js), so scenes don't repeat them.
const defs = () => '';

export function landscape(tod, { bigTree = false } = {}) {
  const p = PAL[tod], g = nid('sky');
  const night = tod === 'night';
  let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient></defs>
    <rect width="800" height="450" fill="url(#${g})"/>`;
  if (night) {
    s += Array.from({ length: 45 }, () => `<circle class="twinkle" style="animation-delay:-${f1(R(0, 3))}s"
      cx="${f1(R(0, 800))}" cy="${f1(R(0, 230))}" r="${f1(R(0.6, 1.8))}" fill="#fff"/>`).join('');
    s += '<circle cx="650" cy="80" r="44" fill="url(#warm)" opacity=".5"/><circle cx="650" cy="80" r="26" fill="#fdf3c8"/><circle cx="660" cy="74" r="22" fill="#16213f" opacity=".0"/>';
  } else {
    const [sx, sy] = tod === 'dawn' ? [140, 170] : tod === 'dusk' ? [640, 180] : [640, 80];
    s += `<circle cx="${sx}" cy="${sy}" r="80" fill="url(#warm)"/><circle cx="${sx}" cy="${sy}" r="30" fill="${tod === 'day' ? '#fff6cf' : '#ffd99a'}"/>`;
  }
  const op = night ? 0.18 : 0.92;
  s += cloud(70, 1.2, 110, op) + cloud(130, 0.8, 80, op) + cloud(50, 0.6, 140, op) + cloud(170, 1, 95, op);
  s += `<path d="M0 262 Q120 205 250 240 T520 228 T800 222 V450 H0Z" fill="${p.far}"/>`;
  s += [60, 130, 330, 470, 610, 720].map(x =>
    `<circle cx="${x}" cy="${238 - (x % 3) * 6}" r="${18 + (x % 5) * 3}" fill="${p.tree[0]}" opacity=".7"/>`).join('');
  s += `<path d="M0 322 Q200 272 400 310 T800 302 V450 H0Z" fill="${p.near}"/>`;
  if (bigTree) s += tree(660, 330, 1.25, p.tree);
  return s;
}

// ---------- garden decorations ----------
// Each item is drawn with its base at (0,0); w/h give its rough size for thumbnails.

export const ITEMS = [
  { id: 'sunflower', name: 'Sunflowers', price: 5, w: 60, h: 90, svg: () => [-18, 0, 18].map((x, i) => `<g transform="translate(${x} 0)">
      <path d="M0 0 V${-60 - i * 10}" stroke="#4f8a4b" stroke-width="3"/><ellipse cx="6" cy="-30" rx="8" ry="4" fill="#6aa45f"/>
      <g class="sway"><circle cy="${-62 - i * 10}" r="12" fill="#f5c33b"/><circle cy="${-62 - i * 10}" r="5.5" fill="#6b4a33"/></g></g>`).join('') },
  { id: 'mushroom', name: 'Mushroom ring', price: 8, w: 80, h: 40, svg: () => [[-26, 0, 1], [0, -6, 1.3], [26, 2, 0.9]].map(([x, y, s]) =>
      at(x, y, s, '<rect x="-4" y="-14" width="8" height="14" fill="#f5ecd9"/><path d="M-14 -12 q14 -22 28 0z" fill="#d9443b"/><circle cx="-4" cy="-18" r="2.4" fill="#fff"/><circle cx="5" cy="-15" r="2" fill="#fff"/>')).join('') },
  { id: 'soot', name: 'Soot sprites', price: 10, w: 70, h: 30, svg: () => soot(-18, -12, 1) + soot(6, -10, 0.8) + soot(26, -14, 0.9) + '<circle cx="14" cy="-2" r="3" fill="#f29ab0"/><circle cx="-4" cy="-1" r="3" fill="#f7d14c"/>' },
  { id: 'lantern', name: 'Paper lantern', price: 12, w: 40, h: 110, svg: () => `<rect x="-3" y="-100" width="6" height="100" fill="#5a3a2a"/><path d="M0 -96 h18 v10" stroke="#5a3a2a" stroke-width="3" fill="none"/>
      <g class="swing"><ellipse cx="18" cy="-70" rx="22" ry="22" fill="url(#warm)"/><ellipse cx="18" cy="-70" rx="11" ry="14" fill="#e2574c"/><path d="M8 -70 h20 M10 -76 h16 M10 -64 h16" stroke="#b33c32"/></g>` },
  { id: 'hydrangea', name: 'Hydrangea bush', price: 14, w: 90, h: 60, svg: () => `<ellipse cy="-22" rx="44" ry="24" fill="#4f8a4b"/>${[[-24, -34, '#8aa7e0'], [0, -44, '#b48ad9'], [24, -32, '#8aa7e0'], [-8, -26, '#e3a0c8'], [16, -20, '#b48ad9']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="12" fill="${c}"/>`).join('')}` },
  { id: 'bench', name: 'Wooden bench', price: 15, w: 110, h: 50, svg: () => '<rect x="-50" y="-30" width="100" height="8" fill="#a8764f"/><rect x="-50" y="-48" width="100" height="6" fill="#a8764f"/><rect x="-50" y="-40" width="100" height="6" fill="#a8764f"/><rect x="-44" y="-30" width="6" height="30" fill="#7a4e30"/><rect x="38" y="-30" width="6" height="30" fill="#7a4e30"/>' },
  { id: 'umbrella', name: 'Red umbrella', price: 16, w: 90, h: 90, svg: () => '<path d="M0 0 V-70" stroke="#5a3a2a" stroke-width="3"/><path d="M-44 -64 Q0 -110 44 -64 Q33 -70 22 -64 Q11 -70 0 -64 Q-11 -70 -22 -64 Q-33 -70 -44 -64Z" fill="#d9443b"/><path d="M0 0 q0 6 -6 6" stroke="#5a3a2a" stroke-width="3" fill="none"/>' },
  { id: 'bicycle', name: 'Bicycle', price: 18, w: 100, h: 60, svg: () => '<circle cx="-30" cy="-20" r="18" fill="none" stroke="#333" stroke-width="3"/><circle cx="30" cy="-20" r="18" fill="none" stroke="#333" stroke-width="3"/><path d="M-30 -20 L-6 -20 L16 -44 L-14 -44 Z M16 -44 L30 -20 M-14 -44 l-4 -8 h-8 M16 -44 l2 -10 h8" stroke="#2f63a7" stroke-width="3.5" fill="none" stroke-linejoin="round"/><path d="M28 -56 h14 v12 h-14z" fill="#c99a5b"/>' },
  { id: 'busstop', name: 'Bus stop', price: 20, w: 50, h: 120, svg: () => '<rect x="-3" y="-100" width="6" height="100" fill="#4a4a4a"/><circle cy="-100" r="20" fill="#2f63a7" stroke="#fff" stroke-width="3"/><path d="M-10 -104 h20 v8 h-20z" fill="#fff"/><rect x="-14" y="-74" width="28" height="18" fill="#fffaf0" stroke="#4a4a4a"/>' },
  { id: 'cat', name: 'Kitty friend', price: 22, w: 50, h: 60, svg: () => '<ellipse cy="-18" rx="18" ry="18" fill="#f0a65a"/><circle cy="-42" r="14" fill="#f0a65a"/><path d="M-12 -50 l2 -14 l8 8z M12 -50 l-2 -14 l-8 8z" fill="#f0a65a"/><circle cx="-5" cy="-43" r="2" fill="#222"/><circle cx="5" cy="-43" r="2" fill="#222"/><path d="M-3 -37 q3 3 6 0" stroke="#222" fill="none"/><path d="M16 -8 q18 -4 12 -24" stroke="#f0a65a" stroke-width="6" fill="none" stroke-linecap="round" class="sway"/>' },
  { id: 'pond', name: 'Lily pond', price: 25, w: 150, h: 40, svg: () => '<ellipse cy="-14" rx="72" ry="20" fill="#7fbcd4" stroke="#a9a089" stroke-width="5"/><ellipse class="twinkle" cx="-20" cy="-16" rx="18" ry="3" fill="#d6f0f7"/><ellipse cx="22" cy="-10" rx="12" ry="5" fill="#6aa45f"/><circle cx="22" cy="-13" r="4" fill="#f29ab0"/><ellipse cx="-36" cy="-8" rx="9" ry="4" fill="#6aa45f"/>' },
  { id: 'bakery', name: 'Bakery stall', price: 35, w: 130, h: 110, svg: () => `<rect x="-60" y="-50" width="120" height="50" fill="#a8764f"/><rect x="-56" y="-100" width="6" height="52" fill="#7a4e30"/><rect x="50" y="-100" width="6" height="52" fill="#7a4e30"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${-64 + i * 22} -108 h22 v18 q-11 10 -22 0z" fill="${i % 2 ? '#fff6e8' : '#e3934a'}"/>`).join('')}<ellipse cx="-30" cy="-56" rx="14" ry="7" fill="#d9a35b"/><ellipse cx="0" cy="-56" rx="12" ry="8" fill="#c98a3b"/><circle cx="28" cy="-58" r="9" fill="#e8c26a"/>` },
  { id: 'windmill', name: 'Windmill', price: 40, w: 100, h: 160, svg: () => '<path d="M-24 0 L-14 -100 H14 L24 0Z" fill="#f2e6c9" stroke="#c9b48a" stroke-width="2"/><path d="M-18 -100 L0 -122 L18 -100Z" fill="#c4453a"/><rect x="-7" y="-26" width="14" height="26" fill="#8a5a3b"/><g transform="translate(0 -100)"><g class="spin-slow"><path d="M0 0 L-6 -56 L6 -56Z M0 0 L56 -6 L56 6Z M0 0 L6 56 L-6 56Z M0 0 L-56 6 L-56 -6Z" fill="#fffaf0" stroke="#a8764f" stroke-width="2"/></g><circle r="5" fill="#7a4e30"/></g>' },
  { id: 'tree', name: 'Camphor tree', price: 45, w: 170, h: 210, svg: () => tree(0, 0, 1, PAL.day.tree) },
  { id: 'cottage', name: 'Little cottage', price: 60, w: 160, h: 140, svg: () => '<rect x="-64" y="-70" width="128" height="70" fill="#f2e6c9"/><path d="M-80 -66 L0 -130 L80 -66Z" fill="#4f7aa5"/><rect x="40" y="-128" width="14" height="34" fill="#8a5a3b"/><rect x="-16" y="-44" width="30" height="44" fill="#8a5a3b"/><rect x="-50" y="-56" width="26" height="22" fill="#f9e7b0" stroke="#7a4e30" stroke-width="3"/><rect x="30" y="-56" width="26" height="22" fill="#f9e7b0" stroke="#7a4e30" stroke-width="3"/><circle cx="8" cy="-22" r="2" fill="#f2c46b"/>' },
  { id: 'totoro', name: 'Big Totoro', price: 80, w: 120, h: 150, svg: () => `<g transform="translate(0 -59)"><g class="bob">${totoroSVG('happy')}</g></g>` },
  { id: 'castle', name: 'Floating castle', price: 120, w: 170, h: 150, sky: true, svg: () => `<g class="bob-slow"><path d="M-70 -40 Q0 20 70 -40Z" fill="#8a7a66"/><path d="M-60 -40 Q0 0 60 -40" fill="#6aa45f"/>
      <rect x="-40" y="-90" width="80" height="50" fill="#d8cdb6"/><rect x="-54" y="-120" width="22" height="80" fill="#cbbfa5"/><rect x="32" y="-110" width="22" height="70" fill="#cbbfa5"/>
      <path d="M-58 -120 l15 -24 l15 24z M28 -110 l15 -20 l15 20z" fill="#4f7aa5"/><rect x="-10" y="-130" width="20" height="40" fill="#d8cdb6"/><path d="M-14 -130 l14 -20 l14 20z" fill="#c4453a"/>
      ${tree(10, -88, 0.25, PAL.day.tree)}<path d="M-70 -40 q-20 10 -36 4 M70 -40 q20 10 36 4" stroke="#6aa45f" stroke-width="4" fill="none"/></g>` },
];

export const itemSVG = id => ITEMS.find(i => i.id === id)?.svg() ?? '';

export function thumbSVG(item) {
  const pad = 8;
  return `<svg viewBox="${-item.w / 2 - pad} ${-item.h - pad} ${item.w + pad * 2} ${item.h + pad * 2}" xmlns="http://www.w3.org/2000/svg">${defs()}${item.svg()}</svg>`;
}

export function gardenBackdrop(tod) {
  const p = PAL[tod];
  return `${defs()}${landscape(tod)}
    <path d="M0 250 Q200 225 400 240 T800 235 V450 H0Z" fill="${p.ground}"/>
    <path d="M0 330 Q300 300 520 330 T800 320 V450 H0Z" fill="${p.near}" opacity=".35"/>
    ${tufts(50, 260, 445, p.tree[0])}${flowers(45, 260, 445)}
    ${tod === 'night' ? fireflies(14, [0, 200, 800, 220]) : ''}`;
}
