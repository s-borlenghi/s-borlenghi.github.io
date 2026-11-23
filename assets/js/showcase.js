/*
 * Vetrina delle competenze nella card di apertura: tre schede.
 *  AI  – la rete neurale che si addestra (nn-demo.js)
 *  API – esempio FastAPI e una richiesta POST /predict simulata, la cui risposta
 *        è calcolata dalla rete che si sta addestrando nel browser
 *  Dati – esempio di analisi con Pandas e un pulsante che analizza davvero le previsioni
 *         della rete: matrice di confusione, accuratezza ed errori
 *  Requisiti – una user story modificabile con la verifica dal vivo della Definition of Ready
 * Usa la variabile globale `lang` definita in i18n.js.
 */
(function () {
  const T = {
    it: { range: "Il valore deve essere compreso tra -1 e 1", number: "Il valore deve essere un numero",
          running: "Analisi in corso…", label: "classe", pred: "previsione", acc: "Accuratezza", errors: "Errori",
          of: "su", points: "punti", epoch: "epoca", done: "Analisi completata",
          as: "Come", want: "voglio", so: "così che", ready: "Pronta per lo sviluppo", review: "Da rivedere",
          item: "punto", items: "punti", found: "trovato", q: ["«", "»"], ok: "superato", ko: "da rivedere",
          vague: ["veloce", "velocemente", "rapido", "rapida", "rapidamente", "semplice", "semplicemente", "facile", "facilmente",
                  "intuitivo", "intuitiva", "migliore", "migliorare", "ottimizzare", "ottimale", "moderno", "moderna",
                  "efficiente", "flessibile", "user-friendly", "bello", "bella"] },
    en: { range: "Input should be between -1 and 1", number: "Input should be a valid number",
          running: "Running analysis…", label: "label", pred: "predicted", acc: "Accuracy", errors: "Errors",
          of: "of", points: "points", epoch: "epoch", done: "Analysis complete",
          as: "As a", want: "I want to", so: "so that", ready: "Ready for development", review: "Needs work",
          item: "item", items: "items", found: "found", q: ["“", "”"], ok: "passed", ko: "needs work",
          vague: ["fast", "quick", "quickly", "simple", "simply", "easy", "easily", "intuitive", "better", "improve",
                  "optimize", "optimal", "modern", "efficient", "flexible", "user-friendly", "seamless", "nice"] }
  }[lang === "en" ? "en" : "it"];

  /* ---------- Schede accessibili (frecce, Home, Fine) ---------- */
  const tabs = [...document.querySelectorAll('.showcase [role="tab"]')];
  const panels = tabs.map(t => document.getElementById(t.getAttribute("aria-controls")));
  function select(i, focus) {
    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      panels[k].hidden = !on;
    });
    if (focus) tabs[i].focus();
    if (i === 0 && window.nnApi) window.nnApi.resize();
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(i, false));
    t.addEventListener("keydown", e => {
      const n = tabs.length;
      const k = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
      if (k !== undefined) { e.preventDefault(); select(k, true); }
    });
  });

  /* ---------- API: POST /predict ---------- */
  const out = document.getElementById("api-resp");
  const ix = document.getElementById("api-x"), iy = document.getElementById("api-y");
  const esc = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  // JSON con colori, come in un client API
  function pretty(obj) {
    return esc(JSON.stringify(obj, null, 2))
      .replace(/("[^"]+")(:)/g, '<span class="k">$1</span>$2')
      .replace(/: ("[^"]*")/g, ': <span class="s">$1</span>')
      .replace(/: (-?\d+(\.\d+)?)/g, ': <span class="n">$1</span>');
  }
  function validate(name, raw) {
    const v = raw.trim() === "" ? NaN : Number(raw.replace(",", "."));
    if (Number.isNaN(v)) return { type: "float_parsing", loc: ["body", name], msg: T.number, input: raw };
    if (v < -1) return { type: "greater_than_equal", loc: ["body", name], msg: T.range, input: v };
    if (v > 1) return { type: "less_than_equal", loc: ["body", name], msg: T.range, input: v };
    return null;
  }
  function send() {
    if (!out || !window.nnApi) return;
    const errors = [validate("x", ix.value), validate("y", iy.value)].filter(Boolean);
    const t0 = performance.now();
    if (errors.length) {
      out.innerHTML = '<span class="st err">HTTP/1.1 422 Unprocessable Entity</span>\n' + pretty({ detail: errors });
      return;
    }
    const x = Number(ix.value.replace(",", ".")), y = Number(iy.value.replace(",", "."));
    window.nnApi.ensureTraining();
    const p = window.nnApi.predict(x, y), st = window.nnApi.stats();
    const ms = Math.max(performance.now() - t0, 0.01).toFixed(2);
    out.innerHTML = `<span class="st ok">HTTP/1.1 200 OK</span> <span class="c">· ${ms} ms</span>\n` +
      pretty({ class: p > 0.5 ? 1 : 0, probability: Math.round(p * 1000) / 1000, model: { dataset: st.dataset, epoch: st.epoch } });
  }
  const sendBtn = document.getElementById("api-send");
  if (sendBtn) sendBtn.addEventListener("click", send);
  [ix, iy].forEach(el => el && el.addEventListener("keydown", e => { if (e.key === "Enter") send(); }));
  const rnd = document.getElementById("api-random");
  if (rnd) rnd.addEventListener("click", () => {
    ix.value = (Math.round((Math.random() * 2 - 1) * 10) / 10).toFixed(1);
    iy.value = (Math.round((Math.random() * 2 - 1) * 10) / 10).toFixed(1);
    send();
  });

  /* ---------- Dati: analisi delle previsioni del modello ---------- */
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const runBtn = document.getElementById("data-run");
  const summary = document.getElementById("data-summary");
  const dout = document.getElementById("data-out");
  async function analyze() {
    if (!window.nnApi || !window.nnApi.data || !dout) return;
    runBtn.disabled = true;
    summary.textContent = T.running;
    window.nnApi.ensureTraining();
    // se il modello non ha ancora iniziato ad addestrarsi, attende le prime epoche
    const end = performance.now() + 1500;
    while (window.nnApi.stats().epoch < 20 && performance.now() < end) await sleep(100);
    const pts = window.nnApi.data(), st = window.nnApi.stats();
    const cm = [[0, 0], [0, 0]];
    for (const [x, y, lab] of pts) cm[lab][window.nnApi.predict(x, y) > 0.5 ? 1 : 0]++;
    const n = pts.length, ok = cm[0][0] + cm[1][1], err = n - ok;
    // stampa nello stile di pandas.crosstab
    const w = Math.max(T.pred.length, T.label.length) + 2, c = 6;
    const row = (a, b, d) => a.padEnd(w) + String(b).padStart(c) + String(d).padStart(c);
    const lines = [
      row(T.pred, 0, 1),
      T.label,
      row("0", cm[0][0], cm[0][1]),
      row("1", cm[1][0], cm[1][1]),
      "",
      `${T.acc}: ${(ok / n * 100).toFixed(1)}%`,
      `${T.errors}: ${err} ${T.of} ${n} ${T.points}`
    ];
    dout.textContent = lines.join("\n");
    summary.textContent = `${T.done} · ${st.dataset} · ${T.epoch} ${st.epoch}`;
    runBtn.disabled = false;
  }
  if (runBtn) runBtn.addEventListener("click", analyze);

  /* ---------- Requisiti: user story e Definition of Ready ---------- */
  const role = document.getElementById("us-role"), goal = document.getElementById("us-goal"), benefit = document.getElementById("us-benefit");
  const storyEl = document.getElementById("us-text"), dorSummary = document.getElementById("dor-summary");
  const prioBtns = [...document.querySelectorAll("[data-moscow]")];
  const words = v => v.trim().split(/\s+/).filter(Boolean).length;
  const vagueRe = new RegExp("(^|[^\\p{L}-])(" + T.vague.join("|") + ")(?=$|[^\\p{L}-])", "giu");
  function findVague(text) {
    const hits = new Set(); let m;
    vagueRe.lastIndex = 0;
    while ((m = vagueRe.exec(text))) hits.add(m[2].toLowerCase());
    return [...hits];
  }
  function strong(txt) { const b = document.createElement("strong"); b.textContent = txt.trim() || "…"; return b; }
  function checkStory() {
    if (!storyEl) return;
    // anteprima della user story
    storyEl.replaceChildren(T.as + " ", strong(role.value), ", " + T.want + " ", strong(goal.value), ", " + T.so + " ", strong(benefit.value), ".");
    const vague = findVague([role.value, goal.value, benefit.value].join(" "));
    const res = {
      role: role.value.trim().length >= 3,
      goal: words(goal.value) >= 4,
      benefit: words(benefit.value) >= 3,
      vague: vague.length === 0,
      prio: prioBtns.some(b => b.getAttribute("aria-pressed") === "true")
    };
    let ko = 0;
    document.querySelectorAll("#dor-list li").forEach(li => {
      const pass = res[li.dataset.check], name = li.querySelector(".dor-name");
      li.className = pass ? "pass" : "fail";
      li.querySelector(".dor-ico").textContent = pass ? "✓" : "✕";
      li.querySelector(".dor-state").textContent = " (" + (pass ? T.ok : T.ko) + ")";
      name.textContent = name.dataset.base + (li.dataset.check === "vague" && !pass ? ` (${T.found}: ${vague.map(w => T.q[0] + w + T.q[1]).join(", ")})` : "");
      if (!pass) ko++;
    });
    dorSummary.className = "dor-summary " + (ko ? "ko" : "ok");
    dorSummary.textContent = ko ? `${T.review}: ${ko} ${ko === 1 ? T.item : T.items}` : "✓ " + T.ready;
  }
  [role, goal, benefit].forEach(el => el && el.addEventListener("input", checkStory));
  prioBtns.forEach(b => b.addEventListener("click", () => {
    const on = b.getAttribute("aria-pressed") !== "true";
    prioBtns.forEach(x => x.setAttribute("aria-pressed", String(x === b && on)));
    checkStory();
  }));
  checkStory();
})();
