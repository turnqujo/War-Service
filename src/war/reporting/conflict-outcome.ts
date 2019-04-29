import { Card } from '../../common/card/card';

// export enum ConflictType {
//   skirmish,
//   battle,
//   war
// }

export interface ConflictOutcome {
  // type: ConflictType;
  winner: string;
  spoils: Card[];
}
