   W SUFFERS — Procedural Collectibles & Power-Ups

import { CONFIG } from '../config.js';
import { MathUtils } from '../utils/MathUtils.js';

export class Collectible {
  constructor(type, laneIndex, zPos, yPos = 1.0) {
    this.type = type; // 'coin', 'w_coin', 'magnet', 'shield', 'multiplier', 'speedboost'
    this.laneIndex = laneIndex;
    this.zPos = zPos;
    this.yPos = yPos;
    this.laneX = CONFIG.LANE_X[laneIndex];

    this.group = new THREE.Group();
    this.group.position.set(this.laneX, yPos, zPos);

    this.isCollected = false;
    this.rotSpeed = MathUtils.randRange(2.5, 4.0);

    this.buildMesh();
  }

  buildMesh() {
    switch (this.type) {
      case 'coin':
        this.buildCoinMesh(0xffd700, 1.0);
        break;
      case 'w_coin':
        this.buildCoinMesh(0xff007f, 1.4, true);
        break;
      case 'magnet':
        this.buildMagnetMesh();
        break;
      case 'shield':
        this.buildShieldMesh();
        break;
      case 'multiplier':
        this.buildMultiplierMesh();
        break;
      case 'speedboost':
        this.buildSpeedBoostMesh();
        break;
      default:
        this.buildCoinMesh(0xffd700, 1.0);
        break;
    }
  }

  buildCoinMesh(colorHex, scale = 1.0, isW = false) {
    const coinGeo = new THREE.CylinderGeometry(0.4 * scale, 0.4 * scale, 0.1 * scale, 16);
    coinGeo.rotateX(Math.PI / 2);

    const coinMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      metalness: 0.8,
      roughness: 0.2,
      emissive: colorHex,
      emissiveIntensity: isW ? 0.6 : 0.3
    });

    const mesh = new THREE.Mesh(coinGeo, coinMat);
    mesh.castShadow = true;
    this.group.add(mesh);
  }

  buildMagnetMesh() {
    const magMat = new THREE.MeshStandardMaterial({
      color: 0xff3366,
      emissive: 0xff3366,
      emissiveIntensity: 0.5,
      metalness: 0.6
    });
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

    const archGeo = new THREE.TorusGeometry(0.35, 0.12, 12, 16, Math.PI);
    const arch = new THREE.Mesh(archGeo, magMat);
    arch.rotation.x = Math.PI;

    const tip1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.25, 0.24), tipMat);
    tip1.position.set(-0.35, -0.2, 0);

    const tip2 = tip1.clone();
    tip2.position.x = 0.35;

    this.group.add(arch, tip1, tip2);
  }

  buildShieldMesh() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.6,
      metalness: 0.8
    });

    const shieldGeo = new THREE.OctahedronGeometry(0.45, 1);
    const mesh = new THREE.Mesh(shieldGeo, mat);
    this.group.add(mesh);
  }

  buildMultiplierMesh() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 0.7
    });

    const boxGeo = new THREE.BoxGeometry(0.7, 0.7, 0.2);
    const mesh = new THREE.Mesh(boxGeo, mat);
    this.group.add(mesh);
  }

  buildSpeedBoostMesh() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 0.8
    });

    const boltGeo = new THREE.ConeGeometry(0.3, 0.8, 4);
    const mesh = new THREE.Mesh(boltGeo, mat);
    mesh.rotation.z = Math.PI / 4;
    this.group.add(mesh);
  }

  update(delta, playerPos = null, isMagnetActive = false) {
    if (this.isCollected) return;

    this.group.rotation.y += this.rotSpeed * delta;
    this.group.position.y = this.yPos + Math.sin(Date.now() * 0.005 + this.zPos) * 0.15;

    if (isMagnetActive && (this.type === 'coin' || this.type === 'w_coin') && playerPos) {
      const dist = this.group.position.distanceTo(playerPos);
      if (dist < 14) {
        this.group.position.lerp(playerPos, delta * 14);
      }
    }
  }

  /**
   * Bounding sphere collision check for collectibles.
   */
  getColliderSphere() {
    return {
      center: this.group.position,
      radius: this.type.includes('coin') ? 0.7 : 0.9
    };
  }
}
