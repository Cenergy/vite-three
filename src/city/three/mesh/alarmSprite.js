import * as THREE from "three";

export default class AlarmSprite {
  constructor(type = "火警", position = { x: -1.8, z: 3 }, color = 0xffffff) {
    const textureLoader = new THREE.TextureLoader();
    const typeObj = {
      火警: "/textures/tag/fire.png",
      治安: "/textures/tag/jingcha.png",
      电力: "/textures/tag/e.png",
    };

    const map = textureLoader.load(typeObj[type]);
    const spriteMaterial = new THREE.SpriteMaterial({ map });
    this.mesh = new THREE.Sprite(spriteMaterial);
    // 设置位置
    this.mesh.position.set(position.x, 3.5, position.z);
  }
}
