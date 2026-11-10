import { useEffect, useState } from 'react';
import { FIN, FINISH_ORDER, FREE_SHIP, GSM, PRODUCTS, SHIP_FEE, SIZES, byId } from '../data/catalog';
import { finVars, fullName, gsmText, inr, off, packLabel, sizeText, tierRate } from '../lib/helpers';
import { useStore } from '../context/StoreContext';
import { Crumbs, FilterLink, FinishChip, Pack, ProductCard } from '../components/ui';
import { FINISH_PHOTOS, printPhotos } from '../components/hero/photos';

/* plain-English notes for printing terms, shown next to the spec */
const BASE_NOTE = {
  'RC (resin coated)': 'a water-resistant base, the same type photo labs use',
  'Metallic RC': 'a water-resistant base with a metallic layer under the coating',
  'Coated paper': 'smooth paper with a coating that holds the ink',
  'Cotton rag': 'soft, long-lasting cotton paper used for art prints',
  'Poly-cotton canvas': 'a woven fabric you can stretch over a frame',
};
const gsmFeel = g => GSM.find(b => g >= b.lo && g <= b.hi)?.feel;

function specRows(p, pk) {
  const F = FIN[p.finish], sz = SIZES.find(s => s.k === p.size);
  const sizeVal = p.kind === 'roll' ? p.roll : sz ? `${p.size}, ${sz.inch}${sz.mm ? ` (${sz.mm.join(' × ')} mm)` : ''}` : p.size;
  return [
    ['Finish', p.finish === 'Mixed' ? 'Glossy, luster, satin, pearl, metallic, matte, fine art and canvas' : p.finish],
    ['Weight', gsmText(p) + (p.gsm && gsmFeel(p.gsm) ? ` (${gsmFeel(p.gsm).toLowerCase()})` : '')],
    ['Size', sizeVal],
    ['Pack', packLabel(p, pk[0]) + (p.kind === 'kit' ? ' (2 sheets of each finish)' : '')],
    ['Base', BASE_NOTE[F.base] ? `${F.base}: ${BASE_NOTE[F.base]}` : F.base],
    ['Printable side', p.sides || 'One side'],
    ['Coating', p.finish === 'Canvas' ? 'Ink-receptive, water-resistant when dry' : 'Instant-dry, ink-receptive'],
    ['Ink', 'Dye and pigment inkjet inks'],
    ['Printers', p.kind === 'roll' ? 'Large-format inkjet printers' : 'Inkjet printers from Epson, Canon, HP and Brother'],
  ];
}

const MEDIA = {
  Glossy: 'Glossy or Premium Glossy Photo Paper', Luster: 'Premium Luster or Semi-Gloss Photo Paper', Satin: 'Premium Semi-Gloss or Satin Photo Paper',
  Pearl: 'Premium Semi-Gloss Photo Paper', Metallic: 'Premium Glossy Photo Paper', Matte: 'Matte or Premium Matte Paper',
  'Fine Art': 'Fine Art or Velvet Fine Art Paper', Canvas: 'Canvas or Matte paper', Mixed: 'the media type that matches each finish',
};
function tipsFor(p) {
  const t = [
    `In the printer dialog, set the paper type to ${MEDIA[p.finish]} and print quality to high.`,
    'Print on the bright white coated side. ' + (p.sides ? 'This paper can be printed on both sides.' : 'The back has no coating.'),
    'Let prints dry for a few minutes before stacking or framing.',
  ];
  if (p.kind === 'roll') t.push('Load the roll with the coated side facing the print head, and set the roll width in the driver.');
  if (p.finish === 'Fine Art') t.push('Handle by the edges. Textured fine art surfaces mark easily before the ink dries.');
  return t;
}

const TIERS = [[1, 4, 0], [5, 9, 0.05], [10, 999, 0.1]];

/* Light follows the pointer across a print, and the print tilts a little,
   so the visitor can see how this surface catches light. */
function lightFollow(e) {
  if (e.pointerType === 'touch') return;
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
  el.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
  el.style.setProperty('--rx', ((0.5 - y) * 6).toFixed(2) + 'deg');
  el.style.setProperty('--ry', ((x - 0.5) * 8).toFixed(2) + 'deg');
  el.classList.add('lit');
}
function lightOff(e) {
  const el = e.currentTarget;
  el.classList.remove('lit');
  ['--gx', '--gy', '--rx', '--ry'].forEach(v => el.style.removeProperty(v));
}

/* A real photograph printed on this finish: white paper border, the
   paper's texture and sheen, and a choice of three photos that suit it. */
