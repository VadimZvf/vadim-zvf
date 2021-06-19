import { ISystem } from '../OS';
import createProgram from '../createProgram';
import openLink from '../utils/open_link';

function openSocialLink(name: string, system: ISystem) {
    switch (name) {
        case 'vk':
            openLink('https://vk.com/zainetdinov_vadim');
            break;
        case 'instagram':
            openLink('https://www.instagram.com/zainetdinovvadim');
            break;
        case 'linkedin':
            openLink('https://www.linkedin.com/in/vadim-zaynetdinov-27908417b');
            break;
        case 'telegram':
            openLink('https://t.me/vadimzvf');
            break;

        default:
            system.addContent(['Unknown social name']);
            break;
    }
}

export default createProgram('socials', function* (args, system) {
    const [socialName] = args;

    if (socialName) {
        openSocialLink(socialName, system);
        return;
    } else {
        system.addContent([
            'I am in social networks:',
            ' - vk',
            ' - instagram',
            ' - linkedin',
            ' - telegram',
            'Enter the name of a social network to open it',
        ]);
    }

    const nextCommands: string[] = yield system.requestText({
        arrowText: 'social:',
    });
    openSocialLink(nextCommands[0], system);
});
