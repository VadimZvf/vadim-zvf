import Screen from './Screen';
import OS from './OS';
import Renderer from './Renderer';
import Input from './Input';
import './index.css';

function init() {
    const screen = new Screen(
        new Renderer({ size: { width: 896, height: 704 } }),
        new Input()
    );

    const os = new OS(screen);

    os.runProgramm('greeting', []);
}

init();
