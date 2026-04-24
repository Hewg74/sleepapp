/* DriftTogether v2 */

const AUDIO_BASE = 'audio/web/';

// ─── Exercise data (for detail overlay) ──────
const EXERCISES = {
  'affect-labeling': {
    title: 'Affect Labeling Check-In', duration: '2 min',
    intro: 'Naming what you feel — briefly and precisely — activates the prefrontal cortex and reduces amygdala activation by up to 50%. Not a conversation. A 30-second naming, then receiving.',
    steps: [
      { label: 'Step 1', title: 'One of you begins', text: 'Name one thing you\'re noticing right now. Just a word or short phrase — not a story.' },
      { label: 'Step 2', title: 'Partner receives', text: 'No fixing. No reassurance. Just say:', script: 'I hear that. Thank you.' },
      { label: 'Step 3', title: 'Switch', text: 'The other names what\'s present. Receive it the same way.' },
      { label: 'Step 4', title: 'Close', text: 'Together:', script: 'That\'s here, and it can be here. It doesn\'t need to be fixed tonight.' },
    ],
  },
  'synchronized-breathing': {
    title: 'Synchronized Breathing', duration: '5 min',
    intro: 'At 5-6 breaths per minute, your heart rate variability increases and sympathetic tone drops. In physical contact, your rhythms synchronize within 3-5 minutes.',
    steps: [
      { label: 'Setup', title: 'Back to back', text: 'Lie so you can feel each other\'s breathing. Hands on your own belly.' },
      { label: 'Step 1', title: 'Calmer partner leads', text: 'Inhale 5 seconds through nose. Exhale 5 seconds through mouth.' },
      { label: 'Step 2', title: 'Other partner notices', text: 'Don\'t match. Don\'t count. Just feel the rhythm through physical contact.' },
    ],
  },
  'light-body-scan': {
    title: 'Light Body Scan', duration: '5 min',
    intro: 'HSP-adapted — gentle noticing, not deep focus. One partner reads aloud or play the audio. Pause 10-15 seconds between body regions.',
    steps: [
      { label: 'Setup', title: 'Both on your backs', text: 'Side by side, eyes closed. The reader holds the phone at low brightness, or just hit play.' },
      { label: 'Key', title: 'Light noticing', text: 'You\'re not scanning for problems. You\'re visiting each part of you — the way you\'d glance at a sleeping child.' },
    ],
  },
  'paradox-game': {
    title: 'The Paradox Game', duration: '3 min',
    intro: 'Try to stay awake. Removes sleep performance pressure entirely. A 2022 meta-analysis found this significantly reduces how long it takes to fall asleep.',
    steps: [
      { label: 'Step 1', title: 'Set the frame', script: 'We\'re both going to try to stay awake. No talking, no moving, no opening eyes. Trying NOT to fall asleep.' },
      { label: 'Step 2', title: 'Both respond', script: 'Got it. No sleep allowed.' },
      { label: 'Step 3', title: 'Lie still', text: 'Eyes closed. Passive alertness. No monitoring. Whatever happens, happens.' },
    ],
  },
  'loving-kindness': {
    title: 'Loving-Kindness Exchange', duration: '3 min',
    intro: 'When one person speaks words of safety directly to another, something in the listener\'s body stands down. Not because of the words — because of who is saying them.',
    steps: [
      { label: 'Self', title: 'To yourself', script: 'May I be safe. May I be peaceful. May I rest easily tonight.' },
      { label: 'Partner', title: 'To your partner', script: 'May you be safe. May you be peaceful. May you rest easily tonight.' },
      { label: 'Together', title: 'Both', script: 'May we be safe together. May we be at peace together. May we rest easily beside each other tonight.' },
    ],
  },
  'permission-ritual': {
    title: 'Permission Ritual', duration: '1 min',
    intro: 'The trap: can\'t leave because they\'ll feel bad, can\'t stay because you can\'t sleep. Permission dissolves the trap.',
    steps: [
      { label: 'Partner A', title: '', script: 'Tonight, you have full permission to stay, leave, come back, or do whatever your body needs. None of it means anything about us.' },
      { label: 'Partner B', title: '', script: 'Same for you. If I get up, it\'s not about you. We\'re just letting tonight be whatever it is.' },
      { label: 'Together', title: '', script: 'Whatever happens tonight is fine.' },
    ],
  },
  'gentle-reframe': {
    title: 'Gentle Reframe', duration: '2 min',
    intro: 'Predictions made by an anxious mind at 10pm are not reliable sources of information.',
    steps: [
      { label: 'If', title: '"I won\'t sleep"', script: 'I\'ve slept poorly some nights, but not every time. My body knows how. The conditions are getting better.' },
      { label: 'If', title: '"Tomorrow will be ruined"', script: 'The fear of a bad night does more damage than the bad night itself. My body is resilient.' },
      { label: 'If', title: '"Something is wrong with me"', script: 'This is a conditioned response. Learned, not broken. And learned things can be unlearned.' },
    ],
  },
  'cognitive-defusion': {
    title: 'Thought Watching', duration: '1 min',
    intro: 'When a thought feels like reality, create distance. You\'re not arguing with it — you\'re changing your relationship to it.',
    steps: [
      { label: 'Step 1', title: 'Notice', text: 'Say: "I\'m having the thought that I won\'t sleep."' },
      { label: 'Step 2', title: 'Distance', text: 'Say: "I notice I\'m having the thought that I won\'t sleep."' },
      { label: '', title: '', text: 'A thought is a sound your mind makes. Like a car on a distant road. You can hear it without getting in it.' },
    ],
  },
  'stimulus-control': {
    title: 'Positive Bed Time', duration: '15+ min',
    intro: 'Right now, this bed has an association. Rewrite it — one good experience at a time.',
    steps: [
      { label: 'Setup', title: 'Daytime or early evening', text: 'Get in bed together. Fully awake. Lights on. No sleep intention.' },
      { label: 'Do', title: 'Something enjoyable', text: 'Read to each other. Play a game. Talk about something that makes you laugh.' },
      { label: 'Rule', title: 'When done — get up', text: 'Don\'t transition into sleep. The point is the positive association.' },
    ],
  },
  'quiet-window': {
    title: 'The Quiet Window', duration: 'Ongoing',
    intro: 'After a set time — perhaps 90 minutes before bed — the day\'s business is closed.',
    steps: [
      { label: 'Yes', title: '', text: 'Light talk. Comfortable silence. Physical affection.' },
      { label: 'No', title: '', text: 'Logistics. Problem-solving. Emotionally loaded topics.' },
      { label: 'If needed', title: '', script: 'Let\'s put that on the shelf until morning.' },
    ],
  },
  '20-minute-rule': {
    title: 'The 20-Minute Rule', duration: 'Guide',
    intro: 'The single most validated technique in sleep medicine for conditioned arousal.',
    steps: [
      { label: 'Step 1', title: 'Get up', text: 'If ~20 minutes pass and you\'re clearly awake, get up quietly.' },
      { label: 'Step 2', title: 'Low-key activity', text: 'Read a physical book. Cup of tea. No screens.' },
      { label: 'Step 3', title: 'Come back when sleepy', text: 'Heavy eyelids, not just tired. Repeat if needed — no limit.' },
      { label: 'Gene', title: '', text: 'Stay. Be still. Don\'t follow. Your unbothered presence when she returns is the most powerful signal.' },
    ],
  },
  'the-morning-after': {
    title: 'The Morning After', duration: '2 min',
    intro: 'Before the story writes itself — before "this will never work" — just stop for a moment.',
    steps: [
      { label: 'Remember', title: 'Last night was data', text: 'Not a verdict. You showed up. Both of you. That pattern didn\'t form in one night. It won\'t dissolve in one night.' },
      { label: 'Know', title: 'It\'s working underneath', text: 'Every night you lie beside each other and nothing catastrophic happens, your brain is quietly updating its records.' },
      { label: 'Today', title: 'Be gentle', text: 'Not like two people recovering from a failure. Like two people in the middle of something that takes time.' },
    ],
  },
  'vagal-reset': {
    title: 'Vagal Reset', duration: '3 min',
    intro: 'Stimulate the vagus nerve directly — shift from alert mode to rest mode. 4-count inhale, 8-count exhale, then humming.',
    steps: [
      { label: 'Setup', title: 'Hands on body', text: 'One hand on chest, one on belly. Feel the warmth of your own hands.' },
      { label: 'Breathe', title: '4 in, 8 out', text: 'The exhale is what matters. Longer out than in tells the vagus nerve to switch gears.' },
      { label: 'Hum', title: 'Add a hum on exhale', text: 'Low and quiet. The vibration in your chest and throat directly stimulates the nerve.' },
    ],
  },
};

