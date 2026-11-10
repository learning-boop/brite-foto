import { useEffect, useRef, useState } from 'react';
import { BEST_SELLERS, FIN, FINISH_ORDER, GSM, PRODUCTS, SIZES, byId } from '../data/catalog';
import { finVars, inr, minPrice } from '../lib/helpers';
import Hero from '../components/hero/HeroPrints';
import FinishRing from '../components/hero/Hero';
import FinishCompare from '../components/FinishCompare';
import { FINISH_PHOTOS, JOB_PHOTOS } from '../components/hero/photos';
import './home-finishes.css';
import { Cmyk, FilterLink, ProductCard } from '../components/ui';

function SizeFigure({ hl }) {
  const sheets = SIZES.filter(s => s.mm), S = .62, pad = 20, H = 483 * S + pad * 2, W = 329 * S + pad * 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Britefoto sheet sizes drawn to the same scale">
      {sheets.slice().reverse().map(s => {
        const w = s.mm[0] * S, h = s.mm[1] * S, x = pad, y = H - pad - h;
        return (
          <g key={s.k} className={'sz' + (hl === s.k ? ' on' : '')}>
            <rect x={x} y={y} width={w} height={h} />
            <text x={x + w - 6} y={y + 12.5} textAnchor="end">{s.k}</text>
          </g>
        );
      })}
    </svg>
  );
}

const JOBS = [
  { h: 'Photo studios', p: 'Portraits, weddings and client proofs that need rich skin tones and low glare.', tags: [['finish:Luster', 'Luster'], ['finish:Satin', 'Satin'], ['finish:Pearl', 'Pearl']] },
  { h: 'Photo labs and DTP centres', p: 'High-volume 4R and A4 prints, passport photos and same-day orders.', tags: [['size:4R', '4R sheets'], ['finish:Glossy', 'Glossy'], ['size:Roll', 'Rolls']] },
  { h: 'Album designers', p: 'Album spreads and covers on heavier stock that handles well page after page.', tags: [['gsm:260', '260 to 270 GSM'], ['finish:Matte', 'Matte']] },
  { h: 'Commercial printers', p: 'Brochures, menus, certificates and posters, including double-sided matte.', tags: [['gsm:130', '130 GSM'], ['size:A3', 'A3'], ['size:A3+', 'A3+']] },
  { h: 'Artists and galleries', p: 'Textured fine art sheets and canvas for exhibitions and wall art.', tags: [['finish:Fine Art', 'Fine art'], ['finish:Canvas', 'Canvas']] },
  { h: 'Home and office', p: 'Family photos, school projects and certificates on a desktop inkjet.', tags: [['size:A4', 'A4'], [null, 'Sampler kit']] },
];

const FAQS = [
  ['Will it work with my printer?', 'Yes, if it is an inkjet. Britefoto paper is made for Epson, Canon, HP and Brother inkjet printers, with dye or pigment inks, from desktop models to lab and large-format machines. It is not made for laser printers.'],
  ['Which finish should I choose?', 'Glossy gives the most punch and contrast. Luster, satin and pearl keep rich colour with less glare, which is why studios use them for portraits. Matte has no shine and suits text and albums. Not sure? The sampler kit has all eight finishes in one pack.'],
  ['What does GSM mean, and how thick should I go?', 'GSM is the weight of one square metre of paper. Lighter stock (around 130 GSM) suits brochures and handouts, 180 to 230 GSM suits everyday photos, and 260 GSM and above feels like a professional print or album page.'],
  ['Which side do I print on?', 'Print on the bright, coated side. Ink sits on that coating, which gives the sharp detail and quick drying. Load a single test sheet first if you are unsure which way your printer feeds.'],
  ['Do you offer bulk pricing?', 'Yes. Buy 5 to 9 packs of one paper and the cart takes 5% off; 10 or more takes 10% off, automatically. For cartons, rolls or dealer pricing, send a bulk request and we quote within one working day.'],
  ['Is delivery free, and do I get a GST invoice?', 'Delivery is free across India on orders over ₹1,499, and every order comes with a GST invoice.'],
];

/* Effects for the home page:
   - sections rise in as they scroll into view (.reveal)
   - photos "develop" like a print in a tray: pale and soft first, then full colour (.develop)
   Both are skipped for visitors who ask for reduced motion. */
