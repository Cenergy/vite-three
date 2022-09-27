import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import vertexShader from "./shaders/water/vertex.glsl";
import fragmentShader from "./shaders/water/fragment.glsl";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { Water } from "three/examples/jsm/objects/Water2";

import gsap from "gsap";

// 澡盆

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 3, 5);
scene.add(camera);

const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync("/textures/hdr/2k.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
});

const gltfLoader = new GLTFLoader();

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// 添加坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const planeGeometry = new THREE.PlaneGeometry(1, 1, 64, 64);
// const planeMaterial = new THREE.MeshBasicMaterial({ color: "red" });

gltfLoader.load("/model/yugang.glb", (gltf) => {
  const [yugang, waterObject] = gltf.scene.children;
  const waterGeometry = waterObject.geometry;
  yugang.material.side = THREE.DoubleSide;

  const water = new Water(waterGeometry, {
    textureHeight: 1024,
    textureWidth: 1024,
    color: 0xeeeeff,
    flowDirection: new THREE.Vector2(1, 1),
    scale: 1,
  });
  
  scene.add(gltf.scene);
  scene.add(water);
});

// 创建着色器材质;
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {},
  side: THREE.DoubleSide,
  //   transparent: true,
});

const clock = new THREE.Clock();

function render(params) {
  const elapsedTime = clock.getElapsedTime();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

export default {};
