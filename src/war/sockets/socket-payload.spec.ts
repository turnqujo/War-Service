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
    badData.forEach((bad: any) => expect(isStreamGameMessage(bad)).toBe(false));
  });
});
