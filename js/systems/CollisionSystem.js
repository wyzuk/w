/* ==========================================================================
   W SUFFERS — Collision Detection System
   ========================================================================== */

import { MathUtils } from '../utils/MathUtils.js';
import { audio } from '../utils/Audio.js';
import { CONFIG } from '../config.js';

export class CollisionSystem {
  constructor(particleSystem, powerUpManager, cameraManager) {
    this.particleSystem = particleSystem;
    this.powerUpManager = powerUpManager;
    this.cameraManager = cameraManager;

    this.onCoinCollectCallback = null;
    this.onPowerupCollectCallback = null;
    this.onPlayerCrashCallback = null;
  }

  onCoinCollect(cb) { this.onCoinCollectCallback = cb; }
  onPowerupCollect(cb) { this.onPowerupCollectCallback = cb; }
  onPlayerCrash(cb) { this.onPlayerCrashCallback = cb; }

  update(character, chunkManager) {
    if (character.state === 'DEAD') return;

    const playerBox = character.getCollider();
    const playerPos = character.group.position;

    const isSpeedBoost = this.powerUpManager.isSpeedBoostActive();
    const isMagnet = this.powerUpManager.isMagnetActive();

    // 1. CHECK OBSTACLE COLLISIONS
    const obstacles = chunkManager.getAllObstacles();
    for (let i = 0; i < obstacles.length; i++) {
      const obs = obstacles[i];
      // Quick Z distance filtering optimization
      if (Math.abs(obs.group.position.z - playerPos.z) > 12) continue;

      const obsBox = obs.getCollider();

      if (MathUtils.checkAABBIntersect(playerBox, obsBox)) {
        if (isSpeedBoost) {
          // Speed boost smashes right through obstacles!
          this.particleSystem.emitCollisionDebris(obs.group.position);
          this.cameraManager.triggerShake(0.3);
          audio.playCollisionSound();
          obs.group.visible = false;
        } else if (this.powerUpManager.isShieldActive()) {
          // Shield absorbs 1 collision!
          this.powerUpManager.consumeShield();
          character.setShieldActive(false);
          this.particleSystem.emitCollisionDebris(playerPos);
          this.cameraManager.triggerShake(0.6);
          audio.playShieldHitSound();
          obs.group.visible = false;
        } else {
          // Fatal Crash!
          this.particleSystem.emitCollisionDebris(playerPos);
          this.cameraManager.triggerShake(1.2);
          audio.playCollisionSound();
          character.die();
          if (this.onPlayerCrashCallback) this.onPlayerCrashCallback();
          return;
        }
      }
    }

    // 2. CHECK COLLECTIBLE COLLISIONS (Coins & Power-ups)
    const collectibles = chunkManager.getAllCollectibles();
    for (let i = 0; i < collectibles.length; i++) {
      const c = collectibles[i];
      if (c.isCollected) continue;

      // Update magnet movement or rotation animation
      c.update(1 / 60, playerPos, isMagnet);

      // Distance check
      const dist = c.group.position.distanceTo(playerPos);
      if (dist < c.getColliderSphere().radius + 0.5) {
        c.isCollected = true;
        c.group.visible = false;

        if (c.type === 'coin' || c.type === 'w_coin') {
          const isW = (c.type === 'w_coin');
          this.particleSystem.emitCoinCollect(c.group.position, isW);
          audio.playCoinSound(isW);
          if (this.onCoinCollectCallback) {
            this.onCoinCollectCallback(isW ? CONFIG.SCORE.W_COIN_VALUE : CONFIG.SCORE.COIN_VALUE, isW ? 5 : 1);
          }
        } else {
          // Power-up pickup
          this.particleSystem.emitCoinCollect(c.group.position, true);
          audio.playPowerupSound();
          this.powerUpManager.activate(c.type);
          if (c.type === 'shield') character.setShieldActive(true);
          if (this.onPowerupCollectCallback) {
            this.onPowerupCollectCallback(c.type);
          }
        }
      }
    }
  }
}
