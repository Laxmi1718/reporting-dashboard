export const APP_CONFIG = {
  LMS: {
    live: true,
  },
  CRM: { live: false },
  Procurement: { live: false },
  IdeaBank: { live: false },
  HRMS: { live: false },
};

export function isLive(app) {
  return Boolean(APP_CONFIG[app]?.live);
}
