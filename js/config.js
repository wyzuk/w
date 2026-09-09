   W SUFFERS — Game Configurations & Constants

export const CONFIG = {
  // World & Track
  LANE_X: [-3.2, 0, 3.2], // Left, Center, Right lane X coordinates
  CHUNK_LENGTH: 60,       // Length of each track segment in 3D units
  INITIAL_CHUNKS: 7,      // Number of chunks rendered ahead of player

  // Player Physics Tuning
  PLAYER: {
    START_SPEED: 26,       // Initial forward running speed (units/sec)
    MAX_SPEED: 58,         // Maximum speed cap
    SPEED_ACCEL: 0.25,     // Speed increase per 100 meters
    LANE_CHANGE_SPEED: 18, // Speed of lerp across lanes
    JUMP_FORCE: 16.5,      // Upward jump impulse
    GRAVITY: -45,          // Downward gravity pull
    SLIDE_DURATION: 0.75,  // Duration of slide state in seconds
    NORMAL_HEIGHT: 1.8,    // Standing collider height
    SLIDE_HEIGHT: 0.8,     // Sliding collider height
  },

  // Environment Themes
  THEMES: [
    {
      id: 'city',
      name: 'City Streets',
      fogColor: 0x0f172a,
      skyColor: 0x0f172a,
      groundColor: 0x1e293b,
      accentColor: 0x00e5ff,
      buildingColors: [0x111827, 0x1f2937, 0x374151],
      lightColor: 0xfff0dd
    },
    {
      id: 'train_yard',
      name: 'Subway Yard',
      fogColor: 0x1a102f,
      skyColor: 0x1a102f,
      groundColor: 0x241442,
      accentColor: 0xff007f,
      buildingColors: [0x1f1938, 0x2b234d, 0x3a3066],
      lightColor: 0xffaa00
    },
    {
      id: 'underground',
      name: 'Underground Tunnel',
      fogColor: 0x0a192f,
      skyColor: 0x040d1a,
      groundColor: 0x0d2137,
      accentColor: 0x00ff88,
      buildingColors: [0x081526, 0x0d243f, 0x123256],
      lightColor: 0x00e5ff
    },
    {
      id: 'industrial',
      name: 'Industrial Zone',
      fogColor: 0x2a1a08,
      skyColor: 0x2a1a08,
      groundColor: 0x3d270c,
      accentColor: 0xffbb00,
      buildingColors: [0x33200a, 0x472d0e, 0x5c3b12],
      lightColor: 0xff9900
    },
    {
      id: 'neon_night',
      name: 'Neon Cyber City',
      fogColor: 0x120024,
      skyColor: 0x120024,
      groundColor: 0x20003b,
      accentColor: 0x00ffff,
      buildingColors: [0x1c0033, 0x2b004f, 0x3f0073],
      lightColor: 0xff00ff
    }
  ],

  // Collectibles & Powerup Durations (seconds)
  POWERUPS: {
    MAGNET: { duration: 10, color: 0xff3366, icon: '🧲', label: 'MAGNET' },
    SHIELD: { duration: 12, color: 0x00e5ff, icon: '🛡️', label: 'SHIELD' },
    MULTIPLIER: { duration: 10, color: 0xa855f7, icon: '✖️2', label: '2X SCORE' },
    SPEEDBOOST: { duration: 6, color: 0xffd700, icon: '⚡', label: 'BOOST' }
  },

  // Score Tuning
  SCORE: {
    DISTANCE_MULTIPLIER: 1.5,
    COIN_VALUE: 100,
    W_COIN_VALUE: 500,
  },

  FUNNY_SIGNS: [
    "BRO RUN 🏃‍♂️",
    "WHY ARE YOU STILL RUNNING?",
    "W SUFFERER 🔥",
    "NO WIFI AHEAD 📡",
    "SKILL ISSUE 💀",
    "KEEP SUFFERING",
    "ALMOST W 🏆",
    "YOU THOUGHT 💀",
    "WYZUK WAS HERE",
    "W CAFE - FREE COFFEE",
    "TRAINS DON'T BRAKE 🚆",
    "DONT LOOK BACK",
    "STILL ALIVE?",
    "PRESS W TO W",
    "PRESS SPACE TO JUMP",
    "SUFFERS INC."
  ],

  // Funny Game-Over Commentary
  FUNNY_QUOTES: [
    "Skill issue detected. Try again!",
    "The train wins every single time.",
    "Bro didn't press jump in time 💀",
    "You collided with reality.",
    "Wyzuk is shaking his head right now.",
    "Physics: 1, You: 0.",
    "Legend says you're still stumbling.",
    "Suffered gracefully. High five!",
    "Almost made it to the next W!"
  ]
};
