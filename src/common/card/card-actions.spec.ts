import { Deck, DeckErrors } from '../deck/deck';
import { Player } from '../player/player';
import { Card } from './card';
import { dealCardsToPlayers, giveCardsToPlayer } from './card-actions';

describe('Deal cards to players', () => {
  test('Should deal cards out to players', () => {
    const deck = new Deck();
    deck.create(4, 13);
    const roster = [new Player('Player A'), new Player('Player B')];

    expect(() => dealCardsToPlayers(deck, roster, 26)).not.toThrow();

    roster.forEach((player: Player) => {
      expect(player.getHand().length).toBe(26);
    });
  });

  test('Should throw if asked to deal more cards than are available', () => {
    const deck = new Deck();
    deck.create(4, 13);
    const roster = [new Player('Player A'), new Player('Player B')];

    expect(() => dealCardsToPlayers(deck, roster, 200)).toThrowError(DeckErrors.noCardsLeft);
  });
});

describe('Giving cards to a player', () => {
  test('Should give cards to a player without altering ownership', () => {
    const subject = new Player('I won!');
    const prizes: Card[] = [
      { owner: 'Other Player', suit: 1, rank: 1 },
      { owner: 'Someone Else', suit: 1, rank: 1 },
      { owner: subject.name, suit: 1, rank: 1 }
    ];

    giveCardsToPlayer(prizes, subject);

    prizes.forEach((prize: Card) => {
      const playedCard: Card = { ...prize, playedBy: subject.name };
      expect(subject.playCard()).toEqual(playedCard);
    });
  });
});