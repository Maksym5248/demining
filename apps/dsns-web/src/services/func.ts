import { getApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { type IFunc } from 'shared-my-client';

export class FuncClass implements IFunc {
    constructor() {}

    private get functions() {
        return getFunctions(getApp());
    }

    async parseBook(id: string) {
        const callable = httpsCallable(this.functions, 'parseBook');
        await callable({ id });
    }
}
