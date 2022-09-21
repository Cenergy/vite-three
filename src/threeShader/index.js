import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import vertexShader from "./shaders/flyLight/vertex.glsl";
import fragmentShader from "./shaders/flyLight/fragment.glsl";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import gsap from "gsap";

// 使用deep中的着色器

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 0, 5);
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
renderer.toneMappingExposure = 0.2;

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

// 创建着色器材质;
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {},
  side: THREE.DoubleSide,
  //   transparent: true,
});

gltfLoader.load("/model/flyLight.glb", (gltf) => {
  // scene.add(gltf.scene);
  const lightBox = gltf.scene.children[1];
  lightBox.material = shaderMaterial;
  const group = new THREE.Group();

  for (let i = 0; i < 150; i++) {
    let flyLight = gltf.scene.clone(true);
    let x = (Math.random() - 0.5) * 300;
    let z = (Math.random() - 0.5) * 300;
    let y = Math.random() * 60 + 25;
    flyLight.position.set(x, y, z);
    gsap.to(flyLight.rotation, {
      y: 2 * Math.PI,
      duration: 10 + Math.random() * 30,
      repeat: -1,
    });
    gsap.to(flyLight.position, {
      x: "+=" + Math.random() * 5,
      y: "+=" + Math.random() * 20,
      yoyo: true,
      duration: 5 + Math.random() * 10,
      repeat: -1,
    });
    group.add(flyLight);
  }
  scene.add(group);

});

const plane = new THREE.Mesh(planeGeometry, shaderMaterial);
// plane.rotation.x = -Math.PI / 2;

// scene.add(plane);
const clock = new THREE.Clock();

function render(params) {
  const elapsedTime = clock.getElapsedTime();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

export default {};
