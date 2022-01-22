precision highp float;
uniform sampler2D uGlitch;
uniform sampler2D uTextTexture;
uniform sampler2D uTextSprite;
uniform float uLastCharPosition;
uniform float uShowCursor;
uniform float uShowRainbow;
uniform float uSymbolsPerLineOnScreen;
uniform float uLinesCountOnScreen;
uniform float time;
varying vec2 vTextureCoord;

#define SYMBOLS_PER_LINE_IN_SPRITE 11.0
#define LINES_COUNT_IN_SPRITE 15.0

#define TEXT_BRIGHTNESS 2.0

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃        Noise effect        ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
float noise(vec2 uv) {
    float s = texture2D(uGlitch, uv + sin(time * 2.0)).x;
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
// a - first value
// b - second value
// c - frequency, 0 - always, 1 - never
float onOff(float a, float b, float c) {
    return step(c, sin(time / 100.0 + a * cos(time / 10.00 * b)));
}

vec2 getDistortedCoords(vec2 uv) {
    vec2 look = uv;

    // Some random calculation, depended Y axis, for wave effect
    float xShift = (
        (sin(look.y * 100.0 + time) / 30.0 * onOff(0.0, 0.01, 0.03) * cos(look.y * time / 2.0)) *
        onOff(1000.0, 0.1, 0.98)
    );

    // Random calculation for broken effect
    float yShift = onOff(0.2, 0.01, 0.5) * (
        sin(time / 15.0) + (sin(time / 2.0) * cos(time + 10.0))
    ) / 500.0;

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
// ┃       Rainbow effect       ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
vec4 rainbow(vec2 uv) {
    vec3 color = 0.5 + 0.5 * cos(time / 10.0 + uv.xyx + vec3(0,2,4));

    return uShowRainbow == 1.0 ? vec4(color, 1.0) : vec4(1.0);
}

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃       Text rendering       ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
// Prints a character.
vec4 getCharSpriteColor(float charIndex, vec2 positionInsideSprite) {
    vec2 symbolPositionInGrid = vec2(
        mod(charIndex, SYMBOLS_PER_LINE_IN_SPRITE),
        floor(charIndex / SYMBOLS_PER_LINE_IN_SPRITE)
    );

    vec2 symbolSizeInGreen = vec2(
        1.0 / SYMBOLS_PER_LINE_IN_SPRITE,
        1.0 / LINES_COUNT_IN_SPRITE
    );

    vec4 symbolColorFromTexture = texture2D(
        uTextSprite,
        vec2(
            symbolPositionInGrid.x / SYMBOLS_PER_LINE_IN_SPRITE + positionInsideSprite.x * symbolSizeInGreen.x,
            1.0 - (symbolPositionInGrid.y / LINES_COUNT_IN_SPRITE + positionInsideSprite.y * symbolSizeInGreen.y)
        )
    );

    return symbolColorFromTexture * TEXT_BRIGHTNESS;
}

float getCharIndexInSpritesGrid(float charIndexInText) {
    vec4 textureData = texture2D(
        uTextTexture,
        vec2(charIndexInText / (uSymbolsPerLineOnScreen * uLinesCountOnScreen + 1.0), 0.0)
    ) * 255.0;

    return floor(textureData.x);
}

vec4 getText(vec2 uv) {
    vec2 invertedUv = vec2(
        uv.x,
        1.0 - uv.y
    );

    vec2 symbolSizeOnScreen = vec2(
        1.0 / uSymbolsPerLineOnScreen,
        1.0 / uLinesCountOnScreen
    );

    // Calculate how match symbols was before current point
    vec2 bucket = floor(
        vec2(
            invertedUv.x / symbolSizeOnScreen.x,
            invertedUv.y / symbolSizeOnScreen.y
        )
    );

    // Calculate how match 
    float charIndexInText = bucket.y * uSymbolsPerLineOnScreen + bucket.x;
    float charIndexInSpriteGrid = getCharIndexInSpritesGrid(charIndexInText);

    // Calculate current point position inside grid
    vec2 cursor = floor(invertedUv / symbolSizeOnScreen) * symbolSizeOnScreen;
    vec2 positionInsideSprite = vec2(
        (invertedUv.x - cursor.x) / symbolSizeOnScreen.x,
        (invertedUv.y - cursor.y) / symbolSizeOnScreen.y
    );

    // Check that point inside char
    if (positionInsideSprite.x <= 0.1 || positionInsideSprite.y <= 0.1 || positionInsideSprite.x >= 0.9 || positionInsideSprite.y >= 0.9) {
        return vec4(0.0);
    }

    // Render char
    vec4 charColor = getCharSpriteColor(charIndexInSpriteGrid, positionInsideSprite);

    // Render cursor
    float isLastChar = 1.0 - step(0.5, abs(uLastCharPosition - charIndexInText));
    charColor += vec4(1.0) * uShowCursor * isLastChar * sin(time / 6.0);

    return charColor;
}

void main(void) {
    // Real point
    vec2 uv = vTextureCoord;
    vec4 currentPointColor = vec4(0.0);

    // Apply fisheye effect, and distortion effect
    // vec2 fisheyedCoords = getOffsetCoordinatesByFisheye(uv);
    // vec2 uvWithDistortion = getDistortedCoords(uv);

    // Add text
    currentPointColor += getText(uv);
    // add stripes effect
    // currentPointColor += stripes(uv);
    // apply noise texture
    // currentPointColor += noise(uv);
    // apply vignette
    // currentPointColor *= vignette(uv);
    // apply rainbow effect
    currentPointColor *= rainbow(uv);

    gl_FragColor = currentPointColor;
}
