import * as THREE from 'three';
import { bindResetButton, createSceneApp, addDefaultLights } from '../common/setup.js';
import { createEnergyMaterials } from '../common/materials.js';
import { addLabels } from '../common/labels.js';
import { createInstancedMesh } from '../common/instancing.js';

const app = createSceneApp({
  background: 0x9ec8e6,
  fog: { color: 0x9ec8e6, near: 90, far: 300 },
  camera: { fov: 55, near: 0.1, far: 600, position: [55, 34, 62] },
  controlsTarget: [0, 10, 0],
  withLabels: true,
});

const { scene, labelRenderer, resetCamera, renderFrame } = app;
const materials = createEnergyMaterials();

addDefaultLights(scene, {
  ambient: 0.55,
  key: { color: 0xffffff, intensity: 1.2, position: [40, 65, 28], shadowBounds: 85 },
});

const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 220), materials.grass);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const site = new THREE.Group();
scene.add(site);

const road = new THREE.Mesh(new THREE.BoxGeometry(165, 0.08, 11), materials.asphalt);
road.position.set(-8, 0.04, 36);
road.receiveShadow = true;
site.add(road);

const coalPad = new THREE.Mesh(new THREE.BoxGeometry(36, 0.12, 24), materials.gravel);
coalPad.position.set(-60, 0.06, -24);
coalPad.receiveShadow = true;
site.add(coalPad);

const coalPileGeometry = new THREE.ConeGeometry(6.5, 8, 18);
createInstancedMesh({
  geometry: coalPileGeometry,
  material: materials.coal,
  parent: site,
  transforms: [
    { position: [-70, 4, -28] },
    { position: [-58, 4.2, -22], scale: [1.1, 1.1, 1.1] },
    { position: [-47, 3.8, -29], scale: [0.95, 0.95, 0.95] },
  ],
});

const boilerHall = new THREE.Mesh(new THREE.BoxGeometry(28, 18, 18), materials.industrialWall);
boilerHall.position.set(-8, 9, 0);
boilerHall.castShadow = true;
boilerHall.receiveShadow = true;
site.add(boilerHall);

const boilerRoof = new THREE.Mesh(new THREE.BoxGeometry(29, 1.2, 19), materials.industrialRoof);
boilerRoof.position.set(-8, 18.6, 0);
boilerRoof.castShadow = true;
site.add(boilerRoof);

const turbineHall = new THREE.Mesh(new THREE.BoxGeometry(34, 12, 14), materials.concrete);
turbineHall.position.set(26, 6, 2);
turbineHall.castShadow = true;
turbineHall.receiveShadow = true;
site.add(turbineHall);

const turbineRoof = new THREE.Mesh(new THREE.BoxGeometry(35, 0.9, 15), materials.industrialRoof);
turbineRoof.position.set(26, 12.5, 2);
turbineRoof.castShadow = true;
site.add(turbineRoof);

const substationPad = new THREE.Mesh(new THREE.BoxGeometry(34, 0.12, 20), materials.gravel);
substationPad.position.set(78, 0.06, -10);
substationPad.receiveShadow = true;
site.add(substationPad);

for (let x = 66; x <= 90; x += 12) {
  const transformer = new THREE.Mesh(new THREE.BoxGeometry(7, 3.4, 4), materials.metal);
  transformer.position.set(x, 1.8, -12);
  transformer.castShadow = true;
  transformer.receiveShadow = true;
  site.add(transformer);
}

for (let x = 62; x <= 94; x += 8) {
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 7, 12), materials.metal);
  post.position.set(x, 3.5, 0);
  post.castShadow = true;
  site.add(post);

  const bus = new THREE.Mesh(new THREE.BoxGeometry(6, 0.18, 0.18), materials.copper);
  bus.position.set(x, 6.3, 0);
  bus.castShadow = true;
  site.add(bus);
}

const stackGeometry = new THREE.CylinderGeometry(1.2, 1.5, 30, 24);
createInstancedMesh({
  geometry: stackGeometry,
  material: materials.stack,
  parent: site,
  transforms: [
    { position: [-32, 15, 16] },
    { position: [-20, 15, 16] },
    { position: [-8, 15, 16] },
  ],
});

createInstancedMesh({
  geometry: new THREE.CylinderGeometry(1.28, 1.28, 1.7, 24),
  material: materials.stackBand,
  parent: site,
  transforms: [
    { position: [-32, 23, 16] },
    { position: [-32, 29, 16] },
    { position: [-20, 23, 16] },
    { position: [-20, 29, 16] },
    { position: [-8, 23, 16] },
    { position: [-8, 29, 16] },
  ],
});

const smokePuffs = [];
const smokeGeometry = new THREE.SphereGeometry(3.2, 20, 14);
for (const [x, z] of [[-32, 16], [-20, 16], [-8, 16]]) {
  for (let i = 0; i < 2; i += 1) {
    const puff = new THREE.Mesh(smokeGeometry, materials.smoke);
    puff.position.set(x + i * 1.8 - 0.9, 33 + i * 3.5, z);
    puff.castShadow = false;
    puff.receiveShadow = false;
    site.add(puff);
    smokePuffs.push({ puff, baseX: x + i * 1.8 - 0.9, baseY: 33 + i * 3.5, phase: i * 0.8 + x * 0.05 });
  }
}

const conveyor = new THREE.Mesh(new THREE.BoxGeometry(26, 1.1, 2.2), materials.darkMetal);
conveyor.position.set(-36, 10, -14);
conveyor.rotation.z = -0.24;
conveyor.castShadow = true;
site.add(conveyor);

const coolingPond = new THREE.Mesh(new THREE.BoxGeometry(36, 0.2, 20), materials.water);
coolingPond.position.set(52, 0.1, 24);
coolingPond.receiveShadow = true;
site.add(coolingPond);

const labelLayer = new THREE.Group();
scene.add(labelLayer);
addLabels(labelLayer, [
  { html: 'Котельний цех<br/><small>boiler house</small>', position: [-8, 20, 0] },
  { html: 'Турбінний зал', position: [26, 14, 2] },
  { html: 'Димові труби', position: [-20, 34, 16] },
  { html: 'Вугільний склад', position: [-60, 9, -24] },
  { html: 'Підстанція', position: [78, 9, -10] },
  { html: 'Ставок технічної води', position: [52, 4, 24] },
]);

const labelToggle = document.getElementById('chkLabels');
labelToggle.addEventListener('change', () => {
  labelLayer.visible = labelToggle.checked;
  labelRenderer.domElement.style.display = labelToggle.checked ? '' : 'none';
});
labelLayer.visible = labelToggle.checked;

bindResetButton('btnReset', resetCamera);

renderFrame((time) => {
  smokePuffs.forEach(({ puff, baseX, baseY, phase }, index) => {
    const drift = Math.sin(time * 0.35 + phase) * 1.2;
    const bob = Math.sin(time * 0.7 + phase) * 0.8;
    const scale = 0.9 + ((index % 2) * 0.1) + Math.sin(time * 0.55 + phase) * 0.05;
    puff.position.set(baseX + drift, baseY + bob, 16 + Math.cos(time * 0.35 + phase) * 0.6);
    puff.scale.setScalar(scale);
  });
});
