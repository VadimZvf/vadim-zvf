import rendererConfig from '../Renderer/config';

export interface IRenderer {
    setContent(lines: string[]): void;
    enableCursor(): void;
    disableCursor(): void;
    toggleRainbowEffect(): void;
}

export interface IInput {
    subscribeChangeEvent(listener: (text: string) => void): void;
    subscribeBackspaceKeyEvent(listener: () => void): void;
    subscribeEnterKeyEvent(listener: () => void): void;
    subscribeFocusEvent(listener: () => void): void;
    subscribeBlurEvent(listener: () => void): void;
}

/**
 * Class that contain all interface logic
 * - Handling events
 * - loop visible lines
 * - trigger commands
 */
export default class Screen {
    constructor(renderer: IRenderer, input: IInput) {
        this.onType = this.onType.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onEnter = this.onEnter.bind(this);

        this.renderer = renderer;

        this.input = input;
        this.input.subscribeChangeEvent(this.onType);
        this.input.subscribeBackspaceKeyEvent(this.onDelete);
        this.input.subscribeFocusEvent(this.onFocus);
        this.input.subscribeBlurEvent(this.onBlur);
        this.input.subscribeEnterKeyEvent(this.onEnter);
        this.commandListeners = [];
    }

    private renderer: IRenderer;
    private input: IInput;
    private commandListeners: Array<(command: string) => void>;

    // Screen text contet
    private content: string[] = [];
    // Text that user is typing
    private typedText: string = '>';

    public subscribeCommand(listener: (command: string) => void) {
        this.commandListeners.push(listener);
    }

    public addContent(lines: string[]) {
        const newLines = [];

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];

            // Crop long lines into parts
            if (line.length > rendererConfig.symbolsPerLine) {
                newLines.push(line.slice(0, rendererConfig.symbolsPerLine));
                lines[index] = line.slice(rendererConfig.symbolsPerLine);
                index--;
            } else {
                newLines.push(line);
            }
        }

        this.content = this.content.concat(newLines);

        this.checkLinesCount();
        this.updateRenderer();
    }

    public clear() {
        this.content = Array(17).fill(' ');
        this.checkLinesCount();
        this.updateRenderer();
    }

    public toggleRainbowEffect() {
        this.renderer.toggleRainbowEffect();
    }

    private onType(text: string) {
        if (
            // +1 so that the cursor does not run to a new line
            this.typedText.length + text.length + 1 <=
            rendererConfig.symbolsPerLine
        ) {
            this.typedText += text;

            this.checkLinesCount();
            this.updateRenderer();
        }
    }

    private onDelete() {
        // Save input symbol
        if (this.typedText !== '>') {
            this.typedText = this.typedText.substring(
                0,
                this.typedText.length - 1
            );

            this.updateRenderer();
        }
    }

    private onEnter() {
        // Remove ">" from command
        const command = this.typedText.substring(1);
        this.typedText = '>';
        this.updateRenderer();

        for (const listener of this.commandListeners) {
            listener(command.toLocaleLowerCase());
        }
    }

    private onFocus() {
        this.renderer.enableCursor();
    }

    private onBlur() {
        this.renderer.disableCursor();
    }

    private checkLinesCount() {
        // If typed text is not empty, we shoult remove one more line
        // because we wonna show typed line
        if (this.content.length >= rendererConfig.linesCount) {
            this.content = this.content.slice(
                this.content.length - rendererConfig.linesCount + 1
            );
        }
    }

    private updateRenderer() {
        if (this.typedText.length) {
            this.renderer.setContent([...this.content, this.typedText]);
        } else {
            this.renderer.setContent(this.content);
        }
    }
}
