const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom', // This will be overridden by next/jest for client tests
  testMatch: [
    '<rootDir>/components/**/*.test.tsx', 
    '<rootDir>/app/**/*.test.ts',
    '<rootDir>/e2e/**/*.spec.ts'
  ], // Include client, server, and e2e tests
  transform: {
    '^.+\.(ts|tsx)$': 'babel-jest',
  },
};

// createJestConfig is  a function that returns a promise and takes a Jest config object.
// So the code below is actually creating a Jest config object.
module.exports = createJestConfig(customJestConfig);
