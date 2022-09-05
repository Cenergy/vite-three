// // THREE基础
// import threejs from "./threejs";

// // 水田一色项目
// import islandProject from "./islandProject";

// // 地月模型
// import earthAndMoon from "./earthAndMoon";

// points的基础练习

// import points from "./points";

// raycaster

import raycaster from "./raycaster";


export function setupCounter(element) {
  let counter = 0;
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener("click", () => setCounter(++counter));
  setCounter(0);
}
