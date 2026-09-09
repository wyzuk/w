   W SUFFERS — Particle & Visual Effects Engine

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.particlePool = [];

    this.boxGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    this.sphereGeo = new THREE.SphereGeometry(0.12, 6, 6);

    this.materials = {
      gold: new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true }),
      cyan: new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true }),
      pink: new THREE.MeshBasicMaterial({ color: 0xff007f, transparent: true }),
      white: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true }),
      dust: new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.6 }),
      spark: new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true })
    };
  }

  spawnParticle(pos, velocity, colorType = 'white', scale = 1, life = 0.6) {
    let p;
    if (this.particlePool.length > 0) {
      p = this.particlePool.pop();
      p.mesh.visible = true;
    } else {
      const mat = (this.materials[colorType] || this.materials.white).clone();
      const mesh = new THREE.Mesh(this.boxGeo, mat);
      p = { mesh, vel: new THREE.Vector3(), life: 1, maxLife: 1 };
      this.scene.add(mesh);
    }

    p.mesh.position.copy(pos);
    p.mesh.scale.setScalar(scale);
    p.mesh.material.opacity = 1;
    p.vel.copy(velocity);
    p.life = life;
    p.maxLife = life;

    this.particles.push(p);
  }


  emitRunDust(pos) {
    for (let i = 0; i < 2; i++) {
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        Math.random() * 0.8 + 0.2,
        -Math.random() * 2 - 1
      );
      this.spawnParticle(pos, vel, 'dust', 0.8, 0.35);
    }
  }

  emitJumpDust(pos) {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const vel = new THREE.Vector3(
        Math.cos(angle) * 3,
        Math.random() * 1.5 + 0.5,
        Math.sin(angle) * 3
      );
      this.spawnParticle(pos, vel, 'dust', 1.2, 0.45);
    }
  }

  emitSlideSparks(pos) {
    for (let i = 0; i < 3; i++) {
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 1.5,
        -Math.random() * 4 - 2
      );
      this.spawnParticle(pos, vel, 'spark', 0.6, 0.3);
    }
  }

  emitCoinCollect(pos, isWCoin = false) {
    const color = isWCoin ? 'pink' : 'gold';
    const count = isWCoin ? 20 : 12;
    for (let i = 0; i < count; i++) {
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5 + 2,
        (Math.random() - 0.5) * 5
      );
      this.spawnParticle(pos, vel, color, 1.2, 0.5);
    }
  }

  emitCollisionDebris(pos) {
    for (let i = 0; i < 24; i++) {
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        Math.random() * 6 + 2,
        (Math.random() - 0.5) * 8
      );
      const color = Math.random() > 0.5 ? 'cyan' : 'pink';
      this.spawnParticle(pos, vel, color, 1.5, 0.8);
    }
  }

  update(delta) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= delta;

      if (p.life <= 0) {
        p.mesh.visible = false;
        this.particlePool.push(p);
        this.particles.splice(i, 1);
      } else {
        p.mesh.position.addScaledVector(p.vel, delta);
        p.vel.y -= 9.8 * delta * 0.5; // Light gravity
        p.mesh.material.opacity = p.life / p.maxLife;
        const scale = (p.life / p.maxLife);
        p.mesh.scale.setScalar(scale);
      }
    }
  }

  clear() {
    this.particles.forEach(p => {
      p.mesh.visible = false;
      this.particlePool.push(p);
    });
    this.particles = [];
  }
}
