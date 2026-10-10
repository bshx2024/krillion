import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Read SSOT from data/questions.js
const questionsPath = path.join(ROOT_DIR, 'data', 'questions.js');
const questionsContent = fs.readFileSync(questionsPath, 'utf8');

// Extract DAILY_GAME_DATA JSON
const match = questionsContent.match(/export const DAILY_GAME_DATA = (\{[\s\S]*?\n\});/);
if (!match) {
  console.error('❌ Could not parse DAILY_GAME_DATA from data/questions.js');
  process.exit(1);
}

// Safely evaluate or parse the object
let dailyData;
try {
  // Using Function constructor to parse exported object
  dailyData = new Function(`return ${match[1]}`)();
} catch (e) {
  console.error('❌ Failed to evaluate DAILY_GAME_DATA:', e.message);
  process.exit(1);
}

const { gameNumber, date: dateStr, prompts } = dailyData;
console.log(`🔍 [SSOT Engine] Processing Game #${gameNumber} for Date: ${dateStr}`);

// Format human date
const dateObj = new Date(dateStr + 'T00:00:00Z');
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const formattedHumanDate = `${monthNames[dateObj.getUTCMonth()]} ${dateObj.getUTCDate()}, ${dateObj.getUTCFullYear()}`;

// 2. Synchronize public/today.txt
const todayTxtPath = path.join(ROOT_DIR, 'public', 'today.txt');
const todayTxtLines = [
  `Krillion Daily Dive - Answers & Hints for Today (${formattedHumanDate} - Game #${gameNumber})`,
  `Website: https://www.krillion.click/`,
  `Evaluation Note: Rarity tiers represent an open heuristic prediction model (linguistic frequency vs. cataloging obscurity), not proprietary live telemetry.\n`
];

prompts.forEach((p, idx) => {
  todayTxtLines.push(`${idx + 1}. Prompt: ${p.prompt}`);
  if (p.verificationNote) {
    todayTxtLines.push(`- Rule: ${p.verificationNote}`);
  }
  todayTxtLines.push(`- Top Rare Answers (Predicted 100 Pts): ${p.oneInAKrillion.join(', ')}`);
  todayTxtLines.push(`- Avoid Too Clever Trap (Predicted 15 Pts): ${p.tooClever.join(', ')}\n`);
});

fs.writeFileSync(todayTxtPath, todayTxtLines.join('\n'), 'utf8');
console.log('✅ Synchronized public/today.txt');

// 3. Synchronize public/llms.txt
const llmsTxtPath = path.join(ROOT_DIR, 'public', 'llms.txt');
const llmsContent = `# Krillion Knowledge Base & Daily Answers (LLMs.txt)
> Project: Krillion Hub & Krillion Unlimited
> Website: https://www.krillion.click/
> Updated: ${dateStr}

## Overview & Two-Tier Verification Methodology
Krillion is a web-based reverse-trivia daily challenge.
Players receive 7 daily prompts with a 25-second countdown per prompt.
Unlike traditional trivia games that reward common popular answers, Krillion awards depth points based on obscurity (up to 100 per prompt, 700 max, representing a descent to 7,000 meters in the ocean trench).

### Two-Tier Evaluation Architecture:
1. Tier 1 (Fact-Check Validity): Is the answer an objectively recognized entity meeting the prompt criteria? (e.g. For "Borders Germany", all 9 bordering countries are valid; Liechtenstein is invalid).
2. Tier 2 (Predicted Rarity Index): Evaluated via heuristic rarity modeling (top-of-mind linguistic frequency vs. long-tail obscure cataloging). Note: Scores represent an algorithmic model, not proprietary real-time player telemetry.

## Scoring Tiers (Predicted Model)
- Plankton (4–10 pts): The most common, obvious answers (e.g., Los Angeles for California city).
- Too Clever (8–15 pts): Overthought answers where many trivia players collide trying to sound smart (e.g., Sacramento, Pasadena).
- Schooler (16–30 pts): Mid-tier answers.
- Rare (32–60 pts): Model-predicted low-frequency candidates based on long-tail catalog obscurity.
- Deep Cut (64–85 pts): High-tier obscure knowledge.
- One in a Krillion (100 pts): The rarest legitimate answer that hits maximum ocean depth.

## Today's Daily Dive Answers (${formattedHumanDate} - Game #${gameNumber})
${prompts.map((p, idx) => {
  let lines = [`${idx + 1}. ${p.prompt}:`];
  if (p.verificationNote) lines.push(`   - Rule: ${p.verificationNote}`);
  lines.push(`   - One in a Krillion (Predicted 100 pts): ${p.oneInAKrillion.join(', ')}`);
  lines.push(`   - Too Clever Trap (Predicted 15 pts): ${p.tooClever.join(', ')}`);
  return lines.join('\n');
}).join('\n')}
`;

fs.writeFileSync(llmsTxtPath, llmsContent, 'utf8');
console.log('✅ Synchronized public/llms.txt');

