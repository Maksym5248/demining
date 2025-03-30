import { MMKV } from 'react-native-mmkv';

export interface LocalStore {
    set(key: string, value: string | boolean | number): void;
    getString(key: string): string | undefined;
    getNumber(key: string): number | undefined;
    getBoolean(key: string): boolean | undefined;
    remove(key: string): void;
}

export class LocalStoreClass implements LocalStore {
    private store: MMKV;

    constructor() {
        this.store = new MMKV();
    }

    set(key: string, value: string | boolean | number): void {
        this.store.set(key, value);
    }

    getString(key: string): string | undefined {
        return this.store.getString(key);
    }

    getNumber(key: string): number | undefined {
        return this.store.getNumber(key);
    }

    getBoolean(key: string): boolean | undefined {
        return this.store.getBoolean(key);
    }

    remove(key: string): void {
        this.store.delete(key);
    }
}
