import type { Config } from 'jest';

const config: Config = {
    clearMocks: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^~/(.*)': '<rootDir>/src/$1',
        '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/style-mock.ts',
        '/react-i18next$': '<rootDir>/__mocks__/react-i18next.ts',
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./setupTests.ts'],
    testMatch: ['**/__tests__/**', '**/__test__/**'],
};

// eslint-disable-next-line import/no-default-export
export default config;
