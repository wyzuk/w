/* ==========================================================================
   W SUFFERS — UI & Overlay Screen Manager
   ========================================================================== */

import { StorageManager } from '../utils/Storage.js';
import { audio } from '../utils/Audio.js';
import { CONFIG } from '../config.js';
import { MathUtils } from '../utils/MathUtils.js';

export class UIManager {
  constructor(gameEngine) {
    this.game = gameEngine;

    // Elements
    this.screenMainMenu = document.getElementById('screen-main-menu');
    this.hudOverlay = document.getElementById('hud-overlay');
    this.modalPause = document.getElementById('modal-pause');
    this.screenGameOver = document.getElementById('screen-game-over');
    this.modalHowToPlay = document.getElementById('modal-how-to-play');
    this.modalSettings = document.getElementById('modal-settings');

    // HUD Elements
    this.hudScore = document.getElementById('hud-score-val');
    this.hudMultiplier = document.getElementById('hud-multiplier-badge');
    this.hudCoins = document.getElementById('hud-coins-val');
    this.hudDistance = document.getElementById('hud-distance-val');
    this.hudBest = document.getElementById('hud-best-val');
    this.activePowerupsContainer = document.getElementById('active-powerups-container');

    // Main Menu Stats
    this.menuBestScore = document.getElementById('menu-best-score');
    this.menuBestDistance = document.getElementById('menu-best-distance');
    this.menuTotalCoins = document.getElementById('menu-total-coins');

    // Game Over Elements
    this.goFinalScore = document.getElementById('go-final-score');
    this.goDistance = document.getElementById('go-distance');
    this.goCoins = document.getElementById('go-coins');
    this.goBestScore = document.getElementById('go-best-score');
    this.goQuote = document.getElementById('game-over-quote');
    this.newRecordBanner = document.getElementById('new-record-banner');

    // Toast Container
    this.toastContainer = document.getElementById('toast-container');

    this.initEventListeners();
    this.updateMenuStats();
  }

