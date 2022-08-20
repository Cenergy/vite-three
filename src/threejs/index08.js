import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
import * as dat from "dat.gui";

const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

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

mesh.rotation.set(Math.PI / 4, 0, 0, "XZY");
mesh.scale.set(3, 1, 1);

const clock = new THREE.Clock();

// 设置动画
// gsap.to(mesh.position, {
//   x: 5,
//   duration: 5,
//   ease: "power1.inOut",
//   // 设置重复的次数
//   repeat: -1,
//   // 往返的运动
//   yoyo: true,
//   // 延迟时间
//   delay: 2,
//   onComplete: () => {
//     console.log("🚀 ~ file: index.js ~ line 47 ~ 动画 onComplete");
//   },
// });
// gsap.to(mesh.rotation, { x: 2 * Math.PI, duration: 5, repeat: -1 });
function renderScene() {
  render.render(scene, camera);

  requestAnimationFrame(renderScene);
}
renderScene();

const gui = new dat.GUI();
gui.add(mesh.position, "x").min(0).max(5).step(0.01).name("设置X值");
gui
  .addColor({ color: "#00ff00" }, "color")
  .onChange((value) => {
    mesh.material.color.set(value);
    console.log("🚀 ~ file: index.js ~ line 65 ~ gui.addColor ~ value", value);
  })
  .name("颜色设置");
gui.add(mesh, "visible").name("是否显示");
gui
  .add(
    {
      fun: () => {
        gsap.to(mesh.rotation, { x: 2 * Math.PI, duration: 5, repeat: -1 });
      },
    },
    "fun"
  )
  .name("开始旋转");

export default THREE;
