import { useEffect, useRef, useState } from 'react';
import { FIN } from '../../data/catalog';
import { finVars } from '../../lib/helpers';
import { FilterLink } from '../ui';
import { HERO_PRINTS } from './photos';
import './hero-prints.css';

/* ---------------------------------------------------------------
   Homepage hero: headline on the left, four real prints laid on a
   marble table on the right (family, lotus, wedding, travel).
   Each print sits on a Britefoto finish and shows that paper's
   texture and sheen. The prints settle onto the table on load,
   drift a little with the pointer, lift on hover, and open that
   finish in the shop when clicked.
   --------------------------------------------------------------- */

const Icon = ({ d }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const LAYERS = <><path d="M16 5 4 11l12 6 12-6-12-6Z" /><path d="m4 16 12 6 12-6" /><path d="m4 21 12 6 12-6" /></>;
const STACK = <><path d="M16 4 5 9.5 16 15l11-5.5L16 4Z" /><path d="M5 15.5 16 21l11-5.5" /><path d="M9 23.5 16 27l7-3.5" /></>;
const RESIZE = <><path d="M19 5h8v8" /><path d="m27 5-9 9" /><path d="M13 27H5v-8" /><path d="m5 27 9-9" /></>;

/* A number that counts up from `from` to `to` shortly after the page loads. */
function CountUp({ to, from = 0, delay = 500, ms = 1300 }) {
  const [n, setN] = useState(() => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? to : from));
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0, t0 = 0;
    const tick = t => {
      if (!t0) t0 = t;
      const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      setN(Math.round(from + (to - from) * e));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => { raf = requestAnimationFrame(tick); }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [to, from, delay, ms]);
  return n;
}

export default function HeroPrints() {
  const table = useRef(null);

  // pointer parallax + light: prints drift by their depth, glare follows the pointer
  useEffect(() => {
    const el = table.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    const onMove = e => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--px', (x - 0.5).toFixed(3));
        el.style.setProperty('--py', (y - 0.5).toFixed(3));
        el.style.setProperty('--lx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--ly', (y * 100).toFixed(1) + '%');
      });
    };
    const onLeave = () => { el.style.setProperty('--px', 0); el.style.setProperty('--py', 0); };
    const host = el.closest('.hp-hero');
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    return () => { cancelAnimationFrame(raf); host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerleave', onLeave); };
  }, []);

  const toFinishes = e => {
    const el = document.getElementById('finishes');
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section className="hp-hero" aria-labelledby="hp-title">
      <div className="wrap hp-grid">
        <div className="hp-copy">
          <p className="hp-eyebrow hp-rise" style={{ '--d': '0s' }}>Premium photo paper</p>
          <h1 className="hp-title hp-rise" id="hp-title" style={{ '--d': '.08s' }}>
            Every photograph deserves a <span className="hp-accent">brilliant <span className="hp-swash">finish.<svg viewBox="0 0 200 18" preserveAspectRatio="none" aria-hidden="true"><path d="M3 13C48 5 120 2 197 9" /></svg></span></span>
          </h1>
          <p className="hp-lede hp-rise" style={{ '--d': '.18s' }}>
            Bring your memories to life with premium photo papers engineered for exceptional colour,
            stunning clarity and professional-quality prints.
          </p>
          <div className="hp-ctas hp-rise" style={{ '--d': '.26s' }}>
            <a className="hp-btn hp-btn-primary" href="#shop">
              Explore Photo Papers
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </a>
            <a className="hp-btn hp-btn-ghost" href="#finishes" onClick={toFinishes}>Discover Our Finishes</a>
          </div>
          <ul className="hp-stats hp-rise" style={{ '--d': '.34s' }} aria-label="Britefoto at a glance">
            <li title="GSM is paper weight: higher means thicker"><Icon d={LAYERS} /><span><b aria-label="130 to 380 GSM"><CountUp from={100} to={130} /> – <CountUp from={100} to={380} /> GSM</b>Light to extra thick</span></li>
            <li><Icon d={STACK} /><span><b aria-label="8 Premium"><CountUp to={8} delay={650} ms={900} /> Premium</b>Paper Finishes</span></li>
            <li><Icon d={RESIZE} /><span>Sizes from<b>4R to A3+</b></span></li>
          </ul>
        </div>

        <div className="hp-table" ref={table}>
          <span className="hp-marble" aria-hidden="true" />
          <p className="hp-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.9-2.6L4.3 15a1.5 1.5 0 0 1 2.4-1.8L9 15" /></svg>
            Pick a print to shop that paper
          </p>
          {HERO_PRINTS.map((p, i) => (
            <FilterLink
              key={p.key}
              filter={'finish:' + p.finish}
              className={`hp-print hp-${p.key} fx ${FIN[p.finish].cls}`}
              style={{ ...finVars(p.finish), '--ar': p.ar, '--i': i }}
              aria-label={`${p.alt}, printed on ${p.finish} paper. Shop ${p.finish.toLowerCase()} paper`}
            >
              <span className="hp-photo">
                <img src={p.src} srcSet={p.srcSet} sizes="(max-width: 900px) 60vw, 34vw" alt="" decoding="async"
                  fetchpriority={i === 0 ? 'high' : undefined} draggable="false" />
                <span className="hp-tex" />
                <span className="hp-sheen" />
                <span className="hp-glare" />
              </span>
              <span className="hp-tag">Printed on {p.finish}</span>
            </FilterLink>
          ))}
        </div>
      </div>
    </section>
  );
}
