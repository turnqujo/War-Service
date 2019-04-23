module.exports = {
  roots: ['<rootDir>/src'],
  transform: { '^.+\\.ts?$': 'ts-jest' },
  testRegex: '(/.*|(\\.|/)(test|spec))\\.spec.ts?$',
  moduleFileExtensions: ['ts', 'js']
};
