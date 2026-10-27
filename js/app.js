import { state, save, uid, dateKey, shiftKey, replaceState, resetState } from './store.js';
import { ACTIVITIES, ITEMS, GLOBAL_DEFS, totoroSVG, itemSVG, thumbSVG, gardenBackdrop, timeOfDay } from './art.js';
import { AVATARS, avatarBox, avatarHead } from './avatars.js';
import { paintedScene, paintingName } from './scenes.js';
import { mountKitchen, RECIPES } from './kitchen.js';
import { audio } from './audio.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const totoroBox = (mood = 'happy') => `<svg viewBox="-60 -92 120 155" xmlns="http://www.w3.org/2000/svg"><g class="bob">${totoroSVG(mood)}</g></svg>`;

const todayKey = () => dateKey();
let viewDate = todayKey();
let currentTab = 'today';
let vibe = null;          // activity being visited just for fun
let vibeStarted = 0;
let selectedIid = null;
let shopView = 'shop';
let lastTod = timeOfDay();
let lastDay = todayKey();

// ---------- task helpers ----------
const startOf = t => {
  const [y, m, d] = t.date.split('-').map(Number);
  const [h, mi] = t.start.split(':').map(Number);
  return new Date(y, m - 1, d, h, mi).getTime();
};
const deadlineOf = t => startOf(t) + t.duration * 60000;
const fmtClock = ms => new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const fmtDur = m => m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m} min`;
const reward = t => Math.min(30, 5 + Math.floor(t.duration / 10) * 2);
const tasksOn = d => state.tasks.filter(t => t.date === d).sort((a, b) => a.start.localeCompare(b.start));
const lockedToday = () => tasksOn(todayKey()).some(t => t.missed);
const activeTask = () => state.tasks.find(t => t.id === state.activeId && t.status === 'active');
const act = type => ACTIVITIES[type] || ACTIVITIES.relax;

function dayLabel(key) {
  const t = todayKey();
  if (key === t) return 'Today';
  if (key === shiftKey(t, 1)) return 'Tomorrow';
  if (key === shiftKey(t, -1)) return 'Yesterday';
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

const dayGood = d => { const ts = tasksOn(d); return ts.length > 0 && ts.every(t => t.status === 'done' && !t.missed); };
function streak() {
  let n = dayGood(todayKey()) ? 1 : 0;
  let d = shiftKey(todayKey(), -1);
  while (dayGood(d)) { n++; d = shiftKey(d, -1); }
  return n;
}

// ---------- Totoro talks ----------
let toastTimer = null;
function totoroSay(msg, mood = 'happy', { alert = false, startId = null, sad = false } = {}) {
  state.lastMsg = { msg, mood, at: Date.now() };
  $('#toastTotoro').innerHTML = totoroBox(mood);
  $('#toastMsg').textContent = msg;
  const sb = $('#toastStart');
  sb.hidden = !startId;
  sb.onclick = () => { hideToast(); startTask(startId); };
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, startId ? 30000 : 9000);
  renderTotoroCard();
  if (alert) {
    audio.chime(sad);
    if (state.settings.notify && 'Notification' in window && Notification.permission === 'granted' && document.hidden) {
      try { new Notification('Totoro 🌳', { body: msg, tag: 'forest-days' }); } catch { /* some browsers need a service worker */ }
    }
  }
}
function hideToast() { $('#toast').classList.remove('show'); }

function totoroLine() {
  const name = state.name || 'little sprout';
  const ts = tasksOn(todayKey());
  const now = Date.now();
  const a = activeTask();
  if (a) return [`You're doing "${a.title}" — I'm right beside you, ${name}!`, 'happy'];
  if (lockedToday()) return [`A deadline slipped by today… it's okay, ${name}. Tomorrow is a fresh leaf 🍃 Finish what's left anyway!`, 'sad'];
  if (!ts.length) return [`Hmm-mmm! Good ${partOfDay()}, ${name}! Let's plant today's tasks together 🌱`, 'happy'];
  const next = ts.find(t => t.status !== 'done');
  if (!next) return [`You finished everything today! The whole forest is dancing for you, ${name}! 🎉`, 'happy'];
  const s = startOf(next);
  if (s <= now) return [`It's time for ${act(next.type).icon} "${next.title}"! Press ▶ and let's go!`, 'happy'];
  const mins = Math.round((s - now) / 60000);
  return [`Next up: ${act(next.type).icon} "${next.title}" at ${fmtClock(s)} (in ${fmtDur(mins)}). I'll remind you!`, 'happy'];
}

