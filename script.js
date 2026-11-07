/**
 * Spatial Editorial Birthday Experience
 * Feat: 3D Gyroscope/Mouse Spatial Tilt, Happy Birthday Synthesizer Melody,
 * Real-time Lens Filters, and Particle Physics
 */

// ==========================================
// CONFIGURATION & STATE
// ==========================================
const DEFAULT_PHOTO = 'birthday_girl.png';
const DEFAULT_NAME = 'Hoshini';
const DEFAULT_MESSAGE = `Happy Birthday Hoshini! Honestly, life would be so unimaginably boring without our endless laughs, chaotic talks, and all the memories we share. Thank you for always being the most genuine, dependable, and hilarious friend anyone could ever ask for. I hope this new chapter brings you massive wins, boundless happiness, unforgettable adventures, and zero stress. Never stop being your bright, iconic self—because you are truly one in a million!`;

// Curated list of alternative sticker badge phrases
const BADGE_OPTIONS = [
  "HEART OF PURE GOLD 💛",
  "GLOWING & UNSTOPPABLE ✨",
  "PRETTIEST SMILE IN THE ROOM 🌸",
  "HOTTER THAN THE CANDLES 🔥",
  "PURE SUNSHINE ENERGY ☀️",
  "CERTIFIED ICON 👑",
  "ANOTHER YEAR MORE GORGEOUS ✨",
  "FOREVER RADIANT 💫",
  "LIVING HER BEST CHAPTER 📖",
  "1 OF 1 ONE OF A KIND 💎",
  "BLESSED WITH GOOD GENES 💅",
  "MAKING 2026 LOOK EFFORTLESS 🥂",
  "SHE CAME, SHE SLAYED ✨",
  "BIRTHDAY ROYALTY ONLY 👸"
];

let badgeIndex = 0;
const savedBadge = "HEART OF PURE GOLD 💛";

const savedPhoto = localStorage.getItem('bday_photo');
const initialPhoto = (savedPhoto && !savedPhoto.includes('unsplash.com')) ? savedPhoto : DEFAULT_PHOTO;

let state = {
  isSongPlaying: false,
  songStepIndex: 0,
  songTimer: null,
  name: 'Hoshini',
  message: DEFAULT_MESSAGE,
  badgeText: savedBadge,
  photoUrl: initialPhoto,
};

// ==========================================
// AUDIO SYSTEM: REAL INSTRUMENTAL + SYNTH MELODY FAIL-SAFE
// ==========================================
let audioCtx = null;
let synthInterval = null;
let isSynthPlaying = false;

// Happy Birthday Chime Melody
const BDAY_NOTES = [
  { note: 261.63, dur: 0.35, pause: 0.4 },
  { note: 261.63, dur: 0.2,  pause: 0.25 },
  { note: 293.66, dur: 0.55, pause: 0.6 },
  { note: 261.63, dur: 0.55, pause: 0.6 },
  { note: 349.23, dur: 0.55, pause: 0.6 },
  { note: 329.63, dur: 1.0,  pause: 1.1 },

  { note: 261.63, dur: 0.35, pause: 0.4 },
  { note: 261.63, dur: 0.2,  pause: 0.25 },
  { note: 293.66, dur: 0.55, pause: 0.6 },
  { note: 261.63, dur: 0.55, pause: 0.6 },
  { note: 392.00, dur: 0.55, pause: 0.6 },
  { note: 349.23, dur: 1.0,  pause: 1.1 },

  { note: 261.63, dur: 0.35, pause: 0.4 },
  { note: 261.63, dur: 0.2,  pause: 0.25 },
  { note: 523.25, dur: 0.55, pause: 0.6 },
  { note: 440.00, dur: 0.55, pause: 0.6 },
  { note: 349.23, dur: 0.55, pause: 0.6 },
  { note: 329.63, dur: 0.55, pause: 0.6 },
  { note: 293.66, dur: 0.7,  pause: 0.8 },

  { note: 466.16, dur: 0.35, pause: 0.4 },
  { note: 466.16, dur: 0.2,  pause: 0.25 },
  { note: 440.00, dur: 0.55, pause: 0.6 },
  { note: 349.23, dur: 0.55, pause: 0.6 },
  { note: 392.00, dur: 0.55, pause: 0.6 },
  { note: 349.23, dur: 1.3,  pause: 1.6 }
];