const JOURNEY_LEVELS = [
  { title: 'Sit on bed together, daytime', desc: 'Just hang out. No sleep context.' },
  { title: 'Lie down together, lights on', desc: 'On top of covers. Not attempting sleep.' },
  { title: 'In bed, talking or reading', desc: 'Under covers, lights on. Positive associations.' },
  { title: 'Lights off, both awake', desc: 'Partner awake beside you. Not trying to sleep.' },
  { title: 'Partner drifting off', desc: 'Lights off, partner falling asleep. You\'re just resting.' },
  { title: 'Sleep attempt, permission to leave', desc: 'Both attempting sleep. Full permission to move.' },
  { title: 'Full night together', desc: 'Trust your nervous system. You\'ve built this.' },
];

// ─── State ───────────────────────────────────
let audio = null;
let audioPlaying = false;
const load = (k, d) => { try { return JSON.parse(localStorage.getItem('dt_' + k)) || d; } catch { return d; } };
const save = (k, v) => localStorage.setItem('dt_' + k, JSON.stringify(v));

// ─── Particles ───────────────────────────────
function initParticles() {
  const c = document.getElementById('particles');
  const ctx = c.getContext('2d');
  let stars = [];
  function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
  function create() {
    stars = [];
    const n = Math.min(50, Math.floor((c.width * c.height) / 14000));
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * c.width, y: Math.random() * c.height,
        r: Math.random() * 1.2 + 0.3, speed: Math.random() * 0.08 + 0.02,
        alpha: Math.random() * 0.3 + 0.1, hue: 230 + Math.random() * 20,
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    for (const s of stars) {
      s.y -= s.speed;
      if (s.y < 0) { s.y = c.height; s.x = Math.random() * c.width; }
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue},70%,70%,${s.alpha})`; ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize(); create(); draw();
  window.addEventListener('resize', () => { resize(); create(); });
}

// ─── Navigation ──────────────────────────────
function switchTab(id) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  document.querySelector(`.tab-btn[data-tab="${id}"]`).classList.add('active');
}

function showState(id) {
  document.querySelectorAll('#tab-tonight .state').forEach(s => s.classList.remove('active'));
  document.getElementById('tonight-' + id).classList.add('active');
}

function switchPanel(id) {
  document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`.sub-btn[data-panel="${id}"]`).classList.add('active');
  document.getElementById('panel-' + id).classList.add('active');
  if (id === 'journey') renderJourney();
}

// ─── Audio Player ────────────────────────────
const PAUSE_SVG = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
const PLAY_SVG = '<polygon points="5,3 19,12 5,21"/>';

function playAudio(filename, title) {
  // Stop any previous audio
  if (audio) {
    try { audio.pause(); } catch (e) {}
    audio.src = '';
    audio = null;
  }

  const src = AUDIO_BASE + filename + '.mp3';
  audio = new Audio(src);
  audio.preload = 'auto';

  const player = document.getElementById('player');
  document.getElementById('player-title').textContent = title || filename;
  document.getElementById('player-time').textContent = '0:00 / 0:00';
  document.getElementById('player-progress').style.width = '0%';
  player.classList.remove('hidden');

  // Wire the download link to this file
  const dl = document.getElementById('player-download');
  if (dl) {
    dl.href = src;
    dl.setAttribute('download', filename + '.mp3');
  }

  audio.addEventListener('timeupdate', () => {
    if (!audio) return;
    const cur = audio.currentTime;
    const dur = audio.duration || 0;
    const fmt = (t) => `${Math.floor(t/60)}:${Math.floor(t%60).toString().padStart(2,'0')}`;
    document.getElementById('player-time').textContent = `${fmt(cur)} / ${fmt(dur)}`;
    document.getElementById('player-progress').style.width = dur ? (cur / dur * 100) + '%' : '0%';
    updateMediaSessionPosition();
  });

  audio.addEventListener('play', () => { updatePlayerIcon(); setMediaPlaybackState('playing'); });
  audio.addEventListener('pause', () => { updatePlayerIcon(); setMediaPlaybackState('paused'); });
  audio.addEventListener('ended', () => {
    player.classList.add('hidden');
    if (audio) { audio.src = ''; audio = null; }
    setMediaPlaybackState('none');
  });

  // Tell the OS this is a media session so it keeps playing with screen off
  // and shows lock-screen controls.
  setupMediaSession(title || filename);

  // Play with promise handling
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      updatePlayerIcon();
    }).catch((err) => {
      console.warn('Audio play failed:', err);
      updatePlayerIcon();
    });
  }
}

// ─── Media Session API (lock-screen / background playback) ──
function setupMediaSession(title) {
  if (!('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title || 'DriftTogether',
      artist: 'DriftTogether',
      album: 'Sleep Exercises'
    });
    navigator.mediaSession.setActionHandler('play', () => {
      if (audio && audio.paused) audio.play().catch(() => {});
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      if (audio && !audio.paused) audio.pause();
    });
    navigator.mediaSession.setActionHandler('seekbackward', (d) => skipAudio(-(d.seekOffset || 15)));
    navigator.mediaSession.setActionHandler('seekforward', (d) => skipAudio(d.seekOffset || 15));
    navigator.mediaSession.setActionHandler('seekto', (d) => {
      if (audio && typeof d.seekTime === 'number') audio.currentTime = d.seekTime;
    });
    navigator.mediaSession.setActionHandler('stop', () => stopAudio());
  } catch (e) {
    console.warn('MediaSession setup failed:', e);
  }
}

function setMediaPlaybackState(state) {
  if ('mediaSession' in navigator) {
    try { navigator.mediaSession.playbackState = state; } catch (e) {}
  }
}

function updateMediaSessionPosition() {
  if (!('mediaSession' in navigator) || !audio || !audio.duration) return;
  if (typeof navigator.mediaSession.setPositionState !== 'function') return;
  try {
    navigator.mediaSession.setPositionState({
      duration: audio.duration,
      playbackRate: audio.playbackRate || 1,
      position: audio.currentTime
    });
  } catch (e) {}
}

function updatePlayerIcon() {
  const icon = document.getElementById('player-icon');
  if (!icon) return;
  if (audio && !audio.paused && !audio.ended) {
    icon.innerHTML = PAUSE_SVG;
  } else {
    icon.innerHTML = PLAY_SVG;
  }
}

function toggleAudio() {
  if (!audio) return;
  if (audio.paused) {
    const p = audio.play();
    if (p) p.catch((err) => console.warn('Toggle play failed:', err));
  } else {
    audio.pause();
  }
  // Icon updates via play/pause event listeners
}

function seekAudio(e) {
  if (!audio || !audio.duration) return;
  const bar = document.getElementById('player-seek');
  const rect = bar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audio.currentTime = pct * audio.duration;
}

function skipAudio(seconds) {
  if (!audio) return;
  audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
}

function stopAudio() {
  if (audio) { audio.pause(); audio = null; }
  audioPlaying = false;
  document.getElementById('player').classList.add('hidden');
  setMediaPlaybackState('none');
}

// ─── Ritual ──────────────────────────────────
let ritualAudio = null;
let ritualRAF = null;

function startRitual() {
  showState('ritual');
  document.getElementById('nav').classList.add('hidden');
  document.getElementById('breathing-orb').classList.add('active');
  document.getElementById('ritual-instruction').textContent = 'Put the phone face-down between you.';

  stopAudio(); // stop any exercise audio

  ritualAudio = new Audio(AUDIO_BASE + 'ritual.mp3');
  ritualAudio.play().catch(() => {});

  // Lock-screen / background playback for the ritual too
  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Evening Ritual',
        artist: 'DriftTogether',
        album: 'Sleep Exercises'
      });
      navigator.mediaSession.setActionHandler('play', () => ritualAudio && ritualAudio.paused && ritualAudio.play().catch(() => {}));
      navigator.mediaSession.setActionHandler('pause', () => ritualAudio && !ritualAudio.paused && ritualAudio.pause());
      navigator.mediaSession.playbackState = 'playing';
    } catch (e) {}
  }
  ritualAudio.addEventListener('play', () => setMediaPlaybackState('playing'));
  ritualAudio.addEventListener('pause', () => setMediaPlaybackState('paused'));

  function tick() {
    if (!ritualAudio) return;
    const cur = ritualAudio.currentTime;
    const dur = ritualAudio.duration || 1;
    const pct = (cur / dur) * 100;

    // Timer
    const m = Math.floor(cur / 60), s = Math.floor(cur % 60);
    document.getElementById('ritual-timer').textContent = `${m}:${s.toString().padStart(2, '0')}`;

    // Progress ring
    document.getElementById('ring-progress').style.strokeDashoffset = 100 - pct;

    // Phase name based on time ratio
    const ratio = cur / dur;
    if (ratio < 0.15) document.getElementById('phase-name').textContent = 'Check-In';
    else if (ratio < 0.45) document.getElementById('phase-name').textContent = 'Breathe';
    else if (ratio < 0.78) document.getElementById('phase-name').textContent = 'Body Scan';
    else document.getElementById('phase-name').textContent = 'Release';

    // Darken background progressively
    if (ratio > 0.7) {
      document.body.style.backgroundColor = '#060610';
      document.getElementById('particles').style.opacity = '0.25';
    }
    if (ratio > 0.9) {
      document.body.style.backgroundColor = '#030308';
      document.getElementById('particles').style.opacity = '0.1';
    }

    ritualRAF = requestAnimationFrame(tick);
  }

  ritualAudio.addEventListener('ended', () => endRitual());
  ritualRAF = requestAnimationFrame(tick);
}

function pauseRitual() {
  if (!ritualAudio) return;
  if (ritualAudio.paused) {
    ritualAudio.play();
    document.getElementById('pause-icon').innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
  } else {
    ritualAudio.pause();
    document.getElementById('pause-icon').innerHTML = '<polygon points="5,3 19,12 5,21"/>';
  }
}

function exitRitual() {
  if (ritualAudio) { ritualAudio.pause(); ritualAudio = null; }
  cancelAnimationFrame(ritualRAF);
  document.body.style.backgroundColor = '';
  document.getElementById('particles').style.opacity = '0.6';
  document.getElementById('breathing-orb').classList.remove('active');
  document.getElementById('nav').classList.remove('hidden');
  showState('home');
}

function endRitual() {
  if (ritualAudio) { ritualAudio.pause(); ritualAudio = null; }
  cancelAnimationFrame(ritualRAF);

  // Log session
  const sessions = load('sessions', []);
  sessions.push({ date: new Date().toISOString(), type: 'ritual' });
  save('sessions', sessions);
  save('lastRitual', Date.now());

  showState('post');
}

function finishGoodnight() {
  document.body.style.backgroundColor = '';
  document.getElementById('particles').style.opacity = '0.6';
  document.getElementById('nav').classList.remove('hidden');
  showState('home');
  updateTonightHome();
}

// ─── Exercise Detail ─────────────────────────
function openExercise(exId, audioFile) {
  const ex = EXERCISES[exId];
  if (!ex) return;

  let html = `<h2 class="ex-detail-title">${ex.title}</h2>
    <div class="ex-detail-dur">${ex.duration}</div>
    <p class="ex-detail-intro">${ex.intro}</p>`;

  if (audioFile) {
    html += `<div style="display:flex;gap:10px;align-items:center;margin-bottom:24px;flex-wrap:wrap">
      <button class="btn-pill" onclick="playAudio('${audioFile}','${ex.title.replace(/'/g, "\\'")}')"><span>Play Audio Guide</span></button>
      <a class="ex-download-link" href="${AUDIO_BASE}${audioFile}.mp3" download="${audioFile}.mp3">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
        <span>Download</span>
      </a>
    </div>`;
  }

  for (const s of ex.steps) {
    html += `<div class="ex-step">`;
    if (s.label) html += `<div class="ex-step-label">${s.label}</div>`;
    if (s.title) html += `<h4>${s.title}</h4>`;
    if (s.text) html += `<p>${s.text}</p>`;
    if (s.script) html += `<div class="say-aloud"><span class="say-label">Say aloud</span>${s.script.replace(/\n/g, '<br>')}</div>`;
    html += `</div>`;
  }

  document.getElementById('ex-detail').innerHTML = html;
  document.getElementById('overlay-ex').classList.add('active');
  document.getElementById('overlay-ex').scrollTop = 0;
}

// ─── Journey ─────────────────────────────────
function renderJourney() {
  const completed = load('completedLevels', []);
  const ladder = document.getElementById('ladder');
  let html = '';
  let foundCurrent = false;

  JOURNEY_LEVELS.forEach((lvl, i) => {
    const n = i + 1;
    let cls = 'future';
    if (completed.includes(n)) cls = 'done';
    else if (!foundCurrent) { cls = 'current'; foundCurrent = true; }

    html += `<div class="j-step ${cls}" data-level="${n}">
      <div class="j-node"></div>
      <div class="j-info">
        <span class="j-label">Phase ${n}${cls === 'current' ? ' — Current' : ''}</span>
        <h4>${lvl.title}</h4>
        <p>${lvl.desc}</p>
      </div>
    </div>`;
  });

  ladder.innerHTML = html;

  // Click to toggle
  ladder.querySelectorAll('.j-step').forEach(el => {
    el.addEventListener('click', () => {
      const lvl = parseInt(el.dataset.level);
      const c = load('completedLevels', []);
      const idx = c.indexOf(lvl);
      if (idx >= 0) c.splice(idx, 1); else c.push(lvl);
      save('completedLevels', c);
      renderJourney();
    });
  });

  // Session log
  const sessions = load('sessions', []);
  const logEl = document.getElementById('session-log');
  if (!sessions.length) {
    logEl.innerHTML = '<p class="empty-log">Complete a ritual to start tracking.</p>';
  } else {
    logEl.innerHTML = sessions.slice(-8).reverse().map(s =>
      `<div class="log-entry">
        <div class="log-date">${new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
        <div class="log-summary">${s.type === 'ritual' ? 'Full ritual completed' : s.type}</div>
      </div>`
    ).join('');
  }
}

// ─── Tonight Home ────────────────────────────
function updateTonightHome() {
  const lastRitual = load('lastRitual', 0);
  const hoursSince = (Date.now() - lastRitual) / (1000 * 60 * 60);
  const phaseEl = document.getElementById('tonight-phase');

  // Late-night detection: if ritual was completed < 6 hours ago
  if (lastRitual && hoursSince < 6) {
    phaseEl.textContent = 'Ritual completed tonight';
    // Could auto-expand post-ritual guidance here
  } else {
    const completed = load('completedLevels', []);
    const current = JOURNEY_LEVELS.findIndex((_, i) => !completed.includes(i + 1));
    if (current >= 0) {
      phaseEl.textContent = `Phase ${current + 1}: ${JOURNEY_LEVELS[current].title}`;
    }
  }
}

// ─── Init ────────────────────────────────────
function init() {
  initParticles();
  updateTonightHome();

  // Tab nav
  document.querySelectorAll('.tab-btn').forEach(btn =>
    btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

  // Sub-nav
  document.querySelectorAll('.sub-btn').forEach(btn =>
    btn.addEventListener('click', () => switchPanel(btn.dataset.panel)));

  // Tonight flow
  document.getElementById('btn-begin').addEventListener('click', () => showState('ready'));
  document.getElementById('ready-back').addEventListener('click', () => showState('home'));
  document.getElementById('btn-start-ritual').addEventListener('click', startRitual);
  document.getElementById('btn-exit').addEventListener('click', exitRitual);
  document.getElementById('btn-pause').addEventListener('click', pauseRitual);
  document.getElementById('btn-goodnight').addEventListener('click', finishGoodnight);

  // Post-ritual 20min audio
  document.getElementById('btn-play-20min')?.addEventListener('click', () =>
    playAudio('ex-20-minute-rule', 'The 20-Minute Rule'));

  // Player controls
  document.getElementById('player-toggle').addEventListener('click', toggleAudio);
  document.getElementById('player-close').addEventListener('click', stopAudio);
  document.getElementById('player-back15').addEventListener('click', () => skipAudio(-15));
  document.getElementById('player-fwd15').addEventListener('click', () => skipAudio(15));
  document.getElementById('player-seek').addEventListener('click', seekAudio);

  // Direct play buttons on exercise cards
  document.querySelectorAll('.ex-play').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playAudio(btn.dataset.audio, btn.dataset.title);
    });
  });

  // Inject a download icon beside every .ex-play so each track has a direct
  // download without needing to press play first.
  document.querySelectorAll('.ex-actions').forEach(actions => {
    const playBtn = actions.querySelector('.ex-play');
    if (!playBtn || !playBtn.dataset.audio) return;
    if (actions.querySelector('.ex-dl')) return; // already injected
    const file = playBtn.dataset.audio;
    const title = playBtn.dataset.title || file;
    const a = document.createElement('a');
    a.className = 'ex-dl';
    a.href = AUDIO_BASE + file + '.mp3';
    a.setAttribute('download', file + '.mp3');
    a.title = 'Download ' + title;
    a.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>';
    a.addEventListener('click', (e) => e.stopPropagation());
    actions.appendChild(a);
  });

  // Read buttons on exercise cards → open detail overlay
  document.querySelectorAll('.ex-read').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openExercise(btn.dataset.ex, btn.dataset.audio);
    });
  });

  // Prep cards toggle
  document.querySelectorAll('.prep-card .prep-head').forEach(head => {
    head.addEventListener('click', () => {
      head.parentElement.classList.toggle('open');
    });
  });

  // Toolbox groups toggle
  document.querySelectorAll('.group-head').forEach(head => {
    head.addEventListener('click', () => {
      head.parentElement.classList.toggle('open');
    });
  });

  // Exercise card body click → open detail (fallback if they miss the buttons)
  document.querySelectorAll('.ex-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.ex-play') || e.target.closest('.ex-read')) return;
      openExercise(card.dataset.ex, card.dataset.audio);
    });
  });

  // Exercise overlay back
  document.getElementById('ex-back').addEventListener('click', () => {
    document.getElementById('overlay-ex').classList.remove('active');
  });

  // Play buttons in prep cards
  document.querySelectorAll('.btn-play[data-audio]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playAudio(btn.dataset.audio, btn.textContent);
    });
  });

  // Render journey on first load if visible
  renderJourney();
}

document.addEventListener('DOMContentLoaded', init);
