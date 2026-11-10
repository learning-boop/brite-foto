import { useStore } from '../context/StoreContext';
import { CartLine, Summary } from '../components/ui';

export default function Done() {
  const { lastOrder: o } = useStore();
  if (!o) {
    return (
      <div className="view"><div className="wrap">
        <div className="done"><h1 className="display">No recent order</h1><a className="btn btn-blue" href="#shop">Shop photo paper</a></div>
      </div></div>
    );
  }
  return (
    <div className="view"><div className="wrap">
      <div className="done">
        <div className="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 10 17l9-10" /></svg></div>
        <h1 className="display">Thank you, {o.name.split(' ')[0]}. Your order is placed.</h1>
        <p className="lede">Order <b className="tnum">{o.num}</b>. We will send the invoice and tracking link to your mobile and email once it ships to {o.city}, {o.state} {o.pin}.</p>
        <p className="preview-note" style={{ margin: 0 }}>Design preview. This confirmation is shown for demonstration. No payment was taken.</p>
        <div className="box">
          <ul className="lines">{o.lines.map(l => <CartLine key={l.id + ':' + l.pack} line={l} />)}</ul>
          <Summary t={o.t} />
          <p style={{ marginTop: 12, color: 'var(--ink-2)' }}>Payment: {o.pay}{o.gst ? '. GST invoice requested.' : '.'}</p>
        </div>
        <a className="btn btn-blue" href="#shop">Continue shopping</a>
      </div>
    </div></div>
  );
}
