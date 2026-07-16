/**
 * Shared chart configuration and utilities
 * Colors follow the "midway lights" wheel in src/styles/variables.css /
 * src/data/constants.ts — ordered for adjacent-slice contrast.
 */

export const CHART_COLORS = [
  '#2CE5C9', // teal
  '#FFC53D', // gold
  '#FF5A6E', // coral
  '#54A8FF', // sky
  '#6EE05C', // green
  '#C77DFF', // grape
  '#FF9440', // tangerine
  '#00D4A0', // mint
  '#FF4D9D', // magenta
  '#9FA8C9', // moonlight slate
];

// Matches --bg-primary; used for pie slice strokes and line-dot rings
export const CHART_BG = '#171126';

export const BAR_RADIUS: [number, number, number, number] = [6, 6, 0, 0];

export const CHART_MARGIN = {
  top: 5,
  right: 20,
  bottom: 5,
  left: 10,
};

export const CHART_MARGIN_WITH_LABELS = {
  top: 5,
  right: 10,
  bottom: 60,
  left: 10,
};

export const CHART_FONT = 'Rubik, "Segoe UI", sans-serif';

export const AXIS_TICK_STYLE = {
  fill: 'rgba(255, 255, 255, 0.55)',
  fontSize: 11,
  fontFamily: CHART_FONT,
};

export const AXIS_LABEL_STYLE = {
  fill: 'rgba(255, 255, 255, 0.65)',
  fontSize: 11,
  fontWeight: 700,
  fontFamily: CHART_FONT,
};

export const GRID_STYLE = {
  strokeDasharray: '2 6',
  stroke: 'rgba(255, 255, 255, 0.07)',
};
