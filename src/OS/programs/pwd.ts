import createProgram from '../createProgram';

export default createProgram('pwd', function* (args, system) {
    system.addContent(['/']);
});
