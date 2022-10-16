import * as THREE from "three";
import gsap from "gsap";

export default function modifyCityMaterial(mesh) {
  mesh.material.onBeforeCompile = (shader) => {
    addFragmentFlagPoint(shader);
    addGradColor(shader, mesh);
    addSpread(shader, mesh);
    addLightLine(shader, mesh);
    addToTopLine(shader, mesh);
  };
}
export function addFragmentFlagPoint(shader) {
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <dithering_fragment>",
    `
      #include <dithering_fragment>
      //#end#
  `
  );
}

export function addGradColor(shader, mesh) {
  mesh.geometry.computeBoundingBox();
  //   console.log(mesh.geometry.boundingBox);

  let { min, max } = mesh.geometry.boundingBox;
  //   获取物体的高度差
  let uHeight = max.y - min.y;

  shader.uniforms.uTopColor = {
    value: new THREE.Color("#aaaeff"),
  };
  shader.uniforms.uHeight = {
    value: uHeight,
  };
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
        #include <common>
        varying vec3 vPosition;
        `
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
        #include <begin_vertex>
        vPosition = position;
    `
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
        #include <common>
        uniform vec3 uTopColor;
        uniform float uHeight;
        varying vec3 vPosition;
  
          `
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    "//#end#",
    `
      vec4 distGradColor = gl_FragColor;
      // 设置混合的百分比
      float gradMix = (vPosition.y+uHeight/2.0)/uHeight;
      // 计算出混合颜色
      vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
      gl_FragColor = vec4(gradMixColor,1);
        //#end#

      `
  );
}

export function addSpread(shader, mesh) {
  shader.uniforms.uSpreadCenter = {
    value: new THREE.Vector2(0, 0),
  };
  shader.uniforms.uSpreadTime = {
    value: 0,
  };
  shader.uniforms.uSpreadWidth = {
    value: 40,
  };
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
        #include <common>
        uniform vec2 uSpreadCenter;
        uniform float uSpreadTime;
        uniform float uSpreadWidth;
          `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    `//#end#`,
    `
    float spreadRadius=distance(vPosition.xz,uSpreadCenter);
    float spreadIndex=-(spreadRadius-uSpreadTime)*(spreadRadius-uSpreadTime)+uSpreadWidth;
    if(spreadIndex>0.0){
      gl_FragColor=mix(gl_FragColor,vec4(1.0,1.0,1.0,1.0),spreadIndex/uSpreadWidth);
    }

    //#end#
    `
  );
  gsap.to(shader.uniforms.uSpreadTime, {
    value: 200,
    duration: 2,
    repeat: -1,
    ease: "none",
  });
}
export function addLightLine(shader, mesh) {
  shader.uniforms.uLightLineTime = {
    value: -1500,
  };
  shader.uniforms.uLightLineWidth = {
    value: 40,
  };
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
        #include <common>
        uniform float uLightLineTime;
        uniform float uLightLineWidth;
          `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    `//#end#`,
    `
    float lightLineValue=-(vPosition.x+vPosition.z-uLightLineTime)*(vPosition.x+vPosition.z-uLightLineTime)+uLightLineWidth;
    if(lightLineValue>0.0){
      gl_FragColor=mix(gl_FragColor,vec4(1.0,0.8,0.8,1.0),lightLineValue/uLightLineWidth);
    }

    //#end#
    `
  );
  gsap.to(shader.uniforms.uLightLineTime, {
    value: 1500,
    duration: 5,
    repeat: -1,
    ease: "none",
  });
}

export function addToTopLine(shader, mesh) {
  shader.uniforms.uToTopTime = {
    value: -500,
  };
  shader.uniforms.uToTopWidth = {
    value: 40,
  };
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
        #include <common>
        uniform float uToTopTime;
        uniform float uToTopWidth;
          `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    `//#end#`,
    `
    float ToTopValue=-(vPosition.y-uToTopTime)*(vPosition.y-uToTopTime)+uToTopWidth;
    if(ToTopValue>0.0){
      gl_FragColor=mix(gl_FragColor,vec4(1.0,0.8,0.8,1.0),ToTopValue/uToTopWidth);
    }

    //#end#
    `
  );
  gsap.to(shader.uniforms.uToTopTime, {
    value: 500,
    duration: 3,
    repeat: -1,
    ease: "none",
  });
}
