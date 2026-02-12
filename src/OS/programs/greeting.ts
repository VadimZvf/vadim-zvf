import createProgram from '../createProgram';

export default createProgram('greeting', function* (args, system) {
    system.write([
        'HELLO!',
        'Nice to meet you!',
        'My name is Vadim and this is my petproject',
        '',
        'If you need help, just type command - "help"',
    ]);
});
