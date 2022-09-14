// highp 2^16
// mediump 2^10
// lowp 2^8
precision lowp float;
varying vec2 vUv;

uniform float uTime;

#define PI 3.1415926535897932384626433832795

// 随机函数
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 旋转函数
vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x, cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);
}

// 噪声函数
float noise(in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
        (c - a) * u.y * (1.0 - u.x) +
        (d - b) * u.x * u.y;
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec2 fade(vec2 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main() {
    // 通过顶点对应的uv，决定每一个像素在uv图像的位置，决定x,y的颜色
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    // // 利用uv实现渐变效果，从下到上
    // float strength = vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 利用uv实现渐变效果，从上到下
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 利用uv实现短范围内渐变
    // float strength = vUv.y * 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 利用短范围内渐变+取模实现重复
    // float strength = mod(vUv.y * 10.0, 1.0);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 利用短范围内渐变+取模实现重复+step
    // float strength = step(0.5,mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 条纹相加：利用短范围内渐变+取模实现重复+step
    // float strength = step(0.8,mod(vUv.y * 10.0, 1.0));
    // strength += step(0.8,mod(vUv.x * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 大方块
    // float strength = step(0.2, mod(vUv.y * 10.0, 1.0));
    // strength *= step(0.2, mod(vUv.x * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 7形图
    // float barX = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float barY = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(vUv, 1.0, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 移动7形图
    // float barX = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float barY = step(0.4, mod((vUv.x + uTime * 0.1) * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(vUv, 1.0, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // T形图
    // float barX = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float barY = step(0.4, mod((vUv.x) * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(vUv, 1.0, strength);
    // // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 条纹
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
    // // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 条纹
    // float strength = (floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
    // // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 格子颜色
    // float strength = (ceil(vUv.x * 10.0) / 10.0 * ceil(vUv.y * 10.0) / 10.0);
    // strength = random(vec2(strength, strength));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // length
    // float strength = length(vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // // distance计算两个向量的距离
    // float strength = 1.0 - distance(vUv, vec2(0.5, 0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // // distance计算两个向量的距离
    // float strength = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5))-1.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // // 飞镖
    // float strength = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5))-1.0;
    // strength += 0.15 / distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5))-1.0;
    // gl_FragColor = vec4(strength);

    // // // distance计算两个向量的距离
    // vec2 rotationUv=rotate(vUv,-uTime,vec2(0.5));
    // float strength = 0.15 / distance(vec2(rotationUv.x, (rotationUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5))-1.0;
    // strength += 0.15 / distance(vec2(rotationUv.y, (rotationUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5))-1.0;
    // gl_FragColor = vec4(strength);

        // 31绘制圆
    // float strength = 1.0 - step(0.5,distance(vUv,vec2(0.5))+0.25) ;
    // gl_FragColor =vec4(strength,strength,strength,1);

    // 32圆环
    // float strength = step(0.5, distance(vUv, vec2(0.5)) + 0.35);
    // strength *= (1.0 - step(0.5, distance(vUv, vec2(0.5)) + 0.25));
    // gl_FragColor = vec4(strength, strength, strength, strength);

    // 根据角度显示
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 根据角度实现螺旋渐变
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = (angle + 3.14) / 6.28;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 静态雷达
    // float alpha = 1.0 - step(0.5, distance(vUv, vec2(0.5)));
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = (angle + 3.14) / 6.28;
    // gl_FragColor = vec4(strength, strength, strength, alpha);

    // // 动态雷达
    // vec2 rotateUv = rotate(vUv, -uTime * 2.0, vec2(0.5));
    // float alpha = 1.0 - step(0.5, distance(vUv, vec2(0.5)));
    // float angle = atan(rotateUv.x - 0.5, rotateUv.y - 0.5);
    // float strength = (angle + 3.14) / 6.28;
    // gl_FragColor = vec4(strength, strength, strength, alpha);

    // // 万花筒
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (2.0 * PI);
    // float strength = mod(angle * 10.0, 1.0);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 光芒四射
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (2.0 * PI);
    float strength = sin(angle * 50.0);
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}