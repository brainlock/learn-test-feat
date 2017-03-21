import { empty, singleton, sum, product } from '../src/feat/simple';

test('cardinality of sum', () => {
    const a = singleton('a');
    const b = singleton('b');
    const c = singleton('c');

    expect(sum([empty, empty]).cardinality).toBe(0);
    expect(sum([empty, a]).cardinality).toBe(1);
    expect(sum([a, empty]).cardinality).toBe(1);
    expect(sum([a, b]).cardinality).toBe(2);
    expect(sum([a, b, c]).cardinality).toBe(3);
    expect(sum([sum([a, b]), c]).cardinality).toBe(3);
    expect(sum([a, sum([b, c])]).cardinality).toBe(3);
});

test('cardinality of product', () => {
    const a = singleton('a');
    const b = singleton('b');

    const ab = sum([a, b]);

    expect(product([empty, empty]).cardinality).toBe(0);
    expect(product([empty, a]).cardinality).toBe(0);
    expect(product([a, empty]).cardinality).toBe(0);

    expect(product([a, b]).cardinality).toBe(1);

    expect(product([ab, a]).cardinality).toBe(2);

    expect(product([ab, ab]).cardinality).toBe(4);

    expect(product([product([ab, ab]), ab]).cardinality).toBe(8);
    expect(product([ab, product([ab, ab])]).cardinality).toBe(8);
});