function partOfDay() {
  const h = new Date().getHours();
  return h < 4 ? 'night' : h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
}

// ---------- the clock: reminders & deadlines ----------
function tick() {
  const now = Date.now();
  let changed = false;
  if (todayKey() !== lastDay) { lastDay = todayKey(); viewDate = lastDay; changed = true; }
  for (const t of state.tasks) {
    if (t.status === 'done') continue;
    const s = startOf(t), e = deadlineOf(t);
    t.rem ||= {};
    const a = act(t.type);
    if (!t.missed && now > e) {
      t.missed = true; changed = true;
      if (now - e < 3 * 3600e3) {
        totoroSay(`Oh no… "${t.title}" went past its deadline. The forest shop will rest for today 🍂 — but you can still finish it!`, 'sad', { alert: true, sad: true });
      }
    } else if (!t.missed) {
      if (!t.rem.pre && now >= s - 5 * 60000 && now < s) {
        t.rem.pre = 1; changed = true;
        totoroSay(`In 5 minutes: ${a.icon} "${t.title}". Get ready, ${state.name || 'sprout'}!`, 'happy', { alert: true, startId: t.id });
      }
      if (!t.rem.start && now >= s && now < e) {
        t.rem.start = t.rem.pre = 1; changed = true;
        if (t.status !== 'active') totoroSay(`It's time for ${a.icon} "${t.title}"! Tap start and I'll come with you 🌱`, 'happy', { alert: true, startId: t.id });
      }
      if (!t.rem.end && now >= e - 5 * 60000 && now < e && t.duration > 10) {
        t.rem.end = 1; changed = true;
        totoroSay(`5 minutes left for "${t.title}" — finish strong! 💪`, 'happy', { alert: true });
      }
    }
  }
  if (timeOfDay() !== lastTod) { lastTod = timeOfDay(); if (currentTab === 'world') renderWorld(); renderStage(); }
  if (changed) { save(); renderAll(); }
}

// ---------- actions ----------
function addTask(e) {
  e.preventDefault();
  const t = {
    id: uid(), title: $('#fTitle').value.trim(), type: $('#fType').value,
    date: $('#fDate').value, start: $('#fStart').value, duration: +$('#fDur').value,
    status: 'todo', missed: false, rem: {},
  };
  if (!t.title || !t.date || !t.start) return;
  if (deadlineOf(t) <= Date.now()) {
    $('#fHint').textContent = 'That time has already passed — pick a later start time 🕰️';
    return;
  }
  state.tasks.push(t);
  save();
  viewDate = t.date;
  $('#fTitle').value = '';
  $('#fHint').textContent = `Planted! Deadline: ${fmtClock(deadlineOf(t))} · worth ${reward(t)} 🌰 if done on time.`;
  audio.pop();
  renderAll();
}

function startTask(id) {
  const t = state.tasks.find(x => x.id === id);
  if (!t || t.status === 'done') return;
  const prev = activeTask();
  if (prev && prev.id !== id) prev.status = 'todo';
  t.status = 'active';
  t.startedAt = Date.now();
  state.activeId = id;
  vibe = null;
  save();
  totoroSay(pick(act(t.type).start), 'happy');
  showTab('adventure');
  playAmbience(t.type);
  renderAll();
  renderStage();
}

function completeTask(id) {
  const t = state.tasks.find(x => x.id === id);
  if (!t || t.status === 'done') return;
  const now = Date.now();
  t.status = 'done';
  t.doneAt = now;
  t.onTime = !t.missed && now <= deadlineOf(t);
  if (state.activeId === id) { state.activeId = null; audio.stop(); }
  if (t.onTime) {
    const r = reward(t);
    state.acorns += r; state.earned += r;
    celebrate();
    let msg = `Yay! "${t.title}" done on time! +${r} 🌰`;
    const today = tasksOn(t.date);
    if (t.date === todayKey() && today.length >= 3 && today.every(x => x.status === 'done' && !x.missed) && !state.bonus[t.date]) {
      state.bonus[t.date] = true;
      state.acorns += 15; state.earned += 15;
      msg += ' …and a PERFECT DAY bonus of +15 🌰! 🎉';
    }
    totoroSay(msg, 'happy', { alert: true });
  } else {
    totoroSay(`You finished "${t.title}" — late, but you did it! No acorns this time, but I'm still proud of you.`, 'happy');
  }
  save();
  renderAll();
  renderStage();
}

