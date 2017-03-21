import { empty, singleton, sum, product } from '../src/feat/simple';

test('cardinality of sum', () => {
    const a = singleton('a');
    const b = singleton('b');
    const c = singleton('c');

    expect(sum([empty, empty]).length).toBe(0);
    expect(sum([empty, a]).length).toBe(1);
    expect(sum([a, empty]).length).toBe(1);
    expect(sum([a, b]).length).toBe(2);
    expect(sum([a, b, c]).length).toBe(3);
    expect(sum([sum([a, b]), c]).length).toBe(3);
    expect(sum([a, sum([b, c])]).length).toBe(3);
});

test('cardinality of product', () => {
    const a = singleton('a');
    const b = singleton('b');

    const ab = sum([a, b]);

    expect(product([empty, empty]).length).toBe(0);
    expect(product([empty, a]).length).toBe(0);
    expect(product([a, empty]).length).toBe(0);

    expect(product([a, b]).length).toBe(1);

    expect(product([ab, a]).length).toBe(2);

    expect(product([ab, ab]).length).toBe(4);

    expect(product([product([ab, ab]), ab]).length).toBe(8);
    expect(product([ab, product([ab, ab])]).length).toBe(8);
});
