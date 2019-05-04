import { validateWarConfiguration, WarOptionValidationError, isWarConfiguration } from './war-options';

describe('War options validation', () => {
  const invalidOptions = [-100, '10', 'asdf', '10asdf', '10a', 10.2, Infinity];

  test('Should validate that an object is exactly a War Options object.', () => {
    const badData = [
      'I am some sort of data which is totally not what is expected - someone is just having fun!',
      {
        suits: 4,
        ranks: 13,
        players: 2,
        seed: 'Hello, websocket!',
        unknownProp: 1234567890
      }
    ];

    badData.forEach((bad: any) => {
      expect(isWarConfiguration(bad)).toBe(false);
    });
  });

  test('Desired suits is validated as expected', () => {
    invalidOptions.forEach((option: any) =>
      expect(validateWarConfiguration(option, 13, 2)).toBe(WarOptionValidationError.invalidSuitCount)
    );
  });

  test('Desired ranks is validated as expected', () => {
    invalidOptions.forEach((option: any) =>
      expect(validateWarConfiguration(4, option, 2)).toBe(WarOptionValidationError.invalidRankCount)
    );
  });

  test('Desired players is validated as expected', () => {
    invalidOptions.forEach((option: any) =>
      expect(validateWarConfiguration(4, 13, option)).toBe(WarOptionValidationError.invalidPlayerCount)
    );
  });

  test('Should return an error when the deck cannot be split evenly between the desired players', () => {
    expect(validateWarConfiguration(4, 13, 3)).toBe(WarOptionValidationError.cannotSplitDeckEvenly);
  });

  test('Should return null when no problems are detected', () => {
    expect(validateWarConfiguration(4, 13, 2)).toBeNull();
  });
});
