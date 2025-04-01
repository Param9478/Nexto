// src/lib/formatters.ts
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

/**
 * Format time from ISO datetime to a readable 24-hour time format
 */
export function formatTime(input: string | undefined | null): string {
  if (!input) return '--:--';

  try {
    // Parse the input as a UTC time and convert to local time
    const parsedTime = dayjs.utc(input).local();

    // Check if the parsed time is valid
    if (!parsedTime.isValid()) {
      console.warn(`Invalid time format: ${input}`);
      return '--:--';
    }

    // Format the time in 24-hour format
    return parsedTime.format('HH:mm');
  } catch (error) {
    console.error('Error parsing time:', error);
    return '--:--';
  }
}

/**
 * Format date from ISO string to a readable format (Day, DD MMM)
 */
export function formatDate(isoString: string | undefined | null): string {
  if (!isoString) return '--';

  try {
    const date = dayjs.utc(isoString).local();

    if (!date.isValid()) {
      console.warn(`Invalid date format: ${isoString}`);
      return '--';
    }

    return date.format('ddd, DD MMM');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '--';
  }
}

/**
 * Format duration from ISO 8601 duration format (e.g., PT1H30M)
 */
export function formatDuration(
  durationString: string | undefined | null
): string {
  if (!durationString) return '--';

  try {
    // Use dayjs duration parsing
    const duration = dayjs.duration(durationString);

    // Extract hours and minutes
    const hours = duration.hours();
    const minutes = duration.minutes();

    // Format duration string
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    }

    return '--';
  } catch (error) {
    console.error('Error parsing duration:', error);
    return '--';
  }
}

/**
 * Format price with currency
 */
export function formatPrice(amount: string | number, currency: string): string {
  try {
    // Convert to number if it's a string
    const numericAmount =
      typeof amount === 'string' ? parseFloat(amount) : amount;

    // Use Intl.NumberFormat for consistent formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (error) {
    console.error('Error formatting price:', error);
    return `${currency} ${amount}`;
  }
}
