import { useEffect, useState } from 'react';
import { FINISH_ORDER, GSM, PRODUCTS, SIZES } from '../data/catalog';
import { emptyFilters, inGsm, keys, matches, results } from '../lib/helpers';
import { useStore } from '../context/StoreContext';
import { Crumbs, Dot, ProductCard } from '../components/ui';

function CheckGroup({ group, items }) {
  const { filt, setFilt } = useStore();
  return items.map(it => {
    const n = PRODUCTS.filter(p => matches(p, filt, group) &&
      (group === 'finish' ? p.finish === it.k : group === 'size' ? p.size === it.k : inGsm(p, it.k))).length;
    const id = 'f-' + group + '-' + it.k.replace(/[^a-z0-9]/gi, '');
    return (
      <label className="check" htmlFor={id} key={it.k}>
        <input type="checkbox" id={id} checked={!!filt[group][it.k]}
          onChange={e => setFilt(f => ({ ...f, [group]: { ...f[group], [it.k]: e.target.checked } }))} />
        {it.dot}<span>{it.label}</span><small>{n}</small>
      </label>
    );
  });
}

export default function Shop() {
  const { filt, setFilt } = useStore();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const list = results(filt), fk = keys(filt.finish);
  const title = filt.q ? `Results for “${filt.q}”` : fk.length === 1 ? fk[0] + ' photo paper' : 'All photo paper';
  const clearAll = () => setFilt(f => ({ ...emptyFilters(), sort: f.sort }));
  const active = ['finish', 'size', 'gsm'].reduce((n, g) => n + keys(filt[g]).length, 0);

  // on phones the filters open as a sheet from the bottom: lock the page behind it and close on Escape
  useEffect(() => {
    if (!filtersOpen) return undefined;
    const phone = window.matchMedia('(max-width: 960px)').matches;
    if (phone) document.body.style.overflow = 'hidden';
    const onKey = e => { if (e.key === 'Escape') setFiltersOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
  }, [filtersOpen]);

  const chips = [];
  ['finish', 'size', 'gsm'].forEach(g => keys(filt[g]).forEach(k => {
    const label = g === 'gsm' ? GSM.find(x => x.k === k).label : g === 'size' && k === 'Roll' ? 'Rolls' : k;
    chips.push(
      <button key={g + k} className="fchip" type="button" onClick={() => setFilt(f => ({ ...f, [g]: { ...f[g], [k]: false } }))}>
        {label} <span aria-hidden="true">×</span><span className="sr">Remove filter</span>
      </button>,
    );
  }));
  if (filt.q) {
    chips.push(
      <button key="q" className="fchip" type="button" onClick={() => setFilt(f => ({ ...f, q: '' }))}>
        “{filt.q}” <span aria-hidden="true">×</span><span className="sr">Clear search</span>
      </button>,
    );
  }

  return (
    <div className="view">
      <div className="wrap">
        <Crumbs items={[<a href="#home">Home</a>, <span>Shop</span>]} />
        <div className="shop-head"><h1 className="display">{title}</h1><p className="tnum">{list.length}{list.length === 1 ? ' paper' : ' papers'}</p></div>
        <div className="shop-bar">
          <button className="btn btn-line btn-sm filter-toggle" type="button" aria-expanded={filtersOpen} aria-controls="filters" onClick={() => setFiltersOpen(o => !o)}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M3 5h14M6 10h8M8.5 15h3" /></svg>
            Filters{active ? ` (${active})` : ''}
          </button>
          <div className="chips">{chips}</div>
          <label className="sort" htmlFor="sortSel">Sort by
            <select id="sortSel" value={filt.sort} onChange={e => setFilt(f => ({ ...f, sort: e.target.value }))}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
              <option value="gsm-desc">Heaviest first</option>
            </select>
          </label>
        </div>
        <div className="shop-body">
          {filtersOpen && <div className="filter-scrim" onClick={() => setFiltersOpen(false)} aria-hidden="true" />}
          <aside className={'filters' + (filtersOpen ? ' open' : '')} id="filters" aria-label="Filters">
            <div className="sheet-head">
              <b>Filters</b>
              <button type="button" className="icon-btn" aria-label="Close filters" onClick={() => setFiltersOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>
            <fieldset><legend>Finish</legend><div>
              <CheckGroup group="finish" items={FINISH_ORDER.map(f => ({ k: f, label: f, dot: <Dot finish={f} /> }))} />
            </div></fieldset>
            <fieldset><legend>Size</legend><div>
              <CheckGroup group="size" items={SIZES.map(s => ({ k: s.k, label: s.k === 'Roll' ? 'Rolls' : `${s.k} (${s.inch})` }))} />
            </div></fieldset>
            <fieldset><legend>Thickness</legend><div>
              <CheckGroup group="gsm" items={GSM.map(g => ({ k: g.k, label: g.label }))} />
            </div></fieldset>
            <button className="link-btn" type="button" style={{ justifySelf: 'start' }} onClick={clearAll}>Clear all filters</button>
            <div className="sheet-foot">
              <button className="btn btn-line" type="button" onClick={clearAll} disabled={!active}>Clear</button>
              <button className="btn btn-blue" type="button" onClick={() => { setFiltersOpen(false); window.scrollTo({ top: 0 }); }}>
                Show {list.length} {list.length === 1 ? 'paper' : 'papers'}
              </button>
            </div>
          </aside>
          <div>
            <div className="grid">
              {list.length ? list.map(p => <ProductCard key={p.id} p={p} />) : (
                <div className="empty" style={{ gridColumn: '1/-1' }}>
                  <h2>No papers match these filters</h2>
                  <p style={{ color: 'var(--ink-2)' }}>Remove a filter, or clear them all to see the full range.</p>
                  <button className="btn btn-line btn-sm" type="button" onClick={clearAll}>Clear all filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
