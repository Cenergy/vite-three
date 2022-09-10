const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 获取webgl绘图上下文
const gl = canvas.getContext("webgl");
// 设施视口大小
gl.viewport(0, 0, canvas.width, canvas.height);
// 创建顶点着色器
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
// 创建顶点着色器源码
gl.shaderSource(
  vertexShader,
  `
 attribute vec4 a_Position;
 void main(){
    gl_Position = vec4(a_Position, 1.0);
 }
 `
);
// 创建片元着色器
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
// 创建片元着色器源码
gl.shaderSource(
  fragmentShader,
  `
 precision mediump float;
 void main(){
     gl_FragColor= vec4(1.0,1.0,1.0,1.0)
 }
`
);

document.body.appendChild(canvas);
export default {};
