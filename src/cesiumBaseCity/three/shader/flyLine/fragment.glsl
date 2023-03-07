varying float vSize;
uniform vec3 uColor;

void main() {
    float strength = distance(gl_PointCoord, vec2(0.5, 0.5));
    strength = 1.0 - (strength * 2.0);
    if(vSize > 0.0) {
        gl_FragColor = vec4(uColor, strength);
    } else {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0);
    }
}