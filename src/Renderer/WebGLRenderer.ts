import {
    Scene,
    PerspectiveCamera,
    PointLight,
    AmbientLight,
    WebGLRenderer as ThreeJSRenderer,
    PlaneGeometry,
    ShaderMaterial,
    Mesh,
    Texture,
    RepeatWrapping,
    Vector2,
    MeshBasicMaterial,
    CanvasTexture,
} from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import glitchImage from '../glitch.png?url';
import config from './config';
import mac from './models/fbx/mac.fbx?url';
import fragmentShader from './fragment_shader.frag?raw';
import vertexShader from './vertex_shader.frag?raw';

interface IParams {
    size: {
        width: number;
        height: number;
    };
}

export class WebGLRenderer {
    constructor(params: IParams) {
        this.handleMouseMove = this.handleMouseMove.bind(this);

        const screenCanvas = document.createElement('canvas');
        screenCanvas.style.position = 'absolute';
        screenCanvas.style.top = '-100%';
        screenCanvas.style.left = '-100%';
        screenCanvas.style.opacity = '0';
        document.body.appendChild(screenCanvas);
        this.screenCanvasCtx = screenCanvas.getContext('2d');

        this.screenCanvasCtx.font = `${config.fontSize}px monospace`;
        this.screenCanvasCtx.fillStyle = 'white';
        this.screenCanvasCtx.textBaseline = 'top';
        const testSymbol = this.screenCanvasCtx.measureText('M');
        const symbolWidth = testSymbol.width;
        this.screenLineHeight =
            testSymbol.fontBoundingBoxDescent +
            testSymbol.fontBoundingBoxAscent;
        const screenWidth = symbolWidth * config.symbolsPerLine;
        const screenHeight = this.screenLineHeight * config.linesCount;

        screenCanvas.width = screenWidth;
        screenCanvas.height = screenHeight;

        this.screenTexture = new CanvasTexture(screenCanvas);

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
    private screenTexture: CanvasTexture;
    private screenCanvasCtx: CanvasRenderingContext2D;
    private screenLineHeight: number;

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
                uScreenTexture: { value: this.screenTexture },
                uResolution: {
                    value: new Vector2(896, 704),
                },
                uSymbolsPerLineOnScreen: { value: config.symbolsPerLine },
                uLinesCountOnScreen: { value: config.linesCount },
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
            object.scale.x = 0.4;
            object.scale.y = 0.4;
            object.scale.z = 0.4;
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

        this.screenCanvasCtx.clearRect(
            0,
            0,
            this.screenCanvasCtx.canvas.width,
            this.screenCanvasCtx.canvas.height
        );

        this.screenCanvasCtx.font = `${config.fontSize}px monospace`;
        this.screenCanvasCtx.fillStyle = 'white';
        this.screenCanvasCtx.textBaseline = 'top';

        const croppedLines = lines.slice(0, config.linesCount);

        for (let index = 0; index < croppedLines.length; index++) {
            let line = lines[index];

            if (line.length > config.symbolsPerLine) {
                console.warn(
                    `Too many symbols - ${line.length}. Line can contain maximum - ${config.symbolsPerLine}`
                );
            }

            this.screenCanvasCtx.fillText(
                line,
                0,
                this.screenLineHeight * index
            );
        }

        this.screenTexture.needsUpdate = true;
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
