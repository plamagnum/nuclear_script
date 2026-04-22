import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

function createLabelRenderer() {
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'fixed';
  labelRenderer.domElement.style.top = '0';
  labelRenderer.domElement.style.left = '0';
  labelRenderer.domElement.style.pointerEvents = 'none';
  document.body.appendChild(labelRenderer.domElement);
  return labelRenderer;
}

export function createSceneApp({
  background = 0x0b1020,
  fog = null,
  camera: cameraConfig,
  controlsTarget = [0, 0, 0],
  withLabels = false,
  shadowMapEnabled = true,
  shadowMapType = THREE.PCFSoftShadowMap,
}) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(background);

  if (fog) {
    scene.fog = new THREE.Fog(fog.color ?? background, fog.near, fog.far);
  }

  const camera = new THREE.PerspectiveCamera(
    cameraConfig.fov ?? 55,
    window.innerWidth / window.innerHeight,
    cameraConfig.near ?? 0.1,
    cameraConfig.far ?? 500,
  );
  camera.position.set(...cameraConfig.position);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = shadowMapEnabled;
  renderer.shadowMap.type = shadowMapType;
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(...controlsTarget);

  const labelRenderer = withLabels ? createLabelRenderer() : null;
  const clock = new THREE.Clock();

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer?.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', onResize);

  const resetCamera = (
    position = cameraConfig.position,
    target = controlsTarget,
  ) => {
    camera.position.set(...position);
    controls.target.set(...target);
    controls.update();
  };

  const renderFrame = (onFrame) => {
    const animate = () => {
      requestAnimationFrame(animate);
      onFrame?.(clock.getElapsedTime());
      controls.update();
      renderer.render(scene, camera);
      labelRenderer?.render(scene, camera);
    };

    animate();
  };

  return {
    THREE,
    scene,
    camera,
    renderer,
    controls,
    labelRenderer,
    resetCamera,
    renderFrame,
  };
}

export function addDefaultLights(
  scene,
  {
    ambient = 0.5,
    key = {
      color: 0xffffff,
      intensity: 1.1,
      position: [25, 35, 18],
      shadowBounds: 50,
    },
    fill = null,
  } = {},
) {
  const ambientLight = new THREE.AmbientLight(0xffffff, ambient);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(key.color ?? 0xffffff, key.intensity ?? 1.1);
  keyLight.position.set(...(key.position ?? [25, 35, 18]));
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  const shadowBounds = key.shadowBounds ?? 50;
  keyLight.shadow.camera.left = -shadowBounds;
  keyLight.shadow.camera.right = shadowBounds;
  keyLight.shadow.camera.top = shadowBounds;
  keyLight.shadow.camera.bottom = -shadowBounds;
  scene.add(keyLight);

  let fillLight = null;
  if (fill) {
    fillLight = new THREE.DirectionalLight(fill.color ?? 0x7fb2ff, fill.intensity ?? 0.35);
    fillLight.position.set(...(fill.position ?? [-18, 20, -25]));
    scene.add(fillLight);
  }

  return { ambientLight, keyLight, fillLight };
}

export function bindResetButton(buttonId, resetCamera) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener('click', () => resetCamera());
  }
}
