// // THREE基础
// import threejs from "./threejs";

// // 水田一色项目
// import islandProject from "./islandProject";

// // 地月模型
// import earthAndMoon from "./earthAndMoon";

// points的基础练习

// import points from "./points";

// raycaster

// import raycaster from "./raycaster";

// import fullScroll from "./fullScroll";

// import rawShader from "./rawShader";

// import threeShader from "./threeShader";

// 智慧城市
// import city from "./city";

// import factory from "./factory";

// cesium 基础
import cesiumBase from "./cesiumBase";

// cesium 基础城市场景
import cesiumBaseCity from "./cesiumBaseCity";

export function setupCounter(element) {
  let counter = 0;
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener("click", () => setCounter(++counter));
  setCounter(0);
}
