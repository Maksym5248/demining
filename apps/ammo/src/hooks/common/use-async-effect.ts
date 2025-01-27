import { useEffect } from 'react';

export const useAsyncEffect = (fetch: (...args: unknown[]) => Promise<void>, deps: unknown[] = []) => {
    useEffect(() => {
        const fetchInitialData = async () => {
            await fetch();
        };

        fetchInitialData();
    }, deps);
};
