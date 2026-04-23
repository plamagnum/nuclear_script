import * as THREE from 'three';
import { bindResetButton, createSceneApp, addDefaultLights } from '../common/setup.js';
import { createPlantMaterials } from '../common/materials.js';
import { addLabels } from '../common/labels.js';
import { createInstancedMesh } from '../common/instancing.js';
import { addBasePlant, addGroup, addMesh, addRectFenceInstanced } from './plant-shared.js';

const app = createSceneApp({
  background: 0x87ceeb,
  fog: { color: 0x87ceeb, near: 90, far: 260 },
  camera: { fov: 55, near: 0.1, far: 700, position: [55, 38, 65] },
  controlsTarget: [0, 10, 0],
  withLabels: true,
});

const { scene, labelRenderer, resetCamera, renderFrame } = app;
const materials = createPlantMaterials();

addDefaultLights(scene, {
  ambient: 0.5,
  key: { color: 0xffffff, intensity: 1.15, position: [55, 75, 35], shadowBounds: 90 },
});

const ground = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), materials.green);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const site = new THREE.Group();
scene.add(site);

const { towerA, towerB, labelAnchors } = addBasePlant(site, materials);

function addRoad({ x, z, w, d, y = 0.03, rotY = 0 }) {
  const road = addMesh(site, new THREE.BoxGeometry(w, 0.06, d), materials.asphalt, [x, y, z], {
    castShadow: false,
    rotation: [0, rotY, 0],
  });

  if (Math.max(w, d) < 35) {
    return road;
  }

  const dashedGroup = addGroup(site, [x, y, z]);
  dashedGroup.rotation.copy(road.rotation);
  const alongX = w > d;
  const length = alongX ? w : d;
  const step = 6;
  const dashLength = 3.2;
  const count = Math.floor(length / step);

  for (let i = -count; i <= count; i += 1) {
    const dash = new THREE.Mesh(
      new THREE.BoxGeometry(alongX ? dashLength : 0.3, 0.02, alongX ? 0.3 : dashLength),
      materials.roadLine,
    );
    dash.position.set(alongX ? i * step : 0, 0.05, alongX ? 0 : i * step);
    dashedGroup.add(dash);
  }

  return road;
}

addRoad({ x: -95, z: -40, w: 160, d: 10 });
addRoad({ x: -20, z: -10, w: 120, d: 9, rotY: Math.PI / 2 });
addRoad({ x: 10, z: -30, w: 100, d: 9 });
addRoad({ x: 55, z: -35, w: 90, d: 8 });

function addAdminBuilding(x, z) {
  const group = addGroup(site, [x, 0, z]);

  addMesh(group, new THREE.BoxGeometry(18, 8, 10), materials.adminBody, [0, 4, 0]);
  for (let i = -7; i <= 7; i += 2.2) {
    addMesh(group, new THREE.BoxGeometry(1.4, 2.1, 0.12), materials.glass, [i, 4.2, 5.06], {
      castShadow: false,
      receiveShadow: false,
    });
  }
  addMesh(group, new THREE.BoxGeometry(18.6, 0.6, 10.6), materials.dark, [0, 8.3, 0]);
  addMesh(group, new THREE.BoxGeometry(4, 3, 2.2), materials.concrete, [-6.5, 1.5, 6.2]);
  addMesh(group, new THREE.BoxGeometry(26, 0.08, 16), materials.asphalt, [0, 0.04, 18], { castShadow: false });

  return group;
}

function addWarehouse(x, z) {
  const group = addGroup(site, [x, 0, z]);
  addMesh(group, new THREE.BoxGeometry(26, 7, 14), materials.warehouseBody, [0, 3.5, 0]);
  addMesh(group, new THREE.CylinderGeometry(0, 10.5, 26.6, 4, 1, false), materials.warehouseRoof, [0, 8.1, 0], {
    rotation: [0, Math.PI / 4, Math.PI / 2],
  });

  for (let i = -8; i <= 8; i += 8) {
    addMesh(group, new THREE.BoxGeometry(4.2, 4.2, 0.2), materials.door, [i, 2.3, 7.12], {
      castShadow: false,
    });
  }

  addMesh(group, new THREE.BoxGeometry(34, 0.08, 18), materials.concrete, [0, 0.04, 16], {
    castShadow: false,
  });

  return group;
}

