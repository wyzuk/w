/* ==========================================================================
   W SUFFERS — Dynamic Third-Person Camera Manager
   ========================================================================== */

import { MathUtils } from '../utils/MathUtils.js';

export class CameraManager {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );

    // Camera default up vector (Ground = Bottom, Sky = Top)
    this.camera.up.set(0, 1, 0);

    // Target Base Offset relative to Player (Positioned behind player at +7.5 Z)
    this.baseOffset = new THREE.Vector3(0, 3.8, 7.5);
    this.targetOffset = this.baseOffset.clone();

    // Camera State
    this.currentPosition = new THREE.Vector3(0, 3.8, 7.5);
    this.lookTarget = new THREE.Vector3(0, 1.8, -10);

    this.tiltAngle = 0;
    this.shakeIntensity = 0;
    this.baseFov = 65;
    this.targetFov = 65;

    window.addEventListener('resize', () => this.onWindowResize());
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  triggerShake(intensity = 0.5) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }

  setSpeedBoostFOV(active) {
    this.targetFov = active ? 82 : this.baseFov;
  }

  update(playerPos, playerLaneX, delta, isShakeEnabled = true) {
    // 1. Target camera location behind player (Z is playerPos.z + 7.5)
    const desiredX = playerPos.x * 0.7; // Subtle lane follow dampening
    const desiredY = playerPos.y + this.baseOffset.y;
    const desiredZ = playerPos.z + this.baseOffset.z;

    // Smooth position interpolation (lerp)
    this.currentPosition.x = MathUtils.lerp(this.currentPosition.x, desiredX, delta * 10);
    this.currentPosition.y = MathUtils.lerp(this.currentPosition.y, desiredY, delta * 8);
    this.currentPosition.z = MathUtils.lerp(this.currentPosition.z, desiredZ, delta * 14);

    // 2. Camera Tilt based on lane offset
    const targetTilt = (playerPos.x - playerLaneX) * 0.05;
    this.tiltAngle = MathUtils.lerp(this.tiltAngle, targetTilt, delta * 10);

    // 3. Camera Shake Decay
    let shakeOffset = new THREE.Vector3(0, 0, 0);
    if (this.shakeIntensity > 0.01 && isShakeEnabled) {
      shakeOffset.set(
        (Math.random() - 0.5) * this.shakeIntensity,
        (Math.random() - 0.5) * this.shakeIntensity,
        (Math.random() - 0.5) * this.shakeIntensity
      );
      this.shakeIntensity *= 0.88; // decay
    } else {
      this.shakeIntensity = 0;
    }

    // Apply camera position
    this.camera.position.copy(this.currentPosition).add(shakeOffset);

    // 4. Look Target (Ahead of player in negative Z direction)
    this.lookTarget.set(
      playerPos.x * 0.4,
      playerPos.y + 1.6,
      playerPos.z - 18
    );

    // Reset rotation & compute lookAt with upright up vector
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(this.lookTarget);

    // Apply slight roll tilt around local Z axis
    this.camera.rotateZ(this.tiltAngle);

    // 5. Smooth FOV transitions for Speed Boost
    if (Math.abs(this.camera.fov - this.targetFov) > 0.1) {
      this.camera.fov = MathUtils.lerp(this.camera.fov, this.targetFov, delta * 5);
      this.camera.updateProjectionMatrix();
    }
  }

  // Set camera view for Main Menu background showcase
  setMenuMode() {
    this.camera.position.set(0, 4, 8);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(0, 2, -12);
  }
}
