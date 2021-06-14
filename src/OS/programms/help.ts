import { ISystem, IProgramIterator } from '../OS';

export const name = 'help';

export default function* (args: string[], system: ISystem): IProgramIterator {
    system.addContent([
        'Available commands:',
        ' - contacts',
        ' - socials',
        ' - show-me',
        ' - rainbow',
        ' - source-code',
        ' - help',
        ' - clear',
    ]);
}
