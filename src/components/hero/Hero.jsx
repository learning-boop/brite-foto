import { useCallback, useEffect, useRef, useState } from 'react';
import { FIN, FINISH_ORDER } from '../../data/catalog';
import { finVars, inr, minPrice } from '../../lib/helpers';
import { useStore } from '../../context/StoreContext';
import { sceneUrls } from '../../lib/scenes';
import { WHEEL_PHOTOS } from './photos';
import './hero.css';

/* ---------------------------------------------------------------
   Spotlight hero.
   The cards line the inside of a cylinder seen from its centre:
   the active card sits furthest back, and cards toward the edges
   come closer and turn inward. Drag, swipe, arrow keys or the
   buttons move one finish at a time; it advances on its own when
   left alone.
   --------------------------------------------------------------- */

const CARDS = 16;                         // two rounds of the 8 finishes
const STEP = (Math.PI * 2) / CARDS;
const DRIFT = STEP / 3.2;                 // radians per second: one card every ~3 seconds
const RESUME_MS = 2200;                   // pause after the visitor moves the ring themselves

const cards = Array.from({ length: CARDS }, (_, i) => ({
  i,
  finish: FINISH_ORDER[i % FINISH_ORDER.length],
  photo: WHEEL_PHOTOS[i % WHEEL_PHOTOS.length],
}));

const gsmOf = f => (FIN[f].hero.match(/(\d+)\s*GSM/) || [])[1];
const pad = n => String(n).padStart(2, '0');
const mod = (n, m) => ((n % m) + m) % m;

function Card({ card, cardRef, onOpen }) {
  const [src, setSrc] = useState(card.photo.src);
  const [srcSet, setSrcSet] = useState(card.photo.srcSet);
  const n = FINISH_ORDER.indexOf(card.finish) + 1;
  const onError = () => {
    const fb = sceneUrls[card.photo.fallback];
    if (fb && src !== fb) { setSrc(fb); setSrcSet(undefined); }
  };
  return (
    <a
      ref={cardRef}
      className={'sp-card fx ' + FIN[card.finish].cls}
      style={finVars(card.finish)}
      href="#shop"
      tabIndex={-1}
      aria-label={`${card.finish} photo paper: ${card.photo.alt}`}
      onClick={e => onOpen(e, card)}
      draggable="false"
    >
      {/* each card is a print on its own paper: white border, that finish's texture and sheen */}
      <span className="sp-print">
        <img src={src} srcSet={srcSet} sizes="(max-width: 700px) 40vw, 220px" alt="" decoding="async" draggable="false" onError={onError} />
        <span className="sp-tex" />
        <span className="sp-sheen" />
        <span className="sp-card-num">{pad(n)}</span>
      </span>
      <span className="sp-card-name">{card.finish}</span>
    </a>
  );
}

/* variant="section": the same ring, used as a section below the main
   hero, with its own h2 heading and no repeated CTAs or stats. */
