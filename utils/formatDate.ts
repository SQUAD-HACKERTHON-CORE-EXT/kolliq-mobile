import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

/**
 * Format date to readable format
 */
export const formatDate = (date: string | Date, format: string = 'MMM DD, YYYY'): string => {
  return dayjs(date).format(format);
};

/**
 * Get time ago format (e.g., "2 hours ago")
 */
export const getTimeAgo = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

/**
 * Format time for display (e.g., "2:30 PM")
 */
export const formatTime = (date: string | Date): string => {
  return dayjs(date).format('h:mm A');
};

/**
 * Format date and time together
 */
export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format('MMM DD, YYYY h:mm A');
};

/**
 * Get duration between two dates
 */
export const getDuration = (
  startDate: string | Date,
  endDate: string | Date
): {
  days: number;
  hours: number;
  minutes: number;
  text: string;
} => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diff = end.diff(start);
  const dur = dayjs.duration(diff);

  return {
    days: Math.floor(dur.asDays()),
    hours: dur.hours(),
    minutes: dur.minutes(),
    text: dur.humanize(),
  };
};

/**
 * Check if date is today
 */
export const isToday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Check if date is tomorrow
 */
export const isTomorrow = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs().add(1, 'day'), 'day');
};

/**
 * Check if date is yesterday
 */
export const isYesterday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day');
};

/**
 * Get readable date label (Today, Tomorrow, Yesterday, or date)
 */
export const getDateLabel = (date: string | Date): string => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return formatDate(date);
};

/**
 * Calculate days remaining
 */
export const getDaysRemaining = (endDate: string | Date): number => {
  const end = dayjs(endDate);
  const today = dayjs();
  return end.diff(today, 'day');
};

/**
 * Check if date is in the past
 */
export const isPast = (date: string | Date): boolean => {
  return dayjs(date).isBefore(dayjs());
};

/**
 * Check if date is in the future
 */
export const isFuture = (date: string | Date): boolean => {
  return dayjs(date).isAfter(dayjs());
};

/**
 * Add days to a date
 */
export const addDays = (date: string | Date, days: number): string => {
  return dayjs(date).add(days, 'day').toISOString();
};

/**
 * Subtract days from a date
 */
export const subtractDays = (date: string | Date, days: number): string => {
  return dayjs(date).subtract(days, 'day').toISOString();
};
