import { useState } from 'react';
import { FREE_SHIP, STATES } from '../data/catalog';
import { inr } from '../lib/helpers';
import { useStore } from '../context/StoreContext';
import { CartLine, Crumbs, Summary } from '../components/ui';

const RULES = {
  'co-name': v => (v.trim().length < 2 ? 'Enter your full name.' : ''),
  'co-phone': v => { v = v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''); return /^[6-9]\d{9}$/.test(v) ? '' : 'Enter a 10-digit mobile number starting with 6, 7, 8 or 9.'; },
  'co-email': v => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter an email address like name@example.com.'),
  'co-addr1': v => (v.trim().length < 5 ? 'Enter your house number, building and street.' : ''),
  'co-city': v => (v.trim() ? '' : 'Enter your city.'),
  'co-state': v => (v ? '' : 'Select your state.'),
  'co-pin': v => (/^[1-9]\d{5}$/.test(v.trim()) ? '' : 'Enter a 6-digit PIN code.'),
  'co-gstin': (v, d) => (!d['co-gst'] ? '' : /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v.trim().toUpperCase()) ? '' : 'Enter a valid 15-character GSTIN, for example 37ABCDE1234F1Z5.'),
  'co-biz': (v, d) => (!d['co-gst'] ? '' : v.trim() ? '' : 'Enter the business name for the invoice.'),
};

const PAY = [
  ['UPI', 'Google Pay, PhonePe, Paytm or any UPI app'],
  ['Card or netbanking', 'Visa, Mastercard, RuPay and all major banks, through a secure payment gateway'],
  ['Cash on delivery', 'Pay when the parcel arrives. Available for orders up to ₹10,000.'],
];

function orderNumber() {
  const d = new Date();
  return 'BF' + String(d.getFullYear()).slice(2) + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) + '-' + Math.floor(1000 + Math.random() * 9000);
}

