import { DAILY_GAME_DATA, UNLIMITED_PROMPT_POOL, ARCHIVE_GAMES } from './data/questions.js';

// --- Sound Synthesizer via Web Audio API ---
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playSonarPing() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.9);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playSuccessChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + i * 0.08 + 0.4);
      });
    } catch (e) {}
  }

  playWarningBuzzer() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }
}

const sfx = new SoundEffects();

// --- Levenshtein Distance for Typo-Tolerance ---
function levenshtein(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => Array(an + 1).fill(0));
  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;
  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (b.charAt(j - 1) === a.charAt(i - 1)) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // substitution
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

// Find closest match among all valid answers in a prompt
function findTypoMatch(userInput, promptObj) {
  const cleaned = userInput.trim().toLowerCase();
  if (cleaned.length < 3) return null;

  const allKnown = [
    ...promptObj.oneInAKrillion,
    ...promptObj.deepCut,
    ...promptObj.rare,
    ...promptObj.schooler,
    ...promptObj.tooClever,
    ...promptObj.plankton
  ];

  for (const candidate of allKnown) {
    const candClean = candidate.toLowerCase();
    const dist = levenshtein(cleaned, candClean);
    if (dist === 1 && cleaned !== candClean) {
      return candidate;
    }
  }
  return null;
}

// --- Krillion Unlimited Game Engine ---
class KrillionGame {
  constructor() {
    this.mode = 'timed'; // 'timed' or 'zen'
    this.timePerPrompt = 25;
    this.currentTimer = 25;
    this.timerInterval = null;

    this.currentPrompts = [];
    this.currentIndex = 0;
    this.totalDepth = 0; // in meters (max 7000)
    this.sessionHistory = [];

    // DOM Elements
    this.depthDisplay = document.getElementById('current-depth-display');
    this.depthZone = document.getElementById('current-zone-display');
    this.depthFill = document.getElementById('depth-progress-fill');
    this.depthIcon = document.getElementById('depth-sub-icon');
    this.timerBox = document.getElementById('timer-box');
    this.timerCount = document.getElementById('timer-count');
    this.promptStepBadge = document.getElementById('prompt-step-badge');
    this.promptCatBadge = document.getElementById('prompt-category-badge');
    this.promptQuestion = document.getElementById('prompt-question-text');
    this.hintToggleBtn = document.getElementById('game-hint-toggle');
    this.hintContent = document.getElementById('game-hint-content');
    this.hintText = document.getElementById('game-hint-text');
    this.inputForm = document.getElementById('game-input-form');
    this.answerInput = document.getElementById('game-answer-input');
    this.typoTip = document.getElementById('typo-tip');
    this.typoWord = document.getElementById('typo-suggestion-word');
    this.feedbackBanner = document.getElementById('result-feedback-banner');
    this.feedbackBadge = document.getElementById('feedback-tier-badge');
    this.feedbackPoints = document.getElementById('feedback-points');
    this.feedbackExplanation = document.getElementById('feedback-explanation');
    this.nextPromptBtn = document.getElementById('next-prompt-btn');
    this.progressContainer = document.getElementById('progress-indicators');

    // Summary Modal
    this.summaryModal = document.getElementById('game-summary-modal');
    this.finalDepthStat = document.getElementById('final-depth-stat');
    this.summaryTierName = document.getElementById('summary-tier-name');
    this.summaryBreakdown = document.getElementById('summary-breakdown-list');
    this.shareTextArea = document.getElementById('share-text-area');

    this.initEventListeners();
    this.startNewGame();
  }

