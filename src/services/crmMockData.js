const crmMockData = {
  overall: {
    totalUsers: 5240,
    activeUsers: 3850,
    totalLogins: 12450,
    averageUsage: 2100,
  },
  modules: [
    {
      id: 1,
      name: 'Parivartan',
      totalUsers: 2100,
      activeUsers: 1650,
      totalLogins: 5200,
    },
    {
      id: 2,
      name: 'DR.CRM',
      totalUsers: 1450,
      activeUsers: 1100,
      totalLogins: 3800,
    },
    {
      id: 3,
      name: 'Chicks CRM',
      totalUsers: 900,
      activeUsers: 720,
      totalLogins: 2100,
    },
    {
      id: 4,
      name: 'Other',
      totalUsers: 790,
      activeUsers: 380,
      totalLogins: 1350,
    },
  ],
};

function formatReportPeriod(fromDate, toDate) {
  if (!fromDate || !toDate) return 'CRM Report';
  return `${fromDate} - ${toDate}`;
}

function toPercentage(activeUsers, totalUsers) {
  if (!totalUsers) return 0;
  return Number(((activeUsers / totalUsers) * 100).toFixed(1));
}

function makeTrend(labelPrefix, start, step, loginBase, activeBase) {
  return Array.from({ length: 6 }, (_, index) => ({
    label: `${labelPrefix} ${index + 1}`,
    logins: loginBase + (index + 1) * step,
    activeUsers: activeBase + (index + 1) * Math.round(step * 0.7),
  }));
}

function buildModuleDetails() {
  return {
    1: {
      summary: {
        totalUsers: 2100,
        activeUsers: 1650,
        totalLogins: 5200,
        averageUsage: 2140,
      },
      trend: makeTrend('W', 1, 160, 640, 260),
      dailyUsage: [
        { label: 'Mon', usage: 420 },
        { label: 'Tue', usage: 490 },
        { label: 'Wed', usage: 470 },
        { label: 'Thu', usage: 560 },
        { label: 'Fri', usage: 610 },
        { label: 'Sat', usage: 540 },
        { label: 'Sun', usage: 520 },
      ],
      monthlyUsage: [
        { label: 'Jan', usage: 1800 },
        { label: 'Feb', usage: 1950 },
        { label: 'Mar', usage: 2100 },
        { label: 'Apr', usage: 2480 },
        { label: 'May', usage: 2650 },
        { label: 'Jun', usage: 2800 },
      ],
    },
    2: {
      summary: {
        totalUsers: 1450,
        activeUsers: 1100,
        totalLogins: 3800,
        averageUsage: 1760,
      },
      trend: makeTrend('W', 2, 120, 460, 220),
      dailyUsage: [
        { label: 'Mon', usage: 330 },
        { label: 'Tue', usage: 360 },
        { label: 'Wed', usage: 390 },
        { label: 'Thu', usage: 410 },
        { label: 'Fri', usage: 440 },
        { label: 'Sat', usage: 430 },
        { label: 'Sun', usage: 410 },
      ],
      monthlyUsage: [
        { label: 'Jan', usage: 1500 },
        { label: 'Feb', usage: 1660 },
        { label: 'Mar', usage: 1750 },
        { label: 'Apr', usage: 1840 },
        { label: 'May', usage: 1910 },
        { label: 'Jun', usage: 2010 },
      ],
    },
    3: {
      summary: {
        totalUsers: 900,
        activeUsers: 720,
        totalLogins: 2100,
        averageUsage: 1230,
      },
      trend: makeTrend('W', 3, 80, 260, 110),
      dailyUsage: [
        { label: 'Mon', usage: 220 },
        { label: 'Tue', usage: 240 },
        { label: 'Wed', usage: 260 },
        { label: 'Thu', usage: 270 },
        { label: 'Fri', usage: 300 },
        { label: 'Sat', usage: 290 },
        { label: 'Sun', usage: 280 },
      ],
      monthlyUsage: [
        { label: 'Jan', usage: 980 },
        { label: 'Feb', usage: 1020 },
        { label: 'Mar', usage: 1150 },
        { label: 'Apr', usage: 1190 },
        { label: 'May', usage: 1270 },
        { label: 'Jun', usage: 1340 },
      ],
    },
    4: {
      summary: {
        totalUsers: 790,
        activeUsers: 380,
        totalLogins: 1350,
        averageUsage: 680,
      },
      trend: makeTrend('W', 4, 50, 170, 60),
      dailyUsage: [
        { label: 'Mon', usage: 100 },
        { label: 'Tue', usage: 120 },
        { label: 'Wed', usage: 130 },
        { label: 'Thu', usage: 140 },
        { label: 'Fri', usage: 150 },
        { label: 'Sat', usage: 145 },
        { label: 'Sun', usage: 130 },
      ],
      monthlyUsage: [
        { label: 'Jan', usage: 520 },
        { label: 'Feb', usage: 560 },
        { label: 'Mar', usage: 610 },
        { label: 'Apr', usage: 640 },
        { label: 'May', usage: 700 },
        { label: 'Jun', usage: 760 },
      ],
    },
  };
}

export function generateCRMReport({ app, reportType, fromDate, toDate }) {
  const overall = { ...crmMockData.overall };
  const modules = crmMockData.modules.map((module) => ({
    ...module,
    activeUserPercentage: toPercentage(module.activeUsers, module.totalUsers),
  }));

  const trend = [
    { label: 'Jan', logins: 1800, activeUsers: 1200 },
    { label: 'Feb', logins: 2100, activeUsers: 1380 },
    { label: 'Mar', logins: 2250, activeUsers: 1460 },
    { label: 'Apr', logins: 2600, activeUsers: 1710 },
    { label: 'May', logins: 2920, activeUsers: 1940 },
    { label: 'Jun', logins: 3200, activeUsers: 2180 },
  ];

  const moduleDetails = buildModuleDetails();

  return {
    app,
    reportType,
    currentPeriod: {
      reportPeriod: formatReportPeriod(fromDate, toDate),
      lastLogin: '2026-07-28',
      totalLogin: overall.totalLogins,
      activeUsers: overall.activeUsers,
      averageActiveUsersPerDay: Math.round(overall.averageUsage / 10),
      loginAveragePerUser: Number((overall.totalLogins / overall.activeUsers).toFixed(2)),
      totalUsers: overall.totalUsers,
      averageUsage: overall.averageUsage,
    },
    previousPeriod: {
      reportPeriod: 'Previous CRM Period',
      lastLogin: '2026-07-21',
      totalLogin: 10880,
      activeUsers: 3310,
      averageActiveUsersPerDay: 940,
      loginAveragePerUser: 3.29,
    },
    trend,
    crm: {
      overall,
      modules,
      moduleDetails,
      dailyTrend: trend,
    },
  };
}
