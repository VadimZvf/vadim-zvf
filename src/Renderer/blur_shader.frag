precision highp float;

uniform sampler2D uTexture;

uniform float u_horizontal;

uniform vec2 u_resolution;

uniform float u_blurRadius;
varying vec2 v_uv;

float weight0 = 0.227027;
float weight1 = 0.1945946;
float weight2 = 0.1216216;
float weight3 = 0.054054;
float weight4 = 0.016216;

void main(void) {
    vec2 texelSize = 1.0 / u_resolution;

    vec2 direction = u_horizontal == 1.0 ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

    vec3 result = texture2D(uTexture, v_uv).rgb * weight0;

    // Sample ±1 pixel
    vec2 offset1 = direction * texelSize * 1.0 * u_blurRadius;
    result += texture2D(uTexture, v_uv + offset1).rgb * weight1;
    result += texture2D(uTexture, v_uv - offset1).rgb * weight1;

    // Sample ±2 pixels
    vec2 offset2 = direction * texelSize * 2.0 * u_blurRadius;
    result += texture2D(uTexture, v_uv + offset2).rgb * weight2;
    result += texture2D(uTexture, v_uv - offset2).rgb * weight2;

    // Sample ±3 pixels
    vec2 offset3 = direction * texelSize * 3.0 * u_blurRadius;
    result += texture2D(uTexture, v_uv + offset3).rgb * weight3;
    result += texture2D(uTexture, v_uv - offset3).rgb * weight3;

    // Sample ±4 pixels
    vec2 offset4 = direction * texelSize * 4.0 * u_blurRadius;
    result += texture2D(uTexture, v_uv + offset4).rgb * weight4;
    result += texture2D(uTexture, v_uv - offset4).rgb * weight4;

    gl_FragColor = vec4(result, 1.0);
}
