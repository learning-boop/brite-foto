import { useRef, useState } from 'react';
import { FIN, FINISH_ORDER, PHONE } from '../data/catalog';
import { Crumbs, Dot } from '../components/ui';

/* ---------- shared lead form (bulk quote, contact) ---------- */
function useLeadForm() {
  const [errors, setErrors] = useState({});
  const [sentName, setSentName] = useState('');
  const onSubmit = e => {
    e.preventDefault();
    const form = e.currentTarget, errs = {};
    let first = null;
    form.querySelectorAll('[required]').forEach(i => {
      const v = (i.value || '').trim();
      let msg = '';
      if (!v) msg = 'This field is required.';
      else if (i.type === 'tel' && !/^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''))) msg = 'Enter a 10-digit mobile number.';
      errs[i.name] = msg;
      if (msg && !first) first = i;
    });
    const em = form.querySelector('input[type="email"]');
    if (em && em.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) {
      errs[em.name] = 'Enter an email address like name@example.com.';
      if (!first) first = em;
    }
    setErrors(errs);
    if (first) { first.focus(); return; }
    setSentName(form.elements.name.value.trim().split(' ')[0]);
    form.reset();
  };
  const err = name => ({ 'aria-invalid': errors[name] ? 'true' : undefined });
  const msg = name => <span className="err">{errors[name] || ''}</span>;
  return { onSubmit, err, msg, sentName };
}

export function Bulk() {
  const { onSubmit, err, msg, sentName } = useLeadForm();
  return (
    <div className="view"><div className="wrap">
      <Crumbs items={[<a href="#home">Home</a>, <span>Bulk and dealers</span>]} />
      <div className="page-hero">
        <h1 className="display">Bulk, lab and dealer pricing</h1>
        <p className="lede">Photo labs, studios, album makers and stationery shops buy Britefoto by the carton. Tell us what you print each month and we will send a price list and delivery schedule for your city.</p>
      </div>
      <div className="two">
        <div className="prose">
          <h2>How bulk pricing works</h2>
          <p>Small bulk orders need no paperwork. Add 5 or more packs of the same paper to your cart and the discount is applied before checkout.</p>
          <div style={{ overflowX: 'auto' }}>
            <table className="tiers" style={{ border: '1px solid var(--line)' }}>
              <thead><tr><th>Packs of one paper</th><th>Discount</th></tr></thead>
              <tbody>
                <tr><td><b>1 to 4</b></td><td>List price</td></tr>
                <tr><td><b>5 to 9</b></td><td className="save">5% off</td></tr>
                <tr><td><b>10 or more</b></td><td className="save">10% off</td></tr>
                <tr><td><b>Cartons and rolls</b></td><td>Quoted price</td></tr>
              </tbody>
            </table>
          </div>
          <h2>For dealers and distributors</h2>
          <p>Stock the full Britefoto range with dealer margins, display packs and regular dispatch. We also make private-label and custom-size packs for large accounts.</p>
          <h2>What to include</h2>
          <p>The finishes and sizes you use, rough monthly quantity, your city and whether you need a GST invoice.</p>
        </div>
        <form className="form-card" noValidate onSubmit={onSubmit}>
          <h2>Request a quote</h2>
          <p style={{ color: 'var(--ink-2)' }}>We reply within one working day.</p>
          <div className="fields">
            <div className="field"><label htmlFor="b-name">Your name</label><input id="b-name" name="name" required autoComplete="name" {...err('name')} />{msg('name')}</div>
            <div className="field"><label htmlFor="b-biz">Business name</label><input id="b-biz" name="biz" required autoComplete="organization" {...err('biz')} />{msg('biz')}</div>
            <div className="field"><label htmlFor="b-type">Business type</label>
              <select id="b-type" name="type" required defaultValue="" {...err('type')}>
                <option value="">Select</option><option>Photo studio</option><option>Photo lab or DTP centre</option><option>Album designer</option>
                <option>Commercial printer</option><option>Dealer or reseller</option><option>School or institution</option><option>Other</option>
              </select>{msg('type')}
            </div>
            <div className="field"><label htmlFor="b-city">City</label><input id="b-city" name="city" required autoComplete="address-level2" {...err('city')} />{msg('city')}</div>
            <div className="field"><label htmlFor="b-phone">Mobile number</label><input id="b-phone" name="phone" type="tel" inputMode="numeric" required autoComplete="tel" placeholder="10-digit mobile" {...err('phone')} />{msg('phone')}</div>
            <div className="field"><label htmlFor="b-email">Email <small>(optional)</small></label><input id="b-email" name="email" type="email" autoComplete="email" {...err('email')} />{msg('email')}</div>
            <div className="field full"><label htmlFor="b-need">What do you need each month?</label><textarea id="b-need" name="need" required placeholder="For example: 40 packs Glossy 270 GSM 4R, 10 packs Luster 260 GSM A4, 2 rolls Luster 44 in" {...err('need')} />{msg('need')}</div>
          </div>
          <button className="btn btn-blue" type="submit">Send request</button>
          <div aria-live="polite">
            {sentName && <p className="sent"><b>Thanks, {sentName}. Your details look good.</b> This form is not connected yet in the design preview, so nothing was sent. On the live site it goes to the Britefoto sales team.</p>}
          </div>
        </form>
      </div>
    </div></div>
  );
}

