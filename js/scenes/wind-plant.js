import * as THREE from 'three';
import { bindResetButton, createSceneApp, addDefaultLights } from '../common/setup.js';
import { createEnergyMaterials } from '../common/materials.js';
import { addLabels } from '../common/labels.js';

const app = createSceneApp({
  background: 0xa8d4f5,
  fog: { color: 0xa8d4f5, near: 120, far: 360 },
  camera: { fov: 55, near: 0.1, far: 800, position: [92, 56, 112] },
  controlsTarget: [0, 18, 0],
  withLabels: true,
});

const { scene, labelRenderer, resetCamera, renderFrame } = app;
const materials = createEnergyMaterials();

addDefaultLights(scene, {
  ambient: 0.65,
  key: { color: 0xffffff, intensity: 1.25, position: [70, 90, 45], shadowBounds: 150 },
  fill: { color: 0x8fc1ff, intensity: 0.28, position: [-40, 30, -30] },
});

const ground = new THREE.Mesh(new THREE.PlaneGeometry(360, 280), materials.grass);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const site = new THREE.Group();
scene.add(site);

for (const hill of [
  { x: -118, z: -70, r: 28 },
  { x: -108, z: 64, r: 22 },
  { x: 112, z: -74, r: 24 },
  { x: 128, z: 56, r: 26 },
]) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(hill.r, 28, 20), materials.hill);
  mesh.position.set(hill.x, hill.r * 0.48, hill.z);
  mesh.scale.y = 0.6;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  site.add(mesh);
}

const road = new THREE.Mesh(new THREE.BoxGeometry(180, 0.08, 12), materials.asphalt);
road.position.set(0, 0.04, 54);
road.receiveShadow = true;
site.add(road);

const serviceBuilding = new THREE.Mesh(new THREE.BoxGeometry(18, 8, 12), materials.industrialWall);
serviceBuilding.position.set(-76, 4, 24);
serviceBuilding.castShadow = true;
serviceBuilding.receiveShadow = true;
site.add(serviceBuilding);

const serviceRoof = new THREE.Mesh(new THREE.BoxGeometry(19, 0.8, 13), materials.industrialRoof);
serviceRoof.position.set(-76, 8.4, 24);
serviceRoof.castShadow = true;
site.add(serviceRoof);

const substationPad = new THREE.Mesh(new THREE.BoxGeometry(32, 0.12, 18), materials.gravel);
substationPad.position.set(98, 0.06, 14);
substationPad.receiveShadow = true;
site.add(substationPad);

for (let x = 88; x <= 104; x += 8) {
  const transformer = new THREE.Mesh(new THREE.BoxGeometry(5.5, 3.2, 3.4), materials.metal);
  transformer.position.set(x, 1.7, 14);
  transformer.castShadow = true;
  transformer.receiveShadow = true;
  site.add(transformer);
}

const cableTrench = new THREE.Mesh(new THREE.BoxGeometry(150, 0.05, 2.6), materials.darkMetal);
cableTrench.position.set(10, 0.03, 26);
cableTrench.receiveShadow = true;
site.add(cableTrench);

function createRotorBlade(length = 16) {
  const blade = new THREE.Group();

  const body = new THREE.Mesh(new THREE.BoxGeometry(length, 0.8, 1.6), materials.blade);
  body.position.x = length * 0.5;
  body.castShadow = true;
  body.receiveShadow = true;
  blade.add(body);

  const taper = new THREE.Mesh(new THREE.ConeGeometry(0.78, 3.2, 10), materials.blade);
  taper.rotation.z = -Math.PI / 2;
  taper.position.x = length + 1.5;
  taper.castShadow = true;
  taper.receiveShadow = true;
  blade.add(taper);

  const tip = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.82, 1.62), materials.bladeTip);
  tip.position.x = length - 0.7;
  tip.castShadow = true;
  tip.receiveShadow = true;
  blade.add(tip);

  return blade;
}

function createWindTurbine({ towerHeight = 54, bladeLength = 18, position = [0, 0, 0], yaw = 0 }) {
  const turbine = new THREE.Group();
  turbine.position.set(...position);
  turbine.rotation.y = yaw;

  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(1.3, 2.4, towerHeight, 20),
    materials.nacelle,
  );
  tower.position.y = towerHeight * 0.5;
  tower.castShadow = true;
  tower.receiveShadow = true;
  turbine.add(tower);

  const nacelle = new THREE.Mesh(new THREE.BoxGeometry(10, 4.2, 4.5), materials.nacelle);
  nacelle.position.set(0, towerHeight + 1.2, 0);
  nacelle.castShadow = true;
  nacelle.receiveShadow = true;
  turbine.add(nacelle);

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 3, 20), materials.magneticSteel);
  hub.position.set(5.4, towerHeight + 1.2, 0);
  hub.rotation.z = Math.PI / 2;
  hub.castShadow = true;
  hub.receiveShadow = true;
  turbine.add(hub);

  const rotor = new THREE.Group();
  rotor.position.set(5.4, towerHeight + 1.2, 0);
  for (let index = 0; index < 3; index += 1) {
    const blade = createRotorBlade(bladeLength);
    blade.rotation.x = (Math.PI * 2 * index) / 3;
    rotor.add(blade);
  }
  turbine.add(rotor);

  return { turbine, rotor };
}

