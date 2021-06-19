import Screen from './Screen';
import OS from './OS';
import socials from './OS/programms/socials';
import help from './OS/programms/help';
import contacts from './OS/programms/contacts';
import sourceCode from './OS/programms/source_code';
import showMe from './OS/programms/show_me';
import clear from './OS/programms/clear';
import rainbow from './OS/programms/rainbow';
import greeting from './OS/programms/greeting';
import Renderer from './Renderer';
import Input from './Input';
import './index.css';

const programs = [
    socials,
    help,
    contacts,
    sourceCode,
    showMe,
    clear,
    rainbow,
    greeting,
];

function init() {
    const screen = new Screen(
        new Renderer({ size: { width: 896, height: 704 } }),
        new Input()
    );

    const os = new OS(screen, programs);

    os.runProgramm('greeting', []);
}

init();