  initEventListeners() {
    // Mode toggles
    const timedBtn = document.getElementById('mode-timed-btn');
    const zenBtn = document.getElementById('mode-zen-btn');
    timedBtn.addEventListener('click', () => {
      this.mode = 'timed';
      timedBtn.classList.add('active');
      zenBtn.classList.remove('active');
      this.timerBox.style.display = 'flex';
      this.resetTimer();
    });
    zenBtn.addEventListener('click', () => {
      this.mode = 'zen';
      zenBtn.classList.add('active');
      timedBtn.classList.remove('active');
      this.timerBox.style.display = 'none';
      clearInterval(this.timerInterval);
    });

    // New Game button
    document.getElementById('new-game-btn').addEventListener('click', () => this.startNewGame());
    document.getElementById('play-again-modal-btn').addEventListener('click', () => {
      this.summaryModal.style.display = 'none';
      this.startNewGame();
    });

    // Sound toggle
    const soundBtn = document.getElementById('sound-toggle-btn');
    soundBtn.addEventListener('click', () => {
      const enabled = sfx.toggle();
      soundBtn.querySelector('.sound-icon').textContent = enabled ? '🔊' : '🔇';
    });

    // Hint toggle
    this.hintToggleBtn.addEventListener('click', () => {
      const isVisible = this.hintContent.style.display === 'block';
      this.hintContent.style.display = isVisible ? 'none' : 'block';
    });

    // Live typing typo tolerance check
    this.answerInput.addEventListener('input', () => {
      const currentQ = this.currentPrompts[this.currentIndex];
      if (!currentQ) return;
      const typoCandidate = findTypoMatch(this.answerInput.value, currentQ);
      if (typoCandidate) {
        this.typoWord.textContent = typoCandidate;
        this.typoTip.style.display = 'block';
      } else {
        this.typoTip.style.display = 'none';
      }
    });

    // Accept typo suggestion on click
    this.typoTip.addEventListener('click', () => {
      this.answerInput.value = this.typoWord.textContent;
      this.typoTip.style.display = 'none';
      this.answerInput.focus();
    });

    // Submit form
    this.inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Next Prompt button
    this.nextPromptBtn.addEventListener('click', () => {
      this.advanceToNextPrompt();
    });

    // Copy result button
    document.getElementById('copy-share-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(this.shareTextArea.value).then(() => {
        const btn = document.getElementById('copy-share-btn');
        const orig = btn.textContent;
        btn.textContent = '✅ Copied to Clipboard!';
        setTimeout(() => btn.textContent = orig, 2000);
      });
    });
  }

  startNewGame() {
    clearInterval(this.timerInterval);
    this.currentIndex = 0;
    this.totalDepth = 0;
    this.sessionHistory = [];

    // Shuffle and pick 7 prompts from UNLIMITED_PROMPT_POOL
    const shuffled = [...UNLIMITED_PROMPT_POOL].sort(() => 0.5 - Math.random());
    this.currentPrompts = shuffled.slice(0, 7);

    this.renderProgressPills();
    this.updateDepthDisplay();
    this.loadCurrentPrompt();
  }

  renderProgressPills() {
    this.progressContainer.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const dot = document.createElement('div');
      dot.className = `progress-dot ${i === 0 ? 'active' : ''}`;
      dot.textContent = i + 1;
      this.progressContainer.appendChild(dot);
    }
  }

  loadCurrentPrompt() {
    const q = this.currentPrompts[this.currentIndex];
    this.promptStepBadge.textContent = `Prompt ${this.currentIndex + 1} of 7`;
    this.promptCatBadge.textContent = q.category;
    this.promptQuestion.textContent = q.prompt;
    this.hintText.textContent = q.hints.stage1;
    this.hintContent.style.display = 'none';

    this.answerInput.value = '';
    this.answerInput.disabled = false;
    this.inputForm.style.display = 'flex';
    this.feedbackBanner.style.display = 'none';
    this.typoTip.style.display = 'none';
    this.answerInput.focus();

    // Update progress pill
    const dots = this.progressContainer.querySelectorAll('.progress-dot');
    dots.forEach((dot, idx) => {
      if (idx === this.currentIndex) dot.classList.add('active');
      else dot.classList.remove('active');
    });

    // Start timer if timed mode
    if (this.mode === 'timed') {
      this.resetTimer();
    }
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.currentTimer = this.timePerPrompt;
    this.timerCount.textContent = this.currentTimer;
    this.timerBox.classList.remove('danger');

    this.timerInterval = setInterval(() => {
      this.currentTimer--;
      this.timerCount.textContent = this.currentTimer;

      if (this.currentTimer <= 5) {
        this.timerBox.classList.add('danger');
      }

      if (this.currentTimer <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeout();
      }
    }, 1000);
  }

  handleTimeout() {
    sfx.playWarningBuzzer();
    this.evaluateAnswer("", true);
  }

  handleSubmit() {
    const rawVal = this.answerInput.value.trim();
    if (!rawVal) return;
    clearInterval(this.timerInterval);
    this.evaluateAnswer(rawVal, false);
  }

  evaluateAnswer(userInput, isTimeout) {
    const q = this.currentPrompts[this.currentIndex];
    this.answerInput.disabled = true;
    this.inputForm.style.display = 'none';

    let tier = '';
    let points = 0;
    let depthGained = 0;
    let explanation = '';
    let badgeClass = '';
    let emoji = '⬛';

    const cleanInput = userInput.trim().toLowerCase();

    const isMatch = (arr) => arr.some(item => item.toLowerCase() === cleanInput || levenshtein(item.toLowerCase(), cleanInput) <= 1);

    if (isTimeout || !userInput) {
      tier = 'TIMED OUT';
      points = 0;
      depthGained = 0;
      badgeClass = 'plankton';
      emoji = '🟥';
      explanation = `Time ran out! You remained at current depth without diving. (Top answer: ${q.oneInAKrillion[0]})`;
    } else if (isMatch(q.oneInAKrillion)) {
      tier = 'ONE IN A KRILLION';
      points = 100;
      depthGained = 1000;
      badgeClass = 'one-in-krillion';
      emoji = '🤿';
      explanation = `🌟 Incredible! You supplied a truly rare, bottom-of-the-trench response (${userInput}). Top 1% tier!`;
      sfx.playSuccessChime();
    } else if (isMatch(q.deepCut)) {
      tier = 'DEEP CUT';
      points = 80;
      depthGained = 800;
      badgeClass = 'one-in-krillion';
      emoji = '🟦';
      explanation = `Deep dive! Highly esoteric and rarely selected. Excellent knowledge.`;
      sfx.playSonarPing();
    } else if (isMatch(q.rare)) {
      tier = 'RARE';
      points = 50;
      depthGained = 500;
      badgeClass = 'one-in-krillion';
      emoji = '🟩';
      explanation = `Solid choice! Only a small minority of divers thought of this.`;
      sfx.playSonarPing();
    } else if (isMatch(q.schooler)) {
      tier = 'SCHOOLER';
      points = 25;
      depthGained = 250;
      badgeClass = 'schooler';
      emoji = '🟨';
      explanation = `A decent answer, but moderately popular among the school of players.`;
    } else if (isMatch(q.tooClever)) {
      tier = 'TOO CLEVER TRAP';
      points = 15;
      depthGained = 150;
      badgeClass = 'too-clever';
      emoji = '🟧';
      explanation = `⚠️ COLLISION DETECTED: You tried to pick a clever alternative, but thousands of other players had the exact same idea!`;
      sfx.playWarningBuzzer();
    } else if (isMatch(q.plankton)) {
      tier = 'PLANKTON';
      points = 8;
      depthGained = 80;
      badgeClass = 'plankton';
      emoji = '⬜';
      explanation = `Too obvious! This was the first answer that came to mind for almost everyone.`;
    } else {
      // General valid answer / fallback
      tier = 'UNLISTED VALID GUESS';
      points = 40;
      depthGained = 400;
      badgeClass = 'schooler';
      emoji = '🟪';
      explanation = `Recognized as potentially valid! Graded with a baseline depth of +400m.`;
      sfx.playSonarPing();
    }

    this.totalDepth = Math.min(7000, this.totalDepth + depthGained);
    this.sessionHistory.push({
      prompt: q.prompt,
      category: q.category,
      answer: userInput || '(Timeout)',
      tier,
      depthGained,
      emoji
    });

    // Mark dot done
    const dots = this.progressContainer.querySelectorAll('.progress-dot');
    if (dots[this.currentIndex]) {
      dots[this.currentIndex].classList.remove('active');
      dots[this.currentIndex].classList.add('done');
    }

    this.updateDepthDisplay();

    // Show feedback banner
    this.feedbackBadge.className = `feedback-tier-badge ${badgeClass}`;
    this.feedbackBadge.textContent = tier;
    this.feedbackPoints.textContent = `+${points} Points (+${depthGained}m Depth)`;
    this.feedbackExplanation.textContent = explanation;
    this.feedbackBanner.style.display = 'block';
  }

  updateDepthDisplay() {
    this.depthDisplay.textContent = `${this.totalDepth.toLocaleString()} meters`;

    let zone = 'Surface (0m - 200m)';
    if (this.totalDepth > 6000) zone = '🔥 Hadal Trench Floor (6,000m+)';
    else if (this.totalDepth > 4000) zone = 'Abyssopelagic Abyss (4,000m+)';
    else if (this.totalDepth > 1000) zone = 'Bathypelagic Midnight Zone (1,000m+)';
    else if (this.totalDepth > 200) zone = 'Mesopelagic Twilight Zone (200m+)';

    this.depthZone.textContent = `(${zone})`;

    const pct = Math.min(100, (this.totalDepth / 7000) * 100);
    this.depthFill.style.width = `${pct}%`;
    this.depthIcon.style.left = `${pct}%`;
  }

  advanceToNextPrompt() {
    this.currentIndex++;
    if (this.currentIndex >= 7) {
      this.finishGame();
    } else {
      this.loadCurrentPrompt();
    }
  }

  finishGame() {
    sfx.playSuccessChime();
    this.finalDepthStat.textContent = `${this.totalDepth.toLocaleString()} / 7,000m`;

    let title = 'Trench Diver';
    let icon = '🌊';
    if (this.totalDepth >= 6500) {
      title = '🏆 HADAL TRENCH CONQUEROR (One in a Krillion!)';
      icon = '👑';
    } else if (this.totalDepth >= 5000) {
      title = '🤿 Abyss Explorer';
      icon = '💎';
    } else if (this.totalDepth >= 3000) {
      title = '🐟 Midnight Swimmer';
      icon = '🐠';
    } else {
      title = '🦐 Plankton Drifter';
      icon = '🌿';
    }

    document.getElementById('summary-icon').textContent = icon;
    document.getElementById('summary-title').textContent = title;
    this.summaryTierName.textContent = `Final Depth: ${this.totalDepth}m • ${this.totalDepth >= 6000 ? 'Master' : 'Amateur'} Rank`;

    // Breakdown list
    this.summaryBreakdown.innerHTML = '';
    this.sessionHistory.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'summary-row-item';
      row.innerHTML = `
        <div>
          <strong>#${idx + 1} ${item.prompt}</strong>: 
          <span class="text-glow">${item.answer}</span>
        </div>
        <div style="font-weight:700;">${item.tier} (+${item.depthGained}m)</div>
      `;
      this.summaryBreakdown.appendChild(row);
    });

    // Generate Wordle/Krillion Share text
    const emojiBlocks = this.sessionHistory.map(h => h.emoji).join('');
    const shareText = `Krillion Unlimited 🌊
Depth: ${this.totalDepth.toLocaleString()}m / 7,000m
${emojiBlocks}
Can you reach the trench floor? Play free at https://krilliongame.org`;
    this.shareTextArea.value = shareText;

    this.summaryModal.style.display = 'flex';
  }
}

