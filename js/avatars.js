// Chibi fan-art avatars inspired by Studio Ghibli characters.
// Every avatar is drawn with its feet at (0,0) and is about 104 units tall.

const SKIN = '#f8dcc4';

export const AVATARS = [
  { id: 'chihiro', name: 'Chihiro', film: 'Spirited Away', hair: '#6b4630', style: 'ponytail', tie: '#9b6fc4',
    top: { kind: 'shirt', color: '#f7c6cf', stripe: '#fff' }, bottom: { kind: 'shorts', color: '#7fa86b' }, shoes: '#e9e2d0' },
  { id: 'kiki', name: 'Kiki', film: "Kiki's Delivery Service", hair: '#2d2430', style: 'bob',
    top: { kind: 'dress', color: '#2f3557' }, shoes: '#c4453a', bow: '#e2393a' },
  { id: 'mei', name: 'Mei', film: 'My Neighbor Totoro', hair: '#7a4b2a', style: 'sprout', tie: '#f3c64b',
    top: { kind: 'dress', color: '#f19a8f' }, shoes: '#e9e2d0' },
  { id: 'satsuki', name: 'Satsuki', film: 'My Neighbor Totoro', hair: '#33231c', style: 'short',
    top: { kind: 'shirt', color: '#f5d77a' }, bottom: { kind: 'skirt', color: '#e48b4a' }, shoes: '#c4453a' },
  { id: 'sophie', name: 'Sophie', film: "Howl's Moving Castle", hair: '#cfd3dc', style: 'braid',
    top: { kind: 'dress', color: '#5a78a8' }, shoes: '#5a3a2a', apron: '#e8e2cf' },
  { id: 'ponyo', name: 'Ponyo', film: 'Ponyo', hair: '#e2563f', style: 'bob',
    top: { kind: 'dress', color: '#e64b3c' }, shoes: '#f2c6b0' },
  { id: 'arrietty', name: 'Arrietty', film: 'Arrietty', hair: '#b8452c', style: 'ponytail', tie: '#8a5a3b', pin: true,
    top: { kind: 'dress', color: '#c4453a' }, shoes: '#6b4a33' },
  { id: 'nausicaa', name: 'Nausicaä', film: 'Nausicaä', hair: '#a8532e', style: 'short', band: '#3a4c6b',
    top: { kind: 'shirt', color: '#79a8cf' }, bottom: { kind: 'pants', color: '#e8dcc0' }, shoes: '#6b4a33' },
  { id: 'san', name: 'San', film: 'Princess Mononoke', hair: '#4a2f22', style: 'short', paint: true, cape: '#efe7d6',
    top: { kind: 'tunic', color: '#f2ece0' }, bottom: { kind: 'pants', color: '#3d3a46' }, shoes: '#5a3a2a' },
  { id: 'haku', name: 'Haku', film: 'Spirited Away', hair: '#2f5f5a', style: 'bob',
    top: { kind: 'shirt', color: '#f7f4ec' }, bottom: { kind: 'pants', color: '#4f6fa8' }, shoes: '#3b3a36' },
  { id: 'howl', name: 'Howl', film: "Howl's Moving Castle", hair: '#e6c46a', style: 'messy',
    top: { kind: 'jacket', color: '#e9a3b6', inner: '#f7f4ec' }, bottom: { kind: 'pants', color: '#3b3a46' }, shoes: '#2d2430' },
  { id: 'pazu', name: 'Pazu', film: 'Castle in the Sky', hair: '#6b4630', style: 'short', cap: '#6b6f5a',
    top: { kind: 'shirt', color: '#f7f4ec' }, bottom: { kind: 'pants', color: '#7a5a3a' }, shoes: '#3b3a36', vest: '#8a6a3a' },
];

export const avatarById = id => AVATARS.find(a => a.id === id) || AVATARS[0];

