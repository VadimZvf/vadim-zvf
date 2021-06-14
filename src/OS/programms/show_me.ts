import { ISystem, IProgramIterator } from '../OS';

export const name = 'show-me';

function show(imageName: string, system: ISystem) {
    switch (imageName) {
        case 'cat':
            system.addContent([
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
        case 'dog':
            system.addContent([
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
        default:
            system.addContent(['Unknown name']);
            break;
    }
}

export default function* (
    args: string[] = [],
    system: ISystem
): IProgramIterator {
    const [imageName] = args;

    if (imageName) {
        show(imageName, system);
        return;
    } else {
        system.addContent([
            'I can show you a cat or a dog. who do you want to see?',
        ]);
    }

    const nextCommands: string[] = yield;
    show(nextCommands[0], system);
}
