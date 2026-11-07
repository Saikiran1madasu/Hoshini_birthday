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
// AUDIO SYSTEM: REAL INSTRUMENTAL + SYNTH FALLBACK
// ==========================================
let audioCtx = null;

function initAudioContext() {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
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

  const floatBtn = document.getElementById('floating-music-btn');
  const floatText = document.getElementById('floating-music-text');
  const floatIcon = document.getElementById('floating-music-icon');

  if (isPlaying) {
    if (btnLabel) btnLabel.innerText = 'Music: ON';
    if (discIcon) discIcon.innerText = '🎵';
    if (audioBars) audioBars.classList.add('playing');
    if (btn) {
      btn.className = "px-3 sm:px-4 py-1.5 rounded-full bg-amber-500/25 hover:bg-amber-500/35 border border-amber-400/50 text-amber-300 text-[11px] sm:text-xs font-mono font-semibold transition-all duration-300 flex items-center gap-2 group shadow-lg shadow-amber-500/10 active:scale-95";
    }

    if (floatText) floatText.innerText = 'Music: ON';
    if (floatIcon) floatIcon.innerText = '🎵';
    if (floatBtn) {
      floatBtn.className = "px-3.5 sm:px-4 py-2 rounded-full backdrop-blur-xl bg-black/85 hover:bg-black border border-amber-400/50 text-amber-300 shadow-2xl flex items-center gap-2 font-mono text-xs font-bold transition-all hover:scale-105 active:scale-95";
    }
    state.isSongPlaying = true;
  } else {
    if (btnLabel) btnLabel.innerText = 'Music: OFF';
    if (discIcon) discIcon.innerText = '🔇';
    if (audioBars) audioBars.classList.remove('playing');
    if (btn) {
      btn.className = "px-3 sm:px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-zinc-400 hover:text-white text-[11px] sm:text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 group shadow-lg active:scale-95";
    }

    if (floatText) floatText.innerText = 'Music: OFF';
    if (floatIcon) floatIcon.innerText = '🔇';
    if (floatBtn) {
      floatBtn.className = "px-3.5 sm:px-4 py-2 rounded-full backdrop-blur-xl bg-black/85 hover:bg-black border border-white/20 text-zinc-400 hover:text-white shadow-2xl flex items-center gap-2 font-mono text-xs font-medium transition-all hover:scale-105 active:scale-95";
    }
    state.isSongPlaying = false;
  }
}

let experienceEntered = false;

function enterExperienceWithAudio() {
  if (experienceEntered) return;
  experienceEntered = true;

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
  setTimeout(() => launchAutoConfettiShow(), 1600);
}

function startBirthdaySong() {
  initAudioContext();
  const audio = getAudioElement();
  if (!audio) return;

  audio.volume = 0.9;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        updateAudioUI(true);
      })
      .catch((err) => {
        console.log("Audio waiting for user gesture:", err);
        updateAudioUI(false);
      });
  }
}

function pauseBirthdaySong() {
  const audio = getAudioElement();
  if (audio) {
    audio.pause();
  }
  updateAudioUI(false);
}

function toggleBirthdaySong() {
  initAudioContext();
  const audio = getAudioElement();
  if (!audio) return;

  if (audio.paused) {
    startBirthdaySong();
  } else {
    pauseBirthdaySong();
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

// Mouse movement listener
window.addEventListener('mousemove', (e) => {
  applySpatial3D(e.clientX, e.clientY);
});

// Smooth reset on mouse leave window
document.addEventListener('mouseleave', () => {
  resetSpatial3D();
});

// Mobile Gyroscope / Device Orientation Support
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma !== null && e.beta !== null) {
      const tiltX = Math.min(Math.max(e.gamma, -25), 25) / 25;
      const tiltY = Math.min(Math.max(e.beta - 45, -25), 25) / 25;
      applySpatial3D(
        window.innerWidth / 2 + tiltX * (window.innerWidth / 3),
        window.innerHeight / 2 + tiltY * (window.innerHeight / 3)
      );
    }
  });
}

// Touch Drag Support for Mobile
window.addEventListener('touchmove', (e) => {
  if (e.touches && e.touches[0]) {
    applySpatial3D(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

window.addEventListener('touchend', () => {
  resetSpatial3D();
});

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

function toggleEditorialLetter() {
  initAudioContext();
  playChimeEffect(523.25);
  const modal = document.getElementById('editorial-letter-modal');
  modal.classList.toggle('hidden');
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

function animateParticles() {
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
animateParticles();

// Interactive Click Spark Emitter
window.addEventListener('click', (e) => {
  if (e.target.closest('#editorial-letter-modal')) return;
  for (let i = 0; i < 6; i++) {
    particles.push(new Particle(e.clientX, e.clientY, false));
  }
});

// Single Point Celebration Explosion
function launchCelebrationExplosion(e) {
  initAudioContext();
  playChimeEffect(523.25);
  setTimeout(() => playChimeEffect(659.25), 100);
  setTimeout(() => playChimeEffect(783.99), 200);

  const originX = e && e.clientX ? e.clientX : window.innerWidth / 2;
  const originY = e && e.clientY ? e.clientY : window.innerHeight / 2;

  for (let i = 0; i < 80; i++) {
    particles.push(new Particle(originX, originY, true));
  }
}

// Directional Cannon Burst
function fireCannonBurst(originX, originY, baseAngleDeg, spreadDeg, count = 45) {
  for (let i = 0; i < count; i++) {
    const angleRad = ((baseAngleDeg + (Math.random() - 0.5) * spreadDeg) * Math.PI) / 180;
    const speed = Math.random() * 14 + 10;
    particles.push(new Particle(originX, originY, true, angleRad, -speed));
  }
}

// Full Automatic Dual Cannon Show
function launchAutoConfettiShow() {
  // Left cannon shooting up-right
  fireCannonBurst(0, window.innerHeight * 0.9, 45, 35, 55);
  // Right cannon shooting up-left
  fireCannonBurst(window.innerWidth, window.innerHeight * 0.9, 135, 35, 55);
  // Center overhead burst
  launchCelebrationExplosion({ clientX: window.innerWidth / 2, clientY: window.innerHeight * 0.3 });
}

// Gentle Ambient Confetti Stream
function spawnAmbientConfetti() {
  if (particles.length > 180) return;
  for (let i = 0; i < 2; i++) {
    const x = Math.random() * window.innerWidth;
    const p = new Particle(x, -10, true);
    p.speedY = Math.random() * 2 + 1;
    p.gravity = 0.08;
    particles.push(p);
  }
}

// ==========================================
// INITIALIZATION & AUTOPLAY ENGINE
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  updateAllPhotos();
  updateAllText();

  // Keep gentle ambient confetti flowing
  setInterval(spawnAmbientConfetti, 450);

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
