import catImage from '../cat.jpeg';

interface IParams {
    size: {
        width: number;
        height: number;
    };
}

const TOP_PADDING = 20;
const LEFT_PADDING = 20;

export class SVGRenderer {
    static maxSymbolsPerLine = 60;

    constructor(params: IParams) {
        this.size = params.size;

        this.createSVGNode();
        this.setLines([]);
    }

    // SVG image size
    private size: { width: number; height: number };
    private isTextureLoading = false;

    private svgNode: SVGElement;
    private chageImageListeners: Array<(image: HTMLImageElement) => void> = [];

    public addImageChageListener(listener: (image: HTMLImageElement) => void) {
        this.chageImageListeners.push(listener);
    }

    public setLines(lines: string[]) {
        const imageSrc = this.createSVGXmlSrc(this.clipLines(lines));

        const image = new Image();
        // image.src = catImage;
        image.src = imageSrc;
        image.width = this.size.width * 4;
        image.height = this.size.height * 4;
        this.isTextureLoading = true;

        image.onload = () => {
            this.chageImageListeners.forEach((listener) => {
                listener(image);
            });

            this.isTextureLoading = false;
        };
    }

    private clipLines(lines: string[]): string[] {
        return lines.reduce((acc, line) => {
            let cropedLine = line;

            while (cropedLine.length > SVGRenderer.maxSymbolsPerLine) {
                acc.push(cropedLine.slice(0, SVGRenderer.maxSymbolsPerLine));
                cropedLine = cropedLine.slice(SVGRenderer.maxSymbolsPerLine);
            }

            acc.push(cropedLine.slice(0, SVGRenderer.maxSymbolsPerLine));
            cropedLine = cropedLine.slice(SVGRenderer.maxSymbolsPerLine);

            return acc;
        }, []);
    }

    private createSVGNode() {
        this.svgNode = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        );
        this.svgNode.setAttribute('width', this.size.width + '');
        this.svgNode.setAttribute('height', this.size.height + '');
        this.svgNode.setAttribute('version', '1.1');

        this.svgNode.style.position = 'absolute';
        this.svgNode.style.zIndex = '-9999';

        document.body.appendChild(this.svgNode);
    }

    private createSVGXmlSrc(lines: string[]) {
        const textsLines = lines
            .map((line, index) => {
                return `
                    <text
                        y="${(index + 1) * 30 + TOP_PADDING}px"
                        x="${LEFT_PADDING}px"
                        fill="white"
                        font-family="ui-monospace, monospace"
                        alignment-baseline="hanging"
                        id="text"
                    >
                        ${line}
                    </text>`;
            })
            .join('');

        const svgText = `
            <svg width="778" height="1041" version="1.1"  xmlns="http://www.w3.org/2000/svg">
                ${textsLines}
            </svg>
        `;

        // const svgHtml = new XMLSerializer().serializeToString(this.svgNode);
        return 'data:image/svg+xml,' + svgText;
    }
}

export default SVGRenderer;
