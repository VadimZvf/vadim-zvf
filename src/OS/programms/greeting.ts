import { ISystem, IProgramIterator } from '../OS';

export const name = 'greeting';

export default function* (args: string[], system: ISystem): IProgramIterator {
    system.addContent([
        'HELLO!',
        'Nice to meat U!',
        'My name is Vadim and this is my petproject',
        '',
        'If U need a help, just write command - help',
        '',
    ]);
}
