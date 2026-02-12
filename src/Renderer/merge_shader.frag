precision highp float;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uTexture3;

varying vec2 v_uv;

void main(void) {
    vec4 color1 = texture2D(uTexture1, v_uv);
    vec4 color2 = texture2D(uTexture2, v_uv);
    vec4 color3 = texture2D(uTexture3, v_uv);

    gl_FragColor = color1 + color2 + color3;
}
