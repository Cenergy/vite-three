import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import scene from "./scene";
import gsap from "gsap";
import createCity from "./mesh/city";

export default function createMesh() {
  createCity();
}
