// highp 2^16
// mediump 2^10
// lowp 2^8
precision lowp float;
varying vec2 vUv;
varying float vHieght;

uniform sampler2D uTexture;

void main() {
    // float deepHeight = vHieght + 0.05 * 10.0;
    // gl_FragColor = vec4(deepHeight, 0.0, 0.0, 1.0);

    // 根据uv，取出对应的颜色
    float deepHeight = vHieght + 0.05 * 20.0;
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= deepHeight;
    gl_FragColor = textureColor;
}