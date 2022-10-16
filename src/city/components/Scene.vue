<template>
    <div class="scene" ref="sceneContainer"></div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";

// 导入gui对象
import gui from "../three/gui";
// 导入场景
import scene from "../three/scene";
// 导入相机
import camera from "../three/camera";
// 导入控制器
import controls from "../three/controls";
// 导入辅助坐标轴
import axesHelper from "../three/axesHelper";
// 导入渲染器
import renderer from "../three/renderer";
// 初始化调整屏幕
import "../three/init";
// 导入添加物体函数
import createMesh from "../three/createMesh";

// 导入每一帧的执行函数
import animate from "../three/animate";

const sceneContainer = ref(null);


scene.add(camera);
// 添加辅助坐标轴
scene.add(axesHelper);

createMesh();

onMounted(() => {
    sceneContainer.value.appendChild(renderer.domElement);
    animate();
});
</script>

<style>
.scene {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
}
</style>
