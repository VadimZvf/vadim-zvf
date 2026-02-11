precision highp float;

uniform sampler2D uTexture;

varying vec2 v_uv;

void main(void) {
    vec4 color = texture2D(uTexture, v_uv);

    gl_FragColor = color;
}
