import { range } from 'range';
import { State, runState } from '../src/state-monad-iterative';

type Stack<A> = Array<A>;

function pop(stack: Stack<number>) {
    return [stack[0], stack.slice(1)];
}
function push(stack, v) {
    return [null, [v].concat(...stack)];
}

// example from http://learnyouahaskell.com/for-a-few-monads-more
test('manipulate a stack', () => {
    const mps = new State((s: Array<number>) => push(s, 3))
        .mbind(() => new State(pop))
        .mbind(() => new State(pop));

    expect(runState(mps, [5, 8, 2, 1])).toEqual([5, [8, 2, 1]]);
});

test('asd', () => {
    const size = 10000;
    const big = range(0, size).map(() => 123);

    const pop_all_but_one = range(0, size - 2).reduce(
        (out, x) => out.mbind(() => new State(pop)),
        new State(pop)
    );

    expect(() => {
        expect(runState(pop_all_but_one, big)).toEqual([123, [123]]);
    }).not.toThrow();
});
