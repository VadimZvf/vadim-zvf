import { SVGRenderer } from './SVGRenderer';
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

        this.svgRenderer = new SVGRenderer(params);
        this.webGLRenderer = new WebGLRenderer(params);

        this.webGLRenderer.createScreen();

        this.svgRenderer.addImageChageListener((image) => {
            this.webGLRenderer.updateScreenTextureMap(image);
        });

        this.init();
    }

    svgRenderer: SVGRenderer;
    webGLRenderer: WebGLRenderer;
    lines: string[] = [];

    private init() {
        this.render();
    }

    private render() {
        this.webGLRenderer.render();

        window.requestAnimationFrame(this.render);
    }

    public setContent(lines: string[]) {
        this.lines = lines;
        this.svgRenderer.setLines(this.lines);
    }

    public addLine(line: string) {
        this.lines.push(line);
        this.svgRenderer.setLines(this.lines);
    }

    public addText(text: string) {
        if (this.lines.length) {
            this.lines[this.lines.length - 1] =
                this.lines[this.lines.length - 1] + text;
        } else {
            this.lines.push(text);
        }

        this.svgRenderer.setLines(this.lines);
    }

    public getLastLine(): string {
        return this.lines.length ? this.lines[this.lines.length - 1] : '';
    }
}

export default Renderer;