function addTransformer(parent, x, z) {
  const group = addGroup(parent, [x, 0, z]);

  addMesh(group, new THREE.BoxGeometry(10, 0.35, 6), materials.concrete, [0, 0.175, 0], { castShadow: false });
  addMesh(group, new THREE.BoxGeometry(6.8, 2.6, 3.8), materials.metal, [0, 1.55, 0]);

  for (let i = -2.7; i <= 2.7; i += 0.6) {
    addMesh(group, new THREE.BoxGeometry(0.12, 2.0, 3.4), materials.metal, [i, 1.55, -2.3], {
      castShadow: false,
    });
  }

  for (let i = -2; i <= 2; i += 2) {
    addMesh(group, new THREE.CylinderGeometry(0.25, 0.35, 1.6, 16), materials.insulator, [i, 3.2, 1.2]);
    addMesh(group, new THREE.SphereGeometry(0.28, 16, 12), materials.copper, [i, 4.05, 1.2], {
      receiveShadow: false,
    });
  }

  addMesh(group, new THREE.CylinderGeometry(0.6, 0.6, 5.0, 18), materials.metal, [0, 3.0, -0.2], {
    rotation: [0, 0, Math.PI / 2],
  });

  return group;
}

function addSubstation(x, z) {
  const group = addGroup(site, [x, 0, z]);
  addMesh(group, new THREE.BoxGeometry(44, 0.12, 26), materials.gravel, [0, 0.06, 0], { castShadow: false });
  addRectFenceInstanced(group, materials, { w: 44, d: 26, h: 2.2, t: 0.18 });

  addTransformer(group, -12, -5);
  addTransformer(group, 0, -5);
  addTransformer(group, 12, -5);

  for (let i = -16; i <= 16; i += 8) {
    addMesh(group, new THREE.CylinderGeometry(0.25, 0.3, 7, 12), materials.gantry, [i, 3.5, 7]);
    addMesh(group, new THREE.BoxGeometry(6, 0.25, 0.25), materials.gantry, [i, 6.2, 7]);
  }

  addMesh(group, new THREE.BoxGeometry(36, 0.12, 0.12), materials.copper, [0, 6.2, 7], {
    castShadow: false,
    receiveShadow: false,
  });

  return group;
}

