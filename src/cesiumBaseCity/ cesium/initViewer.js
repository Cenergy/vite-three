import * as Cesium from "cesium";
// 设置cesium token
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMzNkNTE5Zi1mMjY4LTRiN2QtOTRlZC1lOTUyM2NhNDYzNWYiLCJpZCI6NTU0OTYsImlhdCI6MTYyNTAyNjMyOX0.a2PEM4hQGpeuMfeB9-rPp6_Gkm6O-02Dm4apNbv_Dlk";

export default function initViewer() {
  const viewer = new Cesium.Viewer("cesiumContainer", {
    // 是否显示信息窗口
    infoBox: false,
    // 是否显示查询按钮
    geocoder: false,
    // 不显示home按钮
    homeButton: false,
    // 控制查看器的显示模式
    sceneModePicker: false,
    // 是否显示图层选择
    baseLayerPicker: false,
    // 是否显示帮助按钮
    navigationHelpButton: false,
    // 是否播放动画
    animation: false,
    // 是否显示时间轴
    timeline: false,
    // 是否显示全屏按钮
    fullscreenButton: false,
  });

  // 设置沙箱允许使用js
  var iframe = document.getElementsByClassName("cesium-infoBox-iframe")[0];
  if (iframe) {
    iframe.setAttribute(
      "sandbox",
      "allow-same-origin allow-scripts allow-popups allow-forms"
    );
    iframe.setAttribute("src", "");
  }

  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = "none";

  viewer.scene.globe.enableLighting = true;
  // 取消天空盒显示
  viewer.scene.skyBox.show = false;
  // 设置背景为黑色
  viewer.scene.backgroundColor = Cesium.Color.BLACK;
  // 设置抗锯齿
  viewer.scene.postProcessStages.fxaa.enabled = true;

  // 广州塔
  var postion = Cesium.Cartesian3.fromDegrees(
    // 经度
    113.3301,
    // 纬度
    23.0991,
    // 高度
    1500
  );
  viewer.camera.flyTo({
    destination: postion,
    orientation: {
      heading: Cesium.Math.toRadians(-45),
      pitch: Cesium.Math.toRadians(-30),
      roll: 0,
    },
    duration: 2,
  });

  return viewer;
}
