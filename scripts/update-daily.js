// scripts/update-daily.js
// Automated Daily Engine for Krillion Hub & Unlimited
// Runs daily via GitHub Actions or manual command: node scripts/update-daily.js [YYYY-MM-DD]

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Baseline Anchor: 2026-10-10 is Game #46
const ANCHOR_DATE = new Date('2026-10-10T00:00:00Z');
const ANCHOR_GAME_NUM = 46;

// Determine target date
const targetArg = process.argv[2];
const targetDate = targetArg ? new Date(`${targetArg}T00:00:00Z`) : new Date();
const dateStr = targetDate.toISOString().split('T')[0];

const dayDiff = Math.floor((targetDate.getTime() - ANCHOR_DATE.getTime()) / (1000 * 60 * 60 * 24));
const gameNumber = ANCHOR_GAME_NUM + dayDiff;

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const formattedHumanDate = `${months[targetDate.getUTCMonth()]} ${targetDate.getUTCDate()}, ${targetDate.getUTCFullYear()}`;

console.log(`[Krillion Daily Engine] Updating for ${formattedHumanDate} (${dateStr}) -> Game #${gameNumber}`);

// Rotating prompt library ensuring unique daily combinations
const SCHEDULED_SETS = [
  // Set 0 (Anchor: Oct 10)
  [
    {
      id: 1,
      category: "Geography",
      prompt: "A city in California",
      hints: {
        stage1: "Think beyond Southern California coastal giants; think northern inland or historic small valley towns.",
        stage2: "Starts with 'O' or 'W', short 4-letter name famous for citrus or mountain views.",
        stage3: "Ojai (100 pts) / Weed (100 pts) / Yreka (95 pts)"
      },
      plankton: ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
      tooClever: ["Sacramento", "Oakland", "Pasadena", "Berkeley", "Fresno"],
      schooler: ["Anaheim", "Bakersfield", "Santa Barbara", "Long Beach"],
      rare: ["Eureka", "Chico", "Solvang", "Oceanside", "Truckee"],
      deepCut: ["Ukiah", "Arcata", "Sonora", "Bishop", "Fort Bragg"],
      oneInAKrillion: ["Ojai", "Weed", "Yreka", "Dunsmuir", "Point Arena"]
    },
    {
      id: 2,
      category: "Biology / Animals",
      prompt: "A mammal starting with the letter 'B'",
      hints: {
        stage1: "A shy Southeast Asian nocturnal civet-like tree dweller that smells like buttered popcorn.",
        stage2: "Starts with 'Bi...', 9 letters long.",
        stage3: "Binturong (100 pts) / Bilby (95 pts)"
      },
      plankton: ["Bear", "Bat", "Beaver", "Badger"],
      tooClever: ["Baboon", "Buffalo", "Bonobo", "Blue Whale"],
      schooler: ["Bison", "Boar", "Bandicoot", "Bobcat"],
      rare: ["Bongo", "Blesbok", "Beluga", "Bushbaby"],
      deepCut: ["Bharal", "Babirusa", "Baiji", "Bettong"],
      oneInAKrillion: ["Binturong", "Bilby", "Bassariscus", "Beira", "Bison antiquus"]
    },
    {
      id: 3,
      category: "Movies & Cinema",
      prompt: "A movie directed by Quentin Tarantino",
      hints: {
        stage1: "His lesser-known homage to 1970s exploitation slashers / muscle cars with Kurt Russell.",
        stage2: "Starts with 'D...', two words, released as part of Grindhouse.",
        stage3: "Death Proof (100 pts)"
      },
      plankton: ["Pulp Fiction", "Kill Bill", "Django Unchained", "Inglourious Basterds"],
      tooClever: ["Reservoir Dogs", "Once Upon a Time in Hollywood", "The Hateful Eight"],
      schooler: ["Jackie Brown", "Kill Bill Vol 2"],
      rare: ["Grindhouse", "Four Rooms"],
      deepCut: ["Sin City (Guest Director)", "Natural Born Killers (Story)"],
      oneInAKrillion: ["Death Proof", "My Best Friend's Birthday"]
    },
    {
      id: 4,
      category: "World Geography",
      prompt: "A country that borders Germany",
      hints: {
        stage1: "Think about the smallest landlocked duchy or the northern peninsula border.",
        stage2: "Starts with 'L...', tiny European microstate.",
        stage3: "Luxembourg (100 pts) / Denmark (90 pts)"
      },
      plankton: ["France", "Poland", "Austria", "Switzerland"],
      tooClever: ["Netherlands", "Belgium", "Czech Republic"],
      schooler: ["Czechia", "The Netherlands"],
      rare: ["Denmark"],
      deepCut: ["Liechtenstein (TRICK: Does NOT border Germany directly!)"],
      oneInAKrillion: ["Luxembourg"]
    },
    {
      id: 5,
      category: "Food & Cuisine",
      prompt: "A pasta shape or variety",
      hints: {
        stage1: "Sardinian or Sicilian twisted artisanal shapes, or delicate stuffed pasta.",
        stage2: "Starts with 'C...' or 'T...', rare curled or ear-shaped noodles.",
        stage3: "Campanelle (100 pts) / Culurgiones (100 pts)"
      },
      plankton: ["Spaghetti", "Penne", "Fettuccine", "Macaroni", "Fusilli"],
      tooClever: ["Ravioli", "Gnocchi", "Orzo", "Farfalle", "Rigatoni"],
      schooler: ["Tagliatelle", "Linguine", "Cannelloni", "Cavatappi"],
      rare: ["Pappardelle", "Orecchiette", "Bucatini", "Tortellini"],
      deepCut: ["Paccheri", "Garganelli", "Strozzapreti", "Casarecce"],
      oneInAKrillion: ["Campanelle", "Culurgiones", "Busiate", "Trofie", "Casoncelli"]
    },
    {
      id: 6,
      category: "Sports & Olympics",
      prompt: "A Summer Olympic sport / event",
      hints: {
        stage1: "Modern or specialized events introduced recently or niche equestrian disciplines.",
        stage2: "Modern pentathlon sub-discipline, or urban sports like breakdance / canoeing.",
        stage3: "Modern Pentathlon (100 pts) / Canoe Slalom (95 pts)"
      },
      plankton: ["Swimming", "Athletics", "Gymnastics", "Basketball", "Soccer"],
      tooClever: ["Archery", "Fencing", "Badminton", "Table Tennis", "Skateboarding"],
      schooler: ["Rowing", "Volleyball", "Judo", "Taekwondo", "Boxing"],
      rare: ["Water Polo", "Field Hockey", "Handball", "Sport Climbing"],
      deepCut: ["Equestrian Dressage", "Artistic Swimming", "Surfing", "Trampoline"],
      oneInAKrillion: ["Modern Pentathlon", "Canoe Slalom", "Keirin", "Omnium", "Skeet Shooting"]
    },
    {
      id: 7,
      category: "Music & Band Members",
      prompt: "An official member of the British rock band Queen",
      verificationNote: "Must be one of the four permanent official core recording members of Queen (1971–present).",
      hints: {
        stage1: "The bassist who retired from music in 1997 and wrote 'Another One Bites the Dust'.",
        stage2: "Starts with 'J...', 4-letter first name, 6-letter surname.",
        stage3: "John Deacon (100m). (The official 4 members are Freddie Mercury, Brian May, Roger Taylor, and John Deacon)."
      },
      plankton: ["Freddie Mercury"],
      tooClever: ["Brian May"],
      schooler: ["Roger Taylor"],
      rare: [],
      deepCut: [],
      oneInAKrillion: ["John Deacon"]
    }
  ],
  // Set 1 (Next rotation)
  [
    {
      id: 1,
      category: "Geography",
      prompt: "A country in South America",
      hints: {
        stage1: "Think about the northern Guiana Shield, the Dutch or French speaking areas.",
        stage2: "Starts with 'S...' or 'G...', formerly Dutch Guiana.",
        stage3: "Suriname (100 pts) / Guyana (95 pts)"
      },
      plankton: ["Brazil", "Argentina", "Colombia", "Chile", "Peru"],
      tooClever: ["Uruguay", "Paraguay", "Bolivia", "Ecuador"],
      schooler: ["Venezuela"],
      rare: ["Guyana"],
      deepCut: ["French Guiana (Department of France)"],
      oneInAKrillion: ["Suriname"]
    },
    {
      id: 2,
      category: "Biology / Animals",
      prompt: "A bird starting with the letter 'P'",
      hints: {
        stage1: "A mysterious neotropical nocturnal bird known for its massive camouflage beak and eerie song.",
        stage2: "Starts with 'Po...', 5 letters.",
        stage3: "Potoo (100 pts) / Ptarmigan (95 pts)"
      },
      plankton: ["Penguin", "Parrot", "Pigeon", "Pelican", "Peacock"],
      tooClever: ["Peregrine Falcon", "Puffin", "Plover", "Partridge"],
      schooler: ["Pheasant", "Petrel", "Phalarope"],
      rare: ["Ptarmigan", "Pipit", "Poorwill"],
      deepCut: ["Pratincole", "Pardalote", "Pittas"],
      oneInAKrillion: ["Potoo", "Palila", "Piculet"]
    },
    {
      id: 3,
      category: "Movies & Cinema",
      prompt: "A movie directed by Christopher Nolan",
      hints: {
        stage1: "His 1998 micro-budget neo-noir black-and-white feature debut.",
        stage2: "Starts with 'F...', 9 letters long.",
        stage3: "Following (100 pts)"
      },
      plankton: ["Inception", "Interstellar", "Oppenheimer", "The Dark Knight"],
      tooClever: ["Memento", "The Prestige", "Tenet", "Batman Begins"],
      schooler: ["Dunkirk", "The Dark Knight Rises"],
      rare: ["Insomnia"],
      deepCut: ["Doodlebug (Short Film)"],
      oneInAKrillion: ["Following", "Quay"]
    },
    {
      id: 4,
      category: "Food & Cuisine",
      prompt: "A type of cheese",
      hints: {
        stage1: "A sharp, firm Sardinian sheep's milk cheese, or Norwegian caramelized brown cheese.",
        stage2: "Starts with 'F...' or 'G...', Scandinavian caramelized whey.",
        stage3: "Brunost / Geitost (100 pts), Fiore Sardo (100 pts)"
      },
      plankton: ["Cheddar", "Mozzarella", "Parmesan", "Brie", "Swiss"],
      tooClever: ["Gouda", "Feta", "Gorgonzola", "Gruyere", "Provolone"],
      schooler: ["Manchego", "Camembert", "Roquefort", "Pecorino"],
      rare: ["Taleggio", "Fontina", "Asiago", "Havarti"],
      deepCut: ["Appenzeller", "Mahon", "Morbier", "Reblochon"],
      oneInAKrillion: ["Brunost", "Geitost", "Fiore Sardo", "Telemea", "Caciocavallo Podolico"]
    },
    {
      id: 5,
      category: "Science & Chemistry",
      prompt: "An element on the Periodic Table starting with 'C'",
      hints: {
        stage1: "A synthetic radioactive actinide named after California.",
        stage2: "Starts with 'Cal...', atomic number 98.",
        stage3: "Californium (100 pts) / Copernicium (95 pts)"
      },
      plankton: ["Carbon", "Copper", "Calcium", "Chlorine"],
      tooClever: ["Cobalt", "Chromium", "Cesium", "Caesium"],
      schooler: ["Cadmium", "Cerium"],
      rare: ["Curium", "Californium"],
      deepCut: ["Copernicium", "Curium"],
      oneInAKrillion: ["Californium", "Copernicium", "Cerium"]
    },
    {
      id: 6,
      category: "World Geography",
      prompt: "A European capital city",
      hints: {
        stage1: "The capital of Liechtenstein or Montenegro.",
        stage2: "Starts with 'V...' or 'P...'.",
        stage3: "Vaduz (100 pts) / Podgorica (95 pts)"
      },
      plankton: ["London", "Paris", "Rome", "Berlin", "Madrid"],
      tooClever: ["Amsterdam", "Vienna", "Dublin", "Prague", "Stockholm"],
      schooler: ["Warsaw", "Brussels", "Lisbon", "Copenhagen"],
      rare: ["Vilnius", "Tallinn", "Riga", "Skopje"],
      deepCut: ["Chisinau", "Ljubljana", "Sarajevo"],
      oneInAKrillion: ["Vaduz", "Podgorica", "San Marino City", "Andorra la Vella"]
    },
    {
      id: 7,
      category: "Sports",
      prompt: "An NFL franchise in the AFC",
      hints: {
        stage1: "Historically small-market or frequently overlooked franchises in AFC South or West.",
        stage2: "Starts with 'J...' or 'T...'.",
        stage3: "Jacksonville Jaguars (100 pts) / Tennessee Titans (90 pts)"
      },
      plankton: ["Kansas City Chiefs", "New England Patriots", "Pittsburgh Steelers", "Miami Dolphins"],
      tooClever: ["Buffalo Bills", "Baltimore Ravens", "Cincinnati Bengals", "New York Jets"],
      schooler: ["Denver Broncos", "Las Vegas Raiders", "Cleveland Browns", "Indianapolis Colts"],
      rare: ["Los Angeles Chargers", "Houston Texans"],
      deepCut: ["Tennessee Titans"],
      oneInAKrillion: ["Jacksonville Jaguars"]
    }
  ],
  // Set 2
  [
    {
      id: 1,
      category: "Geography",
      prompt: "An island country in the Caribbean",
      hints: {
        stage1: "A tiny twin-island federation in the Leeward Islands.",
        stage2: "Starts with 'S...' (Saint K...).",
        stage3: "Saint Kitts and Nevis (100 pts)"
      },
      plankton: ["Cuba", "Jamaica", "Dominican Republic", "Bahamas", "Puerto Rico"],
      tooClever: ["Haiti", "Barbados", "Trinidad and Tobago", "Aruba"],
      schooler: ["Saint Lucia", "Grenada", "Antigua and Barbuda"],
      rare: ["Dominica", "Saint Vincent and the Grenadines"],
      deepCut: ["Montserrat", "Sint Maarten", "Anguilla"],
      oneInAKrillion: ["Saint Kitts and Nevis", "Saba", "Sint Eustatius"]
    },
    {
      id: 2,
      category: "Biology / Animals",
      prompt: "A marine mammal",
      hints: {
        stage1: "A rare river or coastal cetacean such as the Yangtse finless porpoise or vaquita.",
        stage2: "Starts with 'V...', world's most endangered marine mammal in Baja California.",
        stage3: "Vaquita (100 pts) / Dugong (95 pts)"
      },
      plankton: ["Dolphin", "Whale", "Seal", "Sea Lion"],
      tooClever: ["Otter", "Walrus", "Manatee", "Orca"],
      schooler: ["Narwhal", "Beluga"],
      rare: ["Dugong", "Porpoise"],
      deepCut: ["Baiji", "Amazon River Dolphin"],
      oneInAKrillion: ["Vaquita", "Mediterranean Monk Seal", "Sotalia"]
    },
    {
      id: 3,
      category: "Movies & Cinema",
      prompt: "A movie directed by Stanley Kubrick",
      hints: {
        stage1: "His first full-length 1953 feature film which he later tried to suppress.",
        stage2: "Starts with 'F...', 4 words (Fear and...).",
        stage3: "Fear and Desire (100 pts)"
      },
      plankton: ["The Shining", "2001: A Space Odyssey", "A Clockwork Orange"],
      tooClever: ["Full Metal Jacket", "Eyes Wide Shut", "Dr. Strangelove"],
      schooler: ["Spartacus", "Barry Lyndon", "Lolita"],
      rare: ["The Killing", "Paths of Glory"],
      deepCut: ["Killer's Kiss"],
      oneInAKrillion: ["Fear and Desire", "Day of the Fight (Short)"]
    },
    {
      id: 4,
      category: "World Geography",
      prompt: "A country in Africa bordering the Atlantic Ocean",
      hints: {
        stage1: "A tiny nation enveloped entirely within Senegal.",
        stage2: "Starts with 'G...', smallest country in mainland Africa.",
        stage3: "The Gambia (100 pts)"
      },
      plankton: ["South Africa", "Morocco", "Nigeria", "Ghana"],
      tooClever: ["Angola", "Namibia", "Senegal", "Ivory Coast"],
      schooler: ["Cameroon", "Liberia", "Sierra Leone", "Gabon"],
      rare: ["Mauritania", "Equatorial Guinea", "Republic of the Congo"],
      deepCut: ["Guinea-Bissau", "Benin", "Togo"],
      oneInAKrillion: ["The Gambia", "Sao Tome and Principe", "Cabo Verde"]
    },
    {
      id: 5,
      category: "Music",
      prompt: "A musical instrument in the brass family",
      hints: {
        stage1: "Conical-bore low brass instrument resembling a mini-tuba.",
        stage2: "Starts with 'E...' or 'M...'.",
        stage3: "Euphonium (100 pts) / Mellophone (95 pts)"
      },
      plankton: ["Trumpet", "Trombone", "Tuba", "French Horn"],
      tooClever: ["Flugelhorn", "Cornet", "Bugle", "Sousaphone"],
      schooler: ["Baritone Horn", "Euphonium"],
      rare: ["Mellophone", "Post horn"],
      deepCut: ["Wagner tuba", "Helicon", "Cimbasso"],
      oneInAKrillion: ["Ophicleide", "Serpent", "Sackbut", "Kuhlohorn"]
    },
    {
      id: 6,
      category: "Food & Cuisine",
      prompt: "A citrus fruit",
      hints: {
        stage1: "Small Australian finger-shaped caviar lime or tiny oval Asian citrus.",
        stage2: "Starts with 'K...' or 'F...'.",
        stage3: "Kumquat (100 pts) / Finger Lime (100 pts)"
      },
      plankton: ["Orange", "Lemon", "Lime", "Grapefruit"],
      tooClever: ["Tangerine", "Clementine", "Mandarin", "Yuzu", "Blood Orange"],
      schooler: ["Pomelo", "Bergamot", "Meyer Lemon"],
      rare: ["Ugli fruit", "Tangelo", "Calamansi"],
      deepCut: ["Buddha's Hand", "Sudachi", "Kabosu"],
      oneInAKrillion: ["Kumquat", "Australian Finger Lime", "Kinnow"]
    },
    {
      id: 7,
      category: "Sports",
      prompt: "A Summer Olympic track and field running event",
      hints: {
        stage1: "Long distance hurdle with water jump obstacle.",
        stage2: "Starts with '3000m S...'.",
        stage3: "3000m Steeplechase (100 pts) / Race Walk (95 pts)"
      },
      plankton: ["100m", "200m", "400m", "Marathon"],
      tooClever: ["800m", "1500m", "110m Hurdles", "4x100m Relay"],
      schooler: ["5000m", "10000m", "400m Hurdles"],
      rare: ["4x400m Mixed Relay"],
      deepCut: ["20km Race Walk", "35km Race Walk"],
      oneInAKrillion: ["3000m Steeplechase"]
    }
  ]
];

