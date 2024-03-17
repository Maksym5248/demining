import { useCallback, useRef } from 'react';

export function useDebounce(cb: (...args:any[]) => void, deps:any[] = [], delay: number = 400) {
	const values = useRef<NodeJS.Timeout | null>(null);

	return useCallback((...args:any[]) => {

		if(values.current){
			clearTimeout(values.current);
			values.current = null;
		}

		values.current = setTimeout(() => {
			cb?.(...args)
		}, delay)
	}, deps)
}
