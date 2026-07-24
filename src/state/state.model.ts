type Score = Array<number | null>;

export interface PlayerFormModel {
  name: string;
  score: Score;
}

export interface ScorekeeperFormModel {
  players: PlayerFormModel[];
  notes: string;
}