function deleteTask(id) {
  const t = state.tasks.find(x => x.id === id);
  if (!t) return;
  if (t.missed || t.status === 'done') return; // finished or missed tasks stay in the record
  if (!confirm(`Remove "${t.title}" from your plan?`)) return;
  state.tasks = state.tasks.filter(x => x.id !== id);
  if (state.activeId === id) { state.activeId = null; audio.stop(); }
  save();
  renderAll();
  renderStage();
}

function leaveStage() {
  const a = activeTask();
  if (a) { a.status = 'todo'; state.activeId = null; save(); }
  vibe = null;
  audio.stop();
  renderAll();
  renderStage();
}

function visit(type) {
  const a = activeTask();
  if (a) { a.status = 'todo'; state.activeId = null; save(); }
  vibe = type;
  vibeStarted = Date.now();
  playAmbience(type);
  totoroSay(pick(act(type).start), 'happy');
  renderStage();
  renderAll();
  $('#stage').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function playAmbience(type) {
  audio.play(act(type).sounds, { music: state.settings.music && type !== 'sleep' });
  updateSoundBtn();
}

function addSampleDay() {
  const now = new Date();
  let m = Math.ceil((now.getHours() * 60 + now.getMinutes() + 10) / 15) * 15;
  const plan = [
    ['Morning shower', 'shower', 20], ['Breakfast', 'eat', 20], ['Study session', 'study', 45],
    ['Tidy my room', 'clean', 20], ['Read a story', 'read', 30], ['Evening walk', 'exercise', 30],
  ];
  for (const [title, type, duration] of plan) {
    if (m + duration >= 24 * 60) break;
    const z = n => String(n).padStart(2, '0');
    state.tasks.push({ id: uid(), title, type, duration, date: todayKey(), start: `${z(Math.floor(m / 60))}:${z(m % 60)}`, status: 'todo', missed: false, rem: {} });
    m += duration + 15;
  }
  viewDate = todayKey();
  save();
  renderAll();
  totoroSay('I planted a sample day for you! Change it however you like 🌱', 'happy');
}

// ---------- rendering: header & My Day ----------
function renderHeader() {
  $('#acornCount').textContent = state.acorns;
  $('#streakCount').textContent = streak();
  $('#greeting').textContent = state.name ? `Good ${partOfDay()}, ${state.name}!` : 'Welcome to the forest';
  $('#muteBtn').textContent = state.settings.muted ? '🔇' : '🔊';
  $('#avatarBtn').innerHTML = avatarHead(state.avatar);
}

function renderAvatarGrid(host) {
  host.innerHTML = AVATARS.map(a => `<button type="button" class="avatar-pick ${a.id === state.avatar ? 'active' : ''}" data-avatar="${a.id}" title="${a.name} — ${a.film}">
    ${avatarBox(a.id)}<b>${a.name}</b><small>${a.film}</small></button>`).join('');
}

function renderTotoroCard() {
  const [msg, mood] = totoroLine();
  $('#totoroBig').innerHTML = totoroBox(mood);
  $('#totoroMsg').textContent = msg;
}

function statusChip(t) {
  const now = Date.now();
  if (t.status === 'done') return t.onTime ? `<span class="chip ok">+${reward(t)} 🌰 on time</span>` : '<span class="chip late">finished late</span>';
  if (t.missed) return '<span class="chip miss">missed 💧</span>';
  if (t.status === 'active') return '<span class="chip live">in progress ✨</span>';
  if (now >= startOf(t)) return '<span class="chip now">now!</span>';
  return `<span class="chip">${reward(t)} 🌰</span>`;
}

function renderToday() {
  renderTotoroCard();
  const ts = tasksOn(viewDate);
  $('#dayTitle').textContent = dayLabel(viewDate);
  const done = ts.filter(t => t.status === 'done').length;
  $('#dayProgress').style.width = ts.length ? `${(done / ts.length) * 100}%` : '0%';
  $('#dayProgressLabel').textContent = ts.length ? `${done} of ${ts.length} done` : '';
  $('#emptyDay').hidden = ts.length > 0;
  $('#sampleBtn').hidden = viewDate !== todayKey();
  $('#taskList').innerHTML = ts.map(t => {
    const a = act(t.type);
    const cls = t.status === 'done' ? 'done' : t.missed ? 'missed' : t.status === 'active' ? 'active' : '';
    return `<li class="task ${cls}" style="--c:${a.color}">
      <div class="task-time">${fmtClock(startOf(t))}<small>until ${fmtClock(deadlineOf(t))}</small></div>
      <div class="task-icon">${a.icon}</div>
      <div class="task-main"><b>${esc(t.title)}</b><small>${a.label} · ${fmtDur(t.duration)}</small>${statusChip(t)}</div>
      <div class="task-actions">
        ${t.status !== 'done' ? `<button class="btn small primary" data-start="${t.id}">${t.status === 'active' ? '↗ Open' : '▶ Start'}</button>
          <button class="btn small" data-done="${t.id}" title="Mark done">✓</button>` : ''}
        ${t.status !== 'done' && !t.missed ? `<button class="btn small ghost" data-del="${t.id}" title="Remove">✕</button>` : ''}
      </div></li>`;
  }).join('');
}

// ---------- rendering: Adventure ----------
let sceneKey = '';
let game = null, gameKey = '';
function renderStage() {
  const a = activeTask();
  const type = a ? a.type : vibe;
  const tod = timeOfDay();
  const key = `${type || 'idle'}|${tod}|${state.avatar}`;
  if (key !== sceneKey) {
    $('#sceneHost').innerHTML = paintedScene(type || 'relax', tod, state.avatar);
    sceneKey = key;
  }
  $('#placeName').textContent = `📍 ${paintingName(type || 'relax')}`;
  // Cooking and shopping come with a playable mini-game.
  const wantGame = type === 'cook' || type === 'shop' ? type : '';
  if (wantGame !== gameKey) {
    game?.destroy();
    game = null;
    gameKey = wantGame;
    if (wantGame) {
      game = mountKitchen($('#game'), {
        mode: wantGame, dishes: state.dishes,
        say: (msg, mood) => totoroSay(msg, mood),
        onDish: (id, stars) => {
          state.dishes[id] = (state.dishes[id] || 0) + 1;
          save();
          celebrate(20);
          totoroSay(`You cooked ${RECIPES[id].name}! ${'★'.repeat(stars)} It's in your cookbook now.`, 'happy', { alert: true });
        },
        onShopDone: () => { celebrate(16); totoroSay('Every item is in the basket! 🧺', 'happy'); },
      });
    }
  }
  $('#playCard').hidden = !wantGame;
  $('#hud').hidden = $('#hudBar2').hidden = !type;
  $('#stageIntro').hidden = !!type;
  $('#stage').classList.toggle('idle', !type);
  if (type) {
    const info = act(type);
    $('#hudKind').textContent = `${info.icon} ${info.label}`;
    $('#hudTitle').textContent = a ? a.title : `Visiting the ${info.label.toLowerCase()} world`;
    $('#doneBtn').hidden = !a;
  }
  updateHud();
  updateSoundBtn();

  const upcoming = tasksOn(todayKey()).filter(t => t.status !== 'done');
  $('#quickTasks').innerHTML = upcoming.length
    ? upcoming.map(t => `<button class="quick-task ${t.status === 'active' ? 'active' : ''}" data-start="${t.id}" style="--c:${act(t.type).color}">
        <span>${act(t.type).icon}</span><b>${esc(t.title)}</b><small>${fmtClock(startOf(t))}${t.missed ? ' · missed' : ''}</small></button>`).join('')
    : '<p class="hint">Nothing left on today\'s plan. Plant something in <b>My Day</b>!</p>';
}

function updateHud() {
  const a = activeTask();
  if (!a && !vibe) return;
  const now = Date.now();
  if (a) {
    const left = deadlineOf(a) - now;
    const total = a.duration * 60000;
    const elapsed = now - startOf(a);
    const fmt = ms => { const s = Math.floor(Math.abs(ms) / 1000); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); return `${h ? h + ':' : ''}${String(m).padStart(h ? 2 : 1, '0')}:${String(s % 60).padStart(2, '0')}`; };
    if (now < startOf(a)) {
      $('#hudTime').textContent = fmt(total);
      $('#hudSub').textContent = `Starting early — deadline ${fmtClock(deadlineOf(a))}`;
      $('#hudBar').style.width = '0%';
    } else {
      $('#hudTime').textContent = left >= 0 ? fmt(left) : `+${fmt(left)}`;
      $('#hudSub').textContent = left >= 0 ? `left · deadline ${fmtClock(deadlineOf(a))} · worth ${reward(a)} 🌰` : 'past the deadline — finish anyway!';
      $('#hudBar').style.width = `${Math.min(100, (elapsed / total) * 100)}%`;
    }
    $('#hudTime').classList.toggle('over', left < 0);
  } else {
    const s = Math.floor((now - vibeStarted) / 1000);
    $('#hudTime').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    $('#hudSub').textContent = 'just relaxing here';
    $('#hudBar').style.width = '0%';
    $('#hudTime').classList.remove('over');
  }
}