function playSynthTone(freq, duration) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(freq, now);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq * 2, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration + 0.05);
  osc2.stop(now + duration + 0.05);
}

function startSynthMelody() {
  if (isSynthPlaying) return;
  isSynthPlaying = true;
  initAudioContext();

  let noteIdx = 0;
  function scheduleNextNote() {
    if (!isSynthPlaying) return;
    const current = BDAY_NOTES[noteIdx];
    playSynthTone(current.note, current.dur);

    noteIdx = (noteIdx + 1) % BDAY_NOTES.length;
    synthInterval = setTimeout(scheduleNextNote, current.pause * 1000);
  }
  scheduleNextNote();
}

function stopSynthMelody() {
  isSynthPlaying = false;
  if (synthInterval) {
    clearTimeout(synthInterval);
    synthInterval = null;
  }
}

function initAudioContext() {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (e) {
    console.warn("AudioContext init: ", e);
  }
}

function getAudioElement() {
  return document.getElementById('birthday-audio');
}

function updateAudioUI(isPlaying) {
  const btn = document.getElementById('song-toggle-btn');
  const btnLabel = document.getElementById('song-btn-label');
  const audioBars = document.getElementById('audio-bars');
  const discIcon = document.getElementById('music-disc-icon');

  if (isPlaying) {
    if (btnLabel) btnLabel.innerText = 'Music: ON';
    if (discIcon) discIcon.innerText = '🎵';
    if (audioBars) audioBars.classList.add('playing');
    if (btn) {
      btn.className = "px-3 sm:px-4 py-1.5 rounded-full bg-amber-500/25 hover:bg-amber-500/35 border border-amber-400/50 text-amber-300 text-[11px] sm:text-xs font-mono font-semibold transition-all duration-300 flex items-center gap-1.5 sm:gap-2 group shadow-lg shadow-amber-500/10 active:scale-95";
    }
    state.isSongPlaying = true;
  } else {
    if (btnLabel) btnLabel.innerText = 'Music: OFF';
    if (discIcon) discIcon.innerText = '🔇';
    if (audioBars) audioBars.classList.remove('playing');
    if (btn) {
      btn.className = "px-3 sm:px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-zinc-400 hover:text-white text-[11px] sm:text-xs font-mono font-medium transition-all duration-300 flex items-center gap-1.5 sm:gap-2 group shadow-lg active:scale-95";
    }
    state.isSongPlaying = false;
  }
}

let experienceEntered = false;

function enterExperienceWithAudio(e) {
  if (experienceEntered) return;
  experienceEntered = true;

  // 1. Immediately request gyroscope permission (iOS Safari requirement)
  requestGyroscopePermission();

  // 2. Play audio instantly
  initAudioContext();
  startBirthdaySong();

  const curtain = document.getElementById('entrance-curtain');
  if (curtain) {
    curtain.style.opacity = '0';
    curtain.style.pointerEvents = 'none';
    setTimeout(() => {
      curtain.remove();
    }, 700);
  }

  // Fire celebratory confetti cannons
  launchAutoConfettiShow();
  setTimeout(() => launchAutoConfettiShow(), 1500);
}

function startBirthdaySong() {
  initAudioContext();
  const audio = getAudioElement();
  if (!audio) return;

  audio.volume = 1.0;
  if (!audio.src || !audio.src.includes('.mp3')) {
    audio.src = 'happy_birthday.mp3';
  }
  audio.load();

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        stopSynthMelody();
        updateAudioUI(true);
      })
      .catch((err) => {
        console.warn("Direct HTML5 audio blocked, starting chime synth fallback:", err);
        startSynthMelody();
        updateAudioUI(true);
      });
  } else {
    updateAudioUI(true);
  }
}

function pauseBirthdaySong() {
  const audio = getAudioElement();
  if (audio) {
    audio.pause();
  }
  stopSynthMelody();
  updateAudioUI(false);
}