export function About() {
  return (
    <div className="view"><div className="wrap">
      <Crumbs items={[<a href="#home">Home</a>, <span>About</span>]} />
      <div className="page-hero">
        <h1 className="display">We make the paper your photos are printed on</h1>
        <p className="lede">Britefoto is a photo paper manufacturer. We coat and pack papers for digital and professional printing, and supply studios, photo labs, album makers and commercial printers.</p>
      </div>
      <div className="two">
        <div className="prose">
          <h2>Why photo paper matters</h2>
          <p>Photo paper has a special coating that takes ink evenly. Compared with plain paper, it gives sharper detail, more accurate colour, smoother gradients, deeper blacks and prints that last longer.</p>
          <p>Every Britefoto paper is made to give the same result sheet after sheet, so a studio can match a reprint to the original and a lab can run a full day of orders without surprises.</p>
          <h2>Who we work with</h2>
          <p>Photographers and studios, photo labs and DTP centres, album designers, commercial and digital printers, schools and offices, and dealers across India.</p>
          <div><a className="btn btn-blue" href="#shop">Shop photo paper</a></div>
        </div>
        <div>
          <h2 className="h2" style={{ fontSize: '1.4rem', marginBottom: 12 }}>The eight finishes we make</h2>
          <ul className="types">
            {FINISH_ORDER.map(f => <li key={f}><Dot finish={f} /><b>{f}</b><span>{FIN[f].long}</span></li>)}
          </ul>
        </div>
      </div>
    </div></div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  // if the clipboard is blocked, select the text so it can be copied by hand
  const select = () => {
    try {
      const r = document.createRange(); r.selectNodeContents(ref.current.parentNode.firstChild);
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    } catch { /* ignore */ }
  };
  const onClick = () => {
    try {
      navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }, select);
    } catch { select(); }
  };
  return <button ref={ref} className="copy-btn" type="button" onClick={onClick}>{copied ? 'Copied' : 'Copy'}</button>;
}

export function Contact() {
  const { onSubmit, err, msg, sentName } = useLeadForm();
  return (
    <div className="view"><div className="wrap">
      <Crumbs items={[<a href="#home">Home</a>, <span>Contact</span>]} />
      <div className="page-hero"><h1 className="display">Talk to Britefoto</h1><p className="lede">Questions about a paper, an order or a printer setting? Send a message and our team will reply.</p></div>
      <div className="two">
        <div className="contact-list">
          <div><span>Email</span><span className="copyable" style={{ fontSize: '1.05rem' }}>hello@britefoto.in <CopyButton text="hello@britefoto.in" /></span></div>
          <div><span>Phone and WhatsApp</span><span className="copyable" style={{ fontSize: '1.05rem' }}>{PHONE} <CopyButton text={PHONE} /></span></div>
          <div><span>Hours</span><b>Monday to Saturday, 10 am to 7 pm</b></div>
          <div><span>Website</span><b>britefoto.in</b></div>
        </div>
        <form className="form-card" noValidate onSubmit={onSubmit}>
          <h2>Send a message</h2>
          <div className="fields">
            <div className="field"><label htmlFor="c-name">Name</label><input id="c-name" name="name" required autoComplete="name" {...err('name')} />{msg('name')}</div>
            <div className="field"><label htmlFor="c-phone">Mobile number</label><input id="c-phone" name="phone" type="tel" inputMode="numeric" required autoComplete="tel" {...err('phone')} />{msg('phone')}</div>
            <div className="field full"><label htmlFor="c-msg">Message</label><textarea id="c-msg" name="msg" required {...err('msg')} />{msg('msg')}</div>
          </div>
          <button className="btn btn-blue" type="submit">Send message</button>
          <div aria-live="polite">
            {sentName && <p className="sent"><b>Thanks, {sentName}. Your details look good.</b> This form is not connected yet in the design preview, so nothing was sent. On the live site it goes to the Britefoto support inbox.</p>}
          </div>
        </form>
      </div>
    </div></div>
  );
}
