import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
console.log("🚀 ~ file: index.js ~ line 3 ~ OrbitControls", OrbitControls);

const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 0, 10);

const render = new THREE.WebGLRenderer();
render.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(render.domElement);

// 添加坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 创建轨道控制器
const controls = new OrbitControls(camera, render.domElement);

function renderScene() {
  render.render(scene, camera);
  requestAnimationFrame(renderScene);
}
renderScene();

export default THREE;
