import OS, { IScreen } from './OS';
import { IProgramDefinition } from './createProgram';

const fakeScreen: IScreen = {
    subscribeCommand() {},
    subscribeKeyDown: () => () => {},
    toggleRainbowEffect() {},
    addContent() {},
    resetInputArrow() {},
    setInputArrow() {},
    clear() {},
};

test('Should run recived program', () => {
    const program = {
        name: 'foo',
        program: jest.fn(),
    };

    let runCommand = (cmd: string) => {};

    const os = new OS(
        {
            ...fakeScreen,
            subscribeCommand: (cb) => {
                runCommand = cb;
            },
        },
        [program]
    );
    os.runProgramm('foo', []);
    os.runProgramm('bar', []);
    os.runProgramm('baz', []);

    expect(program.program).toHaveBeenCalledTimes(1);

    runCommand('foo');
    runCommand('bar');
    runCommand('baz');

    expect(program.program).toHaveBeenCalledTimes(2);
});

test('Should recive control for only one program', () => {
    const program: IProgramDefinition = {
        name: 'foo',
        program: function* (arg, system) {
            system.clear();
            yield;
            system.clear();
            yield;
        },
    };

    const program2 = {
        name: 'bar',
        program: jest.fn(),
    };

    let runCommand = (cmd: string) => {};

    const screen = {
        ...fakeScreen,
        clear: jest.fn(),
        subscribeCommand: (cb: (cmd: string) => void) => {
            runCommand = cb;
        },
    };

    const os = new OS(screen, [program, program2]);
    os.runProgramm('foo', []);

    expect(screen.clear).toHaveBeenCalledTimes(1);

    runCommand('bar');

    expect(screen.clear).toHaveBeenCalledTimes(2);
    expect(program2.program).not.toHaveBeenCalled();

    runCommand('bar');

    expect(program2.program).not.toHaveBeenCalled();

    runCommand('bar');

    expect(program2.program).toHaveBeenCalledTimes(1);
});