function addTransmissionLine() {
  const towers = [
    { position: [95, 0, -42], yaw: 0, height: 22 },
    { position: [125, 0, -50], yaw: 0.15, height: 22 },
    { position: [160, 0, -60], yaw: 0.2, height: 22 },
  ];

  const legLocalPositions = [
    [-1.5, 11, -1.3],
    [1.5, 11, -1.3],
    [-1.1, 11, 1.4],
    [1.1, 11, 1.4],
  ];
  const midHooks = [
    new THREE.Vector3(-4.5, 17.16, 0),
    new THREE.Vector3(0, 17.16, 0),
    new THREE.Vector3(4.5, 17.16, 0),
  ];
  const topHooks = [
    new THREE.Vector3(-3, 19.8, 0),
    new THREE.Vector3(3, 19.8, 0),
  ];

  const towerMatrices = towers.map((tower) => {
    const position = new THREE.Vector3(...tower.position);
    const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, tower.yaw, 0));
    return new THREE.Matrix4().compose(position, quaternion, new THREE.Vector3(1, 1, 1));
  });

  const buildTransforms = (localTransforms) => {
    const transforms = [];
    const localMatrix = new THREE.Matrix4();
    const localQuaternion = new THREE.Quaternion();
    for (const towerMatrix of towerMatrices) {
      for (const transform of localTransforms) {
        localQuaternion.setFromEuler(new THREE.Euler(...(transform.rotation ?? [0, 0, 0])));
        localMatrix.compose(
          new THREE.Vector3(...(transform.position ?? [0, 0, 0])),
          localQuaternion,
          new THREE.Vector3(...(transform.scale ?? [1, 1, 1])),
        );
        transforms.push({ matrix: towerMatrix.clone().multiply(localMatrix) });
      }
    }
    return transforms;
  };

  createInstancedMesh({
    geometry: new THREE.CylinderGeometry(0.22, 0.35, 22, 10),
    material: materials.lineSteel,
    parent: site,
    transforms: buildTransforms(legLocalPositions.map((position) => ({ position }))),
  });
  createInstancedMesh({
    geometry: new THREE.BoxGeometry(10, 0.35, 0.35),
    material: materials.lineSteel,
    parent: site,
    transforms: buildTransforms([{ position: [0, 17.16, 0] }]),
  });
  createInstancedMesh({
    geometry: new THREE.BoxGeometry(6.5, 0.3, 0.3),
    material: materials.lineSteel,
    parent: site,
    transforms: buildTransforms([{ position: [0, 19.8, 0] }]),
  });
  createInstancedMesh({
    geometry: new THREE.CylinderGeometry(0.18, 0.22, 5.5, 10),
    material: materials.lineSteel,
    parent: site,
    transforms: buildTransforms([{ position: [0, 23.65, 0] }]),
  });
  createInstancedMesh({
    geometry: new THREE.CylinderGeometry(0.12, 0.18, 0.9, 12),
    material: materials.insulator,
    parent: site,
    transforms: buildTransforms(
      [...midHooks, ...topHooks].map((hook) => ({ position: [hook.x, hook.y - 0.45, hook.z] })),
    ),
  });

  const towerDescriptors = towerMatrices.map((matrix) => ({ matrix, hooks: { mid: midHooks, top: topHooks } }));

  function worldPoint(tower, localPoint) {
    return localPoint.clone().applyMatrix4(tower.matrix);
  }

  function addWire(a, b, { sag = 2.0, color = 0x2a2a2a } = {}) {
    const mid = a.clone().lerp(b, 0.5);
    mid.y -= sag;
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const points = curve.getPoints(24);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color });
    const line = new THREE.Line(geometry, material);
    site.add(line);
  }

  function connectTowers(a, b) {
    for (let i = 0; i < 3; i += 1) {
      addWire(worldPoint(a, a.hooks.mid[i]), worldPoint(b, b.hooks.mid[i]), { sag: 2.4 });
    }
    for (let i = 0; i < 2; i += 1) {
      addWire(worldPoint(a, a.hooks.top[i]), worldPoint(b, b.hooks.top[i]), { sag: 1.6, color: 0x333333 });
    }
  }

  connectTowers(towerDescriptors[0], towerDescriptors[1]);
  connectTowers(towerDescriptors[1], towerDescriptors[2]);
  addWire(new THREE.Vector3(88, 6.2, -35), worldPoint(towerDescriptors[0], towerDescriptors[0].hooks.mid[1]), { sag: 1.8 });
}

function addInstancedLamps() {
  const lampPositions = [];
  for (let x = -90; x <= 20; x += 18) {
    lampPositions.push(x);
  }

  createInstancedMesh({
    geometry: new THREE.CylinderGeometry(0.12, 0.18, 6.5, 12),
    material: materials.metal,
    parent: site,
    transforms: lampPositions.map((x) => ({ position: [x, 3.25, -40] })),
  });
  createInstancedMesh({
    geometry: new THREE.BoxGeometry(1.8, 0.12, 0.12),
    material: materials.metal,
    parent: site,
    transforms: lampPositions.map((x) => ({ position: [x + 0.9, 6.2, -40] })),
  });
  createInstancedMesh({
    geometry: new THREE.SphereGeometry(0.22, 16, 12),
    material: materials.lampGlow,
    parent: site,
    castShadow: false,
    receiveShadow: false,
    transforms: lampPositions.map((x) => ({ position: [x + 1.7, 6.2, -40] })),
  });

  lampPositions.forEach((x) => {
    const light = new THREE.PointLight(0xfff1c2, 0.6, 18, 2);
    light.position.set(x + 1.7, 6.2, -40);
    site.add(light);
  });
}

addAdminBuilding(-55, -5);
addWarehouse(-50, -55);
addSubstation(78, -42);
addTransmissionLine();
addRectFenceInstanced(site, materials, { cx: -5, cz: -20, w: 150, d: 110, h: 2.2 });
addInstancedLamps();

const labelLayer = new THREE.Group();
scene.add(labelLayer);
addLabels(labelLayer, [
  { html: 'Корпус реактора', position: labelAnchors.reactor },
  { html: 'Градирні', position: labelAnchors.coolingTowers },
  { html: 'Машинний зал', position: labelAnchors.turbineHall },
  { html: 'Підстанція<br/><small>трансформатори</small>', position: [78, 9, -42] },
  { html: 'Адмінкорпус', position: [-55, 11, -5] },
  { html: 'Склад', position: [-50, 10, -55] },
  { html: 'ЛЕП / опори', position: [125, 25, -50] },
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
