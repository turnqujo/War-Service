import { Card } from '../card/card';
import { acceptCard, playCard, Player, acceptCards } from './player';

describe('The player', () => {
  test('Should take ownership of accepted cards if they do not already have an owner.', () => {
    const subject: Player = { name: 'Player A', hand: [] };
    acceptCard({ suit: 1, rank: 1 }, subject);
    expect(subject.hand[0].owner).toBe(subject.name);
  });

  test('Should not take ownership of accepted cards if they already have an owner.', () => {
    const subject: Player = { name: 'Player A', hand: [] };
    acceptCard({ suit: 1, rank: 1, owner: 'Player B' }, subject);
    expect(subject.hand[0].owner).toBe('Player B');
  });

  test('Should accept multiple cards with the same ownership rules applied.', () => {
    const subject: Player = { name: 'Player A', hand: [] };
    const cards = [{ suit: 1, rank: 1, owner: 'Player B' }, { suit: 2, rank: 2 }];

    const expectedOutput = [{ suit: 1, rank: 1, owner: 'Player B' }, { suit: 2, rank: 2, owner: 'Player A' }];
    acceptCards(cards, subject);
    expect(subject.hand).toEqual(expectedOutput);
  });

  test('Should play a card when asked, and mark itself as the last player.', () => {
    const subjectCard = { suit: 1, rank: 1, owner: 'Player A' };
    const subject: Player = { name: 'Player A', hand: [subjectCard] };

    const expectedOutput: Card = { suit: 1, rank: 1, owner: 'Player A', playedBy: 'Player A' };
    expect(playCard(subject)).toEqual(expectedOutput);
  });

  test('Should return null if asked to play a card when they do not have any left.', () => {
    const subject: Player = { name: 'Player A', hand: [] };
    expect(playCard(subject)).toEqual(null);
  });
});
