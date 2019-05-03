import { isPositiveWholeNumber } from './validation';

describe('Number Validation', () => {
  test('Should allow positive whole numbers.', () => {
    expect(isPositiveWholeNumber(13)).toBe(true);
  });

  test('Should not allow negative numbers.', () => {
    expect(isPositiveWholeNumber(-100)).toBe(false);
  });

  test('Should not allow strings.', () => {
    expect(isPositiveWholeNumber('asdf' as any)).toBe(false);
  });

  test('Should not allow numbers which are strings.', () => {
    expect(isPositiveWholeNumber('10' as any)).toBe(false);
  });

  test('Should not allow empty strings to pass.', () => {
    expect(isPositiveWholeNumber('' as any)).toBe(false);
  });

  test('Should not allow decimals.', () => {
    expect(isPositiveWholeNumber(10.2)).toBe(false);
  });

  test('Should not allow Infinity.', () => {
    expect(isPositiveWholeNumber(Infinity)).toBe(false);
  });
});