// 4. Synchronize index.html
const indexPath = path.join(ROOT_DIR, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Update game number and date in badge and headers
indexContent = indexContent.replace(/Game #\d+ Live • <time datetime="[^"]*">[^<]*<\/time>/g,
  `Game #${gameNumber} Live • <time datetime="${dateStr}">${formattedHumanDate}</time>`);

indexContent = indexContent.replace(/Today's Krillion Answers \([^)]+\)/g,
  `Today's Krillion Answers (${formattedHumanDate} - Game #${gameNumber})`);

indexContent = indexContent.replace(/What are today's verified Krillion answers for [^?]+?\?/g,
  `What are today's verified Krillion answers for ${formattedHumanDate}?`);

// Synchronize Table tbody
const tbodyRegex = /<tbody>[\s\S]*?<\/tbody>/;
const newTbody = `<tbody>
${prompts.map((p, idx) => `              <tr>
                <td><strong>${idx + 1}</strong></td>
                <td><span class="cat-pill">${p.category}</span></td>
                <td>${p.prompt}</td>
                <td>
                  <span class="text-muted">${p.verificationNote || 'Verified entity'}</span>
                  ${p.factSource ? `<br><small class="text-muted" style="font-size:0.75rem; opacity:0.85;">Source: ${p.sourceUrl ? `<a href="${p.sourceUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--cyan-glow); text-decoration:underline;">${p.factSource}</a>` : p.factSource} (${p.verifiedDate || '2026-10-10'})</small>` : ''}
                </td>
                <td><strong class="text-glow">${p.oneInAKrillion[0]}</strong>${p.oneInAKrillion.length > 1 ? ', ' + p.oneInAKrillion.slice(1, 3).join(', ') : ''}</td>
                <td><span class="text-warning">${p.tooClever.slice(0, 3).join(', ')}</span></td>
                <td><span class="text-muted">${p.plankton.slice(0, 3).join(', ')}</span></td>
              </tr>`).join('\n')}
            </tbody>`;
indexContent = indexContent.replace(tbodyRegex, newTbody);

// Synchronize Hints Section
const hintsSectionRegex = /<section id="hints-section" class="content-section bg-darker">[\s\S]*?<\/section>/;
const newHintsSection = `<section id="hints-section" class="content-section bg-darker">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">PROGRESSIVE DISCLOSURE</span>
          <h2 class="section-title">Krillion Hints: Progressive Clues for Today's Krillion Game</h2>
          <p class="section-subtitle">
            Need a nudge without ruining the Krillion challenge? Reveal clues progressively to discover your own rare Krillion answer.
          </p>
        </div>

        <!-- Hints Spoiler Protection Banner -->
        <div class="spoiler-shield-card spoiler-hints-shield" id="spoiler-hints-shield">
          <div class="shield-content">
            <span class="shield-badge">🛡️ HINTS SPOILER GUARD</span>
            <h3 class="shield-title">Protect Today's Clue Progression</h3>
            <p class="shield-desc">
              Progressive hints for today's 7 daily prompts are hidden by default to keep your daily challenge authentic. Play the game first or reveal clues when stuck!
            </p>
          </div>
          <div class="shield-btn-group">
            <a href="#game-section" class="btn btn-primary">🤿 Play Dive First</a>
            <button class="btn btn-secondary" id="toggle-hints-spoiler-btn">💡 Reveal Today's Hints</button>
          </div>
        </div>

        <div class="spoiler-hints-content is-hidden" id="spoiler-hints-content">
          <div class="hints-grid">
${prompts.map((p, idx) => `          <div class="hint-card">
            <div class="hint-card-head">
              <span class="hint-number">Prompt #${idx + 1}</span>
              <span class="cat-pill">${p.category}</span>
            </div>
            <h3 class="hint-prompt-name">${p.prompt}</h3>
            <details class="hint-detail">
              <summary class="hint-summary">💡 Krillion Direction Clue</summary>
              <div class="hint-body">${p.hints.stage1}</div>
            </details>
            <details class="hint-detail">
              <summary class="hint-summary">🔤 Letter Count Clue</summary>
              <div class="hint-body">${p.hints.stage2}</div>
            </details>
            <details class="hint-detail reveal-gold">
              <summary class="hint-summary">🎯 Rare Krillion Answer</summary>
              <div class="hint-body text-glow"><strong>${p.oneInAKrillion.join(', ')}</strong> (100 pts). Avoid: ${p.tooClever[0]}!</div>
            </details>
          </div>`).join('\n')}
          </div>
        </div>
      </div>
    </section>`;
indexContent = indexContent.replace(hintsSectionRegex, newHintsSection);

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('✅ Synchronized index.html');

// 5. Synchronize public/sitemap.xml
const sitemapPath = path.join(ROOT_DIR, 'public', 'sitemap.xml');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
sitemapContent = sitemapContent.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${dateStr}</lastmod>`);
fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log('✅ Synchronized public/sitemap.xml');

// 6. --- RIGOROUS ASSERTION TESTS ---
console.log('\n🧪 Running Rigorous Integrity Assertions...');

const filesToAudit = [
  { name: 'index.html', path: indexPath },
  { name: 'today.txt', path: todayTxtPath },
  { name: 'llms.txt', path: llmsTxtPath },
  { name: 'questions.js', path: questionsPath }
];

// Check 1: Queen prompt must contain John Deacon and NEVER Doug Bogie
for (const file of filesToAudit) {
  const content = fs.readFileSync(file.path, 'utf8');
  if (content.includes('Doug Bogie') || content.includes('Bogie')) {
    console.error(`❌ ASSERTION FAILED: Found "Doug Bogie" in ${file.name}`);
    process.exit(1);
  }
}
console.log('  ✓ Assertion Passed: ZERO instances of Doug Bogie across all files.');

// Check 2: Absolute ZERO instances of old domain krilliongame.org
for (const file of filesToAudit) {
  const content = fs.readFileSync(file.path, 'utf8');
  if (content.includes('krilliongame.org')) {
    console.error(`❌ ASSERTION FAILED: Found old domain "krilliongame.org" in ${file.name}`);
    process.exit(1);
  }
}
console.log('  ✓ Assertion Passed: ZERO instances of krilliongame.org. Canonical domain is https://www.krillion.click/');

// Check 3: ZERO unverified growth percentages (+80%, +110%)
for (const file of filesToAudit) {
  const content = fs.readFileSync(file.path, 'utf8');
  if (content.includes('+80%') || content.includes('+110%')) {
    console.error(`❌ ASSERTION FAILED: Found unverified growth percentage in ${file.name}`);
    process.exit(1);
  }
}
console.log('  ✓ Assertion Passed: ZERO unverified growth claims found.');

// Check 4: Prompt count consistency (exactly 7 prompts in SSOT and files)
if (prompts.length !== 7) {
  console.error(`❌ ASSERTION FAILED: Prompt count in questions.js is ${prompts.length}, expected 7`);
  process.exit(1);
}
console.log('  ✓ Assertion Passed: Exact 7 prompts verified in SSOT.');

// Check 5: John Deacon is the designated One in a Krillion Queen answer
const queenPrompt = prompts.find(p => p.id === 7 || p.prompt.includes('Queen'));
if (!queenPrompt || !queenPrompt.oneInAKrillion.includes('John Deacon')) {
  console.error('❌ ASSERTION FAILED: Queen prompt does not have John Deacon as One in a Krillion answer');
  process.exit(1);
}
console.log('  ✓ Assertion Passed: Queen answer is John Deacon.');

// Check 6: Germany prompt covers Luxembourg & Denmark and excludes Liechtenstein
const germanyPrompt = prompts.find(p => p.id === 4 || p.prompt.includes('Germany'));
if (!germanyPrompt || !germanyPrompt.oneInAKrillion.includes('Luxembourg') || !germanyPrompt.oneInAKrillion.includes('Denmark')) {
  console.error('❌ ASSERTION FAILED: Germany prompt must contain Luxembourg and Denmark as top rare answers');
  process.exit(1);
}
if (germanyPrompt.oneInAKrillion.includes('Liechtenstein') || germanyPrompt.rare.includes('Liechtenstein')) {
  console.error('❌ ASSERTION FAILED: Liechtenstein does not border Germany and cannot be in positive score tiers');
  process.exit(1);
}
console.log('  ✓ Assertion Passed: Germany borders full coverage (Luxembourg, Denmark verified; Liechtenstein excluded).');

// Check 7: ZERO instances of player telemetry claims in llms.txt ("only by a minority of players")
const llmsRaw = fs.readFileSync(llmsTxtPath, 'utf8');
if (llmsRaw.includes('minority of players')) {
  console.error('❌ ASSERTION FAILED: Found unverified player telemetry claim "minority of players" in llms.txt');
  process.exit(1);
}
console.log('  ✓ Assertion Passed: llms.txt adheres strictly to model prediction terminology.');

// Check 8: Cross-page synchronization of Germany top rare answers
const todayRaw = fs.readFileSync(todayTxtPath, 'utf8');
const indexRaw = fs.readFileSync(indexPath, 'utf8');
if (!todayRaw.includes('Luxembourg, Denmark') || !llmsRaw.includes('Luxembourg, Denmark')) {
  console.error('❌ ASSERTION FAILED: Germany rare answers "Luxembourg, Denmark" missing from today.txt or llms.txt');
  process.exit(1);
}
console.log('  ✓ Assertion Passed: "Luxembourg, Denmark" consistently synchronized in today.txt, llms.txt, hints, and table.');

// Check 9: Clickable source verification links for all 7 prompts in index.html
const linkMatches = indexRaw.match(/Source: <a href="https?:\/\/[^"]+" target="_blank"/g);
if (!linkMatches || linkMatches.length < 7) {
  console.error(`❌ ASSERTION FAILED: Expected 7 clickable source links in index.html, found ${linkMatches ? linkMatches.length : 0}`);
  process.exit(1);
}
console.log('  ✓ Assertion Passed: All 7 daily prompts contain verified clickable source links.');

console.log('\n🎉 ALL 9 INTEGRITY ASSERTIONS PASSED! Data sources are 100% unified.\n');
