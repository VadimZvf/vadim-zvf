const isAndroid = /Android/i.test(navigator.userAgent);

class Input {
    constructor() {
        this.textareaNode = document.createElement('textarea');
        this.textareaNode.autocapitalize = 'off';
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
        if (isAndroid) {
            document.addEventListener('input', (event) => {
                // @ts-ignore
                const char: string = event.data;
                if (char) {
                    listener(char);
                }

                this.textareaNode.value = '';
            });
        } else {
            this.textareaNode.addEventListener('keydown', (event) => {
                if (event.key && event.key.length === 1) {
                    listener(event.key);

                    this.textareaNode.value = '';
                }
            });
        }
    }

    public subscribeBackspaceKeyEvent(listener: () => void) {
        this.textareaNode.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace') {
                listener();
            }
            this.textareaNode.value = '';
        });
    }

    public subscribeEnterKeyEvent(listener: () => void) {
        this.textareaNode.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
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
