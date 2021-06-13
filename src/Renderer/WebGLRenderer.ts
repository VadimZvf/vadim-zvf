import {
    Scene,
    OrthographicCamera,
    WebGLRenderer as ThreeJSRenderer,
    PlaneGeometry,
    ShaderMaterial,
    Mesh,
    Texture,
    RepeatWrapping,
    Vector2,
} from 'three';
import glitchImage from '../glitch.png';
import fragmentShader from './fragment_shader.frag';
import vertexShader from './vertex_shader.frag';
import getCharGLSL1 from './get_char_by_index_gl1.frag';
import getCharGLSL2 from './get_char_by_index_gl2.frag';

const userAgent = navigator.userAgent.toLowerCase();
const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');

/**
 * Text mappink work like this:
 *
 * "A"
 * ⬇
 * ░█░
 * █░█
 * █░█
 * ███
 * █░█
 * █░█
 * █░█
 * ⬇
 * 010
 * 101
 * 101
 * 111
 * 101
 * 101
 * 101
 * ⬇
 * 010 101 101 111 101 101 101
 * ⬇
 * 712557
 */
const symbolsMapping: Record<string, number> = {
    space: 0.0,
    a: 712557.0,
    b: 1760622.0,
    c: 706858.0,
    d: 1760110.0,
    e: 2018607.0,
    f: 2018596.0,
    g: 708458.0,
    h: 1498989.0,
    i: 1909911.0,
    j: 1872746.0,
    k: 1498477.0,
    l: 1198375.0,
    m: 1571693.0,
    n: 1760109.0,
    o: 711530.0,
    p: 711972.0,
    q: 711675.0,
    r: 1760621.0,
    s: 2018927.0,
    t: 1909906.0,
    u: 1497963.0,
    v: 1497938.0,
    w: 1498109.0,
    x: 1496429.0,
    y: 1496210.0,
    z: 2004271.0,
    1: 730263.0,
    2: 693543.0,
    3: 693354.0,
    4: 1496649.0,
    5: 1985614.0,
    6: 707946.0,
    7: 1873042.0,
    8: 709994.0,
    9: 710250.0,
    0: 711530.0,
    '!': 1198116.0,
    '.': 2.0,
    ',': 36.0,
    '"': 1474560.0,
    '-': 3584.0,
    '█': 2097151.0,
    '░': 1398101.0,
    ':': 73872.0,
    '@': 708586.0, // T_T how to show this symbol?(((
    '>': 139936.0,
};

function mapTextToBitMasksArray(text: string = ''): Float32Array {
    const masks = [];

    for (let index = 0; index < text.length; index++) {
        const symbol = text[index].toLocaleLowerCase();
        const mask = symbolsMapping[symbol] || symbolsMapping.space;
        masks.push(mask);
    }

    return new Float32Array(masks);
}

interface IParams {
    size: {
        width: number;
        height: number;
    };
}

export class WebGLRenderer {
    constructor(params: IParams) {
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);

        this.scene = new Scene();
        this.camera = new OrthographicCamera(
            params.size.width / -2,
            params.size.width / 2,
            params.size.height / 2,
            params.size.height / -2,
            1,
            1000
        );
        this.camera.position.z = 1;

        this.renderer = new ThreeJSRenderer({
            antialias: true,
            canvas: canvas,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(params.size.width, params.size.height);

        this.size = params.size;
    }

    static maxSymbolsCount = 972;
    static symbolsPerLine = 54;
    static linesCount = 972 / 54;

    private size: { width: number; height: number };
    private camera: OrthographicCamera;
    private scene: Scene;
    private renderer: ThreeJSRenderer;
    private material: ShaderMaterial;
    private glitchTexture: Texture;
    private uText = '';

    private vertexShader = vertexShader;
    private fragmentShader =
        fragmentShader + (isSafari ? getCharGLSL1 : getCharGLSL2);

    public render() {
        this.material.uniforms.time.value =
            this.material.uniforms.time.value + 1;
        this.renderer.render(this.scene, this.camera);
    }

    public createScreen() {
        this.glitchTexture = new Texture();
        this.glitchTexture.wrapS = RepeatWrapping;
        this.glitchTexture.wrapT = RepeatWrapping;
        console.log(this.fragmentShader);
        const geometry = new PlaneGeometry(this.size.width, this.size.height);
        this.material = new ShaderMaterial({
            uniforms: {
                uGlitch: { value: this.glitchTexture },
                uResolution: {
                    value: new Vector2(this.size.width, this.size.height),
                },
                uText: { value: mapTextToBitMasksArray(this.uText) },
                uLastCharPosition: { value: this.uText.length },
                uShowCursor: { value: 0 },
                uShowRainbow: { value: 0 },
                time: { value: 0 },
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
        });
        const screen = new Mesh(geometry, this.material);
        screen.position.x = 0;
        screen.position.y = 0;
        screen.position.z = 0;

        this.scene.add(screen);

        this.loadGlichTexture();
    }

    public setLines(lines: string[]) {
        if (lines.length > WebGLRenderer.linesCount) {
            console.warn(
                `Too many lines - ${lines.length}. Maximum available - ${WebGLRenderer.linesCount}`
            );
        }

        let text = '';
        let lastSymbolPosition = 0;

        const croupedLines = lines.slice(0, WebGLRenderer.linesCount);

        for (let index = 0; index < croupedLines.length; index++) {
            let line = lines[index]
                .slice(0, WebGLRenderer.symbolsPerLine)
                .padEnd(WebGLRenderer.symbolsPerLine, ' ');

            text += line;

            // Fill all lines to line max length
            // only NOT for last line
            // Becouse we shold know, where to put input cursor
            if (index !== lines.length - 1) {
                lastSymbolPosition += line.length;
            } else {
                lastSymbolPosition += lines[index].length;
            }
        }

        this.uText = text;
        this.material.uniforms.uText.value = mapTextToBitMasksArray(this.uText);
        this.material.uniforms.uLastCharPosition.value = lastSymbolPosition;
    }

    public enableCursor() {
        this.material.uniforms.uShowCursor.value = 1;
    }

    public disableCursor() {
        this.material.uniforms.uShowCursor.value = 0;
    }

    public toggleRainbowEffect() {
        if (this.material.uniforms.uShowRainbow.value) {
            this.material.uniforms.uShowRainbow.value = 0;
        } else {
            this.material.uniforms.uShowRainbow.value = 1;
        }
    }

    private loadGlichTexture() {
        const image = new Image();
        image.src = glitchImage;

        image.onload = () => {
            this.glitchTexture.image = image;
            this.glitchTexture.needsUpdate = true;
        };
    }
}

export default WebGLRenderer;
