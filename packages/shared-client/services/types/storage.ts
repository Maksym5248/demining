export interface IStorage {
    set: (key: string, value: any) => void;
    get: (key: string) => any;
    remove: (key: string) => void;
    onChange: (key: string, callBack: (value: any) => void) => () => void;
    removeAllListeners: () => void;
}
