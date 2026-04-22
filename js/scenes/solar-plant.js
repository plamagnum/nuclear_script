import * as THREE from 'three';
import { bindResetButton, createSceneApp, addDefaultLights } from '../common/setup.js';
import { createEnergyMaterials } from '../common/materials.js';
import { addLabels } from '../common/labels.js';
import { createInstancedMesh } from '../common/instancing.js';

const app = createSceneApp({
  background: 0x9fd4ff,
  fog: { color: 0x9fd4ff, near: 110, far: 320 },
  camera: { fov: 55, near: 0.1, far: 700, position: [70, 42, 78] },
  controlsTarget: [0, 6, 0],
  withLabels: true,
});

const { scene, labelRenderer, resetCamera, renderFrame } = app;
const materials = createEnergyMaterials();

addDefaultLights(scene, {
  ambient: 0.65,
  key: { color: 0xffffff, intensity: 1.3, position: [55, 70, 30], shadowBounds: 110 },
});

const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 240), materials.desert);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const site = new THREE.Group();
scene.add(site);

const road = new THREE.Mesh(new THREE.BoxGeometry(220, 0.08, 10), materials.asphalt);
road.position.set(0, 0.04, 48);
road.receiveShadow = true;
site.add(road);

const serviceBuilding = new THREE.Mesh(new THREE.BoxGeometry(18, 8, 12), materials.concrete);
serviceBuilding.position.set(-82, 4, 18);
serviceBuilding.castShadow = true;
serviceBuilding.receiveShadow = true;
site.add(serviceBuilding);

const serviceRoof = new THREE.Mesh(new THREE.BoxGeometry(19, 0.8, 13), materials.industrialRoof);
serviceRoof.position.set(-82, 8.4, 18);
serviceRoof.castShadow = true;
site.add(serviceRoof);

const inverterPad = new THREE.Mesh(new THREE.BoxGeometry(26, 0.1, 16), materials.gravel);
inverterPad.position.set(-86, 0.05, -12);
inverterPad.receiveShadow = true;
site.add(inverterPad);

for (let z = -18; z <= -6; z += 6) {
  const inverter = new THREE.Mesh(new THREE.BoxGeometry(5, 3.5, 3.2), materials.inverter);
  inverter.position.set(-86, 1.8, z);
  inverter.castShadow = true;
  inverter.receiveShadow = true;
  site.add(inverter);
}

const panelRows = [];
for (let x = -40; x <= 70; x += 18) {
  for (let z = -58; z <= 26; z += 16) {
    panelRows.push({ position: [x, 2.5, z], rotation: [-Math.PI / 5, Math.PI / 7, 0] });
    panelRows.push({ position: [x + 7.5, 2.5, z], rotation: [-Math.PI / 5, Math.PI / 7, 0] });
  }
}

createInstancedMesh({
  geometry: new THREE.BoxGeometry(5.8, 0.18, 3.6),
  material: materials.panel,
  parent: site,
  transforms: panelRows,
});

createInstancedMesh({
  geometry: new THREE.BoxGeometry(0.16, 2.2, 0.16),
  material: materials.panelFrame,
  parent: site,
  transforms: panelRows.flatMap(({ position, rotation }) => ([
    { position: [position[0] - 2.2, 1.1, position[2] - 0.8], rotation },
    { position: [position[0] + 2.2, 1.1, position[2] + 0.8], rotation },
  ])),
});

const battery = new THREE.Mesh(new THREE.BoxGeometry(12, 5, 7), materials.darkMetal);
battery.position.set(-55, 2.5, 20);
battery.castShadow = true;
battery.receiveShadow = true;
site.add(battery);

const substationPad = new THREE.Mesh(new THREE.BoxGeometry(28, 0.12, 16), materials.gravel);
substationPad.position.set(92, 0.06, 6);
substationPad.receiveShadow = true;
site.add(substationPad);

for (let x = 84; x <= 100; x += 8) {
  const transformer = new THREE.Mesh(new THREE.BoxGeometry(5.5, 3.2, 3), materials.metal);
  transformer.position.set(x, 1.7, 6);
  transformer.castShadow = true;
  transformer.receiveShadow = true;
  site.add(transformer);
}

const labelLayer = new THREE.Group();
scene.add(labelLayer);
addLabels(labelLayer, [
  { html: 'Поля сонячних панелей<br/><small>PV array</small>', position: [18, 7, -10] },
  { html: 'Інверторний майданчик', position: [-86, 6, -12] },
  { html: 'Сервісний модуль', position: [-82, 10, 18] },
  { html: 'Акумуляторне зберігання', position: [-55, 7, 20] },
  { html: 'Підстанція', position: [92, 7, 6] },
  { html: 'Технологічна дорога', position: [8, 3, 48] },
]);

const labelToggle = document.getElementById('chkLabels');
labelToggle.addEventListener('change', () => {
  labelLayer.visible = labelToggle.checked;
  labelRenderer.domElement.style.display = labelToggle.checked ? '' : 'none';
});
labelLayer.visible = labelToggle.checked;

bindResetButton('btnReset', resetCamera);

renderFrame((time) => {
  const sunStrength = 0.7 + Math.sin(time * 0.4) * 0.08;
  materials.panel.emissiveIntensity = sunStrength * 0.22;
});
