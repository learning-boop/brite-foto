/* Procedural landscape "photos" used on pack mockups and finish swatches,
   and as an offline fallback for the hero photography. */

export const SCENES = [
  {sky:["#1d1a8a","#5b1fa6","#d9168c","#ff6a3d","#ffc845"], sun:"#fff4c2", sunX:.64, sunY:.5, hills:["#a0459a","#6e2588","#43166d","#1d0b42"], water:["#ff8a4a","#9f1a7c","#1b0f4a"], seed:7},
  {sky:["#05407a","#0a7fc4","#41c3f0","#bfeeff","#fff8dc"], sun:"#ffffff", sunX:.3, sunY:.46, hills:["#7cc0cf","#3e8f9c","#1b6670","#0a3438"], water:["#9fe2f5","#2a8fb0","#0b3a52"], seed:21},
  {sky:["#e8502a","#ff9b3d","#ffd25a","#fff2b8"], sun:"#fffbe6", sunX:.5, sunY:.48, hills:["#d49a4a","#9a6f24","#5e4a16","#2d2a0e"], water:["#ffd27a","#d2702e","#4a2a10"], seed:33},
  {sky:["#0a0c45","#2b1a7d","#8a1f8f","#e8316f","#ff9a6a"], sun:"#ffd9e8", sunX:.74, sunY:.56, hills:["#7a3a9a","#4b2378","#2a1252","#0e0726"], water:["#e8558a","#5a1f7a","#0a0626"], seed:57}
];

function rng(seed) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; }

export function drawScene(ctx, W, H, s) {
  const r = rng(s.seed), horizon = H * .64;
  const g = ctx.createLinearGradient(0, 0, 0, horizon);
  s.sky.forEach((c, i) => g.addColorStop(i / (s.sky.length - 1), c));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, horizon + 2);
  const sx = W * s.sunX, sy = H * s.sunY, sr = Math.min(W, H) * .085;
  const rg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 7);
  rg.addColorStop(0, rgba(s.sun, .9)); rg.addColorStop(.16, rgba(s.sun, .35)); rg.addColorStop(1, rgba(s.sun, 0));
  ctx.fillStyle = rg; ctx.fillRect(0, 0, W, horizon);
  ctx.fillStyle = s.sun; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 7; i++) { ctx.fillStyle = rgba('#ffffff', .05 + r() * .09); ctx.beginPath(); ctx.ellipse(W * r(), H * (.08 + r() * .32), W * (.1 + r() * .22), H * (.008 + r() * .014), 0, 0, Math.PI * 2); ctx.fill(); }
  function ridge(L) {
    const pts = [], base = horizon - H * (.2 - L * .045), amp = H * (.11 - L * .02), f1 = 1.5 + r() * 2, f2 = 4 + r() * 4, f3 = 9 + r() * 6, p1 = r() * 6, p2 = r() * 6, p3 = r() * 6;
    for (let x = 0; x <= W; x += W / 120) { const u = x / W; const y = Math.sin(u * f1 * Math.PI + p1) * .55 + Math.sin(u * f2 * Math.PI + p2) * .3 + Math.sin(u * f3 * Math.PI + p3) * .15; pts.push([x, base - amp * (.5 + .5 * y)]); }
    return pts;
  }
  const ridges = []; for (let L = 0; L < s.hills.length; L++) ridges.push(ridge(L));
  function fillRidge(pts, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, horizon + 1); pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(W, horizon + 1); ctx.closePath(); ctx.fill(); }
  ridges.forEach((p, L) => fillRidge(p, s.hills[L]));
  const wg = ctx.createLinearGradient(0, horizon, 0, H);
  s.water.forEach((c, i) => wg.addColorStop(i / (s.water.length - 1), c));
  ctx.fillStyle = wg; ctx.fillRect(0, horizon, W, H - horizon);
  ctx.save(); ctx.globalAlpha = .42; ctx.translate(0, horizon * 2); ctx.scale(1, -1);
  ridges.forEach((p, L) => fillRidge(p, s.hills[L]));
  ctx.restore();
  for (let i = 0; i < 70; i++) { const yy = horizon + (H - horizon) * Math.pow(r(), 1.4), w = sr * (.4 + r() * 1.8) * (1 + (yy - horizon) / (H - horizon)); ctx.fillStyle = rgba(s.sun, .12 + r() * .4 * (1 - (yy - horizon) / (H - horizon))); ctx.fillRect(sx - w / 2 + (r() - .5) * sr * .8, yy, w, 1 + r() * 2); }
  for (let i = 0; i < 46; i++) { const ly = horizon + (H - horizon) * r(); ctx.fillStyle = rgba('#ffffff', .04 + r() * .06); ctx.fillRect(W * r() - W * .1, ly, W * (.05 + r() * .25), 1); }
  const bx = W * .24, by = horizon + H * .12, bs = W * .06;
  ctx.fillStyle = 'rgba(10,6,30,.85)';
  ctx.beginPath(); ctx.moveTo(bx - bs, by); ctx.lineTo(bx + bs, by); ctx.lineTo(bx + bs * .7, by + bs * .28); ctx.lineTo(bx - bs * .75, by + bs * .28); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(bx - bs * .05, by - bs * 1.5); ctx.lineTo(bx - bs * .05, by - bs * .05); ctx.lineTo(bx + bs * .85, by - bs * .05); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(10,6,30,.25)'; ctx.fillRect(bx - bs * .9, by + bs * .3, bs * 1.7, bs * .9);
  ctx.strokeStyle = 'rgba(15,8,35,.75)'; ctx.lineWidth = Math.max(1, W / 500); ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) { const gx = sx - W * .2 + r() * W * .15, gy = sy - H * (.12 + r() * .12), gw = W * (.008 + r() * .01); ctx.beginPath(); ctx.moveTo(gx - gw, gy - gw * .5); ctx.quadraticCurveTo(gx - gw * .4, gy - gw * .7, gx, gy); ctx.quadraticCurveTo(gx + gw * .4, gy - gw * .7, gx + gw, gy - gw * .5); ctx.stroke(); }
  const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .75);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,20,.32)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

/** Data URLs of each scene, filled by makeImages(). */
export const sceneUrls = [];

/** Renders every scene once and exposes it as --img0..--img3 on :root. */
export function makeImages() {
  const root = document.documentElement.style;
  SCENES.forEach((s, i) => {
    const c = document.createElement('canvas'); c.width = 640; c.height = 480;
    drawScene(c.getContext('2d'), 640, 480, s);
    let url = '';
    try { url = c.toDataURL('image/jpeg', .86); } catch { url = ''; }
    sceneUrls[i] = url;
    if (url) root.setProperty('--img' + i, `url("${url}")`);
  });
}
