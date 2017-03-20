/* This is a straight port to JavaScript of
 *
 * https://github.com/polux/quickcheck-slides/blob/678fe5f8b295b4fd9d3476b09762d2dbedd5a686/clfeat/src/clfeat/core.clj#L285-L297
 */

// @flow

import { range } from 'range';
import { map, nth, sum, singleton, gen } from './feat/simple';

class Node {
    left: ?Node;
    right: ?Node;

    constructor(left: ?Node, right: ?Node) {
        this.left = left;
        this.right = right;
    }
}

function trees(n: number) {
    const table = [singleton(null)];

    const node = (i, j) => map(([i, j]) => new Node(i, j), table[i], table[j]);

    for (const i of range(0, n)) {
        const is = range(0, i + 1);
        const js = range(i, -1, -1);

        const nodes = is.map((_, idx) => {
            const i = is[idx];
            const j = js[idx];
            return node(i, j);
        });

        table[i + 1] = sum(nodes);
    }

    return table[n];
}

console.log(gen(trees(4)));
console.log(nth(trees(200), 101));
