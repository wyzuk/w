   W SUFFERS — Procedural Chunk & Endless World Manager

import { CONFIG } from '../config.js';
import { EnvironmentChunk } from '../entities/EnvironmentChunk.js';

export class ChunkManager {
  constructor(scene, sceneManager) {
    this.scene = scene;
    this.sceneManager = sceneManager;

    this.chunks = [];
    this.currentChunkIndex = 0;
    this.currentThemeIndex = 0;
    this.nextSpawnZ = 0;
  }

  init() {
    this.clearAll();
    this.currentThemeIndex = 0;
    this.sceneManager.applyTheme(CONFIG.THEMES[this.currentThemeIndex]);

    for (let i = 0; i < CONFIG.INITIAL_CHUNKS; i++) {
      this.spawnNextChunk();
    }
  }

  spawnNextChunk() {
    if (this.currentChunkIndex > 0 && this.currentChunkIndex % 5 === 0) {
      this.currentThemeIndex = (this.currentThemeIndex + 1) % CONFIG.THEMES.length;
      this.sceneManager.applyTheme(CONFIG.THEMES[this.currentThemeIndex]);
    }

    const theme = CONFIG.THEMES[this.currentThemeIndex];
    const chunk = new EnvironmentChunk(
      this.scene,
      theme,
      this.nextSpawnZ,
      this.currentChunkIndex
    );

    this.chunks.push(chunk);
    this.nextSpawnZ -= CONFIG.CHUNK_LENGTH; // Extend into negative Z
    this.currentChunkIndex++;
  }

  update(playerZ, delta) {
    this.chunks.forEach(c => c.update(delta));

    if (playerZ - (CONFIG.INITIAL_CHUNKS - 2) * CONFIG.CHUNK_LENGTH < this.nextSpawnZ) {
      this.spawnNextChunk();
    }

    if (this.chunks.length > 0) {
      const firstChunk = this.chunks[0];
      if (firstChunk.zPos > playerZ + 25) {
        firstChunk.destroy();
        this.chunks.shift();
      }
    }
  }

  getAllObstacles() {
    let list = [];
    this.chunks.forEach(c => {
      list = list.concat(c.obstacles);
    });
    return list;
  }

  getAllCollectibles() {
    let list = [];
    this.chunks.forEach(c => {
      list = list.concat(c.collectibles);
    });
    return list;
  }

  clearAll() {
    this.chunks.forEach(c => c.destroy());
    this.chunks = [];
    this.currentChunkIndex = 0;
    this.nextSpawnZ = 0;
  }
}
