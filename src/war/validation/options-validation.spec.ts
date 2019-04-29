import { validateWarOptions, WarOptionValidationError } from "./options-validation";

describe('War options validation', () => {
  const invalidOptions = [-100, '10', 'asdf', '10asdf', '10a', 10.2, Infinity];

  test('Desired suits is validated as expected', () => {
    invalidOptions.forEach((option: any) =>
      expect(validateWarOptions(option, 13, 2)).toBe(WarOptionValidationError.invalidSuitCount));
  });

  test('Desired ranks is validated as expected', () => {
    invalidOptions.forEach((option: any) =>
      expect(validateWarOptions(4, option, 2)).toBe(WarOptionValidationError.invalidRankCount));
  });

  test('Desired players is validated as expected', () => {
    invalidOptions.forEach((option: any) =>
      expect(validateWarOptions(4, 13, option)).toBe(WarOptionValidationError.invalidPlayerCount));
  });

  test('Should return an error when the deck cannot be split evenly between the desired players', () => {
    expect(validateWarOptions(4, 13, 3)).toBe(WarOptionValidationError.cannotSplitDeckEvenly);
  });

  test('Should return null when no problems are detected', () => {
    expect(validateWarOptions(4, 13, 2)).toBeNull();
  });
});