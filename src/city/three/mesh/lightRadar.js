import * as THREE from "three";
import gsap from "gsap";

import vertexShader from "../shader/lightRadar/vertex.glsl";
import fragmentShader from "../shader/lightRadar/fragment.glsl";

export default class LightRadar {
  constructor(geometry) {
    this.geometry = new THREE.PlaneGeometry(3, 3, 32, 32);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
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
    this.mesh.rotation.x = -Math.PI / 2.0;
    this.mesh.position.set(-5, 2, 6);

    // 改变uTime来控制动画
    gsap.to(this.material.uniforms.uTime, {
      value: 10,
      duration: 10,
      repeat: -1,
      ease: "none",
    });
  }
}
