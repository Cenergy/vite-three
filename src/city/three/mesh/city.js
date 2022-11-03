import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import scene from "../scene";
import modifyCityMaterial from "../modify/modifyCityMaterial";

import FlyLine from "./flyLine";
import FlyLineShader from "./flyLineShader";
import MeshLine from "./meshLine";

export default function createCity() {
  const gltfLoader = new GLTFLoader();
  gltfLoader.load("/model/city.glb", (gltf) => {
    gltf.scene.traverse((children) => {
      if (children.type === "Mesh") {
        const cityMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0x0c0eff),
        });
        children.material = cityMaterial;
        modifyCityMaterial(children);
        console.log(
          "🚀 ~ file: city.js ~ line 21 ~ gltf.scene.traverse ~ children",
          children
        );
        if (children.name === "Layerbuildings") {
          // 添加建筑边框
          const meshLine = new MeshLine(children.geometry);
          const size=children.scale.x*1.01;
          meshLine.mesh.scale.set(size, size, size);
          scene.add(meshLine.mesh);
        }
      }
    });

    scene.add(gltf.scene);
  });
  // 添加飞线
  const flyLine = new FlyLine();
  scene.add(flyLine.mesh);

  // 添加着色器飞线
  const flyLineShader = new FlyLineShader();
  scene.add(flyLineShader.mesh);
}
