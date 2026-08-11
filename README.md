# W Suffers 🏃‍♂️💥

> *"How long can you suffer?"*

**W Suffers** is a fast-paced, 3D endless runner web application built with HTML, CSS, Vanilla JavaScript (ES Modules), and **Three.js**.

Developer Credit: **Made by Wyzuk**  
GitHub: [github.com/wyzuk](https://github.com/wyzuk)

---

## 🌟 Game Overview

**W Suffers** challenges players to run through a procedurally generated urban 3D environment while dodging obstacles, leaping over low barriers, sliding under hazard gantries, collecting gold & W-coins, and activating power-ups.

### Key Highlights:
- **100% Original Identity:** Custom procedural 3D runner character ("W-Bot") with custom limb animations (run, jump, slide, fall, crash tumble) and squash & stretch physics. No copyrighted assets used.
- **Upright 3-Lane Track System:** True camera tracking from behind & above, with ground anchored at `Y=0` and sky at `Y>0`.
- **Dynamic 5-Theme Procedural Generation:** Seamlessly transitions across **City Streets**, **Subway Yard**, **Underground Tunnel**, **Industrial Zone**, and **Cyber Neon Night**.
- **Fair Collision Engine:** Precise 3D Axis-Aligned Bounding Box (AABB) collision checks for low barriers, overhead hazard signs, stationary barricades, crates, and moving trains.
- **Web Audio API Synthesizer:** Zero external audio downloads required! Synthesizes dynamic sound effects (coin pickup, W-coin sparkle, jump whoosh, slide swoosh, shield shatter, crash thud) and retro electronic synth background music.
- **Persistent High Scores & Settings:** LocalStorage automatically persists your Best Score, Best Distance, Total Coins, Sound Volumes, Graphics Quality, and Controls preference.

---

## 🕹️ Controls

| Action | Keyboard Input | Touch / Mobile Gesture |
| :--- | :--- | :--- |
| **Move Left** | `A` or `Left Arrow (←)` | Swipe Left / Touch Button |
| **Move Right** | `D` or `Right Arrow (→)` | Swipe Right / Touch Button |
| **Jump** | `W` / `Up Arrow (↑)` / `Space` | Swipe Up / Touch Button |
| **Slide** | `S` / `Down Arrow (↓)` | Swipe Down / Touch Button |
| **Pause Game** | `Escape` or `P` | Top-Right Pause Button |

---

## ⚡ Power-Ups & Collectibles

| Collectible / Power-Up | Icon | Effect |
| :--- | :---: | :--- |
| **Gold Coin** | 🪙 | Increases score by +100 and adds +1 to coin counter. |
| **W-Coin** | 💖 | Rare pink coin! Grants +500 score and +5 coins. |
| **Magnet** | 🧲 | Automatically attracts all nearby coins within 14m radius via particle beams. |
| **Shield** | 🛡️ | Creates a glowing energy bubble around the runner, absorbing 1 fatal obstacle crash. |
| **2X Multiplier** | ✖️2 | Temporarily doubles all distance score gains. |
| **Speed Boost** | ⚡ | Jetpack turbo mode! Invincible super speed with dynamic camera FOV expansion. |

---

## 🚀 How to Run Locally

### Option 1: Direct File Launch (Easiest)
1. Navigate to the project directory: `C:\Users\WALTON\desktop\w`
2. Double-click `index.html` to launch directly in any Web Browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Python Server
Run the following command in terminal:
```bash
python -m http.server 8080
```
Then open your browser to: **`http://localhost:8080`**

---

## 📁 Architecture & File Structure

Organized cleanly into modular ES6 JavaScript classes:

```
w/
├── index.html                  # Main UI HTML layout, HUD, popups & modals
├── css/
│   └── style.css               # Modern gaming UI design system (glassmorphism & neon highlights)
├── js/
│   ├── main.js                 # Entry point & primary game loop state machine
│   ├── config.js               # Physics parameters, themes, powerups, funny text quotes
│   ├── utils/
│   │   ├── Storage.js          # LocalStorage scores & settings manager
│   │   ├── Audio.js            # Web Audio API sound synthesizer & music sequencer
│   │   ├── MathUtils.js        # Lerp, clamp, AABB 3D collision helpers
│   │   └── Input.js            # Keyboard & Mobile Swipe input controller
│   ├── engine/
│   │   ├── SceneManager.js     # WebGL Renderer, ambient & directional lights, theme fog
│   │   ├── CameraManager.js    # 3rd-person follow camera, lane tilt, shake & FOV zoom
│   │   └── ParticleSystem.js   # Foot dust, jump puffs, slide friction sparks, crash debris
│   ├── entities/
│   │   ├── Character.js        # Original 3D runner mesh ("W-Bot") & procedural limb animator
│   │   ├── Obstacle.js         # Barriers, overhead slides, moving trains, barricades
│   │   ├── Collectible.js      # Gold coins, W-coins & 3D power-up items
│   │   └── EnvironmentChunk.js # Track chunk with skyscrapers, tunnel arches & funny billboards
│   ├── systems/
│   │   ├── ChunkManager.js     # Endless procedural chunk generation & recycling
│   │   ├── CollisionSystem.js  # Fair AABB bounding box collision engine
│   │   ├── PowerUpManager.js   # Active power-up timers & effect management
│   │   └── DifficultySystem.js # Distance-based speed scaling curve
│   └── ui/
│       ├── UIManager.js        # Main menu, HUD, pause screen, settings modal, game-over
│       └── FPSCounter.js       # Real-time framerate monitor
└── README.md
```

---

W Suffers — Made by Wyzuk  
[github.com/wyzuk](https://github.com/wyzuk)