const limb = (d, color, w = 6) => `<path d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

function backHair(a) {
  const h = a.hair;
  switch (a.style) {
    case 'ponytail': return `<path d="M14 -92 Q34 -86 30 -62 Q28 -48 20 -44 Q24 -60 14 -74Z" fill="${h}"/><circle cx="17" cy="-90" r="4.5" fill="${a.tie}"/>`;
    case 'bob': return `<path d="M-27 -74 Q-30 -102 0 -103 Q30 -102 27 -74 L26 -56 Q14 -52 0 -54 Q-14 -52 -26 -56Z" fill="${h}"/>`;
    case 'braid': return `<path d="M-27 -74 Q-30 -102 0 -103 Q30 -102 27 -74 L24 -64 H-24Z" fill="${h}"/>`
      + [0, 1, 2, 3].map(i => `<ellipse cx="${-22 + i}" cy="${-58 + i * 9}" rx="5.5" ry="6" fill="${h}" stroke="#a9adb8" stroke-width=".8"/>`).join('');
    case 'sprout': return `<ellipse cx="-24" cy="-94" rx="8" ry="10" fill="${h}" transform="rotate(-25 -24 -94)"/><ellipse cx="24" cy="-94" rx="8" ry="10" fill="${h}" transform="rotate(25 24 -94)"/>`
      + `<circle cx="-18" cy="-88" r="3.5" fill="${a.tie}"/><circle cx="18" cy="-88" r="3.5" fill="${a.tie}"/>`;
    case 'messy': return `<path d="M-28 -70 L-34 -80 L-26 -84 L-30 -96 L-16 -96 L-14 -106 L0 -100 L10 -108 L16 -98 L30 -100 L26 -88 L34 -80 L27 -70 Z" fill="${h}"/>`;
    default: return '';
  }
}

function bangs(a) {
  const h = a.hair;
  let s = `<path d="M-25 -74 Q-26 -101 0 -101 Q26 -101 25 -74 Q22 -88 12 -88 Q7 -81 1 -87 Q-6 -81 -12 -87 Q-20 -86 -25 -74Z" fill="${h}"/>`;
  if (a.style === 'short' || a.style === 'messy') s += `<path d="M-25 -76 Q-28 -66 -24 -60 L-21 -72Z M25 -76 Q28 -66 24 -60 L21 -72Z" fill="${h}"/>`;
  if (a.style === 'bob') s += `<path d="M-25 -76 Q-27 -62 -22 -56 L-20 -74Z M25 -76 Q27 -62 22 -56 L20 -74Z" fill="${h}"/>`;
  return s;
}

function face(a, mood) {
  const eyes = mood === 'sleep'
    ? '<path d="M-13 -72 q4 3 8 0 M5 -72 q4 3 8 0" stroke="#3b2a20" stroke-width="2" fill="none" stroke-linecap="round"/>'
    : `<g class="blink"><ellipse cx="-9" cy="-72" rx="3.4" ry="4.6" fill="#3b2a20"/><ellipse cx="9" cy="-72" rx="3.4" ry="4.6" fill="#3b2a20"/>
       <circle cx="-8" cy="-74" r="1.4" fill="#fff"/><circle cx="10" cy="-74" r="1.4" fill="#fff"/></g>`;
  const paint = a.paint ? '<path d="M-19 -66 l6 -5 M-17 -62 l6 -5 M19 -66 l-6 -5 M17 -62 l-6 -5" stroke="#d23b33" stroke-width="2.4" stroke-linecap="round"/><path d="M-3 -88 l3 4 l3 -4" stroke="#d23b33" stroke-width="2" fill="none"/>' : '';
  return `${eyes}
    <ellipse cx="-14" cy="-64" rx="4" ry="2.4" fill="#f2978a" opacity=".6"/><ellipse cx="14" cy="-64" rx="4" ry="2.4" fill="#f2978a" opacity=".6"/>
    <path d="M-3.5 -62 Q0 -59 3.5 -62" stroke="#a0522d" stroke-width="1.6" fill="none" stroke-linecap="round"/>${paint}`;
}

function outfit(a) {
  const t = a.top, b = a.bottom;
  let s = '';
  if (a.cape) s += `<path d="M-20 -50 Q-30 -30 -24 -18 L24 -18 Q30 -30 20 -50Z" fill="${a.cape}" stroke="#d8cdb6"/>`;
  if (t.kind === 'dress') {
    s += `<path d="M-13 -50 H13 L22 -16 Q0 -12 -22 -16Z" fill="${t.color}"/>`;
    if (a.apron) s += `<path d="M-8 -40 H8 L12 -18 H-12Z" fill="${a.apron}"/>`;
    s += '<path d="M-6 -50 L0 -44 L6 -50Z" fill="#fff" opacity=".9"/>';
  } else if (t.kind === 'tunic') {
    s += `<path d="M-14 -50 H14 L17 -24 H-17Z" fill="${t.color}" stroke="#d8cdb6"/>`;
  } else if (t.kind === 'jacket') {
    s += `<path d="M-15 -50 H15 L18 -24 H-18Z" fill="${t.color}"/><path d="M-4 -50 H4 L3 -26 H-3Z" fill="${t.inner}"/>`;
    s += '<path d="M-15 -42 h30 M-16 -34 h32" stroke="#c97f94" stroke-width="1.2" opacity=".7"/>';
  } else {
    s += `<path d="M-14 -50 H14 L16 -26 H-16Z" fill="${t.color}"/>`;
    if (t.stripe) s += `<path d="M-14 -44 H14 M-15 -38 H15 M-15 -32 H15" stroke="${t.stripe}" stroke-width="2.2"/>`;
    if (a.vest) s += `<path d="M-14 -50 L-6 -50 L-8 -26 H-16Z M14 -50 L6 -50 L8 -26 H16Z" fill="${a.vest}"/>`;
  }
  if (b) {
    if (b.kind === 'shorts') s += `<path d="M-16 -27 H16 L16 -18 H2 L0 -22 L-2 -18 H-16Z" fill="${b.color}"/>`;
    if (b.kind === 'skirt') s += `<path d="M-16 -28 H16 L21 -14 H-21Z" fill="${b.color}"/>`;
    if (b.kind === 'pants') s += `<path d="M-15 -28 H15 L13 -4 H3 L0 -18 L-3 -4 H-13Z" fill="${b.color}"/>`;
  }
  return s;
}

function accessories(a) {
  let s = '';
  if (a.bow) s += `<path d="M2 -103 L-14 -112 L-14 -96Z M2 -103 L18 -112 L18 -96Z" fill="${a.bow}"/><circle cx="2" cy="-103" r="4" fill="${a.bow}"/>`;
  if (a.band) s += `<path d="M-25 -84 Q0 -92 25 -84" stroke="${a.band}" stroke-width="3.5" fill="none"/>`;
  if (a.pin) s += '<rect x="-24" y="-90" width="10" height="3.5" rx="1.5" fill="#d9b25b" transform="rotate(-30 -19 -88)"/>';
  if (a.cap) s += `<path d="M-26 -84 Q-24 -106 0 -106 Q24 -106 26 -84Z" fill="${a.cap}"/><path d="M-4 -86 Q16 -88 30 -82" stroke="${a.cap}" stroke-width="4" fill="none"/>`;
  return s;
}

// pose: idle | walk | cook | wave | sleep
export function avatarSVG(id, { pose = 'idle', hold = '' } = {}) {
  const a = typeof id === 'string' ? avatarById(id) : id;
  const sleeve = a.top.kind === 'dress' || a.top.kind === 'tunic' ? a.top.color : a.top.color;
  const legColor = a.bottom?.kind === 'pants' ? a.bottom.color : SKIN;
  const armL = limb('M-13 -47 Q-21 -36 -19 -26', sleeve, 6.5) + `<circle cx="-19" cy="-25" r="3.4" fill="${SKIN}"/>`;
  const armR = pose === 'cook'
    ? `<g class="stir-arm">${limb('M13 -47 Q24 -42 28 -34', sleeve, 6.5)}<circle cx="29" cy="-33" r="3.4" fill="${SKIN}"/></g>`
    : pose === 'wave'
      ? `<g class="wave-arm">${limb('M13 -47 Q24 -56 24 -68', sleeve, 6.5)}<circle cx="24" cy="-70" r="3.4" fill="${SKIN}"/></g>`
      : limb('M13 -47 Q21 -36 19 -26', sleeve, 6.5) + `<circle cx="19" cy="-25" r="3.4" fill="${SKIN}"/>`;
  const legs = `<g class="legL">${limb('M-6 -20 V-5', legColor, 6)}<ellipse cx="-6" cy="-3" rx="5.5" ry="3.2" fill="${a.shoes}"/></g>
    <g class="legR">${limb('M6 -20 V-5', legColor, 6)}<ellipse cx="6" cy="-3" rx="5.5" ry="3.2" fill="${a.shoes}"/></g>`;
  return `<g class="avatar ${pose}">
    <ellipse cx="0" cy="0" rx="20" ry="4.5" fill="#000" opacity=".18"/>
    ${legs}
    <g class="upper">
      ${backHair(a)}${outfit(a)}${armL}${armR}
      <circle cx="0" cy="-76" r="25" fill="${SKIN}"/>
      ${face(a, pose === 'sleep' ? 'sleep' : 'happy')}
      ${bangs(a)}${accessories(a)}${hold}
    </g></g>`;
}

export const avatarBox = (id, pose = 'idle', vb = '-40 -116 80 122') =>
  `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${avatarSVG(id, { pose })}</svg>`;

export const avatarHead = id => `<svg viewBox="-34 -112 68 64" xmlns="http://www.w3.org/2000/svg">${avatarSVG(id)}</svg>`;
