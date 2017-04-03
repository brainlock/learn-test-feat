/* This is a straight port to JavaScript of
 *
 * https://github.com/polux/quickcheck-slides/blob/678fe5f8b295b4fd9d3476b09762d2dbedd5a686/clfeat/src/clfeat/core.clj#L234-L283
 */

// @flow

import { range } from 'range';

type BoundContinuation = () => ?BoundContinuation;
type Continuation<A> = (x: A) => ?BoundContinuation;

type nthGetter<A> = (i: number, cont: Continuation<A>) => BoundContinuation;

class Finite<A> {
    nth: nthGetter<A>;
    cardinality: number;

    constructor(cardinality: number, nth: nthGetter<A>) {
        this.nth = nth;
        this.cardinality = cardinality;
    }
}

function nth<A>(finite: Finite<A>, idx: number): any {
    let result;

    const stack = [
        finite.nth.bind(finite, idx, val => {
            result = val;
            return;
        }),
    ];

    while (stack.length > 0) {
        const f = stack.pop();

        const next = f();

        if (next) stack.push(next);
    }

    return result;
}

const empty: Finite<*> = new Finite(0, (i: number) => {
    throw new Error('empty: out of bounds');
});

function singleton<A>(x: A): Finite<A> {
    return new Finite(1, (i: number, cont: Continuation<A>) => {
        if (i !== 0) throw new Error('singleton: out of bounds');
        return cont.bind(null, x);
    });
}

function sum<A, B>(f1: Finite<A>, f2: Finite<B>): Finite<A | B> {
    return new Finite(
        f1.cardinality + f2.cardinality,
        (i: number, cont: Continuation<A | B>) => {
            return i < f1.cardinality
                ? f1.nth.bind(f1, i, val => cont.bind(null, val))
                : f2.nth.bind(f2, i - f1.cardinality, val =>
                      cont.bind(null, val));
        },
    );
}

function product<A, B>(f1: Finite<A>, f2: Finite<B>): Finite<[A, B]> {
    return new Finite(
        f1.cardinality * f2.cardinality,
        (i: number, cont: Continuation<[A, B]>) => {
            return f1.nth.bind(f1, Math.floor(i / f2.cardinality), nth_1 =>
                f2.nth.bind(f2, i % f2.cardinality, nth_2 =>
                    cont.bind(null, [nth_1, nth_2])));
        },
    );
}

function map<A, B>(f: (x: A) => B, finite: Finite<A>): Finite<B> {
    return new Finite(
        finite.cardinality,
        (i: number, cont: Continuation<B>) => {
            return finite.nth.bind(finite, i, val => cont.bind(null, f(val)));
        },
    );
}

function apply<A, B>(funFinite: Finite<(i: A) => B>, f: Finite<A>): Finite<B> {
    const pairs = product(funFinite, f);
    return map(([f, x]) => f(x), pairs);
}

function gen(f: Finite<*>) {
    return range(f.cardinality).map(x => nth(f, x));
}

export { Finite, empty, singleton, sum, product, map, apply, gen, nth };
