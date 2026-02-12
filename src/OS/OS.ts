import {
    IProgram,
    IProgramDefinition,
    IProgramIterator,
} from './createProgram';

export interface IScreen {
    subscribeCommand(listener: (command: string) => void): void;
    toggleRainbowEffect(): void;
    addContent(lines: string[]): void;
    write(symbol: string): void;
    resetInputArrow(): void;
    setInputArrow(arrow: string): void;
    clear(): void;
}

// Interface for programs
export interface ISystem {
    addContent(lines: string[]): void;
    write(lines: string[]): Promise<void>;
    requestText(data: IRequestText): IRequestTextFiber;
    toggleRainbowEffect(): void;
    clear(): void;
    lockInput(): void;
    unlockInput(): void;
}

export default class OS {
    constructor(screen: IScreen, programs: IProgramDefinition[]) {
        this.handleCommand = this.handleCommand.bind(this);

        this.screen = screen;
        this.system = this.createSystem();
        this.loadPrograms(programs);

        screen.subscribeCommand(this.handleCommand);

        window.requestAnimationFrame(this.update.bind(this));
    }

    screen: IScreen;
    system: ISystem;
    programs: {
        [programsName: string]: IProgram;
    } = {};
    programInProgress: IProgramIterator | null = null;
    systemApiInProgress: string | null = null;
    currentWritingText: string = '';
    private symbolWritingTime: number = 20; // In milliseconds
    private lastWriteTime: number = 0;

    private loadPrograms(programs: IProgramDefinition[]) {
        for (const programInfo of programs) {
            this.programs[programInfo.name] = programInfo.program;
        }
    }

    private handleCommand(rawCommand: string = '') {
        const units = rawCommand.split(' ');

        if (this.systemApiInProgress) {
            this.performSystemApi();
        }

        if (this.programInProgress) {
            this.performCurrentProgram(units);
            return;
        }

        const [programName, ...args] = units;

        this.runProgram(programName, args);
    }

    public update(time: number) {
        if (this.currentWritingText.length > 0) {
            const timeDiff = time - this.lastWriteTime;

            if (timeDiff >= this.symbolWritingTime) {
                this.lastWriteTime = time;

                this.screen.write(this.currentWritingText[0]);
                this.currentWritingText = this.currentWritingText.substring(1);
            }
        }

        window.requestAnimationFrame(this.update.bind(this));
    }

    public runProgram(name: string, args: string[]) {
        if (name && this.programs[name]) {
            this.programInProgress = this.programs[name](args, this.system);
            this.performCurrentProgram(args);
            return;
        }

        this.screen.addContent([
            `Unknown command - ${name}`,
            'Use "help" to see the list of available commands',
        ]);
    }

    private performCurrentProgram(units: string[]) {
        if (!this.programInProgress) {
            return;
        }

        const result = this.programInProgress.next(units);

        if (result.done) {
            this.programInProgress = null;
            return;
        }

        if (result.value) {
            this.applySystemAPI(result.value);
        }
    }

    // TODO: refactor
    private applySystemAPI(request: IRequestTextFiber) {
        if (!request) {
            return;
        }

        switch (request.type) {
            case SYSTEM_INTERFACE_REQUESTS.text:
                this.systemApiInProgress = SYSTEM_INTERFACE_REQUESTS.text;
                if (request.data && request.data.arrowText) {
                    this.screen.setInputArrow(request.data.arrowText);
                }
                break;
            default:
                break;
        }
    }

    private performSystemApi() {
        switch (this.systemApiInProgress) {
            case SYSTEM_INTERFACE_REQUESTS.text:
                this.screen.resetInputArrow();
                break;
            default:
                break;
        }

        this.systemApiInProgress = null;
    }

    private createSystem(): ISystem {
        return {
            addContent: (lines) => this.screen.addContent(lines),
            write: async (lines) => {
                this.currentWritingText = '\n' + lines.join('\n');
            },
            toggleRainbowEffect: () => this.screen.toggleRainbowEffect(),
            clear: () => this.screen.clear(),
            requestText: (data: IRequestText): IRequestTextFiber => {
                return {
                    type: SYSTEM_INTERFACE_REQUESTS.text,
                    data,
                };
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

// TODO: Move to separate entity
interface IRequestText {
    arrowText: string;
}

export interface IRequestTextFiber {
    type: string;
    data: IRequestText | void;
}

const SYSTEM_INTERFACE_REQUESTS = {
    text: 'REQUEST_STRING',
};
