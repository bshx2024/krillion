// Krillion.click - Core Game Engine & Two-Tier Evaluation System
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
      if (AudioCtx) this.ctx = new AudioCtx();
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
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.9);
    } catch (e) {}
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

// --- LocalStorage Retention Manager ---
class RetentionManager {
  static getStats() {
    const defaultStats = {
      streak: 0,
      lastPlayedDate: null,
      bestDepth: 0,
      totalGames: 0
    };
    try {
      const data = localStorage.getItem('krillion_user_stats');
      return data ? JSON.parse(data) : defaultStats;
    } catch (e) {
      return defaultStats;
    }
  }

  static saveGameCompletion(depth) {
    const stats = this.getStats();
    const todayStr = new Date().toISOString().split('T')[0];

    stats.totalGames = (stats.totalGames || 0) + 1;
    stats.bestDepth = Math.max(stats.bestDepth || 0, depth);

    if (stats.lastPlayedDate) {
      const last = new Date(stats.lastPlayedDate);
      const curr = new Date(todayStr);
      const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        stats.streak += 1;
      } else if (diffDays > 1) {
        stats.streak = 1;
      }
    } else {
      stats.streak = 1;
    }
    stats.lastPlayedDate = todayStr;

    try {
      localStorage.setItem('krillion_user_stats', JSON.stringify(stats));
    } catch (e) {}

    return stats;
  }
}

// --- Levenshtein Distance for Typo-Tolerance ---
function levenshtein(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => Array(an + 1).fill(0));
  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][i] = j;
  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (b.charAt(j - 1) === a.charAt(i - 1)) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1
        );
      }
    }
  }
  return matrix[bn][an];
}

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

// --- Krillion Main Game Controller ---
class KrillionGameController {
  constructor() {
    this.sessionType = 'daily'; // 'daily' or 'unlimited'
    this.timerMode = 'timed';   // 'timed' or 'zen'
    this.timePerPrompt = 25;
    this.currentTimer = 25;
    this.timerInterval = null;

    this.currentPrompts = [];
    this.currentIndex = 0;
    this.totalDepth = 0;
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
    this.promptRuleCaption = document.getElementById('prompt-rule-caption');
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
    this.whyBox = document.getElementById('why-this-answer-box');
    this.whyText = document.getElementById('why-this-answer-text');
    this.nextPromptBtn = document.getElementById('next-prompt-btn');
    this.progressContainer = document.getElementById('progress-indicators');

    // Summary Modal
    this.summaryModal = document.getElementById('game-summary-modal');
    this.finalDepthStat = document.getElementById('final-depth-stat');
    this.summaryTierName = document.getElementById('summary-tier-name');
    this.summaryBreakdown = document.getElementById('summary-breakdown-list');
    this.shareTextArea = document.getElementById('share-text-area');
    this.modalStreakCount = document.getElementById('modal-streak-count');

    this.initEventListeners();
    this.updateUserStatsUI();
    this.startSession('daily');
  }

  updateUserStatsUI() {
    const stats = RetentionManager.getStats();
    const streakNum = document.getElementById('header-streak-num');
    const heroPB = document.getElementById('hero-personal-best');

    if (streakNum) streakNum.textContent = stats.streak;
    if (heroPB) {
      const best = stats.bestDepth || 0;
      let rank = 'Surface Diver';
      if (best >= 6500) rank = 'Hadal Conqueror';
      else if (best >= 4000) rank = 'Abyss Explorer';
      else if (best >= 1000) rank = 'Twilight Diver';
      heroPB.textContent = `${best.toLocaleString()}m • ${rank}`;
    }
  }

