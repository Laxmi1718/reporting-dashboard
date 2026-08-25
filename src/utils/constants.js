export const APPLICATIONS = ['All', 'LMS', 'CRM', 'MyIB', 'IBREMS', 'Abis Pro'];

export const CRM_MODULES = ['All', 'Parivartan', 'Abis Pro (CRM)', 'Traders CRM', 'Chicks CRM', 'Doctor CRM'];

export const REPORT_TYPES = [
  'Daily',
  'Weekly',
  'Monthly',
  'Quarterly',
  'Half-Yearly',
  'Yearly',
  'Custom Date Range',
];

export const TREND_REPORT_TYPES = ['Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Custom Date Range'];

// Validated reference categorical palette (see dataviz skill / references/palette.md)
export const CHART_COLORS = {
  blue: '#2a78d6',
  orange: '#eb6834',
  aqua: '#1baf7a',
  yellow: '#eda100',
  magenta: '#e87ba4',
  green: '#008300',
  violet: '#4a3aa7',
  red: '#e34948',
  // Lighter 30%-white-blend tints of blue/aqua, re-validated with the dataviz
  // skill's palette checker (lightness band, CVD separation, contrast all pass).
  blueLight: '#6aa1e2',
  aquaLight: '#5fc7a2',
};

export const CATEGORICAL_SERIES = [
  CHART_COLORS.blue,
  CHART_COLORS.orange,
  CHART_COLORS.aqua,
  CHART_COLORS.yellow,
];

export const STATUS_COLORS = {
  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
};

export const COMPARISON_HIGHLIGHT = {
  higher: '#DCFCE7',
  equal: '#DBEAFE',
  lower: '#FEE2E2',
};

export const CHART_INK = {
  primary: '#0b0b0b',
  secondary: '#52514e',
  muted: '#898781',
  grid: '#e1e0d9',
  baseline: '#c3c2b7',
  surface: '#fcfcfb',
};
