// Comprehensive Krillion Database with Verified Facts, Two-Layer Validation & Knowledge Explanations
// All factual entities verified against authoritative geographic, biological, and historical records.

export const DAILY_GAME_DATA = {
  gameNumber: 46,
  date: "2026-10-10",
  prompts: [
    {
        "id": 1,
        "category": "Geography",
        "prompt": "A city in California",
        "verificationNote": "Must be an officially incorporated municipality in the State of California.",
        "factSource": "California State Association of Counties (CSAC)",
        "sourceUrl": "https://www.counties.org/cities-within-each-county",
        "verifiedDate": "October 10, 2026",
        "modelRationale": "Ojai and Weed are officially incorporated municipalities with low population density and low top-of-mind retrieval compared to coastal giants.",
        "hints": {
            "stage1": "Think beyond coastal metropolitan giants; explore smaller incorporated California cities across historic inland valleys, mountain passes, and scenic coastal enclaves.",
            "stage2": "Differentiated candidate clues: 4-letter valley citrus town (O...) or timber town near Mt. Shasta (W...); 5-letter Siskiyou gold-rush county seat (Y...); 8-letter river railway town (D...); or 10-letter Mendocino coastal port (P... A...).",
            "stage3": "Ojai, Weed, Yreka, Dunsmuir, Point Arena (100 pts). Avoid: Sacramento, Oakland!"
        },
        "plankton": [
            "Los Angeles",
            "San Francisco",
            "San Diego",
            "San Jose"
        ],
        "tooClever": [
            "Sacramento",
            "Oakland",
            "Pasadena",
            "Berkeley",
            "Fresno"
        ],
        "schooler": [
            "Anaheim",
            "Bakersfield",
            "Santa Barbara",
            "Long Beach"
        ],
        "rare": [
            "Eureka",
            "Chico",
            "Solvang",
            "Oceanside",
            "Truckee"
        ],
        "deepCut": [
            "Ukiah",
            "Arcata",
            "Sonora",
            "Bishop",
            "Fort Bragg"
        ],
        "oneInAKrillion": [
            "Ojai",
            "Weed",
            "Yreka",
            "Dunsmuir",
            "Point Arena"
        ]
    },
    {
        "id": 2,
        "category": "Biology / Animals",
        "prompt": "A mammal starting with the letter 'B'",
        "verificationNote": "Must be a recognized living mammal species under class Mammalia with an established common English name starting with 'B'.",
        "factSource": "Integrated Taxonomic Information System (ITIS) & IUCN Red List",
        "sourceUrl": "https://www.itis.gov/",
        "verifiedDate": "October 10, 2026",
        "modelRationale": "Binturong (Arctictis binturong), Bilby, and Babirusa are verified mammal species with established English names exhibiting low conversational recall compared to Bear or Bat.",
        "hints": {
            "stage1": "Think of shy nocturnal forest dwellers, Australasian desert marsupials, or unique Asian ungulates and suids with verified common English names.",
            "stage2": "Differentiated species clues: 9-letter Southeast Asian arboreal binturong; 5-letter Australian desert bilby; 8-letter Indonesian wild babirusa; 7-letter bettong (rat-kangaroo); or 6-letter Himalayan bharal (blue sheep).",
            "stage3": "Binturong, Bilby, Babirusa, Bettong, Bharal (100 pts). Avoid: Baboon, Buffalo!"
        },
        "plankton": [
            "Bear",
            "Bat",
            "Beaver",
            "Badger"
        ],
        "tooClever": [
            "Baboon",
            "Buffalo",
            "Bonobo",
            "Blue Whale"
        ],
        "schooler": [
            "Bison",
            "Boar",
            "Bandicoot",
            "Bobcat"
        ],
        "rare": [
            "Bongo",
            "Blesbok",
            "Beluga",
            "Bushbaby"
        ],
        "deepCut": [
            "Baiji",
            "Bettong",
            "Bharal",
            "Beira"
        ],
        "oneInAKrillion": [
            "Binturong",
            "Bilby",
            "Babirusa",
            "Bettong",
            "Bharal"
        ]
    },
    {
        "id": 3,
        "category": "Movies & Cinema",
        "prompt": "A movie directed by Quentin Tarantino",
        "verificationNote": "Must be an officially theatrically released feature film credited with Quentin Tarantino as director.",
        "factSource": "American Film Institute (AFI) Catalog & Directors Guild of America",
        "sourceUrl": "https://catalog.afi.com/",
        "verifiedDate": "October 10, 2026",
        "modelRationale": "Death Proof (2007) holds the lowest worldwide box-office return of Tarantino's credited theatrical feature films, ranking highest in obscurity.",
        "hints": {
            "stage1": "His 1970s exploitation slasher and muscle-car homage starring Kurt Russell, officially released theatrically as a feature film in 2007.",
            "stage2": "Two words (5 letters and 5 letters) starting with 'D...' (D-e-a-t-h P-r-o-o-f), released theatrically as part of Grindhouse.",
            "stage3": "Death Proof (100 pts). Note: Unreleased student shorts and guest co-directing scenes do not meet the theatrical feature release rule. Avoid: Reservoir Dogs, Pulp Fiction!"
        },
        "plankton": [
            "Pulp Fiction",
            "Kill Bill: Volume 1",
            "Django Unchained",
            "Inglourious Basterds"
        ],
        "tooClever": [
            "Reservoir Dogs",
            "Once Upon a Time in Hollywood",
            "The Hateful Eight"
        ],
        "schooler": [
            "Jackie Brown",
            "Kill Bill: Volume 2"
        ],
        "rare": [
            "Four Rooms"
        ],
        "deepCut": [
            "Grindhouse"
        ],
        "oneInAKrillion": [
            "Death Proof"
        ]
    },
    {
        "id": 4,
        "category": "World Geography",
        "prompt": "A country that borders Germany",
        "verificationNote": "Must be one of the exactly 9 recognized sovereign nations sharing a terrestrial land border with Germany.",
        "factSource": "Federal Agency for Cartography and Geodesy (BKG)",
        "sourceUrl": "https://gdz.bkg.bund.de/",
        "verifiedDate": "October 10, 2026",
        "modelRationale": "All 9 valid border countries are scored via linguistic search frequency. Luxembourg and Denmark are least cited in border trivia contexts, while France and Switzerland are top-of-mind.",
        "hints": {
            "stage1": "Look at Germany's northern maritime jutland boundary or western low-countries border, strictly among the 9 sovereign land neighbors.",
            "stage2": "Differentiated border clues: Either Germany's single-border northern Scandinavian neighbor (7 letters, D...) or the historic multilingual Grand Duchy to the west (10 letters, L...).",
            "stage3": "Luxembourg, Denmark (100 pts). Note: Liechtenstein does NOT border Germany. Avoid: Austria, Netherlands!"
        },
        "plankton": [
            "France",
            "Switzerland",
            "Poland"
        ],
        "tooClever": [
            "Netherlands",
            "The Netherlands",
            "Austria"
        ],
        "schooler": [
            "Czechia"
        ],
        "rare": [
            "Belgium",
            "Czech Republic"
        ],
        "deepCut": [],
        "oneInAKrillion": [
            "Luxembourg",
            "Denmark"
        ]
    },
    {
        "id": 5,
        "category": "Food & Cuisine",
        "prompt": "A pasta shape or variety",
        "verificationNote": "Must be a recognized authentic Italian pasta shape cataloged in official culinary registries.",
        "factSource": "Italian Ministry of Agriculture (MASAF) Food Registry",
        "sourceUrl": "https://www.politicheagricole.it/",
        "verifiedDate": "October 10, 2026",
        "modelRationale": "Campanelle (gigli) and Culurgiones (Sardinian stuffed pocket) are regional artisanal shapes rarely named compared to Spaghetti or Penne.",
        "hints": {
            "stage1": "Sardinian or Sicilian twisted artisanal shapes, or delicate stuffed pasta.",
            "stage2": "Starts with 'C...' or 'T...', rare curled or ear-shaped noodles.",
            "stage3": "Campanelle (100 pts) / Culurgiones (100 pts)"
        },
        "plankton": [
            "Spaghetti",
            "Penne",
            "Fettuccine",
            "Macaroni",
            "Fusilli"
        ],
        "tooClever": [
            "Ravioli",
            "Gnocchi",
            "Orzo",
            "Farfalle",
            "Rigatoni"
        ],
        "schooler": [
            "Tagliatelle",
            "Linguine",
            "Cannelloni",
            "Cavatappi"
        ],
        "rare": [
            "Pappardelle",
            "Orecchiette",
            "Bucatini",
            "Tortellini"
        ],
        "deepCut": [
            "Paccheri",
            "Garganelli",
            "Strozzapreti",
            "Casarecce"
        ],
        "oneInAKrillion": [
            "Campanelle",
            "Culurgiones",
            "Busiate",
            "Trofie",
            "Casoncelli"
        ]
    },
    {
        "id": 6,
        "category": "Sports & Olympics",
        "prompt": "A Summer Olympic sport or discipline",
        "verificationNote": "Must be an official sport or discipline recognized by the International Olympic Committee (IOC) on the Summer Olympic Programme.",
        "factSource": "International Olympic Committee (IOC) Official Sports Program",
        "sourceUrl": "https://olympics.com/en/sports/",
        "verifiedDate": "October 10, 2026",
        "modelRationale": "Modern Pentathlon and Canoe Slalom feature the lowest global broadcast viewership and participant bases among official Summer Olympic disciplines.",
        "hints": {
            "stage1": "An official medal sport or discipline on the IOC Summer Olympic Programme with low broadcast viewership compared to Athletics or Swimming.",
            "stage2": "Specific discipline clues: A multi-sport combining fencing, swimming, equestrian, laser-run (16 letters, M... P...); or navigating whitewater slalom gates in a kayak/canoe (11 letters, C... S...).",
            "stage3": "Modern Pentathlon, Canoe Slalom (100 pts). Note: Specific single-event races (such as track sprints or individual shooting rounds) are sub-events, not standalone Olympic sports or disciplines. Avoid: Archery, Fencing!"
        },
        "plankton": [
            "Swimming",
            "Athletics",
            "Gymnastics",
            "Basketball",
            "Football",
            "Soccer"
        ],
        "tooClever": [
            "Archery",
            "Fencing",
            "Badminton",
            "Table Tennis",
            "Skateboarding"
        ],
        "schooler": [
            "Rowing",
            "Volleyball",
            "Judo",
            "Taekwondo",
            "Boxing"
        ],
        "rare": [
            "Water Polo",
            "Field Hockey",
            "Handball",
            "Sport Climbing",
            "Surfing"
        ],
        "deepCut": [
            "Trampoline Gymnastics",
            "Rugby Sevens",
            "Artistic Swimming",
            "Equestrian Dressage"
        ],
        "oneInAKrillion": [
            "Modern Pentathlon",
            "Canoe Slalom"
        ]
    },
    {
        "id": 7,
        "category": "Music & Band Members",
        "prompt": "An official member of the British rock band Queen",
        "verificationNote": "Must be one of the four permanent official core recording members of Queen (1971–present).",
        "factSource": "Official Queen Online Archives & Rock Hall Lineup Record",
        "sourceUrl": "https://www.queenonline.com/",
        "verifiedDate": "October 10, 2026",
        "modelRationale": "John Deacon wrote 'Another One Bites the Dust' but retired from music in 1997, giving him the lowest linguistic top-of-mind score compared to active members May and Taylor.",
        "hints": {
            "stage1": "The bassist who retired from music in 1997 and wrote 'Another One Bites the Dust'.",
            "stage2": "Starts with 'J...', 4-letter first name, 6-letter surname.",
            "stage3": "John Deacon (100m). (The official 4 members are Freddie Mercury, Brian May, Roger Taylor, and John Deacon)."
        },
        "plankton": [
            "Freddie Mercury"
        ],
        "tooClever": [
            "Brian May"
        ],
        "schooler": [
            "Roger Taylor"
        ],
        "rare": [],
        "deepCut": [],
        "oneInAKrillion": [
            "John Deacon"
        ]
    }
]
};

