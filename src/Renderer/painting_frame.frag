precision highp float;

uniform sampler2D uFrameTexture;
uniform sampler2D uScreenTexture;

float glowIntensity = 0.01;

varying vec2 v_uv;

void main(void) {
    vec3 innerFrameColor = vec3(0.4, 0.4, 0.4);
    vec3 outerFrameColor = vec3(0.2, 0.2, 0.2);

    vec4 frame = texture2D(uFrameTexture, v_uv);

    // We also want to apply a glow effect on the inner frame border
    // So it looks like the screen glows through the frame
    vec2 center = vec2(0.5, 0.5);
    vec2 direction = normalize(v_uv - center);

    // BAD! taking 100 samples
    for (float i = 0.0; i < 0.1; i += 0.001) {
        innerFrameColor += texture2D(uScreenTexture, v_uv - direction * i).rgb * glowIntensity;
    }

    gl_FragColor = vec4(innerFrameColor * frame.r + outerFrameColor * frame.g, 1.0);
}