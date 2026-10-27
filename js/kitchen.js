// The cooking game (pick a recipe → gather groceries → cook step by step)
// and the market game used while shopping.
import { audio } from './audio.js';

export const FOODS = {
  rice: ['🍚', 'Rice'], salt: ['🧂', 'Salt'], plum: ['🍒', 'Pickled plum'], nori: ['🌿', 'Nori seaweed'],
  noodles: ['🍝', 'Ramen noodles'], ham: ['🍖', 'Ham'], egg: ['🥚', 'Eggs'], onion: ['🌱', 'Green onion'],
  bacon: ['🥓', 'Bacon'], bread: ['🍞', 'Bread'], pumpkin: ['🎃', 'Pumpkin'], fish: ['🐟', 'Herring'],
  flour: ['🌾', 'Flour'], butter: ['🧈', 'Butter'], tofu: ['🧊', 'Tofu'], miso: ['🥣', 'Miso paste'],
  sugar: ['🍬', 'Sugar'], milk: ['🥛', 'Milk'], strawberry: ['🍓', 'Strawberries'], carrot: ['🥕', 'Carrot'],
  tomato: ['🍅', 'Tomato'], mushroom: ['🍄', 'Mushrooms'], apple: ['🍎', 'Apples'], potato: ['🥔', 'Potatoes'],
  cheese: ['🧀', 'Cheese'], honey: ['🍯', 'Honey'], tea: ['🍵', 'Green tea'], cucumber: ['🥒', 'Cucumber'],
};

export const RECIPES = {
  onigiri: {
    name: 'Picnic Onigiri', dish: '🍙', from: 'My Neighbor Totoro', need: ['rice', 'salt', 'plum', 'nori'],
    steps: [
      { k: 'add', tool: 'pot', items: ['rice'], say: 'Put the rice into the pot of water.' },
      { k: 'wait', secs: 4, say: 'Let the rice cook… listen to it bubble!' },
      { k: 'add', tool: 'bowl', items: ['salt'], say: 'Scoop the rice into a bowl and sprinkle some salt.' },
      { k: 'tap', item: '🍚', result: '🍙', taps: 6, label: 'Press!', say: 'Shape the rice into a triangle — press, press, press!' },
      { k: 'add', items: ['plum'], say: 'Hide a pickled plum inside for good luck.' },
      { k: 'add', items: ['nori'], say: 'Wrap it in crispy nori.' },
      { k: 'plate', say: 'Perfect for a picnic under the camphor tree!' },
    ],
  },
  ramen: {
    name: 'Magic Ham Ramen', dish: '🍜', from: 'Ponyo', need: ['noodles', 'ham', 'egg', 'onion'],
    steps: [
      { k: 'wait', tool: 'pot', secs: 3, say: 'Boil the water first.' },
      { k: 'add', items: ['noodles'], say: 'Drop in the noodles.' },
      { k: 'stir', rounds: 3, say: 'Stir in circles so the noodles don\'t stick!' },
      { k: 'wait', secs: 3, lid: true, say: 'Put the lid on… don\'t peek! Three magic seconds…' },
      { k: 'chop', tool: 'board', item: 'onion', taps: 5, say: 'Chop the green onion — tap the board!' },
      { k: 'add', tool: 'pot', items: ['ham', 'egg', 'onion'], say: 'Lid off! Add ham, egg and green onion on top.' },
      { k: 'plate', say: 'Ham! Ham! Ham! It looks amazing.' },
    ],
  },
  breakfast: {
    name: 'Castle Breakfast', dish: '🍳', from: "Howl's Moving Castle", need: ['bacon', 'egg', 'bread'],
    steps: [
      { k: 'add', tool: 'pan', items: ['bacon'], say: 'Lay the bacon in the hot pan.' },
      { k: 'timing', label: 'Flip!', say: 'Sizzle… flip the bacon at the golden moment!' },
      { k: 'tap', item: '🥚', result: '🍳', taps: 2, label: 'Crack!', say: 'Crack the eggs into the pan.' },
      { k: 'wait', secs: 3, say: 'Let the eggs sizzle…' },
      { k: 'add', tool: 'oven', items: ['bread'], say: 'Pop the bread in to toast.' },
      { k: 'timing', label: 'Toast!', say: 'Take the toast out when it\'s golden!' },
      { k: 'plate', say: 'A breakfast fit for a wizard!' },
    ],
  },
  pie: {
    name: 'Pumpkin & Herring Pie', dish: '🥧', from: "Kiki's Delivery Service", need: ['pumpkin', 'fish', 'flour', 'butter'],
    steps: [
      { k: 'chop', tool: 'board', item: 'pumpkin', taps: 6, say: 'Chop the pumpkin into little pieces.' },
      { k: 'add', tool: 'bowl', items: ['flour', 'butter'], say: 'Put flour and butter in the bowl.' },
      { k: 'stir', rounds: 3, say: 'Mix it into a soft pie crust!' },
      { k: 'add', items: ['pumpkin', 'fish'], say: 'Fill the pie with pumpkin and herring.' },
      { k: 'add', tool: 'oven', items: [], say: 'Slide the pie into the oven.' },
      { k: 'timing', label: 'Take it out!', say: 'Take it out when the crust is golden!' },
      { k: 'plate', say: 'Ready to deliver by broom!' },
    ],
  },
  miso: {
    name: 'Cozy Miso Soup', dish: '🍲', from: 'Spirited Away', need: ['tofu', 'miso', 'nori', 'onion'],
    steps: [
      { k: 'wait', tool: 'pot', secs: 3, say: 'Warm the broth in the pot.' },
      { k: 'chop', tool: 'board', item: 'tofu', taps: 4, say: 'Cut the tofu into cubes.' },
      { k: 'add', tool: 'pot', items: ['tofu', 'nori'], say: 'Add tofu and seaweed to the pot.' },
      { k: 'add', items: ['miso'], say: 'Add a spoon of miso.' },
      { k: 'stir', rounds: 2, say: 'Stir gently until the miso melts.' },
      { k: 'chop', tool: 'board', item: 'onion', taps: 4, say: 'Chop a little green onion.' },
      { k: 'add', tool: 'pot', items: ['onion'], say: 'Sprinkle it on top.' },
      { k: 'plate', say: 'Warm enough for a bathhouse worker!' },
    ],
  },
  cookies: {
    name: 'Tea-time Cookies', dish: '🍪', from: 'Arrietty', need: ['flour', 'butter', 'sugar', 'egg'],
    steps: [
      { k: 'add', tool: 'bowl', items: ['flour', 'sugar', 'butter'], say: 'Put flour, sugar and butter in the bowl.' },
      { k: 'tap', item: '🥚', taps: 1, label: 'Crack!', add: 'egg', say: 'Crack in an egg.' },
      { k: 'stir', rounds: 3, say: 'Mix it into cookie dough!' },
      { k: 'tap', tool: 'board', item: '🟤', result: '🍪', taps: 4, label: 'Shape!', say: 'Shape little cookies — tiny enough for a borrower!' },
      { k: 'add', tool: 'oven', items: [], say: 'Into the oven they go.' },
      { k: 'timing', label: 'Take out!', say: 'Take them out when they smell sweet!' },
      { k: 'plate', say: 'Time for tea!' },
    ],
  },
};

