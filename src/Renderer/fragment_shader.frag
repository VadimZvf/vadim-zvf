precision mediump float;
uniform sampler2D uSampler;
uniform sampler2D uGlitch;
uniform float time;
varying vec2 vTextureCoord;

float noise(vec2 uv) {
	float s = texture(uGlitch, uv + sin(time * 2.0)).x;
    return s / 5.0; // spped up texture
}

vec2 getOffsetCoordinatesByFisheye(vec2 sourceCoordinates) {
    vec2 intensity = vec2(
        0.04,
        0.01
    );

    // Simple streatch logic
    vec2 coords = sourceCoordinates;
    coords = (coords - 0.5) * 2.0;		
		
    vec2 coordsOffset = vec2(
        (1.0 - coords.y * coords.y) * intensity.y * (coords.x), 
        (1.0 - coords.x * coords.x) * intensity.x * (coords.y)
    );

    return sourceCoordinates - coordsOffset;
}

float onOff(float a, float b, float c) {
	return step(c, sin(time / 100.0 + a * cos(time / 10.00 * b)));
}

vec4 getDistortedImage(vec2 uv) {
	vec2 look = uv;

    // Some random calculation, depended Y axis, for wave effect
    float xShift = (sin(look.y + time / 20.0) / 20.0 * onOff(1.0, 0.1, 0.3) * cos(time / 10.0)) / 10.0;

    // Random calculation for broken effect
    float yShift = onOff(1.0, 0.01, 0.04) * (
        sin(time / 15.0) + (sin(time / 10.0) * cos(time + 10.0))
    ) / 200.0;

	look.x = look.x + xShift;
	look.y = look.y + yShift;

    vec4 color = texture2D(uSampler, look);
    return color;
}

float vignette(vec2 uv) {
    // Simple noise function, for animate vignette
    float vignetteIntensity = sin(time / 8.0 + cos(time) / 2.0) + 4.0;
    // Dimming for current point
	float vignetteValue = (
        // Calculate dimming for Y axis
        1.0 - (vignetteIntensity * (uv.y - 0.5) * (uv.y - 0.5)) / 2.0
    ) * (
        // Calculate dimming for X axis
        1.0 - (vignetteIntensity * (uv.x - 0.5) * (uv.x - 0.5)) / 2.0
    );

    return vignetteValue;
}

float ramp(float y, float start, float end) {
	float inside = step(start, y) - step(end, y);
	float fact = (y - start) / (end - start) * inside;

	return (1.0 - fact) * inside;
}

float stripes(vec2 uv) {
    // Animation
    float rand = uv.y * 4.0 + time / 80.0 + sin(time / 80.0 + sin(time / 100.0));

    // get noise color
	float noi = noise(uv);
    // apply noise vawe
	return ramp(mod(rand, 1.5), 0.4, 0.6) * noi;
}

void main(void) {
    vec2 uv = vTextureCoord;

    // apply fisheye effect
    vec2 coords = getOffsetCoordinatesByFisheye(uv);

    // Add image texture
    vec4 currentPointColor = getDistortedImage(coords);
    currentPointColor += stripes(coords);
    // apply noise texture
    currentPointColor += noise(uv);
    // apply vignette
    currentPointColor *= vignette(uv);

    gl_FragColor = currentPointColor;
}
