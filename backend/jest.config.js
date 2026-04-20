module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: [], // Will add setup files here if needed
};
