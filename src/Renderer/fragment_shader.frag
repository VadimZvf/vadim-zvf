precision mediump float;
uniform sampler2D uGlitch;
uniform vec2 uResolution;
uniform float uText[1000];
uniform float uTextLength;
uniform float time;
varying vec2 vTextureCoord;

#define CHAR_SIZE vec2(3, 7)
#define PADDING vec2(70.0, 64.0)
#define CHAR_SPACING vec2(14, 32)
#define ZOOM 0.34

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃        Noise effect        ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
float noise(vec2 uv) {
    float s = texture(uGlitch, uv + sin(time * 2.0)).x;
    return s / 5.0; // spped up texture
}

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃       Fisheye effect       ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
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

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃     Distortion effect      ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
float onOff(float a, float b, float c) {
    return step(c, sin(time / 100.0 + a * cos(time / 10.00 * b)));
}

vec2 getDistortedCoords(vec2 uv) {
    vec2 look = uv;

    // Some random calculation, depended Y axis, for wave effect
    float xShift = (sin(look.y + time / 2.0) / 15.0 * onOff(0.5, 0.08, 0.03) * cos(time)) / 50.0;

    // Random calculation for broken effect
    float yShift = onOff(0.2, 0.01, 0.04) * (
        sin(time / 15.0) + (sin(time / 2.0) * cos(time + 10.0))
    ) / 400.0;

    look.x = look.x + xShift;
    look.y = look.y + yShift;

    return look;
}

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃       Vignette effect      ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
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

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃       Stripes effect       ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
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


// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃       Text rendering       ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
// Extracts bit b from the given number.
float extract_bit(float number, float bit) {
    return floor(mod(floor(number / pow(2.0, floor(bit))), 2.0));   
}

// Returns the pixel at uv in the given bit-packed sprite.
float sprite(float spr, vec2 size, vec2 uv) {
    // Calculate the bit to extract (x + y * width) (flipped on x-axis)
    float bit = (size.x - uv.x - 1.0) + uv.y * size.x;
    
    // Clipping bound to remove garbage outside the sprite's boundaries.
    bool bounds = all(greaterThanEqual(uv, vec2(0, 0))) && all(lessThan(uv, size));
    
    return bounds ? extract_bit(spr, bit) : 0.0;
}

// Prints a character.
float char(float ch, vec2 uv, vec2 cursor) {
    return sprite(ch, CHAR_SIZE, floor(ZOOM * (uv - cursor)));
}

vec4 getText(vec2 uv) {
    // Coords is value betwean 0 and 1, here we transform this value to real coords 1,2,3,4....
    vec2 currentCoord = getDistortedCoords(uv) * uResolution;

    // Calculate how match symbols was before current point
    vec2 bucket = floor(
        vec2(
            (currentCoord.x - PADDING.x) / CHAR_SPACING.x,
            (uResolution.y - PADDING.y - currentCoord.y) / CHAR_SPACING.y
        )
    );

    // Count of symbols on current line 
    float numCharsRow = floor((uResolution.x - PADDING.x * 2.0) / CHAR_SPACING.x);
    // Calculate how match 
    float charIndex = bucket.y * numCharsRow + bucket.x;

    if (bucket.y >= 0.0 && currentCoord.x >= PADDING.x && currentCoord.x <= uResolution.x - PADDING.x) {
        float charId = uText[int(charIndex)];

        // Calculate current point position inside grid
        vec2 cursor = floor(currentCoord / CHAR_SPACING) * CHAR_SPACING;
        // Render char
        vec4 charColor = vec4(1.0, 1.0, 1.0, 0.0) * char(charId, currentCoord, cursor);

        // Render cursor
        float isLastChar = 1.0 - step(0.5, abs(uTextLength - charIndex));
        charColor += vec4(1.0, 1.0, 1.0, 0.0) * isLastChar * sin(time / 2.0);

        return charColor;
    }

    return vec4(0.0);
}

void main(void) {
    // Real point
    vec2 uv = vTextureCoord;
    vec4 currentPointColor = vec4(0.0);

    // Apply fisheye effect, and distortion effect
    vec2 fisheyedCoords = getOffsetCoordinatesByFisheye(uv);

    // Add text
    currentPointColor += getText(fisheyedCoords);
    // add stripes effect
    currentPointColor += stripes(fisheyedCoords);
    // apply noise texture
    currentPointColor += noise(uv);
    // apply vignette
    currentPointColor *= vignette(uv);
  
    gl_FragColor = currentPointColor;
}
