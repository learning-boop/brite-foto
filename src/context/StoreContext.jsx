import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { byId } from '../data/catalog';
import { emptyFilters, packLabel, storage, totals as calcTotals } from '../lib/helpers';

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

const VIEWS = ['home', 'shop', 'product', 'checkout', 'done', 'bulk', 'about', 'contact', 'wishlist', 'account'];
const TITLES = {
  home: 'Britefoto Store', shop: 'Shop photo paper | Britefoto', checkout: 'Checkout | Britefoto',
  done: 'Order placed | Britefoto', bulk: 'Bulk and dealer pricing | Britefoto', about: 'About Britefoto', contact: 'Contact Britefoto',
  wishlist: 'Your wishlist | Britefoto', account: 'Your account | Britefoto',
};

function parseHash() {
  const h = (window.location.hash || '').slice(1);
  if (!h) return { v: 'home' };
  if (h.startsWith('product-')) return { v: 'product', id: h.slice(8) };
  return { v: VIEWS.includes(h) ? h : 'home' };
}

function loadCart() {
  const saved = storage.get('bf-cart') || [];
  return Array.isArray(saved) ? saved.filter(l => l && byId[l.id] && byId[l.id].packs[l.pack]) : [];
}

export function StoreProvider({ children }) {
  /* ---------- routing (hash based, same URLs as before) ---------- */
  const [route, setRoute] = useState(parseHash);
  const [routeTick, setRouteTick] = useState(0);
  const firstRender = useRef(true);

  useEffect(() => {
    const onHash = () => { setRoute(parseHash()); setRouteTick(t => t + 1); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = useCallback(v => {
    if (window.location.hash === '#' + v) { setRoute(parseHash()); setRouteTick(t => t + 1); }
    else window.location.hash = v;
  }, []);

  /* ---------- drawers ---------- */
  const [drawer, setDrawer] = useState(null); // 'cart' | 'nav' | null
  const lastFocus = useRef(null);
  const openDrawer = useCallback(name => { lastFocus.current = document.activeElement; setDrawer(name); }, []);
  const closeDrawers = useCallback(silent => {
    setDrawer(null);
    if (!silent && lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
  }, []);

  // after every navigation: close drawers, update title, reset scroll
  useEffect(() => {
    setDrawer(null);
    setEnquiry(null);
    document.title = TITLES[route.v] || 'Britefoto Store';
    const ae = document.activeElement;
    if (ae && ae.closest && ae.closest('.mega')) ae.blur();
    if (firstRender.current) { firstRender.current = false; return; }
    window.scrollTo(0, 0);
  }, [route, routeTick]);

  /* ---------- toast ---------- */
  const [toast, setToast] = useState({ msg: '', on: false });
  const toastTimer = useRef(0);
  // action: optional { label, view } for the toast's button; the default is "View cart"
  const showToast = useCallback((msg, action = null) => {
    setToast({ msg, on: true, action });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, on: false })), 3600);
  }, []);
  const hideToast = useCallback(() => setToast(t => ({ ...t, on: false })), []);

  /* ---------- cart ---------- */
  const [cart, setCart] = useState(loadCart);
  const [bump, setBump] = useState(0);
  useEffect(() => { storage.set('bf-cart', cart); }, [cart]);
  const totals = useMemo(() => calcTotals(cart), [cart]);

  const addToCart = useCallback((id, pack = 0, qty = 1) => {
    pack = +pack || 0; qty = Math.max(1, +qty || 1);
    setCart(prev => {
      const found = prev.find(x => x.id === id && x.pack === pack);
      if (found) return prev.map(x => (x === found ? { ...x, qty: Math.min(999, x.qty + qty) } : x));
      return [...prev, { id, pack, qty }];
    });
    setBump(b => b + 1);
    window.dispatchEvent(new CustomEvent('bf:add', { detail: { id } })); // fly-to-cart animation (Motion.jsx)
    const p = byId[id];
    showToast(`Added ${qty} × ${p.name}${p.kind === 'roll' ? '' : ', ' + p.size}, ${packLabel(p, p.packs[pack][0])}`);
  }, [showToast]);

  const setQty = useCallback((id, pack, q) => {
    setCart(prev => prev
      .map(l => (l.id === id && l.pack === pack ? { ...l, qty: Math.max(0, Math.min(999, q)) } : l))
      .filter(l => l.qty > 0));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);

  /* ---------- wishlist (saved in this browser) ---------- */
  const [wishlist, setWishlist] = useState(() => {
    const saved = storage.get('bf-wish') || [];
    return Array.isArray(saved) ? saved.filter(id => byId[id]) : [];
  });
  useEffect(() => { storage.set('bf-wish', wishlist); }, [wishlist]);
  const toggleWish = useCallback(id => {
    const has = wishlist.includes(id), p = byId[id];
    setWishlist(w => (has ? w.filter(x => x !== id) : [...w, id]));
    showToast(has ? `Removed ${p.name} from your wishlist` : `Saved ${p.name} to your wishlist`,
      has ? { label: 'Undo', undo: id } : { label: 'View wishlist', view: 'wishlist' });
  }, [wishlist, showToast]);

  /* ---------- product enquiry form (modal) ---------- */
  const [enquiry, setEnquiry] = useState(null); // { id, pack } | null
  const openEnquiry = useCallback((id, pack = 0) => { lastFocus.current = document.activeElement; setEnquiry({ id, pack }); }, []);
  const closeEnquiry = useCallback(() => { setEnquiry(null); lastFocus.current?.focus?.(); }, []);

  /* ---------- shop filters ---------- */
  const [filt, setFilt] = useState(emptyFilters);
  const applyFilter = useCallback(str => {
    const i = str.indexOf(':'), g = str.slice(0, i), k = str.slice(i + 1);
    const next = emptyFilters();
    if (next[g]) next[g][k] = true;
    setFilt(next);
    go('shop');
  }, [go]);
  const runSearch = useCallback(q => {
    setFilt(f => ({ ...emptyFilters(), sort: f.sort, q }));
    go('shop');
  }, [go]);

  /* ---------- checkout ---------- */
  const [coDraft, setCoDraft] = useState({});
  const [lastOrder, setLastOrder] = useState(null);

  const value = {
    route, routeTick, go,
    drawer, openDrawer, closeDrawers,
    toast, showToast, hideToast,
    cart, totals, bump, addToCart, setQty, clearCart,
    filt, setFilt, applyFilter, runSearch,
    coDraft, setCoDraft, lastOrder, setLastOrder,
    wishlist, toggleWish, enquiry, openEnquiry, closeEnquiry,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
