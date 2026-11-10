import { FIN, GSM, PRODUCTS, byId, FREE_SHIP, SHIP_FEE } from '../data/catalog';

export const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
export const off = (p, m) => Math.round((1 - p / m) * 100);
export const gsmText = p => (p.gsm ? p.gsm + ' GSM' : p.gsmLabel + ' GSM');
export const sizeText = p => (p.kind === 'roll' ? p.roll : p.size);
export const fullName = p => p.name + (p.kind === 'roll' ? ', ' + p.roll : ', ' + p.size) + (p.gsm ? ', ' + p.gsm + ' GSM' : '');
export function packLabel(p, n) {
  const u = p.unit === 'roll' ? (n > 1 ? 'rolls' : 'roll') : 'sheets';
  return n + ' ' + u;
}
/** CSS custom properties for a finish (band colour, band text, procedural image). */
export function finVars(f) {
  const F = FIN[f];
  return { '--band': F.band, '--bt': F.bt, '--img': `var(--img${F.img})` };
}
export function inGsm(p, k) {
  const g = GSM.find(x => x.k === k);
  return !!(g && p.gsm && p.gsm >= g.lo && p.gsm <= g.hi);
}
export const tierRate = q => (q >= 10 ? 0.1 : q >= 5 ? 0.05 : 0);
export const keys = o => Object.keys(o).filter(k => o[k]);
export const minPrice = f => Math.min(...PRODUCTS.filter(p => p.finish === f).map(p => p.packs[0][1]));

export const storage = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

/* ---------- filtering ---------- */
export const emptyFilters = () => ({ finish: {}, size: {}, gsm: {}, q: '', sort: 'featured' });

export function matches(p, filt, skip) {
  const fk = keys(filt.finish), sk = keys(filt.size), gk = keys(filt.gsm);
  if (skip !== 'finish' && fk.length && !fk.includes(p.finish)) return false;
  if (skip !== 'size' && sk.length && !sk.includes(p.size)) return false;
  if (skip !== 'gsm' && gk.length && !gk.some(k => inGsm(p, k))) return false;
  if (filt.q) {
    const hay = (fullName(p) + ' ' + p.finish + ' ' + (p.roll || '') + ' ' + p.uses.join(' ') + ' ' +
      (p.kind === 'roll' ? 'roll large format' : '') + ' ' + (p.kind === 'kit' ? 'sampler sample kit test' : '')).toLowerCase();
    const words = filt.q.toLowerCase().replace(/gsm/g, ' gsm ').split(/\s+/).filter(Boolean);
    if (!words.every(w => hay.includes(w))) return false;
  }
  return true;
}

export function results(filt) {
  const list = PRODUCTS.filter(p => matches(p, filt));
  const s = filt.sort;
  list.sort((a, b) => {
    if (s === 'price-asc') return a.packs[0][1] - b.packs[0][1];
    if (s === 'price-desc') return b.packs[0][1] - a.packs[0][1];
    if (s === 'gsm-desc') return (b.gsm || 0) - (a.gsm || 0);
    return ((b.best || 0) - (a.best || 0)) || (a.order - b.order);
  });
  return list;
}

/* ---------- cart maths ---------- */
export function lineCalc(l) {
  const p = byId[l.id], pk = p.packs[l.pack], gross = pk[1] * l.qty, rate = tierRate(l.qty);
  const disc = Math.round(gross * rate);
  return { p, pk, gross, disc, rate, net: gross - disc };
}

export function totals(cart) {
  let sub = 0, disc = 0, items = 0;
  cart.forEach(l => { const c = lineCalc(l); sub += c.gross; disc += c.disc; items += l.qty; });
  const after = sub - disc, ship = items === 0 ? 0 : (after >= FREE_SHIP ? 0 : SHIP_FEE);
  return { sub, disc, after, ship, total: after + ship, items };
}