function toggleBirthdaySong() {
  initAudioContext();
  if (state.isSongPlaying) {
    pauseBirthdaySong();
  } else {
    startBirthdaySong();
  }
}

// Camera Shutter Click SFX
function playShutterSound() {
  initAudioContext();
  const bufferSize = audioCtx.sampleRate * 0.06;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1500, audioCtx.currentTime);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
}

// Chime SFX
function playChimeEffect(freq = 659.25) {
  initAudioContext();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  const now = audioCtx.currentTime;
  gain.gain.setValueAtTime(0.14, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 1.2);
}

// ==========================================
// 3D SPATIAL PRISM HOVER ANIMATION FOR EDITORIAL
// ==========================================
const card = document.getElementById('spatial-editorial-card');
const aura = document.getElementById('spatial-ambient-aura');

function applySpatial3D(clientX, clientY) {
  if (!card) return;
  const rect = card.getBoundingClientRect();
  const cardCenterX = rect.left + rect.width / 2;
  const cardCenterY = rect.top + rect.height / 2;

  // Normalized coordinate offsets (-1 to 1)
  const deltaX = (clientX - cardCenterX) / (window.innerWidth / 2);
  const deltaY = (clientY - cardCenterY) / (window.innerHeight / 2);

  // Rotation angles (Max ~20 degrees for crisp, luxury feel)
  const rotateY = deltaX * 18;
  const rotateX = -deltaY * 18;

  // Update dynamic specular reflection position
  const percentX = Math.round(((clientX - rect.left) / rect.width) * 100);
  const percentY = Math.round(((clientY - rect.top) / rect.height) * 100);
  card.style.setProperty('--mouse-x', `${percentX}%`);
  card.style.setProperty('--mouse-y', `${percentY}%`);

  // 3D Card Transform with perspective depth
  card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

  // Parallax ambient lighting aura
  if (aura) {
    aura.style.transform = `translate(calc(-50% + ${deltaX * 45}px), calc(-50% + ${deltaY * 45}px))`;
  }
}

function resetSpatial3D() {
  if (!card) return;
  card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  if (aura) {
    aura.style.transform = 'translate(-50%, -50%)';
  }
}

// Mouse movement listener (Active strictly on Desktop with fine mouse pointers)
const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)');

window.addEventListener('mousemove', (e) => {
  if (isDesktopPointer.matches) {
    applySpatial3D(e.clientX, e.clientY);
  }
});

// Smooth reset on mouse leave window
document.addEventListener('mouseleave', () => {
  if (isDesktopPointer.matches) {
    resetSpatial3D();
  }
});

// ==========================================
// SMOOTH CALIBRATED GYROSCOPE ENGINE (MOBILE)
// ==========================================
let targetTiltX = 0;
let targetTiltY = 0;
let currentTiltX = 0;
let currentTiltY = 0;
let baseBeta = null;
let baseGamma = null;
let isGyroActive = false;

function requestGyroscopePermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          initSmoothGyroscope();
        }
      })
      .catch(err => {
        console.warn("Orientation permission:", err);
      });
  } else {
    initSmoothGyroscope();
  }
}

