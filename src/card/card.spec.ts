import { Card } from './card';

describe('The War Card', () => {
  it('Should at least exist.', () => {
    const subject = new Card(10, 1);
    expect(subject).toBeTruthy();
  });

  it('Should expose its properties safely.', () => {
    const subject = new Card(4, 5);
    expect(subject.getSuit()).toBe(4);
    expect(subject.getRank()).toBe(5);
  });
});
