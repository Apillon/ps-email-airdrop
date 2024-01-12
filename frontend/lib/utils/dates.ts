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
