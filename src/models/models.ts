type Score = Array<number | null>;

interface PlayerFormModel {
  id: string;
  name: string;
  score: Score;
}

export interface ScorekeeperFormModel {
  players: PlayerFormModel[];
}
