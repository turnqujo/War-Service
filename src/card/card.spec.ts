import { Card } from './card';

describe('The War Card', () => {
  it('Should at least exist.', () => {
    const subject = new Card(10, 1);
    expect(subject).toBeTruthy();
  });

  it('Should calculate, store, and return its value.', () => {
    const subject = new Card(4, 5);
    expect(subject.getValue()).toBe(20);
  });
});
