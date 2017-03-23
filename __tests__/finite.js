// These tests have been directly ported from
// https://github.com/polux/enumerators/blob/e3de2a08c0c777c14b0ba3f3724db4192a583ee1/test/finite_test.dart
import { empty, singleton, sum, product, map, apply } from '../src/feat/simple';

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
