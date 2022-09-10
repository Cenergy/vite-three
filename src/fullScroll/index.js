import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";

// 目标：raycaster

const div = document.createElement("div");
div.innerHTML = `
    <div class="page page0">
      <h1>Ray投射光线</h1>
      <h3>THREE.Raycaster实现3d交互效果</h3>
    </div>
    <div class="page page1">
      <h1>THREE.BufferGeometry！</h1>
      <h3>应用打造酷炫的三角形</h3>
    </div>
    <div class="page page2">
      <h1>活泼点光源</h1>
      <h3>点光源围绕照亮小球</h3>
    </div>
`;

document.body.appendChild(div);

const gui = new dat.GUI();
// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);
camera.position.set(0, 0, 18);

const cubeGeometry = new THREE.BoxBufferGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
});
const redMaterial = new THREE.MeshBasicMaterial({
  color: "#ff0000",
});

let cubeArr = [];
let cubeGroup = new THREE.Group();
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    for (let z = 0; z < 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.set(i * 2 - 4, j * 2 - 4, z * 2 - 4);
      cubeGroup.add(cube);
      cubeArr.push(cube);
    }
  }
}

scene.add(cubeGroup);

// 创建三角形酷炫物体
// 添加物体
// 创建几何体
const sjxGroup = new THREE.Group();
for (let i = 0; i < 50; i++) {
  // 每一个三角形，需要3个顶点，每个顶点需要3个值
  const geometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(9);
  for (let j = 0; j < 9; j++) {
    if (j % 3 === 1) {
      positionArray[j] = Math.random() * 10 - 5;
    } else {
      positionArray[j] = Math.random() * 10 - 5;
    }
  }
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );
  let color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  // 根据几何体和材质创建物体
  let sjxMesh = new THREE.Mesh(geometry, material);
  //   console.log(mesh);
  sjxGroup.add(sjxMesh);
}
sjxGroup.position.set(0, -30, 0);
scene.add(sjxGroup);

// ----------------------------------------------------------------

const sphereGroup = new THREE.Group();
const sphereGeometry = new THREE.SphereGeometry();
const sphereMaterial = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;

const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 接收阴影
plane.receiveShadow = true;

sphereGroup.add(plane);
sphereGroup.add(sphere);

scene.add(sphereGroup);

// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
sphereGroup.add(light);

const smallBall = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
smallBall.position.set(2, 2, 2);
//直线光源
const pointLight = new THREE.PointLight(0xff0000, 3);
// pointLight.position.set(2, 2, 2);
pointLight.castShadow = true;

// 设置阴影贴图模糊度
pointLight.shadow.radius = 20;
// 设置阴影贴图的分辨率
pointLight.shadow.mapSize.set(512, 512);

// 设置透视相机的属性
smallBall.add(pointLight);
sphereGroup.add(smallBall);

sphereGroup.position.set(0, -60, 0);
scene.add(sphereGroup);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);
const clock = new THREE.Clock();
// 鼠标的位置对象
const mouse = new THREE.Vector2();

function render() {
  renderer.render(scene, camera);
  let deltaTime = clock.getDelta();

  //   cubeGroup.rotation.x = time * 0.5;
  //   cubeGroup.rotation.y = time * 0.5;

  //   sjxGroup.rotation.x = time * 0.4;
  //   sjxGroup.rotation.z = time * 0.3;

  //   smallBall.position.x = Math.sin(time) * 3;
  //   smallBall.position.z = Math.cos(time) * 3;
  //   smallBall.position.y = 2 + Math.sin(time * 10) / 2;
  //   sphereGroup.rotation.z = Math.sin(time) * 0.05;
  //   sphereGroup.rotation.x = Math.sin(time) * 0.05;

  //   根据当前滚动的scrolly，去设置相机移动的位置
  camera.position.y = -(window.scrollY / window.innerHeight) * 30;

  camera.position.x += (mouse.x * 10 - camera.position.x) * deltaTime * 5;

  requestAnimationFrame(render);
}

render();

const raycaster = new THREE.Raycaster();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  raycaster.setFromCamera(mouse, camera);
  const results = raycaster.intersectObjects(cubeArr);
  results.forEach((item) => {
    item.object.material = redMaterial;
  });
});

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");

  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});

gsap.to(cubeGroup.rotation, {
  x: "+=" + Math.PI * 2,
  y: "+=" + Math.PI * 2,
  duration: 10,
  ease: "power2.inOut",
  repeat: -1,
});
gsap.to(sjxGroup.rotation, {
  x: "-=" + Math.PI * 2,
  z: "+=" + Math.PI * 2,
  duration: 12,
  ease: "power2.inOut",
  repeat: -1,
});
gsap.to(smallBall.position, {
  x: -3,
  duration: 6,
  ease: "power2.inOut",
  repeat: -1,
  yoyo: true,
});
gsap.to(smallBall.position, {
  y: 0,
  duration: 0.5,
  ease: "power2.inOut",
  repeat: -1,
  yoyo: true,
});

export default THREE;
