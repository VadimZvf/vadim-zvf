import createProgram from '../createProgram';

export default createProgram('cd', function* (args, system) {
    system.addContent(['Permission denied']);
});
