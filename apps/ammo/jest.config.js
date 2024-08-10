module.exports = {
    preset: 'react-native',
    clearMocks: true,
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    testPathIgnorePatterns: ['/node_modules/'],
    transformIgnorePatterns: [
      'node_modules/(?!(jest-)?@react-native|react-native|@react-navigation|@react-native-community)',
    ],
    moduleNameMapper: {
        '^~/(.*)': '<rootDir>/src/$1',
        'react-dom': 'react-native',
    },
    testMatch: ['**/__tests__/**', '**/__test__/**'],
};