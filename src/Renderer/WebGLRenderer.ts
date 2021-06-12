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

const MAX_SYMBOLS_COUNT = 960;
const SYMBOLS_PER_LINE = 48;
const LINES_COUNT = MAX_SYMBOLS_COUNT / SYMBOLS_PER_LINE;

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
    space: 0,
    a: 712557,
    b: 1760622,
    c: 706858,
    d: 1760110,
    e: 2018607,
    f: 2018596,
    g: 706922,
    h: 1498989,
    i: 1909911,
    j: 1872746,
    k: 1498477,
    l: 1198375,
    m: 1571693,
    n: 1760109,
    o: 711530,
    p: 711972,
    q: 711675,
    r: 1760621,
    s: 2018927,
    t: 1909906,
    u: 1497963,
    v: 1497938,
    w: 1498109,
    x: 1496429,
    y: 1496210,
    z: 2004271,
    1: 730263,
    2: 693543,
    3: 693354,
    4: 1496649,
    5: 1985614,
    6: 707946,
    7: 1873042,
    8: 709994,
    9: 710250,
    0: 711530,
    '!': 1198116,
    ',': 36,
    '-': 3584,
    '█': 2097151,
    '░': 1398101,
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

    private size: { width: number; height: number };
    private camera: OrthographicCamera;
    private scene: Scene;
    private renderer: ThreeJSRenderer;
    private material: ShaderMaterial;
    private glitchTexture: Texture;
    private uText = '';

    private vertexShader = vertexShader;
    private fragmentShader = fragmentShader;

    public render() {
        if (this.material.uniforms.time.value > 1000) {
            this.material.uniforms.time.value = 0;
        } else {
            this.material.uniforms.time.value =
                this.material.uniforms.time.value + 1;
        }
        this.material.uniformsNeedUpdate = true;
        this.renderer.render(this.scene, this.camera);
    }

    public createScreen() {
        this.glitchTexture = new Texture();
        this.glitchTexture.wrapS = RepeatWrapping;
        this.glitchTexture.wrapT = RepeatWrapping;

        const geometry = new PlaneGeometry(this.size.width, this.size.height);
        this.material = new ShaderMaterial({
            uniforms: {
                uGlitch: { value: this.glitchTexture },
                uResolution: {
                    value: new Vector2(this.size.width, this.size.height),
                },
                uText: { value: mapTextToBitMasksArray(this.uText) },
                uTextLength: { value: this.uText.length },
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

    /**
     * @param lines max 20 lines. 48 - max line length
     */
    public setLines(lines: string[]) {
        let text = '';

        const croupedLines = lines.slice(0, LINES_COUNT);

        for (let index = 0; index < croupedLines.length; index++) {
            let line = lines[index].slice(0, SYMBOLS_PER_LINE);
            // Fill all lines to line max length
            // only NOT for last line
            // Becouse we shold know, where to put input cursor
            if (index !== lines.length - 1) {
                line = line.padEnd(SYMBOLS_PER_LINE, ' ');
            }

            text += line;
        }

        this.uText = text;
        this.material.uniforms.uText.value = mapTextToBitMasksArray(this.uText);
        this.material.uniforms.uTextLength.value = this.uText.length;
        this.material.uniformsNeedUpdate = true;
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
