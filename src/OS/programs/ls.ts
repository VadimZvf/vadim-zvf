import createProgram from '../createProgram';

export default createProgram('ls', function* (args, system) {
    system.addContent(['No files here']);
});
