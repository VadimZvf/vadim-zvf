import config from './config';
import fragmentShader from './fragment_shader.frag?raw';
import vertexShader from './vertex_shader.frag?raw';

const fontName = 'monospace';
const textColor = '#fff';

interface IParams {
    size: {
        width: number;
        height: number;
    };
}

export class WebGLRenderer {
    constructor(params: IParams) {
        const screenCanvas = document.createElement('canvas');
        screenCanvas.style.position = 'absolute';
        screenCanvas.style.top = '-100%';
        screenCanvas.style.left = '-100%';
        screenCanvas.style.opacity = '0';
        document.body.appendChild(screenCanvas);
        this.screenCanvasCtx = screenCanvas.getContext('2d');

        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        this.renderCanvas = canvas;
        this.setSize(params.size);
    }

    private renderCanvas: HTMLCanvasElement;
    private renderProgram: WebGLProgram;
    private gl: WebGLRenderingContext;

    private screenTexture: WebGLTexture;
    private screenCanvasCtx: CanvasRenderingContext2D;
    private screenLineHeight: number;
    private isRainbowEffectEnabled: boolean = false;

    public render(timeMs: number) {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.screenTexture);
        this.gl.uniform1i(
            this.gl.getUniformLocation(this.renderProgram, 'uScreenTexture'),
            0
        );

        this.gl.uniform1f(
            this.gl.getUniformLocation(this.renderProgram, 'uShowRainbow'),
            this.isRainbowEffectEnabled ? 1 : 0
        );

        this.gl.uniform1f(
            this.gl.getUniformLocation(this.renderProgram, 'time'),
            timeMs / 100
        );
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    public setSize(size: { width: number; height: number }) {
        const squareSize = Math.min(size.width, size.height);

        this.renderCanvas.width = squareSize;
        this.renderCanvas.height = squareSize;
    }

    public createScreen() {
        this.screenCanvasCtx.font = `${config.fontSize}px ${fontName}`;
        this.screenCanvasCtx.fillStyle = textColor;
        this.screenCanvasCtx.textBaseline = 'top';
        const testSymbol = this.screenCanvasCtx.measureText('M');
        const symbolWidth = testSymbol.width;
        this.screenLineHeight = testSymbol.fontBoundingBoxDescent;

        const screenWidth = symbolWidth * config.symbolsPerLine;
        const screenHeight = this.screenLineHeight * config.linesCount;

        this.screenCanvasCtx.canvas.width = screenWidth;
        this.screenCanvasCtx.canvas.height = screenHeight;

        this.gl = this.renderCanvas.getContext('webgl');

        const vertices = new Float32Array([
            // bottom left
            -1, -1,
            // bottom right
            1, -1,
            // top left
            -1, 1,
            // top right
            1, 1,
        ]);

        this.renderProgram = this.gl.createProgram();
        this.gl.attachShader(
            this.renderProgram,
            this.createShader(this.gl.VERTEX_SHADER, vertexShader)
        );
        this.gl.attachShader(
            this.renderProgram,
            this.createShader(this.gl.FRAGMENT_SHADER, fragmentShader)
        );
        this.gl.linkProgram(this.renderProgram);

        this.gl.useProgram(this.renderProgram);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        const a_position = this.gl.getAttribLocation(
            this.renderProgram,
            'a_position'
        );
        this.gl.enableVertexAttribArray(a_position);
        this.gl.vertexAttribPointer(a_position, 2, this.gl.FLOAT, false, 0, 0);

        const screenCanvas = this.screenCanvasCtx.canvas;
        this.screenTexture = this.createTexture(screenCanvas);
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

        this.screenCanvasCtx.rect(
            0,
            0,
            this.screenCanvasCtx.canvas.width,
            this.screenCanvasCtx.canvas.height
        );
        this.screenCanvasCtx.fillStyle = 'black';
        this.screenCanvasCtx.fill();

        this.screenCanvasCtx.font = `${config.fontSize}px ${fontName}`;
        this.screenCanvasCtx.fillStyle = textColor;
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

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.screenTexture);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

        this.gl.texSubImage2D(
            this.gl.TEXTURE_2D,
            0,
            0,
            0,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            this.screenCanvasCtx.canvas
        );
    }

    public toggleRainbowEffect() {
        this.isRainbowEffectEnabled = !this.isRainbowEffectEnabled;
    }

    private createTexture(source: HTMLCanvasElement) {
        this.gl.activeTexture(this.gl.TEXTURE0);
        let texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MIN_FILTER,
            this.gl.NEAREST
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MAG_FILTER,
            this.gl.NEAREST
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_WRAP_S,
            this.gl.CLAMP_TO_EDGE
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_WRAP_T,
            this.gl.CLAMP_TO_EDGE
        );
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            source
        );

        return texture;
    }

    private createShader(type: number, src: string) {
        const s = this.gl.createShader(type);
        this.gl.shaderSource(s, src);
        this.gl.compileShader(s);
        if (!this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS))
            console.error(this.gl.getShaderInfoLog(s));
        return s;
    }
}

export default WebGLRenderer;
