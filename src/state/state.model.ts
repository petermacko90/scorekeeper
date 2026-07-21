type Score = Array<number | null>;

export interface PlayerFormModel {
  id: string;
  name: string;
  score: Score;
}

export interface ScorekeeperFormModel {
  players: PlayerFormModel[];
  notes: string;
}
