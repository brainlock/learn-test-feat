// @flow

type StatefulComputation<A, B> = (x: A) => [B, A];
type StatefulStep<A, B> = (x: B) => State<A, B>;

class State<A, B> {
    static mreturn;

    f: StatefulComputation<A, B>;
    steps: Array<StatefulStep<A, B>>;

    constructor(f: StatefulComputation<A, B>) {
        this.f = f;
        this.steps = [];
    }

    run(x: A): [B, A] {
        let [ival, istate] = this.f(x);

        for (const s of this.steps) {
            const newComp = s(ival);
            [ival, istate] = newComp.f(istate);
        }

        return [ival, istate];
    }

    mbind(f: StatefulStep<A, B>): State<A, B> {
        const comp = new State(this.f);
        comp.steps = this.steps.concat(f);
        return comp;
    }
}
State.mreturn = <A, B>(x: A) => {
    return new State((s: B) => [x, s]);
};

function runState<A, B>(comp: State<A, B>, arg: A) {
    return comp.run(arg);
}

export { State, runState };
