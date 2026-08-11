/* ==========================================================================
   W SUFFERS — Dynamic Difficulty & Pacing Scaling Engine
   ========================================================================== */

import { CONFIG } from '../config.js';
import { MathUtils } from '../utils/MathUtils.js';

export class DifficultySystem {
  constructor() {
    this.currentSpeed = CONFIG.PLAYER.START_SPEED;
    this.distanceTraveled = 0;
  }

  reset() {
    this.currentSpeed = CONFIG.PLAYER.START_SPEED;
    this.distanceTraveled = 0;
  }

  update(delta, distance) {
    this.distanceTraveled = distance;

    // Smooth speed scaling per 100 meters
    const targetSpeed = CONFIG.PLAYER.START_SPEED + (distance / 100) * CONFIG.PLAYER.SPEED_ACCEL;
    this.currentSpeed = MathUtils.clamp(targetSpeed, CONFIG.PLAYER.START_SPEED, CONFIG.PLAYER.MAX_SPEED);
  }

  getSpeed(isSpeedBoostActive = false) {
    return isSpeedBoostActive ? this.currentSpeed * 1.5 : this.currentSpeed;
  }
}
