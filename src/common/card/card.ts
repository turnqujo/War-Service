export interface Card {
  readonly suit: number;
  readonly rank: number;

  /**
   * 'Owner' refers to the player who originally brought the card.
   * If owner is undefined, no player owns the card yet.
   */
  readonly owner?: string;

  // 'Played By' refers to the last player to play the card.
  readonly playedBy?: string;
}
