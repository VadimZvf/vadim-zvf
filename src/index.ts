import Screen from './Screen';
import OS from './OS';
import socials from './OS/programs/socials';
import help from './OS/programs/help';
import contacts from './OS/programs/contacts';
import about from './OS/programs/about';
import sourceCode from './OS/programs/source_code';
import show from './OS/programs/show';
import clear from './OS/programs/clear';
import rainbow from './OS/programs/rainbow';
import greeting from './OS/programs/greeting';
import race from './OS/programs/race';
import ls from './OS/programs/ls';
import pwd from './OS/programs/pwd';
import mkdir from './OS/programs/mkdir';
import cd from './OS/programs/cd';
import Renderer from './Renderer';
import Input from './Input';
import './index.css';

const programs = [
    socials,
    help,
    contacts,
    about,
    sourceCode,
    show,
    clear,
    rainbow,
    greeting,
    race,
    ls,
    pwd,
    mkdir,
    cd,
];

function init() {
    const screen = new Screen(new Renderer(), new Input());

    const os = new OS(screen, programs);

    os.runProgram('greeting', []);
}

init();
