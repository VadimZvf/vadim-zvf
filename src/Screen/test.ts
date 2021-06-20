import Screen, { IRenderer, IInput } from './Screen';

const fakeRenderer: IRenderer = {
    setContent() {},
    enableCursor() {},
    disableCursor() {},
    toggleRainbowEffect() {},
};

const fakeInput: IInput = {
    subscribeChangeEvent() {},
    subscribeKeyDownEvent: () => () => {},
    subscribeBackspaceKeyEvent() {},
    subscribeEnterKeyEvent() {},
    subscribeFocusEvent() {},
    subscribeBlurEvent() {},
};

test('Screen shold crop long lines', () => {
    const fakeSetContent = jest.fn();

    const screen = new Screen(
        {
            ...fakeRenderer,
            setContent: fakeSetContent,
        },
        fakeInput
    );

    screen.addContent([
        'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum eu feugiat diam. Ut dignissim quis nunc eu iaculis. Ut in tortor ex. Duis purus est, tempor tempus viverra quis, consectetur ac ex. Aenean felis libero, ultrices vel iaculis posuere, laoreet vestibulum justo. Mauris diam nisl, faucibus in vehicula tincidunt, vehicula at enim. Curabitur eu metus at mi cursus rhoncus ut quis nisi.',
    ]);
    expect(fakeSetContent).toHaveBeenCalledWith([
        'Pellentesque habitant morbi tristique senectus et netu',
        's et malesuada fames ac turpis egestas. Vestibulum eu ',
        'feugiat diam. Ut dignissim quis nunc eu iaculis. Ut in',
        ' tortor ex. Duis purus est, tempor tempus viverra quis',
        ', consectetur ac ex. Aenean felis libero, ultrices vel',
        ' iaculis posuere, laoreet vestibulum justo. Mauris dia',
        'm nisl, faucibus in vehicula tincidunt, vehicula at en',
        'im. Curabitur eu metus at mi cursus rhoncus ut quis ni',
        'si.',
        '>',
    ]);
});

test('Should loop content', () => {
    const fakeSetContent = jest.fn();

    const screen = new Screen(
        {
            ...fakeRenderer,
            setContent: fakeSetContent,
        },
        fakeInput
    );

    screen.addContent([
        'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum eu feugiat diam. Ut dignissim quis nunc eu iaculis. Ut in tortor ex. Duis purus est, tempor tempus viverra quis, consectetur ac ex. Aenean felis libero, ultrices vel iaculis posuere, laoreet vestibulum justo. Mauris diam nisl, faucibus in vehicula tincidunt, vehicula at enim. Curabitur eu metus at mi cursus rhoncus ut quis...',
    ]);
    screen.addContent([
        'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum eu feugiat diam. Ut dignissim quis nunc eu iaculis. Ut in tortor ex. Duis purus est, tempor tempus viverra quis, consectetur ac ex. Aenean felis libero, ultrices vel iaculis posuere, laoreet vestibulum justo. Mauris diam nisl, faucibus in vehicula tincidunt, vehicula at enim. Curabitur eu metus at mi cursus rhoncus ut quis...',
    ]);
    screen.addContent([
        'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum eu feugiat diam. Ut dignissim quis nunc eu iaculis. Ut in tortor ex. Duis purus est, tempor tempus viverra quis, consectetur ac ex. Aenean felis libero, ultrices vel iaculis posuere, laoreet vestibulum justo. Mauris diam nisl, faucibus in vehicula tincidunt, vehicula at enim. Curabitur eu metus at mi cursus rhoncus ut quis...',
    ]);
    expect(fakeSetContent).toHaveBeenLastCalledWith([
        // first add
        'im. Curabitur eu metus at mi cursus rhoncus ut quis...',
        // second
        'Pellentesque habitant morbi tristique senectus et netu',
        's et malesuada fames ac turpis egestas. Vestibulum eu ',
        'feugiat diam. Ut dignissim quis nunc eu iaculis. Ut in',
        ' tortor ex. Duis purus est, tempor tempus viverra quis',
        ', consectetur ac ex. Aenean felis libero, ultrices vel',
        ' iaculis posuere, laoreet vestibulum justo. Mauris dia',
        'm nisl, faucibus in vehicula tincidunt, vehicula at en',
        'im. Curabitur eu metus at mi cursus rhoncus ut quis...',
        // third
        'Pellentesque habitant morbi tristique senectus et netu',
        's et malesuada fames ac turpis egestas. Vestibulum eu ',
        'feugiat diam. Ut dignissim quis nunc eu iaculis. Ut in',
        ' tortor ex. Duis purus est, tempor tempus viverra quis',
        ', consectetur ac ex. Aenean felis libero, ultrices vel',
        ' iaculis posuere, laoreet vestibulum justo. Mauris dia',
        'm nisl, faucibus in vehicula tincidunt, vehicula at en',
        'im. Curabitur eu metus at mi cursus rhoncus ut quis...',
        '>',
    ]);
});

