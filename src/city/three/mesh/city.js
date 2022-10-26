import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import scene from "../scene";
import modifyCityMaterial from "../modify/modifyCityMaterial";

import FlyLine from "./flyLine";

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
      }
    });

    scene.add(gltf.scene);
  });
  // 添加飞线
  const flyLine = new FlyLine();
  scene.add(flyLine.mesh);
}