export default function Hero({ variant = 'hero' }) {
  const asSection = variant === 'section';
  const { applyFilter } = useStore();
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const api = useRef({});
  const dragged = useRef(0);
  const [active, setActive] = useState(0);       // index of the card at the front

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, R = 0, cw = 0, depth = 0;
    const measure = () => {
      W = stage.clientWidth;
      const phone = W < 700;
      cw = phone ? Math.min(W * 0.38, 170) : Math.min(Math.max(W * 0.125, 150), 215);
      R = (cw * (phone ? 1.12 : 1.3)) / STEP;      // keeps a gap between neighbours
      depth = R * 0.6;
      stage.style.setProperty('--cw', cw + 'px');
      stage.style.setProperty('--persp', (phone ? 760 : 1150) + 'px');
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);

    let angle = 0;          // current rotation (radians); card i sits at i*STEP - angle
    let target = 0;
    let dragging = false;
    let startX = 0, startAngle = 0, lastX = 0, lastT = 0, vel = 0;
    let lastActive = -1;
    let visible = true;
    let raf = 0;
    let idleAt = performance.now() - RESUME_MS;   // start drifting straight away
    // the ring keeps drifting; it slows (never stops) while a mouse rests on the cards
    let hovering = false;
    const onEnter = e => { if (e.pointerType === 'mouse') hovering = true; };
    const onLeave = () => { hovering = false; };

    const place = () => {
      for (let i = 0; i < CARDS; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        let a = i * STEP - angle;
        a = Math.atan2(Math.sin(a), Math.cos(a));            // wrap to -π..π
        const hidden = Math.abs(a) > 1.4;
        const x = R * Math.sin(a);
        const z = -R * Math.cos(a) + depth;                    // centre is furthest back
        el.style.transform = `translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${(-a * 180 / Math.PI).toFixed(2)}deg)`;
        el.style.visibility = hidden ? 'hidden' : 'visible';
        el.style.zIndex = String(Math.round(Math.abs(a) * 100));
        el.style.setProperty('--dim', Math.min(Math.abs(a) / 1.4, 1).toFixed(3));
      }
      const idx = mod(Math.round(angle / STEP), CARDS);
      if (idx !== lastActive) { lastActive = idx; setActive(idx); }
    };

    const go = delta => { target = Math.round(target / STEP) * STEP + delta * STEP; idleAt = performance.now(); };
    api.current.go = go;
    api.current.goTo = i => {
      const cur = Math.round(target / STEP);
      const diff = mod(i - cur + CARDS / 2, CARDS) - CARDS / 2;
      go(diff);
    };

    let lastT0 = performance.now();
    const frame = t => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((t - lastT0) / 1000, 0.25);
      lastT0 = t;
      if (!visible || document.hidden) return;
      if (!dragging) {
        // continuous drift, paused briefly after a drag, tap or arrow press
        if (!reduce && t - idleAt > RESUME_MS) target += DRIFT * (hovering ? 0.3 : 1) * dt;
        // ease toward the target at the same speed on any frame rate
        angle += (target - angle) * (reduce ? 1 : 1 - Math.pow(0.9, dt * 60));
        if (Math.abs(target - angle) < 0.0002) angle = target;
      }
      place();
    };

    const onDown = e => {
      if (e.button !== undefined && e.button !== 0) return;
      if (e.target.closest('.sp-ctrl')) return;
      dragging = true;
      dragged.current = 0;
      startX = lastX = e.clientX;
      startAngle = angle;
      lastT = performance.now();
      vel = 0;
      stage.classList.add('is-dragging');
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };
    const onMove = e => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      dragged.current += Math.abs(dx);
      vel = dx / Math.max(now - lastT, 1);
      lastX = e.clientX; lastT = now;
      angle = startAngle - (e.clientX - startX) / (R * 0.85);
      target = angle;
      place();
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-dragging');
      // flick: carry the throw forward, then settle on the nearest card
      target = Math.round((angle - vel * 180 / R) / STEP) * STEP;
      idleAt = performance.now();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    const onKey = e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    };

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(stage);
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('keydown', onKey);
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    place();
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('keydown', onKey);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      onUp();
    };
  }, []);

  // a tap on the front card opens that finish; a tap on another card brings it forward
  const openCard = useCallback((e, card) => {
    e.preventDefault();
    if (dragged.current > 6) return;
    if (card.i === active) applyFilter('finish:' + card.finish);
    else api.current.goTo?.(card.i);
  }, [active, applyFilter]);

  const toFinishes = e => {
    const el = document.getElementById('finishes');
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const cur = cards[active];
  const curN = FINISH_ORDER.indexOf(cur.finish) + 1;

  return (
    <section className={'sp-hero' + (asSection ? ' sp-as-section' : '')} aria-labelledby="sp-title">
      <span className="sp-side sp-side-l" aria-hidden="true">Britefoto · Finish index</span>
      <span className="sp-side sp-side-r" aria-hidden="true">130–380 GSM · 4R–A3+</span>

      {asSection ? (
        <div className="wrap sp-head">
          <p className="sp-eyebrow">The print gallery<span className="sp-eyebrow-extra"> · 16 prints</span></p>
          <h2 className="sp-title sp-title-sm" id="sp-title">See your memories on every <em>finish</em></h2>
          <p className="sp-lede">Newborns, families, weddings and travel, each printed on the paper that suits it best. Drag, swipe or use the arrows, and tap the front print to shop that finish.</p>
        </div>
      ) : (
      <div className="wrap sp-head">
        <p className="sp-eyebrow sp-rise" style={{ '--d': '0s' }}>The Britefoto collection<span className="sp-eyebrow-extra"> · 8 finishes</span></p>
        <h1 className="sp-title sp-rise" id="sp-title" style={{ '--d': '.1s' }}>
          Every photograph deserves <br />a <em>brilliant</em> finish
        </h1>
        <p className="sp-lede sp-rise" style={{ '--d': '.22s' }}>
          Bring your memories to life with premium photo papers engineered for exceptional colour,
          stunning clarity and professional-quality prints.
        </p>
        <div className="sp-ctas sp-rise" style={{ '--d': '.32s' }}>
          <a className="sp-btn sp-btn-primary" href="#shop">
            Explore Photo Papers
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          </a>
          <a className="sp-btn sp-btn-ghost" href="#finishes" onClick={toFinishes}>Discover Our Finishes</a>
        </div>
      </div>
      )}

      <div
        className="sp-stage"
        ref={stageRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Britefoto finishes. Use the arrow keys to move between them."
      >
        <span className="sp-glow" aria-hidden="true" />
        <div className="sp-ring">
          {cards.map(c => (
            <Card key={c.i} card={c} cardRef={el => { cardRefs.current[c.i] = el; }} onOpen={openCard} />
          ))}
        </div>
        <span className="sp-floor" aria-hidden="true" />
      </div>

      <div className="wrap sp-foot">
        <div className="sp-index" aria-hidden="true"><b>{pad(curN)}</b><span>/ 08</span></div>

        <div className="sp-now" aria-live="polite">
          <span className="sp-hint">Drag · Swipe · Arrow keys</span>
          <h2 className="sp-now-title">{cur.finish}</h2>
          <p className="sp-now-meta">
            {gsmOf(cur.finish) && <span>{gsmOf(cur.finish)} GSM</span>}
            <span>{FIN[cur.finish].blurb}</span>
            <span className="sp-price">From {inr(minPrice(cur.finish))}</span>
          </p>
        </div>

        <div className="sp-ctrl">
          <button type="button" aria-label="Previous finish" onClick={() => api.current.go?.(-1)}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
          </button>
          <button type="button" aria-label="Next finish" onClick={() => api.current.go?.(1)}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
          </button>
        </div>
      </div>

      {!asSection && <div className="wrap">
        <ul className="sp-stats" aria-label="Britefoto at a glance">
          <li><b>130–380 GSM</b><span>Premium paper</span></li>
          <li><b>8 finishes</b><span>Glossy to canvas</span></li>
          <li><b>4R to A3+</b><span>Sheet sizes, plus rolls</span></li>
        </ul>
      </div>}
    </section>
  );
}