export default function Checkout() {
  const { cart, totals: t, coDraft: draft, setCoDraft, setLastOrder, clearCart, go, openDrawer } = useStore();
  const [errors, setErrors] = useState({});
  const pay = draft.pay || 'UPI';

  const crumbs = cart.length
    ? [<a href="#home">Home</a>, <a href="#" onClick={e => { e.preventDefault(); openDrawer('cart'); }}>Cart</a>, <span>Checkout</span>]
    : [<a href="#home">Home</a>, <span>Checkout</span>];

  if (!cart.length) {
    return (
      <div className="view"><div className="wrap">
        <Crumbs items={crumbs} />
        <div className="empty" style={{ marginBlock: '24px 72px' }}>
          <h2>Your cart is empty</h2>
          <p style={{ color: 'var(--ink-2)' }}>Add some paper to your cart, then come back to check out.</p>
          <a className="btn btn-blue" href="#shop">Shop photo paper</a>
        </div>
      </div></div>
    );
  }

  const validate = (id, d = draft) => {
    const rule = RULES[id]; if (!rule) return '';
    const msg = rule(d[id] || '', d);
    setErrors(e => ({ ...e, [id]: msg }));
    return msg;
  };
  const update = (id, value) => {
    const next = { ...draft, [id]: value };
    setCoDraft(next);
    if (errors[id]) validate(id, next);
  };

  const placeOrder = e => {
    e.preventDefault();
    let first = null; const errs = {};
    Object.keys(RULES).forEach(id => { const m = RULES[id](draft[id] || '', draft); errs[id] = m; if (m && !first) first = id; });
    setErrors(errs);
    if (first) { document.getElementById(first)?.focus(); return; }
    setLastOrder({
      num: orderNumber(), lines: cart.slice(), t, pay,
      name: (draft['co-name'] || '').trim(), city: (draft['co-city'] || '').trim(), state: draft['co-state'],
      pin: (draft['co-pin'] || '').trim(), gst: !!draft['co-gst'],
    });
    setCoDraft({});
    go('done');
    clearCart();
  };

  const field = (id, label, attrs = {}, full = false, hint = '') => (
    <div className={'field' + (full ? ' full' : '')}>
      <label htmlFor={id}>{label}{hint && <> <small>{hint}</small></>}</label>
      <input id={id} name={id} value={draft[id] || ''} onChange={e => update(id, e.target.value)}
        aria-invalid={errors[id] ? 'true' : errors[id] === '' ? 'false' : undefined}
        aria-describedby={errors[id] ? id + '-err' : undefined} {...attrs} />
      <span className="err" id={id + '-err'}>{errors[id] || ''}</span>
    </div>
  );

  return (
    <div className="view"><div className="wrap">
      <Crumbs items={crumbs} />
      <div className="co">
        <form id="coForm" noValidate onSubmit={placeOrder}>
          <h1 className="display">Checkout</h1>
          <p className="preview-note">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flex: 'none', marginTop: 1 }}><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.5" /></svg>
            <span>Design preview. Placing an order here shows the confirmation screen only. No payment is taken and no order is sent.</span>
          </p>
          <fieldset className="form-sec"><legend>Contact</legend><div className="fields">
            {field('co-name', 'Full name', { required: true, autoComplete: 'name' })}
            {field('co-phone', 'Mobile number', { type: 'tel', inputMode: 'numeric', required: true, autoComplete: 'tel', placeholder: '10-digit mobile' })}
            {field('co-email', 'Email', { type: 'email', required: true, autoComplete: 'email' }, true, 'for order updates')}
          </div></fieldset>
          <fieldset className="form-sec"><legend>Delivery address</legend><div className="fields">
            {field('co-addr1', 'House, building and street', { required: true, autoComplete: 'address-line1' }, true)}
            {field('co-addr2', 'Area or landmark', { autoComplete: 'address-line2' }, true, '(optional)')}
            {field('co-city', 'City', { required: true, autoComplete: 'address-level2' })}
            <div className="field">
              <label htmlFor="co-state">State</label>
              <select id="co-state" name="co-state" required autoComplete="address-level1" value={draft['co-state'] || ''}
                aria-invalid={errors['co-state'] ? 'true' : undefined} aria-describedby={errors['co-state'] ? 'co-state-err' : undefined}
                onChange={e => update('co-state', e.target.value)}>
                <option value="">Select state</option>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
              <span className="err" id="co-state-err">{errors['co-state'] || ''}</span>
            </div>
            {field('co-pin', 'PIN code', { inputMode: 'numeric', maxLength: 6, required: true, autoComplete: 'postal-code' })}
          </div></fieldset>
          <fieldset className="form-sec"><legend>Business purchase</legend>
            <label className="check-row">
              <input type="checkbox" id="co-gst" checked={!!draft['co-gst']} onChange={e => update('co-gst', e.target.checked)} /> I need a GST invoice for my business
            </label>
            <div className="fields" hidden={!draft['co-gst']}>
              {field('co-gstin', 'GSTIN', { maxLength: 15, autoCapitalize: 'characters', placeholder: '15-character GSTIN' })}
              {field('co-biz', 'Business name', { autoComplete: 'organization' })}
            </div>
          </fieldset>
          <fieldset className="form-sec" style={{ borderBottom: 0 }}><legend>Payment</legend>
            <div className="pay">
              {PAY.map(([v, d]) => (
                <label key={v}><input type="radio" name="pay" value={v} checked={pay === v} onChange={() => update('pay', v)} /><b>{v}</b><small>{d}</small></label>
              ))}
            </div>
          </fieldset>
        </form>
        <aside className="co-side">
          <h2>Order summary</h2>
          <ul className="lines">{cart.map(l => <CartLine key={l.id + ':' + l.pack} line={l} />)}</ul>
          <Summary t={t} />
          {t.ship ? <p style={{ fontSize: '.85rem', color: 'var(--ink-3)', marginTop: 8 }}>Add {inr(FREE_SHIP - t.after)} more for free delivery.</p> : null}
          <button className="btn btn-red place" type="submit" form="coForm">Place order, {inr(t.total)}</button>
          <p style={{ fontSize: '.82rem', color: 'var(--ink-3)', marginTop: 10 }}>By placing your order you agree to Britefoto’s terms, shipping and returns policy.</p>
        </aside>
      </div>
    </div></div>
  );
}
