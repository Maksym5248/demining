import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  moduleNameMapper: {
    "^~/(.*)": "<rootDir>/src/$1",
  },
  testEnvironment: "node",
  testMatch: ["**/__tests__/**", "**/__test__/**"],
};

// eslint-disable-next-line import/no-default-export
export default config;
