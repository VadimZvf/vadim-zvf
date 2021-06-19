import createProgram from '../createProgram';

export default createProgram('rainbow', function* (args, system) {
    system.toggleRainbowEffect();
});
