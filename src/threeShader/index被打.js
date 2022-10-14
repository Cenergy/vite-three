import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 目标：掌握设置环境纹理

//创建gui对象
const gui = new dat.GUI();

// console.log(THREE);
// 初始化场景
const scene = new THREE.Scene();

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerHeight / window.innerHeight,
  1,
  50
);
// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.position.set(0, 0, 10);
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 加载纹理

// 创建纹理加载器对象
const textureLoader = new THREE.TextureLoader();

// 添加环境纹理
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

// 环境光
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
// const pointLight = new THREE.PointLight(0xffffff, 0.5);
// pointLight.position.set(2, 3, 4);
// scene.add(pointLight);

const directionLight = new THREE.DirectionalLight("#ffffff", 1);
directionLight.castShadow = true;
directionLight.position.set(0, 0, 200);
scene.add(directionLight);

scene.environment = envMapTexture;
scene.background = envMapTexture;

// 加载模型纹理
const modelTexture = textureLoader.load("/models/LeePerrySmith/color.jpg");
// 加载模型的法向纹理
const normalTexture = textureLoader.load("/models/LeePerrySmith/normal.jpg");

const material = new THREE.MeshStandardMaterial({
  map: modelTexture,
  normalMap: normalTexture,
});
const customUniforms = {
  uTime: {
    value: 0,
  },
};
material.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
    #include <common>
    uniform float uTime;
    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
    }
    `
  );

  shader.vertexShader = shader.vertexShader.replace(
    "#include <beginnormal_vertex>",
    `
    #include <beginnormal_vertex>
    float angle = sin(position.y+uTime)*0.3;
    mat2 rotateMatrix = rotate2d(angle);

    objectNormal.xz = rotateMatrix * objectNormal.xz;
    `
  );

  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>
    transformed.xz=rotateMatrix*transformed.xz;

    `
  );
};

// material.onBeforeCompile = (shader) => {
//   console.log(shader.vertexShader);
//   console.log(shader.fragmentShader);
//   // 传递时间
//   shader.uniforms.uTime = customUniforms.uTime;
//   shader.vertexShader = shader.vertexShader.replace(
//     "#include <common>",
//     `
// #include <common>
// mat2 rotate2d(float _angle){
//   return mat2(cos(_angle),-sin(_angle),
//               sin(_angle),cos(_angle));
// }
//     uniform float uTime;
//     `
//   );

// shader.vertexShader = shader.vertexShader.replace(
//   "#include <beginnormal_vertex>",
//   `
//   #include <beginnormal_vertex>
//   float angle = sin(position.y+uTime) *0.5;
//   mat2 rotateMatrix = rotate2d(angle);

//   objectNormal.xz = rotateMatrix * objectNormal.xz;
//   `
// );
//   shader.vertexShader = shader.vertexShader.replace(
//     "#include <begin_vertex>",
//     `
//     #include <begin_vertex>
//     // float angle = transformed.y*0.5;
//     // mat2 rotateMatrix = rotate2d(angle);

//     transformed.xz = rotateMatrix * transformed.xz;

//     `
//   );
// };

// const depthMaterial = new THREE.MeshDepthMaterial({
//   depthPacking: THREE.RGBADepthPacking,
// });

// depthMaterial.onBeforeCompile = (shader) => {
//   shader.vertexShader = shader.vertexShader.replace(
//     "#include <common>",
//     `
//     #include <common>
//     mat2 rotate2d(float _angle){
//       return mat2(cos(_angle),-sin(_angle),
//                   sin(_angle),cos(_angle));
//     }
//     uniform float uTime;
//     `
//   );
//   shader.vertexShader = shader.vertexShader.replace(
//     "#include <begin_vertex>",
//     `
//     #include <begin_vertex>
//     float angle = sin(position.y+uTime) *0.5;
//     mat2 rotateMatrix = rotate2d(angle);

//     transformed.xz = rotateMatrix * transformed.xz;

//     `
//   );
// };

// 模型加载
const gltfLoader = new GLTFLoader();

// const depthMaterial = new THREE.MeshDepthMaterial({
//   depthPacking: THREE.RGBADepthPacking,
// });

const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
});

depthMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
    #include <common>
    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
    }
    uniform float uTime;
    `
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>
    float angle = sin(transformed.y+uTime) *0.5;
    mat2 rotateMatrix = rotate2d(angle);
    transformed.xz = rotateMatrix * transformed.xz;

    `
  );
};

gltfLoader.load("/models/LeePerrySmith/LeePerrySmith.glb", (gltf) => {
  // console.log(gltf)
  const mesh = gltf.scene.children[0];
  mesh.castShadow = true;
  console.log("🚀 ~ file: index.js ~ line 158 ~ gltfLoader.load ~ mesh", mesh);
  // 设定自定义的深度材质
  mesh.material = material;
  mesh.customDepthMaterial = depthMaterial;
  scene.add(mesh);
});

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial()
);
plane.position.set(0, 0, -6);
plane.receiveShadow = true;
scene.add(plane);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener("resize", () => {
  //   console.log("resize");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
});

// 将渲染器添加到body
document.body.appendChild(renderer.domElement);

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置自动旋转
// controls.autoRotate = true;

const clock = new THREE.Clock();
function animate(t) {
  controls.update();
  const time = clock.getElapsedTime();
  customUniforms.uTime.value = time;
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();

export default {};
