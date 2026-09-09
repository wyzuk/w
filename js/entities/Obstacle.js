   W SUFFERS — Procedural 3D Obstacles Factory & Mesh Creator

import { CONFIG } from '../config.js';

export class Obstacle {
  constructor(type, laneIndex, zPos) {
    this.type = type; // low_barrier, overhead_barrier, train, moving_train, barrier, crates, gap
    this.laneIndex = laneIndex;
    this.zPos = zPos;
    this.laneX = CONFIG.LANE_X[laneIndex];

    this.group = new THREE.Group();
    this.group.position.set(this.laneX, 0, zPos);

    this.isMoving = (type === 'moving_train');
    this.moveSpeed = 14; // Speed towards player for moving train

    this.buildMesh();
  }

  buildMesh() {
    switch (this.type) {
      case 'low_barrier':
        this.buildLowBarrier();
        break;
      case 'overhead_barrier':
        this.buildOverheadBarrier();
        break;
      case 'train':
      case 'moving_train':
        this.buildTrain();
        break;
      case 'barrier':
        this.buildStationaryBarrier();
        break;
      case 'crates':
        this.buildCrates();
        break;
      default:
        this.buildStationaryBarrier();
        break;
    }
  }

  buildLowBarrier() {
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.4 });
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0x111827 });

    const footGeo = new THREE.BoxGeometry(0.3, 0.15, 0.8);
    const f1 = new THREE.Mesh(footGeo, stripeMat);
    f1.position.set(-1.1, 0.08, 0);
    const f2 = f1.clone();
    f2.position.x = 1.1;
    this.group.add(f1, f2);

    const plankGeo = new THREE.BoxGeometry(2.4, 0.5, 0.12);
    const plank = new THREE.Mesh(plankGeo, frameMat);
    plank.position.set(0, 0.65, 0);
    plank.castShadow = true;
    this.group.add(plank);

    const stripeGeo = new THREE.BoxGeometry(0.3, 0.52, 0.14);
    for (let x = -0.9; x <= 0.9; x += 0.6) {
      const s = new THREE.Mesh(stripeGeo, stripeMat);
      s.position.set(x, 0.65, 0);
      this.group.add(s);
    }
  }

  buildOverheadBarrier() {
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const signMat = new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 0.5 });

    const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.2, 8);
    const p1 = new THREE.Mesh(poleGeo, metalMat);
    p1.position.set(-1.25, 1.6, 0);
    const p2 = p1.clone();
    p2.position.x = 1.25;
    this.group.add(p1, p2);

    const barGeo = new THREE.BoxGeometry(2.7, 0.8, 0.3);
    const bar = new THREE.Mesh(barGeo, metalMat);
    bar.position.set(0, 2.0, 0);
    bar.castShadow = true;
    this.group.add(bar);

    const signGeo = new THREE.BoxGeometry(2.2, 0.6, 0.15);
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 1.4, 0); // Clearance under sign is ~1.1m
    sign.castShadow = true;
    this.group.add(sign);
  }

  buildTrain() {
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.7 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.2 });
    const windowMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.8 });
    const headlightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.0 });

    const bodyGeo = new THREE.BoxGeometry(2.5, 3.2, 14);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.7;
    body.castShadow = true;
    body.receiveShadow = true;
    this.group.add(body);

    const roofGeo = new THREE.BoxGeometry(2.3, 0.2, 13.8);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 3.35;
    this.group.add(roof);

    const winGeo = new THREE.BoxGeometry(2.54, 0.6, 1.2);
    for (let z = -5; z <= 5; z += 2.4) {
      const win = new THREE.Mesh(winGeo, windowMat);
      win.position.set(0, 2.2, z);
      this.group.add(win);
    }

    const hlGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 12);
    hlGeo.rotateX(Math.PI / 2);
    const hl1 = new THREE.Mesh(hlGeo, headlightMat);
    hl1.position.set(-0.8, 1.2, 7.02);
    const hl2 = hl1.clone();
    hl2.position.x = 0.8;
    this.group.add(hl1, hl2);
  }

  buildStationaryBarrier() {
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x374151 });

    const baseGeo = new THREE.BoxGeometry(2.5, 0.3, 0.6);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.15;
    this.group.add(base);

    const fenceGeo = new THREE.BoxGeometry(2.4, 1.8, 0.2);
    const fence = new THREE.Mesh(fenceGeo, fenceMat);
    fence.position.y = 1.2;
    fence.castShadow = true;
    this.group.add(fence);
  }

  buildCrates() {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const crateGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1);

    const c1 = new THREE.Mesh(crateGeo, woodMat);
    c1.position.set(-0.55, 0.55, 0);
    c1.castShadow = true;

    const c2 = new THREE.Mesh(crateGeo, woodMat);
    c2.position.set(0.55, 0.55, 0);
    c2.castShadow = true;

    const c3 = new THREE.Mesh(crateGeo, woodMat);
    c3.position.set(0, 1.65, 0);
    c3.castShadow = true;

    this.group.add(c1, c2, c3);
  }

  update(delta) {
    if (this.isMoving) {
      this.group.position.z += this.moveSpeed * delta;
    }
  }

  /**
   * Generates AABB Bounding Box for collision check.
   */
  getCollider() {
    const pos = this.group.position;
    let size = new THREE.Vector3(2.4, 2.0, 1.0);
    let centerOffset = new THREE.Vector3(0, 1.0, 0);

    if (this.type === 'low_barrier') {
      size.set(2.4, 0.9, 0.6);
      centerOffset.set(0, 0.45, 0);
    } else if (this.type === 'overhead_barrier') {
      size.set(2.5, 1.3, 0.5);
      centerOffset.set(0, 1.85, 0);
    } else if (this.type === 'train' || this.type === 'moving_train') {
      size.set(2.5, 3.2, 13.8);
      centerOffset.set(0, 1.6, 0);
    } else if (this.type === 'barrier' || this.type === 'crates') {
      size.set(2.4, 2.0, 1.2);
      centerOffset.set(0, 1.0, 0);
    }

    const min = new THREE.Vector3(
      pos.x + centerOffset.x - size.x * 0.5,
      pos.y + centerOffset.y - size.y * 0.5,
      pos.z + centerOffset.z - size.z * 0.5
    );
    const max = new THREE.Vector3(
      pos.x + centerOffset.x + size.x * 0.5,
      pos.y + centerOffset.y + size.y * 0.5,
      pos.z + centerOffset.z + size.z * 0.5
    );

    return new THREE.Box3(min, max);
  }
}
