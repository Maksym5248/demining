/* eslint-disable import/no-default-export */
const mockDeviceInfo = {
    getUniqueId: jest.fn(() => 'mocked-unique-id'),
    getSystemName: jest.fn(() => 'mocked-system-name'),
    getSystemVersion: jest.fn(() => 'mocked-system-version'),
    getDeviceName: jest.fn(() => Promise.resolve('mocked-device-name')),
    isTablet: jest.fn(() => false),
    hasNotch: jest.fn(() => false),
    getDeviceId: jest.fn(() => 'mocked-device-id'),
    getApiLevel: jest.fn(() => Promise.resolve(30)),
    getBuildNumber: jest.fn(() => 'mocked-build-number'),
    getBundleId: jest.fn(() => 'mocked-bundle-id'),
    getVersion: jest.fn(() => 'mocked-version'),
    getReadableVersion: jest.fn(() => 'mocked-readable-version'),
    getManufacturer: jest.fn(() => Promise.resolve('mocked-manufacturer')),
    getModel: jest.fn(() => 'mocked-model'),
    getBrand: jest.fn(() => 'mocked-brand'),
    getCarrier: jest.fn(() => Promise.resolve('mocked-carrier')),
    getDeviceType: jest.fn(() => 'mocked-device-type'),
};

export default mockDeviceInfo;
