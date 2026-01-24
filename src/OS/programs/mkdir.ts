import createProgram from '../createProgram';

export default createProgram('mkdir', function* (args, system) {
    system.addContent(['Permission denied']);
});
