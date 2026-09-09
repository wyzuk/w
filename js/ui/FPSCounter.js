   W SUFFERS — FPS & Framerate Monitor

export class FPSCounter {
  constructor() {
    this.elem = document.getElementById('fps-value');
    this.container = document.getElementById('fps-counter');

    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
  }

  setVisible(visible) {
    if (this.container) {
      if (visible) this.container.classList.remove('hidden');
      else this.container.classList.add('hidden');
    }
  }

  update() {
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastTime;

    if (elapsed >= 500) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      if (this.elem) this.elem.textContent = this.fps;
      this.frameCount = 0;
      this.lastTime = now;
    }
  }
}
