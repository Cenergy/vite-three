uniform float uHeight;
uniform float uTime;
varying vec3 vPosition;

void main() {
      // 设置混合的百分比
    float gradMix = (vPosition.y + uHeight / 2.0) / uHeight;
      // 计算出混合颜色

    float strength = step(0.98, sin(vPosition.y * 20.0 + uTime));

    vec4 color1 = vec4(1.0, 1.0, 0, 1.0 - gradMix);
    vec4 color2 = vec4(1.0, 1.0, 0, strength);

    gl_FragColor = mix(color1, color2, gradMix);
}