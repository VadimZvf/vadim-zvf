import Screen from './Screen';
import './index.css';

function init() {
    const screen = new Screen();

    screen.subscribeCommand((command: string) => {
        switch (command) {
            case 'help':
                screen.addContent([
                    'Available commands:',
                    '- help',
                    '- heart',
                    '- dog',
                    '- reset',
                ]);
                break;
            case 'heart':
                screen.addContent([
                    '  ████   █████',
                    ' █    █ █     █',
                    '█      █       █',
                    ' █            █',
                    '   █        █',
                    '     █    █',
                    '      █ █',
                    '       █',
                ]);
                break;
            case 'dog':
                screen.addContent([
                    ' ███     ███',
                    '█░░░█████░░░█',
                    '█░░█     █░░█',
                    '█░██  ░░░██░█',
                    ' █ █ █░█░█ █',
                    '   █  ░░░█',
                    '  █       █',
                    '  █  ███  █',
                    '  █       █    ██',
                    '   █  █  █ █   █░█',
                    '    █████  ░█   █░█',
                    '       █   ░░█   █ █',
                    '       █   ░░░█  █ █',
                    '       █ █ █░░░██   █',
                    '       █ █ █        █',
                    '       █ █ █     █  █',
                    '      █  █  █   █   █',
                    '      ███████████████',
                ]);

                break;
            case 'reset':
                screen.addContent(Array(20).fill(' '));
                break;
            default:
                break;
        }
    });

    screen.addContent([
        'HELLO!',
        'Nice to meat U!',
        'My name is Vadim and this is my petproject',
        '',
        'If U need a help, just write command - help',
        '',
    ]);
}

init();
