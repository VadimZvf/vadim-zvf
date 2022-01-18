import Screen from './Screen';
import OS from './OS';
import socials from './OS/programms/socials';
import help from './OS/programms/help';
import contacts from './OS/programms/contacts';
import about from './OS/programms/about';
import sourceCode from './OS/programms/source_code';
import show from './OS/programms/show';
import clear from './OS/programms/clear';
import rainbow from './OS/programms/rainbow';
import greeting from './OS/programms/greeting';
import race from './OS/programms/race';
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
];

function init() {
    const screen = new Screen(new Renderer(), new Input());

    const os = new OS(screen, programs);

    os.runProgramm('greeting', []);
}

init();
