import * as THREE from 'three';
import { bindResetButton, createSceneApp, addDefaultLights } from '../common/setup.js';
import { createReactorMaterials } from '../common/materials.js';
import { addLabels } from '../common/labels.js';

const app = createSceneApp({
  background: 0x0b1020,
  fog: { color: 0x0b1020, near: 40, far: 160 },
  camera: { fov: 55, near: 0.1, far: 600, position: [22, 18, 28] },
  controlsTarget: [0, 9, 0],
  withLabels: true,
});

const { scene, labelRenderer, resetCamera, renderFrame } = app;
const materials = createReactorMaterials();

addDefaultLights(scene, {
  ambient: 0.35,
  key: { color: 0xffffff, intensity: 1.1, position: [25, 35, 18], shadowBounds: 50 },
  fill: { color: 0x7fb2ff, intensity: 0.35, position: [-18, 20, -25] },
});

const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), materials.ground);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const layers = {
  vessel: new THREE.Group(),
  water: new THREE.Group(),
  core: new THREE.Group(),
  fuel: new THREE.Group(),
  rods: new THREE.Group(),
  cut: new THREE.Group(),
  labels: new THREE.Group(),
};
const reactor = new THREE.Group();
reactor.rotation.y = -Math.PI / 5;
scene.add(reactor);
Object.values(layers).forEach((layer) => reactor.add(layer));

const vesselRadius = 6.2;
const vesselHeight = 18;
const thetaStart = 0.35;
const thetaLength = Math.PI * 0.85;

const vessel = new THREE.Mesh(
  new THREE.CylinderGeometry(vesselRadius, vesselRadius, vesselHeight, 48, 1, false, thetaStart, thetaLength),
  materials.steel,
);
vessel.position.set(0, vesselHeight / 2, 0);
vessel.castShadow = true;
vessel.receiveShadow = true;
layers.vessel.add(vessel);

const liner = new THREE.Mesh(
  new THREE.CylinderGeometry(vesselRadius * 0.92, vesselRadius * 0.92, vesselHeight * 0.96, 48, 1, true, thetaStart, thetaLength),
  materials.inner,
);
liner.position.set(0, vesselHeight / 2, 0);
liner.castShadow = true;
liner.receiveShadow = true;
layers.vessel.add(liner);

const head = new THREE.Mesh(
  new THREE.SphereGeometry(vesselRadius, 48, 24, thetaStart, thetaLength, 0, Math.PI / 2),
  materials.steel,
);
head.position.set(0, vesselHeight, 0);
head.castShadow = true;
head.receiveShadow = true;
layers.vessel.add(head);

const water = new THREE.Mesh(
  new THREE.CylinderGeometry(vesselRadius * 0.87, vesselRadius * 0.87, vesselHeight * 0.88, 48, 1, true, thetaStart, thetaLength),
  materials.water,
);
water.position.set(0, vesselHeight / 2, 0);
water.receiveShadow = true;
layers.water.add(water);

const coreHeight = vesselHeight * 0.42;
const coreY = vesselHeight * 0.3;
const coreRadius = vesselRadius * 0.5;

const coreBarrel = new THREE.Mesh(
  new THREE.CylinderGeometry(coreRadius * 1.08, coreRadius * 1.08, coreHeight, 36, 1, false, thetaStart, thetaLength),
  materials.core,
);
coreBarrel.position.set(0, coreY, 0);
coreBarrel.castShadow = true;
coreBarrel.receiveShadow = true;
layers.core.add(coreBarrel);

const fuelRodGeometry = new THREE.CylinderGeometry(0.12, 0.12, coreHeight * 0.92, 12);
const pitch = 0.6;
const half = 5;
for (let ix = -half; ix <= half; ix += 1) {
  for (let iz = -half; iz <= half; iz += 1) {
    const x = ix * pitch;
    const z = iz * pitch;
    if (x * x + z * z > (coreRadius * 0.92) ** 2) {
      continue;
    }
    const rod = new THREE.Mesh(fuelRodGeometry, materials.fuel);
    rod.position.set(x, coreY, z);
    rod.castShadow = true;
    rod.receiveShadow = true;
    layers.fuel.add(rod);
  }
}

const controlRodGeometry = new THREE.CylinderGeometry(0.18, 0.18, coreHeight * 0.95, 14);
const controlRodPositions = [
  [-1.2, -1.2],
  [1.2, -1.2],
  [-1.2, 1.2],
  [1.2, 1.2],
  [0, 0],
  [0, 2.0],
  [2.0, 0],
  [-2.0, 0],
  [0, -2.0],
];
for (const [x, z] of controlRodPositions) {
  const rod = new THREE.Mesh(controlRodGeometry, materials.rod);
  rod.position.set(x, coreY + 0.15, z);
  rod.castShadow = true;
  rod.receiveShadow = true;
  layers.rods.add(rod);
}

function addCutWall(angle) {
  const wall = new THREE.Mesh(new THREE.BoxGeometry(vesselRadius * 2.1, vesselHeight * 1.05, 0.08), materials.cut);
  wall.position.set(0, vesselHeight / 2, 0);
  wall.rotation.y = angle;
  wall.receiveShadow = true;
  layers.cut.add(wall);
}
addCutWall(thetaStart);
addCutWall(thetaStart + thetaLength);

const glow = new THREE.PointLight(0xff6b3d, 1.2, 26, 2);
glow.position.set(0, coreY, 0);
layers.core.add(glow);

addLabels(layers.labels, [
  { html: 'Корпус реактора<br/><small>pressure vessel</small>', position: [5.2, 10.5, 0] },
  { html: 'Теплоносій (вода)<br/><small>під тиском</small>', position: [2.8, 9.0, 3.2] },
  { html: 'Активна зона<br/><small>core</small>', position: [-1.8, coreY + 1.2, -3.8] },
  { html: 'Паливні стрижні<br/><small>fuel rods</small>', position: [1.6, coreY + 0.4, -1.8] },
  { html: 'Керуючі стрижні<br/><small>control rods</small>', position: [-2.8, coreY + 2.4, 1.7] },
  { html: 'Лінія розрізу<br/><small>cut plane</small>', position: [0.0, 12.0, 7.6] },
]);

const query = (id) => document.getElementById(id);
function bindLayer(checkboxId, layerKey) {
  const checkbox = query(checkboxId);
  checkbox.addEventListener('change', () => {
    layers[layerKey].visible = checkbox.checked;
  });
  layers[layerKey].visible = checkbox.checked;
}

bindLayer('chkVessel', 'vessel');
bindLayer('chkWater', 'water');
bindLayer('chkCore', 'core');
bindLayer('chkFuel', 'fuel');
bindLayer('chkRods', 'rods');
bindLayer('chkCut', 'cut');

const labelToggle = query('chkLabels');
labelToggle.addEventListener('change', () => {
  layers.labels.visible = labelToggle.checked;
  labelRenderer.domElement.style.display = labelToggle.checked ? '' : 'none';
});
layers.labels.visible = labelToggle.checked;

bindResetButton('btnReset', resetCamera);
renderFrame();
