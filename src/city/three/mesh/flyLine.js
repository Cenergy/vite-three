import gsap from "gsap";
import * as THREE from "three";

export default class FlyLine {
  constructor() {
    const linePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(8, 4, 0),
      new THREE.Vector3(12, 0, 0),
    ];
    this.lineCurve = new THREE.CatmullRomCurve3(linePoints);
    this.geometry = new THREE.TubeBufferGeometry(
      this.lineCurve,
      100,
      0.4,
      2,
      false
    );
    const textureLoader = new THREE.TextureLoader();
    this.texture = textureLoader.load("/textures/z_11.png");
    this.texture.repeat.set(1, 2);
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.MirroredRepeatWrapping;
    this.material = new THREE.MeshBasicMaterial({
      color: 0xfff000,
      map: this.texture,
      transparent: true,
      // depthWrite:false
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // this.texture offset的范围是[-1,1]
    gsap.to(this.texture.offset, {
      x: -1,
      duration: 1,
      repeat: -1,
      ease: "none",
    });
  }
}
