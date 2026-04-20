const path = require('path');

module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', path.resolve(__dirname)],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/phase1_infrastructure/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/phase1_infrastructure/setupTests.js'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
};
