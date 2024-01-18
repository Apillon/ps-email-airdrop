import dayjs from 'dayjs';

/**
 * @url https://day.js.org/docs/en/display/format
 */
export function getFormattedDate(ts: number | string, format = 'DD/MM/YY') {
  const date = dayjs(ts);
  if (!date || !date.isValid()) {
    return '';
  }
  return date.format(format);
}

export function dateTimeToDateAndTime(dateTime: string): string {
  if (!dateTime) return '';

  const date = new Date(dateTime);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return date.toLocaleDateString('en-us', options);
}
