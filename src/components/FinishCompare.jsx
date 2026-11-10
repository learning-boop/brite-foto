import { useRef, useState } from 'react';
import { FIN, FINISH_ORDER } from '../data/catalog';
import { finVars, inr, minPrice } from '../lib/helpers';
import { FINISH_PHOTOS } from './hero/photos';
import { FilterLink } from './ui';
import './finish-compare.css';

/* Compare two finishes on the same photograph. Drag the divider (or use
   the arrow keys) to wipe between them; move the mouse over the print and
   a light follows it, so glossy flares while matte stays calm. */

const crop = (id, w, x = '') =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w / 1.5)}&q=80${x}`;

// wide crops of tall photos: keep the subject in frame (frame the macaw's head)
const FOCUS = { Glossy: '&crop=focalpoint&fp-x=.55&fp-y=.34' };

const PHOTOS = ['Glossy', 'Metallic', 'Matte'].map(f => {
  const ph = FINISH_PHOTOS[f], x = FOCUS[f] || '';
  return {
    src: crop(ph.id, 1100, x),
    srcSet: `${crop(ph.id, 700, x)} 700w, ${crop(ph.id, 1100, x)} 1100w, ${crop(ph.id, 1600, x)} 1600w`,
    thumb: crop(ph.id, 160, x),
    alt: ph.alt,
  };
});

function Side({ finish, photo, clip }) {
  return (
    <div className={'cmp-side fx ' + FIN[finish].cls} style={{ ...finVars(finish), clipPath: clip }}>
      <img src={photo.src} srcSet={photo.srcSet} sizes="(max-width: 1272px) 92vw, 1180px" alt="" decoding="async" draggable="false" />
      <span className="cmp-tex" />
      <span className="cmp-sheen" />
      <span className="cmp-glare" />
    </div>
  );
}

function Picker({ label, value, other, onChange }) {
  return (
    <div className="cmp-pick" role="radiogroup" aria-label={label}>
      <span className="cmp-pick-label">{label}</span>
      <div className="cmp-chips">
        {FINISH_ORDER.map(f => (
          <button
            key={f}
            type="button"
            role="radio"
            aria-checked={value === f}
            disabled={other === f}
            className="cmp-chip"
            style={finVars(f)}
            onClick={() => onChange(f)}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FinishCompare() {
  const [left, setLeft] = useState('Glossy');
  const [right, setRight] = useState('Matte');
  const [pos, setPos] = useState(50);
  const [n, setN] = useState(0);
  const frame = useRef(null);
  const photo = PHOTOS[n];

  const light = e => {
    if (e.pointerType === 'touch') return;
    const r = frame.current.getBoundingClientRect();
    frame.current.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    frame.current.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  };

  return (
    <div className="cmp">
      <div className="cmp-frame" ref={frame} onPointerMove={light}>
        <Side finish={left} photo={photo} />
        <Side finish={right} photo={photo} clip={`inset(0 0 0 ${pos}%)`} />
        <span className="cmp-tag cmp-tag-l">{left}</span>
        <span className="cmp-tag cmp-tag-r">{right}</span>
        <span className="cmp-line" style={{ left: pos + '%' }} aria-hidden="true">
          <span className="cmp-knob">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6-6 6 6 6M15 6l6 6-6 6" /></svg>
          </span>
        </span>
        <input
          className="cmp-range"
          type="range"
          min="0"
          max="100"
          step="1"
          value={pos}
          onChange={e => setPos(+e.target.value)}
          aria-label={`Compare ${left} (left) with ${right} (right). Slide to reveal more of either finish.`}
          aria-valuetext={`${Math.round(100 - pos)}% ${right}`}
        />
      </div>

      <div className="cmp-info">
        <div className="cmp-side-info">
          <b>{left}</b><span>{FIN[left].blurb}</span>
          <FilterLink filter={'finish:' + left}>Shop {left.toLowerCase()} from {inr(minPrice(left))}</FilterLink>
        </div>
        <div className="cmp-photos" role="group" aria-label="Choose a photo">
          {PHOTOS.map((p, i) => (
            <button key={p.src} type="button" aria-pressed={n === i} aria-label={p.alt} onClick={() => setN(i)}>
              <img src={p.thumb} alt="" />
            </button>
          ))}
        </div>
        <div className="cmp-side-info cmp-side-info-r">
          <b>{right}</b><span>{FIN[right].blurb}</span>
          <FilterLink filter={'finish:' + right}>Shop {right.toLowerCase()} from {inr(minPrice(right))}</FilterLink>
        </div>
      </div>

      <div className="cmp-pickers">
        <Picker label="Left" value={left} other={right} onChange={setLeft} />
        <Picker label="Right" value={right} other={left} onChange={setRight} />
      </div>
    </div>
  );
}
