/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef } from 'react';

import { isFunction } from 'shared-my';

import { type ViewModelGeneric } from '~/types';

export function useViewModel<T>(value: ViewModelGeneric<T> | (() => ViewModelGeneric<T>), params?: any) {
    const vm = useRef(isFunction(value) ? value() : value).current;

    useMemo(() => {
        vm?.init?.(params);
    }, []);

    useEffect(
        () => () => {
            vm?.unmount?.();
        },
        [],
    );

    return vm;
}
