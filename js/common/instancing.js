import * as THREE from 'three';

const dummy = new THREE.Object3D();

export function createInstancedMesh({
  geometry,
  material,
  transforms,
  parent,
  castShadow = true,
  receiveShadow = true,
}) {
  const mesh = new THREE.InstancedMesh(geometry, material, transforms.length);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;

  transforms.forEach((transform, index) => {
    if (transform.matrix) {
      mesh.setMatrixAt(index, transform.matrix);
      return;
    }

    dummy.position.set(...(transform.position ?? [0, 0, 0]));
    dummy.rotation.set(...(transform.rotation ?? [0, 0, 0]));
    dummy.scale.set(...(transform.scale ?? [1, 1, 1]));
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  });

  mesh.instanceMatrix.needsUpdate = true;
  parent?.add(mesh);
  return mesh;
}
