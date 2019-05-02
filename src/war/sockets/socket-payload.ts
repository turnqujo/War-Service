export interface StreamGameMessage {
  suits: number;
  ranks: number;
  players: number;
  seed?: string;
}

export const isStreamGameMessage = (object: any): object is StreamGameMessage =>
  'suits' in object && 'ranks' in object && 'players' in object;
