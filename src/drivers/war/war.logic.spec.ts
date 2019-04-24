import { Player } from '../../player/player';
import { createDeck, createPlayers, dealCardsToPlayers } from './war.logic';

describe('War Logic', () => {
  it('Should create a deck', () => {
    const subject = createDeck(4, 13);
    expect(subject.deal()).toBeTruthy();
  });

  it('Should create a collection of players', () => {
    const subject = createPlayers(2);
    expect(subject.length).toBe(2);
  });

  it('Should deal cards out to players', () => {
    const deck = createDeck(4, 13);
    const players = createPlayers(2);

    expect(() => dealCardsToPlayers(deck, players, 26)).not.toThrow();

    players.forEach((player: Player) => {
      expect(player.getHandSize()).toBe(26);
    });
  });
});
