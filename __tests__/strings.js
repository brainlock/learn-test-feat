import { range } from 'range';
import { gen } from '../src/feat/simple';
import { strings } from '../src/strings';

const alphabet = [
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

test('strings of depth 0', () => {
    expect(gen(strings(0))).toEqual(['']);
});

test('strings of depth 1', () => {
    expect(gen(strings(1))).toEqual(alphabet);
});

test('strings of depth 2', () => {
    const strs2 = [];
    for (const s1 of alphabet) {
        for (const s2 of alphabet) {
            strs2.push(s1 + s2);
        }
    }
    expect(gen(strings(2))).toEqual(strs2);
});

test('strings of depth 3', () => {
    const strs3 = [];
    for (const s1 of alphabet) {
        for (const s2 of alphabet) {
            for (const s3 of alphabet) {
                strs3.push(s1 + s2 + s3);
            }
        }
    }
    expect(gen(strings(3))).toEqual(strs3);
});
