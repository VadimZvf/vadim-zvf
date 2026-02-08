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

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃       Curved effect        ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
// Takes coordinates of a pixel and returns new coordinates with applied curvature
// of the simulated screen
vec2 getCurvedScreenUv(vec2 uv) {
    vec2 intensity = vec2(
        0.04,
        0.01
    );

    // Simple stretch logic
    vec2 coords = (uv - 0.5) * 2.0;        
        
    vec2 coordsOffset = vec2(
        (1.0 - coords.y * coords.y) * intensity.y * (coords.x), 
        (1.0 - coords.x * coords.x) * intensity.x * (coords.y)
    );

    return uv - coordsOffset;
}

vec3 applyPadding(vec2 uv) {
    vec2 padding = vec2(0.1, 0.1);

    vec2 scale = (0.5 - padding) / 0.5;
    vec2 centeredUv = uv - 0.5;
    vec2 scaledCenteredUv = centeredUv / scale;
    vec2 finalUv = scaledCenteredUv + 0.5;

    return vec3(
        finalUv,
        // alpha to hide pixels outside of the screen
        step(0.0, finalUv.x) * step(0.0, finalUv.y) * step(finalUv.x, 1.0) * step(finalUv.y, 1.0)
    );
}

void main(void) {
    vec2 curvedUv = getCurvedScreenUv(v_uv);
    vec3 uv = applyPadding(curvedUv);

    vec4 textColor = texture2D(uScreenTexture, uv.xy);

    textColor *= rainbow(uv.xy);

    gl_FragColor = textColor * uv.z;
}
