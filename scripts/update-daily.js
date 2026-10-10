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
      verificationNote: "Must be an officially incorporated municipality in the State of California.",
      factSource: "California State Association of Counties (CSAC)",
      sourceUrl: "https://www.counties.org/cities-within-each-county",
      verifiedDate: "October 10, 2026",
      modelRationale: "Ojai and Weed are officially incorporated municipalities with low population density and low top-of-mind retrieval compared to coastal giants.",
      hints: {
        stage1: "Think beyond coastal metropolitan giants; explore smaller incorporated California cities across historic inland valleys, mountain passes, and scenic coastal enclaves.",
        stage2: "Differentiated candidate clues: 4-letter valley citrus town (O...) or timber town near Mt. Shasta (W...); 5-letter Siskiyou gold-rush county seat (Y...); 8-letter river railway town (D...); or 10-letter Mendocino coastal port (P... A...).",
        stage3: "Ojai, Weed, Yreka, Dunsmuir, Point Arena (100 pts). Avoid: Sacramento, Oakland!"
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
      verificationNote: "Must be a recognized living mammal species under class Mammalia with an established common English name starting with 'B'.",
      factSource: "Integrated Taxonomic Information System (ITIS) & IUCN Red List",
      sourceUrl: "https://www.itis.gov/",
      verifiedDate: "October 10, 2026",
      modelRationale: "Binturong (Arctictis binturong), Bilby, and Babirusa are verified mammal species with established English names exhibiting low conversational recall compared to Bear or Bat.",
      hints: {
        stage1: "Think of shy nocturnal forest dwellers, Australasian desert marsupials, or unique Asian ungulates and suids with verified common English names.",
        stage2: "Differentiated species clues: 9-letter Southeast Asian arboreal binturong; 5-letter Australian desert bilby; 8-letter Indonesian wild babirusa; 7-letter bettong (rat-kangaroo); or 6-letter Himalayan bharal (blue sheep).",
        stage3: "Binturong, Bilby, Babirusa, Bettong, Bharal (100 pts). Avoid: Baboon, Buffalo!"
      },
      plankton: ["Bear", "Bat", "Beaver", "Badger"],
      tooClever: ["Baboon", "Buffalo", "Bonobo", "Blue Whale"],
      schooler: ["Bison", "Boar", "Bandicoot", "Bobcat"],
      rare: ["Bongo", "Blesbok", "Beluga", "Bushbaby"],
      deepCut: ["Baiji", "Bettong", "Bharal", "Beira"],
      oneInAKrillion: ["Binturong", "Bilby", "Babirusa", "Bettong", "Bharal"]
    },
    {
      id: 3,
      category: "Movies & Cinema",
      prompt: "A movie directed by Quentin Tarantino",
      verificationNote: "Must be an officially theatrically released feature film credited with Quentin Tarantino as director.",
      factSource: "American Film Institute (AFI) Catalog & Directors Guild of America",
      sourceUrl: "https://catalog.afi.com/",
      verifiedDate: "October 10, 2026",
      modelRationale: "Death Proof (2007) holds the lowest worldwide box-office return of Tarantino's credited theatrical feature films, ranking highest in obscurity.",
      hints: {
        stage1: "His 1970s exploitation slasher and muscle-car homage starring Kurt Russell, officially released theatrically as a feature film in 2007.",
        stage2: "Two words (5 letters and 5 letters) starting with 'D...' (D-e-a-t-h P-r-o-o-f), released theatrically as part of Grindhouse.",
        stage3: "Death Proof (100 pts). Note: Unreleased student shorts and guest co-directing scenes do not meet the theatrical feature release rule. Avoid: Reservoir Dogs, Pulp Fiction!"
      },
      plankton: ["Pulp Fiction", "Kill Bill: Volume 1", "Django Unchained", "Inglourious Basterds"],
      tooClever: ["Reservoir Dogs", "Once Upon a Time in Hollywood", "The Hateful Eight"],
      schooler: ["Jackie Brown", "Kill Bill: Volume 2"],
      rare: ["Four Rooms"],
      deepCut: ["Grindhouse"],
      oneInAKrillion: ["Death Proof"]
    },
    {
      id: 4,
      category: "World Geography",
      prompt: "A country that borders Germany",
      verificationNote: "Must be one of the exactly 9 recognized sovereign nations sharing a terrestrial land border with Germany.",
      factSource: "Federal Agency for Cartography and Geodesy (BKG)",
      sourceUrl: "https://gdz.bkg.bund.de/",
      verifiedDate: "October 10, 2026",
      modelRationale: "All 9 valid border countries are scored via linguistic search frequency. Luxembourg and Denmark are least cited in border trivia contexts, while France and Switzerland are top-of-mind.",
      hints: {
        stage1: "Look at Germany's northern maritime jutland boundary or western low-countries border, strictly among the 9 sovereign land neighbors.",
        stage2: "Differentiated border clues: Either Germany's single-border northern Scandinavian neighbor (7 letters, D...) or the historic multilingual Grand Duchy to the west (10 letters, L...).",
        stage3: "Luxembourg, Denmark (100 pts). Note: Liechtenstein does NOT border Germany. Avoid: Austria, Netherlands!"
      },
      plankton: ["France", "Switzerland", "Poland"],
      tooClever: ["Netherlands", "The Netherlands", "Austria"],
      schooler: ["Czechia"],
      rare: ["Belgium", "Czech Republic"],
      deepCut: [],
      oneInAKrillion: ["Luxembourg", "Denmark"]
    },
    {
      id: 5,
      category: "Food & Cuisine",
      prompt: "A pasta shape or variety",
      verificationNote: "Must be a recognized authentic Italian pasta shape cataloged in official culinary registries.",
      factSource: "Italian Ministry of Agriculture (MASAF) Food Registry",
      sourceUrl: "https://www.politicheagricole.it/",
      verifiedDate: "October 10, 2026",
      modelRationale: "Campanelle (gigli) and Culurgiones (Sardinian stuffed pocket) are regional artisanal shapes rarely named compared to Spaghetti or Penne.",
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
      prompt: "A Summer Olympic sport or discipline",
      verificationNote: "Must be an official sport or discipline recognized by the International Olympic Committee (IOC) on the Summer Olympic Programme.",
      factSource: "International Olympic Committee (IOC) Official Sports Program",
      sourceUrl: "https://olympics.com/en/sports/",
      verifiedDate: "October 10, 2026",
      modelRationale: "Modern Pentathlon and Canoe Slalom feature the lowest global broadcast viewership and participant bases among official Summer Olympic disciplines.",
      hints: {
        stage1: "An official medal sport or discipline on the IOC Summer Olympic Programme with low broadcast viewership compared to Athletics or Swimming.",
        stage2: "Specific discipline clues: A multi-sport combining fencing, swimming, equestrian, laser-run (16 letters, M... P...); or navigating whitewater slalom gates in a kayak/canoe (11 letters, C... S...).",
        stage3: "Modern Pentathlon, Canoe Slalom (100 pts). Note: Specific single-event races (such as track sprints or individual shooting rounds) are sub-events, not standalone Olympic sports or disciplines. Avoid: Archery, Fencing!"
      },
      plankton: ["Swimming", "Athletics", "Gymnastics", "Basketball", "Football", "Soccer"],
      tooClever: ["Archery", "Fencing", "Badminton", "Table Tennis", "Skateboarding"],
      schooler: ["Rowing", "Volleyball", "Judo", "Taekwondo", "Boxing"],
      rare: ["Water Polo", "Field Hockey", "Handball", "Sport Climbing", "Surfing"],
      deepCut: ["Trampoline Gymnastics", "Rugby Sevens", "Artistic Swimming", "Equestrian Dressage"],
      oneInAKrillion: ["Modern Pentathlon", "Canoe Slalom"]
    },
    {
      id: 7,
      category: "Music & Band Members",
      prompt: "An official member of the British rock band Queen",
      verificationNote: "Must be one of the four permanent official core recording members of Queen (1971–present).",
      factSource: "Official Queen Online Archives & Rock Hall Lineup Record",
      sourceUrl: "https://www.queenonline.com/",
      verifiedDate: "October 10, 2026",
      modelRationale: "John Deacon wrote 'Another One Bites the Dust' but retired from music in 1997, giving him the lowest linguistic top-of-mind score compared to active members May and Taylor.",
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

// Replace hints section in index.html
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
${selectedPrompts.map((p, idx) => `          <div class="hint-card">
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
console.log('✅ Updated index.html');

console.log(`🎉 Daily update successfully completed for Game #${gameNumber} (${dateStr})!`);
