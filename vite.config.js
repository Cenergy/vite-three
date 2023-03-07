import glsl from "vite-plugin-glsl";
import vue from "@vitejs/plugin-vue";
import cesium from 'vite-plugin-cesium';

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue(), glsl(),cesium()],
});
