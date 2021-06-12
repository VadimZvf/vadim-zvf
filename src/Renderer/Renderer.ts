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
        this.webGLRenderer.setLines(this.lines);
    }

    public addLine(line: string) {
        this.lines.push(line);
        this.webGLRenderer.setLines(this.lines);
    }

    public addText(text: string) {
        if (this.lines.length) {
            this.lines[this.lines.length - 1] =
                this.lines[this.lines.length - 1] + text;
        } else {
            this.lines.push(text);
        }

        this.webGLRenderer.setLines(this.lines);
    }

    public getLastLine(): string {
        return this.lines.length ? this.lines[this.lines.length - 1] : '';
    }
}

export default Renderer;
