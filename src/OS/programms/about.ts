import createProgram from '../createProgram';

function calculateAge() {
    const birthday = new Date('1994-07-14');

    const diffMs = Date.now() - birthday.getTime();
    const ageDate = new Date(diffMs);

    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default createProgram('about', function* (args, system) {
    system.clear();

    system.addContent([
        'name: Vadim',
        `age: ${calculateAge()}`,
        'skills: Frontend',
        'experience:',
        '  April 2020 - now.............Yandex',
        '  July 2017 - March 2020.......byndyusoft',
        '  September 2016 - July 2017...bookscriptor',
        '  ... - September 2016.........freelance',
        '',
        '',
        '',
    ]);
});