function useScrollEffects(root) {
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return undefined;
    const targets = el.querySelectorAll('.reveal, .develop');
    targets.forEach(t => t.classList.add('fx-wait'));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('fx-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, [root]);
}

/* Finish cards tilt toward the pointer and a light glare follows it,
   so you can see how each surface catches light. Mouse/pen only. */
const tilt = e => {
  if (e.pointerType === 'touch') return;
  const card = e.target.closest('.fp-card');
  if (!card) return;
  const m = card.querySelector('.fp-media'), r = m.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  m.style.setProperty('--rx', ((0.5 - y) * 7).toFixed(2) + 'deg');
  m.style.setProperty('--ry', ((x - 0.5) * 9).toFixed(2) + 'deg');
  m.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
  m.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
};
const untilt = e => {
  const m = e.target.closest?.('.fp-card')?.querySelector('.fp-media');
  if (m) ['--rx', '--ry', '--gx', '--gy'].forEach(v => m.style.removeProperty(v));
};

export default function Home() {
  const [hl, setHl] = useState(null);
  const root = useRef(null);
  useScrollEffects(root);
  return (
    <div className="view" ref={root}>
      <Hero />
      <div className="wrap"><Cmyk /></div>

      <section className="sec" id="finishes" style={{ scrollMarginTop: 96 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <div><h2 className="h2">Shop by finish</h2><p className="lede">Eight surfaces, each shown on a photograph it suits, with the paper's own texture and shine.</p></div>
            <a className="more" href="#product-sampler-kit">Try all eight with the sampler kit</a>
          </div>
          <div className="fp-grid reveal stagger" onPointerMove={tilt} onPointerOut={untilt}>
            {FINISH_ORDER.map((f, i) => {
              const F = FIN[f], ph = FINISH_PHOTOS[f];
              return (
                <FilterLink key={f} filter={'finish:' + f} className={'fp-card fx ' + F.cls} style={finVars(f)}>
                  <span className="fp-media develop" style={{ '--dd': (i % 4) * 0.09 + 's' }}>
                    <img src={ph.src} srcSet={ph.srcSet} sizes="(max-width: 860px) 50vw, 25vw" alt={ph.alt}
                      decoding="async" loading="lazy" fetchpriority="low" width="480" height="600"
                      onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.classList.add('fp-fallback'); }} />
                    <span className="fp-tex" />
                    <span className="fp-sheen" />
                    <span className="fp-glare" />
                    <span className="fp-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="fp-cap">
                      <span className="fp-name">{f}</span>
                      <span className="fp-gsm">{F.hero.split(', ')[1]}</span>
                    </span>
                  </span>
                  <span className="fp-desc">{F.blurb}</span>
                  <span className="fp-why">{ph.why}</span>
                  <span className="fp-from">From {inr(minPrice(f))}<i aria-hidden="true">→</i></span>
                </FilterLink>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="cmp-title">
        <div className="wrap">
          <div className="sec-head reveal">
            <div><h2 className="h2" id="cmp-title">See the difference</h2><p className="lede">The same photograph on two Britefoto finishes. Drag the line to compare, and move over the print to see how each surface catches the light.</p></div>
          </div>
          <div className="reveal"><FinishCompare /></div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <div><h2 className="h2">Best sellers</h2><p className="lede">What studios, labs and home printers reorder most.</p></div>
            <a className="more" href="#shop">View all photo paper</a>
          </div>
          <div className="grid reveal stagger">{BEST_SELLERS.map(id => <ProductCard key={id} p={byId[id]} />)}</div>
        </div>
      </section>

      {/* one section for the two physical choices: how big, and how thick */}
      <section className="sec" style={{ background: 'var(--stock)' }} aria-labelledby="size-title">
        <div className="wrap sizes">
          <div className="size-fig"><SizeFigure hl={hl} /></div>
          <div>
            <h2 className="h2" id="size-title">Size and thickness</h2>
            <p className="lede" style={{ margin: '8px 0 22px' }}>First pick a sheet size (drawn to the same scale), then how thick you want it. Each one opens the matching papers.</p>
            <h3 className="st-sub">Sheet size</h3>
            <ul className="size-list" onMouseLeave={() => setHl(null)}>
              {SIZES.map(s => {
                const n = PRODUCTS.filter(p => p.size === s.k).length;
                return (
                  <li key={s.k}>
                    <FilterLink filter={'size:' + s.k} onMouseEnter={() => setHl(s.k)} onFocus={() => setHl(s.k)}>
                      <b>{s.k === 'Roll' ? 'Rolls' : s.k}</b>
                      <span>
                        <span className="dims">{s.inch}{s.mm ? ` (${s.mm[0]} × ${s.mm[1]} mm)` : ''}</span>
                        <span className="use">{s.use}</span>
                      </span>
                      <span className="n">{n}{n === 1 ? ' paper' : ' papers'}</span>
                    </FilterLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="wrap">
          <div className="st-thick">
            <h3 className="st-sub">Thickness <span>GSM means grams per square metre: the higher the number, the thicker and sturdier the sheet.</span></h3>
            <div className="gsm-grid reveal stagger">
              {GSM.map(g => (
                <FilterLink key={g.k} className="gsm-item" filter={'gsm:' + g.k}>
                  <div className="edge"><i style={{ '--t': g.t + 'px' }} /></div>
                  <b>{g.label}</b><em className="feel">{g.feel}</em><span>{g.use}</span>
                </FilterLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head reveal"><div><h2 className="h2">Papers by the job</h2><p className="lede">Start from what you print. Each tag opens the matching papers.</p></div></div>
          <div className="jobs">
            {JOBS.map(j => (
              <div className="job reveal" key={j.h}>
                <span className="job-photo develop">
                  <img src={JOB_PHOTOS[j.h].src} srcSet={JOB_PHOTOS[j.h].srcSet} sizes="(max-width: 640px) 92vw, (max-width: 960px) 46vw, 400px"
                    alt={JOB_PHOTOS[j.h].alt} loading="lazy" decoding="async" width="600" height="400"
                    onError={e => { e.currentTarget.parentElement.style.display = 'none'; }} />
                </span>
                <h3>{j.h}</h3><p>{j.p}</p>
                <div className="chips">
                  {j.tags.map(([f, label]) => f
                    ? <FilterLink key={label} filter={f} className="chip">{label}</FilterLink>
                    : <a key={label} href="#product-sampler-kit" className="chip">{label}</a>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bulk-band">
        <div className="wrap bulk-in">
          <div>
            <h2 className="h2">Buying for a lab, studio or shop?</h2>
            <p>Order 5 or more packs of any paper and the cart applies a bulk discount automatically. For cartons, rolls, private-label packs or dealer pricing, send us your requirement and we will quote within one working day.</p>
            <a className="btn btn-white" href="#bulk">Request a bulk quote</a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="tiers">
              <thead><tr><th>Packs of one paper</th><th>Price</th><th>You save</th></tr></thead>
              <tbody>
                <tr><td><b>1 to 4</b></td><td>List price</td><td>None</td></tr>
                <tr><td><b>5 to 9</b></td><td>5% off</td><td className="save">5%</td></tr>
                <tr><td><b>10 or more</b></td><td>10% off</td><td className="save">10%</td></tr>
                <tr><td><b>Cartons</b></td><td>Dealer price</td><td>Ask for a quote</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* gallery break near the end: real photos on every finish */}
      <FinishRing variant="section" />

      <section className="sec">
        <div className="wrap">
          <div className="sec-head reveal"><div><h2 className="h2">Why printers choose Britefoto</h2></div></div>
          <div className="why reveal stagger">
            <div className="why-item"><h3><i style={{ '--sw': 'var(--c)' }} />Direct from the maker</h3><p>Britefoto manufactures the paper it sells, so you get the same stock every reorder at a direct price.</p></div>
            <div className="why-item"><h3><i style={{ '--sw': 'var(--m)' }} />Instant-dry coating</h3><p>The ink-receptive coating dries quickly to the touch, so prints can be stacked, sleeved and handed over sooner.</p></div>
            <div className="why-item"><h3><i style={{ '--sw': 'var(--y)', boxShadow: 'inset 0 0 0 1px rgba(21,23,46,.2)' }} />Sharp detail, deep blacks</h3><p>Coated surfaces hold ink on top of the sheet for accurate colour, smooth gradients and crisp edges.</p></div>
            <div className="why-item"><h3><i style={{ '--sw': 'var(--k)' }} />Ready for business</h3><p>GST invoices on every order, bulk discounts in the cart and dealer pricing for resellers.</p></div>
          </div>
          <div className="compat"><b>Works with your inkjet printer</b><span>Epson, Canon, HP and Brother</span><span>Dye and pigment inks</span><span>Desktop, lab and large-format models</span></div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }} aria-labelledby="faq-title">
        <div className="wrap faq-wrap">
          <div>
            <h2 className="h2" id="faq-title">Questions before you buy</h2>
            <p className="lede" style={{ marginTop: 8 }}>Not sure which paper is right? These are the questions we hear most.</p>
            <a className="more" href="#contact" style={{ display: 'inline-block', marginTop: 18 }}>Ask us something else</a>
          </div>
          <div className="faq reveal">
            {FAQS.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
