import * as THREE from 'three';

export function createPlantMaterials() {
  return {
    concrete: new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9 }),
    dome: new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.6 }),
    red: new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.7 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.85 }),
    green: new THREE.MeshStandardMaterial({ color: 0x3a7d44, roughness: 1.0 }),
    water: new THREE.MeshStandardMaterial({
      color: 0x3399ff,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.7,
    }),
    steam: new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }),
    asphalt: new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 1.0 }),
    roadLine: new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.4 }),
    fence: new THREE.MeshStandardMaterial({ color: 0x2f2f2f, roughness: 0.9 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x7a7a7a, roughness: 0.45, metalness: 0.4 }),
    copper: new THREE.MeshStandardMaterial({ color: 0xb87333, roughness: 0.4, metalness: 0.55 }),
    glass: new THREE.MeshStandardMaterial({
      color: 0x2f6fa3,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.65,
    }),
    adminBody: new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.9 }),
    warehouseBody: new THREE.MeshStandardMaterial({ color: 0xcfc9bf, roughness: 0.95 }),
    warehouseRoof: new THREE.MeshStandardMaterial({ color: 0x6a6a6a, roughness: 0.85 }),
    door: new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.9 }),
    gravel: new THREE.MeshStandardMaterial({ color: 0xb9b2a7, roughness: 1.0 }),
    insulator: new THREE.MeshStandardMaterial({ color: 0xf0efe9, roughness: 0.95 }),
    lineSteel: new THREE.MeshStandardMaterial({ color: 0x606060, roughness: 0.65, metalness: 0.25 }),
    gantry: new THREE.MeshStandardMaterial({ color: 0x6f6f6f, roughness: 0.6, metalness: 0.2 }),
    lampGlow: new THREE.MeshStandardMaterial({
      color: 0xfff1c2,
      emissive: 0xffe0a0,
      emissiveIntensity: 0.6,
    }),
  };
}

export function createReactorMaterials() {
  return {
    ground: new THREE.MeshStandardMaterial({ color: 0x11172f, roughness: 1 }),
    steel: new THREE.MeshStandardMaterial({ color: 0x8a8f95, roughness: 0.55, metalness: 0.35 }),
    inner: new THREE.MeshStandardMaterial({ color: 0x6f7378, roughness: 0.75, metalness: 0.15 }),
    water: new THREE.MeshStandardMaterial({
      color: 0x2d7dd2,
      roughness: 0.15,
      metalness: 0.05,
      transparent: true,
      opacity: 0.55,
    }),
    fuel: new THREE.MeshStandardMaterial({ color: 0x2d2d2d, roughness: 0.92 }),
    rod: new THREE.MeshStandardMaterial({ color: 0xb3b3b3, roughness: 0.45, metalness: 0.2 }),
    core: new THREE.MeshStandardMaterial({ color: 0x3b3b3b, roughness: 0.95 }),
    cut: new THREE.MeshStandardMaterial({ color: 0xffc857, roughness: 0.8 }),
  };
}
