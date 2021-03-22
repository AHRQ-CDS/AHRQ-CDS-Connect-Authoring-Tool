import { format, formatDistanceToNow, parse, parseISO } from 'date-fns';

export function renderDate(dateTime) {
  if (!dateTime) return '';
  return formatDistanceToNow(parseISO(dateTime), { addSuffix: true });
}

export function convertDateForPicker(date) {
  if (!date) return null;
  return parse(date, 'yyyy-MM-dd', new Date());
}

export function convertTimeForPicker(time) {
  if (!time) return null;
  return parse(time, 'HH:mm:ss', new Date());
}

export function convertPickerDateToCQL(date) {
  if (!date) return null;
  return format(date, 'yyyy-MM-dd');
}

export function convertPickerTimeToCQL(time) {
  if (!time) return null;
  return format(time, 'HH:mm:ss');
}
