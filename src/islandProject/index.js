import * as THREE from "three";
import Stats from "stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Water } from "three/examples/jsm/objects/Water2";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// 初始化场景
const scene = new THREE.Scene();

// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
// 设置相机的位置
camera.position.set(-50, 50, 130);

// 更新摄像头的宽高比例
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头的投影矩阵
camera.updateProjectionMatrix();
// scene.add(camera);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
  // 使用对数深度缓冲区
  logarithmicDepthBuffer: true,
});
renderer.outputEncoding = THREE.sRGBEncoding;
// 设置渲染器的宽高
renderer.setSize(window.innerWidth, window.innerHeight);
// 监听屏幕的大小变化，修改渲染器的宽高和相机的比例
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像头的投影矩阵
  camera.updateProjectionMatrix();
});
document.body.appendChild(renderer.domElement);

// const sphereGeometry = new THREE.SphereBufferGeometry(2, 20, 20);
// const material = new THREE.MeshBasicMaterial({
//   color: "green",
// });
// const sphere = new THREE.Mesh(sphereGeometry, material);
// sphere.position.set(1, 1, 1);
// scene.add(sphere);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
ambientLight.position.set(5, 5, 5);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);
// 添加坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function runStart() {
  const stats = new Stats();
  document.body.appendChild(stats.dom);
  function render() {
    // 渲染场景
    renderer.render(scene, camera);
    controls.update();
    stats.update(); //更新性能检测框
    requestAnimationFrame(render);
  }
  render();
}

runStart();

// 添加平面

// const planeGeometry = new THREE.PlaneGeometry(100, 100);
// const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.rotation.x = -Math.PI / 2;
// scene.add(plane);

// 创建一个巨大的天空球体
let texture = new THREE.TextureLoader().load("/textures/sky.jpg");
const skyGeometry = new THREE.SphereGeometry(1000, 60, 60);
const skyMaterial = new THREE.MeshBasicMaterial({
  map: texture,
});
skyGeometry.scale(1, 1, -1);
const sky = new THREE.Mesh(skyGeometry, skyMaterial);

scene.add(sky);

// 视频纹理
// const video = document.createElement("video");
// video.src = "/textures/sky.mp4";
// video.loop = true;

const waterGeometry = new THREE.CircleBufferGeometry(200, 32);
const water = new Water(waterGeometry, {
  textureHeight: 1024,
  textureWidth: 1024,
  color: 0xeeeeff,
  flowDirection: new THREE.Vector2(1, 1),
  scale: 1,
});
water.position.y = 3;
water.rotation.x = -Math.PI / 2;
scene.add(water);

// 添加小岛
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("/model/island2.glb", (gltf) => {
  scene.add(gltf.scene);
});

// const hdrLoader = new RGBELoader();
// hdrLoader.loadAsync("/textures/hdr/050.hdr", (texture) => {
//   texture.mapping = THREE.EquirectangularReflectionMapping;
//   scene.environment = texture;
//   scene.background = texture;
// });

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-100, 100, 10);
scene.add(light);

// window.addEventListener("click", () => {
//   if (video.paused) {
//     video.play();
//     skyMaterial.map = new THREE.VideoTexture(video);
//     skyMaterial.map.needsUpdate = true;
//   }
// });

export default THREE;
