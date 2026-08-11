/* ==========================================================================
   W SUFFERS — Scene & Lighting Manager
   ========================================================================== */

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;

    // Three.js Core Components
    this.scene = new THREE.Scene();
    this.renderer = null;

    // Lighting
    this.dirLight = null;
    this.ambientLight = null;
    this.hemiLight = null;

    this.currentTheme = null;

    this.initRenderer();
    this.initLighting();
    this.initFog();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
  }

  initLighting() {
    // Ambient Light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.ambientLight);

    // Hemisphere Light (Sky / Ground gradient)
    this.hemiLight = new THREE.HemisphereLight(0x00e5ff, 0x1f2937, 0.5);
    this.scene.add(this.hemiLight);

    // Directional Sun / Main Light
    this.dirLight = new THREE.DirectionalLight(0xfff0dd, 1.2);
    this.dirLight.position.set(20, 40, -10);
    this.dirLight.castShadow = true;

    // Shadow Map Tuning
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 120;
    const d = 30;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;

    this.scene.add(this.dirLight);
  }

  initFog() {
    // Exponential atmospheric fog to hide chunk spawning far ahead
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.009);
  }

  applyTheme(theme) {
    this.currentTheme = theme;

    this.scene.background = new THREE.Color(theme.skyColor);
    this.scene.fog.color.setHex(theme.fogColor);

    this.hemiLight.color.setHex(theme.accentColor);
    this.dirLight.color.setHex(theme.lightColor);
  }

  setGraphicsQuality(quality) {
    if (quality === 'low') {
      this.renderer.shadowMap.enabled = false;
      this.renderer.setPixelRatio(1);
    } else if (quality === 'medium') {
      this.renderer.shadowMap.enabled = true;
      this.dirLight.shadow.mapSize.width = 512;
      this.dirLight.shadow.mapSize.height = 512;
      this.renderer.setPixelRatio(1);
    } else {
      this.renderer.shadowMap.enabled = true;
      this.dirLight.shadow.mapSize.width = 1024;
      this.dirLight.shadow.mapSize.height = 1024;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render(camera) {
    this.renderer.render(this.scene, camera);
  }
}
