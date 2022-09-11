import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import vertexShader from "./shaders/basic/vertex.glsl";
import fragmentShader from "./shaders/basic/fragment.glsl";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(30, 40, 50);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// 添加坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const planeGeometry = new THREE.PlaneGeometry(1, 1, 64, 64);
// const planeMaterial = new THREE.MeshBasicMaterial({ color: "red" });
const planeMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.rotation.x = -Math.PI / 2;

scene.add(plane);

function render(params) {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

export default {};
