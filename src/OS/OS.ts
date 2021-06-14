import socials, { name as socialsName } from './programms/socials';
import help, { name as helpName } from './programms/help';
import contacts, { name as contactsName } from './programms/contacts';
import sourceCode, { name as sourceCodeName } from './programms/source_code';
import showMe, { name as showMeName } from './programms/show_me';
import clear, { name as clearName } from './programms/clear';
import rainbow, { name as rainbowName } from './programms/rainbow';
import greeting, { name as greetingName } from './programms/greeting';

export type IProgramIterator = Iterator<void, void, string[]>;

export type IProgram = (args: string[], system: ISystem) => IProgramIterator;

interface IScreen {
    subscribeCommand(listener: (command: string) => void): void;
    toggleRainbowEffect(): void;
    addContent(lines: string[]): void;
    clear(): void;
}

export interface ISystem {
    screen: IScreen;
    addContent(lines: string[]): void;
    lockInput(): void;
    unlockInput(): void;
}

export default class OS {
    constructor(screen: IScreen) {
        this.handleCommand = this.handleCommand.bind(this);

        this.screen = screen;
        this.programms = {
            [socialsName]: socials,
            [helpName]: help,
            [contactsName]: contacts,
            [sourceCodeName]: sourceCode,
            [showMeName]: showMe,
            [rainbowName]: rainbow,
            [clearName]: clear,
            [greetingName]: greeting,
        };
        this.programmInProgress = null;
        this.system = this.createSystem();

        screen.subscribeCommand(this.handleCommand);
    }

    screen: IScreen;
    system: ISystem;
    programms: {
        [programmsName: string]: IProgram;
    };
    programmInProgress: IProgramIterator | null;

    public runProgramm(name: string, args: string[]) {
        this.runProgram(name, args);
    }

    private handleCommand(rawCommand: string = '') {
        const units = rawCommand.split(' ');

        if (this.programmInProgress) {
            this.performCurrentProgram(units);
            return;
        }

        const [programmName, ...args] = units;

        this.runProgram(programmName, args);
    }

    private runProgram(name: string, args: string[]) {
        if (name && this.programms[name]) {
            this.programmInProgress = this.programms[name](args, this.system);
            this.performCurrentProgram(args);
        }
    }

    private performCurrentProgram(units: string[]) {
        const result = this.programmInProgress.next(units);

        if (result.done) {
            this.programmInProgress = null;
        }
    }

    private createSystem(): ISystem {
        return {
            screen: this.screen,
            addContent: (lines: string[]) => {
                this.screen.addContent(lines);
            },
            lockInput() {
                throw new Error('Not implemented');
            },
            unlockInput() {
                throw new Error('Not implemented');
            },
        };
    }
}
