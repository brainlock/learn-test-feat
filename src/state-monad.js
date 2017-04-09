// @flow

type StatefulComputation<A, B> = (x: A) => [B, A];
type StatefulStep<A, B> = (x: B) => State<A, B>;

class State<A, B> {
    static mreturn;

    f: StatefulComputation<A, B>;

    constructor(f: StatefulComputation<A, B>) {
        this.f = f;
    }

    mbind(f: StatefulStep<A, B>): State<A, B> {
        return new State((s: A) => {
            const [ival, istate] = this.f(s);
            const fstate = f(ival);
            return fstate.f(istate);
        });
    }
}
State.mreturn = <A, B>(x: A) => {
    return new State((s: B) => [x, s]);
};

function runState<A, B>(comp: State<A, B>, arg: A) {
    return comp.f(arg);
}

export { State, runState };
