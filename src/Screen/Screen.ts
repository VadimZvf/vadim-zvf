import Renderer from '../Renderer';
import WebGLRenderer from '../Renderer/WebGLRenderer';
import Input from '../Input';

/**
 * Class that contain all interface logic
 * - Handling events
 * - loop visible lines
 * - trigger commands
 */
export default class Screen {
    constructor() {
        this.onType = this.onType.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onEnter = this.onEnter.bind(this);

        this.renderer = new Renderer({
            size: {
                width: 896,
                height: 704,
            },
        });

        this.input = new Input();
        this.input.subscribeChangeEvent(this.onType);
        this.input.subscribeBackspaceKeyEvent(this.onDelete);
        this.input.subscribeEnterKeyEvent(this.onEnter);
        this.commandListeners = [];
    }

    private renderer: Renderer;
    private input: Input;
    private commandListeners: Array<(command: string) => void>;

    // Screen text contet
    private content: string[] = [];
    // Text that user is typing
    private typedText: string = '>';

    public subscribeCommand(listener: (command: string) => void) {
        this.commandListeners.push(listener);
    }

    public addContent(lines: string[]) {
        this.content = this.content.concat(lines);

        this.checkLinesCount();
        this.updateRenderer();
    }

    private onType(text: string) {
        this.typedText += text;

        this.checkLinesCount();
        this.updateRenderer();
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
            listener(command);
        }
    }

    private checkLinesCount() {
        if (this.typedText.length > 1) {
            // If typed text is not empty, we shoult remove one more line
            // because we wonna show typed line
            if (this.content.length >= WebGLRenderer.linesCount) {
                this.content = this.content.slice(
                    this.content.length - WebGLRenderer.linesCount + 1
                );
            }

            return;
        }

        if (this.content.length > WebGLRenderer.linesCount) {
            this.content = this.content.slice(
                this.content.length - WebGLRenderer.linesCount
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
