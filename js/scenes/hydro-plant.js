import * as THREE from 'three';
import { bindResetButton, createSceneApp, addDefaultLights } from '../common/setup.js';
import { createEnergyMaterials } from '../common/materials.js';
import { addLabels } from '../common/labels.js';

const app = createSceneApp({
  background: 0x9bc9f3,
  fog: { color: 0x9bc9f3, near: 100, far: 320 },
  camera: { fov: 55, near: 0.1, far: 700, position: [70, 48, 96] },
  controlsTarget: [0, 14, 0],
  withLabels: true,
});

const { scene, labelRenderer, resetCamera, renderFrame } = app;
const materials = createEnergyMaterials();

addDefaultLights(scene, {
  ambient: 0.55,
  key: { color: 0xffffff, intensity: 1.15, position: [48, 75, 38], shadowBounds: 120 },
  fill: { color: 0x88b8ff, intensity: 0.3, position: [-30, 30, -25] },
});

const valley = new THREE.Mesh(new THREE.PlaneGeometry(320, 240), materials.grass);
valley.rotation.x = -Math.PI / 2;
valley.receiveShadow = true;
scene.add(valley);

const site = new THREE.Group();
scene.add(site);

const reservoir = new THREE.Mesh(new THREE.BoxGeometry(150, 1.2, 82), materials.water);
reservoir.position.set(-62, 0.6, 0);
reservoir.receiveShadow = true;
site.add(reservoir);

const river = new THREE.Mesh(new THREE.BoxGeometry(160, 0.7, 36), materials.water);
river.position.set(88, 0.35, 0);
river.receiveShadow = true;
site.add(river);

const dam = new THREE.Mesh(new THREE.BoxGeometry(16, 26, 92), materials.concrete);
dam.position.set(0, 13, 0);
dam.castShadow = true;
dam.receiveShadow = true;
site.add(dam);

const crestRoad = new THREE.Mesh(new THREE.BoxGeometry(18, 0.8, 94), materials.asphalt);
crestRoad.position.set(0, 26.4, 0);
crestRoad.receiveShadow = true;
site.add(crestRoad);

const powerhouse = new THREE.Mesh(new THREE.BoxGeometry(34, 16, 24), materials.industrialWall);
powerhouse.position.set(34, 8, 0);
powerhouse.castShadow = true;
powerhouse.receiveShadow = true;
site.add(powerhouse);

const powerhouseRoof = new THREE.Mesh(new THREE.BoxGeometry(35, 1, 25), materials.industrialRoof);
powerhouseRoof.position.set(34, 16.6, 0);
powerhouseRoof.castShadow = true;
site.add(powerhouseRoof);

for (let z = -18; z <= 18; z += 18) {
  const penstock = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 44, 24), materials.pipe);
  penstock.position.set(14, 10, z);
  penstock.rotation.z = Math.PI / 2.7;
  penstock.castShadow = true;
  penstock.receiveShadow = true;
  site.add(penstock);
}

const spillwayWater = [];
for (const z of [-24, 0, 24]) {
  const sheet = new THREE.Mesh(new THREE.BoxGeometry(12, 20, 10), materials.foam);
  sheet.position.set(8, 10, z);
  sheet.rotation.z = -0.16;
  sheet.castShadow = false;
  sheet.receiveShadow = false;
  site.add(sheet);
  spillwayWater.push({ sheet, z });
}

const transmissionYard = new THREE.Mesh(new THREE.BoxGeometry(30, 0.12, 18), materials.gravel);
transmissionYard.position.set(72, 0.06, -28);
transmissionYard.receiveShadow = true;
site.add(transmissionYard);

for (let x = 64; x <= 80; x += 8) {
  const transformer = new THREE.Mesh(new THREE.BoxGeometry(5.5, 3.4, 3.2), materials.metal);
  transformer.position.set(x, 1.8, -28);
  transformer.castShadow = true;
  transformer.receiveShadow = true;
  site.add(transformer);
}

const hills = [
  { x: -118, z: -62, r: 26 },
  { x: -128, z: 48, r: 24 },
  { x: 132, z: -70, r: 30 },
  { x: 126, z: 62, r: 26 },
];
for (const hill of hills) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(hill.r, 28, 20), materials.hill);
  mesh.position.set(hill.x, hill.r * 0.55, hill.z);
  mesh.scale.y = 0.7;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  site.add(mesh);
}

const labelLayer = new THREE.Group();
scene.add(labelLayer);
addLabels(labelLayer, [
  { html: 'Водосховище', position: [-62, 6, 0] },
  { html: 'Гребля', position: [0, 30, 0] },
  { html: 'Скиди води<br/><small>spillway</small>', position: [10, 16, 24] },
  { html: 'Машинний зал ГЕС', position: [34, 18, 0] },
  { html: 'Напірні водоводи', position: [18, 14, -18] },
  { html: 'Відвідний канал', position: [88, 4, 0] },
  { html: 'Видача потужності', position: [72, 7, -28] },
]);

const labelToggle = document.getElementById('chkLabels');
labelToggle.addEventListener('change', () => {
  labelLayer.visible = labelToggle.checked;
  labelRenderer.domElement.style.display = labelToggle.checked ? '' : 'none';
});
labelLayer.visible = labelToggle.checked;

bindResetButton('btnReset', resetCamera);

renderFrame((time) => {
  reservoir.position.y = 0.6 + Math.sin(time * 0.35) * 0.04;
  river.position.y = 0.35 + Math.cos(time * 0.45) * 0.03;
  spillwayWater.forEach(({ sheet, z }, index) => {
    sheet.position.x = 8 + Math.sin(time * 1.4 + index) * 0.25;
    sheet.position.y = 10 + Math.cos(time * 1.1 + index) * 0.35;
    sheet.position.z = z + Math.sin(time * 0.8 + index) * 0.5;
    sheet.material.opacity = 0.55 + Math.sin(time * 1.7 + index) * 0.06;
  });
});
