import { ISystem, IProgramIterator } from '../OS';
import openLink from '../utils/open_link';

export const name = 'contacts';

export default function* (args: string[], system: ISystem): IProgramIterator {
    system.addContent([
        'email: vadim.zvf@gmail.com',
        '',
        'If U wanna write me, type: "write"',
    ]);

    const nextCommands: string[] = yield;

    switch (nextCommands[0]) {
        case 'write':
            openLink('mailto:vadim.zvf@gmail.com');
            break;
        default:
            system.addContent(['OK :(']);
            break;
    }
}
