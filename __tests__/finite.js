// These tests have been directly ported from
// https://github.com/polux/enumerators/blob/e3de2a08c0c777c14b0ba3f3724db4192a583ee1/test/finite_test.dart
import {
    empty,
    singleton,
    nth,
    sum,
    product,
    map,
    apply,
} from '../src/feat/simple';

test('cardinality of sum', () => {
    const a = singleton('a');
    const b = singleton('b');
    const c = singleton('c');

    expect(sum(empty, empty).cardinality).toBe(0);
    expect(sum(empty, a).cardinality).toBe(1);
    expect(sum(a, empty).cardinality).toBe(1);
    expect(sum(a, b).cardinality).toBe(2);
    expect([a, b, c].reduce(sum, empty).cardinality).toBe(3);
    expect(sum(sum(a, b), c).cardinality).toBe(3);
    expect(sum(a, sum(b, c)).cardinality).toBe(3);
});

test('cardinality of product', () => {
    const a = singleton('a');
    const b = singleton('b');

    const ab = sum(a, b);

    expect(product(empty, empty).cardinality).toBe(0);
    expect(product(empty, a).cardinality).toBe(0);
    expect(product(a, empty).cardinality).toBe(0);

    expect(product(a, b).cardinality).toBe(1);

    expect(product(ab, a).cardinality).toBe(2);

    expect(product(ab, ab).cardinality).toBe(4);

    expect(product(product(ab, ab), ab).cardinality).toBe(8);
    expect(product(ab, product(ab, ab)).cardinality).toBe(8);
});

test('cardinality of map', () => {
    const a = singleton(1);
    const b = singleton(2);

    function checkUnchanged(fin, f) {
        expect(map(f, fin).cardinality).toBe(fin.cardinality);
    }

    checkUnchanged(empty, n => n + 1);
    checkUnchanged(a, n => n + 1);
    checkUnchanged(sum(a, b), n => n + 1);
    checkUnchanged(product(sum(a, b), a), ([fst, snd]) => fst + snd);
});

test('cardinality of apply', () => {
    const fun1 = singleton(n => n + 1);
    const fun2 = singleton(n => n + 2);

    const one = singleton(1);
    const two = singleton(2);

    expect(apply(fun1, one).cardinality).toBe(1);
    expect(apply(fun1, sum(one, two)).cardinality).toBe(2);
    expect(apply(sum(fun1, fun2), one).cardinality).toBe(2);
    expect(apply(sum(fun1, fun2), sum(one, two)).cardinality).toBe(4);
});

test('index of empty', () => {
    for (let i = 0; i < 100; i++) {
        expect(() => nth(empty, i)).toThrow();
    }
});

test('index of singleton', () => {
    const foo = singleton('foo');

    expect(nth(foo, 0)).toEqual('foo');

    for (let i = 1; i < 100; i++) {
        expect(() => nth(foo, i)).toThrow();
    }
});

test('index of sum', () => {
    const foo = singleton('foo');
    const bar = singleton('bar');
    const baz = singleton('baz');

    const sum1 = sum(sum(foo, bar), baz);
    const sum2 = sum(foo, sum(bar, baz));

    for (const s of [sum1, sum2]) {
        expect(nth(s, 0)).toEqual('foo');
        expect(nth(s, 1)).toEqual('bar');
        expect(nth(s, 2)).toEqual('baz');

        for (let i = 3; i < 100; i++) {
            expect(() => nth(s, i)).toThrow();
        }
    }
});

test('index of product', () => {
    const foo = singleton('foo');
    const bar = singleton('bar');

    const prod = product(sum(foo, bar), sum(foo, bar));

    expect(nth(prod, 0)[0]).toEqual('foo');
    expect(nth(prod, 0)[1]).toEqual('foo');
    expect(nth(prod, 1)[0]).toEqual('foo');
    expect(nth(prod, 1)[1]).toEqual('bar');
    expect(nth(prod, 2)[0]).toEqual('bar');
    expect(nth(prod, 2)[1]).toEqual('foo');
    expect(nth(prod, 3)[0]).toEqual('bar');
    expect(nth(prod, 3)[1]).toEqual('bar');

    for (let i = 4; i < 100; i++) {
        expect(() => nth(prod, i)).toThrow();
    }
});

test('index of map', () => {
    const fin = [1, 2, 3].map(singleton).reduce(sum);

    const finDoubled = map(n => n * 2, fin);

    expect(nth(finDoubled, 0)).toEqual(2);
    expect(nth(finDoubled, 1)).toEqual(4);
    expect(nth(finDoubled, 2)).toEqual(6);

    for (let i = 3; i < 100; i++) {
        expect(() => nth(finDoubled, i)).toThrow();
    }
});

test('index of apply', () => {
    const fs = [n => n * 2, n => n * 3].map(singleton).reduce(sum);

    const xs = [1, 2].map(singleton).reduce(sum);

    const applied = apply(fs, xs);

    expect(nth(applied, 0)).toBe(2);
    expect(nth(applied, 1)).toBe(4);
    expect(nth(applied, 2)).toBe(3);
    expect(nth(applied, 3)).toBe(6);

    for (let i = 4; i < 100; i++) {
        expect(() => nth(applied, i)).toThrow();
    }
});
