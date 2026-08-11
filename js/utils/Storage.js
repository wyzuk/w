/* ==========================================================================
   W SUFFERS — LocalStorage & Data Storage Manager
   ========================================================================== */

const STORAGE_KEYS = {
  HIGH_SCORE: 'w_suffers_high_score',
  BEST_DISTANCE: 'w_suffers_best_distance',
  TOTAL_COINS: 'w_suffers_total_coins',
  SETTINGS: 'w_suffers_settings'
};

const DEFAULT_SETTINGS = {
  musicVol: 70,
  sfxVol: 80,
  graphics: 'high',
  cameraShake: true,
  showFps: false,
  onScreenControls: false
};

export class StorageManager {
  static getHighScore() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || '0', 10);
  }

  static setHighScore(score) {
    const current = this.getHighScore();
    if (score > current) {
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
      return true; // New record!
    }
    return false;
  }

  static getBestDistance() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.BEST_DISTANCE) || '0', 10);
  }

  static setBestDistance(dist) {
    const current = this.getBestDistance();
    if (dist > current) {
      localStorage.setItem(STORAGE_KEYS.BEST_DISTANCE, dist.toString());
      return true;
    }
    return false;
  }

  static getTotalCoins() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_COINS) || '0', 10);
  }

  static addCoins(coins) {
    const total = this.getTotalCoins() + coins;
    localStorage.setItem(STORAGE_KEYS.TOTAL_COINS, total.toString());
    return total;
  }

  static getSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  static saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
  }

  static resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.HIGH_SCORE);
    localStorage.removeItem(STORAGE_KEYS.BEST_DISTANCE);
    localStorage.removeItem(STORAGE_KEYS.TOTAL_COINS);
  }
}
