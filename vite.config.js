import glsl from "vite-plugin-glsl";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue(), glsl()],
});
