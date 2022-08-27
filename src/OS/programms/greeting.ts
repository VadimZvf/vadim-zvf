import createProgram from '../createProgram';

export default createProgram('greeting', function* (args, system) {
    system.addContent([
        'HELLO!',
        'Nice to meet U!',
        'My name is Vadim and this is my petproject',
        '',
        'If U need help, just write command - help',
        '',
    ]);
});
