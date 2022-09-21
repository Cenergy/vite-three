import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import vertexShader from "./shaders/deep/vertex.glsl";
import fragmentShader from "./shaders/deep/fragment.glsl";

// 使用deep中的着色器

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 5);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// 添加坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/ca.jpeg");

const planeGeometry = new THREE.PlaneGeometry(1, 1, 64, 64);
// const planeMaterial = new THREE.MeshBasicMaterial({ color: "red" });
const planeMaterial = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  // wireframe: true,
  side: THREE.DoubleSide,
  transparent: true,
  uniforms: {
    uTime: {
      value: 0,
    },
    uTexture: {
      value: texture,
    },
  },
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.rotation.x = -Math.PI / 2;

scene.add(plane);
const clock = new THREE.Clock();

function render(params) {
  const elapsedTime = clock.getElapsedTime();
  planeMaterial.uniforms.uTime.value = elapsedTime;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

export default {};
