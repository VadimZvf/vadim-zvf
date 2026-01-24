import rendererConfig from '../Renderer/config';

export interface IRenderer {
    setContent(lines: string[]): void;
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

        window.requestAnimationFrame(this.update.bind(this));
    }

    private renderer: IRenderer;
    private input: IInput;
    private commandListeners: Array<(command: string) => void>;

    private static defaultInputArrow = '>';
    private static cursorSymbol = '█';
    private static cursorBlinkInterval = 500;

    // Screen text contet
    private content: string[] = [];
    // Text that user is typing
    private typedText: string = '';
    // Some symbol, or text before typed text
    private inputArrow: string = Screen.defaultInputArrow;
    private isFocused: boolean = false;
    private cursorVisible: boolean = false;

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

    public setInputArrow(newArrow: string) {
        this.inputArrow = newArrow;
        this.updateRenderer();
    }

    public resetInputArrow() {
        if (this.inputArrow !== Screen.defaultInputArrow) {
            this.inputArrow = Screen.defaultInputArrow;
            this.updateRenderer();
        }
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
        if (this.typedText.length > 0) {
            this.typedText = this.typedText.substring(
                0,
                this.typedText.length - 1
            );

            this.updateRenderer();
        }
    }

    private onEnter() {
        const _typedText = this.typedText;
        this.typedText = '';
        this.updateRenderer();

        for (const listener of this.commandListeners) {
            listener(_typedText.toLocaleLowerCase());
        }
    }

    private onFocus() {
        this.isFocused = true;
        this.updateRenderer();
    }

    private onBlur() {
        this.isFocused = false;
        this.updateRenderer();
    }

    private checkLinesCount() {
        // We should remove one more line
        // because we wont to show typed line
        if (this.content.length >= rendererConfig.linesCount) {
            this.content = this.content.slice(
                this.content.length - rendererConfig.linesCount + 1
            );
        }
    }

    private update(time: number) {
        if (this.isFocused) {
            this.cursorVisible =
                Math.floor(time / Screen.cursorBlinkInterval) % 2 === 0;
            this.updateRenderer();
        }

        window.requestAnimationFrame(this.update.bind(this));
    }

    private updateRenderer() {
        const content = this.content.concat([
            `${this.inputArrow}${this.typedText}${this.cursorVisible ? Screen.cursorSymbol : ''}`,
        ]);

        this.renderer.setContent(content);
    }
}
