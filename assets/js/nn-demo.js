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
  // Colori: dal blu notte (classe 0) al verde (classe 1), passando per un grigio chiaro sul confine
  const VIRIDIS = [[5, 25, 45], [31, 76, 130], [214, 222, 232], [140, 220, 180], [52, 190, 120]];
  const viridis = p => {
    const x = Math.min(Math.max(p, 0), 1) * (VIRIDIS.length - 1), i = Math.min(Math.floor(x), VIRIDIS.length - 2), f = x - i;
    return VIRIDIS[i].map((v, k) => Math.round(v + (VIRIDIS[i + 1][k] - v) * f));
  };
  let data = [], net = [], opt = [], t = 0, epoch = 0, hist = [], running = false, done = false, kind = "circles", dpr = 1, started = false, lastAcc = null;

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

  const off = document.createElement("canvas"); off.width = GRID; off.height = GRID;
  const offCtx = off.getContext("2d");
  // Colore di sfondo del tema attuale (chiaro o scuro), per fondere i colori della previsione
  function paperColor() {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--paper-2").trim();
    const m = /^#([0-9a-f]{6})$/i.exec(v);
    return m ? [0, 2, 4].map(i => parseInt(m[1].substr(i, 2), 16)) : [236, 234, 243];
  }

  function draw() {
    const w = cv.width, h = cv.height;
    // Previsione della rete su una griglia GRID x GRID: disegnata in piccolo, poi ingrandita con sfumatura
    const img = offCtx.createImageData(GRID, GRID), bg = paperColor();
    for (let gy = 0; gy < GRID; gy++) for (let gx = 0; gx < GRID; gx++) {
      const x = -SPAN + 2 * SPAN * (gx + .5) / GRID, y = SPAN - 2 * SPAN * (gy + .5) / GRID;
      const p = forward(x, y, false), c = viridis(p), a = 0.62 + 0.38 * Math.abs(p - 0.5), o = (gy * GRID + gx) * 4;
      for (let k = 0; k < 3; k++) img.data[o + k] = Math.round(bg[k] + (c[k] - bg[k]) * a);
      img.data[o + 3] = 255;
    }
    offCtx.putImageData(img, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(off, 0, 0, w, h);
    for (const [x, y, lab] of data) {
      const px = (x + SPAN) / (2 * SPAN) * w, py = (SPAN - y) / (2 * SPAN) * h;
      ctx.beginPath(); ctx.arc(px, py, 3.4 * dpr, 0, 2 * Math.PI);
      ctx.fillStyle = lab ? "#3DD68C" : "#1F4C82"; ctx.fill();
      ctx.lineWidth = 1.3 * dpr; ctx.strokeStyle = lab ? "rgba(5,25,45,.85)" : "rgba(255,255,255,.95)"; ctx.stroke();
    }
    const lw = lc.width, lh = lc.height;
    lctx.clearRect(0, 0, lw, lh);
    if (hist.length > 1) {
      const max = Math.max(...hist);
      lctx.beginPath();
      hist.forEach((v, i) => { const px = i / (hist.length - 1) * lw, py = lh - 3 * dpr - (v / max) * (lh - 6 * dpr); i ? lctx.lineTo(px, py) : lctx.moveTo(px, py); });
      lctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--teal").trim() || "#0072e5";
      lctx.lineWidth = 2 * dpr; lctx.stroke();
    }
  }

  function label() {
    const lbl = btn.querySelector(".lbl");
    (lbl || btn).textContent = done ? UI[lang].again : running ? UI[lang].pause : UI[lang].start;
    btn.dataset.state = done ? "again" : running ? "pause" : "start";
  }
  // Annuncio per i lettori di schermo: solo a fine addestramento, non a ogni epoca
  const status = document.getElementById("nn-status");
  function announce(acc) { if (status) status.textContent = UI[lang].done + " " + Math.round(acc * 100) + "%"; }
  window.nnRefreshLabel = label;
  window.nnRedraw = () => draw();
  // Usati dalla vetrina: la scheda API chiede previsioni al modello, i test ne leggono lo stato
  window.nnApi = {
    predict: (x, y) => forward(x, y, false),
    stats: () => ({ epoch, loss: hist.length ? hist[hist.length - 1] : null, acc: lastAcc, dataset: kind, running, done }),
    ensureTraining: () => { if (!running && !done) start(); },
    resize: () => { size(); draw(); }
  };

  function frame() {
    if (!running) return;
    let r;
    for (let k = 0; k < STEPS_PER_FRAME; k++) r = step();
    hist.push(r.loss); if (hist.length > 400) hist = hist.filter((_, i) => i % 2 === 0);
    lastAcc = r.acc;
    stEpoch.textContent = epoch; stLoss.textContent = r.loss.toFixed(3); stAcc.textContent = Math.round(r.acc * 100) + "%";
    draw();
    if (epoch >= MAX_EPOCHS || r.loss < 0.015) { running = false; done = true; label(); announce(r.acc); return; }
    requestAnimationFrame(frame);
  }

  function start() { if (done) { init(); } running = true; started = true; label(); requestAnimationFrame(frame); }
  function stop() { running = false; label(); }
  function reset() { lastAcc = null; init(); stEpoch.textContent = "0"; stLoss.textContent = "–"; stAcc.textContent = "–"; draw(); if (!running) label(); }

  btn.addEventListener("click", () => running ? stop() : start());
  const resetBtn = document.getElementById("nn-reset");
  if (resetBtn) resetBtn.addEventListener("click", reset);
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
