import { useEffect, useRef } from 'react';
import logo from '../assets/logo.png';
import { FINISH_ORDER, FREE_SHIP, PHONE, WHATSAPP, WHATSAPP_READY, byId } from '../data/catalog';
import { inr } from '../lib/helpers';
import { useStore } from '../context/StoreContext';
import { CartLine, Dot, FilterLink, IconClose, Summary } from './ui';

function useFocusOnOpen(open) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => ref.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);
  return ref;
}

export function Scrim() {
  const { drawer, closeDrawers } = useStore();
  return <div className={'scrim' + (drawer ? ' on' : '')} onClick={() => closeDrawers()} />;
}

export function NavDrawer() {
  const { drawer, closeDrawers } = useStore();
  const open = drawer === 'nav';
  const closeRef = useFocusOnOpen(open);
  return (
    <aside className={'drawer left' + (open ? ' open' : '')} id="navDrawer" aria-label="Menu" aria-hidden={!open}>
      <div className="dr-head">
        <img src={logo} alt="Britefoto" style={{ height: 38, width: 'auto' }} />
        <button ref={closeRef} className="icon-btn" type="button" aria-label="Close menu" onClick={() => closeDrawers()}><IconClose /></button>
      </div>
      <div className="dr-body">
        <ul className="nav-drawer-list">
          <li><a href="#shop">All photo paper</a></li>
          <li><a href="#bulk">Bulk and dealers</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><h4>Shop by finish</h4></li>
        </ul>
        <ul className="nav-drawer-list" style={{ paddingTop: 0 }}>
          {FINISH_ORDER.map(f => <li key={f}><FilterLink filter={'finish:' + f}><Dot finish={f} />{f}</FilterLink></li>)}
        </ul>
      </div>
    </aside>
  );
}

export function CartDrawer() {
  const { drawer, closeDrawers, cart, totals: t } = useStore();
  const open = drawer === 'cart';
  const closeRef = useFocusOnOpen(open);
  const left = FREE_SHIP - t.after, pct = Math.min(100, Math.round(t.after / FREE_SHIP * 100));
  return (
    <aside className={'drawer' + (open ? ' open' : '')} id="cartDrawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle" aria-hidden={!open}>
      <div className="dr-head">
        <h2 id="cartTitle">{t.items ? `Your cart (${t.items})` : 'Your cart'}</h2>
        <button ref={closeRef} className="icon-btn" type="button" aria-label="Close cart" onClick={() => closeDrawers()}><IconClose /></button>
      </div>
      <div className="dr-body">
        {!cart.length ? (
          <div className="dr-empty">
            <p style={{ fontWeight: 650 }}>Your cart is empty.</p>
            <p style={{ color: 'var(--ink-2)' }}>Start with a best seller, or try every finish with the sampler kit.</p>
            <a className="btn btn-blue" href="#shop" onClick={() => closeDrawers(true)}>Shop photo paper</a>
          </div>
        ) : (
          <>
            <div className={'meter' + (left <= 0 ? ' done' : '')}>
              {left > 0 ? `Add ${inr(left)} more for free delivery.` : 'Your order ships free.'}
              <div className="meter-bar"><i style={{ '--p': pct + '%' }} /></div>
            </div>
            <ul className="lines">{cart.map(l => <CartLine key={l.id + ':' + l.pack} line={l} editable />)}</ul>
          </>
        )}
      </div>
      <div className="dr-foot">
        {cart.length > 0 && (
          <>
            <Summary t={t} />
            <a className="btn btn-red" href="#checkout" style={{ marginTop: 8 }} onClick={() => closeDrawers(true)}>Checkout</a>
            <button className="btn btn-line" type="button" onClick={() => closeDrawers()}>Continue shopping</button>
          </>
        )}
      </div>
    </aside>
  );
}

export function Toast() {
  const { toast, hideToast, openDrawer, go, toggleWish } = useStore();
  const act = toast.action;
  const onAct = () => {
    hideToast();
    if (!act) openDrawer('cart');
    else if (act.view) go(act.view);
    else if (act.undo) toggleWish(act.undo);
  };
  return (
    <div className={'toast' + (toast.on ? ' on' : '')} role="status" aria-live="polite">
      {toast.msg && (
        <>
          <span>{toast.msg}</span>
          <button type="button" onClick={onAct}>{act ? act.label : 'View cart'}</button>
        </>
      )}
    </div>
  );
}

/* Floating WhatsApp chat button. The message is pre-filled with the product
   being viewed, so the team knows what the visitor is asking about.
   While PHONE is still a placeholder it only shows in development. */
export function WhatsAppButton() {
  const { route, drawer } = useStore();
  if (!WHATSAPP_READY && !import.meta.env.DEV) return null;
  if (route.v === 'checkout' || route.v === 'done') return null;   // keep the pay step clear
  const p = route.v === 'product' ? byId[route.id] : null;
  const msg = p
    ? `Hi Britefoto, I have a question about ${p.name}${p.kind === 'roll' ? '' : ', ' + p.size}.`
    : 'Hi Britefoto, I have a question about your photo paper.';
  const href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  return (
    <a
      className={'wa-btn' + (drawer ? ' hide' : '')}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with Britefoto on WhatsApp (${PHONE}), opens in a new tab`}
      title={WHATSAPP_READY ? undefined : 'Placeholder number: set PHONE in src/data/catalog.js'}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.53 1.74 6.5L3 29l6.68-1.75A12.95 12.95 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.65c-1.98 0-3.9-.53-5.6-1.53l-.4-.24-3.96 1.04 1.06-3.86-.26-.4A10.6 10.6 0 0 1 5.4 16c0-5.87 4.77-10.64 10.64-10.64 5.86 0 10.6 4.77 10.6 10.64 0 5.87-4.74 10.65-10.6 10.65Zm5.83-7.97c-.32-.16-1.9-.94-2.19-1.04-.3-.11-.5-.16-.72.16-.21.32-.83 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.21-.18-.32-.02-.5.14-.65.15-.15.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.3.32-1.12 1.09-1.12 2.66s1.14 3.08 1.3 3.3c.16.21 2.25 3.43 5.44 4.81.76.33 1.35.52 1.81.67.76.24 1.46.2 2 .12.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z"/></svg>
      <span className="wa-label">Chat with us</span>
    </a>
  );
}
