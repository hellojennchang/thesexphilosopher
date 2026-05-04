/* ═══════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════ */
let currentFilter = 'all';
let currentSearch = '';
let currentGameEntry = null;

/* ═══════════════════════════════════════════════
   BROWSE — CARDS
═══════════════════════════════════════════════ */
function renderCards() {
  const grid = document.getElementById('cardGrid');
  const nf   = document.getElementById('notFound');
  const cnt  = document.getElementById('entry-count');

  let list = entries.slice();
  if (currentFilter !== 'all') list = list.filter(e => e.cat === currentFilter);
  if (currentSearch) list = list.filter(e =>
    e.word.toLowerCase().includes(currentSearch) ||
    e.brief.toLowerCase().includes(currentSearch) ||
    e.catLabel.toLowerCase().includes(currentSearch)
  );

  grid.innerHTML = '';

  if (!list.length) {
    nf.classList.add('visible');
    cnt.textContent = '0 entries';
    document.getElementById('submitWord').value = currentSearch;
    return;
  }

  nf.classList.remove('visible');
  cnt.textContent = list.length === entries.length
    ? `${entries.length} entries`
    : `${list.length} of ${entries.length} entries`;

  list.forEach((e, i) => {
    const d = document.createElement('div');
    d.className = 'entry-card';
    d.dataset.cat = e.cat;
    d.style.animationDelay = `${i * 0.035}s`;
    d.onclick = () => openModal(e);
    d.innerHTML = `
      ${e.isNew ? '<span class="new-badge">New</span>' : ''}
      <div class="card-cat-tag">
        <div class="cat-dot"></div>
        <span>${e.catLabel}</span>
      </div>
      <h3 class="card-word">${e.word}</h3>
      <p class="card-pos">${e.pos}</p>
      <p class="card-brief">${e.brief}</p>
      <div class="card-open-hint">Read entry</div>
    `;
    grid.appendChild(d);
  });
}

function filterCat(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderCards();
}

function handleSearch(val) {
  currentSearch = val.trim().toLowerCase();
  renderCards();
}

function handleSubmit() {
  const w = document.getElementById('submitWord').value.trim();
  if (!w) return;
  const btn = document.querySelector('.submit-btn');
  btn.textContent = 'Submitted — thank you';
  btn.style.color = 'var(--gold-light)';
  btn.style.borderColor = 'var(--gold)';
  setTimeout(() => {
    btn.textContent = 'Submit for consideration';
    btn.style.color = btn.style.borderColor = '';
    document.getElementById('submitWord').value = '';
    document.getElementById('submitWhy').value  = '';
  }, 3000);
}

