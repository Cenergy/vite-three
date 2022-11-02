import gsap from "gsap";
import * as THREE from "three";

import vertexShader from "../shader/flyLine/vertex.glsl";
import fragmentShader from "../shader/flyLine/fragment.glsl";

export default class FlyLine {
  constructor(position = { x: 0, z: 0 }, color = 0x00ffff) {
    const linePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-8, 4, 0),
      new THREE.Vector3(-12, 0, 0),
    ];
    this.lineCurve = new THREE.CatmullRomCurve3(linePoints);
    const points = this.lineCurve.getPoints(1000);
    this.geometry = new THREE.BufferGeometry().setFromPoints(points);
    const pointsLength = new Float32Array(points.length);
    for (let index = 0; index < pointsLength.length; index++) {
      pointsLength[index] = index;
    }
    this.geometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(pointsLength, 1)
    );

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0,
        },
        uColor: {
          value: new THREE.Color(color),
        },
        uLength: {
          value: points.length,
        },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
    this.mesh = new THREE.Points(this.geometry, this.material);

    // 改变uTime来控制动画
    gsap.to(this.material.uniforms.uTime, {
      value: 1000,
      duration: 2,
      repeat: -1,
      ease: "none",
    });
  }
}
