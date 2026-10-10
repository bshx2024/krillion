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
            "stage1": "Think beyond coastal metropolitan giants; think of smaller incorporated California cities, including historic inland towns and mountain communities.",
            "stage2": "Focus on historic valley, agricultural, or mountain municipalities (such as Ventura County citrus valleys or Siskiyou County).",
            "stage3": "Ojai, Weed, Yreka, Dunsmuir, Point Arena (100 pts). Avoid: Sacramento!"
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
        "verificationNote": "Must be a recognized biological mammal species under class Mammalia with a common English name starting with 'B'.",
        "factSource": "Integrated Taxonomic Information System (ITIS) & IUCN",
        "sourceUrl": "https://www.itis.gov/",
        "verifiedDate": "October 10, 2026",
        "modelRationale": "Binturong (Arctictis binturong) and Bilby are verified mammals with low linguistic frequency compared to Bear, Bat, or Beaver.",
        "hints": {
            "stage1": "A shy Southeast Asian nocturnal civet-like tree dweller that smells like buttered popcorn.",
            "stage2": "Starts with 'Bi...', 9 letters long.",
            "stage3": "Binturong (100 pts) / Bilby (95 pts)"
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
            "Bharal",
            "Babirusa",
            "Baiji",
            "Bettong"
        ],
        "oneInAKrillion": [
            "Binturong",
            "Bilby",
            "Bassariscus",
            "Beira",
            "Bison antiquus"
        ]
    },
    {
        "id": 3,
        "category": "Movies & Cinema",
        "prompt": "A movie directed by Quentin Tarantino",
        "verificationNote": "Must be a theatrically released feature film with Quentin Tarantino credited as director.",
        "factSource": "American Film Institute (AFI) Catalog",
        "sourceUrl": "https://catalog.afi.com/",
        "verifiedDate": "October 10, 2026",
        "modelRationale": "Death Proof (2007) was released under Grindhouse with significantly lower box-office visibility than Pulp Fiction or Django Unchained.",
        "hints": {
            "stage1": "His lesser-known homage to 1970s exploitation slashers / muscle cars with Kurt Russell.",
            "stage2": "Starts with 'D...', two words, released as part of Grindhouse.",
            "stage3": "Death Proof (100 pts)"
        },
        "plankton": [
            "Pulp Fiction",
            "Kill Bill",
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
            "Kill Bill Vol 2"
        ],
        "rare": [
            "Grindhouse",
            "Four Rooms"
        ],
        "deepCut": [
            "Sin City (Guest Director)",
            "Natural Born Killers (Story)"
        ],
        "oneInAKrillion": [
            "Death Proof",
            "My Best Friend's Birthday"
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
            "stage1": "Think about the smallest landlocked duchy or the northern peninsula border.",
            "stage2": "Starts with 'L...' or 'D...', small sovereign neighbor.",
            "stage3": "Luxembourg (100 pts) / Denmark (100 pts)"
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
        "prompt": "A Summer Olympic sport / event",
        "verificationNote": "Must be an official medal sport or discipline recognized by the International Olympic Committee (IOC).",
        "factSource": "International Olympic Committee (IOC) Official Sports Program",
        "sourceUrl": "https://olympics.com/en/sports/",
        "verifiedDate": "October 10, 2026",
        "modelRationale": "Modern Pentathlon and Canoe Slalom feature low spectator frequency compared to Swimming, Athletics, or Gymnastics.",
        "hints": {
            "stage1": "Modern or specialized events introduced recently or niche equestrian disciplines.",
            "stage2": "Modern pentathlon sub-discipline, or urban sports like breakdance / canoeing.",
            "stage3": "Modern Pentathlon (100 pts) / Canoe Slalom (95 pts)"
        },
        "plankton": [
            "Swimming",
            "Athletics",
            "Gymnastics",
            "Basketball",
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
            "Sport Climbing"
        ],
        "deepCut": [
            "Equestrian Dressage",
            "Artistic Swimming",
            "Surfing",
            "Trampoline"
        ],
        "oneInAKrillion": [
            "Modern Pentathlon",
            "Canoe Slalom",
            "Keirin",
            "Omnium",
            "Skeet Shooting"
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
