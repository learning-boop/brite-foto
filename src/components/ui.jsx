import { Fragment, useEffect, useRef } from 'react';
import { FIN, FINISH_ORDER } from '../data/catalog';
import { finVars, fullName, gsmText, inr, lineCalc, off, packLabel, sizeText } from '../lib/helpers';
import { useStore } from '../context/StoreContext';

/* ---------- icons ---------- */
export const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
);

/* ---------- printer's CMYK colour bar ---------- */
const Reg = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="#15172e" strokeWidth="1"><circle cx="7" cy="7" r="4" /><path d="M7 0v14M0 7h14" /></svg>
);
/* CMYK colour bar. It "prints" itself in, patch by patch, the first
   time it scrolls into view (styles in motion.css). */
export function Cmyk() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    el.classList.add('cm-wait');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('cm-in'); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="cmyk" aria-hidden="true" ref={ref}>
      <Reg />
      {['c', 'm', 'y', 'k'].flatMap((ch, ci) => [100, 70, 40, 15].map((t, ti) => (
        <i key={ch + t} style={{ background: `color-mix(in srgb,var(--${ch}) ${t}%,#fff)`, '--n': ci * 4 + ti }} />
      )))}
      <Reg />
    </div>
  );
}

export const Dot = ({ finish, style }) => <i className="dot" style={{ ...finVars(finish), ...style }} />;

/** Link that opens the shop with one filter applied (replaces data-filter). */
export function FilterLink({ filter, children, ...rest }) {
  const { applyFilter } = useStore();
  return (
    <a href="#shop" {...rest} onClick={e => { e.preventDefault(); applyFilter(filter); }}>{children}</a>
  );
}

export function Crumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <Fragment key={i}>
          {i > 0 && <span aria-hidden="true">/</span>}
          {it}
        </Fragment>
      ))}
    </nav>
  );
}

/* ---------- pack mockups (stand in for product photography) ---------- */
export function Pack({ p }) {
  const F = FIN[p.finish];
  if (p.kind === 'roll') {
    return (
      <div className="roll" style={finVars(p.finish)}>
        <div className="roll-body">
          <i className="pk-logo roll-logo" />
          <div className="roll-label"><b>{p.finish.toUpperCase()}</b><span>{p.roll}</span><span>{p.gsm} GSM</span></div>
        </div>
        <div className="roll-end" />
      </div>
    );
  }
  if (p.kind === 'kit') {
    return (
      <div className="pack kit fx f-mixed" style={finVars('Mixed')}>
        <div className="pk-face">
          <div className="pk-top"><i className="pk-logo" /></div>
          <div className="pk-photo">{FINISH_ORDER.map(f => <i key={f} className={'fx ' + FIN[f].cls} style={finVars(f)} />)}</div>
          <div className="pk-band" />
          <div className="pk-foot"><span>SAMPLER</span><i>8 finishes</i></div>
        </div>
      </div>
    );
  }
  return (
    <div className={'pack fx ' + F.cls} style={finVars(p.finish)}>
      <div className="pk-face">
        <div className="pk-top"><i className="pk-logo" /></div>
        <div className="pk-photo" />
        <div className="pk-band">
          <b style={{ fontSize: (p.finish.length > 6 ? 7 : 8.6) + 'cqw' }}>{p.finish.toUpperCase()}</b>
          <span>{p.gsm}<small>GSM</small></span>
        </div>
        <div className="pk-foot"><span>{p.size}</span><i>{packLabel(p, p.packs[0][0])}</i></div>
      </div>
    </div>
  );
}

export function FinishChip({ p }) {
  return p.finish === 'Mixed'
    ? <span className="chip">8 finishes</span>
    : <span className="chip fin" style={finVars(p.finish)}>{p.finish}</span>;
}

export function ProductCard({ p }) {
  const { addToCart } = useStore();
  const pk = p.packs[0], multi = p.packs.length > 1;
  return (
    <article className="card">
      <a className="media" href={'#product-' + p.id} aria-label={fullName(p)}><Pack p={p} /></a>
      <div className="badges">
        {pk[2] > pk[1] && <span className="badge">{off(pk[1], pk[2])}% off</span>}
        {p.best ? <span className="badge best">Best seller</span> : null}
      </div>
      <div className="card-body">
        <div className="chips"><FinishChip p={p} /><span className="chip">{gsmText(p)}</span><span className="chip">{sizeText(p)}</span></div>
        <h3><a href={'#product-' + p.id}>{p.name}{p.kind === 'roll' ? '' : ', ' + p.size}</a></h3>
        <div className="price">
          {multi && <span className="from">From</span>}
          <b>{inr(pk[1])}</b><s>{inr(pk[2])}</s><span className="from">{packLabel(p, pk[0])}</span>
        </div>
        <div className="card-actions">
          <button className="btn btn-blue btn-sm" type="button" onClick={() => addToCart(p.id, 0, 1)}>Add to cart</button>
        </div>
      </div>
    </article>
  );
}

/* ---------- cart lines + summary ---------- */
export function Thumb({ p }) {
  return (
    <div className="thumb" style={finVars(p.finish)}>
      <i /><b>{p.kind === 'roll' ? 'ROLL' : p.kind === 'kit' ? 'KIT' : p.gsm}</b>
    </div>
  );
}

export function CartLine({ line, editable }) {
  const { setQty } = useStore();
  const c = lineCalc(line), p = c.p;
  return (
    <li className="line">
      <Thumb p={p} />
      <div>
        <h3><a href={'#product-' + p.id}>{p.name}</a></h3>
        <p className="meta">{sizeText(p)}, {gsmText(p)}, {packLabel(p, c.pk[0])}</p>
        {editable ? (
          <div className="row">
            <div className="qty sm">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty(p.id, line.pack, line.qty - 1)}>−</button>
              <input
                type="number" min="1" max="999" aria-label="Quantity"
                key={line.qty} defaultValue={line.qty}
                onBlur={e => setQty(p.id, line.pack, Math.max(1, parseInt(e.target.value, 10) || 1))}
                onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }}
              />
              <button type="button" aria-label="Increase quantity" onClick={() => setQty(p.id, line.pack, line.qty + 1)}>+</button>
            </div>
            <button className="rm" type="button" onClick={() => setQty(p.id, line.pack, 0)}>Remove</button>
          </div>
        ) : <p className="meta">Qty {line.qty}</p>}
      </div>
      <div className="amt">{inr(c.net)}{c.rate ? <small>{Math.round(c.rate * 100)}% bulk off</small> : null}</div>
    </li>
  );
}

export function Summary({ t }) {
  return (
    <div className="sum">
      <div><span>Subtotal</span><span>{inr(t.sub)}</span></div>
      {t.disc ? <div className="neg"><span>Bulk discount</span><span>−{inr(t.disc)}</span></div> : null}
      <div><span>Delivery</span><span>{t.ship ? inr(t.ship) : 'Free'}</span></div>
      <div className="tot"><span>Total <small style={{ fontWeight: 500, color: 'var(--ink-3)' }}>incl. GST</small></span><span>{inr(t.total)}</span></div>
    </div>
  );
}
