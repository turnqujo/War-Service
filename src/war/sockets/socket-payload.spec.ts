import { isStreamGameMessage } from './socket-payload';

describe('Stream Game Message Type Guard', () => {
  test('Should return true if the object is a valid stream game message.', () => {
    const subject: any = {
      suits: 4,
      ranks: 13,
      players: 2,
      seed: 'Some random seed'
    };
    expect(isStreamGameMessage(subject)).toBe(true);
  });

  test('Should return false if the object is not a valid stream game message.', () => {
    const subject: any = { foo: 7, bar: 'asdf' };
    expect(isStreamGameMessage(subject)).toBe(false);
  });
});
