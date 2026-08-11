/* ==========================================================================
   W SUFFERS — Main Game Engine & Loop Entry Point
   ========================================================================== */

import { CONFIG } from './config.js';
import { StorageManager } from './utils/Storage.js';
import { audio } from './utils/Audio.js';
import { InputManager } from './utils/Input.js';

import { SceneManager } from './engine/SceneManager.js';
import { CameraManager } from './engine/CameraManager.js';
import { ParticleSystem } from './engine/ParticleSystem.js';

import { Character } from './entities/Character.js';
import { ChunkManager } from './systems/ChunkManager.js';
import { CollisionSystem } from './systems/CollisionSystem.js';
import { PowerUpManager } from './systems/PowerUpManager.js';
import { DifficultySystem } from './systems/DifficultySystem.js';

import { UIManager } from './ui/UIManager.js';
import { FPSCounter } from './ui/FPSCounter.js';

class GameEngine {
  constructor() {
    this.state = 'MENU'; // 'MENU', 'PLAYING', 'PAUSED', 'GAMEOVER'

    // Core Components
    this.canvas = document.getElementById('three-canvas');
    this.sceneManager = new SceneManager(this.canvas);
    this.cameraManager = new CameraManager();
    this.particleSystem = new ParticleSystem(this.sceneManager.scene);

    // Game Entities & Systems
    this.character = new Character(this.sceneManager.scene);
    this.chunkManager = new ChunkManager(this.sceneManager.scene, this.sceneManager);
    this.powerUpManager = new PowerUpManager();
    this.difficultySystem = new DifficultySystem();

    this.collisionSystem = new CollisionSystem(
      this.particleSystem,
      this.powerUpManager,
      this.cameraManager
    );

    this.inputManager = new InputManager();
    this.fpsCounter = new FPSCounter();
    this.uiManager = new UIManager(this);

    // Score & Stats
    this.score = 0;
    this.distance = 0;
    this.coinsCollected = 0;
    this.multiplier = 1;

    this.clock = new THREE.Clock();
    this.lastMilestoneToast = 0;

    this.init();
  }

