import { Deck, DeckErrors } from '../deck/deck';
import { Player } from '../player/player';
import * as commonActions from './common-actions';

describe('Create deck war logic', () => {
  it('Should create a deck', () => {
    const subject = commonActions.createShuffledDeck(4, 13);
    expect(subject.deal()).toBeTruthy();
  });
});

describe('Create a Roster of Players', () => {
  it('Should create a collection of players', () => {
    const subject = commonActions.createRoster(2);
    expect(subject.length).toBe(2);
  });

  it('Should give the players unique names', () => {
    const subject = commonActions.createRoster(4);
    const duplicates = subject
      .map((player: Player) => player.name)
      .reduce((duplicates: string[], current: string, i: number, names: string[]) => {
        if (names.indexOf(current) !== i && duplicates.indexOf(current) === -1) {
          duplicates.push(current);
        }

        return duplicates;
      }, []);

    expect(duplicates.length).toBe(0);
  });
});

describe('Deal cards to players', () => {
  it('Should deal cards out to players', () => {
    const deck = new Deck();
    deck.create(4, 13);
    const roster = [new Player('Player A'), new Player('Player B')];

    expect(() => commonActions.dealCardsToPlayers(deck, roster, 26)).not.toThrow();

    roster.forEach((player: Player) => {
      expect(player.getHandSize()).toBe(26);
    });
  });

  it('Should throw if asked to deal more cards than are available', () => {
    const deck = new Deck();
    deck.create(4, 13);
    const roster = [new Player('Player A'), new Player('Player B')];

    expect(() => commonActions.dealCardsToPlayers(deck, roster, 200)).toThrowError(DeckErrors.noCardsLeft);
  });
});
