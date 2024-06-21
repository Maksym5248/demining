import { makeObservable, observable, action, computed } from 'mobx';

export function customMakeAutoObservable(target: any) {
    let current = target;
    const keys = new Set();
    while (current !== Object.prototype) {
        Object.getOwnPropertyNames(current).forEach((key) => keys.add(key));
        current = Object.getPrototypeOf(current);
    }

    const observableProps: { [key: string]: any } = {};
    keys.forEach((key: any) => {
        const descriptor = Object.getOwnPropertyDescriptor(target, key) || Object.getOwnPropertyDescriptor(target.__proto__, key);
        if (descriptor && descriptor.get) {
            observableProps[key] = computed;
        } else if (typeof target[key] === 'function') {
            observableProps[key] = action;
        } else {
            observableProps[key] = observable;
        }
    });

    makeObservable(target, observableProps);
}
