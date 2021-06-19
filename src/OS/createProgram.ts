import { ISystem, IRequestTextFiber } from './OS';

export type IProgramIterator = Iterator<
    IRequestTextFiber,
    IRequestTextFiber | void,
    string[]
>;

export type IProgram = (args: string[], system: ISystem) => IProgramIterator;

export interface IProgramDefinition {
    name: string;
    program: (args: string[], system: ISystem) => IProgramIterator;
}

export default function createProgram(
    name: string,
    program: IProgram
): IProgramDefinition {
    return {
        name,
        program,
    };
}
