const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

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
 uniform mat4 u_Mat;
 varying vec4 v_Color;
 void main(){
    gl_Position = a_Position*u_Mat;
    v_Color=gl_Position;
 }
 `
);
// 编译顶点着色器
gl.compileShader(vertexShader);

// 创建片元着色器
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
// 创建片元着色器源码
gl.shaderSource(
  fragmentShader,
  `
 precision mediump float;
 varying vec4 v_Color;
 void main(){
     gl_FragColor= v_Color;
 }
`
);

// 编译片元着色器
gl.compileShader(fragmentShader);

// 创建程序连接顶点着色器和片元着色器

const program = gl.createProgram();
// 链接顶点着色器和片元着色器
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

// 链接程序
gl.linkProgram(program);

// 使用程序进行渲染
gl.useProgram(program);

// 创建顶点缓冲区对象
const vertexBuffer = gl.createBuffer();
// 绑定顶点缓存区对象
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

// 向顶点缓冲区对象中写入数据
const vertexData = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
// gl.STATIC_DRAW表示数据不会变化,gl.DYNAMIC_DRAW
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

// 获取顶点着色器中的a_Position变量的位置
const a_Position = gl.getAttribLocation(program, "a_Position");
// 将顶点缓冲区对象分配给a_Position变量
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
// 启用顶点着色器中的a_Position变量
gl.enableVertexAttribArray(a_Position);

let scale = 0.5;
let mat = new Float32Array([
  scale,
  0.0,
  0.0,
  0.0,
  0.0,
  scale,
  0.0,
  0.0,
  0.0,
  0.0,
  scale,
  0.0,
  0.0,
  0.0,
  0.0,
  1.0,
]);
const u_Mat = gl.getUniformLocation(program, "u_Mat");
gl.uniformMatrix4fv(u_Mat, false, mat);

// 清除canvas
gl.clearColor(0.0, 0.0, 0.0, 0.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// 绘制三角形
gl.drawArrays(gl.TRIANGLES, 0, 3);

function animate() {
  scale -= 0.01;
  let mat = new Float32Array([
    scale,
    0.0,
    0.0,
    0.0,
    0.0,
    scale,
    0.0,
    0.0,
    0.0,
    0.0,
    scale,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
  ]);
  const u_Mat = gl.getUniformLocation(program, "u_Mat");
  gl.uniformMatrix4fv(u_Mat, false, mat);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  requestAnimationFrame(animate);
}
animate();

export default {};
