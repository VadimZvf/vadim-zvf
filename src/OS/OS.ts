import {
    IProgram,
    IProgramDefinition,
    IProgramIterator,
} from './createProgram';

export interface IScreen {
    subscribeCommand(listener: (command: string) => void): void;
    toggleRainbowEffect(): void;
    addContent(lines: string[]): void;
    resetInputArrow(): void;
    setInputArrow(arrow: string): void;
    clear(): void;
}

// Interface for programs
export interface ISystem {
    addContent(lines: string[]): void;
    requestText(data: IRequestText): IRequestTextFiber;
    toggleRainbowEffect(): void;
    clear(): void;
    lockInput(): void;
    unlockInput(): void;
}

export default class OS {
    constructor(screen: IScreen, propgrams: IProgramDefinition[]) {
        this.handleCommand = this.handleCommand.bind(this);

        this.screen = screen;
        this.system = this.createSystem();
        this.loadProgramms(propgrams);

        screen.subscribeCommand(this.handleCommand);
    }

    screen: IScreen;
    system: ISystem;
    programms: {
        [programmsName: string]: IProgram;
    } = {};
    programmInProgress: IProgramIterator | void;
    systemApiInProgress: string | null = null;

    public runProgramm(name: string, args: string[]) {
        this.runProgram(name, args);
    }

    private loadProgramms(programs: IProgramDefinition[]) {
        for (const programInfo of programs) {
            this.programms[programInfo.name] = programInfo.program;
        }
    }

    private handleCommand(rawCommand: string = '') {
        const units = rawCommand.split(' ');

        if (this.systemApiInProgress) {
            this.performSystemApi();
        }

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
        if (!this.programmInProgress) {
            return;
        }

        const result = this.programmInProgress.next(units);

        if (result.done) {
            this.programmInProgress = null;
            return;
        }

        if (result.value) {
            this.applySystemAPI(result.value);
        }
    }

    // TODO: reafactor
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
