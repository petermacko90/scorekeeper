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

export const actionsPositions = ['top', 'bottom', 'left', 'right'] as const;
export type ActionsPosition = (typeof actionsPositions)[number];

export const themes = ['system', 'dark', 'light'] as const;
export type Theme = (typeof themes)[number];
