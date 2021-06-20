import createProgram from '../createProgram';

export default createProgram('help', function* (args, system) {
    system.addContent([
        'Available commands:',
        ' - contacts',
        ' - socials',
        ' - show-me',
        ' - rainbow',
        ' - race',
        ' - source-code',
        ' - help',
        ' - clear',
    ]);
});
