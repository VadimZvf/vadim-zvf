import createProgram from '../createProgram';
import openLink from '../utils/open_link';

export default createProgram('contacts', function* (args, system) {
    system.addContent([
        'email: vadim.zvf@gmail.com',
        '',
        'Do you want to write to me?',
    ]);

    const nextCommands: string[] = yield system.requestText({
        arrowText: 'Yes or no (Y/N):',
    });

    if (['Y', 'y', 'Yes', 'yes'].includes(nextCommands[0])) {
        openLink('mailto:vadim.zvf@gmail.com');
    } else {
        system.addContent(['OK :(']);
    }
});
