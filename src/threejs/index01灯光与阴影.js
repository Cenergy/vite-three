import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const { BufferGeometry, Float32BufferAttribute } = THREE;

const scene = new THREE.Scene();
const gui = new dat.GUI();

// 目标:灯光与阴影
// 1、材质要满足对光照有反应
// 2、设置渲染器开启阴影的计算 render.shadowMap.enabled=true
// 3、设置光照投射阴影 directionLight.castShadow=true
// 4、设置物体投射阴影sphere.castShadow=true
// 5、设置物体接收阴影 plane.receiveShadow=true

const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);
// 设置物体投射阴影
sphere.castShadow = true;

const planeGeometry = new THREE.PlaneBufferGeometry(20, 20);
const plane = new THREE.Mesh(planeGeometry, material);
plane.rotation.x = -Math.PI / 2;
plane.position.set(0, -1, 0);
scene.add(plane);
// 设置接收投射阴影
plane.receiveShadow = true;

// 添加光
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);
// 直线光
const directLight = new THREE.DirectionalLight(0xffffff, 0.5);
directLight.position.set(10, 10, 10);
scene.add(directLight);
// 设置光照投射阴影
directLight.castShadow = true;

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 0, 10);

const render = new THREE.WebGLRenderer();
render.setSize(window.innerWidth, window.innerHeight);

// 开启对阴影的渲染
render.shadowMap.enabled = true;

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
