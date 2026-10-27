// Painted Ghibli-style scenes with living animated layers on top.
// Every scene uses the paintings' 9:16 frame: a 450 x 800 coordinate space.
import { totoroSVG, soot } from './art.js';
import { avatarSVG } from './avatars.js';

const R = (a, b) => a + Math.random() * (b - a);
const f1 = n => n.toFixed(1);
const many = (n, fn) => Array.from({ length: n }, fn).join('');

export const SCENE_FOR = {
  study: 'treehouse', read: 'treehouse', college: 'train', commute: 'rainpath',
  exercise: 'shrine', relax: 'shrine', shop: 'postbox',
  cook: 'cottage', eat: 'cottage', clean: 'cottage', shower: 'cottage', sleep: 'cottage',
};

const PAINTINGS = {
  train: { src: 'assets/scenes/train.webp', name: 'The autumn gorge railway' },
  rainpath: { src: 'assets/scenes/rain-path.webp', name: 'The rainy lantern path' },
  shrine: { src: 'assets/scenes/shrine.webp', name: 'The forest shrine steps' },
  postbox: { src: 'assets/scenes/postbox.webp', name: 'Hydrangea street' },
  cottage: { src: 'assets/scenes/cottage.webp', name: 'Your little cottage' },
  treehouse: { src: 'assets/scenes/treehouse.webp', name: 'The great treehouse' },
};

export const paintingName = type => PAINTINGS[SCENE_FOR[type] || 'shrine'].name;
export const paintingSrc = key => PAINTINGS[key].src;

// ---------- animated layers ----------
const rain = (n, color = 'rgba(220,232,240,.55)') => many(n, () => {
  const x = R(-20, 480), len = R(14, 26);
  return `<line class="fall" style="--d:860px;animation-duration:${f1(R(0.55, 0.95))}s;animation-delay:-${f1(R(0, 1))}s"
    x1="${f1(x)}" y1="-30" x2="${f1(x - 4)}" y2="${f1(-30 + len)}" stroke="${color}" stroke-width="1.3" stroke-linecap="round"/>`;
});

const motes = (n, [x0, y0, x1, y1], color = '#fff6c9') => many(n, () =>
  `<circle class="mote" style="animation-duration:${f1(R(6, 14))}s;animation-delay:-${f1(R(0, 14))}s"
    cx="${f1(R(x0, x1))}" cy="${f1(R(y0, y1))}" r="${f1(R(0.8, 2.4))}" fill="${color}" filter="url(#glow)"/>`);

const drift = (n, colors, size = [4, 2.4], area = [0, 450]) => many(n, (_, i) =>
  `<ellipse class="leaf" style="--x:${f1(R(-140, 60))}px;--d:${f1(R(600, 860))}px;animation-duration:${f1(R(9, 16))}s;animation-delay:-${f1(R(0, 16))}s"
    cx="${f1(R(area[0], area[1]))}" cy="${f1(R(-30, 40))}" rx="${size[0]}" ry="${size[1]}" fill="${colors[i % colors.length]}"/>`);

const rays = (x, y, color = '#fff7cf') => `<g class="rays">
  ${[[-150, 40], [-60, 34], [40, 46]].map(([dx, w], i) => `<polygon style="animation-delay:-${i * 2}s"
    points="${x},${y} ${x + dx - w},800 ${x + dx + w},800" fill="url(#rayG)" opacity=".35"/>`).join('')}</g>`;

const shimmer = (n, [x0, y0, x1, y1]) => many(n, () =>
  `<path class="twinkle" style="animation-delay:-${f1(R(0, 3))}s" d="M${f1(R(x0, x1))} ${f1(R(y0, y1))} h${f1(R(4, 12))}"
    stroke="#e8fbf6" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>`);

