import type { Config } from "jest";
import nextJest from "next/jest";

// next/jest handles the Next.js-specific transforms (RSC, server actions,
// CSS modules etc.) so we don't have to configure babel or ts-jest manually.
const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // Mirror the @/* path alias from tsconfig so imports resolve in tests.
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/cypress/"],
};

export default createJestConfig(config);
