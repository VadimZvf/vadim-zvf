import createProgram from '../createProgram';

export default createProgram('ls', function* (args, system) {
    system.write(['No files here']);
});