// --- Category Tabs Switcher ---
function initCategoryTabs() {
  const tabs = document.querySelectorAll('.cat-tab-btn');
  const panel = document.getElementById('category-panel-content');

  const categoryData = {
    geography: {
      title: "Geography Cheat Sheet (+110% Search Surge)",
      items: [
        { prompt: "European Capitals", answer: "Vaduz (Liechtenstein), Podgorica (Montenegro), Chisinau (Moldova)" },
        { prompt: "US State Capitals", answer: "Pierre (SD), Helena (MT), Juneau (AK), Frankfort (KY)" },
        { prompt: "Landlocked Countries", answer: "San Marino, Eswatini, Bhutan, Lesotho, Andorra" },
        { prompt: "Rivers in North America", answer: "Kuskokwim River, Gila River, Saint John River" }
      ]
    },
    movies: {
      title: "Movies & Cinema High-Depth Answers",
      items: [
        { prompt: "Christopher Nolan Films", answer: "Following (100m), Quay (95m) - Avoid Memento!" },
        { prompt: "Quentin Tarantino Films", answer: "Death Proof (100m), My Best Friend's Birthday (95m)" },
        { prompt: "Best Picture Oscar Winners (Pre-1970)", answer: "The Broadway Melody (1929), Cavalcade (1933), Marty (1955)" },
        { prompt: "James Bond Villains", answer: "Aristotle Kristatos, Brad Whitaker, General Koskov" }
      ]
    },
    sports: {
      title: "Sports & Olympics Deep Dive",
      items: [
        { prompt: "Summer Olympic Disciplines", answer: "Modern Pentathlon (100m), Canoe Slalom, Keirin, Omnium" },
        { prompt: "NFL Teams (East Divisions)", answer: "Washington Commanders (100m), Buffalo Bills (80m)" },
        { prompt: "World Cup Winning Nations", answer: "Uruguay (100m) - Avoid Brazil, Argentina, France!" },
        { prompt: "Tennis Grand Slam Venues", answer: "Melbourne Park (Court 3), Roland Garros (Court Simonne-Mathieu)" }
      ]
    },
    music: {
      title: "Music & Band Member High-Rarity Picks",
      items: [
        { prompt: "Queen Band Members", answer: "John Deacon (100m), Doug Bogie (100m), Mike Grose" },
        { prompt: "Brass Family Instruments", answer: "Euphonium, Mellophone, Ophicleide, Serpent" },
        { prompt: "Beatles Studio Albums", answer: "Beatles for Sale, With the Beatles - Avoid Abbey Road!" },
        { prompt: "Instruments in a String Quartet", answer: "Viola (100m), Cello (85m) - Avoid Violin!" }
      ]
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const catKey = tab.getAttribute('data-tab');
      const data = categoryData[catKey];
      if (!data) return;

      panel.innerHTML = `
        <div class="card glass-card">
          <h3 class="panel-head">${data.title}</h3>
          <p class="text-muted" style="margin-bottom:1rem;">Top rare picks that reliably avoid the "Too Clever" collision trap:</p>
          <div class="category-item-grid">
            ${data.items.map(item => `
              <div class="cat-item">
                <span class="cat-item-prompt">${item.prompt}:</span>
                <span class="cat-item-answer">${item.answer}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
  });
}

