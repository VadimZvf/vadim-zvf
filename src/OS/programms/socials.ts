import { ISystem, IProgramIterator } from '../OS';
import openLink from '../utils/open_link';

export const name = 'socials';

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

export default function* (args: string[], system: ISystem): IProgramIterator {
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

    const nextCommands: string[] = yield;
    openSocialLink(nextCommands[0], system);
}
