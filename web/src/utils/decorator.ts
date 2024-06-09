import { Runnable } from '~/types';

export type Indexable = Record<string, unknown>;

export function runnable(name: string) {
    return function f<TThis, TArgs extends unknown[], TReturn>(
        originalMethod: (...args: TArgs) => Promise<TReturn> | TReturn,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        context: ClassMethodDecoratorContext,
    ) {
        return async function decorator(this: TThis, ...args: TArgs) {
            const runnableEntity = (this as Indexable)[name] as Runnable<TReturn>;
            return runnableEntity.run(async () => originalMethod?.apply(this, args));
        };
    };
}
