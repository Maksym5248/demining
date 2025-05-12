import type { Config } from 'jest';

const config: Config = {
    clearMocks: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^~/(.*)': '<rootDir>/src/$1',
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./setupTests.ts'],
    testMatch: ['**/__tests__/**', '**/__test__/**'],
    transformIgnorePatterns: [
        'node_modules/(?!(your-package-name|another-package-to-transform)/)', // Add packages to transform if needed
    ],
};

// eslint-disable-next-line import/no-default-export
export default config;
