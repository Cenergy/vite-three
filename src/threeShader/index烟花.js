import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import vertexShader from "./shaders/firework/vertex.glsl";
import fragmentShader from "./shaders/firework/fragment.glsl";
import Fireworks from "./shaders/firework/firework";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import gsap from "gsap";

// 烟花

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 0, 5);
scene.add(camera);

const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync("/textures/hdr/2k.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
});

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.3;

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// 添加坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// plane.rotation.x = -Math.PI / 2;

// scene.add(plane);
const clock = new THREE.Clock();

// 管理烟花
const fireworks = [];
// 设置创建烟花函数
let createFireworks = () => {
  let color = `hsl(${Math.floor(Math.random() * 360)},100%,80%)`;
  let position = {
    x: (Math.random() - 0.5) * 40,
    z: -(Math.random() - 0.5) * 40,
    y: 3 + Math.random() * 15,
  };

  // 随机生成颜色和烟花放的位置
  let firework = new Fireworks(color, position);
  console.log(
    "🚀 ~ file: index.js ~ line 108 ~ createFireworks ~ firework",
    firework
  );
  firework.addScene(scene, camera);
  fireworks.push(firework);
};

function render(params) {
  renderer.render(scene, camera);
  fireworks.forEach((fw) => fw.update());
  requestAnimationFrame(render);
}

render();

document.addEventListener("click", createFireworks);

export default {};
