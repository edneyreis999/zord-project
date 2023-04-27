module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^ts-jest$': '<rootDir>/node_modules/ts-jest',
  },
  roots: ['<rootDir>/src', '<rootDir>/test'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s', '!**/node_modules/**', '!**/dist/**'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/src/.*module\\.ts$'],
  coveragePathIgnorePatterns: [
    '/src/.*module\\.ts$',
    '/src/.*decorator\\.ts$',
    '/src/main.ts',
  ],
  testTimeout: 20000,
  clearMocks: true,
  testEnvironment: 'node',
  preset: 'ts-jest',
};