test('Should add typed text', () => {
    const fakeSetContent = jest.fn();
    let addText = (text: string) => {};

    const screen = new Screen(
        {
            ...fakeRenderer,
            setContent: fakeSetContent,
        },
        {
            ...fakeInput,
            subscribeChangeEvent: (cb) => {
                addText = cb;
            },
        }
    );

    screen.addContent(['Some default text']);

    addText('some command');

    expect(fakeSetContent).toHaveBeenLastCalledWith([
        'Some default text',
        '>some command',
    ]);
});

test('Should able delete typed text', () => {
    const fakeSetContent = jest.fn();
    let addText = (text: string) => {};
    let deleteText = () => {};

    const screen = new Screen(
        {
            ...fakeRenderer,
            setContent: fakeSetContent,
        },
        {
            ...fakeInput,
            subscribeChangeEvent: (cb) => {
                addText = cb;
            },
            subscribeBackspaceKeyEvent: (cb) => {
                deleteText = cb;
            },
        }
    );

    addText('pwd');

    expect(fakeSetContent).toHaveBeenLastCalledWith(['>pwd']);

    deleteText();
    deleteText();

    expect(fakeSetContent).toHaveBeenLastCalledWith(['>p']);

    deleteText();
    deleteText();

    expect(fakeSetContent).toHaveBeenLastCalledWith(['>']);
});

test('Should able set custom input arrow', () => {
    const fakeSetContent = jest.fn();
    let addText = (text: string) => {};
    let deleteText = () => {};

    const screen = new Screen(
        {
            ...fakeRenderer,
            setContent: fakeSetContent,
        },
        {
            ...fakeInput,
            subscribeChangeEvent: (cb) => {
                addText = cb;
            },
            subscribeBackspaceKeyEvent: (cb) => {
                deleteText = cb;
            },
        }
    );

    screen.addContent(['Some default text']);
    addText('pwd');
    screen.setInputArrow('aRRRow:');

    expect(fakeSetContent).toHaveBeenLastCalledWith([
        'Some default text',
        'aRRRow:pwd',
    ]);

    deleteText();
    deleteText();
    deleteText();
    deleteText();
    deleteText();

    expect(fakeSetContent).toHaveBeenLastCalledWith([
        'Some default text',
        'aRRRow:',
    ]);

    screen.resetInputArrow();

    expect(fakeSetContent).toHaveBeenLastCalledWith(['Some default text', '>']);
});

test('Should run command', () => {
    const fakeSetContent = jest.fn();
    const onRunCommand = jest.fn();
    let addText = (text: string) => {};
    let pressEnter = () => {};

    const screen = new Screen(
        {
            ...fakeRenderer,
            setContent: fakeSetContent,
        },
        {
            ...fakeInput,
            subscribeChangeEvent: (cb) => {
                addText = cb;
            },
            subscribeEnterKeyEvent: (cb) => {
                pressEnter = cb;
            },
        }
    );
    screen.subscribeCommand(onRunCommand);
    screen.addContent(['Some default text']);

    addText('command');
    expect(fakeSetContent).toHaveBeenLastCalledWith([
        'Some default text',
        '>command',
    ]);

    pressEnter();

    expect(fakeSetContent).toHaveBeenLastCalledWith(['Some default text', '>']);

    expect(onRunCommand).toHaveBeenCalledWith('command');
});
