import EventEmitter from 'events';

const eventEmitter = new EventEmitter();

export class StorageClass {

  set = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
    eventEmitter.emit(key, value);
  };

  get = (key: string) => localStorage.get(JSON.parse(key));

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
