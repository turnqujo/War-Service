import { Card } from '../../../models/card';
import { Player } from '../../../player/player';

export interface WarOutcome {
  winner: Player;
  spoils: Card[];
}
