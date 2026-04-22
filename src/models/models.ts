type Score = Array<number | null>;

interface PlayerFormModel {
  id: string;
  name: string;
  score: Score;
}

export interface ScorekeeperFormModel {
  players: PlayerFormModel[];
  notes: string;
}

export const actionsPositions = ['top', 'bottom'] as const;
export type ActionsPosition = (typeof actionsPositions)[number];
