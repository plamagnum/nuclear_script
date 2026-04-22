import * as THREE from 'three';
import { createInstancedMesh } from '../common/instancing.js';

export function addMesh(parent, geometry, material, position, {
  castShadow = true,
  receiveShadow = true,
  rotation = null,
} = {}) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  if (rotation) {
    mesh.rotation.set(...rotation);
  }
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  parent.add(mesh);
  return mesh;
}

export function addGroup(parent, position) {
  const group = new THREE.Group();
  group.position.set(...position);
  parent.add(group);
  return group;
}

export function addRectFenceInstanced(parent, materials, { cx = 0, cz = 0, w, d, h = 2, t = 0.15 }) {
  createInstancedMesh({
    geometry: new THREE.BoxGeometry(w, h, t),
    material: materials.fence,
    parent,
    transforms: [
      { position: [cx, h / 2, cz + d / 2] },
      { position: [cx, h / 2, cz - d / 2] },
    ],
  });

  createInstancedMesh({
    geometry: new THREE.BoxGeometry(d, h, t),
    material: materials.fence,
    parent,
    transforms: [
      { position: [cx + w / 2, h / 2, cz], rotation: [0, Math.PI / 2, 0] },
      { position: [cx - w / 2, h / 2, cz], rotation: [0, Math.PI / 2, 0] },
    ],
  });
}

export function addBasePlant(parent, materials) {
  addMesh(parent, new THREE.CylinderGeometry(7, 7, 20, 48), materials.concrete, [0, 10, 0]);
  addMesh(parent, new THREE.SphereGeometry(7, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), materials.dome, [0, 20, 0]);

  function createCoolingTower(x, z) {
    const points = [];
    for (let i = 0; i <= 30; i += 1) {
      const t = i / 30;
      const y = t * 28;
      const r = 6 - 3.5 * Math.sin(t * Math.PI * 0.7) + t * 2.5;
      points.push(new THREE.Vector2(r, y));
    }

    const tower = new THREE.Mesh(new THREE.LatheGeometry(points, 48), materials.concrete);
    tower.position.set(x, 0, z);
    tower.castShadow = true;
    tower.receiveShadow = true;
    parent.add(tower);

    const steam = addMesh(parent, new THREE.SphereGeometry(4.5, 24, 16), materials.steam, [x, 30, z], {
      castShadow: false,
      receiveShadow: false,
    });
    const steam2 = addMesh(parent, new THREE.SphereGeometry(3.5, 24, 16), materials.steam, [x + 1.5, 34, z], {
      castShadow: false,
      receiveShadow: false,
    });

    return { tower, steam, steam2 };
  }

  const towerA = createCoolingTower(30, 0);
  const towerB = createCoolingTower(30, -22);

  addMesh(parent, new THREE.BoxGeometry(16, 10, 12), materials.concrete, [-14, 5, 0]);
  addMesh(parent, new THREE.BoxGeometry(17, 0.6, 13), materials.dark, [-14, 10.3, 0]);

  addMesh(parent, new THREE.CylinderGeometry(0.8, 1, 30, 24), materials.dark, [-14, 15, 8]);
  addMesh(parent, new THREE.CylinderGeometry(1.05, 1.05, 1.5, 24), materials.red, [-14, 28, 8]);
  addMesh(parent, new THREE.CylinderGeometry(1.05, 1.05, 1.5, 24), materials.red, [-14, 22, 8]);

  addMesh(parent, new THREE.BoxGeometry(20, 0.4, 10), materials.water, [30, 0.2, 14], { castShadow: false });
  addMesh(parent, new THREE.BoxGeometry(6, 5, 6), materials.concrete, [-6, 2.5, -12]);
  addMesh(parent, new THREE.BoxGeometry(6, 5, 4), materials.concrete, [6, 2.5, -12]);

  function addPipe(from, to, radius = 0.3) {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const direction = end.clone().sub(start);
    const length = direction.length();

    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 12), materials.dark);
    pipe.position.copy(start.clone().add(direction.clone().multiplyScalar(0.5)));
    pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    pipe.castShadow = true;
    parent.add(pipe);
  }

  addPipe([7, 6, 0], [-6, 6, 0]);
  addPipe([7, 4, 0], [20, 4, 0]);

  return {
    towerA,
    towerB,
    labelAnchors: {
      reactor: [0, 22, 0],
      coolingTowers: [30, 21, -10],
      turbineHall: [-14, 12, 0],
      chimney: [-14, 30, 8],
      coolingPond: [30, 2.5, 14],
      supportBuildings: [0, 6.5, -12],
    },
  };
}
