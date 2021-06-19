import createProgram from '../../createProgram';
const ROAD_WIDTH = 8;
const ROAD_HEIGHT = 17;

const CAR_IMAGE = [
    ' █ ', //
    '███', //
    ' █', //
    '█ █',
];

function draw(
    prevLayer: string[][],
    image: string[],
    position: { x: number; y: number }
) {
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

        const line = prevLayer[y];

        for (let x = 0; x < line.length; x++) {
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

    for (let x = 0; x < ROAD_HEIGHT; x++) {
        const line = [];
        for (let y = 0; y < ROAD_WIDTH; y++) {
            line.push(' ');
        }

        layer.push(line);
    }

    return layer;
}

export default createProgram('race', function* (args, system) {
    const userPosition = {
        x: Math.round(ROAD_WIDTH / 2 - CAR_IMAGE[0].length / 2),
        y: ROAD_HEIGHT - CAR_IMAGE.length,
    };
    let delta = 0;

    const iterval = setInterval(() => {
        system.addContent(
            draw(createEmptyLayer(), CAR_IMAGE, {
                x: userPosition.x,
                y: userPosition.y - delta,
            }).map((line) => line.join(''))
        );

        delta += 1;
    }, 500);

    yield;

    clearInterval(iterval);
});
