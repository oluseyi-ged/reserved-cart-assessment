export const IDLE_LOGOUT_TIME_LIMIT = 1 * 60 * 1000;
export const INACTIVITY_CHECK_INTERVAL_MS = 1000;

export function extractSelect(data, keyProperty, valueProperty) {
  return data?.map(item => ({
    key: item[keyProperty]?.toString(),
    value: item[valueProperty],
  }));
}

export function getObjectById(array, id) {
  return array.find(item => item.id === id);
}
export const urlRegex =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

export const dateFilters = [
  {
    id: 1,
    name: 'Custom',
  },
  {
    id: 2,
    name: 'This Week',
  },
  {
    id: 3,
    name: 'This Month',
  },
  {
    id: 4,
    name: 'Last Month',
  },
  {
    id: 5,
    name: 'This Year',
  },
];

export const OTP_TIMEOUT = 67;
