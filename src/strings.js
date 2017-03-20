// @flow
import { range } from 'range';

import {
    Finite,
    empty,
    map,
    nth,
    sum,
    product,
    singleton,
    gen,
} from './feat/simple';

const _ALPHABET = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
];

const stringSingletons = {};
function getStringSingleton(s: string) {
    if (!stringSingletons.hasOwnProperty(s)) {
        stringSingletons[s] = singleton(s);
    }
    return stringSingletons[s];
}

export function strings(n: number) {
    const table = [getStringSingleton('')];

    for (const i of range(0, n)) {
        const p = product([table[i], sum(_ALPHABET.map(getStringSingleton))]);
        table[i + 1] = map(([strs]) => strs.join(''), p);
    }

    return table[n];
}

/*
console.log('The first 5 strings of length 3:');

console.log(gen(strings(3)).slice(0, 5));

console.log('\n');

console.log('The 1000000th and 1000001th of all the strings of length 400:');

const strings_len400 = strings(400);

for (let i = 1000000; i < 1000002; i++) {
    console.log(nth(strings_len400, i));
}
*/
