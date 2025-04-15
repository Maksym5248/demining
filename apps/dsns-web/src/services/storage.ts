import EventEmitter from 'events';

import { type IStorage } from 'shared-my-client';

const eventEmitter = new EventEmitter();

export class StorageClass implements IStorage {
    set = (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify(value));
        eventEmitter.emit(key, value);
    };

    get(key: string) {
        try {
            const value = localStorage.getItem(key);
            if (value) {
                return JSON.parse(value);
            }
        } catch (error) {
            return null;
        }

        return null;
    }

    remove = (key: string) => {
        localStorage.removeItem(key);
        eventEmitter.emit(key, null);
    };

    onChange = (key: string, callBack: (value: any) => void) => {
        eventEmitter.on(key, callBack);

        return () => eventEmitter.removeListener(key, callBack);
    };

    removeAllListeners() {
        eventEmitter.removeAllListeners();
    }
}

export const Storage = new StorageClass();
