import { createRoster } from './roster';
import { Player } from './player';

describe('Create a Roster of Players', () => {
  it('Should create a collection of players', () => {
    const subject = createRoster(2);
    expect(subject.length).toBe(2);
  });

  it('Should give the players unique names', () => {
    const subject = createRoster(4);
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