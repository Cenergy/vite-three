import gsap from "gsap";
import * as THREE from "three";

import vertexShader from "../shader/flyLine/vertex.glsl";
import fragmentShader from "../shader/flyLine/fragment.glsl";

export default class FlyLine {
  constructor() {
    const linePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-8, 4, 0),
      new THREE.Vector3(-12, 0, 0),
    ];
    this.lineCurve = new THREE.CatmullRomCurve3(linePoints);
    const points = this.lineCurve.getPoints(10);
    this.geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    this.mesh = new THREE.Points(this.geometry, this.material);
  }
}
