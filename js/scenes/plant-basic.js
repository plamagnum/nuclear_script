import * as THREE from 'three';
import { bindResetButton, createSceneApp, addDefaultLights } from '../common/setup.js';
import { createPlantMaterials } from '../common/materials.js';
import { addLabels } from '../common/labels.js';
import { addBasePlant, addRectFenceInstanced } from './plant-shared.js';

const app = createSceneApp({
  background: 0x87ceeb,
  fog: { color: 0x87ceeb, near: 80, far: 250 },
  camera: { fov: 55, near: 0.1, far: 500, position: [40, 30, 50] },
  controlsTarget: [0, 8, 0],
  withLabels: true,
});

const { scene, labelRenderer, resetCamera, renderFrame } = app;
const materials = createPlantMaterials();

addDefaultLights(scene, {
  ambient: 0.5,
  key: { color: 0xffffff, intensity: 1.2, position: [30, 50, 20], shadowBounds: 60 },
});

const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), materials.green);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const site = new THREE.Group();
scene.add(site);

const { towerA, towerB, labelAnchors } = addBasePlant(site, materials);
addRectFenceInstanced(site, materials, { w: 90, d: 90, h: 2, t: 0.15 });

const labelLayer = new THREE.Group();
scene.add(labelLayer);
addLabels(labelLayer, [
  { html: 'Корпус реактора<br/><small>reactor containment</small>', position: labelAnchors.reactor },
  { html: 'Градирні<br/><small>cooling towers</small>', position: labelAnchors.coolingTowers },
  { html: 'Машинний зал<br/><small>turbine hall</small>', position: labelAnchors.turbineHall },
  { html: 'Димова труба', position: labelAnchors.chimney },
  { html: 'Ставок-охолоджувач', position: labelAnchors.coolingPond },
  { html: 'Допоміжні будівлі', position: labelAnchors.supportBuildings },
]);

const labelToggle = document.getElementById('chkLabels');
labelToggle.addEventListener('change', () => {
  labelLayer.visible = labelToggle.checked;
  labelRenderer.domElement.style.display = labelToggle.checked ? '' : 'none';
});
labelLayer.visible = labelToggle.checked;

bindResetButton('btnReset', resetCamera);

renderFrame((time) => {
  [towerA, towerB].forEach((tower, index) => {
    const scale = 1 + 0.15 * Math.sin(time * 0.8 + index);
    tower.steam.scale.set(scale, scale, scale);
    tower.steam.position.y = 30 + Math.sin(time * 0.5 + index) * 0.8;
    tower.steam2.scale.set(scale * 0.9, scale * 0.9, scale * 0.9);
    tower.steam2.position.y = 34 + Math.sin(time * 0.6 + index) * 1.0;
  });
});
