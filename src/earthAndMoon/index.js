import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer";

const clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();
const EARTH_RADIUS = 2.5;
const MOON_RADIUS = 0.27;

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / innerHeight,
  0.1,
  200
);
camera.position.set(10, 5, 20);
const scene = new THREE.Scene();

const dirLight = new THREE.SpotLight(0xffffff, 2);
dirLight.position.set(0, 0, 10);
dirLight.castShadow = true;
scene.add(dirLight);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);

const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16);
const moonMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load("/door.png"),
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16);
const earthMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load("/textures/sky.jpg"),
});
const erath = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(erath);

const orbitControls = new OrbitControls(camera, renderer.domElement);

function render() {
  const time = clock.getElapsedTime();
  renderer.render(scene, camera);
  moon.position.set(Math.sin(time) * 5, 0, Math.cos(time) * 5);
  erath.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 1000);
  requestAnimationFrame(render);
}
render();

export default {};
