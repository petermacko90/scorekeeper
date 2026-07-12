const TOP = 'top';
const BOTTOM = 'bottom';
const LEFT = 'left';
const RIGHT = 'right';
export const actionsPositions = [TOP, BOTTOM, LEFT, RIGHT];
export type ActionsPosition = typeof TOP | typeof BOTTOM | typeof LEFT | typeof RIGHT;

const SYSTEM = 'system';
const DARK = 'dark';
const LIGHT = 'light';
export const themes = [SYSTEM, DARK, LIGHT];
export type Theme = typeof SYSTEM | typeof DARK | typeof LIGHT;

export type SettingsData = {
  theme: Theme;
  actionsPosition: ActionsPosition;
};
