/* ==========================================================================
   W SUFFERS — Input Manager (Keyboard, Touch Swipes, Virtual Controls)
   ========================================================================== */

export class InputManager {
  constructor() {
    this.actions = {
      moveLeft: false,
      moveRight: false,
      jump: false,
      slide: false,
      pause: false
    };

    this.touchStartX = 0;
    this.touchStartY = 0;
    this.swipeThreshold = 30; // Minimum px threshold for swipe

    this.onActionCallback = null;

    this.initKeyboard();
    this.initTouchSwipes();
    this.initOnScreenButtons();
  }

  onAction(callback) {
    this.onActionCallback = callback;
  }

  trigger(actionName) {
    if (this.onActionCallback) {
      this.onActionCallback(actionName);
    }
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Prevent default scrolling for arrows and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const key = e.key.toLowerCase();

      if (key === 'a' || key === 'arrowleft') {
        this.trigger('moveLeft');
      } else if (key === 'd' || key === 'arrowright') {
        this.trigger('moveRight');
      } else if (key === 'w' || key === 'arrowup' || key === ' ' || e.code === 'Space') {
        this.trigger('jump');
      } else if (key === 's' || key === 'arrowdown') {
        this.trigger('slide');
      } else if (key === 'escape' || key === 'p') {
        this.trigger('pause');
      }
    });
  }

  initTouchSwipes() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    canvas.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 0) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const dx = touchEndX - this.touchStartX;
      const dy = touchEndY - this.touchStartY;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > this.swipeThreshold) {
        if (absDx > absDy) {
          // Horizontal Swipe
          if (dx > 0) {
            this.trigger('moveRight');
          } else {
            this.trigger('moveLeft');
          }
        } else {
          // Vertical Swipe
          if (dy > 0) {
            this.trigger('slide');
          } else {
            this.trigger('jump');
          }
        }
      }
    }, { passive: true });
  }

  initOnScreenButtons() {
    const btnLeft = document.getElementById('touch-left');
    const btnRight = document.getElementById('touch-right');
    const btnJump = document.getElementById('touch-jump');
    const btnSlide = document.getElementById('touch-slide');

    if (btnLeft) btnLeft.addEventListener('pointerdown', (e) => { e.preventDefault(); this.trigger('moveLeft'); });
    if (btnRight) btnRight.addEventListener('pointerdown', (e) => { e.preventDefault(); this.trigger('moveRight'); });
    if (btnJump) btnJump.addEventListener('pointerdown', (e) => { e.preventDefault(); this.trigger('jump'); });
    if (btnSlide) btnSlide.addEventListener('pointerdown', (e) => { e.preventDefault(); this.trigger('slide'); });
  }
}
