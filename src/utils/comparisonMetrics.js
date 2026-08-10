// Shared between ComparisonTable (on-screen) and the Excel export so both
// always agree on which metrics exist and how each value is read.
export const BASE_METRICS = [
  { key: 'totalLogin', label: 'Total Login', decimals: 0, get: (p) => p.totalLogin },
  { key: 'activeUsers', label: 'Active Users', decimals: 0, get: (p) => p.activeUsers },
  { key: 'averageActiveUsersPerDay', label: 'Average Active Users', decimals: 0, get: (p) => p.averageActiveUsersPerDay },
  { key: 'loginAveragePerUser', label: 'Login Average Per User', decimals: 1, get: (p) => p.loginAveragePerUser },
];

export const TRAINING_METRIC = {
  key: 'trainingSessions',
  label: 'Training Sessions Completed',
  decimals: 0,
  get: (p) => p.trainingSessions?.completed,
};

export const ELEARNING_METRIC = {
  key: 'eLearning',
  label: 'E-Learning Completed Users',
  decimals: 0,
  get: (p) => p.eLearning?.completedUsers,
};

export const NEW_LOGINS_METRIC = {
  key: 'newLogins',
  label: 'New Logins',
  decimals: 0,
  get: (p) => p.newLogins,
};

// Training/e-learning/new-logins rows only appear when the current period
// actually carries that data (i.e. the app's API reports it).
export function getComparisonMetrics(currentPeriod) {
  return [
    ...BASE_METRICS,
    ...(currentPeriod?.trainingSessions ? [TRAINING_METRIC] : []),
    ...(currentPeriod?.eLearning ? [ELEARNING_METRIC] : []),
    ...(currentPeriod?.newLogins !== undefined ? [NEW_LOGINS_METRIC] : []),
  ];
}
