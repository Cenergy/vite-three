<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { onMounted } from "vue";
import initViewer from "../ cesium/initViewer";
import MousePosition from "../ cesium/mousePosition";
import modifyMap from "../ cesium/modifyMap";

// 设置cesium token
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMzNkNTE5Zi1mMjY4LTRiN2QtOTRlZC1lOTUyM2NhNDYzNWYiLCJpZCI6NTU0OTYsImlhdCI6MTYyNTAyNjMyOX0.a2PEM4hQGpeuMfeB9-rPp6_Gkm6O-02Dm4apNbv_Dlk";

onMounted(() => {
  const viewer = initViewer();
  const mousePosition = new MousePosition(viewer);
  modifyMap(viewer)

  // hide logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
  // adjust view
  // 将经纬度转成笛卡尔坐标
  const position = Cesium.Cartesian3.fromDegrees(
    // 经度
    113.3191,
    // 纬度
    23.109,
    // 高度
    100000
  );
  viewer.camera.flyTo({
    destination: position,
    duration: 1,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: Cesium.Math.toRadians(30),
    },
  });
});
</script>


<style>
html,
body,
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