const animatedRotors = [];
for (const spec of [
  { position: [-66, 0, -28], yaw: 0.18, speed: 1.08 },
  { position: [-8, 0, -52], yaw: -0.1, speed: 0.92 },
  { position: [54, 0, -20], yaw: 0.2, speed: 1.14 },
  { position: [-40, 0, 10], yaw: 0.06, speed: 0.98 },
  { position: [26, 0, 22], yaw: -0.14, speed: 1.04 },
]) {
  const { turbine, rotor } = createWindTurbine(spec);
  site.add(turbine);
  animatedRotors.push({ rotor, speed: spec.speed });
}

const metMast = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 28, 12), materials.accent);
metMast.position.set(72, 14, -48);
metMast.castShadow = true;
site.add(metMast);

const cutawayStand = new THREE.Group();
cutawayStand.position.set(-12, 0, 72);
site.add(cutawayStand);

const standPad = new THREE.Mesh(new THREE.BoxGeometry(30, 0.2, 16), materials.concrete);
standPad.position.set(0, 0.1, 0);
standPad.receiveShadow = true;
cutawayStand.add(standPad);

const standTower = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.3, 16, 18), materials.nacelle);
standTower.position.set(-9, 8, 0);
standTower.castShadow = true;
standTower.receiveShadow = true;
cutawayStand.add(standTower);

const nacelleShell = new THREE.Mesh(
  new THREE.BoxGeometry(13, 5.2, 5.6, 8, 1, 1),
  materials.nacelle,
);
nacelleShell.position.set(0, 18, 0);
nacelleShell.castShadow = true;
nacelleShell.receiveShadow = true;
cutawayStand.add(nacelleShell);

const nacelleOpening = new THREE.Mesh(new THREE.BoxGeometry(6.8, 4.2, 5.8), materials.darkMetal);
nacelleOpening.position.set(3.1, 18, 0);
cutawayStand.add(nacelleOpening);

const lowSpeedShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 7.6, 16), materials.magneticSteel);
lowSpeedShaft.position.set(-1.8, 18, 0);
lowSpeedShaft.rotation.z = Math.PI / 2;
lowSpeedShaft.castShadow = true;
cutawayStand.add(lowSpeedShaft);

const gearbox = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.2, 3), materials.darkMetal);
gearbox.position.set(1.6, 18, 0);
gearbox.castShadow = true;
gearbox.receiveShadow = true;
cutawayStand.add(gearbox);

const generator = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 4.2, 20), materials.accent);
generator.position.set(5.4, 18, 0);
generator.rotation.z = Math.PI / 2;
generator.castShadow = true;
generator.receiveShadow = true;
cutawayStand.add(generator);

const generatorCoil = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.28, 12, 28), materials.coil);
generatorCoil.position.set(5.4, 18, 0);
generatorCoil.rotation.y = Math.PI / 2;
generatorCoil.castShadow = true;
cutawayStand.add(generatorCoil);

const standHub = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.8, 18), materials.magneticSteel);
standHub.position.set(-6.3, 18, 0);
standHub.rotation.z = Math.PI / 2;
standHub.castShadow = true;
cutawayStand.add(standHub);

const standRotor = new THREE.Group();
standRotor.position.set(-6.3, 18, 0);
for (let index = 0; index < 3; index += 1) {
  const blade = createRotorBlade(10);
  blade.rotation.x = (Math.PI * 2 * index) / 3;
  standRotor.add(blade);
}
cutawayStand.add(standRotor);
animatedRotors.push({ rotor: standRotor, speed: 0.72 });

const labelLayer = new THREE.Group();
scene.add(labelLayer);
addLabels(labelLayer, [
  { html: 'Вітропарк<br/><small>wind farm</small>', position: [-10, 62, -18] },
  { html: 'Сервісний модуль', position: [-76, 10, 24] },
  { html: 'Підстанція', position: [98, 7, 14] },
  { html: 'Кабельна траса', position: [16, 4, 26] },
  { html: 'Щогла вимірювання вітру', position: [72, 18, -48] },
  { html: 'Навчальний макет гондоли', position: [-2, 25, 72] },
  { html: 'Лопаті ротора', position: [-15, 28, 72] },
  { html: 'Редуктор і генератор', position: [6, 22, 72] },
]);

const labelToggle = document.getElementById('chkLabels');
labelToggle.addEventListener('change', () => {
  labelLayer.visible = labelToggle.checked;
  labelRenderer.domElement.style.display = labelToggle.checked ? '' : 'none';
});
labelLayer.visible = labelToggle.checked;

bindResetButton('btnReset', resetCamera);

renderFrame((time) => {
  animatedRotors.forEach(({ rotor, speed }, index) => {
    rotor.rotation.x = time * speed + index * 0.45;
  });
});
