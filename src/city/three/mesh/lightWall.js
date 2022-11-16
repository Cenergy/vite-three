import * as THREE from "three";
import gsap from "gsap";

import vertexShader from "../shader/lightWall/vertex.glsl";
import fragmentShader from "../shader/lightWall/fragment.glsl";

export default class LightWall {
  constructor(geometry) {
    this.geometry = new THREE.CylinderGeometry(2, 2, 3, 4, 4, true);
    this.geometry.computeBoundingBox();
    const { max, min } = this.geometry.boundingBox;

    const uHeight = { value: max.y - min.y };
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uHeight,
        uTime: {
          value: 0,
        },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0,2,0)

    // 改变uTime来控制动画
    gsap.to(this.material.uniforms.uTime, {
      value: -100,
      duration: 10,
      repeat: -1,
      ease: "none",
    });
  }
}
