import { useEffect, useRef, useState } from 'react';
import { WHATSAPP, WHATSAPP_READY, byId } from '../data/catalog';
import { fullName, inr, packLabel } from '../lib/helpers';
import { useStore } from '../context/StoreContext';
import { useLeadForm } from '../lib/useLeadForm';

/* WhatsApp is shown on the live site only once the real number is set in
   src/data/catalog.js (PHONE). While it is a placeholder it shows in dev. */
export const SHOW_WA = WHATSAPP_READY || import.meta.env.DEV;

/* wa.me link with the product (and chosen pack) written into the message */
export function waLink(p, pack = 0, extra = '') {
  const pk = p.packs[pack] || p.packs[0];
  const url = `${window.location.origin}${window.location.pathname}#product-${p.id}`;
  const msg = `Hi Britefoto, I'm interested in ${fullName(p)} (pack of ${packLabel(p, pk[0])}, ${inr(pk[1])}). ${extra}Please share price and availability.\n${url}`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
);

export const IconWhatsApp = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.53 1.74 6.5L3 29l6.68-1.75A12.95 12.95 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.65c-1.98 0-3.9-.53-5.6-1.53l-.4-.24-3.96 1.04 1.06-3.86-.26-.4A10.6 10.6 0 0 1 5.4 16c0-5.87 4.77-10.64 10.64-10.64 5.86 0 10.6 4.77 10.6 10.64 0 5.87-4.74 10.65-10.6 10.65Zm5.83-7.97c-.32-.16-1.9-.94-2.19-1.04-.3-.11-.5-.16-.72.16-.21.32-.83 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.21-.18-.32-.02-.5.14-.65.15-.15.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.3.32-1.12 1.09-1.12 2.66s1.14 3.08 1.3 3.3c.16.21 2.25 3.43 5.44 4.81.76.33 1.35.52 1.81.67.76.24 1.46.2 2 .12.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" /></svg>
);
export const IconHeart = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.8 3.9 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.4 0 5.7 3.3 4.5 6.7-1.7 4.7-9.2 9.3-9.2 9.3Z" /></svg>
);

/* heart that saves a product to the wishlist */
export function WishButton({ id, className = '' }) {
  const { wishlist, toggleWish } = useStore();
  const on = wishlist.includes(id);
  const p = byId[id];
  return (
    <button type="button" className={'wish-btn' + (on ? ' on' : '') + (className ? ' ' + className : '')}
      aria-pressed={on} aria-label={on ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggleWish(id); }}>
      <IconHeart filled={on} />
    </button>
  );
}

