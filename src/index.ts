import Renderer from './Renderer';
import Input from './Input';
import './index.css';

function init() {
    const renderer = new Renderer({
        size: {
            width: 896,
            height: 600,
        },
    });

    const input = new Input();

    input.subscribeChangeEvent((text) => {
        renderer.addText(text);
    });

    input.subscribeEnterKeyEvent(() => {
        if (renderer.getLastLine() === 'help') {
            renderer.addLine('');
            renderer.addLine('WOW!');
            renderer.addLine('Its work!');
            renderer.addLine('See you next time');
        }

        if (renderer.getLastLine() === 'heart') {
            renderer.setContent([
                '  ████   █████',
                ' █    █ █     █',
                '█      █       █',
                ' █            █',
                '   █        █',
                '     █    █',
                '      █ █',
                '       █',
            ]);
        }

        if (renderer.getLastLine() === 'dog') {
            renderer.setContent([
                ' ███     ███',
                '█░░░█████░░░█',
                '█░░█     █░░█',
                '█░██  ░░░██░█',
                ' █ █ █░█░█ █',
                '   █  ░░░█',
                '  █       █',
                '  █  ███  █',
                '  █  ███  █',
                '  █       █    ██',
                '   █  █  █ █   █░█',
                '    █████  ░█   █░█',
                '       █   ░░█   █ █',
                '       █   ░░░█  █ █',
                '       █ █ █░░░██   █',
                '       █ █ █        █',
                '       █ █ █        █',
                '       █ █ █     █  █',
                '      █  █  █   █   █',
                '      ███████████████',
            ]);
        }

        if (renderer.getLastLine() === 'reset') {
            renderer.setContent(Array(20).fill(' '));

            /// (T_T)
            setTimeout(() => {
                renderer.setContent([]);
            }, 50);
        }

        renderer.addLine('');
    });

    renderer.setContent([
        'HELLO!',
        'Nice to meat U!',
        'My name is Vadim and this is my petproject',
        '',
        'If U need a help, just write command - help',
        '',
    ]);
}

init();
