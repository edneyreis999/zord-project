module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^ts-jest$': '<rootDir>/node_modules/ts-jest',
  },
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/src/.*module\\.ts$'],
  coveragePathIgnorePatterns: [
    '/src/.*module\\.ts$',
    '/src/.*decorator\\.ts$',
    '/src/main.ts',
  ],
  testTimeout: 20000,
};
