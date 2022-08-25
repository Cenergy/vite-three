import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const { BufferGeometry, Float32BufferAttribute } = THREE;

const scene = new THREE.Scene();
const gui = new dat.GUI();

// 目标:加载HDR环境图
const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync("/textures/hdr/002.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
  console.log(
    "🚀 ~ file: index.js ~ line 18 ~ rgbeLoader.loadAsync ~ texture",
    texture
  );
});

const cubeTextureLoader = new THREE.CubeTextureLoader();
const envTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/1/px.jpg",
  "/textures/environmentMaps/1/nx.jpg",
  "/textures/environmentMaps/1/py.jpg",
  "/textures/environmentMaps/1/ny.jpg",
  "/textures/environmentMaps/1/pz.jpg",
  "/textures/environmentMaps/1/nz.jpg",
]);
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.1,
  // envMap: envTexture,
});
const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);

// scene.background = envTexture;
// scene.environment = envTexture;

// 添加光
const light = new THREE.AmbientLight({ color: "#404040" });
scene.add(light);
// 直线光
const directLight = new THREE.DirectionalLight(0xffffff, 0.5);
directLight.position.set(10, 10, 10);
scene.add(directLight);

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