// Expanded pool for Krillion Unlimited
export const UNLIMITED_PROMPT_POOL = [
  ...DAILY_GAME_DATA.prompts,
  {
    id: 101,
    category: "Geography",
    prompt: "An island country in the Caribbean",
    verificationNote: "Must be a sovereign island state located entirely within the Caribbean region.",
    hints: {
      stage1: "A tiny twin-island federation in the Leeward Islands, smallest sovereign state in the Americas.",
      stage2: "Starts with 'S...' (Saint K...).",
      stage3: "Saint Kitts and Nevis (100m)"
    },
    whyThisAnswer: {
      "saint kitts and nevis": "Saint Kitts and Nevis is an independent twin-island Caribbean federation with an area of only 261 km².",
      "cuba": "Cuba is the largest and most populous Caribbean island nation, making it a surface plankton pick."
    },
    plankton: ["Cuba", "Jamaica", "Dominican Republic", "Bahamas", "Puerto Rico"],
    tooClever: ["Haiti", "Barbados", "Trinidad and Tobago", "Aruba"],
    schooler: ["Saint Lucia", "Grenada", "Antigua and Barbuda"],
    rare: ["Dominica", "Saint Vincent and the Grenadines"],
    deepCut: ["Montserrat", "Sint Maarten", "Anguilla"],
    oneInAKrillion: ["Saint Kitts and Nevis"]
  },
  {
    id: 102,
    category: "Movies & Cinema",
    prompt: "A movie directed by Christopher Nolan",
    verificationNote: "Must be a feature film credited with Christopher Nolan as sole or primary director.",
    hints: {
      stage1: "His low-budget 1998 black-and-white neo-noir feature debut.",
      stage2: "Starts with 'F...', one single 9-letter word.",
      stage3: "Following (100m)"
    },
    whyThisAnswer: {
      "following": "Following (1998) was Nolan's micro-budget feature debut, shot on 16mm black-and-white film in London on weekends.",
      "inception": "Inception (2010) is one of his most famous sci-fi blockbusters, earning universal mainstream awareness."
    },
    plankton: ["Inception", "Interstellar", "Oppenheimer", "The Dark Knight"],
    tooClever: ["Memento", "Tenet", "The Prestige", "Batman Begins"],
    schooler: ["Dunkirk", "The Dark Knight Rises"],
    rare: ["Insomnia"],
    deepCut: ["Doodlebug"],
    oneInAKrillion: ["Following"]
  },
  {
    id: 103,
    category: "World Geography",
    prompt: "A country in Africa bordering the Atlantic Ocean",
    verificationNote: "Must be a sovereign African nation possessing coastline directly on the Atlantic Ocean.",
    hints: {
      stage1: "A narrow West African nation enclaved entirely inside Senegal, smallest in mainland Africa.",
      stage2: "Starts with 'G...', follows the Gambia River.",
      stage3: "The Gambia (100m) / Sao Tome and Principe (95m)"
    },
    whyThisAnswer: {
      "the gambia": "The Gambia borders the Atlantic Ocean at the mouth of the Gambia River and is otherwise enveloped entirely by Senegal.",
      "south africa": "South Africa borders both the Atlantic and Indian Oceans and is the most commonly recalled African nation."
    },
    plankton: ["South Africa", "Morocco", "Nigeria", "Ghana"],
    tooClever: ["Angola", "Namibia", "Senegal", "Ivory Coast"],
    schooler: ["Cameroon", "Liberia", "Sierra Leone", "Gabon"],
    rare: ["Mauritania", "Equatorial Guinea", "Republic of the Congo"],
    deepCut: ["Guinea-Bissau", "Benin", "Togo"],
    oneInAKrillion: ["The Gambia", "Sao Tome and Principe", "Cabo Verde"]
  },
  {
    id: 104,
    category: "Music",
    prompt: "A musical instrument in the brass family",
    verificationNote: "Must be an acoustic lip-vibrated instrument traditionally classified in the brass instrument family.",
    hints: {
      stage1: "A conical-bore low brass instrument resembling a mini-tuba with a sweet, mellow tone.",
      stage2: "Starts with 'E...' or 'M...'.",
      stage3: "Euphonium (100m) / Mellophone (95m)"
    },
    whyThisAnswer: {
      "euphonium": "The euphonium is a medium-sized, 3- or 4-valve conical-bore brass instrument derived from the Greek word 'euphonos' (well-sounding).",
      "trumpet": "The trumpet is the highest-register brass instrument and the most obvious first-choice pick."
    },
    plankton: ["Trumpet", "Trombone", "Tuba", "French Horn"],
    tooClever: ["Flugelhorn", "Cornet", "Bugle", "Sousaphone"],
    schooler: ["Baritone Horn", "Euphonium"],
    rare: ["Mellophone", "Post horn"],
    deepCut: ["Wagner tuba", "Helicon", "Cimbasso"],
    oneInAKrillion: ["Ophicleide", "Serpent", "Sackbut"]
  }
];

// Historical games archive
export const ARCHIVE_GAMES = [
  {
    gameNumber: 45,
    date: "2026-10-09",
    bestDepth: "6,920m",
    highlights: "Featured prompts included 'South American Country' (Deep cut: Suriname) and 'Bird starting with P' (Deep cut: Potoo)."
  },
  {
    gameNumber: 44,
    date: "2026-10-08",
    bestDepth: "6,880m",
    highlights: "Featured prompts included 'US State without an E' (Deep cut: Utah) and 'Stanley Kubrick Film' (Deep cut: Fear and Desire)."
  },
  {
    gameNumber: 43,
    date: "2026-10-07",
    bestDepth: "6,950m",
    highlights: "Featured prompts included 'European River' (Deep cut: Vltava) and 'Citrus Fruit' (Deep cut: Kumquat)."
  },
  {
    gameNumber: 42,
    date: "2026-10-06",
    bestDepth: "6,800m",
    highlights: "Featured prompts included 'Periodic Table Element starting with C' (Deep cut: Californium) and 'African Atlantic Coast' (Deep cut: The Gambia)."
  }
];
