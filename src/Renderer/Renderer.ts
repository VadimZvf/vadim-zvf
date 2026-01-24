import { WebGLRenderer } from './WebGLRenderer';

class Renderer {
    constructor() {
        this.render = this.render.bind(this);
        this.handleResize = this.handleResize.bind(this);

        const size = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        this.webGLRenderer = new WebGLRenderer({ size });

        this.webGLRenderer.createScreen();
        this.init();
    }

    webGLRenderer: WebGLRenderer;

    private init() {
        window.addEventListener('resize', this.handleResize);

        this.render();
    }

    private render() {
        this.webGLRenderer.render();

        window.requestAnimationFrame(this.render);
    }

    private handleResize() {
        const size = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
        this.webGLRenderer.setSize(size);
    }

    public setContent(lines: string[]) {
        this.webGLRenderer.setLines(lines);
    }

    public toggleRainbowEffect() {
        this.webGLRenderer.toggleRainbowEffect();
    }
}

export default Renderer;