function PaperPrint({ finish, photos, n, setN }) {
  const ph = photos[n];
  return (
    <div className="pp">
      <figure className="pp-print" onPointerMove={lightFollow} onPointerLeave={lightOff}>
        <span className="pp-img">
          <img key={ph.src} src={ph.src} srcSet={ph.srcSet} sizes="(max-width: 960px) 70vw, 420px" alt={`${ph.alt}, printed on ${finish.toLowerCase()} paper`} decoding="async" />
          <span className="pp-tex" />
          <span className="pp-sheen" />
          <span className="pp-glare" />
        </span>
        <figcaption>{finish}</figcaption>
      </figure>
    </div>
  );
}

/* Sampler kit: the same idea for all eight finishes at once. */
function KitPrints() {
  return (
    <div className="kit-prints">
      {FINISH_ORDER.map(f => {
        const ph = FINISH_PHOTOS[f];
        return (
          <figure key={f} className={'kp fx ' + FIN[f].cls} style={finVars(f)} onPointerMove={lightFollow} onPointerLeave={lightOff}>
            <span className="pp-img">
              <img src={ph.src} alt={ph.alt} loading="lazy" decoding="async" />
              <span className="pp-tex" /><span className="pp-sheen" /><span className="pp-glare" />
            </span>
            <figcaption>{f}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}

export default function Product({ id }) {
  const { addToCart, hideToast, go } = useStore();
  const p = byId[id];
  const [sel, setSel] = useState(0);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState('pack');
  const [photoN, setPhotoN] = useState(0);

  useEffect(() => { if (p) document.title = fullName(p) + ' | Britefoto'; }, [p]);

  if (!p) {
    return (
      <div className="view"><div className="wrap">
        <div className="empty" style={{ marginBlock: 48 }}>
          <h2>We couldn’t find that paper</h2><p>It may have been renamed or removed.</p>
          <a className="btn btn-blue" href="#shop">Browse all photo paper</a>
        </div>
      </div></div>
    );
  }

  const F = FIN[p.finish];
  const pk = p.packs[sel], rate = tierRate(qty), unit = pk[1] * (1 - rate);
  const related = PRODUCTS.filter(x => x.id !== p.id && (x.finish === p.finish || x.size === p.size)).slice(0, 4);
  const clampQty = v => Math.max(1, Math.min(999, v));

  const photos = printPhotos(p.finish);
  const thumbs = [{ v: 'pack', label: 'Pack', inner: <i className="t-pack" /> }];
  if (p.finish === 'Mixed') {
    thumbs.push({ v: 'kit', label: 'All 8', inner: <><i className="t-surface" /><img className="t-photo" src={printPhotos('Glossy')[0].thumb} alt="" /></> });
  } else {
    thumbs.push({ v: 'sample', label: 'On paper', inner: <><i className="t-surface" /><img className="t-photo" src={photos[0].thumb} alt="" /></> });
    thumbs.push({ v: 'surface', label: 'Surface', inner: <i className="t-surface" /> });
  }

  return (
    <div className="view"><div className="wrap">
      <Crumbs items={[
        <a href="#home">Home</a>,
        <a href="#shop">Shop</a>,
        ...(p.finish !== 'Mixed' ? [<FilterLink filter={'finish:' + p.finish}>{p.finish}</FilterLink>] : []),
        <span>{p.name}</span>,
      ]} />
      <div className="pdp">
        <div className={'gallery fx ' + F.cls} style={finVars(p.finish)}>
          <div className="stagebox">
            {view === 'pack' && <Pack p={p} />}
            {view === 'surface' && <div className="surface" />}
            {view === 'sample' && <PaperPrint finish={p.finish} photos={photos} n={photoN} setN={setPhotoN} />}
            {view === 'kit' && <KitPrints />}
          </div>
          {view === 'sample' && (
            <div className="pp-bar">
              <div className="pp-pick" role="group" aria-label="Choose a photo">
                {photos.map((ph, i) => (
                  <button key={ph.src} type="button" aria-pressed={photoN === i} aria-label={ph.alt} onClick={() => setPhotoN(i)}>
                    <img src={ph.thumb} alt="" />
                  </button>
                ))}
              </div>
              <p>{photoN === 0 ? FINISH_PHOTOS[p.finish].why : `${photos[photoN].alt}, printed on ${p.finish.toLowerCase()}.`}
                <span className="pp-hint"> Move over the print to see how it catches the light.</span></p>
            </div>
          )}
          {view === 'kit' && <p className="pp-note">One photo on each finish. Move over a print to compare how the surfaces catch light.</p>}
          <div className="thumbs" role="group" aria-label="Product views">
            {thumbs.map(t => (
              <button key={t.v} type="button" aria-pressed={view === t.v} onClick={() => setView(t.v)}>{t.inner}<span>{t.label}</span></button>
            ))}
          </div>
        </div>

        <div className="buy">
          <div className="chips">
            <FinishChip p={p} /><span className="chip">{gsmText(p)}</span><span className="chip">{sizeText(p)}</span>
            {p.best ? <span className="chip" style={{ background: 'var(--ink)', color: '#fff' }}>Best seller</span> : null}
          </div>
          <h1>{fullName(p)}</h1>
          <p className="desc">
            {p.kind === 'kit'
              ? 'Two A4 sheets of each Britefoto finish: glossy, luster, satin, pearl, metallic, matte, fine art and canvas. Print the same photo on all eight and choose the one you like before buying a full pack.'
              : `${F.long} Popular for ${p.uses.join(', ').toLowerCase()}.`}
          </p>
          <div className="price">
            <b>{inr(unit)}</b><s>{inr(pk[2])}</s><span className="off">{off(unit, pk[2])}% off</span>
            <span className="from">per pack of {packLabel(p, pk[0])}{p.unit === 'roll' ? '' : `, ₹${(unit / pk[0]).toFixed(2)} a sheet`}</span>
          </div>
          <p className="tax">Inclusive of GST. GST invoice available at checkout.</p>
          {p.packs.length > 1 ? (
            <fieldset className="opt"><legend>Pack size</legend>
              <div className="packs">
                {p.packs.map((k, i) => (
                  <label key={i}>
                    <input type="radio" name="pack" value={i} checked={sel === i} onChange={() => setSel(i)} />
                    <span><b>{packLabel(p, k[0])}</b><small>{inr(k[1])}{p.unit === 'roll' ? '' : `, ₹${(k[1] / k[0]).toFixed(2)} a sheet`}</small></span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : <p style={{ marginTop: 18, fontWeight: 600 }}>Pack: {packLabel(p, p.packs[0][0])}</p>}
          <div className="buy-row">
            <div className="qty">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty(q => clampQty(q - 1))}>−</button>
              <input type="number" min="1" max="999" aria-label="Quantity" key={qty} defaultValue={qty}
                onBlur={e => setQty(clampQty(parseInt(e.target.value, 10) || 1))}
                onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }} />
              <button type="button" aria-label="Increase quantity" onClick={() => setQty(q => clampQty(q + 1))}>+</button>
            </div>
            <button className="btn btn-blue" type="button" onClick={() => addToCart(p.id, sel, qty)}>Add to cart</button>
            <button className="btn btn-red" type="button" onClick={() => { addToCart(p.id, sel, qty); hideToast(); go('checkout'); }}>Buy now</button>
          </div>
          <div className="mini-tiers">
            <table className="tiers">
              <thead><tr><th>Packs</th><th>Price per pack</th><th>Saving</th></tr></thead>
              <tbody>
                {TIERS.map(t => (
                  <tr key={t[0]} className={qty >= t[0] && qty <= t[1] ? 'on' : ''}>
                    <td><b>{t[0]}{t[1] < 999 ? ' to ' + t[1] : ' or more'}</b></td>
                    <td>{inr(pk[1] * (1 - t[2]))}</td>
                    <td className={t[2] ? 'save' : ''}>{t[2] ? Math.round(t[2] * 100) + '%' : 'List price'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ship-note">
            <span><b>Dispatched in 1 to 2 working days</b> from our warehouse, delivered across India.</span>
            <span><b>Free delivery</b> on orders over {inr(FREE_SHIP)}, otherwise {inr(SHIP_FEE)}.</span>
            <span><b>Damaged in transit?</b> Send a photo within 48 hours and we replace it.</span>
          </div>
        </div>
      </div>

      <div className="details">
        <div>
          <h2>Specifications</h2>
          <table className="spec"><tbody>
            {specRows(p, pk).map(r => <tr key={r[0]}><th scope="row">{r[0]}</th><td>{r[1]}</td></tr>)}
          </tbody></table>
        </div>
        <div>
          <h2>Best for</h2>
          <div className="best-for">{p.uses.map(u => <span key={u}>{u}</span>)}</div>
          <h2>Printing tips</h2>
          <ul className="tips">{tipsFor(p).map(t => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="sec" style={{ paddingTop: 24 }}>
          <div className="sec-head"><h2 className="h2">You might also need</h2></div>
          <div className="grid">{related.map(r => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}
    </div></div>
  );
}