const glow = (x, y, r, cls = 'flicker') => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}" fill="url(#warm)"/>`;

const smoke = (x, y) => many(4, (_, i) =>
  `<circle class="smoke" style="animation-delay:${i * 1.2}s" cx="${x}" cy="${y}" r="7" fill="#f2f0ea"/>`);

const fireflies = (n, [x0, y0, x1, y1]) => many(n, () =>
  `<circle class="firefly" style="animation-duration:${f1(R(4, 8))}s;animation-delay:-${f1(R(0, 8))}s"
    cx="${f1(R(x0, x1))}" cy="${f1(R(y0, y1))}" r="2.2" fill="#f9f3a0" filter="url(#glow)"/>`);

const birds = n => many(n, () => `<g class="fly-p" style="animation-duration:${f1(R(18, 30))}s;animation-delay:-${f1(R(0, 25))}s">
  <path d="M-30 ${f1(R(40, 200))} q5 -5 10 0 q5 -5 10 0" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>`);

const bubbles = n => many(n, () =>
  `<circle class="bubble" style="--d:-${f1(R(250, 500))}px;animation-duration:${f1(R(4, 8))}s;animation-delay:-${f1(R(0, 8))}s"
    cx="${f1(R(20, 430))}" cy="${f1(R(700, 800))}" r="${f1(R(4, 11))}" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-width="1.2"/>`);

const mist = () => `<g class="drift-slow"><ellipse cx="160" cy="430" rx="260" ry="60" fill="#dfe8e6" opacity=".22" filter="url(#soft)"/>
  <ellipse cx="330" cy="560" rx="220" ry="50" fill="#dfe8e6" opacity=".18" filter="url(#soft)"/></g>`;

const tint = tod => ({
  dawn: '<rect width="450" height="800" fill="#ffb38a" opacity=".16" style="mix-blend-mode:soft-light"/>',
  dusk: '<rect width="450" height="800" fill="#ff8a4a" opacity=".28" style="mix-blend-mode:multiply"/>',
  night: '<rect width="450" height="800" fill="#1a2a6b" opacity=".72" style="mix-blend-mode:multiply"/><rect width="450" height="800" fill="#0b1230" opacity=".25"/>',
}[tod] || '');

const stars = () => many(30, () => `<circle class="twinkle" style="animation-delay:-${f1(R(0, 3))}s" cx="${f1(R(0, 450))}" cy="${f1(R(0, 180))}" r="${f1(R(0.5, 1.5))}" fill="#fff"/>`);

// ---------- characters in the scene ----------
const UMBRELLA = '<path d="M19 -26 V-122" stroke="#5a3a2a" stroke-width="2.4"/><path d="M-38 -118 Q19 -164 76 -118 Q62 -124 48 -118 Q33 -124 19 -118 Q5 -124 -10 -118 Q-24 -124 -38 -118Z" fill="#d9443b"/>';
const BASKET = '<path d="M12 -28 q9 -14 18 0" stroke="#8a5a3b" stroke-width="2.2" fill="none"/><path d="M8 -28 h26 l-4 15 h-18z" fill="#c99a5b"/><circle cx="17" cy="-30" r="4" fill="#e2574c"/><path d="M25 -32 l3 -8" stroke="#6aa45f" stroke-width="3"/>';
const BOOK = '<path d="M-17 -42 l17 -4 v20 l-17 4z M17 -42 l-17 -4 v20 l17 4z" fill="#fffaf0" stroke="#9a6fb0" stroke-width="1.6"/>';
const BROOM = '<path d="M20 -28 L30 2" stroke="#8a5a3b" stroke-width="3.5" stroke-linecap="round"/><path d="M24 -2 l14 0 l5 14 l-24 0z" fill="#d9b25b"/>';
const ONIGIRI = '<path d="M12 -34 l9 -14 l9 14z" fill="#fff"/><rect x="13" y="-37" width="16" height="5" fill="#2d3b2f"/>';

const PROPS = { commute: UMBRELLA, shop: BASKET, study: BOOK, read: BOOK, clean: BROOM, eat: ONIGIRI };

const place = (x, y, s, inner, cls = 'bob') => `<g transform="translate(${x} ${y}) scale(${s})"><g class="${cls}">${inner}</g></g>`;
const totoro = (x, y, s, mood = 'happy', extra = '') => place(x, y - 59 * s, s, totoroSVG(mood) + extra);
const LEAF_HAT = '<path d="M-26 -64 q26 -40 52 0 q-26 12 -52 0z" fill="#5f9e4a"/><path d="M0 -84 v20" stroke="#3f6e30" stroke-width="2"/>';

// Small round "window" for moments that happen indoors or on the train.
function inset(kind, avatar) {
  const props = {
    train: `<rect x="-70" y="-135" width="140" height="150" fill="#cfe6f0"/><g class="pan-p">${many(5, (_, i) => `<circle cx="${-60 + i * 40}" cy="-40" r="${R(14, 24)}" fill="${['#e37b3c', '#d9443b', '#6aa45f', '#f2b84b', '#8fbf73'][i]}" opacity=".85"/>`)}</g>
      ${avatarSVG(avatar)}<rect x="-70" y="-135" width="140" height="150" fill="none" stroke="#2f5d5a" stroke-width="16"/>`,
    shower: `<rect x="-70" y="-135" width="140" height="150" fill="#d7eef3"/>${avatarSVG(avatar)}
      ${[[-10, -104, 9], [6, -110, 10], [18, -100, 8], [-20, -96, 7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('')}
      <rect x="-70" y="-30" width="140" height="45" fill="#fdfdfb"/>${many(8, () => `<circle class="bubble" style="--d:-90px;animation-duration:${f1(R(2, 4))}s;animation-delay:-${f1(R(0, 4))}s" cx="${f1(R(-60, 60))}" cy="-28" r="${f1(R(3, 7))}" fill="#fff" fill-opacity=".4" stroke="#fff"/>`)}`,
    sleep: `<rect x="-70" y="-135" width="140" height="150" fill="#2b3566"/>${glow(-40, -100, 40)}
      <g transform="translate(0 8)">${avatarSVG(avatar, { pose: 'sleep' })}</g>
      <path d="M-70 -24 Q0 -46 70 -24 V15 H-70Z" fill="#6b8ec9"/>${many(5, (_, i) => `<circle cx="${-50 + i * 25}" cy="${-14 + (i % 2) * 10}" r="4" fill="#f2d16b"/>`)}
      ${[0, 1.3, 2.6].map(d => `<text class="zzz" style="animation-delay:${d}s" x="18" y="-70" font-size="16" fill="#fdf3c8" font-family="serif">z</text>`).join('')}`,
  }[kind];
  return `<div class="inset ${kind}"><svg viewBox="-60 -125 120 135" xmlns="http://www.w3.org/2000/svg">${props}</svg></div>`;
}

// ---------- scene builders ----------
const BUILD = {
  train(tod, type, av) {
    return {
      fx: shimmer(26, [150, 60, 300, 260]) + shimmer(20, [120, 600, 300, 800]) + drift(20, ['#e8792f', '#d9443b', '#f2b84b', '#c4562f'], [4.5, 2.6])
        + motes(10, [0, 0, 450, 800]),
      chars: '', inset: inset('train', av),
    };
  },
  rainpath(tod, type, av) {
    return {
      fx: glow(326, 286, 70) + glow(326, 286, 26, 'flicker fast') + mist() + rain(120),
      chars: totoro(330, 712, 0.75, 'happy', LEAF_HAT) + place(215, 735, 1.35, avatarSVG(av, { hold: PROPS.commute })),
      after: rain(40, 'rgba(235,242,248,.7)'),
    };
  },
  shrine(tod, type, av) {
    return {
      fx: rays(350, -20) + motes(40, [0, 100, 450, 700]) + drift(14, ['#9cc95a', '#cfe07a', '#e8792f']),
      chars: totoro(95, 690, 0.65, 'happy') + place(225, 770, 1.45, avatarSVG(av, { pose: type === 'exercise' ? 'walk' : 'wave' })),
    };
  },
  postbox(tod, type, av) {
    return {
      fx: glow(407, 72, 60) + motes(26, [0, 100, 450, 700]) + drift(18, ['#f5b8c8', '#e9a0c0', '#c9b7e8'], [3.6, 2.2]),
      chars: totoro(330, 790, 0.55, 'happy') + place(395, 770, 1.15, avatarSVG(av, { pose: 'walk', hold: PROPS.shop })),
    };
  },
  cottage(tod, type, av) {
    const night = tod === 'night' || type === 'sleep';
    let fx = birds(night ? 0 : 5) + smoke(128, 178) + drift(12, ['#f5b8c8', '#fff', '#e8792f'], [3.4, 2]) + motes(18, [0, 300, 450, 800]);
    if (night) fx += stars() + glow(131, 476, 40, 'flicker') + glow(232, 310, 30, 'flicker') + glow(247, 470, 22, 'flicker') + fireflies(16, [0, 450, 450, 780]);
    if (type === 'shower') fx += bubbles(22);
    if (type === 'clean') fx += place(300, 750, 0.9, soot(0, 0, 1), 'scurry-p') + place(150, 770, 0.8, soot(0, 0, 1), 'scurry-p rev');
    const bubbleInset = type === 'shower' ? inset('shower', av) : type === 'sleep' ? inset('sleep', av) : '';
    const chars = (type === 'sleep' ? totoro(320, 760, 0.9, 'sleep') : totoro(330, 768, 0.8, 'happy'))
      + (bubbleInset ? '' : place(215, 770, 1.3, avatarSVG(av, { pose: type === 'cook' ? 'cook' : 'idle', hold: PROPS[type] || '' })));
    return { fx, chars, inset: bubbleInset, night };
  },
  treehouse(tod, type, av) {
    return {
      fx: rays(420, -30, '#fffbe0') + motes(40, [0, 0, 450, 760]) + drift(16, ['#fff', '#f7e1ea', '#cfe07a'], [3.4, 2.2]),
      chars: totoro(395, 790, 0.62, 'happy') + place(300, 775, 1.25, avatarSVG(av, { hold: PROPS[type] || '' })),
    };
  },
};

export function paintedScene(type, tod, avatarId) {
  const key = SCENE_FOR[type] || 'shrine';
  const b = BUILD[key](tod, type, avatarId);
  const t = b.night ? 'night' : tod;
  return `<div class="pscene" data-scene="${key}">
    <svg class="pscene-svg" viewBox="0 0 450 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="rayG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff7cf" stop-opacity=".9"/><stop offset="1" stop-color="#fff7cf" stop-opacity="0"/></linearGradient></defs>
      <g class="kenburns">
        <image href="${PAINTINGS[key].src}" width="450" height="800" preserveAspectRatio="xMidYMid slice"/>
        ${tint(t)}${b.fx}${b.chars}${b.after || ''}
      </g>
    </svg>${b.inset || ''}</div>`;
}
