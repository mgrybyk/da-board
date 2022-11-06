/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  preset: '@shelf/jest-mongodb',
  testMatch: ['<rootDir>/test/**/?(*.)+(spec|test).ts'],
  // allowJs is required for get-port
  transform: { '\\.[jt]s?$': ['ts-jest', { tsconfig: { allowJs: true } }] },
  transformIgnorePatterns: ['node_modules/(?!get-port/.*)'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.[jt]s$': '$1',
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/__fixtures__/'],
  coveragePathIgnorePatterns: ['/__fixtures__/'],
  coverageDirectory: './coverage/',
  collectCoverage: false,
}

module.exports = jestConfig
