import { WebGLRenderer } from './WebGLRenderer';

interface IParams {
    size: {
        width: number;
        height: number;
    };
}

class Renderer {
    constructor(params: IParams) {
        this.render = this.render.bind(this);

        this.webGLRenderer = new WebGLRenderer(params);

        this.webGLRenderer.createScreen();
        this.init();
    }

    webGLRenderer: WebGLRenderer;

    private init() {
        this.render();
    }

    private render() {
        this.webGLRenderer.render();

        window.requestAnimationFrame(this.render);
    }

    public setContent(lines: string[]) {
        this.webGLRenderer.setLines(lines);
    }
}

export default Renderer;
