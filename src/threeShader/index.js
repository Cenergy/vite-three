import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
// 目标：合成效果

//创建gui对象
const gui = new dat.GUI();

// console.log(THREE);
// 初始化场景
const scene = new THREE.Scene();

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerHeight / window.innerHeight,
  1,
  50
);
// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.position.set(0, 0, 3);
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 加载纹理

// 创建纹理加载器对象
const textureLoader = new THREE.TextureLoader();

// 添加环境纹理
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

const directionLight = new THREE.DirectionalLight("#ffffff", 1);
directionLight.castShadow = true;
directionLight.position.set(0, 0, 200);
scene.add(directionLight);

scene.environment = envMapTexture;
scene.background = envMapTexture;

// 加载模型纹理
const modelTexture = textureLoader.load("/models/DamagedHelmet/color.jpg");
// 加载模型的法向纹理
const normalTexture = textureLoader.load(
  "/models/DamagedHelmet/Default_normal.jpg"
);

// 模型加载
const gltfLoader = new GLTFLoader();

gltfLoader.load("/models/DamagedHelmet/DamagedHelmet.gltf", (gltf) => {
  const mesh = gltf.scene.children[0];
  // 设定自定义的深度材质
  scene.add(mesh);
});

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// 合成器
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(window.innerWidth, window.innerHeight);

// 添加渲染通道
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const sMAAPass = new SMAAPass();

effectComposer.addPass(sMAAPass);

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener("resize", () => {
  //   console.log("resize");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
});

// 将渲染器添加到body
document.body.appendChild(renderer.domElement);

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置自动旋转
// controls.autoRotate = true;

const clock = new THREE.Clock();
function animate(t) {
  controls.update();
  const time = clock.getElapsedTime();
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  // renderer.render(scene, camera);
  effectComposer.render();
}

animate();

export default {};
