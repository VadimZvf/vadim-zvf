import { ISystem, IProgramIterator } from '../OS';
import openLink from '../utils/open_link';

export const name = 'source-code';

export default function* (args: string[], system: ISystem): IProgramIterator {
    openLink('https://github.com/VadimZvf/vadim-zvf');
}
