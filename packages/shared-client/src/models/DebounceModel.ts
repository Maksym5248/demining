import { makeAutoObservable } from 'mobx';

export interface IDebounceModel {
    run: (fn: () => void) => void;
    clear: () => void;
    isLoading: boolean;
}

export interface DebounceModelParams {
    delay?: number;
}

export class DebounceModel implements IDebounceModel {
    private timer: NodeJS.Timeout | null = null;
    private delay = 300;

    public isLoading = false;

    constructor(params?: DebounceModelParams) {
        this.delay = params?.delay ?? 600;

        makeAutoObservable(this);
    }

    setLoading(value: boolean) {
        this.isLoading = value;
    }

    run(fn: () => void) {
        this.setLoading(true);
        this.clear();

        this.timer = setTimeout(() => {
            fn();
            this.setLoading(false);
        }, this.delay);
    }

    clear() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
