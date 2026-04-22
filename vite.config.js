import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        plantBasic: resolve(__dirname, 'plant-basic.html'),
        plantExtended: resolve(__dirname, 'plant-extended.html'),
        reactorCutaway: resolve(__dirname, 'reactor-cutaway.html'),
        thermalPlant: resolve(__dirname, 'thermal-plant.html'),
        solarPlant: resolve(__dirname, 'solar-plant.html'),
        hydroPlant: resolve(__dirname, 'hydro-plant.html'),
      },
    },
  },
});
