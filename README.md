# W Suffers 🏃‍♂️💥

> *"How long can you suffer?"*

A fast-paced, highly responsive, original 3D 3-lane endless runner built with HTML, CSS, JavaScript, and Three.js.

Developer Credit: **Made by Wyzuk**  
GitHub: [github.com/wyzuk](https://github.com/wyzuk)

---

## 🎮 Features

- **Original Identity & 3D Runner:** Stylized procedural 3D runner character ("W-Bot") with running, jumping, sliding, falling, and death ragdoll-like animations + squash and stretch physics!
- **3-Lane System:** Smooth lane transitions (A/D or Arrow keys or Touch Swipes).
- **Procedural Endless World:** Continuous segment chunk generation with recycling for optimal 60 FPS performance without memory leaks.
- **Multiple Environment Themes:** Seamless transitions between City Streets, Subway Yard, Underground Tunnel, Industrial Zone, and Cyber Neon Night.
- **Original Obstacle Types:** Low barriers (jump over), overhead barriers (slide under), moving subway trains, stationary construction barricades, crate stacks, and track gaps.
- **Collectibles & Power-Ups:**
  - 🪙 **Gold Coins** (+100 score) & 💖 **W-Coins** (+500 score)
  - 🧲 **Magnet**: Attracts nearby coins with particle magnet beams.
  - 🛡️ **Shield**: Protects against 1 fatal obstacle impact.
  - ✖️2 **2X Multiplier**: Doubling distance score gains.
  - ⚡ **Speed Boost**: Invincible jetpack turbo mode with FOV camera zoom.
- **Web Audio API Synthesizer:** Zero asset downloads! Procedural sound effects (coin dings, jump whoosh, slide swoosh, shield shatter, crash thud) and upbeat retro synth music.
- **Juicy Visual Effects:** Foot dust, jump puffs, slide friction sparks, coin bursts, camera tilt, camera shake, and atmospheric theme fog.
- **Humorous Identity:** Procedural funny billboards along tracks ("BRO RUN 🏃‍♂️", "WHY ARE YOU STILL RUNNING?", "SKILL ISSUE 💀", "NO WIFI AHEAD 📡", "WYZUK WAS HERE") and funny game-over quotes.
- **Full Persistence & Settings:** Saves high score, best distance, total coins, sound volume, camera shake, graphics quality, and FPS counter via `localStorage`.

---

## 🚀 How to Run Locally

No build tools or backend required!

### Option 1: Direct File Open
1. Open the project folder `C:\Users\WALTON\desktop\w`
2. Double-click `index.html` to open directly in any modern Web Browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Optional)
If using Python:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

---

## 🕹️ Player Controls

| Action | Keyboard | Touch / Mobile |
| :--- | :--- | :--- |
| Move Left | `A` or `←` | Swipe Left / Touch Button |
| Move Right | `D` or `→` | Swipe Right / Touch Button |
| Jump | `W` / `↑` / `Space` | Swipe Up / Touch Button |
| Slide | `S` / `↓` | Swipe Down / Touch Button |
| Pause Game | `Escape` or `P` | Pause Icon Top Right |

---

## 📁 Code Architecture

Organized cleanly into logical ES modules:

```
w/
├── index.html                  # Main UI layout, screens, modals & HUD
├── css/
│   └── style.css               # Modern gaming UI design system & glassmorphism
├── js/
│   ├── main.js                 # Entry point & primary game loop state machine
│   ├── config.js               # Physics parameters, themes, power-ups, funny quotes
│   ├── utils/
│   │   ├── Storage.js          # LocalStorage score & settings manager
│   │   ├── Audio.js            # Web Audio API sound & synth music generator
│   │   ├── MathUtils.js        # Lerp, clamp, AABB collision helpers
│   │   └── Input.js            # Keyboard & Swipe input controller
│   ├── engine/
│   │   ├── SceneManager.js     # WebGL Renderer, lighting & atmospheric fog
│   │   ├── CameraManager.js    # 3rd-person camera, follow, tilt, shake, FOV zoom
│   │   └── ParticleSystem.js   # Dust, sparks, coin sparkles, crash debris
│   ├── entities/
│   │   ├── Character.js        # Procedural 3D runner mesh & limb animator
│   │   ├── Obstacle.js         # Barriers, overhead slides, trains & crates
│   │   ├── Collectible.js      # Gold coins, W-coins & power-ups
│   │   └── EnvironmentChunk.js # Track chunk with buildings, arches & billboards
│   ├── systems/
│   │   ├── ChunkManager.js     # Continuous endless world spawning & recycling
│   │   ├── CollisionSystem.js  # AABB & Sphere collision detection
│   │   ├── PowerUpManager.js   # Active power-up timers & effects
│   │   └── DifficultySystem.js # Speed & difficulty scaling curve
│   └── ui/
│       ├── UIManager.js        # Main menu, HUD, pause modal, settings, game-over
│       └── FPSCounter.js       # Real-time framerate monitor
└── README.md
```

---

W Suffers — Made by Wyzuk  
[github.com/wyzuk](https://github.com/wyzuk)