  initEventListeners() {
    // Main Menu Buttons
    document.getElementById('btn-start').addEventListener('click', () => {
      audio.playButtonClick();
      this.game.startGame();
    });

    document.getElementById('btn-how-to-play').addEventListener('click', () => {
      audio.playButtonClick();
      this.showModal(this.modalHowToPlay);
    });

    document.getElementById('btn-close-how-to-play').addEventListener('click', () => {
      audio.playButtonClick();
      this.hideModal(this.modalHowToPlay);
    });

    document.getElementById('btn-got-it').addEventListener('click', () => {
      audio.playButtonClick();
      this.hideModal(this.modalHowToPlay);
      this.game.startGame();
    });

    document.getElementById('btn-settings-main').addEventListener('click', () => {
      audio.playButtonClick();
      this.openSettings();
    });

    // HUD Pause Button
    document.getElementById('btn-pause-game').addEventListener('click', () => {
      audio.playButtonClick();
      this.game.pauseGame();
    });

    // Pause Menu Buttons
    document.getElementById('btn-resume').addEventListener('click', () => {
      audio.playButtonClick();
      this.game.resumeGame();
    });

    document.getElementById('btn-restart-pause').addEventListener('click', () => {
      audio.playButtonClick();
      this.hideModal(this.modalPause);
      this.game.restartGame();
    });

    document.getElementById('btn-settings-pause').addEventListener('click', () => {
      audio.playButtonClick();
      this.openSettings();
    });

    document.getElementById('btn-menu-pause').addEventListener('click', () => {
      audio.playButtonClick();
      this.hideModal(this.modalPause);
      this.game.showMainMenu();
    });

    // Game Over Buttons
    document.getElementById('btn-retry').addEventListener('click', () => {
      audio.playButtonClick();
      this.hideScreen(this.screenGameOver);
      this.game.restartGame();
    });

    document.getElementById('btn-menu-gameover').addEventListener('click', () => {
      audio.playButtonClick();
      this.hideScreen(this.screenGameOver);
      this.game.showMainMenu();
    });

    // Settings Modal Buttons & Inputs
    document.getElementById('btn-close-settings').addEventListener('click', () => {
      audio.playButtonClick();
      this.hideModal(this.modalSettings);
    });

    document.getElementById('btn-save-settings').addEventListener('click', () => {
      audio.playButtonClick();
      this.saveSettingsFromUI();
      this.hideModal(this.modalSettings);
    });

    document.getElementById('btn-reset-scores').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all high scores and coin stats?')) {
        StorageManager.resetAllData();
        this.updateMenuStats();
        this.showToast('Stats and high scores reset!');
      }
    });

    // Settings Live Sliders Label updates
    const musicSlider = document.getElementById('setting-music-vol');
    const sfxSlider = document.getElementById('setting-sfx-vol');
    if (musicSlider) {
      musicSlider.addEventListener('input', (e) => {
        document.getElementById('val-music-vol').textContent = `${e.target.value}%`;
      });
    }
    if (sfxSlider) {
      sfxSlider.addEventListener('input', (e) => {
        document.getElementById('val-sfx-vol').textContent = `${e.target.value}%`;
      });
    }
  }

  updateMenuStats() {
    if (this.menuBestScore) this.menuBestScore.textContent = StorageManager.getHighScore().toLocaleString();
    if (this.menuBestDistance) this.menuBestDistance.textContent = `${StorageManager.getBestDistance()}m`;
    if (this.menuTotalCoins) this.menuTotalCoins.textContent = StorageManager.getTotalCoins().toLocaleString();
  }

  showMainMenuScreen() {
    this.updateMenuStats();
    this.showScreen(this.screenMainMenu);
    this.hideScreen(this.hudOverlay);
    this.hideScreen(this.screenGameOver);
    this.hideModal(this.modalPause);
  }

  showHUD() {
    this.hideScreen(this.screenMainMenu);
    this.showScreen(this.hudOverlay);
    this.hideScreen(this.screenGameOver);
    this.hideModal(this.modalPause);
  }

  updateHUD(score, coins, distance, multiplier) {
    if (this.hudScore) this.hudScore.textContent = Math.floor(score).toLocaleString();
    if (this.hudCoins) this.hudCoins.textContent = coins.toLocaleString();
    if (this.hudDistance) this.hudDistance.textContent = Math.floor(distance);
    if (this.hudMultiplier) this.hudMultiplier.textContent = `${multiplier}X`;
    if (this.hudBest) this.hudBest.textContent = StorageManager.getHighScore().toLocaleString();
  }

  updateActivePowerupsUI(activePowerUps) {
    if (!this.activePowerupsContainer) return;
    this.activePowerupsContainer.innerHTML = '';

    Object.keys(activePowerUps).forEach(key => {
      const p = activePowerUps[key];
      if (p.active) {
        const info = CONFIG.POWERUPS[key.toUpperCase()];
        const pct = Math.max(0, (p.timer / p.duration) * 100);
        const secsLeft = Math.ceil(p.timer);

        const pill = document.createElement('div');
        pill.className = 'powerup-pill';
        pill.innerHTML = `
          <span>${info.icon}</span>
          <div style="display:flex; flex-direction:column; line-height: 1.1;">
            <strong>${info.label}</strong>
            <span style="font-size:10px; color:#94a3b8; font-weight: 600;">${secsLeft}s REMAINING</span>
          </div>
          <div class="powerup-progress-bg" style="width: ${pct}%;"></div>
        `;
        this.activePowerupsContainer.appendChild(pill);
      }
    });
  }

  showGameOver(score, coins, distance, isNewRecord) {
    this.hideScreen(this.hudOverlay);
    this.showScreen(this.screenGameOver);

    if (this.goFinalScore) this.goFinalScore.textContent = Math.floor(score).toLocaleString();
    if (this.goCoins) this.goCoins.textContent = coins;
    if (this.goDistance) this.goDistance.textContent = `${Math.floor(distance)}m`;
    if (this.goBestScore) this.goBestScore.textContent = StorageManager.getHighScore().toLocaleString();

    if (this.goQuote) this.goQuote.textContent = `"${MathUtils.randChoice(CONFIG.FUNNY_QUOTES)}"`;

    if (isNewRecord) {
      if (this.newRecordBanner) this.newRecordBanner.classList.remove('hidden');
    } else {
      if (this.newRecordBanner) this.newRecordBanner.classList.add('hidden');
    }
  }

  showPauseModal() {
    this.showModal(this.modalPause);
  }

  hidePauseModal() {
    this.hideModal(this.modalPause);
  }

  openSettings() {
    const settings = StorageManager.getSettings();

    document.getElementById('setting-music-vol').value = settings.musicVol;
    document.getElementById('val-music-vol').textContent = `${settings.musicVol}%`;

    document.getElementById('setting-sfx-vol').value = settings.sfxVol;
    document.getElementById('val-sfx-vol').textContent = `${settings.sfxVol}%`;

    document.getElementById('setting-graphics').value = settings.graphics;
    document.getElementById('setting-shake').checked = settings.cameraShake;
    document.getElementById('setting-fps').checked = settings.showFps;
    document.getElementById('setting-on-screen-controls').checked = settings.onScreenControls;

    this.showModal(this.modalSettings);
  }

  saveSettingsFromUI() {
    const settings = {
      musicVol: parseInt(document.getElementById('setting-music-vol').value, 10),
      sfxVol: parseInt(document.getElementById('setting-sfx-vol').value, 10),
      graphics: document.getElementById('setting-graphics').value,
      cameraShake: document.getElementById('setting-shake').checked,
      showFps: document.getElementById('setting-fps').checked,
      onScreenControls: document.getElementById('setting-on-screen-controls').checked
    };

    StorageManager.saveSettings(settings);
    audio.setVolumes(settings.musicVol, settings.sfxVol);
    this.game.applySettings(settings);
    this.showToast('Settings Saved!');
  }

  showToast(msg) {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2200);
  }

  showScreen(elem) {
    if (elem) elem.classList.remove('hidden');
  }

  hideScreen(elem) {
    if (elem) elem.classList.add('hidden');
  }

  showModal(elem) {
    if (elem) elem.classList.remove('hidden');
  }

  hideModal(elem) {
    if (elem) elem.classList.add('hidden');
  }
}
