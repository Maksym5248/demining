import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { type IFunc } from 'shared-my-client';

export class FuncClass implements IFunc {
    constructor() {}

    get auth() {
        return getAuth(getApp());
    }
    async parseBook(bookId: string) {
        const functions = getFunctions(getApp(), 'https://parsebook-281126311275.europe-central2.run.app');
        const callable = httpsCallable(functions, 'parsebook');

        await callable({ bookId });
    }
}