function updateSoundBtn() {
  $('#soundBtn').textContent = audio.running ? '🎧 Sounds on' : '🎧 Play sounds';
}

// ---------- rendering: My World ----------
const SKY_Y = [50, 230], GROUND_Y = [255, 440];
const itemScale = (it, def) => def.sky ? 0.8 : 0.55 + ((it.y - GROUND_Y[0]) / (GROUND_Y[1] - GROUND_Y[0])) * 0.6;

function renderWorld() {
  const tod = timeOfDay();
  const placed = state.items.filter(i => i.placed).sort((a, b) => {
    const sa = ITEMS.find(x => x.id === a.id)?.sky, sb = ITEMS.find(x => x.id === b.id)?.sky;
    return (sa === sb) ? a.y - b.y : sa ? -1 : 1;
  });
  $('#garden').innerHTML = gardenBackdrop(tod) + placed.map(it => {
    const def = ITEMS.find(x => x.id === it.id);
    if (!def) return '';
    const s = itemScale(it, def);
    return `<g class="gitem ${it.iid === selectedIid ? 'selected' : ''}" data-iid="${it.iid}" transform="translate(${it.x} ${it.y}) scale(${it.flip ? -s : s} ${s})">
      <ellipse class="sel-ring" cx="0" cy="0" rx="${def.w / 2 + 8}" ry="10"/>${itemSVG(it.id)}</g>`;
  }).join('') + (placed.length ? '' : `<text x="400" y="330" text-anchor="middle" class="garden-empty">Your world is waiting… buy something from the forest shop! 🌱</text>`);

  const locked = lockedToday();
  $('#shopLock').hidden = !locked || shopView !== 'shop';
  $('#lockTotoro').innerHTML = totoroBox('sad');
  $('#flipBtn').disabled = $('#storeBtn').disabled = !state.items.some(i => i.iid === selectedIid && i.placed);

  const stored = state.items.filter(i => !i.placed);
  $('#storageCount').textContent = stored.length || '';
  $$('[data-shop]').forEach(b => b.classList.toggle('active', b.dataset.shop === shopView));
  if (shopView === 'shop') {
    $('#shopList').innerHTML = ITEMS.map(def => {
      const owned = state.items.filter(i => i.id === def.id).length;
      const afford = state.acorns >= def.price;
      return `<div class="shop-item ${!afford || locked ? 'dim' : ''}">
        <div class="thumb">${thumbSVG(def)}</div>
        <b>${def.name}</b>${owned ? `<small>owned ×${owned}</small>` : '<small>&nbsp;</small>'}
        <button class="btn small ${afford && !locked ? 'primary' : ''}" data-buy="${def.id}">${locked ? '🔒' : ''} ${def.price} 🌰</button></div>`;
    }).join('');
  } else {
    $('#shopList').innerHTML = stored.length
      ? stored.map(it => { const def = ITEMS.find(x => x.id === it.id); return `<div class="shop-item"><div class="thumb">${thumbSVG(def)}</div><b>${def.name}</b><small>&nbsp;</small><button class="btn small primary" data-place="${it.iid}">Place 🌱</button></div>`; }).join('')
      : '<p class="hint">Nothing in storage. Select an item in your world and press "Put away" to keep it here.</p>';
  }
}