/* ═══════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════ */
function openModal(e) {
  const mc = document.getElementById('modalCard');
  mc.dataset.cat = e.cat;

  const colors = {
    I:   'var(--tag-I)',
    II:  'var(--tag-II)',
    III: 'var(--tag-III)',
    IV:  'var(--tag-IV)',
    V:   'var(--tag-V)'
  };

  document.getElementById('modalCat').innerHTML =
    `<div class="cat-dot" style="background:${colors[e.cat]};width:5px;height:5px;transform:rotate(45deg);display:inline-block;margin-right:0.5rem;flex-shrink:0;"></div>
     <span style="color:var(--cream-dim);font-family:'Josefin Sans',sans-serif;font-size:0.63rem;letter-spacing:0.25em;text-transform:uppercase;">${e.catLabel}</span>`;

  document.getElementById('modalWord').textContent        = e.word;
  document.getElementById('modalMeta').textContent        = e.pos;
  document.getElementById('modalPron').textContent        = `/ ${e.pron} /`;
  document.getElementById('modalBrief').textContent       = e.brief;
  document.getElementById('modalOrigins').textContent     = e.origins;
  document.getElementById('modalPractice').textContent    = e.practice;
  document.getElementById('modalComplicated').textContent = e.complicated;

  const as = document.getElementById('modalAlsoSee');
  as.innerHTML = e.alsoSee.map(w =>
    `<button class="also-see-tag" onclick="crossRef('${w}')">${w}</button>`
  ).join('');

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function crossRef(word) {
  closeModal();
  const found = entries.find(e => e.word.toLowerCase() === word.toLowerCase());
  if (found) {
    setTimeout(() => openModal(found), 300);
  } else {
    showSection('browse', document.querySelector('.nav-link'));
    document.getElementById('searchInput').value = word;
    handleSearch(word);
  }
}

function maybeClose(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ═══════════════════════════════════════════════
   GAME — ONE PER DAY
═══════════════════════════════════════════════ */
const gamePool = [
  {
    word: "Limerence",
    def: "The obsessive, intrusive, neurochemically distinct state of early attachment that most people spend their entire lives calling love — and that always, without exception, ends.",
    options: ["Love", "Obsession", "Limerence", "Mania", "Attachment"]
  },
  {
    word: "Compersion",
    def: "The pleasure you feel when your partner experiences joy or intimacy with someone else. Frequently called the opposite of jealousy. Not quite accurate, but close enough to be useful.",
    options: ["Empathy", "Compersion", "Altruism", "Jealousy"]
  },
  {
    word: "Desire",
    def: "For many people, wanting arrives after engagement — not before. Which means those who wait to feel it first are waiting for the wrong signal.",
    options: ["Spontaneous Arousal", "Lust", "Desire", "Low Libido", "Intimacy"]
  },
  {
    word: "Hysteria",
    def: "A medical diagnosis applied almost exclusively to women for over two thousand years. The 'treatment,' administered by physicians, was never named for what it was.",
    options: ["Neurasthenia", "Hysteria", "Melancholy", "Conversion Disorder"]
  },
  {
    word: "Tantra",
    def: "A 5th-century Hindu and Buddhist ritual tradition in which sexuality is one small element — now primarily understood in the West as slow sex and spiritual connection.",
    options: ["Kama Sutra", "Tantra", "Neo-Tantra", "Sacred Sexuality"]
  },
  {
    word: "Consent",
    def: "From the Latin 'to feel together.' Currently understood as a transaction. Originally meant as an orientation.",
    options: ["Agreement", "Permission", "Consent", "Assent", "Compliance"]
  },
  {
    word: "Romantic",
    def: "A cultural ideal descended directly from medieval poetry about longing for someone else's spouse. Later repurposed as a model for stable partnership.",
    options: ["Passionate", "Romantic", "Amorous", "Courtly", "Intimate"]
  }
];

function todayKey() {
  const d = new Date();
  return `game-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function loadGame() {
  const dayNum = Math.floor(Date.now() / 86400000);
  const g = gamePool[dayNum % gamePool.length];
  currentGameEntry = entries.find(e => e.word === g.word) || null;

  document.getElementById('gameDate').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
  document.getElementById('gameDefinition').textContent = g.def;

  const verdict  = document.getElementById('gameVerdict');
  const readBtn  = document.getElementById('gameReadBtn');
  const already  = document.getElementById('gameAlready');
  const optsEl   = document.getElementById('gameOptions');

  verdict.classList.remove('show');
  readBtn.classList.remove('show');
  already.style.display = 'none';
  optsEl.innerHTML = '';

  const played = sessionStorage.getItem(todayKey());

  if (played) {
    already.style.display = 'block';
    const wasCorrect = played === 'correct';
    already.innerHTML = `You've already played today. Come back tomorrow for a new word.<br><br>
      <span style="color:${wasCorrect ? '#7ecfbf' : '#cf7e7e'}">
        ${wasCorrect ? `You got it — the word was ${g.word}.` : `The word was ${g.word}.`}
      </span>`;
    if (currentGameEntry) readBtn.classList.add('show');
    return;
  }

  const shuffled = [...g.options].sort(() => Math.random() - 0.5);
  shuffled.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'game-option';
    btn.textContent = opt;
    btn.onclick = () => answerGame(opt, g.word);
    optsEl.appendChild(btn);
  });
}

function answerGame(chosen, correct) {
  document.querySelectorAll('.game-option').forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('correct');
    else if (b.textContent === chosen && chosen !== correct) b.classList.add('wrong');
  });

  const isCorrect = chosen === correct;
  const verdict   = document.getElementById('gameVerdict');
  const readBtn   = document.getElementById('gameReadBtn');

  verdict.textContent = isCorrect
    ? `Yes — ${correct}. Read the full entry to understand why it matters.`
    : `The word is ${correct}. Getting it wrong is the whole point.`;
  verdict.classList.add('show');

  if (currentGameEntry) readBtn.classList.add('show');

  sessionStorage.setItem(todayKey(), isCorrect ? 'correct' : 'wrong');
}

function openEntryFromGame() {
  if (currentGameEntry) openModal(currentGameEntry);
}

/* ═══════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════ */
function showSection(name, el) {
  document.getElementById('sec-game').style.display   = name === 'game'   ? 'block' : 'none';
  document.getElementById('sec-browse').style.display = name === 'browse' ? 'block' : 'none';
  document.getElementById('sec-about').style.display  = name === 'about'  ? 'block' : 'none';

  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (el) el.classList.add('active');

  if (name === 'game') loadGame();
}

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
loadGame();
renderCards();
