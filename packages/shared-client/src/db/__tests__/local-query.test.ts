import { Timestamp } from '@react-native-firebase/firestore';

import { dates, getWhere } from 'shared-my-client';

describe('getWhere', () => {
    let mockData: {
        id: string;
        name: string | null;
        age: number | null;
        createdAt: Omit<Timestamp, 'toJSON'> | null;
        isActive: boolean | null;
        tags?: string[] | null;
    }[] = [];

    beforeEach(() => {
        dates.init(Timestamp);
        mockData = [
            { id: '1', name: 'Alice', age: 25, createdAt: dates.toDateServer(new Date('2023-01-01')), isActive: true, tags: ['tag1'] },
            { id: '2', name: null, age: 30, createdAt: dates.toDateServer(new Date('2023-02-01')), isActive: false, tags: null },
            { id: '3', name: 'Charlie', age: null, createdAt: null, isActive: null, tags: ['tag2'] },
        ];
    });

    it('should filter data with >= condition on a number field', () => {
        const filters = getWhere({ age: { '>=': 30 } });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[1]]);
    });

    it('should filter data with <= condition on a Timestamp field', () => {
        const filters = getWhere({ createdAt: { '<=': dates.toDateServer(new Date('2023-02-01')) } });
        const result = mockData.filter(item => filters.every(filter => filter(item)));

        expect(result).toStrictEqual([mockData[0], mockData[1]]);
    });

    it('should filter data with != condition', () => {
        const filters = getWhere({ name: { '!=': 'Alice' } });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[1], mockData[2]]);
    });

    it('should filter data with == condition on a Timestamp field', () => {
        const filters = getWhere({ createdAt: dates.toDateServer(new Date('2023-02-01')) });
        const result = mockData.filter(item => filters.every(filter => filter(item)));

        expect(result).toStrictEqual([mockData[1]]);
    });

    it('should filter data with in condition', () => {
        const filters = getWhere({ id: { in: ['1', '3'] } });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[0], mockData[2]]);
    });

    it('should filter data with array-contains-any condition', () => {
        const filters = getWhere({ tags: { 'array-contains-any': ['tag1', 'tag2'] } });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[0], mockData[2]]);
    });

    it('should filter data with boolean field', () => {
        const filters = getWhere({ isActive: true });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[0]]);
    });

    it('should filter data with string field', () => {
        const filters = getWhere({ name: 'Alice' });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[0]]);
    });

    it('should filter data with mixed conditions', () => {
        const filters = getWhere({
            age: { '>=': 30 },
            isActive: true,
        });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([]);
    });

    it('should filter data with missing field', () => {
        const filters = getWhere({ tags: { 'array-contains-any': ['tag1'] } });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[0]]);
    });

    it('should filter data with null field', () => {
        const mockDataWithNull = [
            { id: '1', name: 'Alice', age: 25, createdAt: null, isActive: true },
            { id: '2', name: 'Bob', age: 30, createdAt: dates.toDateServer(new Date('2023-02-01')), isActive: false },
        ];
        const filters = getWhere({ createdAt: null });
        const result = mockDataWithNull.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockDataWithNull[0]]);
    });

    it('should filter data where a field is explicitly null', () => {
        const filters = getWhere({ name: null });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[1]]);
    });

    it('should filter data where a field is not null', () => {
        const filters = getWhere({ name: { '!=': null } });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[0], mockData[2]]);
    });

    it('should filter data where a number field is null', () => {
        const filters = getWhere({ age: null });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[2]]);
    });

    it('should filter data where a number field is not null', () => {
        const filters = getWhere({ age: { '!=': null } });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[0], mockData[1]]);
    });

    it('should filter data where a Timestamp field is null', () => {
        const filters = getWhere({ createdAt: null });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[2]]);
    });

    it('should filter data where a Timestamp field is not null', () => {
        const filters = getWhere({ createdAt: { '!=': null } });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[0], mockData[1]]);
    });

    it('should filter data where a boolean field is null', () => {
        const filters = getWhere({ isActive: null });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[2]]);
    });

    it('should filter data where a boolean field is not null', () => {
        const filters = getWhere({ isActive: { '!=': null } });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[0], mockData[1]]);
    });

    it('should filter data where an array field is null', () => {
        const filters = getWhere({ tags: null });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[1]]);
    });

    it('should filter data where an array field is not null', () => {
        const filters = getWhere({ tags: { '!=': null } });
        const result = mockData.filter(item => filters.every(filter => filter(item)));
        expect(result).toStrictEqual([mockData[0], mockData[2]]);
    });
});
