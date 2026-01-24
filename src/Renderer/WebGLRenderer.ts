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
    MirroredRepeatWrapping,
    RGBAFormat,
    Vector2,
    MeshBasicMaterial,
    UVMapping,
    UnsignedByteType,
} from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import glitchImage from '../glitch.png?url';
import textSpriteImage from './text_sprite.png?url';
import config from './config';
import mac from './models/fbx/mac.fbx?url';
import fragmentShader from './fragment_shader.frag?raw';
import vertexShader from './vertex_shader.frag?raw';

const availableSymbols =
    '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя█░ ';

/// OMG OMG!!
// We send text data to shader as Texture!
// because text is so long, and not all browsers allow use such long Arrays in shader
function mapTextToBitMasksArray(text: string = ''): DataTexture {
    const width = text.length + 1;
    const data = new Uint8Array(4 * width);

    for (let index = 0; index < text.length; index++) {
        const symbolPosition = availableSymbols.indexOf(text[index]);
        const stride = index * 4;
        data[stride] = symbolPosition;
        data[stride + 1] = 0;
        data[stride + 2] = 0;
        data[stride + 3] = 255;
    }

    data[text.length * 4] = 0;
    data[text.length * 4 + 1] = 0;
    data[text.length * 4 + 2] = 0;
    data[text.length * 4 + 3] = 255;

    const dataTexture = new DataTexture(
        data,
        width,
        1,
        RGBAFormat,
        UnsignedByteType,
        UVMapping,
        MirroredRepeatWrapping,
        MirroredRepeatWrapping
    );
    dataTexture.needsUpdate = true;

    return dataTexture;
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
        this.renderer.setClearColor(0xdef8ff);
        this.renderer.setSize(params.size.width, params.size.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

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
    private textSpriteTexture: Texture;

    private vertexShader = vertexShader;
    private fragmentShader = fragmentShader;

    public render() {
        this.material.uniforms.time.value =
            this.material.uniforms.time.value + 1;
        this.renderer.render(this.scene, this.camera);
    }

    public setSize(size: { width: number; height: number }) {
        this.camera.aspect = size.width / size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(size.width, size.height);
    }

    public createScreen() {
        this.glitchTexture = new Texture();
        this.glitchTexture.wrapS = RepeatWrapping;
        this.glitchTexture.wrapT = RepeatWrapping;
        this.textSpriteTexture = new Texture();

        const screenBackgroundGeometry = new PlaneGeometry(896, 704);
        const screenBackgroundMaterial = new MeshBasicMaterial({
            color: 0x000000,
        });
        const screenBackground = new Mesh(
            screenBackgroundGeometry,
            screenBackgroundMaterial
        );

        const geometry = new PlaneGeometry(896, 704);
        this.material = new ShaderMaterial({
            uniforms: {
                uGlitch: { value: this.glitchTexture },
                uTextSprite: { value: this.textSpriteTexture },
                uTextTexture: {
                    value: mapTextToBitMasksArray(
                        ' '.repeat(config.symbolsPerLine * config.linesCount)
                    ),
                },
                uResolution: {
                    value: new Vector2(896, 704),
                },
                uSymbolsPerLineOnScreen: { value: config.symbolsPerLine },
                uLinesCountOnScreen: { value: config.linesCount },
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
        screen.scale.x = 0.24;
        screen.scale.y = 0.24;
        screen.scale.z = 0.22;
        screen.rotation.x = -Math.PI / 25;
        screen.rotation.y = 0;
        screen.rotation.z = 0;

        screenBackground.position.set(
            screen.position.x,
            screen.position.y,
            screen.position.z - 0.01
        );
        screenBackground.scale.set(
            screen.scale.x + 0.05,
            screen.scale.y + 0.05,
            screen.scale.z + 0.05
        );
        screenBackground.rotation.set(
            screen.rotation.x,
            screen.rotation.y,
            screen.rotation.z
        );

        this.scene.add(screenBackground);
        this.scene.add(screen);

        const loader = new FBXLoader();
        loader.load(mac, (object) => {
            console.log(object);
            object.traverse(function (child) {
                if (child instanceof Mesh && child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    // Fix for negative material indices in FBX
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material = child.material.filter(
                                (mat) => mat !== null && mat !== undefined
                            );
                        }
                    }
                }
            });
            object.scale.x = 0.4;
            object.scale.y = 0.4;
            object.scale.z = 0.4;
            this.scene.add(object);
        });

        this.loadGlichTexture();
        this.loadTextSpriteTexture();
    }

    public setLines(lines: string[]) {
        if (lines.length > config.linesCount) {
            console.warn(
                `Too many lines - ${lines.length}. Maximum available - ${config.linesCount}`
            );
        }

        let text = '';
        let lastSymbolPosition = 0;

        const croppedLines = lines.slice(0, config.linesCount);

        for (let index = 0; index < croppedLines.length; index++) {
            let line = lines[index].padEnd(config.symbolsPerLine, ' ');

            if (line.length > config.symbolsPerLine) {
                console.warn(
                    `Too many symbols - ${line.length}. Line can contain maximum - ${config.symbolsPerLine}`
                );
            }

            text += line;

            // Fill all lines to line max length
            // only NOT for last line
            // Because we should know, where to put input cursor
            if (index !== lines.length - 1) {
                lastSymbolPosition += line.length;
            } else {
                lastSymbolPosition += lines[index].length;
            }
        }

        const allScreen = text.padEnd(
            config.linesCount * config.symbolsPerLine,
            ' '
        );

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

    private async loadGlichTexture() {
        const image = await this.loadImage(glitchImage);
        this.glitchTexture.image = image;
        this.glitchTexture.needsUpdate = true;
    }

    private async loadTextSpriteTexture() {
        const image = await this.loadImage(textSpriteImage);
        this.textSpriteTexture.image = image;
        this.textSpriteTexture.needsUpdate = true;
    }

    private async loadImage(path: string): Promise<HTMLImageElement> {
        return new Promise((resolve) => {
            const image = new Image();
            image.src = path;

            image.onload = () => {
                resolve(image);
            };
        });
    }

    private handleMouseMove(event: MouseEvent) {
        const mouseX = (event.clientX - window.innerWidth / 2) / 5;
        const mouseY = (event.clientY - window.innerHeight / 2) / 5;

        this.camera.position.x += mouseX - this.camera.position.x;
        this.camera.position.y += -mouseY - this.camera.position.y;
        this.camera.lookAt(this.scene.position);
    }
}

export default WebGLRenderer;
