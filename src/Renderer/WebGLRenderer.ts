import {
    Scene,
    OrthographicCamera,
    WebGLRenderer as ThreeJSRenderer,
    PlaneGeometry,
    ShaderMaterial,
    Mesh,
    Texture,
    RepeatWrapping,
} from 'three';
import glitchImage from '../glitch.png';
import fragmentShader from './fragment_shader.frag';
import vertexShader from './vertex_shader.frag';

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
    private texture: Texture;
    private glitchTexture: Texture;

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
        this.texture = new Texture();
        this.glitchTexture = new Texture();
        this.glitchTexture.wrapS = RepeatWrapping;
        this.glitchTexture.wrapT = RepeatWrapping;

        const geometry = new PlaneGeometry(this.size.width, this.size.height);
        this.material = new ShaderMaterial({
            uniforms: {
                uSampler: { value: this.texture },
                uGlitch: { value: this.glitchTexture },
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

    public updateScreenTextureMap(image: HTMLImageElement) {
        if (!this.texture) {
            throw new Error(
                'U need to create screen before update them texture!'
            );
        }

        this.texture.image = image;
        this.texture.needsUpdate = true;
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
