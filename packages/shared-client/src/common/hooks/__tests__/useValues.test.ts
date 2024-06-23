import { renderHook } from '@testing-library/react';

import { useValues } from '../common/use-values';

describe('hook useValues', () => {
    it('gets a value correctly', async () => {
        const { result } = renderHook(() => useValues());

        result.current.create('testKey', { some: 'value' });

        expect(result.current.get('testKey')).toStrictEqual({ some: 'value' });
    });

    it('checks if a value includes correctly', () => {
        const { result } = renderHook(() => useValues());

        result.current.create('testKey', { some: 'value' });

        const isIncludes = result.current.includes('testKey');

        expect(isIncludes).toBe(true);
    });

    it('creates a new value correctly', () => {
        const { result } = renderHook(() => useValues());

        result.current.create('testKey', { some: 'value' });

        expect(result.current.get('testKey')).toStrictEqual({ some: 'value' });
    });

    it('updates an existing value correctly', () => {
        const { result } = renderHook(() => useValues());

        result.current.create('testKey', { some: 'value' });
        result.current.update('testKey', { some: 'other value' });

        expect(result.current.get('testKey')).toStrictEqual({ some: 'other value' });
    });

    it('removes a value correctly', () => {
        const { result } = renderHook(() => useValues());

        result.current.create('testKey', { some: 'value' });
        result.current.remove('testKey');

        expect(result.current).not.toContain('testKey');
    });

    it('clears all values correctly', () => {
        const { result } = renderHook(() => useValues());

        result.current.create('testKey1', { some: 'value' });
        result.current.create('testKey2', { another: 'value' });
        result.current.clear();

        const isTestKey1Includes = result.current.includes('testKey1');
        const isTestKey2Includes = result.current.includes('testKey2');

        expect(isTestKey1Includes).toBe(false);
        expect(isTestKey2Includes).toBe(false);
    });
});
