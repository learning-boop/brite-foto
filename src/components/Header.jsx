import { useEffect, useMemo, useRef, useState } from 'react';
import logo from '../assets/logo.png';
import { FIN, FINISH_ORDER, GSM, PRODUCTS, SIZES } from '../data/catalog';
import { emptyFilters, fullName, inr, minPrice, results } from '../lib/helpers';
import { useStore } from '../context/StoreContext';
import { Dot, FilterLink, IconSearch } from './ui';
import './header.css';

function Search({ id, withSuggest, inputRef }) {
  const { runSearch } = useStore();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(-1);
  const formRef = useRef(null);
  const localRef = useRef(null);
  const input = inputRef || localRef;

  const list = useMemo(() => {
    const term = q.trim();
    if (!withSuggest || term.length < 2) return [];
    return results({ ...emptyFilters(), q: term }).slice(0, 5);
  }, [q, withSuggest]);

  useEffect(() => {
    if (!withSuggest) return undefined;
    const onDoc = e => { if (formRef.current && !formRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [withSuggest]);

  const run = () => { setOpen(false); input.current?.blur(); runSearch(q.trim()); };

  // items: products, then "see all"
  const items = list.length
    ? [...list.map(p => ({ type: 'p', p })), { type: 'all' }]
    : [{ type: 'none' }];

  const activate = it => {
    if (it.type === 'p') { setOpen(false); setQ(''); window.location.hash = 'product-' + it.p.id; }
    else if (it.type === 'all') run();
    else { setOpen(false); setQ(''); window.location.hash = 'shop'; }
  };

  const onKeyDown = e => {
    if (!open || !withSuggest) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setIdx(i => (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length);
    } else if (e.key === 'Enter' && idx >= 0) { e.preventDefault(); activate(items[idx]); }
    else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <form className="search" ref={formRef} role="search" autoComplete="off" onSubmit={e => { e.preventDefault(); run(); }}>
      <label className="sr" htmlFor={id}>Search photo paper</label>
      <input
        id={id} ref={input} type="search" placeholder="Search glossy, A4, 260 GSM" value={q}
        onChange={e => { setQ(e.target.value); setIdx(-1); setOpen(e.target.value.trim().length >= 2); }}
        onKeyDown={onKeyDown}
      />
      <button type="submit" aria-label="Search"><IconSearch /></button>
      {withSuggest && open && (
        <div className="suggest">
          {items.map((it, i) => {
            if (it.type === 'p') {
              return (
                <a key={it.p.id} href={'#product-' + it.p.id} className={i === idx ? 'on' : undefined}
                  onClick={e => { e.preventDefault(); activate(it); }}>
                  <Dot finish={it.p.finish} /><span>{fullName(it.p)}</span><small>{inr(it.p.packs[0][1])}</small>
                </a>
              );
            }
            if (it.type === 'all') {
              return (
                <a key="all" href="#shop" className={'all' + (i === idx ? ' on' : '')} onClick={e => { e.preventDefault(); activate(it); }}>
                  See all results for “{q.trim()}”
                </a>
              );
            }
            return <a key="none" href="#shop" className={'all' + (i === idx ? ' on' : '')} onClick={e => { e.preventDefault(); activate(it); }}>No exact match. See all papers</a>;
          })}
        </div>
      )}
    </form>
  );
}

const Chevron = () => <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" /></svg>;

/* Account menu. There is no sign-in on the site yet, so it says so and
   offers the things a customer usually wants from an account. */
function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);
  return (
    <div className="acct" ref={ref}>
      <button className="icon-btn hd-icon" type="button" aria-label="Account" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(o => !o)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6" /></svg>
      </button>
      {open && (
        <div className="acct-menu" onClick={e => { if (e.target.closest('a')) setOpen(false); }}>
          <b>Your account</b>
          <p>Customer accounts are not connected yet in this design preview.</p>
          <a href="#contact">Track an order</a>
          <a href="#bulk">Dealer and lab pricing</a>
          <a href="#contact">Help and contact</a>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { route, openDrawer, drawer, totals, bump } = useStore();
  const [sOpen, setSOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sInput = useRef(null);
  const prog = useRef(null);
  const nav = route.v === 'product' ? 'shop' : route.v;
  const items = totals.items;

  useEffect(() => { if (sOpen) sInput.current?.focus(); }, [sOpen]);
  useEffect(() => { setSOpen(false); }, [route]);
  // the header sits light over the hero, and turns solid once the page scrolls
  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 8);
      // scroll progress line (CSS var, so no re-render per frame)
      const max = document.documentElement.scrollHeight - window.innerHeight;
      prog.current?.style.setProperty('--p', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    if (!sOpen) return undefined;
    const onKey = e => { if (e.key === 'Escape') setSOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [sOpen]);

  const navLink = (key, label) => (
    <a href={'#' + key} className="nav-link" aria-current={nav === key ? 'page' : undefined}>{label}</a>
  );

  return (
    <header className={'site-head' + (scrolled ? ' scrolled' : '')}>
      <div className="wrap head-in">
        <button className="icon-btn menu-btn" type="button" aria-label="Open menu" aria-controls="navDrawer"
          aria-expanded={drawer === 'nav'} onClick={() => openDrawer('nav')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        <a className="brand" href="#home" aria-label="Britefoto home"><img src={logo} alt="Britefoto, crisp and vivid" width="640" height="222" /></a>
        <nav className="main-nav" aria-label="Main">
          {navLink('home', 'Home')}
          <div className="has-mega">
            <a href="#shop" className="nav-link" aria-current={nav === 'shop' ? 'page' : undefined}>Photo Papers <Chevron /></a>
            <div className="mega">
              <div><h4>By finish</h4><ul>
                {FINISH_ORDER.map(f => <li key={f}><FilterLink filter={'finish:' + f}><Dot finish={f} />{f}</FilterLink></li>)}
              </ul></div>
              <div><h4>By size</h4><ul>
                {SIZES.map(s => <li key={s.k}><FilterLink filter={'size:' + s.k}>{s.k === 'Roll' ? 'Rolls (24 and 44 in)' : `${s.k} (${s.inch})`}</FilterLink></li>)}
              </ul></div>
              <div><h4>By thickness</h4><ul>
                {GSM.map(g => <li key={g.k}><FilterLink filter={'gsm:' + g.k}>{g.label}</FilterLink></li>)}
              </ul></div>
              <a className="mega-promo" href="#product-sampler-kit">
                <div className="mega-stripes" />
                <b>Not sure which finish?</b>
                <span>The sampler kit has two A4 sheets of all eight finishes, so you can test them on your own printer.</span>
                <em>See the sampler kit, ₹299</em>
              </a>
            </div>
          </div>
          <div className="has-drop">
            <a href="#shop" className="nav-link">Finishes <Chevron /></a>
            <div className="drop drop-fin">
              {FINISH_ORDER.map(f => (
                <FilterLink key={f} filter={'finish:' + f}>
                  <Dot finish={f} />
                  <span><b>{f}</b><small>{FIN[f].blurb}</small></span>
                  <em>from {inr(minPrice(f))}</em>
                </FilterLink>
              ))}
            </div>
          </div>
          <div className="has-drop">
            <a href="#shop" className="nav-link">Sizes <Chevron /></a>
            <div className="drop drop-size">
              {SIZES.map(s => {
                const n = PRODUCTS.filter(p => p.size === s.k).length;
                return (
                  <FilterLink key={s.k} filter={'size:' + s.k}>
                    <span><b>{s.k === 'Roll' ? 'Rolls' : s.k}</b><small>{s.inch}</small></span>
                    <em>{n} {n === 1 ? 'paper' : 'papers'}</em>
                  </FilterLink>
                );
              })}
            </div>
          </div>
          {navLink('bulk', 'Bulk Orders')}
          {navLink('about', 'About')}
        </nav>
        <div className="head-tools">
          <button className="icon-btn hd-icon" type="button" aria-label="Search" aria-controls="headSearch" aria-expanded={sOpen} onClick={() => setSOpen(o => !o)}>
            <IconSearch />
          </button>
          <AccountMenu />
          <button className="icon-btn hd-icon cart-icon" type="button" aria-controls="cartDrawer" aria-label={`Open cart, ${items} item${items === 1 ? '' : 's'}`} onClick={() => openDrawer('cart')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h2l2.2 11h10.6L20 7H6.2" /><circle cx="9" cy="19.5" r="1.4" /><circle cx="17" cy="19.5" r="1.4" /></svg>
            {items > 0 && <span key={bump} className={'badge-count' + (bump ? ' bump' : '')}>{items > 99 ? '99+' : items}</span>}
          </button>
        </div>
      </div>
      <span className="scroll-prog" ref={prog} aria-hidden="true" />
      <div id="headSearch" className={'wrap head-search' + (sOpen ? ' on' : '')}>
        <Search id="q" withSuggest inputRef={sInput} />
      </div>
    </header>
  );
}
