const mockReference = () => ({
    putFile: jest.fn(() => Promise.resolve({ state: 'success' })),
    getDownloadURL: jest.fn(() => Promise.resolve('mocked-download-url')),
    delete: jest.fn(() => Promise.resolve()),
});

const mockStorage = {
    ref: jest.fn(() => mockReference()),
    refFromURL: jest.fn(() => mockReference()),
};

export const storage = jest.fn(() => mockStorage);
export const ref = mockStorage.ref;
export const refFromURL = mockStorage.refFromURL;
