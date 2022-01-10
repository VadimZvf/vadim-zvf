import {
    Scene,
    PerspectiveCamera,
    PointLight,
    AmbientLight,
    WebGLRenderer as ThreeJSRenderer,
    PlaneGeometry,
    ShaderMaterial,
    DataTexture,
    Mesh,
    Texture,
    RepeatWrapping,
    Vector2,
    RGBAFormat,
} from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import glitchImage from '../glitch.png';
import config from './config';
import mac from './models/fbx/mac.fbx';
import fragmentShader from './fragment_shader.frag';
import vertexShader from './vertex_shader.frag';

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
    g: 708458,
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
    '.': 2,
    ',': 36,
    '"': 1474560,
    '-': 3584,
    '█': 2097151,
    '░': 1398101,
    ':': 73872,
    '(': 346385,
    ')': 1118804,
    '@': 708586, // T_T how to show this symbol?(((
    '>': 139936,
    '?': 693378,
    '/': 304292,
};

/// OMG OMG!!
// We send text data to shader as Texture!
// because text is so long, and not all browsers allow use such long Arrays in shader
function mapTextToBitMasksArray(text: string = ''): DataTexture {
    const masks: number[] = [];

    for (let index = 0; index < text.length; index++) {
        const symbol = text[index].toLocaleLowerCase();
        const mask = symbolsMapping[symbol] || symbolsMapping.space;
        // color can contain maximum 255 value(
        // thats why we should split number to small parts
        const path1 = (mask & 0b111111000000000000000) >> 15;
        const path2 = (mask & 0b000000111111000000000) >> 9;
        const path3 = (mask & 0b000000000000111111000) >> 3;
        const path4 = mask & 0b000000000000000000111;

        masks.push(path1, path2, path3, path4);
    }

    // Fix float value rounting in GLSL(
    masks.push(0, 0, 0, 0);

    return new DataTexture(
        new Uint8Array(masks),
        config.maxSymbolsCount + 1,
        1,
        RGBAFormat
    );
}

interface IParams {
    size: {
        width: number;
        height: number;
    };
}

export class WebGLRenderer {
    constructor(params: IParams) {
        this.handleMouseMove = this.handleMouseMove.bind(this);

        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);

        this.scene = new Scene();
        this.camera = new PerspectiveCamera(
            70,
            params.size.width / params.size.height,
            1,
            2000 
        );
        this.camera.position.z = 460;
        this.camera.lookAt(this.scene.position);
        this.camera.updateProjectionMatrix();

        this.renderer = new ThreeJSRenderer({
            canvas: canvas,
        });
        this.renderer.setSize(params.size.width, params.size.height);

        const ambientLight = new AmbientLight(0xcccccc, 0.7);
        this.scene.add(ambientLight);

        const pointLight = new PointLight(0xffffff, 0.8);
        pointLight.position.y = 260;
        pointLight.position.z = 20;
        this.camera.add(pointLight);
        this.scene.add(this.camera);

        document.addEventListener('mousemove', this.handleMouseMove);
    }

    private camera: PerspectiveCamera;
    private scene: Scene;
    private renderer: ThreeJSRenderer;
    private material: ShaderMaterial;
    private glitchTexture: Texture;

    private vertexShader = vertexShader;
    private fragmentShader = fragmentShader;

    public render() {
        this.material.uniforms.time.value =
            this.material.uniforms.time.value + 1;
        this.renderer.render(this.scene, this.camera);
    }

    public setSize(size: { width: number, height: number }) {
        console.log('set size', size);
        this.camera.aspect = size.width / size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(size.width, size.height);
    }

    public createScreen() {
        this.glitchTexture = new Texture();
        this.glitchTexture.wrapS = RepeatWrapping;
        this.glitchTexture.wrapT = RepeatWrapping;

        const geometry = new PlaneGeometry(896, 704);
        this.material = new ShaderMaterial({
            uniforms: {
                uGlitch: { value: this.glitchTexture },
                uResolution: {
                    value: new Vector2(896, 704),
                },
                uTextTexture: { value: mapTextToBitMasksArray('') },
                uLastCharPosition: { value: 0 },
                uShowCursor: { value: 0 },
                uShowRainbow: { value: 0 },
                time: { value: 0 },
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
        });
        const screen = new Mesh(geometry, this.material);
        screen.position.x = 0;
        screen.position.y = 67;
        screen.position.z = 128;
        screen.scale.x = 0.27
        screen.scale.y = 0.27
        screen.scale.z = 0.22
        screen.rotation.x = -Math.PI / 25
        screen.rotation.y = 0
        screen.rotation.z = 0

        this.scene.add(screen);

        const loader = new FBXLoader();
        loader.load(mac, object => {
            object.traverse( function ( child ) {
                if (child instanceof Mesh && child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            object.scale.x = 0.4
            object.scale.y = 0.4
            object.scale.z = 0.4
            this.scene.add(object);
        });
       
        this.loadGlichTexture();
    }

    public setLines(lines: string[]) {
        if (lines.length > config.linesCount) {
            console.warn(
                `Too many lines - ${lines.length}. Maximum available - ${config.linesCount}`
            );
        }

        let text = '';
        let lastSymbolPosition = 0;

        const croupedLines = lines.slice(0, config.linesCount);

        for (let index = 0; index < croupedLines.length; index++) {
            let line = lines[index].padEnd(config.symbolsPerLine, ' ');

            if (line.length > config.symbolsPerLine) {
                console.warn(
                    `Too many symbols - ${line.length}. Line can contain maximum - ${config.symbolsPerLine}`
                );
            }

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

        const allScreen = text.padEnd(config.maxSymbolsCount, ' ');

        this.material.uniforms.uTextTexture.value =
            mapTextToBitMasksArray(allScreen);
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

    private handleMouseMove(event: MouseEvent) {
        const mouseX = (event.clientX - (window.innerWidth / 2)) / 5;
        const mouseY = (event.clientY - (window.innerHeight / 2)) / 5;

        this.camera.position.x += (mouseX - this.camera.position.x);
        this.camera.position.y += (-mouseY - this.camera.position.y);
        this.camera.lookAt(this.scene.position);
    }
}

export default WebGLRenderer;
