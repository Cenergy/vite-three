import * as THREE from "three";

// 初始化场景
const scene = new THREE.Scene();

// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 设置相机的位置
camera.position.set(-50, 50, 130);

// 更新摄像头的宽高比例
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
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

function render() {
  // 渲染场景
  renderer.render(camera, camera);
  requestAnimationFrame(render);
}
render();

export default THREE;
