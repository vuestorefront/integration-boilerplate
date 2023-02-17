const baseConfig = require('./../../jest.base.config');

module.exports = {
  ...baseConfig,
  globalSetup: './__tests__/integration/__config__/jest.setup.global.js',
  globalTeardown: './__tests__/integration/__config__/jest.teardown.global.js',
  setupFilesAfterEnv: ['./__tests__/integration/__config__/jest.setup.js']
};
