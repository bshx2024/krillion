// Comprehensive Krillion Database with Rarity tiers, scoring, and Too Clever traps
export const DAILY_GAME_DATA = {
  gameNumber: 46,
  date: "2026-10-10",
  prompts: [
    {
        "id": 1,
        "category": "Geography",
        "prompt": "A city in California",
        "hints": {
            "stage1": "Think beyond Southern California coastal giants; think northern inland or historic small valley towns.",
            "stage2": "Starts with 'O' or 'W', short 4-letter name famous for citrus or mountain views.",
            "stage3": "Ojai (100 pts) / Weed (100 pts) / Yreka (95 pts)"
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
        "hints": {
            "stage1": "Think about the smallest landlocked duchy or the northern peninsula border.",
            "stage2": "Starts with 'L...', tiny European microstate.",
            "stage3": "Luxembourg (100 pts) / Denmark (90 pts)"
        },
        "plankton": [
            "France",
            "Poland",
            "Austria",
            "Switzerland"
        ],
        "tooClever": [
            "Netherlands",
            "Belgium",
            "Czech Republic"
        ],
        "schooler": [
            "Czechia",
            "The Netherlands"
        ],
        "rare": [
            "Denmark"
        ],
        "deepCut": [
            "Liechtenstein (TRICK: Does NOT border Germany directly!)"
        ],
        "oneInAKrillion": [
            "Luxembourg"
        ]
    },
    {
        "id": 5,
        "category": "Food & Cuisine",
        "prompt": "A pasta shape or variety",
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
        "category": "Music & Pop Culture",
        "prompt": "A member of the British rock band Queen",
        "hints": {
            "stage1": "The bassist who retired from music and wrote 'Another One Bites the Dust'.",
            "stage2": "Starts with 'J...', quietest member of the quartet.",
            "stage3": "John Deacon (100 pts)"
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
        "rare": [
            "John Deacon"
        ],
        "deepCut": [
            "Mike Grose (original 1970 bassist)",
            "Barry Mitchell"
        ],
        "oneInAKrillion": [
            "Doug Bogie",
            "John Deacon"
        ]
    }
]
};

// Additional question pool for the Unlimited Game Mode
export const UNLIMITED_PROMPT_POOL = [
  ...DAILY_GAME_DATA.prompts,
  {
    id: 101,
    category: "Geography",
    prompt: "An island country in the Caribbean",
    hints: {
      stage1: "A tiny twin-island nation in the Leeward Islands.",
      stage2: "Starts with 'S...' or 'A...'.",
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
    id: 102,
    category: "Movies",
    prompt: "A movie directed by Christopher Nolan",
    hints: {
      stage1: "His low-budget 1998 black-and-white neo-noir feature debut.",
      stage2: "Starts with 'F...', one single word, 9 letters.",
      stage3: "Following (100 pts)"
    },
    plankton: ["Inception", "Interstellar", "Oppenheimer", "The Dark Knight"],
    tooClever: ["Memento", "Tenet", "The Prestige", "Batman Begins"],
    schooler: ["Dunkirk", "The Dark Knight Rises"],
    rare: ["Insomnia"],
    deepCut: ["Doodlebug (Short Film)"],
    oneInAKrillion: ["Following", "Quay"]
  },
  {
    id: 103,
    category: "Geography",
    prompt: "A country in Africa with coast on the Atlantic Ocean",
    hints: {
      stage1: "A tiny West African nation enclaved inside Senegal.",
      stage2: "Starts with 'G...', smallest country in mainland Africa.",
      stage3: "The Gambia (100 pts) / Sao Tome and Principe (95 pts)"
    },
    plankton: ["South Africa", "Morocco", "Nigeria", "Ghana"],
    tooClever: ["Angola", "Namibia", "Senegal", "Ivory Coast", "Cote d'Ivoire"],
    schooler: ["Cameroon", "Liberia", "Sierra Leone", "Gabon"],
    rare: ["Mauritania", "Equatorial Guinea", "Republic of the Congo"],
    deepCut: ["Guinea-Bissau", "Benin", "Togo"],
    oneInAKrillion: ["The Gambia", "Sao Tome and Principe", "Cape Verde", "Cabo Verde"]
  },
  {
    id: 104,
    category: "Music",
    prompt: "A musical instrument in the brass family",
    hints: {
      stage1: "An ancient coiled alpine or marching brass instrument, or marching sousaphone relative.",
      stage2: "Starts with 'E...' or 'M...', looks like a small tuba.",
      stage3: "Euphonium (100 pts) / Mellophone (95 pts)"
    },
    plankton: ["Trumpet", "Trombone", "Tuba", "French Horn"],
    tooClever: ["Flugelhorn", "Cornet", "Bugle", "Sousaphone"],
    schooler: ["Baritone Horn", "Euphonium"],
    rare: ["Mellophone", "Post horn", "Hunting horn"],
    deepCut: ["Wagner tuba", "Helicon", "Cimbasso"],
    oneInAKrillion: ["Ophicleide", "Serpent", "Sackbut", "Kuhlohorn"]
  },
  {
    id: 105,
    category: "Science / Chemistry",
    prompt: "An element on the Periodic Table starting with 'C'",
    hints: {
      stage1: "A rare synthetic transuranic radioactive actinide named after California.",
      stage2: "Starts with 'Cal...', symbol Cf.",
      stage3: "Californium (100 pts) / Copernicium (95 pts)"
    },
    plankton: ["Carbon", "Copper", "Calcium", "Chlorine"],
    tooClever: ["Cobalt", "Chromium", "Cesium", "Caesium"],
    schooler: ["Cadmium", "Cerium"],
    rare: ["Curium", "Californium"],
    deepCut: ["Copernicium", "Curium"],
    oneInAKrillion: ["Californium", "Copernicium", "Cerium", "Coronium (Disproven)"]
  },
  {
    id: 106,
    category: "Sports",
    prompt: "An NFL Football team located in the AFC East or NFC East",
    hints: {
      stage1: "Think about historically less mainstream or frequently forgotten franchises in division.",
      stage2: "Starts with 'W...', rebranded in 2022.",
      stage3: "Washington Commanders (100 pts) / Buffalo Bills (80 pts)"
    },
    plankton: ["Dallas Cowboys", "New England Patriots", "Philadelphia Eagles", "New York Giants"],
    tooClever: ["Miami Dolphins", "New York Jets"],
    schooler: ["Buffalo Bills"],
    rare: ["Washington Commanders"],
    deepCut: ["Washington Football Team (Former name)", "Boston Patriots (Historic)"],
    oneInAKrillion: ["Washington Commanders", "Buffalo Bisons (Pre-modern)", "Frankford Yellow Jackets"]
  }
];

// Archive data of past games
export const ARCHIVE_GAMES = [
  {
    gameNumber: 45,
    date: "2026-10-09",
    bestDepth: "6,920m",
    highlights: "Key prompts included 'South American Capital' (Winner: Paramaribo) and 'Bird starting with P' (Winner: Potoo)."
  },
  {
    gameNumber: 44,
    date: "2026-10-08",
    bestDepth: "6,880m",
    highlights: "Key prompts included 'US State without an E' (Winner: Utah) and 'Stanley Kubrick Film' (Winner: Fear and Desire)."
  },
  {
    gameNumber: 43,
    date: "2026-10-07",
    bestDepth: "6,950m",
    highlights: "Key prompts included 'European River' (Winner: Vltava) and 'Fruit starting with K' (Winner: Kumquat)."
  },
  {
    gameNumber: 42,
    date: "2026-10-06",
    bestDepth: "6,800m",
    highlights: "Key prompts included 'Periodic Table Noble Gas' (Winner: Oganesson) and 'Steven Spielberg Film' (Winner: Duel)."
  }
];
