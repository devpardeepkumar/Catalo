// Dashboard constants and static values
export const DASHBOARD_CONSTANTS = {
  STORE_STATUS: 'Open' as const,
  VACATION_MODE: false,
  DEFAULT_STORE_NAME: 'My Awesome Store',
  DEFAULT_STORE_LOGO: 'https://via.placeholder.com/50',
  ONBOARDING_DELAY: 1000,
} as const;

export const TIME_FILTERS = ['Daily', 'Weekly', 'Monthly', 'Total'] as const;
export const PRODUCT_SUB_FILTERS = ['Most Searched', 'Most Clicked', 'Most Booked'] as const;

export type TimeFilter = typeof TIME_FILTERS[number];
export type ProductSubFilter = typeof PRODUCT_SUB_FILTERS[number];