// Pick the set by modulo
const setIndex = Math.abs(dayDiff) % SCHEDULED_SETS.length;
const selectedPrompts = SCHEDULED_SETS[setIndex];

// 1. Update data/questions.js
const questionsPath = path.join(ROOT_DIR, 'data', 'questions.js');
let questionsContent = fs.readFileSync(questionsPath, 'utf8');

// Replace DAILY_GAME_DATA object in questions.js
const updatedDailyData = `export const DAILY_GAME_DATA = {
  gameNumber: ${gameNumber},
  date: "${dateStr}",
  prompts: ${JSON.stringify(selectedPrompts, null, 4)}
};`;

questionsContent = questionsContent.replace(
  /export const DAILY_GAME_DATA = \{[\s\S]*?\n\};/,
  updatedDailyData
);
fs.writeFileSync(questionsPath, questionsContent, 'utf8');
console.log('✅ Updated data/questions.js');

// 2. Update public/today.txt
const todayTxtPath = path.join(ROOT_DIR, 'public', 'today.txt');
const todayTxtLines = [
  `Krillion Daily Dive - Answers & Hints for Today (${formattedHumanDate} - Game #${gameNumber})\n`
];
selectedPrompts.forEach((p, idx) => {
  todayTxtLines.push(`${idx + 1}. Prompt: ${p.prompt}`);
  todayTxtLines.push(`- Top Rare Answers: ${p.oneInAKrillion.slice(0, 3).join(', ')}`);
  todayTxtLines.push(`- Avoid Too Clever: ${p.tooClever.slice(0, 3).join(', ')}\n`);
});
fs.writeFileSync(todayTxtPath, todayTxtLines.join('\n'), 'utf8');
console.log('✅ Updated public/today.txt');

