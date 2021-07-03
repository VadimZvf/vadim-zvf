import createProgram from '../createProgram';

export default createProgram('help', function* (args, system) {
    system.addContent([
        'Available commands:',
        ' - contacts',
        ' - socials',
        ' - about',
        ' - show',
        ' - rainbow',
        ' - race',
        ' - source-code',
        ' - help',
        ' - clear',
    ]);
});
