import { useEffect } from 'react';
import { FIN, byId } from '../data/catalog';

/* Fly-to-cart: when something is added, a small sheet of that paper
   (with its finish colour band) flies from where you clicked to the
   cart icon, and the cart gives a little nudge when it lands.
   StoreContext.addToCart fires the "bf:add" event. */
export default function Motion() {
  useEffect(() => {
    let last = null;
    const onDown = e => { last = { x: e.clientX, y: e.clientY }; };
    const onAdd = e => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const cart = document.querySelector('.cart-icon');
      if (!cart || !document.body.animate) return;
      const p = byId[e.detail?.id];
      const end = cart.getBoundingClientRect();
      // start where the visitor clicked, or at the focused button for keyboard users
      let start = last;
      if (!start) {
        const r = document.activeElement?.getBoundingClientRect?.();
        start = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: innerWidth / 2, y: innerHeight / 2 };
      }
      last = null;
      const ex = end.left + end.width / 2, ey = end.top + end.height / 2;
      const dx = ex - start.x, dy = ey - start.y;
      const lift = Math.min(160, Math.abs(dx) * 0.35 + 60);

      const el = document.createElement('div');
      el.className = 'fly-sheet';
      if (p) el.style.setProperty('--band', FIN[p.finish]?.band || '#1b2fd8');
      document.body.appendChild(el);
      const at = (x, y, s, r, o = 1) => ({ transform: `translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)`, opacity: o });
      const anim = el.animate([
        { ...at(start.x, start.y, 0.6, 0), offset: 0 },
        { ...at(start.x, start.y - 16, 1.15, -8), offset: 0.15 },
        { ...at(start.x + dx * 0.55, start.y + dy * 0.55 - lift, 0.85, -24), offset: 0.55 },
        { ...at(ex, ey, 0.25, -40, 0.7), offset: 1 },
      ], { duration: 820, easing: 'cubic-bezier(.45,.05,.4,1)', fill: 'forwards' });
      anim.onfinish = () => {
        el.remove();
        cart.classList.remove('cart-hit');
        void cart.offsetWidth; // restart the nudge if items are added quickly
        cart.classList.add('cart-hit');
        setTimeout(() => cart.classList.remove('cart-hit'), 520);
      };
    };
    document.addEventListener('pointerdown', onDown, true);
    window.addEventListener('bf:add', onAdd);
    return () => { document.removeEventListener('pointerdown', onDown, true); window.removeEventListener('bf:add', onAdd); };
  }, []);
  return null;
}
