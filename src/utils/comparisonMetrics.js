
export const BASE_METRICS = [
  { key: 'totalLogin', label: 'Total Logins', decimals: 0, get: (p) => Number(p.totalLogins ?? p.totalLogin ?? p.total_logins ?? 0) },
  { key: 'activeUsers', label: 'Unique Users', decimals: 0, get: (p) => Number(p.uniqueUsers ?? p.activeUsers ?? p.totalActiveEmployees ?? p.totalUsers ?? 0) },
  { key: 'averageActiveUsersPerDay', label: 'Average Active Users', decimals: 0, get: (p) => Number(p.averageActiveUsersPerDay ?? p.avgActiveUsersPerDay ?? 0) },
  { key: 'loginAveragePerUser', label: 'Login Average Per User', decimals: 1, get: (p) => Number(p.loginAveragePerUser ?? p.loginAverage ?? p.avgLoginsPerUser ?? 0) },
];

export const EMPLOYEE_METRICS = [
  { key: 'totalEmployees', label: 'Total Employees', decimals: 0, get: (p) => Number(p.totalEmployees ?? 0) },
  { key: 'totalActiveEmployees', label: 'Active Employees', decimals: 0, get: (p) => Number(p.totalActiveEmployees ?? 0) },
  { key: 'totalInactiveEmployees', label: 'Inactive Employees', decimals: 0, get: (p) => Number(p.totalInactiveEmployees ?? 0) },
];

export const CALL_METRICS = [
  { key: 'totalCalls', label: 'Total Calls', decimals: 0, get: (p) => Number(p.totalCalls ?? 0) },
  { key: 'totalIncomingCalls', label: 'Total Incoming Calls', decimals: 0, get: (p) => Number(p.totalIncomingCalls ?? 0) },
  { key: 'totalOutgoingCalls', label: 'Total Outgoing Calls', decimals: 0, get: (p) => Number(p.totalOutgoingCalls ?? 0) },
  { key: 'connectedCalls', label: 'Connected Calls', decimals: 0, get: (p) => Number(p.connectedCalls ?? 0) },
  { key: 'missedCalls', label: 'Missed Calls', decimals: 0, get: (p) => Number(p.missedCalls ?? 0) },
  { key: 'connectedIncomingCalls', label: 'Connected Incoming Calls', decimals: 0, get: (p) => Number(p.connectedIncomingCalls ?? 0) },
  { key: 'missedIncomingCalls', label: 'Missed Incoming Calls', decimals: 0, get: (p) => Number(p.missedIncomingCalls ?? 0) },
  { key: 'connectedOutgoingCalls', label: 'Connected Outgoing Calls', decimals: 0, get: (p) => Number(p.connectedOutgoingCalls ?? 0) },
  { key: 'missedOutgoingCalls', label: 'Missed Outgoing Calls', decimals: 0, get: (p) => Number(p.missedOutgoingCalls ?? 0) },
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


export function getComparisonMetrics(currentPeriod) {
  return [
    ...BASE_METRICS,
    ...(currentPeriod?.totalEmployees != null ? EMPLOYEE_METRICS : []),
    ...(currentPeriod?.totalCalls != null ? CALL_METRICS : []),
    ...(currentPeriod?.trainingSessions ? [TRAINING_METRIC] : []),
    ...(currentPeriod?.eLearning ? [ELEARNING_METRIC] : []),
    ...(currentPeriod?.newLogins !== undefined ? [NEW_LOGINS_METRIC] : []),
  ];
}
