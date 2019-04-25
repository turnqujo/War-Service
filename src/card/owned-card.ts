import { Card } from './card';
import { Player } from '../player/player';

export interface IOwnedCard {
  owner: Player;
  card: Card;
}
