import config from './config';
import fragmentShader from './fragment_shader.frag?raw';
import blurShader from './blur_shader.frag?raw';
import paintingFrameShader from './painting_frame.frag?raw';
import mergeShader from './merge_shader.frag?raw';
import copyShader from './copy_shader.frag?raw';
import vertexShader from './vertex_shader.frag?raw';
import frameImage from './frame.png?url';

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
        this.pixelRatio = window.devicePixelRatio || 1;

        const screenCanvas = document.createElement('canvas');
        screenCanvas.style.position = 'absolute';
        screenCanvas.style.top = '-1000%';
        screenCanvas.style.left = '-1000%';
        screenCanvas.style.opacity = '0';
        screenCanvas.style.clipPath = 'rect(0, 0, 0, 0)';
        document.body.appendChild(screenCanvas);

        const context2D = screenCanvas.getContext('2d');

        if (context2D === null) {
            throw new Error('Failed to get 2d context');
        }

        this.screenCanvasCtx = context2D;

        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        this.renderCanvas = canvas;
        this.setSize(params.size);

        this.screenCanvasCtx.font = `${config.fontSize}px ${fontName}`;
        this.screenCanvasCtx.fillStyle = textColor;
        this.screenCanvasCtx.textBaseline = 'top';
        const testSymbol = this.screenCanvasCtx.measureText('M');
        const symbolWidth = testSymbol.width;
        this.screenLineHeight = testSymbol.fontBoundingBoxDescent;

        const screenWidth = symbolWidth * config.symbolsPerLine;
        const screenHeight = this.screenLineHeight * config.linesCount;

        // Scale screen canvas by pixel ratio for better quality
        this.screenCanvasCtx.canvas.width = screenWidth * this.pixelRatio;
        this.screenCanvasCtx.canvas.height = screenHeight * this.pixelRatio;
        this.screenCanvasCtx.scale(this.pixelRatio, this.pixelRatio);

        const contextWebGL = this.renderCanvas.getContext('webgl', {
            antialias: true,
            alpha: false,
            preserveDrawingBuffer: false,
        });

        if (contextWebGL === null) {
            throw new Error('Failed to get webgl context');
        }

        this.gl = contextWebGL;

        this.blurTextureA = this.createTextureWithSize(
            this.renderCanvas.width,
            this.renderCanvas.height
        );
        this.blurTextureB = this.createTextureWithSize(
            this.renderCanvas.width,
            this.renderCanvas.height
        );
        this.blurFramebufferA = this.createFramebuffer(this.blurTextureA);
        this.blurFramebufferB = this.createFramebuffer(this.blurTextureB);

        this.renderProgram = this.createProgram(vertexShader, fragmentShader);
        this.blurProgram = this.createProgram(vertexShader, blurShader);
        this.mergeProgram = this.createProgram(vertexShader, mergeShader);
        this.copyProgram = this.createProgram(vertexShader, copyShader);

        this.screenTexture = this.createTexture(this.screenCanvasCtx.canvas);
        this.screenBendedTexture = this.createTextureWithSize(
            this.renderCanvas.width,
            this.renderCanvas.height
        );
        this.screenBendedFramebuffer = this.createFramebuffer(
            this.screenBendedTexture
        );
        this.paintedFrameTexture = this.createTextureWithSize(
            this.renderCanvas.width,
            this.renderCanvas.height
        );
        this.paintedFrameFramebuffer = this.createFramebuffer(
            this.paintedFrameTexture
        );
        this.paintingFrameProgram = this.createProgram(
            vertexShader,
            paintingFrameShader
        );

        this.frameTexture = this.gl.createTexture();
        const srcType = this.gl.UNSIGNED_BYTE;
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.frameTexture);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            1,
            1,
            0,
            this.gl.RGBA,
            srcType,
            // transparent image at the loading time
            new Uint8Array([0, 0, 0, 0])
        );

        const image = new Image();
        image.src = frameImage;
        image.onload = () => {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.frameTexture);
            this.gl.texImage2D(
                this.gl.TEXTURE_2D,
                0,
                this.gl.RGBA,
                this.gl.RGBA,
                srcType,
                image
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
            this.gl.texParameteri(
                this.gl.TEXTURE_2D,
                this.gl.TEXTURE_MIN_FILTER,
                this.gl.LINEAR
            );
        };

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

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        const a_position = this.gl.getAttribLocation(
            this.renderProgram,
            'a_position'
        );
        this.gl.enableVertexAttribArray(a_position);
        this.gl.vertexAttribPointer(a_position, 2, this.gl.FLOAT, false, 0, 0);
    }

    private renderCanvas: HTMLCanvasElement;
    private renderProgram: WebGLProgram;
    private mergeProgram: WebGLProgram;
    private paintingFrameProgram: WebGLProgram;
    private copyProgram: WebGLProgram;

    private blurProgram: WebGLProgram;
    private blurTextureA: WebGLTexture;
    private blurTextureB: WebGLTexture;
    private blurFramebufferA: WebGLFramebuffer;
    private blurFramebufferB: WebGLFramebuffer;

    private paintedFrameTexture: WebGLTexture;
    private paintedFrameFramebuffer: WebGLFramebuffer;

    private gl: WebGLRenderingContext;

    private screenTexture: WebGLTexture;
    private frameTexture: WebGLTexture;
    private screenBendedTexture: WebGLTexture;
    private screenBendedFramebuffer: WebGLFramebuffer;
    private screenCanvasCtx: CanvasRenderingContext2D;
    private screenLineHeight: number;
    private isRainbowEffectEnabled: boolean = false;
    private pixelRatio: number;

    public render(timeMs: number) {
        // Rendering the bended screen into the blur texture, will be used for the glow effect
        this.gl.useProgram(this.renderProgram);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.blurFramebufferB);

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

        // Rendering "clean" bended screen
        this.gl.bindFramebuffer(
            this.gl.FRAMEBUFFER,
            this.screenBendedFramebuffer
        );
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        // Text glow
        this.gl.useProgram(this.blurProgram);

        for (let i = 0; i < 8; i++) {
            [this.blurTextureA, this.blurTextureB] = [
                this.blurTextureB,
                this.blurTextureA,
            ];
            [this.blurFramebufferA, this.blurFramebufferB] = [
                this.blurFramebufferB,
                this.blurFramebufferA,
            ];

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.blurFramebufferB);

            this.gl.bindTexture(this.gl.TEXTURE_2D, this.blurTextureA);
            this.gl.uniform1i(
                this.gl.getUniformLocation(this.blurProgram, 'uTexture'),
                0
            );
            this.gl.uniform2f(
                this.gl.getUniformLocation(this.blurProgram, 'u_resolution'),
                this.renderCanvas.width,
                this.renderCanvas.height
            );
            this.gl.uniform1f(
                this.gl.getUniformLocation(this.blurProgram, 'u_blurRadius'),
                3.0
            );
            this.gl.uniform1f(
                this.gl.getUniformLocation(this.blurProgram, 'u_horizontal'),
                i % 2 === 0 ? 1 : 0
            );
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        }

        // Painting frame
        this.gl.useProgram(this.paintingFrameProgram);
        this.gl.bindFramebuffer(
            this.gl.FRAMEBUFFER,
            this.paintedFrameFramebuffer
        );

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.frameTexture);
        this.gl.uniform1i(
            this.gl.getUniformLocation(
                this.paintingFrameProgram,
                'uFrameTexture'
            ),
            0
        );
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.screenBendedTexture);
        this.gl.uniform1i(
            this.gl.getUniformLocation(
                this.paintingFrameProgram,
                'uScreenTexture'
            ),
            1
        );
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        // Merging glow texture and "clean" bended screen
        this.gl.useProgram(this.mergeProgram);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.blurTextureB);
        this.gl.uniform1i(
            this.gl.getUniformLocation(this.mergeProgram, 'uTexture1'),
            0
        );
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.screenBendedTexture);
        this.gl.uniform1i(
            this.gl.getUniformLocation(this.mergeProgram, 'uTexture2'),
            1
        );
        // Also adding the frame texture
        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.paintedFrameTexture);
        this.gl.uniform1i(
            this.gl.getUniformLocation(this.mergeProgram, 'uTexture3'),
            2
        );

        // this.gl.useProgram(this.copyProgram);
        // this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        // this.gl.activeTexture(this.gl.TEXTURE0);
        // this.gl.bindTexture(this.gl.TEXTURE_2D, this.blurTextureB);
        // this.gl.uniform1i(
        //     this.gl.getUniformLocation(this.copyProgram, 'uTexture'),
        //     0
        // );

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    public setSize(size: { width: number; height: number }) {
        const squareSize = Math.min(size.width, size.height);

        this.renderCanvas.style.width = squareSize + 'px';
        this.renderCanvas.style.height = squareSize + 'px';

        // Set actual canvas size (device pixels) for high-DPI displays
        this.renderCanvas.width = squareSize * this.pixelRatio;
        this.renderCanvas.height = squareSize * this.pixelRatio;

        if (this.gl) {
            this.gl.viewport(
                0,
                0,
                this.renderCanvas.width,
                this.renderCanvas.height
            );
        }
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
            this.gl.LINEAR
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MAG_FILTER,
            this.gl.LINEAR
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

    private createTextureWithSize(width: number, height: number) {
        this.gl.activeTexture(this.gl.TEXTURE0);
        let texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MIN_FILTER,
            this.gl.LINEAR
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MAG_FILTER,
            this.gl.LINEAR
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
            width,
            height,
            0,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            null
        );

        return texture;
    }

    private createFramebuffer(texture: WebGLTexture) {
        let framebuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
        this.gl.framebufferTexture2D(
            this.gl.FRAMEBUFFER,
            this.gl.COLOR_ATTACHMENT0,
            this.gl.TEXTURE_2D,
            texture,
            0
        );

        return framebuffer;
    }

    private createShader(type: number, src: string) {
        const s = this.gl.createShader(type);

        if (s === null) {
            throw new Error('Failed to create shader');
        }

        this.gl.shaderSource(s, src);
        this.gl.compileShader(s);
        if (!this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS))
            console.error(this.gl.getShaderInfoLog(s));
        return s;
    }

    private createProgram(vertexShader: string, fragmentShader: string) {
        const program = this.gl.createProgram();
        this.gl.attachShader(
            program,
            this.createShader(this.gl.VERTEX_SHADER, vertexShader)
        );
        this.gl.attachShader(
            program,
            this.createShader(this.gl.FRAGMENT_SHADER, fragmentShader)
        );
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error(this.gl.getProgramInfoLog(program));
        }
        return program;
    }
}

export default WebGLRenderer;
