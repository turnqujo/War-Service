import { dealCardsToPlayers, notEnoughCardsError } from './card-actions';
import { createDeck } from './deck';
import { Player } from './player';

describe('Deal cards to players', () => {
  test('Should deal cards out to players', () => {
    const deck = createDeck(4, 13);
    const roster: Player[] = [{ name: 'Player A', hand: [] }, { name: 'Player B', hand: [] }];

    expect(() => dealCardsToPlayers(deck, roster, 26)).not.toThrow();

    roster.forEach((player: Player) => expect(player.hand.length).toBe(26));
  });

  test('Should throw if asked to deal more cards than are available', () => {
    const deck = createDeck(4, 13);
    const roster: Player[] = [{ name: 'Player A', hand: [] }, { name: 'Player B', hand: [] }];

    expect(() => dealCardsToPlayers(deck, roster, 200)).toThrowError(notEnoughCardsError);
  });

  test('Should deal from the top of the deck', () => {
    const deck = createDeck(4, 13);
    const roster: Player[] = [{ name: 'Player A', hand: [] }, { name: 'Player B', hand: [] }];
    expect(() => dealCardsToPlayers(deck, roster, 2)).not.toThrow();

    expect(roster[0].hand[0]).toEqual({ suit: 1, rank: 1, owner: 'Player A' });
  });

  test('Should not deal the same card to multiple players', () => {
    const deck = createDeck(4, 13);
    const roster: Player[] = [{ name: 'Player A', hand: [] }, { name: 'Player B', hand: [] }];
    expect(() => dealCardsToPlayers(deck, roster, 2)).not.toThrow();

    expect(roster[0].hand).not.toEqual(roster[1].hand);
  });
});
