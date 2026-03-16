export type Score = Array<number | null>;

interface PlayerFormModel {
  name: string;
  score: Score;
}

export interface ScorekeeperFormModel {
  players: PlayerFormModel[];
}
