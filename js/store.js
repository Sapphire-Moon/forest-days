// Everything is saved in the browser (localStorage), so no server or account is needed.
const KEY = 'forest-days-v1';

const defaults = () => ({
  name: '',
  avatar: 'chihiro',
  dishes: {},    // recipe id -> times cooked
  acorns: 15,
  earned: 0,
  tasks: [],      // {id,title,type,date,start,duration,status:'todo'|'active'|'done',missed,onTime,rem,doneAt}
  items: [],      // garden decorations {iid,id,x,y,placed,flip}
  journal: {},    // 'YYYY-MM-DD' -> {mood,note}
  bonus: {},      // 'YYYY-MM-DD' -> true when the full-day bonus was paid
  activeId: null,
  settings: { volume: 0.6, music: true, notify: false, muted: false },
});

export const state = load();

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw) {
      const d = defaults();
      return { ...d, ...raw, settings: { ...d.settings, ...(raw.settings || {}) } };
    }
  } catch { /* fall through to a fresh state */ }
  return defaults();
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
}

export function replaceState(next) {
  const d = defaults();
  Object.keys(state).forEach(k => delete state[k]);
  Object.assign(state, d, next, { settings: { ...d.settings, ...(next.settings || {}) } });
  save();
}

export function resetState() { replaceState(defaults()); }

export const uid = () => Math.random().toString(36).slice(2, 10);

export function dateKey(d = new Date()) {
  const z = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

export function shiftKey(key, days) {
  const [y, m, d] = key.split('-').map(Number);
  return dateKey(new Date(y, m - 1, d + days));
}