function buy(id) {
  const def = ITEMS.find(x => x.id === id);
  if (!def) return;
  if (lockedToday()) { totoroSay('The shop is resting today because a deadline was missed. Let\'s try again tomorrow! 🌙', 'sad'); return; }
  if (state.acorns < def.price) { totoroSay(`You need ${def.price - state.acorns} more 🌰 for the ${def.name}. Finish tasks on time to earn them!`, 'happy'); return; }
  state.acorns -= def.price;
  const y = def.sky ? 60 + Math.random() * 120 : 280 + Math.random() * 140;
  const it = { iid: uid(), id, x: Math.round(80 + Math.random() * 640), y: Math.round(y), placed: true, flip: false };
  state.items.push(it);
  selectedIid = it.iid;
  save();
  audio.chime();
  celebrate(14);
  totoroSay(`A new ${def.name} for your world! Drag it wherever you like.`, 'happy');
  renderHeader();
  renderWorld();
}

function setupGarden() {
  const svg = $('#garden');
  let drag = null;
  const toSvg = e => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  svg.addEventListener('pointerdown', e => {
    const g = e.target.closest('.gitem');
    if (!g) { selectedIid = null; renderWorld(); return; }
    const it = state.items.find(i => i.iid === g.dataset.iid);
    const p = toSvg(e);
    drag = { it, g, dx: it.x - p.x, dy: it.y - p.y, moved: false };
    selectedIid = it.iid;
    $$('.gitem.selected').forEach(n => n.classList.remove('selected'));
    g.classList.add('selected');
    $('#flipBtn').disabled = $('#storeBtn').disabled = false;
    svg.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  svg.addEventListener('pointermove', e => {
    if (!drag) return;
    const p = toSvg(e);
    const def = ITEMS.find(x => x.id === drag.it.id);
    const [y0, y1] = def.sky ? SKY_Y : GROUND_Y;
    drag.it.x = Math.round(Math.max(30, Math.min(770, p.x + drag.dx)));
    drag.it.y = Math.round(Math.max(y0, Math.min(y1, p.y + drag.dy)));
    const s = itemScale(drag.it, def);
    drag.g.setAttribute('transform', `translate(${drag.it.x} ${drag.it.y}) scale(${drag.it.flip ? -s : s} ${s})`);
    drag.moved = true;
  });
  const end = () => { if (!drag) return; if (drag.moved) { save(); renderWorld(); } drag = null; };
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);
}

// ---------- rendering: Journal ----------
function renderJournal() {
  const all = state.tasks.filter(t => t.date <= todayKey());
  const done = all.filter(t => t.status === 'done');
  const onTime = done.filter(t => t.onTime).length;
  const finished = all.filter(t => t.status === 'done' || t.missed).length;
  $('#statCards').innerHTML = [
    ['🔥', streak(), 'perfect-day streak'],
    ['✅', done.length, 'tasks completed'],
    ['⏰', finished ? `${Math.round((onTime / finished) * 100)}%` : '—', 'on time'],
    ['🌰', state.earned, 'acorns earned'],
    ['🏡', state.items.length, 'world treasures'],
    ['🍳', Object.values(state.dishes).reduce((a, b) => a + b, 0), 'dishes cooked'],
  ].map(([i, v, l]) => `<div class="card stat-card"><span>${i}</span><b>${v}</b><small>${l}</small></div>`).join('');

  const days = Array.from({ length: 7 }, (_, i) => shiftKey(todayKey(), i - 6));
  const max = Math.max(3, ...days.map(d => tasksOn(d).length));
  $('#weekChart').innerHTML = days.map(d => {
    const ts = tasksOn(d);
    const ok = ts.filter(t => t.onTime).length;
    const bad = ts.filter(t => t.missed).length;
    const [y, m, dd] = d.split('-').map(Number);
    const wd = new Date(y, m - 1, dd).toLocaleDateString([], { weekday: 'short' });
    return `<div class="bar-col" title="${ok} on time, ${bad} late/missed">
      <div class="bar-stack"><div class="bar late" style="height:${(bad / max) * 100}%"></div><div class="bar ok" style="height:${(ok / max) * 100}%"></div></div>
      <small class="${d === todayKey() ? 'today' : ''}">${wd}</small></div>`;
  }).join('');

  const mins = {};
  state.tasks.filter(t => t.status === 'done' && days.includes(t.date)).forEach(t => { mins[t.type] = (mins[t.type] || 0) + t.duration; });
  const top = Math.max(1, ...Object.values(mins));
  const cats = Object.entries(mins).sort((a, b) => b[1] - a[1]);
  $('#catBars').innerHTML = cats.length
    ? cats.map(([type, m]) => `<div class="cat"><span>${act(type).icon} ${act(type).label}</span>
        <div class="cat-bar"><div style="width:${(m / top) * 100}%;background:${act(type).color}"></div></div><small>${fmtDur(m)}</small></div>`).join('')
    : '<p class="hint">Finish tasks this week to see where your time goes.</p>';

  const j = state.journal[todayKey()] || {};
  $('#moods').innerHTML = ['☀️ Sunny', '🌤️ Nice', '☁️ Meh', '🌧️ Rainy', '⛈️ Stormy'].map(m =>
    `<button class="mood ${j.mood === m ? 'active' : ''}" data-mood="${m}"><span>${m.split(' ')[0]}</span><small>${m.split(' ')[1]}</small></button>`).join('');
  if (document.activeElement !== $('#note')) $('#note').value = j.note || '';

  const dates = [...new Set([...state.tasks.map(t => t.date), ...Object.keys(state.journal)])]
    .filter(d => d <= todayKey()).sort().reverse().slice(0, 30);
  $('#history').innerHTML = dates.length ? dates.map(d => {
    const ts = tasksOn(d);
    const jj = state.journal[d] || {};
    const stamp = dayGood(d) ? '<span class="stamp">PERFECT DAY 🌟</span>' : '';
    return `<details class="day" ${d === todayKey() ? 'open' : ''}><summary><b>${dayLabel(d)}</b> ${jj.mood ? jj.mood.split(' ')[0] : ''}
        <small>${ts.filter(t => t.status === 'done').length}/${ts.length} done</small>${stamp}</summary>
      ${jj.note ? `<p class="note">“${esc(jj.note)}”</p>` : ''}
      <ul>${ts.map(t => `<li>${act(t.type).icon} ${fmtClock(startOf(t))} ${esc(t.title)} ${statusChip(t)}</li>`).join('')}</ul></details>`;
  }).join('') : '<p class="hint">Your memories will appear here day by day.</p>';
}

// ---------- misc UI ----------
function celebrate(n = 28) {
  const host = $('#confetti');
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.textContent = pick(['🍃', '🌰', '🌸', '✨', '🍀']);
    s.style.left = `${Math.random() * 100}vw`;
    s.style.animationDuration = `${2.5 + Math.random() * 2.5}s`;
    s.style.animationDelay = `${Math.random() * 0.6}s`;
    s.style.fontSize = `${16 + Math.random() * 18}px`;
    host.appendChild(s);
    setTimeout(() => s.remove(), 6000);
  }
}

