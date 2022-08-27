import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const { BufferGeometry, Float32BufferAttribute } = THREE;

const scene = new THREE.Scene();
const gui = new dat.GUI();

// 目标:点光源
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

const planeGeometry = new THREE.PlaneBufferGeometry(50, 50);
const plane = new THREE.Mesh(planeGeometry, material);
plane.rotation.x = -Math.PI / 2;
plane.position.set(0, -1, 0);
scene.add(plane);
// 设置接收投射阴影
plane.receiveShadow = true;

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

// 设置平行光相机投射相机的属性
// directLight.shadow.camera.near = 0.5;
// directLight.shadow.camera.far = 500;
// directLight.shadow.camera.top = 5;
// directLight.shadow.camera.bottom = -5;
// directLight.shadow.camera.right = 5;
// directLight.shadow.camera.left = -5;

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
