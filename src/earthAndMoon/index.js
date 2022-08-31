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

const renderer = new THREE.WebGLRenderer({
  alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);

const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16);
const moonMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load("/textures/planets/moon_1024.jpg"),
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16);
const earthMaterial = new THREE.MeshPhongMaterial({
  shininess: 5,
  map: textureLoader.load("/textures/planets/earth_atmos_2048.jpg"),
  specularMap: textureLoader.load("/textures/planets/earth_specular_2048.jpg"),
  normalMap: textureLoader.load("/textures/planets/earth_normal_2048.jpg"),
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.receiveShadow = true;
moon.castShadow = true;
moon.receiveShadow = true;
earth.castShadow = true;
scene.add(earth);

renderer.domElement.style.backgroundImage = "url(/textures/starts.jpg)";
renderer.domElement.style.backgroundSize = "cover";

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.left = "205px";
labelRenderer.domElement.style.color = "#fff";
document.body.appendChild(labelRenderer.domElement);

const orbitControls = new OrbitControls(camera, labelRenderer.domElement);
function render() {
  const time = clock.getElapsedTime();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  moon.position.set(Math.sin(time) * 5, 0, Math.cos(time) * 5);
  earth.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 1000);
  requestAnimationFrame(render);
}
render();

// 创建标签

const earthDiv = document.createElement("div");
earthDiv.className = "label";
earthDiv.innerHTML = "<h1>Earth</h1>";
earthDiv.style.marginTop = "-1em";
const earthLabel = new CSS2DObject(earthDiv);
earthLabel.position.set(0, EARTH_RADIUS, 0);
earth.add(earthLabel);

const moonDiv = document.createElement("div");
moonDiv.className = "label";
moonDiv.textContent = "Moon";
moonDiv.style.marginTop = "-1em";
const moonLabel = new CSS2DObject(moonDiv);
moonLabel.position.set(0, MOON_RADIUS, 0);
moon.add(moonLabel);

export default {};