function showTab(name) {
  currentTab = name;
  $$('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  $$('.page').forEach(p => p.classList.toggle('active', p.id === `page-${name}`));
  if (name === 'world') renderWorld();
  if (name === 'journal') renderJournal();
  if (name === 'adventure') renderStage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderAll() {
  renderHeader();
  renderToday();
  if (currentTab === 'world') renderWorld();
  if (currentTab === 'journal') renderJournal();
  if (currentTab === 'adventure') renderStage();
}

function fillForm() {
  $('#fType').innerHTML = Object.entries(ACTIVITIES).map(([k, a]) => `<option value="${k}">${a.icon} ${a.label}</option>`).join('');
  $('#fDate').value = viewDate;
  const d = new Date(Date.now() + 15 * 60000);
  d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5);
  $('#fStart').value = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function bind() {
  $$('.tab').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));
  $('#taskForm').addEventListener('submit', addTask);
  $('#prevDay').onclick = () => { viewDate = shiftKey(viewDate, -1); $('#fDate').value = viewDate; renderToday(); };
  $('#nextDay').onclick = () => { viewDate = shiftKey(viewDate, 1); $('#fDate').value = viewDate; renderToday(); };
  $('#sampleBtn').onclick = addSampleDay;
  $('#toastClose').onclick = hideToast;

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-start],[data-done],[data-del],[data-buy],[data-place],[data-mood],[data-vibe],[data-shop],[data-avatar]');
    if (!b) return;
    const d = b.dataset;
    if (d.start) startTask(d.start);
    else if (d.done) completeTask(d.done);
    else if (d.del) deleteTask(d.del);
    else if (d.buy) buy(d.buy);
    else if (d.place) {
      const it = state.items.find(i => i.iid === d.place);
      if (it) { it.placed = true; selectedIid = it.iid; save(); renderWorld(); }
    } else if (d.mood) {
      state.journal[todayKey()] = { ...(state.journal[todayKey()] || {}), mood: d.mood };
      save(); renderJournal();
    } else if (d.vibe) visit(d.vibe);
    else if (d.shop) { shopView = d.shop; renderWorld(); }
    else if (d.avatar) {
      state.avatar = d.avatar;
      save();
      audio.pop();
      $$('.avatar-grid').forEach(renderAvatarGrid);
      renderHeader();
      renderStage();
    }
  });

  $('#vibes').innerHTML = Object.entries(ACTIVITIES).map(([k, a]) =>
    `<button class="vibe" data-vibe="${k}" style="--c:${a.color}"><span>${a.icon}</span>${a.label}</button>`).join('');

  $('#doneBtn').onclick = () => { const a = activeTask(); if (a) completeTask(a.id); };
  $('#leaveBtn').onclick = leaveStage;
  $('#soundBtn').onclick = () => {
    const a = activeTask();
    const type = a ? a.type : vibe;
    if (audio.running) audio.stop(); else if (type) playAmbience(type);
    updateSoundBtn();
  };
  $('#volume').value = state.settings.volume;
  $('#volume').oninput = e => { state.settings.volume = +e.target.value; audio.setVolume(+e.target.value); save(); };
  $('#muteBtn').onclick = () => { state.settings.muted = !state.settings.muted; audio.setMuted(state.settings.muted); save(); renderHeader(); };

  $('#flipBtn').onclick = () => { const it = state.items.find(i => i.iid === selectedIid); if (it) { it.flip = !it.flip; save(); renderWorld(); } };
  $('#storeBtn').onclick = () => { const it = state.items.find(i => i.iid === selectedIid); if (it) { it.placed = false; selectedIid = null; save(); renderWorld(); } };

  let noteTimer;
  $('#note').addEventListener('input', e => {
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => {
      state.journal[todayKey()] = { ...(state.journal[todayKey()] || {}), note: e.target.value };
      save();
      $('#noteSaved').textContent = 'Saved 🍃';
    }, 500);
  });

  // settings
  $('#avatarBtn').onclick = () => $('#settingsBtn').click();
  $('#settingsBtn').onclick = () => {
    $('#sName').value = state.name;
    $('#sMusic').checked = state.settings.music;
    renderAvatarGrid($('#settingsAvatars'));
    $('#sNotify').checked = state.settings.notify && 'Notification' in window && Notification.permission === 'granted';
    $('#settings').showModal();
  };
  $('#settings').addEventListener('close', () => {
    state.name = $('#sName').value.trim() || state.name;
    const musicChanged = state.settings.music !== $('#sMusic').checked;
    state.settings.music = $('#sMusic').checked;
    save();
    if (musicChanged && audio.running) { const a = activeTask(); const t = a ? a.type : vibe; if (t) playAmbience(t); }
    renderAll();
  });
  $('#sNotify').onchange = async e => {
    if (e.target.checked && 'Notification' in window) {
      const p = await Notification.requestPermission();
      e.target.checked = p === 'granted';
    }
    state.settings.notify = e.target.checked;
    save();
  };
  $('#exportBtn').onclick = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `forest-days-backup-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  $('#importFile').onchange = async e => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (!Array.isArray(data.tasks)) throw new Error('not a backup');
      replaceState(data);
      totoroSay('Backup restored! Welcome back 🌳', 'happy');
      renderAll();
    } catch { alert('That file doesn\'t look like a Forest Days backup.'); }
    e.target.value = '';
  };
  $('#resetBtn').onclick = () => {
    if (confirm('Erase all tasks, acorns, items and diary entries? This cannot be undone.')) {
      resetState(); audio.stop(); vibe = null; location.reload();
    }
  };

  // welcome
  $('#welcome').addEventListener('close', () => {
    state.name = $('#nameInput').value.trim() || 'Sprout';
    save();
    audio.chime();
    totoroSay(`Nice to meet you, ${state.name}! Let's plant your first task 🌱`, 'happy');
    renderAll();
  });
  $('#welcome').addEventListener('cancel', e => e.preventDefault());

  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
}

function init() {
  $('#defs-host').innerHTML = `<svg width="0" height="0" style="position:absolute">${GLOBAL_DEFS}</svg>`;
  $('#brandTotoro').innerHTML = totoroBox('happy');
  $('#welcomeTotoro').innerHTML = totoroBox('happy');
  renderAvatarGrid($('#welcomeAvatars'));
  audio.volume = state.settings.volume;
  audio.muted = state.settings.muted;
  fillForm();
  bind();
  setupGarden();
  renderAll();
  renderStage();
  if (!state.name) $('#welcome').showModal();
  tick();
  setInterval(tick, 10000);
  setInterval(updateHud, 1000);
  // Browsers only allow sound after a tap: resume a running task's ambience on the first interaction.
  const resume = () => {
    const a = activeTask();
    if (a && !audio.running) playAmbience(a.type);
    document.removeEventListener('pointerdown', resume);
  };
  document.addEventListener('pointerdown', resume);
}

init();
