// highp 2^16
// mediump 2^10
// lowp 2^8
precision lowp float;
varying vec4 vPosition;
varying vec4 gPosition;

void main() {
    vec4 redColor = vec4(1.0, 0.0, 0.0, 1.0);
    vec4 yellowColor = vec4(1.0, 1.0, 0.0, 1.0);
    vec4 mixColor = mix(yellowColor, redColor, gPosition.y / 3.0);
    if(gl_FrontFacing) {
        gl_FragColor = vec4(mixColor.xyz - (vPosition.y - 20.0) / 80.0 - 0.3, 1.0);
    } else {
        gl_FragColor = mixColor;
    }
}