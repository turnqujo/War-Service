import { CardPool, OwnedCard } from './card-pool';
import { Card } from '../card/card';

describe('The Card Pool', () => {
  it('Should at least exist.', () => {
    const subject = new CardPool();
    expect(subject).toBeTruthy();
  });

  it('Should report its size when asked', () => {
    const subject = new CardPool();
    subject.acceptCard('Some Player', new Card(2, 2));
    subject.acceptCard('Other Player', new Card(4, 3));

    expect(subject.getPoolSize()).toBe(2);
  });

  it('Should empty the pool when asked', () => {
    const subject = new CardPool();
    subject.acceptCard('Some Player', new Card(2, 2));
    subject.acceptCard('Other Player', new Card(4, 3));

    const emptiedPool = subject.emptyPool();
    expect(emptiedPool.length).toBe(2);
    expect(subject.getPoolSize()).toBe(0);
  });

  it('Should be able to find cards using an arbitrary predicate function', () => {
    const subject = new CardPool();
    subject.acceptCard('Some Player', new Card(2, 2));
    subject.acceptCard('Other Player', new Card(4, 3));

    const foundCards = subject.findCards((ownedCard: OwnedCard) => ownedCard.owner === 'Some Player');
    expect(foundCards.length).toBe(1);
    expect(foundCards.pop().owner).toBe('Some Player');
    expect(subject.getPoolSize()).toBe(2);
  });
});
