/*
 * Demo: una piccola rete neurale che si addestra dal vivo nel browser.
 * Architettura 2 -> 16 -> 16 -> 1, attivazioni tanh, uscita sigmoide,
 * loss di entropia incrociata binaria, ottimizzatore Adam, full batch.
 * Nessuna libreria: forward pass, backpropagation e aggiornamento dei pesi sono scritti a mano.
 * Usa le variabili globali `lang` e `UI` definite in i18n.js.
 */

(function () {
  const cv = document.getElementById("nn-canvas"), ctx = cv.getContext("2d");
  const lc = document.getElementById("nn-loss"), lctx = lc.getContext("2d");
  const btn = document.getElementById("nn-toggle");
  const stEpoch = document.getElementById("st-epoch"), stLoss = document.getElementById("st-loss"), stAcc = document.getElementById("st-acc");
  const SIZES = [2, 16, 16, 1], MAX_EPOCHS = 3000, STEPS_PER_FRAME = 2, GRID = 50, SPAN = 1.15;
  const C0 = [47, 98, 168], C1 = [227, 162, 26];
  let data = [], net = [], opt = [], t = 0, epoch = 0, hist = [], running = false, done = false, kind = "circles", dpr = 1, started = false;

  const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  function makeData(k) {
    const d = [], n = 240;
    for (let i = 0; i < n; i++) {
      const lab = i % 2;
      if (k === "circles") {
        const r = lab ? Math.random() * 0.45 : 0.68 + Math.random() * 0.3, a = Math.random() * 2 * Math.PI;
        d.push([r * Math.cos(a) + gauss() * 0.04, r * Math.sin(a) + gauss() * 0.04, lab]);
      } else if (k === "xor") {
        const sx = Math.random() < .5 ? -1 : 1, sy = Math.random() < .5 ? -1 : 1;
        const x = sx * (0.1 + Math.random() * 0.85), y = sy * (0.1 + Math.random() * 0.85);
        d.push([x, y, x * y > 0 ? 1 : 0]);
      } else {
        const s = (i >> 1) / (n / 2), r = 0.08 + s * 0.9, a = s * 3 * Math.PI + lab * Math.PI;
        d.push([r * Math.cos(a) + gauss() * 0.03, r * Math.sin(a) + gauss() * 0.03, lab]);
      }
    }
    return d;
  }

  function init() {
    net = []; opt = [];
    for (let l = 0; l < SIZES.length - 1; l++) {
      const nin = SIZES[l], nout = SIZES[l + 1], s = Math.sqrt(1 / nin);
      const W = new Float64Array(nin * nout); for (let k = 0; k < W.length; k++) W[k] = gauss() * s;
      net.push({ W, b: new Float64Array(nout), nin, nout });
      opt.push({ mW: new Float64Array(nin * nout), vW: new Float64Array(nin * nout), mb: new Float64Array(nout), vb: new Float64Array(nout) });
    }
    t = 0; epoch = 0; hist = []; done = false;
  }

  function forward(x, y, keep) {
    let a = [x, y]; const acts = keep ? [a] : null;
    for (let l = 0; l < net.length; l++) {
      const L = net[l], out = new Array(L.nout), last = l === net.length - 1;
      for (let j = 0; j < L.nout; j++) {
        let z = L.b[j]; const o = j * L.nin;
        for (let i = 0; i < L.nin; i++) z += L.W[o + i] * a[i];
        out[j] = last ? 1 / (1 + Math.exp(-z)) : Math.tanh(z);
      }
      a = out; if (keep) acts.push(a);
    }
    return keep ? acts : a[0];
  }

  function step() {
    const gW = net.map(L => new Float64Array(L.W.length)), gb = net.map(L => new Float64Array(L.nout));
    let loss = 0, correct = 0;
    for (const [x, y, lab] of data) {
      const acts = forward(x, y, true), p = acts[acts.length - 1][0];
      loss -= lab * Math.log(p + 1e-9) + (1 - lab) * Math.log(1 - p + 1e-9);
      if ((p > 0.5 ? 1 : 0) === lab) correct++;
      let delta = [p - lab];
      for (let l = net.length - 1; l >= 0; l--) {
        const L = net[l], ain = acts[l];
        for (let j = 0; j < L.nout; j++) {
          gb[l][j] += delta[j]; const o = j * L.nin;
          for (let i = 0; i < L.nin; i++) gW[l][o + i] += delta[j] * ain[i];
        }
        if (l > 0) {
          const nd = new Array(L.nin);
          for (let i = 0; i < L.nin; i++) {
            let s = 0; for (let j = 0; j < L.nout; j++) s += L.W[j * L.nin + i] * delta[j];
            nd[i] = s * (1 - ain[i] * ain[i]);
          }
          delta = nd;
        }
      }
    }
    const n = data.length, lr = 0.003, b1 = 0.9, b2 = 0.999; t++;
    const c1 = 1 - Math.pow(b1, t), c2 = 1 - Math.pow(b2, t);
    const upd = (P, G, M, V) => { for (let k = 0; k < P.length; k++) { const g = G[k] / n; M[k] = b1 * M[k] + (1 - b1) * g; V[k] = b2 * V[k] + (1 - b2) * g * g; P[k] -= lr * (M[k] / c1) / (Math.sqrt(V[k] / c2) + 1e-8); } };
    for (let l = 0; l < net.length; l++) { upd(net[l].W, gW[l], opt[l].mW, opt[l].vW); upd(net[l].b, gb[l], opt[l].mb, opt[l].vb); }
    epoch++;
    return { loss: loss / n, acc: correct / n };
  }

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(cv.clientWidth * dpr); cv.height = Math.round(cv.clientWidth * dpr);
    lc.width = Math.round(lc.clientWidth * dpr); lc.height = Math.round(lc.clientHeight * dpr);
  }

  function draw() {
    const w = cv.width, h = cv.height, cw = w / GRID, ch = h / GRID;
    ctx.clearRect(0, 0, w, h);
    for (let gy = 0; gy < GRID; gy++) for (let gx = 0; gx < GRID; gx++) {
      const x = -SPAN + 2 * SPAN * (gx + .5) / GRID, y = SPAN - 2 * SPAN * (gy + .5) / GRID;
      const p = forward(x, y, false), c = C0.map((v, i) => Math.round(v + (C1[i] - v) * p));
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.12 + 0.55 * Math.abs(p - 0.5)})`;
      ctx.fillRect(Math.floor(gx * cw), Math.floor(gy * ch), Math.ceil(cw) + 1, Math.ceil(ch) + 1);
    }
    for (const [x, y, lab] of data) {
      const px = (x + SPAN) / (2 * SPAN) * w, py = (SPAN - y) / (2 * SPAN) * h;
      ctx.beginPath(); ctx.arc(px, py, 3.4 * dpr, 0, 2 * Math.PI);
      ctx.fillStyle = lab ? "#E3A21A" : "#2F62A8"; ctx.fill();
      ctx.lineWidth = 1.2 * dpr; ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.stroke();
    }
    const lw = lc.width, lh = lc.height;
    lctx.clearRect(0, 0, lw, lh);
    if (hist.length > 1) {
      const max = Math.max(...hist);
      lctx.beginPath();
      hist.forEach((v, i) => { const px = i / (hist.length - 1) * lw, py = lh - 3 * dpr - (v / max) * (lh - 6 * dpr); i ? lctx.lineTo(px, py) : lctx.moveTo(px, py); });
      lctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--steel").trim() || "#2F62A8";
      lctx.lineWidth = 2 * dpr; lctx.stroke();
    }
  }

  function label() { btn.textContent = done ? UI[lang].again : running ? UI[lang].pause : UI[lang].start; }
  window.nnRefreshLabel = label;

  function frame() {
    if (!running) return;
    let r;
    for (let k = 0; k < STEPS_PER_FRAME; k++) r = step();
    hist.push(r.loss); if (hist.length > 400) hist = hist.filter((_, i) => i % 2 === 0);
    stEpoch.textContent = epoch; stLoss.textContent = r.loss.toFixed(3); stAcc.textContent = Math.round(r.acc * 100) + "%";
    draw();
    if (epoch >= MAX_EPOCHS || r.loss < 0.015) { running = false; done = true; label(); return; }
    requestAnimationFrame(frame);
  }

  function start() { if (done) { init(); } running = true; started = true; label(); requestAnimationFrame(frame); }
  function stop() { running = false; label(); }
  function reset() { init(); stEpoch.textContent = "0"; stLoss.textContent = "–"; stAcc.textContent = "–"; draw(); if (!running) label(); }

  btn.addEventListener("click", () => running ? stop() : start());
  document.getElementById("nn-reset").addEventListener("click", reset);
  document.querySelectorAll("[data-ds]").forEach(b => b.addEventListener("click", () => {
    kind = b.dataset.ds;
    document.querySelectorAll("[data-ds]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    data = makeData(kind); reset();
    if (!running) start();
  }));
  window.addEventListener("resize", () => { size(); draw(); });

  data = makeData(kind); init(); size(); draw(); label();

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && "IntersectionObserver" in window) {
    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting && !started) { start(); obs.disconnect(); }
    }, { threshold: 0.4 }).observe(cv);
  }
})();
