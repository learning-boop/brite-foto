import { useStore } from '../context/StoreContext';
import { IconHeart } from './ProductActions';

/* App-style bottom navigation for phones: Home, Wishlist, a raised round
   Shop button in the middle, Account and Help. Hidden on wider screens. */
const Item = ({ href, label, on, children }) => (
  <a href={href} className={'bn-item' + (on ? ' on' : '')} aria-current={on ? 'page' : undefined}>
    <span className="bn-icon">{children}</span>
    <span className="bn-label">{label}</span>
  </a>
);

export default function BottomNav() {
  const { route, wishlist } = useStore();
  const v = route.v;
  const n = wishlist.length;
  return (
    <nav className="bottom-nav" aria-label="Quick links">
      <Item href="#home" label="Home" on={v === 'home'}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 10.5 12 4l8.5 6.5V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1v-9.5Z" /></svg>
      </Item>
      <Item href="#wishlist" label="Wishlist" on={v === 'wishlist'}>
        <IconHeart filled={v === 'wishlist'} />
        {n > 0 && <span className="bn-badge" aria-label={`${n} saved`}>{n > 9 ? '9+' : n}</span>}
      </Item>
      <a href="#shop" className={'bn-shop' + (v === 'shop' || v === 'product' ? ' on' : '')} aria-current={v === 'shop' ? 'page' : undefined}>
        <span className="bn-shop-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" /><path d="M9 10V7a3 3 0 0 1 6 0v3" /></svg>
        </span>
        <span className="bn-label">Shop</span>
      </a>
      <Item href="#account" label="Account" on={v === 'account'}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6" /></svg>
      </Item>
      <Item href="#contact" label="Help" on={v === 'contact'}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.2-2.5 3.8" /><path d="M12 17.2v.1" /></svg>
      </Item>
    </nav>
  );
}
