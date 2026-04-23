import * as THREE from 'three';
import { bindResetButton, createSceneApp, addDefaultLights } from '../common/setup.js';
import { createEnergyMaterials } from '../common/materials.js';
import { addLabels } from '../common/labels.js';

const app = createSceneApp({
  background: 0x10182d,
  fog: { color: 0x10182d, near: 55, far: 180 },
  camera: { fov: 50, near: 0.1, far: 500, position: [22, 15, 42] },
  controlsTarget: [0, 7, 0],
  withLabels: true,
});

const { scene, labelRenderer, resetCamera, renderFrame } = app;
const materials = createEnergyMaterials();

addDefaultLights(scene, {
  ambient: 0.38,
  key: { color: 0xffffff, intensity: 1.15, position: [26, 34, 20], shadowBounds: 60 },
  fill: { color: 0x78a6ff, intensity: 0.35, position: [-18, 18, -20] },
});

const ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 140), materials.darkMetal);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const assembly = new THREE.Group();
assembly.rotation.y = -0.32;
scene.add(assembly);

const skid = new THREE.Mesh(new THREE.BoxGeometry(42, 0.9, 12), materials.concrete);
skid.position.set(0, 0.45, 0);
skid.receiveShadow = true;
assembly.add(skid);

const casingLeft = new THREE.Mesh(
  new THREE.CylinderGeometry(5.3, 5.3, 9.5, 32, 1, true, Math.PI * 0.12, Math.PI * 0.76),
  materials.nacelle,
);
casingLeft.position.set(-8, 6, 0);
casingLeft.rotation.z = Math.PI / 2;
casingLeft.castShadow = true;
casingLeft.receiveShadow = true;
assembly.add(casingLeft);

const casingRight = casingLeft.clone();
casingRight.rotation.z = -Math.PI / 2;
assembly.add(casingRight);

const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 28, 20), materials.magneticSteel);
shaft.position.set(2, 6, 0);
shaft.rotation.z = Math.PI / 2;
shaft.castShadow = true;
shaft.receiveShadow = true;
assembly.add(shaft);

const rotor = new THREE.Group();
rotor.position.set(-11, 6, 0);
assembly.add(rotor);

for (let index = 0; index < 10; index += 1) {
  const blade = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.55, 1.5), materials.blade);
  blade.position.x = -0.4;
  blade.rotation.y = (Math.PI * 2 * index) / 10;
  blade.rotation.z = 0.28;
  blade.castShadow = true;
  blade.receiveShadow = true;
  rotor.add(blade);
}

const rotorDisk = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 3.4, 24), materials.accent);
rotorDisk.position.set(-11, 6, 0);
rotorDisk.rotation.z = Math.PI / 2;
rotorDisk.castShadow = true;
rotorDisk.receiveShadow = true;
assembly.add(rotorDisk);

const stageGuide = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.18, 12, 48), materials.bladeTip);
stageGuide.position.set(-8, 6, 0);
stageGuide.rotation.y = Math.PI / 2;
stageGuide.castShadow = true;
assembly.add(stageGuide);

const generatorBody = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.2, 14, 32), materials.nacelle);
generatorBody.position.set(11, 6, 0);
generatorBody.rotation.z = Math.PI / 2;
generatorBody.castShadow = true;
generatorBody.receiveShadow = true;
assembly.add(generatorBody);

const generatorCut = new THREE.Mesh(new THREE.BoxGeometry(7, 7.6, 10.4), materials.darkMetal);
generatorCut.position.set(14.5, 6, 0);
assembly.add(generatorCut);

const statorShell = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.3, 12.5, 28), materials.magneticSteel);
statorShell.position.set(10.8, 6, 0);
statorShell.rotation.z = Math.PI / 2;
statorShell.castShadow = true;
statorShell.receiveShadow = true;
assembly.add(statorShell);

const statorInnerCut = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 13.2, 24), materials.darkMetal);
statorInnerCut.position.set(12.6, 6, 0);
statorInnerCut.rotation.z = Math.PI / 2;
assembly.add(statorInnerCut);

const rotorCore = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 11.2, 24), materials.accent);
rotorCore.position.set(11, 6, 0);
rotorCore.rotation.z = Math.PI / 2;
rotorCore.castShadow = true;
rotorCore.receiveShadow = true;
assembly.add(rotorCore);

for (let index = 0; index < 4; index += 1) {
  const coil = new THREE.Mesh(new THREE.TorusGeometry(3.35, 0.22, 12, 28), materials.coil);
  coil.position.set(10.2 + index * 1.4, 6, 0);
  coil.rotation.y = Math.PI / 2;
  coil.castShadow = true;
  assembly.add(coil);
}

const bearing = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.2, 18), materials.metal);
bearing.position.set(1.2, 6, 0);
bearing.rotation.z = Math.PI / 2;
bearing.castShadow = true;
assembly.add(bearing);

const terminalBox = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.8, 3.2), materials.inverter);
terminalBox.position.set(17.5, 10.4, 0);
terminalBox.castShadow = true;
terminalBox.receiveShadow = true;
assembly.add(terminalBox);

const outputBus = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.24, 0.24), materials.copper);
outputBus.position.set(19.8, 9.4, 0);
outputBus.castShadow = true;
assembly.add(outputBus);

const airflow = [];
for (let index = 0; index < 4; index += 1) {
  const stream = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.08, 0.08), materials.foam);
  stream.position.set(-20 + index * 2.8, 8 - index * 0.7, 0);
  assembly.add(stream);
  airflow.push(stream);
}

const labelLayer = new THREE.Group();
scene.add(labelLayer);
addLabels(labelLayer, [
  { html: 'Лопатки турбіни<br/><small>turbine blades</small>', position: [-13, 12, 0] },
  { html: 'Ротор турбіни', position: [-11, 3, 6] },
  { html: 'Спільний вал', position: [2, 10, 0] },
  { html: 'Підшипникова опора', position: [1.2, 3.4, 5] },
  { html: 'Ротор генератора', position: [11, 2.2, 5] },
  { html: 'Статор і обмотки', position: [12.8, 12, 0] },
  { html: 'Клемний вивід', position: [17.8, 14, 0] },
]);

const labelToggle = document.getElementById('chkLabels');
labelToggle.addEventListener('change', () => {
  labelLayer.visible = labelToggle.checked;
  labelRenderer.domElement.style.display = labelToggle.checked ? '' : 'none';
});
labelLayer.visible = labelToggle.checked;

bindResetButton('btnReset', resetCamera);

renderFrame((time) => {
  rotor.rotation.x = time * 1.5;
  rotorDisk.rotation.x = time * 1.5;
  rotorCore.rotation.x = time * 1.5;
  airflow.forEach((stream, index) => {
    stream.position.x = -20 + ((time * 8 + index * 3.2) % 14);
    stream.material.opacity = 0.42 + Math.sin(time * 3 + index) * 0.1;
  });
});
