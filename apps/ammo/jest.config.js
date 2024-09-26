module.exports = {
    preset: 'react-native',
    clearMocks: true,
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    setupFiles: [
      './node_modules/react-native/jest/setup.js',
      './node_modules/react-native-gesture-handler/jestSetup.js',
      '<rootDir>/test/setup.ts',
    ],
    testPathIgnorePatterns: ['/node_modules/'],
    transformIgnorePatterns: [
      'node_modules/(?!(jest-)?@react-native|react-native|@react-navigation|@react-native-community)',
    ],
    moduleNameMapper: {
        '^~/(.*)': '<rootDir>/src/$1',
        'react-dom': 'react-native',
        "\\.svg": "<rootDir>/__mocks__/svgMock.js"
    },
    testMatch: ['**/__tests__/**', '**/__test__/**'],
};