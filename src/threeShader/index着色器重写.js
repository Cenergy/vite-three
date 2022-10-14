import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import gsap from "gsap";

// 着色器加工

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 0, 5);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// 添加坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const planeGeometry = new THREE.PlaneGeometry(1, 1, 20, 20);
const planeMaterial = new THREE.MeshBasicMaterial({ color: "red" });

const basicMaterialUniforms = {
  uTime: {
    value: 0,
  },
};

planeMaterial.onBeforeCompile = (shader, renderer) => {
  console.log("🚀 ~ file: index.js ~ line 32 ~ shader", shader.vertexShader);
  shader.uniforms.uTime = basicMaterialUniforms.uTime;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `#include <common>
    uniform float uTime;
    `
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `#include <begin_vertex>
    transformed.x+=sin(uTime)*2.0;
    transformed.z+=cos(uTime)*2.0;
    `
  );
};

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// plane.rotation.x = -Math.PI / 2;

// scene.add(plane);
const clock = new THREE.Clock();

function render(params) {
  renderer.render(scene, camera);
  const elapsedTime = clock.getElapsedTime();
  basicMaterialUniforms.uTime.value = elapsedTime;
  requestAnimationFrame(render);
}

render();

export default {};
