import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { generateDashboardReport } from './mockData';
import { APP_CONFIG, isLive } from './appConfig';
import { sumDailyCounts } from '../utils/dailyMetrics';

const mockClient = axios.create({ baseURL: '/api' });
const mock = new MockAdapter(mockClient, { delayResponse: 400 });

mock.onGet('/dashboard/report').reply((config) => {
  const { app, reportType, fromDate, toDate } = config.params ?? {};
  if (!app || !reportType) {
    return [400, { message: 'app and reportType are required query parameters' }];
  }
  return [200, generateDashboardReport({ app, reportType, fromDate, toDate })];
});

function withNewLogins(period) {
  if (!period.dailyNewLogin) return period;
  return { ...period, newLogins: sumDailyCounts(period.dailyNewLogin) };
}

function transformLiveResponse(raw, { app, reportType }) {
  const currentPeriod = withNewLogins(raw.currentPeriod);
  const previousPeriod = withNewLogins(raw.previousPeriod);
  const trend = [
    { label: previousPeriod.reportPeriod, logins: previousPeriod.totalLogin, activeUsers: previousPeriod.activeUsers },
    { label: currentPeriod.reportPeriod, logins: currentPeriod.totalLogin, activeUsers: currentPeriod.activeUsers },
  ];
  return { app, reportType, currentPeriod, previousPeriod, trend };
}

async function fetchLiveReport({ app, reportType, fromDate, toDate }) {
  const { data: raw } = await axios.get('/api/reports/lms', {
    params: {
      startDate: fromDate,
      endDate: toDate,
    },
    timeout: 15000,
  });

  if (!raw.succeeded) {
    throw new Error(raw.message || 'Failed to load report');
  }
  return transformLiveResponse(raw, { app, reportType });
}

async function fetchMockReport({ app, reportType, fromDate, toDate }) {
  const { data } = await mockClient.get('/dashboard/report', {
    params: { app, reportType, fromDate, toDate },
  });
  return data;
}

export async function fetchDashboardReport({ app, reportType, fromDate, toDate }) {
  if (isLive(app)) {
    return fetchLiveReport({ app, reportType, fromDate, toDate });
  }
  return fetchMockReport({ app, reportType, fromDate, toDate });
}
