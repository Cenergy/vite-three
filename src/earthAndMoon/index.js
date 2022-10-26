import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer";

import "./style.css";

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
camera.position.set(-5, 6, -10);
const scene = new THREE.Scene();

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(-5, 6, -10);
scene.add(dirLight);
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);

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

// 创建曲线
const curve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-10, 0, 10),
    new THREE.Vector3(-5, 5, 5),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(5, -5, 5),
    new THREE.Vector3(10, 0, 10),
  ],
  true
);

const points = curve.getPoints(500);
const geometry = new THREE.BufferGeometry().setFromPoints(points);

const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

// Create the final object to add to the scene
const curveObject = new THREE.Line(geometry, material);
scene.add(curveObject);

const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16);
const earthMaterial = new THREE.MeshPhongMaterial({
  shininess: 5,
  map: textureLoader.load("/textures/planets/earth_atmos_2048.jpg"),
  specularMap: textureLoader.load("/textures/planets/earth_specular_2048.jpg"),
  normalMap: textureLoader.load("/textures/planets/earth_normal_2048.jpg"),
  normalScale: new THREE.Vector2(0.85, 0.85),
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
labelRenderer.domElement.style.left = "0px";
labelRenderer.domElement.style.color = "#fff";
document.body.appendChild(labelRenderer.domElement);

const orbitControls = new OrbitControls(camera, labelRenderer.domElement);

window.addEventListener("resize", () => {
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

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

// 中国标签
const chinaDiv = document.createElement("div");
chinaDiv.className = "label";
chinaDiv.textContent = "China";
const chinaLabel = new CSS2DObject(chinaDiv);
chinaLabel.position.set(-0.75, 1.5, -EARTH_RADIUS + 0.5);
earth.add(chinaLabel);

// 射线
const rayCaster = new THREE.Raycaster();

function render() {
  const time = clock.getElapsedTime();
  const point = curve.getPoint((time / 10) % 1);
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  moon.position.set(Math.sin(time) * 5, 0, Math.cos(time) * 5);
  // moon.position.set(point.x,point.y,point.z);
  // moon.position.copy(point);
  // camera.position.copy(point);
  camera.lookAt(earth.position);
  // earth.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 1000);

  const chinaLabelPosition = chinaLabel.position.clone();
  // 向量(坐标)从世界空间投影到相机的标准化设备坐标 (NDC) 空间。
  chinaLabelPosition.project(camera);
  rayCaster.setFromCamera(chinaLabelPosition, camera);

  // 计算出标签跟摄像机的距离
  const labelDistance = chinaLabel.position.distanceTo(camera.position);
  const intersects = rayCaster.intersectObjects(scene.children, true);

  if (intersects.length===0) {
    chinaLabel.element.style.display = "block";
  } else {
    const minDistance = intersects[0].distance;
    if (minDistance < labelDistance) {
      chinaLabel.element.style.display = "none";
    } else {
      chinaLabel.element.style.display = "block";
    }
  }

  requestAnimationFrame(render);
}
render();

export default {};
