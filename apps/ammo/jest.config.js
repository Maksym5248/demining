module.exports = {
    preset: 'react-native',
    clearMocks: true,
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    setupFiles: [
      '../../node_modules/react-native/jest/setup.js',
      '../../node_modules/react-native-gesture-handler/jestSetup.js',
      '../../node_modules/react-native-device-info/jest/react-native-device-info-mock.js',
      '../../node_modules/react-native-localize/mock/jest.js',
      '../../node_modules/react-native-safe-area-context/jest/mock.tsx',
      '../../node_modules/@react-native-google-signin/google-signin/jest/build/jest/setup.js',
    ],
    testPathIgnorePatterns: ['/node_modules/'],
    transformIgnorePatterns: [
      'node_modules/(?!(jest-)?@react-native|react-native|@react-navigation|@react-native-community)',
    ],
    moduleNameMapper: {
        '^~/(.*)': '<rootDir>/src/$1',
        'react-dom': 'react-native',
        '\\.svg': '<rootDir>/test/mocks/libs/react-native-svg-transformer',
    },
    testMatch: ['**/__tests__/**', '**/__test__/**'],
};