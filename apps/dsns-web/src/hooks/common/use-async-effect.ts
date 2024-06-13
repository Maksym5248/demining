import { useEffect } from 'react';

export const useAsyncEffect = (fetch: (...args: any[]) => Promise<void>, deps: any[] = []) => {
    useEffect(() => {
        const fetchInitialData = async () => {
            await fetch();
        };

        fetchInitialData();
    }, deps);
};
