export const APP_CONFIG = {
  LMS: {
    live: true,
    baseURL: import.meta.env.VITE_LMS_API_BASE_URL || 'https://lms-api.abisaio.com/api/v1',
    apiKey: import.meta.env.VITE_LMS_API_KEY,
  },
  CRM: { live: false },
  Procurement: { live: false },
  IdeaBank: { live: false },
  HRMS: { live: false },
};

export function isLive(app) {
  return Boolean(APP_CONFIG[app]?.live);
}