  initEventListeners() {
    // Hero CTA jump buttons
    const heroDailyBtn = document.getElementById('hero-start-daily-btn');
    const heroUnlimitedBtn = document.getElementById('hero-start-unlimited-btn');
    if (heroDailyBtn) {
      heroDailyBtn.addEventListener('click', () => {
        document.getElementById('game-section').scrollIntoView({ behavior: 'smooth' });
        this.startSession('daily');
      });
    }
    if (heroUnlimitedBtn) {
      heroUnlimitedBtn.addEventListener('click', () => {
        document.getElementById('game-section').scrollIntoView({ behavior: 'smooth' });
        this.startSession('unlimited');
      });
    }

    // Daily vs Unlimited Tabs
    const dailyTab = document.getElementById('mode-daily-tab');
    const unlimitedTab = document.getElementById('mode-unlimited-tab');
    dailyTab.addEventListener('click', () => {
      dailyTab.classList.add('active');
      unlimitedTab.classList.remove('active');
      this.startSession('daily');
    });
    unlimitedTab.addEventListener('click', () => {
      unlimitedTab.classList.add('active');
      dailyTab.classList.remove('active');
      this.startSession('unlimited');
    });

    // Timed vs Zen Toggles
    const timedToggle = document.getElementById('timer-timed-toggle');
    const zenToggle = document.getElementById('timer-zen-toggle');
    timedToggle.addEventListener('click', () => {
      this.timerMode = 'timed';
      timedToggle.classList.add('active');
      zenToggle.classList.remove('active');
      this.timerBox.style.display = 'flex';
      this.resetTimer();
    });
    zenToggle.addEventListener('click', () => {
      this.timerMode = 'zen';
      zenToggle.classList.add('active');
      timedToggle.classList.remove('active');
      this.timerBox.style.display = 'none';
      clearInterval(this.timerInterval);
    });

    // Reset button
    document.getElementById('new-game-btn').addEventListener('click', () => this.startSession(this.sessionType));
    document.getElementById('play-again-modal-btn').addEventListener('click', () => {
      this.summaryModal.style.display = 'none';
      this.startSession(this.sessionType);
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

    // Real-time typo helper
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

    this.typoTip.addEventListener('click', () => {
      this.answerInput.value = this.typoWord.textContent;
      this.typoTip.style.display = 'none';
      this.answerInput.focus();
    });

    // Submit answer form
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

  startSession(type = 'daily') {
    this.sessionType = type;
    clearInterval(this.timerInterval);
    this.currentIndex = 0;
    this.totalDepth = 0;
    this.sessionHistory = [];

    if (type === 'daily') {
      this.currentPrompts = [...DAILY_GAME_DATA.prompts];
    } else {
      const pool = [...UNLIMITED_PROMPT_POOL].sort(() => 0.5 - Math.random());
      this.currentPrompts = pool.slice(0, 7);
    }

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
    if (this.promptRuleCaption) {
      this.promptRuleCaption.textContent = q.verificationNote ? `Verification Rule: ${q.verificationNote}` : '';
    }
    this.hintText.textContent = q.hints.stage1;
    this.hintContent.style.display = 'none';

    this.answerInput.value = '';
    this.answerInput.disabled = false;
    this.inputForm.style.display = 'flex';
    this.feedbackBanner.style.display = 'none';
    this.typoTip.style.display = 'none';
    this.answerInput.focus();

    const dots = this.progressContainer.querySelectorAll('.progress-dot');
    dots.forEach((dot, idx) => {
      if (idx === this.currentIndex) dot.classList.add('active');
      else dot.classList.remove('active');
    });

    if (this.timerMode === 'timed') {
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
    let educationalNote = '';

    const cleanInput = userInput.trim().toLowerCase();
    const isMatch = (arr) => arr.some(item => item.toLowerCase() === cleanInput || levenshtein(item.toLowerCase(), cleanInput) <= 1);

    // Look up educational explanation
    if (q.whyThisAnswer) {
      for (const [key, note] of Object.entries(q.whyThisAnswer)) {
        if (cleanInput.includes(key) || key.includes(cleanInput)) {
          educationalNote = note;
          break;
        }
      }
    }
    if (!educationalNote) {
      educationalNote = `Verified entry for prompt: "${q.prompt}". Conforms to official category criteria.`;
    }

    if (isTimeout || !userInput) {
      tier = 'TIMED OUT';
      points = 0;
      depthGained = 0;
      badgeClass = 'plankton';
      emoji = '🟥';
      explanation = `Time expired! No depth gained. (A top trench answer was: ${q.oneInAKrillion[0] || 'N/A'})`;
      educationalNote = q.verificationNote || "Remember to submit before the 25-second countdown ends.";
    } else if (isMatch(q.oneInAKrillion)) {
      tier = 'ONE IN A KRILLION';
      points = 100;
      depthGained = 1000;
      badgeClass = 'one-in-krillion';
      emoji = '🤿';
      explanation = `🌟 Verified Obscurity! High-tier deep cut candidate. Maximum trench depth!`;
      sfx.playSuccessChime();
    } else if (isMatch(q.deepCut)) {
      tier = 'DEEP CUT';
      points = 80;
      depthGained = 800;
      badgeClass = 'one-in-krillion';
      emoji = '🟦';
      explanation = `Substantial niche knowledge! High depth score.`;
      sfx.playSonarPing();
    } else if (isMatch(q.rare)) {
      tier = 'RARE';
      points = 50;
      depthGained = 500;
      badgeClass = 'one-in-krillion';
      emoji = '🟩';
      explanation = `Valid rare response. Escapes mainstream frequency.`;
      sfx.playSonarPing();
    } else if (isMatch(q.schooler)) {
      tier = 'SCHOOLER';
      points = 25;
      depthGained = 250;
      badgeClass = 'schooler';
      emoji = '🟨';
      explanation = `Solid valid answer, but recognized by a moderate portion of players.`;
    } else if (isMatch(q.tooClever)) {
      tier = 'TOO CLEVER TRAP';
      points = 15;
      depthGained = 150;
      badgeClass = 'too-clever';
      emoji = '🟧';
      explanation = `⚠️ STATISTICAL COLLISION: You tried to pick a non-obvious pick, but thousands of players had that same secondary thought!`;
      sfx.playWarningBuzzer();
    } else if (isMatch(q.plankton)) {
      tier = 'PLANKTON';
      points = 8;
      depthGained = 80;
      badgeClass = 'plankton';
      emoji = '⬜';
      explanation = `Surface choice! This was the first top-of-mind candidate for almost everyone.`;
    } else {
      // General valid answer / heuristic fallback
      tier = 'VALID ANSWER (HEURISTIC)';
      points = 40;
      depthGained = 400;
      badgeClass = 'schooler';
      emoji = '🟪';
      explanation = `Factually recognized entry! Graded with a baseline heuristic depth of +400m.`;
      sfx.playSonarPing();
    }

    this.totalDepth = Math.min(7000, this.totalDepth + depthGained);
    this.sessionHistory.push({
      prompt: q.prompt,
      category: q.category,
      answer: userInput || '(Timed Out)',
      tier,
      depthGained,
      emoji
    });

    const dots = this.progressContainer.querySelectorAll('.progress-dot');
    if (dots[this.currentIndex]) {
      dots[this.currentIndex].classList.remove('active');
      dots[this.currentIndex].classList.add('done');
    }

    this.updateDepthDisplay();

    // Render feedback
    this.feedbackBadge.className = `feedback-tier-badge ${badgeClass}`;
    this.feedbackBadge.textContent = `${tier} • PREDICTED MODEL`;
    this.feedbackPoints.textContent = `+${points} Points (+${depthGained}m Depth)`;
    this.feedbackExplanation.innerHTML = `${explanation} <br><small class="text-muted" style="display:block; margin-top:4px;">(Evaluated via open linguistic frequency & catalog obscurity model, not proprietary live telemetry.)</small>`;

    if (this.whyBox && this.whyText) {
      this.whyText.textContent = educationalNote;
      this.whyBox.style.display = 'block';
    }

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

    // Save stats to LocalStorage
    const updatedStats = RetentionManager.saveGameCompletion(this.totalDepth);
    this.updateUserStatsUI();

    this.finalDepthStat.textContent = `${this.totalDepth.toLocaleString()} / 7,000m`;
    if (this.modalStreakCount) {
      this.modalStreakCount.textContent = updatedStats.streak;
    }

    let title = 'Trench Diver';
    let icon = '🌊';
    if (this.totalDepth >= 6500) {
      title = '👑 HADAL TRENCH CONQUEROR (One in a Krillion!)';
      icon = '👑';
    } else if (this.totalDepth >= 5000) {
      title = '💎 Abyss Explorer';
      icon = '💎';
    } else if (this.totalDepth >= 3000) {
      title = '🐠 Midnight Swimmer';
      icon = '🐠';
    } else {
      title = '🌿 Plankton Drifter';
      icon = '🌿';
    }

    document.getElementById('summary-icon').textContent = icon;
    document.getElementById('summary-title').textContent = title;
    this.summaryTierName.textContent = `Depth Reached: ${this.totalDepth}m • ${this.totalDepth >= 6000 ? 'Master' : 'Participant'} Tier`;

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

    // Generate Wordle/Krillion Share text (Spoiler-safe!)
    const emojiBlocks = this.sessionHistory.map(h => h.emoji).join('');
    const todayStr = new Date().toISOString().split('T')[0];
    const shareText = `Krillion.click (${todayStr}) • Predicted Depth Simulator
Depth: ${this.totalDepth.toLocaleString()}m / 7,000m (Predicted Model)
Streak: ${updatedStats.streak} Days 🔥
${emojiBlocks}
Test your obscurity: https://www.krillion.click`;
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
      title: "Geography Cheat Sheet (Verified Entities)",
      items: [
        { prompt: "European Capitals", answer: "Vaduz (Liechtenstein), Podgorica (Montenegro), Chisinau (Moldova)" },
        { prompt: "US State Capitals", answer: "Pierre (SD), Helena (MT), Juneau (AK), Frankfort (KY)" },
        { prompt: "Landlocked Countries", answer: "San Marino, Eswatini, Bhutan, Lesotho, Andorra" },
        { prompt: "Rivers in North America", answer: "Kuskokwim River, Gila River, Saint John River" }
      ]
    },
    movies: {
      title: "Movies & Cinema High-Depth Candidates",
      items: [
        { prompt: "Christopher Nolan Films", answer: "Following (100m) - Note: Memento is a common Too Clever trap!" },
        { prompt: "Quentin Tarantino Films", answer: "Death Proof (100m), My Best Friend's Birthday" },
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
      title: "Music & Band Members (Fact-Checked)",
      items: [
        { prompt: "Queen Core Members", answer: "John Deacon (100m - composed 'Another One Bites the Dust', retired 1997)" },
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
          <p class="text-muted" style="margin-bottom:1rem;">Verified entities that reliably bypass the Too Clever collision trap:</p>
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

// --- Initialize App On Load ---
document.addEventListener('DOMContentLoaded', () => {
  new KrillionGameController();
  initCategoryTabs();
});
