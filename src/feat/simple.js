/* This is a straight port to JavaScript of
 *
 * https://github.com/polux/quickcheck-slides/blob/678fe5f8b295b4fd9d3476b09762d2dbedd5a686/clfeat/src/clfeat/core.clj#L234-L283
 */

// @flow

import { range } from 'range';

type wrappedObj = any;
type nthGetter = (i: number) => wrappedObj;

class Finite {
    nth: nthGetter;
    cardinality: number;

    constructor(cardinality: number, nth: nthGetter) {
        if (isNaN(cardinality)) throw new Error();
        this.nth = nth;
        this.cardinality = cardinality;
    }
}

function nth(finite: Finite, idx: number) {
    return finite.nth(idx);
}

const empty = new Finite(0, (i: number) => {
    throw new Error('empty: out of bounds');
});

function singleton(x: wrappedObj): Finite {
    return new Finite(1, (i: number) => {
        if (i !== 0) throw new Error('singleton: out of bounds');
        return x;
    });
}

function sum(finites: Finite[]): Finite {
    if (finites.length < 1) {
        return empty;
    }

    const [f1, ...fs] = finites;

    const f2 = sum(fs);

    if (f1.cardinality === undefined) throw new Error();
    return new Finite(f1.cardinality + f2.cardinality, (i: number) => {
        return i < f1.cardinality ? nth(f1, i) : nth(f2, i - f1.cardinality);
    });
}

function product(finites: Finite[]): Finite {
    if (finites.length < 1) {
        throw new Error('product: empty');
    }

    if (finites.length === 1) {
        const f = finites[0];

        return new Finite(f.cardinality, (i: number) => {
            return [nth(f, i)];
        });
    }

    const [f1, ...fs] = finites;

    const f2 = product(fs);

    return new Finite(f1.cardinality * f2.cardinality, (i: number) => {
        const nth_1 = nth(f1, Math.floor(i / f2.cardinality));
        const nth_2 = nth(f2, i % f2.cardinality);

        return [nth_1, nth_2];
    });
}

function map(f: Function, ...finites: Finite[]): Finite {
    const finite = product(finites);

    return new Finite(finite.cardinality, (i: number) => {
        return f(nth(finite, i));
    });
}

function gen(f: Finite) {
    return range(f.cardinality).map(x => nth(f, x));
}

export { Finite, empty, singleton, sum, product, map, gen, nth };
