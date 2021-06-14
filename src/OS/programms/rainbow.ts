import { ISystem, IProgramIterator } from '../OS';

export const name = 'rainbow';

export default function* (args: string[], system: ISystem): IProgramIterator {
    system.screen.toggleRainbowEffect();
}
