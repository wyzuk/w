   W SUFFERS — Procedural Environment Chunk & Track Segment

import { CONFIG } from '../config.js';
import { MathUtils } from '../utils/MathUtils.js';
import { Obstacle } from './Obstacle.js';
import { Collectible } from './Collectible.js';

export class EnvironmentChunk {
  constructor(scene, theme, zPos, chunkIndex) {
    this.scene = scene;
    this.theme = theme;
    this.zPos = zPos; // Negative Z coordinate
    this.chunkIndex = chunkIndex;

    this.group = new THREE.Group();
    this.group.position.z = zPos;
    this.scene.add(this.group);

    this.obstacles = [];
    this.collectibles = [];

    this.buildTrackAndScenery();
    if (chunkIndex > 1) {
      this.populateObstaclesAndCoins();
    }
  }

  buildTrackAndScenery() {
    const length = CONFIG.CHUNK_LENGTH;

    const groundGeo = new THREE.BoxGeometry(12, 0.4, length);
    const groundMat = new THREE.MeshStandardMaterial({
      color: this.theme.groundColor,
      roughness: 0.7
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.set(0, -0.2, -length / 2);
    ground.receiveShadow = true;
    this.group.add(ground);

    const stripMat = new THREE.MeshStandardMaterial({
      color: this.theme.accentColor,
      emissive: this.theme.accentColor,
      emissiveIntensity: 0.8
    });
    const stripGeo = new THREE.BoxGeometry(0.2, 0.1, length);
    const leftStrip = new THREE.Mesh(stripGeo, stripMat);
    leftStrip.position.set(-5.0, 0.05, -length / 2);
    const rightStrip = leftStrip.clone();
    rightStrip.position.x = 5.0;
    this.group.add(leftStrip, rightStrip);

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const lineGeo = new THREE.BoxGeometry(0.08, 0.02, 3);
    for (let z = -2; z > -length; z -= 6) {
      const l1 = new THREE.Mesh(lineGeo, lineMat);
      l1.position.set(-1.6, 0.02, z);
      const l2 = l1.clone();
      l2.position.x = 1.6;
      this.group.add(l1, l2);
    }

    if (this.theme.id === 'underground') {
      this.buildTunnelArches(length);
    } else {
      this.buildBuildingsAndBillboards(length);
    }
  }

  buildBuildingsAndBillboards(length) {
    const bColors = this.theme.buildingColors;
    const windowMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.5 });

    for (let z = -5; z > -length; z -= 16) {
      [-10, 10].forEach(xPos => {
        const height = MathUtils.randRange(18, 38);
        const bGeo = new THREE.BoxGeometry(8, height, 12);
        const bMat = new THREE.MeshStandardMaterial({ color: MathUtils.randChoice(bColors), roughness: 0.4 });
        const building = new THREE.Mesh(bGeo, bMat);
        building.position.set(xPos, height / 2, z);
        building.castShadow = true;
        building.receiveShadow = true;
        this.group.add(building);

        const winGeo = new THREE.BoxGeometry(0.1, 0.8, 0.8);
        for (let wy = 4; wy < height - 2; wy += 4) {
          const win = new THREE.Mesh(winGeo, windowMat);
          win.position.set(xPos > 0 ? -4.05 : 4.05, wy, z);
          this.group.add(win);
        }
      });

      if (z === -21 && Math.random() > 0.3) {
        this.buildBillboardArch(z);
      }
    }
  }

  buildTunnelArches(length) {
    const archMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const neonRingMat = new THREE.MeshStandardMaterial({
      color: this.theme.accentColor,
      emissive: this.theme.accentColor,
      emissiveIntensity: 0.9
    });

    for (let z = -4; z > -length; z -= 12) {
      const ringGeo = new THREE.TorusGeometry(5.8, 0.3, 8, 16, Math.PI);
      const ring = new THREE.Mesh(ringGeo, neonRingMat);
      ring.position.set(0, 0, z);
      this.group.add(ring);
    }
  }

  buildBillboardArch(zRel) {
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
    const signText = MathUtils.randChoice(CONFIG.FUNNY_SIGNS);

    const gantryGeo = new THREE.BoxGeometry(11, 0.5, 0.5);
    const gantry = new THREE.Mesh(gantryGeo, metalMat);
    gantry.position.set(0, 5.5, zRel);

    const legGeo = new THREE.CylinderGeometry(0.2, 0.2, 5.5, 8);
    const leg1 = new THREE.Mesh(legGeo, metalMat);
    leg1.position.set(-5.2, 2.75, zRel);
    const leg2 = leg1.clone();
    leg2.position.x = 5.2;

    const panelGeo = new THREE.BoxGeometry(6.5, 1.8, 0.2);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 504, 120);

    ctx.fillStyle = '#ff007f';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(signText, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const panelMat = new THREE.MeshBasicMaterial({ map: texture });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 5.5, zRel + 0.15);

    this.group.add(gantry, leg1, leg2, panel);
  }

  populateObstaclesAndCoins() {
    const laneIndices = [0, 1, 2];

    [18, 42].forEach(zOffset => {
      const openLane = MathUtils.randChoice(laneIndices);
      const blockedLanes = laneIndices.filter(l => l !== openLane);

      blockedLanes.forEach(lIdx => {
        if (Math.random() < 0.85) {
          const typeChoice = MathUtils.randChoice(['low_barrier', 'overhead_barrier', 'train', 'barrier', 'crates']);
          const obs = new Obstacle(typeChoice, lIdx, this.zPos - zOffset);
          this.group.add(obs.group);
          this.obstacles.push(obs);
        }
      });
    });

    const coinLane = MathUtils.randChoice(laneIndices);
    const startZOffset = 8;
    for (let i = 0; i < 6; i++) {
      const zOffset = startZOffset + i * 2.5;
      const coin = new Collectible('coin', coinLane, this.zPos - zOffset, 1.0);
      this.group.add(coin.group);
      this.collectibles.push(coin);
    }

    if (Math.random() < 0.25) {
      const puType = MathUtils.randChoice(['magnet', 'shield', 'multiplier', 'speedboost']);
      const puLane = MathUtils.randChoice(laneIndices);
      const powerup = new Collectible(puType, puLane, this.zPos - 30, 1.2);
      this.group.add(powerup.group);
      this.collectibles.push(powerup);
    }
  }

  update(delta) {
    this.obstacles.forEach(o => o.update(delta));
  }

  destroy() {
    this.scene.remove(this.group);
  }
}
