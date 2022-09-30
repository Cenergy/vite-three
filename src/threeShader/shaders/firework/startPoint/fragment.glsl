// highp 2^16
// mediump 2^10
// lowp 2^8
precision lowp float;

void main() {
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = distanceToCenter * 2.0;
    strength = 1.0 - strength;
    strength = pow(strength, 1.5);
    gl_FragColor = vec4(1.0, 0.2, 0.2, strength);
}