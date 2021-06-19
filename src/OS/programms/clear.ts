import createProgram from '../createProgram';

export default createProgram('clear', function* (args, system) {
    system.clear();
});
