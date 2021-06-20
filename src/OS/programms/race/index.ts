import createProgram from '../../createProgram';
import explosion from './explosion.wav';
import speed from './speed.wav';

const SCREEN_WIDTH = 40;
const SCREEN_HEIGHT = 17;

const ROAD_WIDTH = 11;
const ROAD_HEIGHT = 17;

const CAR_IMAGE = [
    ' █ ', //
    '███', //
    ' █ ', //
    '█ █',
];

const CAR_WIDTH = CAR_IMAGE[0].length;
const CAR_HEIGHT = CAR_IMAGE.length;

const BLOCK_IMAGE = [
    '░░░', //
];

const BLOCK_WIDTH = BLOCK_IMAGE[0].length;
const BLOCK_HEIGHT = BLOCK_IMAGE.length;

const FAIL_BANNER = [
    '░░░░░░░░░░░░░░', //
    '░  YOU FAIL  ░',
    '░ TRY HARDER ░', //
    '░░░░░░░░░░░░░░', //
];

interface IPosition {
    x: number;
    y: number;
}

function draw(prevLayer: string[][], image: string[], position: IPosition) {
    /**
     ┏━━ this point where is car 
     ┃
    '*█ '
    '███'
    ' █ '
    '█ █'
     */

    const imageHeight = image.length;
    const imagewidth = image[0].length;

    for (let y = 0; y < prevLayer.length; y++) {
        if (y < position.y || y >= position.y + imageHeight) {
            continue;
        }

        for (let x = 0; x < prevLayer[y].length; x++) {
            if (x < position.x || x >= position.x + imagewidth) {
                continue;
            }

            prevLayer[y][x] = image[y - position.y][x - position.x];
        }
    }

    return prevLayer;
}

function createEmptyLayer(): string[][] {
    const layer = [];

    for (let x = 0; x < SCREEN_HEIGHT; x++) {
        const line = [];
        for (let y = 0; y < SCREEN_WIDTH; y++) {
            line.push(' ');
        }

        layer.push(line);
    }

    return layer;
}

function drawBorders(prevLayer: string[][]) {
    for (const line of prevLayer) {
        line[0] = '░';
        line[ROAD_WIDTH - 1] = '░';
    }
}

const enemiesAvailableXPositions = [1, 4, 7];
const enemiesAvailableYGap = 8;
const enemyStartSpeed = 200;
const enemyHighestSpeed = 30;
const enemyAcceleration = 1000;

function getEnemyXPosition(): number {
    const index = Math.floor(Math.random() * enemiesAvailableXPositions.length);

    return enemiesAvailableXPositions[index];
}

function createEnemies(): IPosition[] {
    const positions = [];

    for (let index = ROAD_HEIGHT; index >= 0; index -= enemiesAvailableYGap) {
        positions.push({
            x: getEnemyXPosition(),
            y: index - ROAD_HEIGHT,
        });
    }

    return positions;
}

function moveEnemies(prevPositions: IPosition[]): IPosition[] {
    const positions = [];

    for (const position of prevPositions) {
        if (position.y > ROAD_HEIGHT) {
            positions.push({
                x: getEnemyXPosition(),
                y: -CAR_HEIGHT,
            });
        } else {
            positions.push({
                x: position.x,
                y: position.y + 1,
            });
        }
    }

    return positions;
}

function easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
}

function speedUpEnemy(startTime: number, time: number): number {
    const timeDiff = time - startTime;
    const diff = enemyStartSpeed - enemyHighestSpeed;

    return enemyStartSpeed - diff * easeOutCubic(timeDiff / 100000);
}

function checkCollapsing(enemies: IPosition[], user: IPosition): boolean {
    for (const enemy of enemies) {
        if (
            Math.abs(enemy.x - user.x) < BLOCK_WIDTH &&
            Math.abs(enemy.y - user.y) < BLOCK_HEIGHT
        ) {
            return true;
        }
    }

    return false;
}

function getBestScore(): number {
    const data = JSON.parse(window.localStorage.getItem('race')) || {
        bestScore: 0,
    };
    return data.bestScore;
}

function saveScore(score: number) {
    if (score > getBestScore()) {
        window.localStorage.setItem(
            'race',
            JSON.stringify({ bestScore: score })
        );
    }
}

export default createProgram('race', function* (args, system) {
    const explosionSound = new Audio(explosion);
    explosionSound.volume = 0.3;
    const speedSound = new Audio(speed);
    speedSound.volume = 0.5;

    const userPosition = { x: 0, y: 0 };
    let requestID: number;

    function startGame() {
        const bestScore = getBestScore();
        userPosition.x = Math.round(ROAD_WIDTH / 2 - CAR_WIDTH / 2);
        userPosition.y = ROAD_HEIGHT - CAR_IMAGE.length;

        const startTime = Date.now();
        let enemiesPositions: IPosition[] = createEnemies();
        let lastEnemiesMoveTime = Date.now();
        let score = 0;
        let enemySpeed = enemyStartSpeed;

        function render() {
            const time = Date.now();
            const layer = createEmptyLayer();
            drawBorders(layer);

            if (time >= lastEnemiesMoveTime + enemySpeed) {
                enemiesPositions = moveEnemies(enemiesPositions);
                lastEnemiesMoveTime = time;
                score += 1;

                if (checkCollapsing(enemiesPositions, userPosition)) {
                    draw(layer, FAIL_BANNER, {
                        x: Math.round(
                            SCREEN_WIDTH / 2 - FAIL_BANNER[0].length / 2
                        ),
                        y: Math.round(
                            SCREEN_HEIGHT / 2 - FAIL_BANNER.length / 2
                        ),
                    });

                    explosionSound.play();
                    saveScore(score);
                    system.addContent(layer.map((line) => line.join('')));
                    return;
                }

                if (score % 8 === 0) {
                    speedSound.play();
                }
            }

            enemySpeed = speedUpEnemy(startTime, time);

            for (const enemyPosition of enemiesPositions) {
                draw(layer, BLOCK_IMAGE, enemyPosition);
            }
            draw(layer, CAR_IMAGE, userPosition);

            draw(layer, ['best score:' + bestScore], {
                x: SCREEN_WIDTH - 25,
                y: 0,
            });
            draw(layer, ['score:' + score], {
                x: SCREEN_WIDTH - 25,
                y: 1,
            });
            draw(layer, ['speed:' + Math.floor(enemyStartSpeed - enemySpeed)], {
                x: SCREEN_WIDTH - 25,
                y: 3,
            });

            system.addContent(layer.map((line) => line.join('')));

            requestID = window.requestAnimationFrame(render);
        }

        requestID = window.requestAnimationFrame(render);
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'ArrowLeft' && userPosition.x > 1) {
            userPosition.x = userPosition.x - CAR_WIDTH;
        }

        if (
            event.key === 'ArrowRight' &&
            userPosition.x < ROAD_WIDTH - CAR_WIDTH - 1
        ) {
            userPosition.x = userPosition.x + CAR_WIDTH;
        }
    }

    system.subscribeKeyDown(handleKeyPress);

    startGame();

    while (true) {
        const [command] = yield system.requestText({
            arrowText: 'type q - for exit, r - for retry',
        });

        system.clear();
        window.cancelAnimationFrame(requestID);

        if (['R', 'r', 'retry', 'Retry'].includes(command)) {
            startGame();
        } else {
            return;
        }
    }
});
