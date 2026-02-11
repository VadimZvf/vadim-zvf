import createProgram from '../createProgram';
import { ISystem } from '../OS';

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

export default createProgram('show', function* (args, system) {
    const [imageName] = args;

    if (imageName) {
        show(imageName, system);
        return;
    } else {
        system.write([
            'I can show you a cat or a dog. who do you want to see?',
        ]);
    }

    const nextCommands: string[] = yield system.requestText({
        arrowText: 'name:',
    });
    show(nextCommands[0], system);
});
