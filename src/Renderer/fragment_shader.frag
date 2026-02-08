precision highp float;
uniform float uShowRainbow;
uniform sampler2D uScreenTexture;
uniform float time;
varying vec2 v_uv;


// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃       Rainbow effect       ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
vec4 rainbow(vec2 uv) {
    vec3 color = 0.5 + 0.5 * cos(time / 10.0 + uv.xyx + vec3(0,2,4));

    return uShowRainbow == 1.0 ? vec4(color, 1.0) : vec4(1.0);
}

void main(void) {
    vec4 textColor = texture2D(uScreenTexture, v_uv);

    textColor *= rainbow(v_uv);

    gl_FragColor = vec4(textColor);
}