function initSmoothGyroscope() {
  if (isGyroActive) return;
  isGyroActive = true;

  window.addEventListener('deviceorientation', (e) => {
    if (e.beta === null || e.gamma === null) return;

    // Auto-calibrate natural resting angle of the phone
    if (baseBeta === null) {
      baseBeta = e.beta;
      baseGamma = e.gamma;
    }

    // Relative tilt from natural hand position
    const deltaBeta = e.beta - baseBeta;
    const deltaGamma = e.gamma - baseGamma;

    // Clamped subtle range: max +-8 degrees (never flips upside down)
    targetTiltX = Math.max(-8, Math.min(8, -deltaBeta * 0.35));
    targetTiltY = Math.max(-8, Math.min(8, deltaGamma * 0.35));
  }, { passive: true });

  // High-performance smooth LERP interpolation loop (settles and pauses when stable)
  let gyroAnimId = null;
  function renderGyroLoop() {
    if (isGyroActive && card && !isDesktopPointer.matches) {
      const diffX = targetTiltX - currentTiltX;
      const diffY = targetTiltY - currentTiltY;

      if (Math.abs(diffX) > 0.04 || Math.abs(diffY) > 0.04) {
        currentTiltX += diffX * 0.1;
        currentTiltY += diffY * 0.1;
        card.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(1)}deg) rotateY(${currentTiltY.toFixed(1)}deg)`;
      }
    }
    gyroAnimId = requestAnimationFrame(renderGyroLoop);
  }
  renderGyroLoop();
}

// ==========================================
// EDITORIAL LENS FILTERS
// ==========================================
function setPhotoFilter(filterName) {
  playShutterSound();
  const layer = document.getElementById('editorial-filter-layer');
  if (!layer) return;

  layer.className = layer.className.replace(/filter-\w+/g, '').trim();
  layer.classList.add(`filter-${filterName}`);

  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
}

function triggerStickerChime(el) {
  initAudioContext();
  playChimeEffect(783.99); // G5
  
  // Cycle to next badge phrase on click!
  badgeIndex = (badgeIndex + 1) % BADGE_OPTIONS.length;
  state.badgeText = BADGE_OPTIONS[badgeIndex];
  localStorage.setItem('bday_badge', state.badgeText);
  updateAllText();

  el.style.transform = 'scale(1.06) rotate(0deg)';
  setTimeout(() => {
    el.style.transform = '';
  }, 200);
}

let lastLetterToggleTime = 0;

function toggleEditorialLetter(e) {
  if (e && typeof e.stopPropagation === 'function') {
    e.stopPropagation();
  }

  const now = Date.now();
  if (now - lastLetterToggleTime < 280) return;
  lastLetterToggleTime = now;

  try {
    initAudioContext();
    playChimeEffect(523.25);
  } catch (err) {}

  const modal = document.getElementById('editorial-letter-modal');
  if (modal) {
    const isHidden = modal.classList.contains('hidden');
    if (isHidden) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    } else {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }
}

// ==========================================
// CONFIGURATION MODAL & PHOTO UPLOAD
// ==========================================
function openConfigModal() {
  document.getElementById('config-name-input').value = state.name;
  document.getElementById('config-message-input').value = state.message;
  const badgeSelect = document.getElementById('config-badge-select');
  const badgeCustom = document.getElementById('config-badge-custom');
  if (badgeSelect) badgeSelect.value = state.badgeText;
  if (badgeCustom) badgeCustom.value = state.badgeText;
  document.getElementById('config-modal').classList.remove('hidden');
}

function closeConfigModal() {
  document.getElementById('config-modal').classList.add('hidden');
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    state.photoUrl = e.target.result;
    localStorage.setItem('bday_photo', state.photoUrl);
    updateAllPhotos();
    playChimeEffect(659.25);
  };
  reader.readAsDataURL(file);
}

function saveCustomConfig() {
  const newName = document.getElementById('config-name-input').value.trim();
  const newMessage = document.getElementById('config-message-input').value.trim();
  const newBadge = document.getElementById('config-badge-custom') ? document.getElementById('config-badge-custom').value.trim() : '';

  if (newName) {
    state.name = newName;
    localStorage.setItem('bday_name', newName);
  }
  if (newMessage) {
    state.message = newMessage;
    localStorage.setItem('bday_message', newMessage);
  }
  if (newBadge) {
    state.badgeText = newBadge;
    localStorage.setItem('bday_badge', newBadge);
  }

  updateAllText();
  closeConfigModal();
  playChimeEffect(880);
  launchCelebrationExplosion();
}

function updateAllPhotos() {
  document.querySelectorAll('.hero-photo-target').forEach(img => {
    img.src = state.photoUrl;
  });
}

function updateAllText() {
  document.querySelectorAll('.name-placeholder').forEach(el => {
    el.innerText = state.name;
  });
  document.querySelectorAll('.message-placeholder').forEach(el => {
    el.innerText = state.message;
  });
  const badgeEl = document.getElementById('sticker-badge-right');
  if (badgeEl) {
    badgeEl.innerText = state.badgeText;
  }
}

// ==========================================
// CANVAS PARTICLES & CONFETTI ENGINE
// ==========================================
const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(x, y, isConfetti = false, angle = null, speed = null) {
    this.x = x;
    this.y = y;
    this.isConfetti = isConfetti;
    this.size = isConfetti ? Math.random() * 8 + 4 : Math.random() * 3 + 1;
    if (angle !== null && speed !== null) {
      this.speedX = Math.cos(angle) * speed;
      this.speedY = Math.sin(angle) * speed;
    } else {
      this.speedX = (Math.random() - 0.5) * (isConfetti ? 10 : 3);
      this.speedY = isConfetti ? Math.random() * -12 - 2 : (Math.random() - 0.5) * 3;
    }
    this.gravity = isConfetti ? 0.32 : 0.02;
    this.opacity = 1;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 14;
    const colors = ['#fde047', '#f59e0b', '#ec4899', '#8b5cf6', '#38bdf8', '#34d399', '#ffffff', '#fb7185'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.rotation += this.rotationSpeed;
    this.opacity -= this.isConfetti ? 0.007 : 0.02;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle = this.color;

    if (this.isConfetti) {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

let isParticleLoopActive = false;

function startParticleLoop() {
  if (isParticleLoopActive) return;
  isParticleLoopActive = true;
  requestAnimationFrame(animateParticles);
}

function animateParticles() {
  if (particles.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isParticleLoopActive = false;
    return; // Completely pause loop when no particles exist!
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].opacity <= 0 || particles[i].y > canvas.height + 20) {
      particles.splice(i, 1);
    }
  }
  requestAnimationFrame(animateParticles);
}

// Single Point Celebration Explosion
function launchCelebrationExplosion(e) {
  initAudioContext();
  playChimeEffect(523.25);

  const originX = e && e.clientX ? e.clientX : window.innerWidth / 2;
  const originY = e && e.clientY ? e.clientY : window.innerHeight / 2;

  for (let i = 0; i < 60; i++) {
    particles.push(new Particle(originX, originY, true));
  }
  startParticleLoop();
}

// Directional Cannon Burst
function fireCannonBurst(originX, originY, baseAngleDeg, spreadDeg, count = 35) {
  for (let i = 0; i < count; i++) {
    const angleRad = ((baseAngleDeg + (Math.random() - 0.5) * spreadDeg) * Math.PI) / 180;
    const speed = Math.random() * 12 + 8;
    particles.push(new Particle(originX, originY, true, angleRad, -speed));
  }
  startParticleLoop();
}

// Full Automatic Dual Cannon Show
function launchAutoConfettiShow() {
  // Left cannon shooting up-right
  fireCannonBurst(0, window.innerHeight * 0.9, 45, 30, 40);
  // Right cannon shooting up-left
  fireCannonBurst(window.innerWidth, window.innerHeight * 0.9, 135, 30, 40);
  startParticleLoop();
}

// ==========================================
// INITIALIZATION & AUTOPLAY ENGINE
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  updateAllPhotos();
  updateAllText();

  // Attach direct multi-touch & click handlers to the Read Letter button
  const readLetterBtn = document.getElementById('read-letter-btn');
  if (readLetterBtn) {
    const handleLetterTouch = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleEditorialLetter(e);
    };
    readLetterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleEditorialLetter(e);
    });
    readLetterBtn.addEventListener('touchend', handleLetterTouch, { passive: false });
  }

  // Try direct autoplay if browser permits unprompted audio
  const audio = getAudioElement();
  if (audio) {
    audio.play().then(() => {
      enterExperienceWithAudio();
    }).catch(() => {
      // Browser blocked unprompted audio: entrance curtain stays active
      // Tapping anywhere or the "Open Birthday Surprise" button unlocks 100% audio
    });
  }

  // Backup listener: any touch, key, or click dissolves curtain and starts audio
  const autoPlayUnlock = () => {
    enterExperienceWithAudio();
    ['click', 'touchstart', 'pointerdown'].forEach(evt => {
      window.removeEventListener(evt, autoPlayUnlock);
    });
  };

  ['click', 'touchstart', 'pointerdown'].forEach(evt => {
    window.addEventListener(evt, autoPlayUnlock, { once: true, passive: true });
  });
});
