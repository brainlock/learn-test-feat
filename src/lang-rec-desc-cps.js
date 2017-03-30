/* Implementation of Section 3,
 * "Defunctionalization of CPS-Transformed First-Order Programs" of the paper
 *
 * "Defunctionalization at Work" by Danvy and Nielsen
 * (http://www.brics.dk/RS/01/23/BRICS-RS-01-23.pdf)
 *
 * Just an exercise while reading the paper.
 *
 * The various walk* functions implement a simple recursive descent recognizer
 * for the language 0{N}1{N} (for some N).
 *
 * First `walk_CPS_IF` and `walk` are an implementation written in CPS style.
 *
 * Then `walk_def` implements a defunctionalized version with the continuations
 * identified by tags, over which `apply_def` dispatches.
 *
 * `walk_K` is the same as `walk_def`, but with a counter instead of a stack
 * of continuation tags.
 *
 * Finally, `walk_I` is a version of `walk_K` using an explicit stack and a
 * while loop for recursion.
 */

// CPS
function walk_CPS_IF(xs, cont) {
    if (xs && xs[0] === '0') {
        return walk_CPS_IF(xs.slice(1), xs1 => {
            if (xs1[0] === '1') {
                return cont(xs1.slice(1));
            } else {
                return false;
            }
        });
    } else {
        return cont(xs);
    }
}

// same as walk_CPS_IF, but without all those annoying if/else/return statements
function walk(xs, cont) {
    return xs && xs.length > 0 && xs[0] === '0'
        ? walk(xs.slice(1), xs1 => xs1[0] === '1' ? cont(xs1.slice(1)) : false)
        : cont(xs);
}

console.log(
    walk(['0', '0', '0', '0', '1', '1', '1', '1'], xs => xs.length === 0)
);

// defunctionalized
////////////////////////////////////////////////////////////////////////////////

function applyCont(cs, xs1) {
    const c = cs.pop();
    switch (c) {
        case 'CONT0':
            return xs1.length === 0;

        case 'CONT1':
            return xs1[0] === '1' ? applyCont(cs, xs1.slice(1)) : false;

        default:
            throw new TypeError('Undefined continuation.');
    }
}

function walk_def(xs, conts) {
    return xs && xs.length > 0 && xs[0] === '0'
        ? walk_def(xs.slice(1), conts.concat('CONT1'))
        : applyCont(conts, xs);
}

console.log(
    walk_def(['0', '0', '0', '0', '1', '1', '1', '1'], ['CONT0']).toString()
);

// defunctionalized, now with a counter
////////////////////////////////////////////////////////////////////////////////

function apply_K(c, xs1) {
    switch (c) {
        case 0:
            return xs1.length === 0;

        default:
            return xs1[0] === '1' ? apply_K(c - 1, xs1.slice(1)) : false;
    }
}

function walk_K(xs, c) {
    return xs && xs.length > 0 && xs[0] === '0'
        ? walk_K(xs.slice(1), c + 1)
        : apply_K(c, xs);
}

console.log(walk_K(['0', '0', '0', '0', '1', '1', '1', '1'], 0).toString());

// same as last, but iterative
////////////////////////////////////////////////////////////////////////////////

function apply_I(initial_c, initial_xs) {
    const stack = [{ c: initial_c, xs: initial_xs }];

    while (stack.length > 0) {
        const { c, xs } = stack.pop();

        if (c === 0) {
            return xs.length === 0;
        }

        if (xs[0] !== '1') return false;

        stack.push({ c: c - 1, xs: xs.slice(1) });
    }

    throw new RangeError('Umh.');
}

function walk_I(xs, c) {
    const stack = [{ c, xs }];

    while (stack.length > 0) {
        const { c, xs } = stack.pop();

        const recurse = xs && xs.length > 0 && xs[0] === '0';

        if (recurse) {
            stack.push({ c: c + 1, xs: xs.slice(1) });
        } else {
            return apply_I(c, xs);
        }
    }

    throw new RangeError('Umh.');
}

console.log(walk_I(['0', '0', '0', '0', '1', '1', '1', '1'], 0));

const hugeValidStr = '0'.repeat(10000) + '1'.repeat(10000);

// This makes the stack blow up:
//console.log('Very long string', walk(Array.from(hugeValidStr), xs => xs.length === 0));

// This doesn't:
console.log('Very long string:', walk_I(Array.from(hugeValidStr), 0));
