class Input {
    constructor() {
        this.textareaNode = document.createElement('textarea');
        this.textareaNode.style.position = 'absolute';
        this.textareaNode.style.top = '50%';
        this.textareaNode.style.left = '-999px';
        this.textareaNode.style.zIndex = '-9999';
        this.textareaNode.style.fontSize = '99px';
        this.textareaNode.style.opacity = '0';

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

    public subscribeFocusEvent(listener: () => void) {
        this.textareaNode.addEventListener('focus', () => {
            listener();
        });
    }

    public subscribeBlurEvent(listener: () => void) {
        this.textareaNode.addEventListener('blur', () => {
            listener();
        });
    }
}

export default Input;
