import logo from '../assets/logo.png';
import { FINISH_ORDER, PHONE } from '../data/catalog';
import { Cmyk, FilterLink } from './ui';

export function AnnounceBar() {
  return (
    <div className="announce">
      <div className="wrap announce-in">
        <p>Free delivery across India on orders over ₹1,499.<span className="announce-extra"> Bulk discounts apply from 5 packs.</span></p>
        <a href="#bulk">Dealer and lab pricing</a>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap" style={{ paddingTop: 28 }}><Cmyk /></div>
      <div className="wrap foot-in">
        <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
          <img src={logo} alt="Britefoto, crisp and vivid" width="640" height="222" />
          <p>Photo paper for studios, labs, albums and commercial printing. Made by Britefoto, shipped across India.</p>
        </div>
        <div><h4>Shop</h4><ul>
          {FINISH_ORDER.slice(0, 6).map(f => <li key={f}><FilterLink filter={'finish:' + f}>{f} photo paper</FilterLink></li>)}
          <li><a href="#shop">All papers</a></li>
        </ul></div>
        <div><h4>Help</h4><ul>
          <li><a href="#contact">Shipping and delivery</a></li>
          <li><a href="#contact">Returns and replacements</a></li>
          <li><a href="#contact">Track an order</a></li>
          <li><a href="#contact">Printer settings</a></li>
        </ul></div>
        <div><h4>Company</h4><ul>
          <li><a href="#about">About Britefoto</a></li>
          <li><a href="#bulk">Bulk and dealers</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul></div>
        <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
          <h4 style={{ margin: 0 }}>Get in touch</h4>
          <p className="copyable">hello@britefoto.in</p>
          <p className="copyable">{PHONE}</p>
          <p>Monday to Saturday, 10 am to 7 pm</p>
        </div>
      </div>
      <div className="wrap foot-base"><span>© 2026 Britefoto. All prices include GST.</span><span>Pay by UPI, cards, netbanking or cash on delivery</span></div>
    </footer>
  );
}
