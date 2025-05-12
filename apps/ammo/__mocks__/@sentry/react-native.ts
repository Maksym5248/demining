export const init = jest.fn();
export const captureException = jest.fn();
export const captureMessage = jest.fn();
export const withScope = jest.fn(callback => callback({ setTag: jest.fn(), setUser: jest.fn(), setExtra: jest.fn() }));
export const configureScope = jest.fn(callback => callback({ setTag: jest.fn(), setUser: jest.fn(), setExtra: jest.fn() }));
export const setUser = jest.fn();
export const setTag = jest.fn();
export const setExtra = jest.fn();
