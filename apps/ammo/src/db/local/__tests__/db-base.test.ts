import { type Timestamp } from 'shared-my';
import { dates } from 'shared-my-client';

import { DBBase } from '../db-base';

interface IItem {
    id: string;
    name: string;
    age: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

describe('DBBase', () => {
    beforeAll(() => {
        // // Mock Firestore Timestamp
        // dates.init({
        //     fromDate: (date: Date) => ({
        //         seconds: Math.floor(date.getTime() / 1000),
        //         nanoseconds: (date.getTime() % 1000) * 1e6,
        //         toDate: () => date,
        //     }),
        // });
    });

    const mockData: IItem[] = [
        {
            id: '1',
            name: 'Alice',
            age: 25,
            updatedAt: dates.toDateServer(new Date('2023-01-01')),
            createdAt: dates.toDateServer(new Date('2023-01-01')),
        },
        {
            id: '2',
            name: 'Bob',
            age: 30,
            updatedAt: dates.toDateServer(new Date('2023-02-01')),
            createdAt: dates.toDateServer(new Date('2023-02-01')),
        },
        {
            id: '3',
            name: 'Charlie',
            age: 35,
            updatedAt: dates.toDateServer(new Date('2023-03-01')),
            createdAt: dates.toDateServer(new Date('2023-03-01')),
        },
    ];

    let db: DBBase<IItem>;

    beforeEach(() => {
        db = new DBBase('testTable');
        mockData.forEach(item => db.create(item));
    });

    afterEach(() => {
        db.storage.clearAll();
    });

    it('should filter data with >= condition on a number field', async () => {
        const result = await db.select({ where: { age: { '>=': 30 } } });
        expect(result).toEqual([
            { id: '2', name: 'Bob', age: 30, createdAt: mockData[1].createdAt, updatedAt: mockData[1].createdAt },
            { id: '3', name: 'Charlie', age: 35, createdAt: mockData[2].createdAt, updatedAt: mockData[2].createdAt },
        ]);
    });

    it('should filter data with <= condition on a Timestamp field', async () => {
        const result = await db.select({ where: { createdAt: { '<=': dates.toDateServer(new Date('2023-02-01')) } } });
        expect(result).toEqual([
            { id: '1', name: 'Alice', age: 25, createdAt: mockData[0].createdAt, updatedAt: mockData[0].createdAt },
            { id: '2', name: 'Bob', age: 30, createdAt: mockData[1].createdAt, updatedAt: mockData[1].createdAt },
        ]);
    });

    it('should filter data with != condition', async () => {
        const result = await db.select({ where: { name: { '!=': 'Alice' } } });
        expect(result).toEqual([
            { id: '2', name: 'Bob', age: 30, createdAt: mockData[1].createdAt, updatedAt: mockData[1].createdAt },
            { id: '3', name: 'Charlie', age: 35, createdAt: mockData[2].createdAt, updatedAt: mockData[2].createdAt },
        ]);
    });

    it('should filter data with == condition on a Timestamp field', async () => {
        const result = await db.select({ where: { createdAt: mockData[1].createdAt } });
        expect(result).toEqual([{ id: '2', name: 'Bob', age: 30, createdAt: mockData[1].createdAt, updatedAt: mockData[1].createdAt }]);
    });

    it('should apply sorting on a number field', async () => {
        const result = await db.select({ order: { by: 'age', type: 'desc' } });
        expect(result).toEqual([
            { id: '3', name: 'Charlie', age: 35, createdAt: mockData[2].createdAt, updatedAt: mockData[2].createdAt },
            { id: '2', name: 'Bob', age: 30, createdAt: mockData[1].createdAt, updatedAt: mockData[1].createdAt },
            { id: '1', name: 'Alice', age: 25, createdAt: mockData[0].createdAt, updatedAt: mockData[0].createdAt },
        ]);
    });

    it('should apply sorting on a Timestamp field', async () => {
        const result = await db.select({ order: { by: 'createdAt', type: 'asc' } });
        expect(result).toEqual([
            { id: '1', name: 'Alice', age: 25, createdAt: mockData[0].createdAt, updatedAt: mockData[0].createdAt },
            { id: '2', name: 'Bob', age: 30, createdAt: mockData[1].createdAt, updatedAt: mockData[1].createdAt },
            { id: '3', name: 'Charlie', age: 35, createdAt: mockData[2].createdAt, updatedAt: mockData[2].createdAt },
        ]);
    });

    it('should apply limit to the results', async () => {
        const result = await db.select({ limit: 2 });
        expect(result).toEqual([
            { id: '1', name: 'Alice', age: 25, createdAt: mockData[0].createdAt, updatedAt: mockData[0].createdAt },
            { id: '2', name: 'Bob', age: 30, createdAt: mockData[1].createdAt, updatedAt: mockData[1].createdAt },
        ]);
    });
});