// --- Rarity Solver / Checker Tool ---
function initRaritySolver() {
  const input = document.getElementById('solver-input');
  const btn = document.getElementById('solver-check-btn');
  const resultsArea = document.getElementById('solver-results-area');

  const checkRarity = () => {
    const val = input.value.trim().toLowerCase();
    if (!val) return;

    // Search through all known answers in UNLIMITED_PROMPT_POOL
    let found = null;
    for (const q of UNLIMITED_PROMPT_POOL) {
      if (q.oneInAKrillion.some(x => x.toLowerCase() === val)) {
        found = { tier: 'ONE IN A KRILLION', score: 100, desc: 'Maximum trench depth! Outstanding obscure choice.', color: '#00ffc8' };
        break;
      }
      if (q.deepCut.some(x => x.toLowerCase() === val)) {
        found = { tier: 'DEEP CUT', score: 80, desc: 'Extremely rare, great chance of hitting top 5% score.', color: '#00d2ff' };
        break;
      }
      if (q.rare.some(x => x.toLowerCase() === val)) {
        found = { tier: 'RARE', score: 50, desc: 'Very solid. Only a small group of players think of this.', color: '#4cc9f0' };
        break;
      }
      if (q.tooClever.some(x => x.toLowerCase() === val)) {
        found = { tier: 'TOO CLEVER TRAP', score: 15, desc: 'High collision risk! Many players overthink to this exact word. Try a more obscure alternative.', color: '#ff9f1c' };
        break;
      }
      if (q.plankton.some(x => x.toLowerCase() === val)) {
        found = { tier: 'PLANKTON', score: 8, desc: 'Obvious surface pick. Almost everyone thinks of this first.', color: '#8b9bb4' };
        break;
      }
    }

    if (found) {
      resultsArea.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <h4 style="font-size:1.2rem; color:#fff;">"${input.value}"</h4>
          <span style="background:${found.color}22; color:${found.color}; border:1px solid ${found.color}; padding:0.25rem 0.75rem; border-radius:999px; font-weight:800; font-size:0.85rem;">
            ${found.tier} (${found.score} pts)
          </span>
        </div>
        <p style="color:#d1d5db; font-size:0.95rem;">${found.desc}</p>
      `;
    } else {
      // Estimated rating based on character length and rarity heuristics
      const isShortCommon = val.length <= 4;
      const predicted = isShortCommon ? 'Schooler / Plankton' : 'Potentially Deep Cut / Rare';
      resultsArea.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <h4 style="font-size:1.2rem; color:#fff;">"${input.value}"</h4>
          <span style="background:rgba(255,255,255,0.1); color:#fff; padding:0.25rem 0.75rem; border-radius:999px; font-size:0.85rem;">
            Custom Word Checked
          </span>
        </div>
        <p style="color:#d1d5db; font-size:0.95rem;">
          Estimated Rarity: <strong>${predicted}</strong>. If valid for the category, uncommon multi-syllable terms typically score deep in the trench.
        </p>
      `;
    }
  };

  btn.addEventListener('click', checkRarity);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkRarity();
  });
}

// --- Historical Archive Renderer ---
function initArchive() {
  const grid = document.getElementById('archive-grid');
  grid.innerHTML = ARCHIVE_GAMES.map(game => `
    <div class="archive-card">
      <div class="archive-head">
        <span class="archive-game-num">Game #${game.gameNumber}</span>
        <span class="archive-date">${game.date}</span>
      </div>
      <div class="archive-depth">Top Trench Depth: ${game.bestDepth}</div>
      <p class="archive-highlights">${game.highlights}</p>
    </div>
  `).join('');
}

// --- Initialize App On Load ---
document.addEventListener('DOMContentLoaded', () => {
  new KrillionGame();
  initCategoryTabs();
  initRaritySolver();
  initArchive();
});