const DISTRACTORS = ['carrot', 'tomato', 'mushroom', 'apple', 'potato', 'cheese', 'milk', 'strawberry', 'honey', 'tea', 'cucumber'];
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const em = id => FOODS[id]?.[0] ?? id;

export function mountKitchen(el, { mode = 'cook', dishes = {}, say = () => {}, onDish = () => {}, onShopDone = () => {} }) {
  let raf = 0;
  let session = 0; // bumps whenever the screen changes, so pending step timers from an old screen are ignored
  const stop = () => { cancelAnimationFrame(raf); session++; };

  // ---------- screen 1: recipes ----------
  function recipes() {
    stop();
    el.innerHTML = `<div class="k-title"><h3>👩‍🍳 What shall we cook?</h3><p class="hint">Pick a recipe, gather groceries, then cook it step by step.</p></div>
      <div class="recipes">${Object.entries(RECIPES).map(([id, r]) => `
        <button class="recipe" data-recipe="${id}">
          <span class="dish">${r.dish}</span><b>${r.name}</b><small>inspired by ${r.from}</small>
          <span class="need">${r.need.map(em).join(' ')}</span>
          ${dishes[id] ? `<span class="cooked">cooked ×${dishes[id]}</span>` : ''}
        </button>`).join('')}</div>`;
    el.querySelectorAll('[data-recipe]').forEach(b => b.onclick = () => market(b.dataset.recipe));
  }

  // ---------- screen 2: pantry / market ----------
  function market(recipeId) {
    stop();
    const r = RECIPES[recipeId];
    const need = r ? [...r.need] : shuffle(Object.keys(FOODS)).slice(0, 5);
    const shelf = shuffle([...new Set([...need, ...shuffle(DISTRACTORS).slice(0, 12 - need.length)])]);
    const got = new Set();
    el.innerHTML = `<div class="k-title"><h3>${r ? '🧺 Totoro\'s pantry' : '🏮 The village market'}</h3>
        <p class="hint">${r ? `Find the groceries for <b>${r.name}</b>.` : 'Find everything on your shopping list!'}</p></div>
      <div class="market">
        <div class="shelves">${[0, 1, 2].map(row => `<div class="shelf">${shelf.slice(row * 4, row * 4 + 4).map(id =>
          `<button class="food" data-food="${id}" title="${FOODS[id][1]}"><span>${FOODS[id][0]}</span><small>${FOODS[id][1]}</small></button>`).join('')}</div>`).join('')}</div>
        <div class="gl-card">
          <h4>${r ? 'Recipe needs' : 'Shopping list'}</h4>
          <ul class="glist">${need.map(id => `<li data-need="${id}">${FOODS[id][0]} ${FOODS[id][1]}</li>`).join('')}</ul>
          <div class="basket" id="basket"><span class="basket-icon">🧺</span><div class="in" id="basketIn"></div></div>
          <button class="btn primary" id="toKitchen" disabled>${r ? 'To the kitchen →' : 'Pay & go home 🏡'}</button>
          ${r ? '<button class="btn ghost small" id="backRecipes">← other recipe</button>' : ''}
        </div>
      </div>`;
    say(r ? `Let's find ${need.length} things for ${r.name}! Tap them on the shelves.` : 'Here\'s your shopping list! Tap the items on the shelves 🧺', 'happy');
    el.querySelector('#backRecipes')?.addEventListener('click', recipes);
    el.querySelectorAll('[data-food]').forEach(b => b.onclick = () => {
      const id = b.dataset.food;
      if (got.has(id)) return;
      if (!need.includes(id)) {
        b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope');
        audio.sfx('wrong');
        say(`Hmm, ${FOODS[id][1].toLowerCase()} isn't on the list.`, 'happy');
        return;
      }
      got.add(id);
      audio.sfx('pick');
      b.classList.add('taken');
      el.querySelector(`[data-need="${id}"]`).classList.add('got');
      el.querySelector('#basketIn').insertAdjacentHTML('beforeend', `<span class="drop">${FOODS[id][0]}</span>`);
      if (got.size === need.length) {
        el.querySelector('#toKitchen').disabled = false;
        audio.sfx('ding');
        say(r ? 'Got everything! Let\'s go to the kitchen 🍳' : 'All done! Great shopping 🧺', 'happy');
      }
    });
    el.querySelector('#toKitchen').onclick = () => {
      if (r) kitchen(recipeId);
      else { onShopDone(); shopDone(need); }
    };
  }

  function shopDone(need) {
    el.innerHTML = `<div class="k-finish"><div class="big">🧺</div><h3>Shopping done!</h3>
      <p>${need.map(em).join(' ')}</p><p class="hint">Now finish your real shopping, then press “I'm done!”.</p>
      <button class="btn primary" id="again">Another list</button></div>`;
    el.querySelector('#again').onclick = () => market(null);
  }

  // ---------- screen 3: kitchen ----------
  function kitchen(recipeId) {
    stop();
    const r = RECIPES[recipeId];
    let i = 0, tool = 'pot', stars = 1;
    const contents = { pot: [], pan: [], bowl: [], oven: [], board: [] };

    el.innerHTML = `<div class="k-head"><b>${r.dish} ${r.name}</b><div class="k-dots">${r.steps.map(() => '<i></i>').join('')}</div></div>
      <div class="kitchen">
        <div class="k-window"></div>
        <div class="k-shelf"><span>🫖</span><span>🫙</span><span>🍶</span><span>🪴</span></div>
        <div class="k-area" id="kArea"></div>
        <div class="k-counter"></div>
      </div>
      <div class="k-say" id="kSay"></div>
      <div class="k-controls" id="kCtl"></div>`;
    const area = el.querySelector('#kArea'), ctl = el.querySelector('#kCtl');

    const vessel = (extra = '') => {
      const items = contents[tool].map((e, n) => `<span class="c" style="--i:${n}">${e}</span>`).join('');
      return `<div class="vessel ${tool} ${extra}" id="vessel">
        ${tool === 'oven' ? '<div class="oven-door"><div class="oven-glass">' + items + '</div></div><div class="oven-knobs"><i></i><i></i></div>' : `<div class="v-in">${items}</div><div class="v-body"></div>`}
        ${tool === 'pot' || tool === 'pan' ? '<div class="flame"></div>' : ''}
        <div class="steam-puffs"><i></i><i></i><i></i></div>
      </div>`;
    };

    function step() {
      cancelAnimationFrame(raf);
      const s = r.steps[i];
      if (s.tool) tool = s.tool;
      el.querySelectorAll('.k-dots i').forEach((d, n) => d.className = n < i ? 'done' : n === i ? 'now' : '');
      el.querySelector('#kSay').textContent = s.say;
      ({ add, wait, stir, chop, tap, timing, plate })[s.k](s);
    }
    const run = session;
    const next = (delay = 500) => setTimeout(() => { if (run === session) { i++; step(); } }, delay);

    function add(s) {
      area.innerHTML = vessel(s.k === 'add' && tool !== 'board' ? 'hot' : '');
      if (!s.items.length) {
        ctl.innerHTML = '<button class="btn primary big" id="go">Put it in ✔</button>';
        ctl.querySelector('#go').onclick = () => { audio.sfx('plop'); contents.oven.push(contents.bowl.length ? r.dish : '🟤'); next(100); };
        return;
      }
      const left = new Set(s.items);
      ctl.innerHTML = `<div class="tray">${s.items.map(id => `<button class="chip-food" data-add="${id}">${em(id)} <small>${FOODS[id][1]}</small></button>`).join('')}</div>
        <p class="hint">Tap each ingredient to add it.</p>`;
      ctl.querySelectorAll('[data-add]').forEach(b => b.onclick = () => {
        const id = b.dataset.add;
        if (!left.has(id)) return;
        left.delete(id);
        b.classList.add('used');
        contents[tool].push(em(id));
        audio.sfx(tool === 'pan' ? 'sizzle' : 'plop');
        area.innerHTML = vessel('hot');
        if (!left.size) next();
      });
    }

    function wait(s) {
      area.innerHTML = vessel(`hot boiling ${s.lid ? 'lid' : ''}`);
      ctl.innerHTML = `<div class="meter"><div class="fill" id="wf"></div></div><p class="hint">${s.lid ? 'Shhh… it\'s cooking.' : 'Cooking…'}</p>`;
      const t0 = performance.now(), wf = ctl.querySelector('#wf');
      let lastBubble = 0;
      const loop = t => {
        const p = Math.min(1, (t - t0) / (s.secs * 1000));
        wf.style.width = `${p * 100}%`;
        if (t - lastBubble > 350) { audio.sfx(tool === 'pan' ? 'sizzle' : 'bubble'); lastBubble = t; }
        if (p < 1) raf = requestAnimationFrame(loop);
        else { audio.sfx('ding'); next(300); }
      };
      raf = requestAnimationFrame(loop);
    }

    function stir(s) {
      area.innerHTML = vessel('hot stirring') ;
      const v = area.querySelector('#vessel');
      v.insertAdjacentHTML('beforeend', '<div class="spoon" id="spoon">🥄</div>');
      ctl.innerHTML = '<div class="meter"><div class="fill" id="sf"></div></div><p class="hint">Draw circles over the pot with your finger or mouse (or keep tapping it).</p>';
      const spoon = v.querySelector('#spoon'), sf = ctl.querySelector('#sf');
      const goal = Math.PI * 2 * (s.rounds || 3);
      let total = 0, last = null, done = false, lastSwish = 0;
      const progress = d => {
        if (done) return;
        total += d;
        sf.style.width = `${Math.min(100, (total / goal) * 100)}%`;
        const now = performance.now();
        if (now - lastSwish > 260) { audio.sfx('swish'); lastSwish = now; }
        if (total >= goal) { done = true; audio.sfx('ding'); next(300); }
      };
      const move = e => {
        const b = v.getBoundingClientRect();
        const x = e.clientX - (b.left + b.width / 2), y = e.clientY - (b.top + b.height / 2);
        spoon.style.transform = `translate(${x}px, ${y}px)`;
        const a = Math.atan2(y, x);
        if (last !== null && (e.buttons || e.pointerType === 'mouse')) {
          let d = Math.abs(a - last);
          if (d > Math.PI) d = Math.PI * 2 - d;
          if (d < 1) progress(d);
        }
        last = a;
      };
      v.addEventListener('pointermove', move);
      v.addEventListener('pointerdown', e => { v.setPointerCapture(e.pointerId); progress(0.5); });
    }

    function chop(s) {
      tool = 'board';
      const n = s.taps;
      let c = 0;
      area.innerHTML = `<div class="vessel board" id="vessel"><div class="v-body"></div><div class="whole">${em(s.item)}</div><div class="bits"></div><div class="knife">🔪</div></div>`;
      ctl.innerHTML = `<button class="btn primary big" id="go">Chop! 🔪</button><div class="meter"><div class="fill" id="cf"></div></div>`;
      const v = area.querySelector('#vessel');
      const hit = () => {
        if (c >= n) return;
        c++;
        audio.sfx('chop');
        v.classList.remove('chopping'); void v.offsetWidth; v.classList.add('chopping');
        v.querySelector('.whole').style.transform = `scale(${1 - (c / n) * 0.6})`;
        v.querySelector('.bits').insertAdjacentHTML('beforeend', `<span style="left:${20 + Math.random() * 60}%;top:${30 + Math.random() * 40}%">${em(s.item)}</span>`);
        ctl.querySelector('#cf').style.width = `${(c / n) * 100}%`;
        if (c === n) next(500);
      };
      v.onclick = hit;
      ctl.querySelector('#go').onclick = hit;
    }

    function tap(s) {
      let c = 0;
      area.innerHTML = vessel() + `<div class="tapper" id="tapper">${s.item}</div>`;
      ctl.innerHTML = `<button class="btn primary big" id="go">${s.label}</button><div class="meter"><div class="fill" id="tf"></div></div>`;
      const tp = area.querySelector('#tapper');
      const hit = () => {
        if (c >= s.taps) return;
        c++;
        audio.sfx(s.label.startsWith('Crack') ? 'crack' : 'squish');
        tp.classList.remove('squish'); void tp.offsetWidth; tp.classList.add('squish');
        ctl.querySelector('#tf').style.width = `${(c / s.taps) * 100}%`;
        if (c === s.taps) {
          if (s.result) { tp.textContent = s.result; contents[tool] = [s.result]; }
          if (s.add) contents[tool].push(em(s.add));
          tp.classList.add('pop');
          next(700);
        }
      };
      tp.onclick = hit;
      ctl.querySelector('#go').onclick = hit;
    }

    function timing(s) {
      area.innerHTML = vessel('hot');
      ctl.innerHTML = `<div class="tmeter"><div class="zone"></div><div class="needle" id="needle"></div></div>
        <button class="btn primary big" id="go">${s.label}</button>`;
      const needle = ctl.querySelector('#needle');
      const t0 = performance.now();
      let p = 0, lastFx = 0;
      const loop = t => {
        p = (Math.sin((t - t0) / 420 - Math.PI / 2) + 1) / 2;
        needle.style.left = `${p * 100}%`;
        if (t - lastFx > 300) { audio.sfx(tool === 'pan' ? 'sizzle' : 'bubble'); lastFx = t; }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      ctl.querySelector('#go').onclick = () => {
        cancelAnimationFrame(raf);
        const perfect = p >= 0.6 && p <= 0.82;
        if (perfect) { stars++; audio.sfx('ding'); say('Perfect timing! ✨', 'happy'); }
        else { audio.sfx('wrong'); say(p > 0.82 ? 'Oops, a little crispy — still yummy!' : 'A tiny bit early — still yummy!', 'happy'); }
        ctl.querySelector('.tmeter').classList.add(perfect ? 'hit' : 'miss');
        next(700);
      };
    }

    function plate() {
      stars = Math.min(3, stars + (r.steps.some(s => s.k === 'timing') ? 0 : 1) + 1);
      area.innerHTML = `<div class="plate-wrap"><div class="plate"></div><div class="final">${r.dish}</div><div class="sparkles"><i>✨</i><i>✨</i><i>✨</i></div></div>`;
      ctl.innerHTML = '<button class="btn primary big" id="go">Serve it! 🍽️</button>';
      ctl.querySelector('#go').onclick = () => {
        audio.sfx('ding');
        onDish(recipeId, stars);
        el.innerHTML = `<div class="k-finish"><div class="big bounce">${r.dish}</div><h3>${r.name}</h3>
          <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
          <p>${r.steps[r.steps.length - 1].say}</p>
          <p class="hint">Added to your cookbook! Keep cooking for real, then press “I'm done!” when your meal is ready.</p>
          <button class="btn primary" id="again">Cook something else</button></div>`;
        el.querySelector('#again').onclick = recipes;
      };
    }

    say(`Let's make ${r.name}! Follow my steps 🍳`, 'happy');
    step();
  }

  if (mode === 'shop') market(null); else recipes();
  return { destroy: () => { stop(); el.innerHTML = ''; } };
}
