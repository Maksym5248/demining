import { useMemo, useRef } from 'react';

import { isObject } from 'lodash';

export function useValues<T>(initialValue = {}) {
	const data = useRef<Record<string, T>>(initialValue).current;

	return useMemo(
		() => ({
			get: (id?: string) => id ? data[id]: data,
			includes: (id: string) => !!data[id],
			update: (key: string, value: Partial<T>) => {
				data[key] = isObject(value) ? { ...data[key], ...value } : value;
			},
			create: (key: string, value: T) => {
				data[key] = isObject(value) ? { ...value } : value;
			},
			set: (key: string, value: T) => {
				data[key] = isObject(value) ? { ...value } : value;
			},
			remove: (id: string) => {
				delete data[id];
			},
			clear: () => {
				Object.keys(data).forEach((key) => {
					delete data[key];
				});
			},
		}),
		[],
	);
}
