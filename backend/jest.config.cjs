// backend/jest.config.cjs
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  transform: {},                     // no Babel needed for ESM
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
};
