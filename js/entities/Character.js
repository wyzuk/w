/* ==========================================================================
   W SUFFERS — Original Procedural 3D Runner Character ("W-Bot")
   ========================================================================== */

import { CONFIG } from '../config.js';
import { MathUtils } from '../utils/MathUtils.js';

export class Character {
  constructor(scene) {
    this.scene = scene;

    // Root Group
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Physics & State
    this.currentLaneIndex = 1; // 0: Left (-3.2), 1: Center (0), 2: Right (3.2)
    this.position = new THREE.Vector3(0, 0, 0);
    this.targetX = 0;
    this.velocityY = 0;
    this.isGrounded = true;
    this.isSliding = false;
    this.slideTimer = 0;
    this.state = 'RUNNING'; // RUNNING, JUMPING, FALLING, SLIDING, DEAD

    // Squash & Stretch scale vector
    this.scaleVector = new THREE.Vector3(1, 1, 1);

    // Procedural Mesh Hierarchy & Limbs
    this.meshParts = {};
    this.shieldMesh = null;

    this.animTime = 0;

    this.buildCharacterMesh();
  }

  buildCharacterMesh() {
    const mainGroup = new THREE.Group();
    mainGroup.rotation.y = Math.PI; // Face forward towards -Z
    this.group.add(mainGroup);

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.6 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.5 });
    const wPinkMat = new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 0.6 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcc99, roughness: 0.6 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

    // Torso
    const torsoGeo = new THREE.BoxGeometry(0.7, 0.9, 0.4);
    const torso = new THREE.Mesh(torsoGeo, bodyMat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    mainGroup.add(torso);
    this.meshParts.torso = torso;

    // Glowing 'W' Chest Badge
    const badgeGeo = new THREE.BoxGeometry(0.35, 0.35, 0.05);
    const badge = new THREE.Mesh(badgeGeo, wPinkMat);
    badge.position.set(0, 0.1, 0.22);
    torso.add(badge);

    // Backpack / Jetpack
    const packGeo = new THREE.BoxGeometry(0.5, 0.6, 0.25);
    const pack = new THREE.Mesh(packGeo, accentMat);
    pack.position.set(0, 0.1, -0.28);
    torso.add(pack);

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.7, 0);
    torso.add(headGroup);
    this.meshParts.headGroup = headGroup;

    const headGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.castShadow = true;
    headGroup.add(head);

    // Futuristic Visor
    const visorGeo = new THREE.BoxGeometry(0.42, 0.14, 0.18);
    const visor = new THREE.Mesh(visorGeo, accentMat);
    visor.position.set(0, 0.05, 0.16);
    headGroup.add(visor);

    // Cap / W Headphones
    const capGeo = new THREE.CylinderGeometry(0.3, 0.32, 0.15, 16);
    const cap = new THREE.Mesh(capGeo, wPinkMat);
    cap.position.set(0, 0.22, 0);
    headGroup.add(cap);

    // --- ARMS ---
    // Left Arm
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.45, 0.35, 0);
    torso.add(leftArm);
    this.meshParts.leftArm = leftArm;

    const armGeo = new THREE.BoxGeometry(0.18, 0.65, 0.18);
    const lArmMesh = new THREE.Mesh(armGeo, bodyMat);
    lArmMesh.position.y = -0.28;
    lArmMesh.castShadow = true;
    leftArm.add(lArmMesh);

    // Right Arm
    const rightArm = new THREE.Group();
    rightArm.position.set(0.45, 0.35, 0);
    torso.add(rightArm);
    this.meshParts.rightArm = rightArm;

    const rArmMesh = new THREE.Mesh(armGeo, bodyMat);
    rArmMesh.position.y = -0.28;
    rArmMesh.castShadow = true;
    rightArm.add(rArmMesh);

    // --- LEGS ---
    // Left Leg
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.22, 0.7, 0);
    mainGroup.add(leftLeg);
    this.meshParts.leftLeg = leftLeg;

    const legGeo = new THREE.BoxGeometry(0.22, 0.7, 0.22);
    const lLegMesh = new THREE.Mesh(legGeo, bodyMat);
    lLegMesh.position.y = -0.35;
    lLegMesh.castShadow = true;
    leftLeg.add(lLegMesh);

    const shoeGeo = new THREE.BoxGeometry(0.24, 0.16, 0.4);
    const lShoe = new THREE.Mesh(shoeGeo, shoeMat);
    lShoe.position.set(0, -0.68, 0.08);
    lShoe.castShadow = true;
    leftLeg.add(lShoe);

    // Right Leg
    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.22, 0.7, 0);
    mainGroup.add(rightLeg);
    this.meshParts.rightLeg = rightLeg;

    const rLegMesh = new THREE.Mesh(legGeo, bodyMat);
    rLegMesh.position.y = -0.35;
    rLegMesh.castShadow = true;
    rightLeg.add(rLegMesh);

    const rShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rShoe.position.set(0, -0.68, 0.08);
    rShoe.castShadow = true;
    rightLeg.add(rShoe);

    // --- SHIELD POWERUP BUBBLE ---
    const shieldGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.35,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.6,
      wireframe: false
    });
    this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    this.shieldMesh.position.y = 1.1;
    this.shieldMesh.visible = false;
    this.group.add(this.shieldMesh);
  }

  // Set Shield Visual Active/Inactive
  setShieldActive(active) {
    if (this.shieldMesh) {
      this.shieldMesh.visible = active;
    }
  }

  // Lane Switches
  moveLane(direction) {
    if (this.state === 'DEAD') return false;

    if (direction === 'left' && this.currentLaneIndex > 0) {
      this.currentLaneIndex--;
      this.targetX = CONFIG.LANE_X[this.currentLaneIndex];
      return true;
    } else if (direction === 'right' && this.currentLaneIndex < CONFIG.LANE_X.length - 1) {
      this.currentLaneIndex++;
      this.targetX = CONFIG.LANE_X[this.currentLaneIndex];
      return true;
    }
    return false;
  }

  // Jump Action
  jump() {
    if (this.state === 'DEAD') return false;
    if (this.isGrounded || this.isSliding) {
      this.isGrounded = false;
      this.isSliding = false;
      this.velocityY = CONFIG.PLAYER.JUMP_FORCE;
      this.state = 'JUMPING';

      // Stretch Height Y on jump launch
      this.scaleVector.set(0.8, 1.35, 0.8);
      return true;
    }
    return false;
  }

  // Slide Action
  slide() {
    if (this.state === 'DEAD') return false;
    if (!this.isSliding) {
      if (!this.isGrounded) {
        // Fast drop if jumping
        this.velocityY = -CONFIG.PLAYER.JUMP_FORCE * 1.5;
      }
      this.isSliding = true;
      this.slideTimer = CONFIG.PLAYER.SLIDE_DURATION;
      this.state = 'SLIDING';

      // Squash height Y on slide
      this.scaleVector.set(1.2, 0.55, 1.2);
      return true;
    }
    return false;
  }

  // Die Action
  die() {
    this.state = 'DEAD';
    this.velocityY = 10;
  }

  reset() {
    this.currentLaneIndex = 1;
    this.targetX = CONFIG.LANE_X[1];
    this.position.set(0, 0, 0);
    this.velocityY = 0;
    this.isGrounded = true;
    this.isSliding = false;
    this.slideTimer = 0;
    this.state = 'RUNNING';
    this.scaleVector.set(1, 1, 1);
    this.group.position.set(0, 0, 0);
    this.group.rotation.set(0, 0, 0);
    this.setShieldActive(false);
  }

  update(delta, forwardSpeed) {
    if (this.state === 'DEAD') {
      // Death Tumble Physics
      this.position.y += this.velocityY * delta;
      this.velocityY += CONFIG.PLAYER.GRAVITY * delta;
      if (this.position.y < 0) this.position.y = 0;

      this.group.position.copy(this.position);
      this.group.rotation.x += delta * 8;
      this.group.rotation.z += delta * 6;
      return;
    }

    // 1. Horizontal Lane Lerping
    this.position.x = MathUtils.lerp(
      this.position.x,
      this.targetX,
      delta * CONFIG.PLAYER.LANE_CHANGE_SPEED
    );

    // 2. Vertical Physics (Gravity & Jump)
    if (!this.isGrounded) {
      this.position.y += this.velocityY * delta;
      this.velocityY += CONFIG.PLAYER.GRAVITY * delta;

      if (this.velocityY < 0 && this.state !== 'SLIDING') {
        this.state = 'FALLING';
      }

      // Ground Check
      if (this.position.y <= 0) {
        this.position.y = 0;
        this.velocityY = 0;
        this.isGrounded = true;
        this.state = this.isSliding ? 'SLIDING' : 'RUNNING';

        // Impact Squash on landing
        this.scaleVector.set(1.25, 0.75, 1.25);
      }
    }

    // 3. Slide Timer
    if (this.isSliding) {
      this.slideTimer -= delta;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
        this.state = this.isGrounded ? 'RUNNING' : 'FALLING';
        this.scaleVector.set(1, 1, 1);
      }
    }

    // 4. Smooth Scale Vector back to (1,1,1)
    this.scaleVector.x = MathUtils.lerp(this.scaleVector.x, 1, delta * 10);
    this.scaleVector.y = MathUtils.lerp(this.scaleVector.y, 1, delta * 10);
    this.scaleVector.z = MathUtils.lerp(this.scaleVector.z, 1, delta * 10);

    // Apply position & scale
    this.group.position.copy(this.position);
    this.group.scale.copy(this.scaleVector);

    // 5. Procedural Limb Animation
    this.animateLimbs(delta, forwardSpeed);
  }

  animateLimbs(delta, forwardSpeed) {
    this.animTime += delta * forwardSpeed * 0.45;
    const legSwing = Math.sin(this.animTime) * 0.75;
    const armSwing = Math.cos(this.animTime) * 0.75;

    const { leftLeg, rightLeg, leftArm, rightArm, torso, headGroup } = this.meshParts;

    if (this.state === 'RUNNING') {
      leftLeg.rotation.x = legSwing;
      rightLeg.rotation.x = -legSwing;
      leftArm.rotation.x = -armSwing;
      rightArm.rotation.x = armSwing;

      torso.rotation.x = 0.15; // Lean forward while running
      torso.position.y = 1.15 + Math.abs(Math.sin(this.animTime * 2)) * 0.08; // Running bounce
      headGroup.rotation.x = -0.05;

    } else if (this.state === 'JUMPING') {
      leftLeg.rotation.x = -0.5;
      rightLeg.rotation.x = -0.8;
      leftArm.rotation.x = -2.2; // Arms raised high
      rightArm.rotation.x = -2.2;
      torso.rotation.x = 0;
      headGroup.rotation.x = -0.2;

    } else if (this.state === 'FALLING') {
      leftLeg.rotation.x = 0.3;
      rightLeg.rotation.x = 0.4;
      leftArm.rotation.x = -0.8;
      rightArm.rotation.x = -0.8;
      torso.rotation.x = 0.1;

    } else if (this.state === 'SLIDING') {
      torso.rotation.x = -1.2; // Tilt body way back
      leftLeg.rotation.x = 1.4; // Slide legs forward
      rightLeg.rotation.x = 1.4;
      leftArm.rotation.x = 0.5;
      rightArm.rotation.x = 0.5;
      headGroup.rotation.x = 0.8;
    }
  }

  /**
   * Returns current bounding box for accurate collision check.
   */
  getCollider() {
    const isSlide = this.isSliding;
    const height = isSlide ? CONFIG.PLAYER.SLIDE_HEIGHT : CONFIG.PLAYER.NORMAL_HEIGHT;
    const yOffset = isSlide ? height * 0.5 : height * 0.5;

    const min = new THREE.Vector3(
      this.position.x - 0.35,
      this.position.y + yOffset - height * 0.5,
      this.position.z - 0.35
    );
    const max = new THREE.Vector3(
      this.position.x + 0.35,
      this.position.y + yOffset + height * 0.5,
      this.position.z + 0.35
    );

    return new THREE.Box3(min, max);
  }
}