/* "WhatsApp" + "Enquiry now", shown on every product card and product page */
export function EnquiryButtons({ p, pack = 0, size = 'sm' }) {
  const { openEnquiry } = useStore();
  return (
    <div className={'enq-row enq-' + size}>
      {SHOW_WA && (
        <a className="btn enq-wa" href={waLink(p, pack)} target="_blank" rel="noopener noreferrer"
          aria-label={`Ask about ${p.name} on WhatsApp (opens in a new tab)`}>
          <IconWhatsApp /><span>WhatsApp</span>
        </a>
      )}
      <button className="btn enq-btn" type="button" onClick={() => openEnquiry(p.id, pack)}
        aria-label={`Enquiry now about ${p.name}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16v11H8l-4 4V5Z" /><path d="M8 9.5h8M8 12.5h5" /></svg>
        <span>Enquiry now</span>
      </button>
    </div>
  );
}

/* Enquiry form in a dialog. Not connected to a server yet (same as the
   bulk and contact forms); it validates, confirms, and can pass the
   enquiry straight on to WhatsApp. */
export function EnquiryModal() {
  const { enquiry, closeEnquiry } = useStore();
  const { onSubmit, err, msg, sentName } = useLeadForm();
  const [sent, setSent] = useState(null);
  const [pack, setPack] = useState(0);
  const first = useRef(null);
  const p = enquiry && byId[enquiry.id];

  useEffect(() => {
    if (!enquiry) return undefined;
    setSent(null);
    setPack(enquiry.pack || 0);
    const t = setTimeout(() => first.current?.focus(), 60);
    const onKey = e => { if (e.key === 'Escape') closeEnquiry(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [enquiry, closeEnquiry]);

  if (!p) return null;

  const submit = e => {
    const f = e.currentTarget;
    const data = { name: f.elements.name.value.trim(), city: f.elements.city.value.trim(), qty: f.elements.qty.value.trim(), note: f.elements.note.value.trim() };
    onSubmit(e);
    // onSubmit resets the form only when everything is valid
    setTimeout(() => { if (!f.elements.name.value) setSent(data); }, 0);
  };
  const waExtra = sent ? `My name is ${sent.name}${sent.city ? ' from ' + sent.city : ''}. ${sent.qty ? 'Quantity: ' + sent.qty + '. ' : ''}${sent.note ? sent.note + ' ' : ''}` : '';

  return (
    <div className="enq-modal" role="dialog" aria-modal="true" aria-labelledby="enqTitle">
      <div className="enq-scrim" onClick={closeEnquiry} aria-hidden="true" />
      <div className="enq-card">
        <div className="enq-head">
          <div>
            <h2 id="enqTitle">Enquiry now</h2>
            <p>{fullName(p)}</p>
          </div>
          <button className="icon-btn" type="button" aria-label="Close enquiry" onClick={closeEnquiry}><IconClose /></button>
        </div>

        {sent && sentName ? (
          <div className="enq-done" aria-live="polite">
            <p className="sent"><b>Thanks, {sentName}. Your enquiry looks good.</b> This form is not connected yet in the design preview, so nothing was sent. On the live site it goes to the Britefoto sales team, who reply within one working day.</p>
            {SHOW_WA && (
              <a className="btn enq-wa enq-wide" href={waLink(p, pack, waExtra)} target="_blank" rel="noopener noreferrer">
                <IconWhatsApp /><span>Send this enquiry on WhatsApp instead</span>
              </a>
            )}
            <button className="btn btn-line enq-wide" type="button" onClick={closeEnquiry}>Back to the product</button>
          </div>
        ) : (
          <form noValidate onSubmit={submit}>
            <div className="fields">
              {p.packs.length > 1 && (
                <div className="field full"><label htmlFor="e-pack">Pack size</label>
                  <select id="e-pack" name="pack" value={pack} onChange={e => setPack(+e.target.value)}>
                    {p.packs.map((k, i) => <option key={i} value={i}>{packLabel(p, k[0])}, {inr(k[1])}</option>)}
                  </select>
                </div>
              )}
              <div className="field"><label htmlFor="e-name">Your name</label><input ref={first} id="e-name" name="name" required autoComplete="name" {...err('name')} />{msg('name')}</div>
              <div className="field"><label htmlFor="e-phone">Mobile number</label><input id="e-phone" name="phone" type="tel" inputMode="numeric" required autoComplete="tel" placeholder="10-digit mobile" {...err('phone')} />{msg('phone')}</div>
              <div className="field"><label htmlFor="e-city">City</label><input id="e-city" name="city" required autoComplete="address-level2" {...err('city')} />{msg('city')}</div>
              <div className="field"><label htmlFor="e-qty">Quantity <small>(optional)</small></label><input id="e-qty" name="qty" inputMode="numeric" placeholder="For example: 10 packs" /></div>
              <div className="field full"><label htmlFor="e-note">Message <small>(optional)</small></label><textarea id="e-note" name="note" rows="3" placeholder="Printer model, delivery date, GST invoice…" /></div>
            </div>
            <button className="btn btn-blue enq-wide" type="submit">Send enquiry</button>
          </form>
        )}
      </div>
    </div>
  );
}
