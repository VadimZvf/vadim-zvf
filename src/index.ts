import Screen from './Screen';
import Renderer from './Renderer';
import Input from './Input';
import './index.css';

function openLink(url: string) {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = url;
    link.click();
}

function init() {
    const screen = new Screen(
        new Renderer({ size: { width: 896, height: 704 } }),
        new Input()
    );

    screen.subscribeCommand((command: string) => {
        switch (command) {
            case 'help':
                screen.addContent([
                    'Available commands:',
                    '- contacts',
                    '- socials',
                    '- show me cat',
                    '- show me dog',
                    '- rainbow',
                    '- source code',
                    '- help',
                    '- clear',
                ]);
                break;
            case 'contacts':
                screen.addContent([
                    'email: vadim.zvf@gmail.com',
                    '',
                    'If U wanna write me, type: "write email"',
                ]);
                break;
            case 'write email':
                openLink('mailto:vadim.zvf@gmail.com');
                break;
            case 'socials':
                screen.addContent([
                    'Write a command to open my social:',
                    '- open vk',
                    '- open instagram',
                    '- open linkedin',
                    '- open telegram',
                ]);
                break;
            case 'open vk':
                openLink('https://vk.com/zainetdinov_vadim');
                break;
            case 'open instagram':
                openLink('https://www.instagram.com/zainetdinovvadim');
                break;
            case 'open linkedin':
                openLink(
                    'https://www.linkedin.com/in/vadim-zaynetdinov-27908417b'
                );
                break;
            case 'open telegram':
                openLink('https://t.me/vadimzvf');
                break;
            case 'source code':
                openLink('https://github.com/VadimZvf/vadim-zvf');
                break;
            case 'show me cat':
                screen.addContent([
                    '██        ██',
                    '█ █      █ █',
                    '█░ █    █ ░█',
                    '█░░ ████ ░░█',
                    '█  █    █  █',
                    '█          █     ██',
                    '█  █    █  █    █  █',
                    '█ █ █  █ █ █    █   █',
                    '█░░      ░░█     ██  █',
                    ' █   ░░   █ ███    █ █',
                    '  █      █     █   █ █',
                    '   ██████   ██  █  █ █',
                    '    █      █    ███  █',
                    '    █      █    ██   █',
                    '   ███     █    █   █',
                    '  █       █     ████',
                    '   █████████████',
                ]);
                break;
            case 'show me dog':
                screen.addContent([
                    ' ███     ███',
                    '█░░░█████░░░█',
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
            case 'rainbow':
                screen.toggleRainbowEffect();
                break;
            case 'clear':
                screen.addContent(Array(17).fill(' '));
                break;
            case 'wow':
                screen.addContent([
                    'Write a command to open my social Write a command to open my socialWrite a command to open my socialWrite a command to open my socialWrite a command to open my social:',
                    '12',
                    '11',
                ]);
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