// 3. Update public/llms.txt
const llmsTxtPath = path.join(ROOT_DIR, 'public', 'llms.txt');
let llmsContent = fs.readFileSync(llmsTxtPath, 'utf8');
llmsContent = llmsContent.replace(/> Updated: .*/, `> Updated: ${dateStr}`);

const answersSectionRegex = /## Today's Daily Dive Answers[\s\S]*$/;
const newAnswersSection = `## Today's Daily Dive Answers (${formattedHumanDate} - Game #${gameNumber})\n` +
  selectedPrompts.map((p, idx) => {
    return `${idx + 1}. ${p.prompt}:\n   - One in a Krillion: ${p.oneInAKrillion.join(', ')} (100 pts)\n   - Too Clever Trap: ${p.tooClever.join(', ')} (15 pts)`;
  }).join('\n');

llmsContent = llmsContent.replace(answersSectionRegex, newAnswersSection);
fs.writeFileSync(llmsTxtPath, llmsContent, 'utf8');
console.log('✅ Updated public/llms.txt');

// 4. Update index.html
const indexPath = path.join(ROOT_DIR, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Update Game # and Date references
indexContent = indexContent.replace(/Game #\d+ Live • Daily Dive Update • <time datetime="[^"]*">[^<]*<\/time>/g, 
  `Game #${gameNumber} Live • Daily Dive Update • <time datetime="${dateStr}">${formattedHumanDate}</time>`);

indexContent = indexContent.replace(/Today's Krillion Answers \([^)]+\)/g, 
  `Today's Krillion Answers (${formattedHumanDate} - Game #${gameNumber})`);

indexContent = indexContent.replace(/Today's Answers \(#\d+\)/g, 
  `Today's Answers (#${gameNumber})`);

indexContent = indexContent.replace(/What are today's Krillion answers for [^?]+?\?/g, 
  `What are today's Krillion answers for ${formattedHumanDate}?`);

indexContent = indexContent.replace(/Today's prompts \(Game #\d+\)/g, 
  `Today's prompts (Game #${gameNumber})`);

// Replace table tbody rows
const tbodyRegex = /<tbody>[\s\S]*?<\/tbody>/;
const newTbody = `<tbody>
${selectedPrompts.map((p, idx) => `              <tr>
                <td><strong>${idx + 1}</strong></td>
                <td><span class="cat-pill">${p.category}</span></td>
                <td>${p.prompt}</td>
                <td><span class="text-muted">${p.verificationNote || 'Verified entity'}</span></td>
                <td><strong class="text-glow">${p.oneInAKrillion[0]}</strong>, ${p.oneInAKrillion.slice(1, 3).join(', ')}</td>
                <td><span class="text-warning">${p.tooClever.slice(0, 3).join(', ')}</span></td>
                <td><span class="text-muted">${p.plankton.slice(0, 3).join(', ')}</span></td>
              </tr>`).join('\n')}
            </tbody>`;
indexContent = indexContent.replace(tbodyRegex, newTbody);

// Replace hints grid in index.html
const hintsGridRegex = /<div class="hints-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
const newHintsGrid = `<div class="hints-grid">
${selectedPrompts.map((p, idx) => `          <div class="hint-card">
            <div class="hint-card-head">
              <span class="hint-number">Prompt #${idx + 1}</span>
              <span class="cat-pill">${p.category}</span>
            </div>
            <h4 class="hint-prompt-name">${p.prompt}</h4>
            <details class="hint-detail">
              <summary class="hint-summary">Stage 1: Directional Clue</summary>
              <div class="hint-body">${p.hints.stage1}</div>
            </details>
            <details class="hint-detail">
              <summary class="hint-summary">Stage 2: First Letter & Length</summary>
              <div class="hint-body">${p.hints.stage2}</div>
            </details>
            <details class="hint-detail reveal-gold">
              <summary class="hint-summary">Stage 3: Full Reveal (Click to Unmask)</summary>
              <div class="hint-body text-glow"><strong>${p.oneInAKrillion[0]}</strong> (100 pts). Avoid: ${p.tooClever[0]}!</div>
            </details>
          </div>`).join('\n')}
        </div>
      </div>
    </section>`;
indexContent = indexContent.replace(hintsGridRegex, newHintsGrid);

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('✅ Updated index.html');

console.log(`🎉 Daily update successfully completed for Game #${gameNumber} (${dateStr})!`);
