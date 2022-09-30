import * as THREE from "three";
import startPointVertex from "./startPoint/vertex.glsl";
import startPointFragment from "./startPoint/fragment.glsl";
export default class FireWorks {
  constructor(color, to, from = { x: 0, y: 0, z: 0 }) {
    this.color = new THREE.Color(color);
    this.startGeometry = new THREE.BufferGeometry();
    const startPositionArray = new Float32Array(3);

    startPositionArray[0] = from.x;
    startPositionArray[1] = from.y;
    startPositionArray[2] = from.z;

    this.startGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(startPositionArray, 3)
    );

    const aStepArray = new Float32Array(3);
    aStepArray[0] = to.x - from.x;
    aStepArray[1] = to.y - from.y;
    aStepArray[2] = to.z - from.z;

    this.startGeometry.setAttribute(
      "aStep",
      new THREE.BufferAttribute(aStepArray, 3)
    );

    this.startMaterial = new THREE.ShaderMaterial({
      vertexShader: startPointVertex,
      fragmentShader: startPointFragment,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 20,
        },
      },
    });
    this.startPoint = new THREE.Points(this.startGeometry, this.startMaterial);
    this.clock = new THREE.Clock();
  }
  //   添加到场景
  addScene(scene, camera) {
    scene.add(this.startPoint);
    this.scene = scene;
  }
  update() {
    const elapsedTime = this.clock.getElapsedTime();
    if (elapsedTime < 1) {
      this.startMaterial.uniforms.uTime.value = elapsedTime;
      this.startMaterial.uniforms.uSize.value = 20.0;
    }
  }
}
