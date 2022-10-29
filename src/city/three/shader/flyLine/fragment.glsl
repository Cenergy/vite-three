void main() {
    float strength = distance(gl_PointCoord, vec2(0.5, 0.5));
    strength = 1.0 - (strength * 2.0);
    gl_FragColor = vec4(1.0, 0.0, 0.0, strength);
}