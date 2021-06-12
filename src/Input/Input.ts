class Input {
    constructor() {
        this.textareaNode = document.createElement('textarea');
        this.textareaNode.style.position = 'absolute';
        this.textareaNode.style.top = '-999px';
        this.textareaNode.style.left = '-999px';
        this.textareaNode.style.zIndex = '-9999';

        document.body.appendChild(this.textareaNode);

        this.subscribeEvents();
    }

    private textareaNode: HTMLTextAreaElement;

    private subscribeEvents() {
        document.addEventListener('click', () => {
            this.textareaNode.focus();
        });
    }

    public subscribeChangeEvent(listener: (text: string) => void) {
        this.textareaNode.addEventListener('keyup', (event) => {
            if (
                event.currentTarget instanceof HTMLTextAreaElement &&
                event.keyCode !== 13
            ) {
                listener(event.currentTarget.value);

                this.textareaNode.value = '';
            }
        });
    }

    public subscribeBackspaceKeyEvent(listener: () => void) {
        this.textareaNode.addEventListener('keyup', (event) => {
            if (event.keyCode === 8) {
                listener();
            }
            this.textareaNode.value = '';
        });
    }

    public subscribeEnterKeyEvent(listener: () => void) {
        this.textareaNode.addEventListener('keyup', (event) => {
            if (event.keyCode === 13) {
                listener();
            }
            this.textareaNode.value = '';
        });
    }
}

export default Input;
