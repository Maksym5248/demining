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
        seconds: Math.floor(new Date(date).getTime() / 1000),
        nanoseconds: (new Date(date).getTime() % 1000) * 1e6,
        toDate: () => new Date(date),
        toMillis: () => new Date(date).getTime(),
        isEqual: function (other: { seconds: number; nanoseconds: number }) {
            return (
                other &&
                typeof other.seconds === 'number' &&
                typeof other.nanoseconds === 'number' &&
                this.seconds === other.seconds &&
                this.nanoseconds === other.nanoseconds
            );
        },
    }),
    now: () => {
        const now = new Date();
        return {
            seconds: Math.floor(now.getTime() / 1000),
            nanoseconds: (now.getTime() % 1000) * 1e6,
            toDate: () => now,
            toMillis: () => now.getTime(),
            isEqual: function (other: { seconds: number; nanoseconds: number }) {
                return (
                    other &&
                    typeof other.seconds === 'number' &&
                    typeof other.nanoseconds === 'number' &&
                    this.seconds === other.seconds &&
                    this.nanoseconds === other.nanoseconds
                );
            },
        };
    },
};

export const Timestamp = mockTimestamp;
export const collection = mockFirestore.collection;
export const runTransaction = mockFirestore.runTransaction;
export const batch = mockFirestore.batch;
