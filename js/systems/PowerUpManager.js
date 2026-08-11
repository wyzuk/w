/* ==========================================================================
   W SUFFERS — Active Power-Up Timers & Status Manager
   ========================================================================== */

import { CONFIG } from '../config.js';

export class PowerUpManager {
  constructor() {
    this.activePowerUps = {
      magnet: { active: false, timer: 0, duration: CONFIG.POWERUPS.MAGNET.duration },
      shield: { active: false, timer: 0, duration: CONFIG.POWERUPS.SHIELD.duration },
      multiplier: { active: false, timer: 0, duration: CONFIG.POWERUPS.MULTIPLIER.duration },
      speedboost: { active: false, timer: 0, duration: CONFIG.POWERUPS.SPEEDBOOST.duration }
    };

    this.onPowerUpChangeCallback = null;
  }

  onPowerUpChange(cb) {
    this.onPowerUpChangeCallback = cb;
  }

  activate(type) {
    const key = type.toLowerCase();
    if (this.activePowerUps[key]) {
      this.activePowerUps[key].active = true;
      this.activePowerUps[key].timer = this.activePowerUps[key].duration;
      if (this.onPowerUpChangeCallback) this.onPowerUpChangeCallback(key, true);
    }
  }

  deactivate(key) {
    if (this.activePowerUps[key]) {
      this.activePowerUps[key].active = false;
      this.activePowerUps[key].timer = 0;
      if (this.onPowerUpChangeCallback) this.onPowerUpChangeCallback(key, false);
    }
  }

  isMagnetActive() {
    return this.activePowerUps.magnet.active;
  }

  isShieldActive() {
    return this.activePowerUps.shield.active;
  }

  isMultiplierActive() {
    return this.activePowerUps.multiplier.active;
  }

  isSpeedBoostActive() {
    return this.activePowerUps.speedboost.active;
  }

  consumeShield() {
    if (this.isShieldActive()) {
      this.deactivate('shield');
      return true;
    }
    return false;
  }

  update(delta) {
    Object.keys(this.activePowerUps).forEach(key => {
      const p = this.activePowerUps[key];
      if (p.active) {
        p.timer -= delta;
        if (p.timer <= 0) {
          this.deactivate(key);
        }
      }
    });
  }

  reset() {
    Object.keys(this.activePowerUps).forEach(key => {
      this.deactivate(key);
    });
  }
}
