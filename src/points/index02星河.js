import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const { BufferGeometry, Float32BufferAttribute } = THREE;

const scene = new THREE.Scene();
const gui = new dat.GUI();
const textureLoader = new THREE.TextureLoader();

// 目标:粒子效果打造星河

const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let index = 0; index < count * 3; index++) {
  positions[index] = Math.random() * 10 - 5;
  colors[index] = Math.random();
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const material = new THREE.PointsMaterial({
  size: 0.1,
  map: textureLoader.load("/textures/particles/5.png"),
  depthWrite: false,
  blending: THREE.AdditiveBlending, // 叠加算法
  transparent: true,
  vertexColors: true, // 启用顶点颜色
});
// 相机随深度而衰减
material.sizeAttenuation = true;
const sphere = new THREE.Points(particlesGeometry, material);
scene.add(sphere);

// 添加光
const light = new THREE.AmbientLight(0xffffff, 0.5);

const smallBall = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.05, 20, 20),
  new THREE.MeshBasicMaterial({ color: "red" })
);
light.position.set(5, 5, 5);
smallBall.position.set(2, 2, 2);

// 直线光
const pointLight = new THREE.PointLight(0xffffff, 1);
// pointLight.position.set(2, 2, 2);
scene.add(pointLight);
// 设置光照投射阴影
pointLight.castShadow = true;
// 设置阴影贴图模糊度
pointLight.shadow.radius = 20;
// 设置阴影贴图的分辨率
pointLight.shadow.mapSize.set(2048, 2048);
smallBall.add(pointLight);
scene.add(smallBall);

pointLight.angle = Math.PI / 6;
pointLight.distance = 0;
pointLight.decay = 0;

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 0, 10);

gui.add(sphere.position, "x").min(-20).max(20).step(0.1);
gui.add(pointLight, "angle").min(0).max(Math.PI).step(0.1);
gui.add(pointLight, "distance").min(10).max(20).step(0.1);
gui.add(pointLight, "decay").min(0).max(5).step(0.1);

const render = new THREE.WebGLRenderer();
render.setSize(window.innerWidth, window.innerHeight);

// 开启对阴影的渲染
render.shadowMap.enabled = true;
render.physicallyCorrectLights = true;

document.body.appendChild(render.domElement);

// 添加坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 创建轨道控制器
const controls = new OrbitControls(camera, render.domElement);
const clock = new THREE.Clock();

function renderScene() {
  const time = clock.getElapsedTime();
  smallBall.position.x = Math.sin(time) * 3;
  smallBall.position.z = Math.cos(time) * 3;
  render.render(scene, camera);
  controls.update();

  requestAnimationFrame(renderScene);
}
renderScene();

export default THREE;
