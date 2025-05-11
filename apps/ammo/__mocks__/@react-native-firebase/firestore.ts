const mockCollection = () => ({
    doc: () => ({
        set: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        onSnapshot: jest.fn(),
    }),
    add: jest.fn(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: jest.fn(),
    onSnapshot: jest.fn(),
});

const mockFirestore = {
    collection: mockCollection,
    runTransaction: jest.fn(async callback => {
        await callback({
            get: async () => ({
                exists: false,
                data: () => undefined,
            }),
            set: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        });
    }),
    batch: jest.fn(() => ({
        set: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        commit: jest.fn(),
    })),
};

const mockTimestamp = {
    fromDate: (date: Date) => ({
        seconds: Math.floor(date.getTime() / 1000),
        nanoseconds: (date.getTime() % 1000) * 1e6,
        toDate: () => date,
    }),
    now: () => ({
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: (Date.now() % 1000) * 1e6,
        toDate: () => new Date(),
    }),
};

export const Timestamp = mockTimestamp;
export const collection = mockFirestore.collection;
export const runTransaction = mockFirestore.runTransaction;
export const batch = mockFirestore.batch;
