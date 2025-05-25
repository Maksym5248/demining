import { MMKV } from 'react-native-mmkv';
import { type IStorage } from 'shared-my-client';

export interface IStorageExtended extends IStorage {
    set(key: string, value: string | boolean | number): void;
    getString(key: string): string | undefined;
    getNumber(key: string): number | undefined;
    getBoolean(key: string): boolean | undefined;
    remove(key: string): void;
}

export class StorageClass implements IStorageExtended {
    private store: MMKV;
    private listeners: Map<string, Array<{ remove: () => void }>> = new Map();

    constructor() {
        this.store = new MMKV();
    }

    set(key: string, value: any): void {
        const type = typeof value;
        if (value === null || value === undefined) {
            this.store.delete(key);
        } else if (type === 'string') {
            this.store.set(key, value as string);
        } else if (type === 'number') {
            this.store.set(key, value as number);
        } else if (type === 'boolean') {
            this.store.set(key, value as boolean);
        } else if (type === 'object' || Array.isArray(value)) {
            this.store.set(key, JSON.stringify(value));
        } else {
            console.warn(`LocalStoreClass: Unsupported type for key '${key}': ${type}`);
            this.store.set(key, String(value));
        }
    }

    get(key: string): any {
        const stringValue = this.store.getString(key);
        if (stringValue !== undefined) {
            try {
                if (
                    (stringValue.startsWith('{') && stringValue.endsWith('}')) ||
                    (stringValue.startsWith('[') && stringValue.endsWith(']'))
                ) {
                    return JSON.parse(stringValue);
                }
            } catch (e) {
                // Not a JSON string, but was stored as a string
                return stringValue;
            }
            return stringValue; // Return as string if not parsed as JSON
        }

        const numberValue = this.store.getNumber(key);
        if (numberValue !== undefined) return numberValue;

        const booleanValue = this.store.getBoolean(key);
        if (booleanValue !== undefined) return booleanValue;

        return undefined;
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

    onChange(key: string, callBack: (value: any) => void): () => void {
        const mmkvListener = this.store.addOnValueChangedListener(changedKey => {
            if (changedKey === key) {
                callBack(this.get(key));
            }
        });

        const listenerToRemove = { remove: () => mmkvListener.remove() };
        const keyListeners = this.listeners.get(key) || [];
        keyListeners.push(listenerToRemove);
        this.listeners.set(key, keyListeners);

        return () => {
            listenerToRemove.remove();
            const currentListeners = this.listeners.get(key);
            if (currentListeners) {
                const index = currentListeners.indexOf(listenerToRemove);
                if (index > -1) {
                    currentListeners.splice(index, 1);
                    if (currentListeners.length === 0) {
                        this.listeners.delete(key);
                    }
                }
            }
        };
    }

    removeAllListeners(): void {
        this.listeners.forEach(keyListeners => {
            keyListeners.forEach(listener => {
                listener.remove();
            });
        });
        this.listeners.clear();
    }
}
