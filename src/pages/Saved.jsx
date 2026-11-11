import { byId } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { Crumbs, ProductCard } from '../components/ui';

/* Wishlist: papers saved with the heart button (kept in this browser). */
export function Wishlist() {
  const { wishlist } = useStore();
  const items = wishlist.map(id => byId[id]).filter(Boolean);
  return (
    <div className="view"><div className="wrap">
      <Crumbs items={[<a href="#home">Home</a>, <span>Wishlist</span>]} />
      <div className="shop-head">
        <h1 className="display">Your wishlist</h1>
        <p className="tnum">{items.length} {items.length === 1 ? 'paper' : 'papers'} saved</p>
      </div>
      {items.length ? (
        <>
          <p className="lede" style={{ marginBottom: 24 }}>Papers you saved with the heart. They stay saved on this device.</p>
          <div className="grid" style={{ paddingBottom: 56 }}>{items.map(p => <ProductCard key={p.id} p={p} />)}</div>
        </>
      ) : (
        <div className="empty saved-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.8 3.9 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.4 0 5.7 3.3 4.5 6.7-1.7 4.7-9.2 9.3-9.2 9.3Z" /></svg>
          <h2>Nothing saved yet</h2>
          <p>Tap the heart on any paper to keep it here for later.</p>
          <a className="btn btn-blue" href="#shop">Browse photo paper</a>
        </div>
      )}
    </div></div>
  );
}

/* Account: there is no sign-in yet, so this says so and links to what a
   customer usually wants from an account. */
export function Account() {
  const { wishlist, totals, openDrawer } = useStore();
  const rows = [
    { href: '#wishlist', t: 'Wishlist', s: `${wishlist.length} saved ${wishlist.length === 1 ? 'paper' : 'papers'}` },
    { onClick: () => openDrawer('cart'), t: 'Cart', s: `${totals.items} ${totals.items === 1 ? 'item' : 'items'}` },
    { href: '#contact', t: 'Track an order', s: 'Send your order number and we reply with the status' },
    { href: '#bulk', t: 'Dealer and lab pricing', s: 'Cartons, rolls and reseller prices' },
    { href: '#contact', t: 'Help and contact', s: 'Monday to Saturday, 10 am to 7 pm' },
  ];
  return (
    <div className="view"><div className="wrap">
      <Crumbs items={[<a href="#home">Home</a>, <span>Account</span>]} />
      <div className="page-hero">
        <h1 className="display">Your account</h1>
        <p className="preview-note" style={{ maxWidth: 560 }}>Customer sign-in is not connected yet in this design preview. Your wishlist and cart are saved on this device.</p>
      </div>
      <ul className="acct-list">
        {rows.map(r => (
          <li key={r.t}>
            {r.href
              ? <a href={r.href}><b>{r.t}</b><span>{r.s}</span><i aria-hidden="true">›</i></a>
              : <button type="button" onClick={r.onClick}><b>{r.t}</b><span>{r.s}</span><i aria-hidden="true">›</i></button>}
          </li>
        ))}
      </ul>
    </div></div>
  );
}
