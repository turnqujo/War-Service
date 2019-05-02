export interface StreamGameMessage {
  suits: number;
  ranks: number;
  players: number;
  seed?: string;
}

// NOTE: Does not allow for objects with extra properties
export const isStreamGameMessage = (object: any): object is StreamGameMessage =>
  typeof object === 'object' &&
  Object.keys(object).length === 4 &&
  'suits' in object &&
  'ranks' in object &&
  'players' in object;