  init() {
    // Input Callbacks
    this.inputManager.onAction((action) => this.handleInputAction(action));

    // Collision Callbacks
    this.collisionSystem.onCoinCollect((points, coins) => {
      const mult = this.powerUpManager.isMultiplierActive() ? 2 : 1;
      this.score += points * mult;
      this.coinsCollected += coins;
    });

    this.collisionSystem.onPowerupCollect((type) => {
      const label = CONFIG.POWERUPS[type.toUpperCase()]?.label || type;
      this.uiManager.showToast(`POWER-UP: ${label}!`);
    });

    this.collisionSystem.onPlayerCrash(() => {
      this.handleGameOver();
    });

    // Apply Saved Settings
    const settings = StorageManager.getSettings();
    audio.setVolumes(settings.musicVol, settings.sfxVol);
    this.applySettings(settings);

    // Setup initial menu state
    this.showMainMenu();

    // Start Animation Loop
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  applySettings(settings) {
    this.sceneManager.setGraphicsQuality(settings.graphics);
    this.fpsCounter.setVisible(settings.showFps);

    const mobileControlsElem = document.getElementById('mobile-touch-controls');
    if (mobileControlsElem) {
      if (settings.onScreenControls) mobileControlsElem.classList.add('active-touch');
      else mobileControlsElem.classList.remove('active-touch');
    }
  }

  handleInputAction(action) {
    if (this.state === 'MENU') {
      if (action === 'jump' || action === 'slide') {
        this.startGame();
      }
      return;
    }

    if (this.state === 'PLAYING') {
      switch (action) {
        case 'moveLeft':
          if (this.character.moveLane('left')) audio.playSlideSound();
          break;
        case 'moveRight':
          if (this.character.moveLane('right')) audio.playSlideSound();
          break;
        case 'jump':
          if (this.character.jump()) {
            audio.playJumpSound();
            this.particleSystem.emitJumpDust(this.character.position);
          }
          break;
        case 'slide':
          if (this.character.slide()) {
            audio.playSlideSound();
            this.particleSystem.emitSlideSparks(this.character.position);
          }
          break;
        case 'pause':
          this.pauseGame();
          break;
      }
    } else if (this.state === 'PAUSED') {
      if (action === 'pause') {
        this.resumeGame();
      }
    }
  }

  showMainMenu() {
    this.state = 'MENU';
    this.uiManager.showMainMenuScreen();
    this.chunkManager.init();
    this.character.reset();
    this.cameraManager.setMenuMode();
    audio.stopMusic();
  }

  startGame() {
    audio.init();
    audio.startMusic();

    this.state = 'PLAYING';
    this.score = 0;
    this.distance = 0;
    this.coinsCollected = 0;
    this.multiplier = 1;
    this.lastMilestoneToast = 0;

    this.difficultySystem.reset();
    this.powerUpManager.reset();
    this.chunkManager.init();
    this.character.reset();
    this.particleSystem.clear();

    this.uiManager.showHUD();
    this.clock.start();
  }

  pauseGame() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.uiManager.showPauseModal();
    }
  }

  resumeGame() {
    if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.uiManager.hidePauseModal();
      this.clock.getDelta(); // reset delta step
    }
  }

  restartGame() {
    this.startGame();
  }

  handleGameOver() {
    this.state = 'GAMEOVER';
    audio.stopMusic();

    // Save statistics & check high scores
    const isNewRecord = StorageManager.setHighScore(Math.floor(this.score));
    StorageManager.setBestDistance(Math.floor(this.distance));
    StorageManager.addCoins(this.coinsCollected);

    setTimeout(() => {
      this.uiManager.showGameOver(this.score, this.coinsCollected, this.distance, isNewRecord);
    }, 600);
  }

  // --- MAIN ENGINE LOOP ---
  gameLoop(timestamp) {
    requestAnimationFrame((t) => this.gameLoop(t));

    const delta = Math.min(this.clock.getDelta(), 0.1); // Clamp delta to avoid huge jumps
    this.fpsCounter.update();

    if (this.state === 'PLAYING') {
      const isSpeedBoost = this.powerUpManager.isSpeedBoostActive();
      const isMultiplier = this.powerUpManager.isMultiplierActive();

      // 1. Difficulty & Speed Scaling
      this.difficultySystem.update(delta, this.distance);
      const currentSpeed = this.difficultySystem.getSpeed(isSpeedBoost);

      // 2. Advance Player Distance & Forward Movement (-Z direction)
      const forwardDelta = currentSpeed * delta;
      this.character.position.z -= forwardDelta;
      this.distance = -this.character.position.z;

      // 3. Update Score Continuous Ticker
      const mult = isMultiplier ? 2 : 1;
      this.multiplier = mult;
      this.score += forwardDelta * CONFIG.SCORE.DISTANCE_MULTIPLIER * mult;

      // 4. Update Character & Limbs
      this.character.update(delta, currentSpeed);

      // 5. Update Power-ups, Particles & World Chunks
      this.powerUpManager.update(delta);
      this.chunkManager.update(this.character.position.z, delta);
      this.particleSystem.update(delta);

      // Emit run dust particles under runner's feet
      if (this.character.isGrounded && !this.character.isSliding) {
        this.particleSystem.emitRunDust(this.character.position);
      }

      // 6. Check Collisions
      this.collisionSystem.update(this.character, this.chunkManager);

      // 7. Update Camera
      const settings = StorageManager.getSettings();
      this.cameraManager.setSpeedBoostFOV(isSpeedBoost);
      this.cameraManager.update(
        this.character.position,
        this.character.targetX,
        delta,
        settings.cameraShake
      );

      // 8. Update HUD & Powerup Bars
      this.uiManager.updateHUD(this.score, this.coinsCollected, this.distance, this.multiplier);
      this.uiManager.updateActivePowerupsUI(this.powerUpManager.activePowerUps);

      // Milestone Funny Toast Alerts
      const distanceFloor = Math.floor(this.distance);
      if (distanceFloor > 0 && distanceFloor % 500 === 0 && distanceFloor !== this.lastMilestoneToast) {
        this.lastMilestoneToast = distanceFloor;
        this.uiManager.showToast(`🔥 ${distanceFloor}m SUFFERED! KEEP RUNNING!`);
      }

    } else if (this.state === 'MENU') {
      // Menu background showcase animation loop
      this.character.position.z -= 10 * delta;
      this.character.update(delta, 10);
      this.chunkManager.update(this.character.position.z, delta);
      this.particleSystem.update(delta);
      this.cameraManager.setMenuMode();

    } else if (this.state === 'GAMEOVER') {
      // Death tumble animation continues
      this.character.update(delta, 0);
      this.particleSystem.update(delta);
    }

    // Render Scene
    this.sceneManager.render(this.cameraManager.camera);
  }
}

// Instantiate Engine when DOM loads
window.addEventListener('DOMContentLoaded', () => {
  new GameEngine();
});
