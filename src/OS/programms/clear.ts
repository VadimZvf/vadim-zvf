import { ISystem, IProgramIterator } from '../OS';

export const name = 'clear';

export default function* (args: string[], system: ISystem): IProgramIterator {
    system.screen.clear();
}
