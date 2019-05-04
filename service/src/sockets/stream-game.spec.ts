import { GameRecord } from '../record';
import { isGameRecord, isTurnRecord } from '../validation/record';
import { WarConfiguration } from '../validation/war-options';
import { StreamedTurnRecord, streamGame } from './stream-game';

describe('Streaming a game through a websocket.', () => {
  test('Should return an error if given invalid options.', () => {
    let response: { error: string } = null;
    const mockSend = { send: jest.fn((data: string) => (response = JSON.parse(data))) };

    const badData = [
      {
        suits: 'Invalid input!' as any,
        ranks: 13,
        players: 2,
        seed: 'Hello, websocket!'
      },
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
      streamGame(mockSend, bad);
      expect(mockSend.send).toBeCalled();
      expect(typeof response.error).toBe('string');
    });
  });

  test('Should create and stream an entire game.', () => {
    const results: (GameRecord | StreamedTurnRecord)[] = [];
    const mockSend = {
      send: jest.fn((data: string) => results.push(JSON.parse(data) as GameRecord | StreamedTurnRecord))
    };

    const data: WarConfiguration = {
      suits: 4,
      ranks: 13,
      players: 2,
      seed: 'Hello, websocket!'
    };

    streamGame(mockSend, data);
    expect(mockSend.send).toBeCalled();
    expect(isGameRecord(results.shift())).toBe(true);
    expect(results.every((streamedRecord: StreamedTurnRecord) => isTurnRecord(streamedRecord.thisTurn))).toBe(true);
  });
});
