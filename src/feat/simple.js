/* This is a straight port to JavaScript of
 *
 * https://github.com/polux/quickcheck-slides/blob/678fe5f8b295b4fd9d3476b09762d2dbedd5a686/clfeat/src/clfeat/core.clj#L234-L283
 */

// @flow

import { range } from 'range';

type nthGetter<A> = (i: number) => A;

class Finite<A> {
    nth: nthGetter<A>;
    cardinality: number;

    constructor(cardinality: number, nth: nthGetter<A>) {
        this.nth = nth;
        this.cardinality = cardinality;
    }
}

function nth<A>(finite: Finite<A>, idx: number): A {
    return finite.nth(idx);
}

const empty: Finite<*> = new Finite(0, (i: number) => {
    throw new Error('empty: out of bounds');
});

function singleton<A>(x: A): Finite<A> {
    return new Finite(1, (i: number) => {
        if (i !== 0) throw new Error('singleton: out of bounds');
        return x;
    });
}

function sum<A, B>(f1: Finite<A>, f2: Finite<B>): Finite<A | B> {
    return new Finite(f1.cardinality + f2.cardinality, (i: number) => {
        return i < f1.cardinality ? nth(f1, i) : nth(f2, i - f1.cardinality);
    });
}

function product<A, B>(f1: Finite<A>, f2: Finite<B>): Finite<[A, B]> {
    return new Finite(f1.cardinality * f2.cardinality, (i: number) => {
        const nth_1 = nth(f1, Math.floor(i / f2.cardinality));
        const nth_2 = nth(f2, i % f2.cardinality);

        return [nth_1, nth_2];
    });
}

function map<A, B>(f: (x: A) => B, finite: Finite<A>): Finite<B> {
    return new Finite(finite.cardinality, (i: number) => {
        return f(nth(finite, i));
    });
}

function gen(f: Finite<*>) {
    return range(f.cardinality).map(x => nth(f, x));
}

export { Finite, empty, singleton, sum, product, map, gen, nth };
